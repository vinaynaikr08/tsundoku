const sdk = require("node-appwrite");

import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { AppwriteException, Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import { construct_development_api_response } from "../../dev_api_response";
import { createCategory } from "./common";
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

  const template_id = request.nextUrl.searchParams.get("template_id") as string;

  if (!template_id) {
    return construct_development_api_response({
      message: "Parameter `template_id` not supplied.",
      status_code: 400,
    });
  }

  const { userAccount } = getUserContextDBAccount(authToken);

  // Auth token check
  try {
    await getUserID(userAccount);
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error as AppwriteException).message === "user_jwt_invalid"
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

  let db_query;
  try {
    db_query = await database.getDocument(
      Constants.MAIN_DB_ID,
      Constants.CUSTOM_PROP_TEMPLATE_COL_ID,
      [Query.equal("template_id", template_id)],
    );
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
    message: `Custom property category results for: ${template_id}`,
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

  let user_id;
  try {
    user_id = await getUserID(userAccount);
  } catch (error: any) {
    return appwriteUnavailableResponse(error);
  }

  try {
    createCategory({ database, template_id, values });
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
    message: `The category was created.`,
  });
}
