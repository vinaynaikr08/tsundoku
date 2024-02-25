const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { AppwriteException, Query } from "appwrite";

import { client } from "@/app/appwrite";
import { construct_development_api_response } from "../dev_api_response";
import { bookStatusPermissions, createBookStatus } from "./common";
import { BOOK_COL_ID, BOOK_STAT_COL_ID, MAIN_DB_ID } from "@/app/Constants";

const database = new sdk.Databases(client);
const users = new sdk.Users(client);

async function checkBookExists(book_id: string): Promise<boolean> {
  try {
    await database.getDocument(MAIN_DB_ID, BOOK_COL_ID, book_id);
    return true;
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error as AppwriteException).type === "document_not_found"
    ) {
      return false;
    }
    throw error;
  }
}

async function checkUserExists(user_id: string): Promise<boolean> {
  try {
    await users.get(user_id);
    return true;
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error as AppwriteException).type === "user_not_found"
    ) {
      return false;
    }
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json(
      { message: `Parameters not supplied.` },
      { status: 400 },
    );
  }

  let db_query = await database.listDocuments(MAIN_DB_ID, BOOK_STAT_COL_ID, [
    Query.equal("user_id", user_id as string),
  ]);

  return construct_development_api_response({
    message: `Book status results for: ${user_id}`,
    response_name: "results",
    response_data: db_query,
  });
}

export async function POST(request: NextRequest) {
  let user_id, book_id, status;
  try {
    const data = await request.json();
    user_id = data.user_id;
    book_id = data.book_id;
    status = data.status;
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!user_id || !book_id || !status) {
    return construct_development_api_response({
      message: `Required parameters not supplied.`,
      status_code: 400,
    });
  }

  if (!(await checkUserExists(user_id))) {
    return construct_development_api_response({
      message: `The specified user does not exist!`,
      status_code: 400,
    });
  }

  if (!(await checkBookExists(book_id))) {
    return construct_development_api_response({
      message: `The specified book does not exist!`,
      status_code: 400,
    });
  }

  const db_query = await database.listDocuments(MAIN_DB_ID, BOOK_STAT_COL_ID, [
    Query.equal("user_id", user_id),
    Query.equal("book_id", book_id),
  ]);

  if (db_query.total == 0) {
    // Create new object
    createBookStatus({ database, user_id, book_id, status });
  } else {
    const book_status_id = db_query.documents[0].$id;

    await database.updateDocument(
      MAIN_DB_ID,
      BOOK_STAT_COL_ID,
      book_status_id,
      {
        status: status,
      },
      bookStatusPermissions,
    );
  }

  return construct_development_api_response({
    message: `The book status item was updated.`,
  });
}
