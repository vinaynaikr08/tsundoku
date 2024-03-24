const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../../dev_api_response";
import { createCategory } from "./common";
import { checkUserToken } from "../../userContext";
import Constants from "@/app/Constants";
import {
  getOrFailAuthTokens,
  getRequiredSearchParamOrFail,
} from "../../helpers";

const database = new sdk.Databases(client);

export async function GET(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const template_id = getRequiredSearchParamOrFail(request, "template_id");
  if (template_id instanceof NextResponse) return template_id;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  let db_query;
  try {
    db_query = (
      await database.listDocuments(
        Constants.MAIN_DB_ID,
        Constants.CUSTOM_PROP_TEMPLATE_COL_ID,
        [Query.equal("template_id", template_id)],
      )
    ).documents;

    if (db_query.length !== 1) {
      return construct_development_api_response({
        message: "No documents or multiple documents found.",
        status_code: 404,
      });
    } else {
      db_query = db_query[0];
    }
  } catch (error: any) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `Custom property category results for: ${template_id}`,
    response_name: "results",
    response_data: db_query,
  });
}

export async function POST(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  let template_id, values;
  try {
    const data = await request.json();
    template_id = data.template_id;
    values = data.values;
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!template_id || !values) {
    return construct_development_api_response({
      message: `Required parameters not supplied.`,
      status_code: 400,
    });
  }

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  try {
    createCategory({ database, template_id, values });
  } catch (error: any) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `The category was created.`,
  });
}
