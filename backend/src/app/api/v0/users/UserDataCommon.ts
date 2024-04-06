const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";

import Constants from "@/app/Constants";
import { client } from "@/app/appwrite";
import { Query } from "node-appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../dev_api_response";
import { getAuthTokens } from "../helpers";
import { checkUserToken } from "../userContext";

const databases = new sdk.Databases(client);

export async function Get(request: NextRequest, field_name: string) {
  const authToken = getAuthTokens();

  let user_id;
  if (authToken) {
    user_id = await checkUserToken(authToken);
    if (user_id instanceof NextResponse) return user_id;
  }

  try {
    user_id = user_id
      ? user_id
      : (request.nextUrl.searchParams.get("user_id") as string);
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!user_id) {
    return construct_development_api_response({
      message: `No auth token was supplied, and no user ID was supplied.`,
      status_code: 400,
    });
  }

  let db_query;
  try {
    db_query = await databases.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.USERDATA_COL_ID,
      [Query.equal("user_id", user_id)],
    );
  } catch (error: any) {
    return handle_error(error);
  }

  if (db_query.documents.length === 1) {
    return construct_development_api_response({
      message: `Query succeeded.`,
      response_data: db_query.documents[0][field_name],
      response_name: field_name,
    });
  } else {
    return construct_development_api_response({
      message: `The user currently does not have a ${field_name} set.`,
      response_name: field_name,
    });
  }
}
