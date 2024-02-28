const sdk = require("node-appwrite");

import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { AppwriteException, Query } from "appwrite";

import { client } from "@/app/appwrite";
import { construct_development_api_response } from "../dev_api_response";
import { createReview, reviewPermissions } from "./common";
import { getUserContextDBAccount } from "../userContext";
import { BOOK_COL_ID, MAIN_DB_ID, REVIEW_COL_ID } from "@/app/Constants";

const database = new sdk.Databases(client);

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
    db_query = await userDB.listDocuments(MAIN_DB_ID, REVIEW_COL_ID);
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error as AppwriteException).type === "user_jwt_invalid"
    ) {
      return construct_development_api_response({
        message: "Authentication failed.",
        status_code: 401,
      });
    }
    console.log(error);
    return construct_development_api_response({
      message: "Unknown error. Please contact the developers.",
      status_code: 500,
    });
  }

  const user_id = (await userAccount.get()).$id;

  return construct_development_api_response({
    message: `Review results for: ${user_id}`,
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

  const user_id = (await userAccount.get()).$id;

  const db_query = await database.listDocuments(MAIN_DB_ID, REVIEW_COL_ID, [
    Query.equal("user_id", user_id),
    Query.equal("book_id", book_id),
  ]);

  if (db_query.total == 0) {
    // Create new object
    createReview({ database, user_id, book_id, star_rating, description });
  } else {
    const review_id = db_query.documents[0].$id;

    await database.updateDocument(
      MAIN_DB_ID,
      REVIEW_COL_ID,
      review_id,
      {
        star_rating: star_rating,
        description: description,
      },
      reviewPermissions,
    );
  }

  return construct_development_api_response({
    message: `The book review item was updated.`,
  });
}
