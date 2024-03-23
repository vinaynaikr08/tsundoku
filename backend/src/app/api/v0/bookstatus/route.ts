const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../dev_api_response";
import { createBookStatus } from "./common";
import {
  checkUserToken,
  getUserContextDBAccount,
  getUserID,
} from "../userContext";
import Constants from "@/app/Constants";
import userPermissions from "../userPermissions";
import { checkBookExists } from "@/app/api/v0/books/Books";
import { getOrFailAuthTokens } from "../helpers";

const database = new sdk.Databases(client);

export async function GET() {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const tokenCheck = await checkUserToken(authToken);
  if (tokenCheck instanceof NextResponse) return tokenCheck;

  const { userDB, userAccount } = getUserContextDBAccount(authToken);

  let db_query;
  try {
    db_query = await userDB.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.BOOK_STAT_COL_ID,
    );
  } catch (error: any) {
    return handle_error(error);
  }

  let user_id;
  try {
    user_id = await getUserID(userAccount);
  } catch (error: any) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `Book status results for: ${user_id}`,
    response_name: "results",
    response_data: db_query,
  });
}

export async function POST(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const tokenCheck = await checkUserToken(authToken);
  if (tokenCheck instanceof NextResponse) return tokenCheck;

  const { userAccount } = getUserContextDBAccount(authToken);

  let book_id, status;
  try {
    const data = await request.json();
    book_id = data.book_id;
    status = data.status;
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!book_id || !status) {
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

  let user_id;
  try {
    user_id = await getUserID(userAccount);
  } catch (error: any) {
    return handle_error(error);
  }

  let db_query;
  try {
    db_query = await database.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.BOOK_STAT_COL_ID,
      [Query.equal("user_id", user_id), Query.equal("book", book_id)],
    );
  } catch (error: any) {
    return handle_error(error);
  }

  if (db_query.total == 0) {
    // Create new object
    try {
      createBookStatus({ database, user_id, book: book_id, status });
    } catch (error: any) {
      handle_error(error);
    }
  } else {
    const book_status_id = db_query.documents[0].$id;

    try {
      await database.updateDocument(
        Constants.MAIN_DB_ID,
        Constants.BOOK_STAT_COL_ID,
        book_status_id,
        {
          status: status,
        },
        userPermissions(user_id),
      );
    } catch (error: any) {
      return handle_error(error);
    }
  }

  return construct_development_api_response({
    message: `The book status item was updated.`,
  });
}
