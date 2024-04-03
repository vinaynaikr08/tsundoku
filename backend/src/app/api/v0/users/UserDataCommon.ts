const sdk = require("node-appwrite");

import { NextResponse } from "next/server";

import Constants from "@/app/Constants";
import { client, isAppwriteUserError } from "@/app/appwrite";
import { Query } from "node-appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../dev_api_response";
import { getOrFailAuthTokens } from "../helpers";
import { checkUserToken } from "../userContext";

const databases = new sdk.Databases(client);

export async function Get(field_name: string) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  let db_query;
  try {
    db_query = await databases.getDocument(
      Constants.MAIN_DB_ID,
      Constants.USERDATA_COL_ID,
      [Query.equal("user_id", user_id)],
    );
  } catch (error: any) {
    if (
      isAppwriteUserError(error) &&
      //@ts-ignore: type not defined in AppwriteException
      (error as AppwriteException).type === "document_not_found"
    ) {
      return construct_development_api_response({
        message: `The user currently does not have a ${field_name} set.`,
        response_name: field_name,
      });
    } else {
      return handle_error(error);
    }
  }

  return construct_development_api_response({
    message: `Query succeeded.`,
    response_data: db_query[field_name],
    response_name: field_name,
  });
}
