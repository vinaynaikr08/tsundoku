const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";

import { Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../../dev_api_response";
import { createTemplate } from "./common";
import {
  checkUserToken,
  getUserContextDBAccount,
  getUserID,
} from "../../userContext";
import Constants from "@/app/Constants";
import { getOrFailAuthTokens } from "../../helpers";

const database = new sdk.Databases(client);

export async function GET(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const tokenCheck = await checkUserToken(authToken);
  if (tokenCheck instanceof NextResponse) return tokenCheck;

  const self = request.nextUrl.searchParams.get("self") as string;

  const { userAccount } = getUserContextDBAccount(authToken);

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
      Constants.CUSTOM_PROP_TEMPLATE_COL_ID,
      self && self === "true" ? [Query.equal("user_id", user_id)] : null,
    );
  } catch (error: any) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `Custom property template results for: ${user_id}`,
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

  let name, type;
  try {
    const data = await request.json();
    name = data.name;
    type = data.type;
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!name || !type) {
    return construct_development_api_response({
      message: `Required parameters not supplied.`,
      status_code: 400,
    });
  }

  let user_id;
  try {
    user_id = await getUserID(userAccount);
  } catch (error: any) {
    return handle_error(error);
  }

  let template_id;
  try {
    template_id = await createTemplate({ database, user_id, name, type });
  } catch (error: any) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `The template was created.`,
    response_name: "template_id",
    response_data: template_id,
  });
}
