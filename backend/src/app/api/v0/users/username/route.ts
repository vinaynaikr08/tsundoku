const sdk = require("node-appwrite");

import { headers } from "next/headers";

import { construct_development_api_response } from "../../dev_api_response";
import { getUserContextDBAccount, getUserID } from "../../userContext";
import { client } from "@/app/appwrite";
import { AppwriteException, Query } from "node-appwrite";
import Constants from "@/app/Constants";
import { appwriteUnavailableResponse } from "../../common_responses";

const databases = new sdk.Databases(client);

export async function GET() {
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

  let user_id;
  try {
    user_id = await getUserID(userAccount);
  } catch (error: any) {
    return construct_development_api_response({
      message: "Authentication token is invalid.",
      status_code: 401,
    });
  }

  let db_query;
  try {
    db_query = await databases.getDocument(
      Constants.MAIN_DB_ID,
      Constants.USERDATA_COL_ID,
      [Query.equal("user_id", user_id)],
    );
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error as AppwriteException).message === "document_not_found"
    ) {
      return construct_development_api_response({
        message: `The user currently does not have a username set.`,
        response_name: "username",
      });
    }
    return appwriteUnavailableResponse(error);
  }

  return construct_development_api_response({
    message: `Query succeeded.`,
    response_data: db_query.username,
    response_name: "username",
  });
}
