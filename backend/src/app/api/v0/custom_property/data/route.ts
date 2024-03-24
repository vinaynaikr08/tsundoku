const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../../dev_api_response";
import { createData } from "./common";
import { checkUserToken, getUserContextDBAccount } from "../../userContext";
import Constants from "@/app/Constants";
import { getOrFailAuthTokens } from "../../helpers";

const database = new sdk.Databases(client);

export async function GET(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  const book_id = request.nextUrl.searchParams.get("book_id") as string;

  const { userDB } = getUserContextDBAccount(authToken);

  let db_query;
  try {
    db_query = await userDB.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.CUSTOM_PROP_DATA_COL_ID,
      book_id ? [Query.equal("book_id", book_id)] : null,
    );
  } catch (error: any) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `Custom property data results for: ${user_id}`,
    response_name: "results",
    response_data: db_query,
  });
}

export async function POST(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

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

  try {
    createData({ book_id, user_id, template_id, value, database });
  } catch (error: any) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `The data was saved.`,
  });
}
