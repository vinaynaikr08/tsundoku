const sdk = require("node-appwrite");

import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { AppwriteException, Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import { construct_development_api_response } from "../dev_api_response";
import { createBookStatus } from "./common";
import { getUserContextDBAccount } from "../userContext";
import { BOOK_COL_ID, BOOK_STAT_COL_ID, MAIN_DB_ID } from "@/app/Constants";
import userPermissions from "../userPermissions";
import { appwriteUnavailableResponse } from "../common_responses";

const database = new sdk.Databases(client);

async function checkBookExists(book_id: string): Promise<boolean> {
  try {
    await database.getDocument(MAIN_DB_ID, BOOK_COL_ID, book_id);
    return true;
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error as AppwriteException).message === "document_not_found"
    ) {
      return false;
    } else {
      throw error;
    }
  }
}

export async function GET(request: NextRequest) {
  const authToken = (headers().get("authorization") || "")
    .split("Bearer ")
    .at(1);

  if (!authToken) {
    return construct_development_api_response({
      message: "Authentication token is missing.",
      status_code: 401,
    });
  }

  const { userDB, userAccount } = getUserContextDBAccount(authToken);
  let db_query;
  try {
    db_query = await userDB.listDocuments(MAIN_DB_ID, BOOK_STAT_COL_ID);
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error as AppwriteException).message === "user_jwt_invalid"
    ) {
      return construct_development_api_response({
        message: "Authentication failed.",
        status_code: 401,
      });
    } else {
      console.log(error);
      return construct_development_api_response({
        message: "Unknown error. Please contact the developers.",
        status_code: 500,
      });
    }
  }

  let user_id: any;
  userAccount
    .get()
    .then((res: any) => {
      user_id = res.$id;
    })
    .catch((error: any) => {
      return appwriteUnavailableResponse();
    });

  return construct_development_api_response({
    message: `Book status results for: ${user_id}`,
    response_name: "results",
    response_data: db_query,
  });
}

export async function POST(request: NextRequest) {
  const authToken = (headers().get("authorization") || "")
    .split("Bearer ")
    .at(1);

  if (!authToken) {
    return construct_development_api_response({
      message: "Authentication token is missing.",
      status_code: 401,
    });
  }

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

  const user_id = (await userAccount.get()).$id;

  const db_query = await database.listDocuments(MAIN_DB_ID, BOOK_STAT_COL_ID, [
    Query.equal("user_id", user_id),
    Query.equal("book", book_id),
  ]);

  if (db_query.total == 0) {
    // Create new object
    try {
      createBookStatus({ database, user_id, book: book_id, status });
    } catch (error: any) {
      if (
        error instanceof Error &&
        (error as AppwriteException).code! / 100 === 4
      ) {
        return construct_development_api_response({
          message: (error as AppwriteException).message,
          status_code: (error as AppwriteException).code!,
        });
      }
      console.log(error);
      return construct_development_api_response({
        message: "Unknown error. Please contact the developers.",
        status_code: 500,
      });
    }
  } else {
    const book_status_id = db_query.documents[0].$id;

    await database.updateDocument(
      MAIN_DB_ID,
      BOOK_STAT_COL_ID,
      book_status_id,
      {
        status: status,
      },
      userPermissions(user_id),
    );
  }

  return construct_development_api_response({
    message: `The book status item was updated.`,
  });
}
