const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../dev_api_response";
import { createReview } from "./common";
import { checkUserToken, getUserContextDBAccount } from "../userContext";
import Constants from "@/app/Constants";
import userPermissions from "../userPermissions";
import { checkBookExists } from "@/app/api/v0/books/Books";
import { getOrFailAuthTokens } from "../helpers";

const database = new sdk.Databases(client);

export async function GET() {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  const { userDB } = getUserContextDBAccount(authToken);

  let db_query;
  try {
    db_query = await userDB.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.REVIEW_COL_ID,
    );
  } catch (error: any) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `Review results for: ${user_id}`,
    response_name: "results",
    response_data: db_query,
  });
}

export async function POST(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  let book_id, star_rating, description;
  try {
    const data = await request.json();
    book_id = data.book_id;
    star_rating = data.star_rating;

    try {
      description = data.description;
    } catch (error) {
      // Description is optional
    }
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!book_id || !star_rating) {
    return construct_development_api_response({
      message: `Required parameters not supplied.`,
      status_code: 400,
    });
  }

  if (!(await checkBookExists(book_id))) {
    return construct_development_api_response({
      message: `The specified book does not exist!`,
      status_code: 400,
    });
  }

  let db_query: any;
  try {
    db_query = await database.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.REVIEW_COL_ID,
      [Query.equal("user_id", user_id), Query.equal("book", book_id)],
    );
  } catch (error: any) {
    return handle_error(error);
  }

  if (db_query.total == 0) {
    // Create new object
    createReview({
      database,
      user_id,
      book: book_id,
      star_rating,
      description,
    });
  } else {
    const review_id = db_query.documents[0].$id;

    try {
      await database.updateDocument(
        Constants.MAIN_DB_ID,
        Constants.REVIEW_COL_ID,
        review_id,
        {
          star_rating: star_rating,
          description: description,
        },
        userPermissions(user_id),
      );
    } catch (error) {
      return handle_error(error);
    }
  }

  return construct_development_api_response({
    message: `The book review item was updated.`,
  });
}
