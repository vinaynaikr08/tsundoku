const sdk = require("node-appwrite");

import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { AppwriteException, Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import { construct_development_api_response } from "../../dev_api_response";
import { createData } from "./common";
import { getUserContextDBAccount, getUserID } from "../../userContext";
import Constants from "@/app/Constants";
import { appwriteUnavailableResponse } from "../../common_responses";

const database = new sdk.Databases(client);

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

  const book_id = request.nextUrl.searchParams.get("book_id") as string;

  const { userDB, userAccount } = getUserContextDBAccount(authToken);

  let db_query, user_id;
  try {
    user_id = await getUserID(userAccount);
    db_query = await userDB.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.CUSTOM_PROP_DATA_COL_ID,
      book_id ? [Query.equal("book_id", book_id)] : null,
    );
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error as AppwriteException).message === "user_jwt_invalid"
    ) {
      return construct_development_api_response({
        message: "Authentication failed.",
        status_code: 401,
      });
    } else if (
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

  return construct_development_api_response({
    message: `Custom property data results for: ${user_id}`,
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

  let book_id, template_id, value;
  try {
    const data = await request.json();
    book_id = data.book_id;
    template_id = data.template_id;
    value = data.value;
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!book_id || !template_id || !value) {
    return construct_development_api_response({
      message: `Required parameters not supplied.`,
      status_code: 400,
    });
  }

  let user_id;
  try {
    user_id = await getUserID(userAccount);
  } catch (error: any) {
    return appwriteUnavailableResponse(error);
  }

  try {
    createData({ book_id, user_id, template_id, value, database });
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

  return construct_development_api_response({
    message: `The data was saved.`,
  });
}
