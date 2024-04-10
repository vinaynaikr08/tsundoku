const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";

import Constants from "@/app/Constants";
import { client } from "@/app/appwrite";
import { Query } from "node-appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../../../dev_api_response";
import { getOrFailAuthTokens } from "../../../helpers";
import { checkUserToken, getUserContextDBAccount } from "../../../userContext";
import { createReviewVote } from "./common";
import { checkReviewExists } from "../../Reviews";

const database = new sdk.Databases(client);

export async function GET(
  _request: NextRequest,
  { params }: { params: { review_id: string } },
) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  const { userDB } = getUserContextDBAccount(authToken);

  const review_id = params.review_id;

  if (!checkReviewExists(review_id)) {
    return construct_development_api_response({
      message: `The specified review does not exist!`,
      status_code: 400,
    });
  }

  let db_query: any;
  try {
    db_query = await database.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.REVIEW_VOTES_COL_ID,
      [Query.equal("user_id", user_id), Query.equal("review_id", review_id)],
    );
  } catch (error) {
    return handle_error(error);
  }

  if (db_query.total == 0) {
    return construct_development_api_response({
      message: "The specified review ID does not have a vote cast.",
      status_code: 404,
    });
  } else {
    let upvotes = 0;
    let downvotes = 0;
    let user_voted = null;

    for (const doc of db_query.documents) {
      if (doc.user_id === user_id) {
        user_voted = doc.vote;
      }

      if (doc.vote === "UPVOTE") {
        upvotes++;
      } else if (doc.vote === "DOWNVOTE") {
        downvotes++;
      }
    }

    return construct_development_api_response({
      message: `Review vote results for: ${review_id}`,
      response_name: "results",
      response_data: {
        upvotes,
        downvotes,
        user_voted
      },
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { review_id: string } },
) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  const { userDB } = getUserContextDBAccount(authToken);

  const data = await request.json();
  const review_id = params.review_id;

  const vote = data.vote;

  if (!vote) {
    return NextResponse.json(
      { message: "The required vote parameter was not supplied." },
      { status: 400 },
    );
  }

  if (!checkReviewExists(review_id)) {
    return construct_development_api_response({
      message: `The specified review does not exist!`,
      status_code: 400,
    });
  }

  let db_query: any;
  try {
    db_query = await userDB.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.REVIEW_VOTES_COL_ID,
      [Query.equal("user_id", user_id), Query.equal("review_id", review_id)],
    );
  } catch (error) {
    return handle_error(error);
  }

  if (db_query.total == 0) {
    createReviewVote({ user_id, review_id, vote, database });
  } else {
    try {
      await userDB.updateDocument(
        Constants.MAIN_DB_ID,
        Constants.REVIEW_VOTES_COL_ID,
        db_query.documents[0].$id,
        {
          vote,
        },
      );
    } catch (error) {
      handle_error(error);
    }
  }

  return construct_development_api_response({
    message: `The review vote cast was updated.`,
  });
}
