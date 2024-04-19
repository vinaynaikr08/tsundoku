const sdk = require("node-appwrite");

import Constants from "@/app/Constants";
import { client } from "@/app/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../../dev_api_response";
import { getOrFailAuthTokens } from "../../helpers";
import { checkUserToken } from "../../userContext";
import { Get } from "../UserDataCommon";

const databases = new sdk.Databases(client);

export async function GET(request: NextRequest) {
  return await Get(request, "social_url");
}

export async function PATCH(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  let social_url: string | null;
  try {
    const data = await request.json();
    social_url = data.social_url;
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  // Appwrite doesn't like empty strings to unset an attribute, rewrite to null instead
  if (social_url === "") {
    social_url = null;
  }

  let userdata_id = null;
  try {
    const db_query = await databases.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.USERDATA_COL_ID,
      [Query.equal("user_id", user_id)],
    );
    if (db_query.documents.length === 1) {
      userdata_id = db_query.documents[0].$id;
    }
  } catch (error: any) {
    return handle_error(error);
  }

  if (!userdata_id) {
    return construct_development_api_response({
      message: `No UserData entry found. The user account must have a username to proceed.`,
      status_code: 404,
    });
  } else {
    try {
      // Update existing userdata entry
      await databases.updateDocument(
        Constants.MAIN_DB_ID,
        Constants.USERDATA_COL_ID,
        userdata_id,
        { social_url },
      );
    } catch (error: any) {
      return handle_error(error);
    }
  }

  return construct_development_api_response({
    message: "The social URL was updated.",
  });
}
