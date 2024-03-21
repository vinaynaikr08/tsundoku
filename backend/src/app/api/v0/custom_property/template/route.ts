const sdk = require("node-appwrite");

import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { AppwriteException, Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import { construct_development_api_response } from "../../dev_api_response";
import { createTemplate } from "./common";
import { getUserContextDBAccount } from "../../userContext";
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

  const { userDB, userAccount } = getUserContextDBAccount(authToken);
  let db_query;
  try {
    db_query = await userDB.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.CUSTOM_PROP_TEMPLATE_COL_ID,
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
      return appwriteUnavailableResponse(error);
    });

  return construct_development_api_response({
    message: `Custom property template results for: ${user_id}`,
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

  const user_id = (await userAccount.get()).$id;

  try {
    createTemplate({ database, user_id, name, type });
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
    message: `The template was created.`,
  });
}
