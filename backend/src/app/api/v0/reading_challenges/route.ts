const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";

import { client } from "@/app/appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../dev_api_response";
import { createReadingChallenge } from "./common";
import { checkUserToken, getUserContextDBAccount } from "../userContext";
import Constants from "@/app/Constants";
import { getOrFailAuthTokens } from "../helpers";

const database = new sdk.Databases(client);

export async function GET(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  const { userDB } = getUserContextDBAccount(authToken);

  let db_query;
  try {
    db_query = await userDB.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.READING_CHALLENGE_COL_ID,
    );
  } catch (error: any) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `Reading challenge results for: ${user_id}`,
    response_name: "results",
    response_data: db_query,
  });
}

export async function POST(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  let name, book_count, start, end;
  try {
    const data = await request.json();
    name = data.name;
    book_count = Number(data.book_count);
    start = data.start;
    end = data.end;
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!name || !book_count || !start || !end) {
    return construct_development_api_response({
      message: `Required parameters not supplied.`,
      status_code: 400,
    });
  }

  try {
    // Create new object
    const reading_challenge_id = await createReadingChallenge({
      database,
      user_id,
      name,
      book_count,
      start,
      end,
    });

    return construct_development_api_response({
      message: `The reading challenge was created.`,
      response_name: "results",
      response_data: {
        reading_challenge_id,
      },
    });
  } catch (error) {
    return handle_error(error);
  }
}
