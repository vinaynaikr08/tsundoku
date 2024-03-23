const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { AppwriteException, Query } from "node-appwrite";

import {
  client,
  formatAppwriteUserError,
  isAppwriteUserError,
} from "@/app/appwrite";
import { construct_development_api_response } from "../../dev_api_response";
import { createCategory } from "./common";
import {
  checkUserToken,
  getUserContextDBAccount,
  getUserID,
} from "../../userContext";
import Constants from "@/app/Constants";
import { getOrFailAuthTokens, getRequiredParameterOrFail } from "../../helpers";

const database = new sdk.Databases(client);

export async function GET(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const template_id = getRequiredParameterOrFail(request, "template_id");
  if (template_id instanceof NextResponse) return template_id;

  const tokenCheck = await checkUserToken(authToken);
  if (tokenCheck instanceof NextResponse) return tokenCheck;

  let db_query;
  try {
    db_query = await database.getDocument(
      Constants.MAIN_DB_ID,
      Constants.CUSTOM_PROP_TEMPLATE_COL_ID,
      [Query.equal("template_id", template_id)],
    );
  } catch (error: any) {
    if (isAppwriteUserError(error)) {
      return formatAppwriteUserError(error);
    } else {
      console.log(error);
      return construct_development_api_response({
        message: "Unknown error. Please contact the developers.",
        status_code: 500,
      });
    }
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

  const tokenCheck = await checkUserToken(authToken);
  if (tokenCheck instanceof NextResponse) return tokenCheck;

  try {
    createCategory({ database, template_id, values });
  } catch (error: any) {
    if (isAppwriteUserError(error)) {
      return construct_development_api_response({
        message: (error as AppwriteException).message,
        status_code: (error as AppwriteException).code!,
      });
    } else {
      console.log(error);
      return construct_development_api_response({
        message: "Unknown error. Please contact the developers.",
        status_code: 500,
      });
    }
  }

  return construct_development_api_response({
    message: `The category was created.`,
  });
}
