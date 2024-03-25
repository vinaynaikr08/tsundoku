const sdk = require("node-appwrite");

import {
  construct_development_api_response,
  handle_error,
} from "../../dev_api_response";
import { checkUserToken } from "../../userContext";
import { client, isAppwriteUserError } from "@/app/appwrite";
import { AppwriteException, ID, Query } from "node-appwrite";
import Constants from "@/app/Constants";
import { NextRequest, NextResponse } from "next/server";
import { getOrFailAuthTokens } from "../../helpers";

const databases = new sdk.Databases(client);

export async function GET() {
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
        message: `The user currently does not have a username set.`,
        response_name: "username",
      });
    } else {
      return handle_error(error);
    }
  }

  return construct_development_api_response({
    message: `Query succeeded.`,
    response_data: db_query.username,
    response_name: "username",
  });
}

export async function PATCH(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  let username;
  try {
    const data = await request.json();
    username = data.username;
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!username) {
    return construct_development_api_response({
      message: `You're trying to update the username, but didn't supply the new username as a parameter.`,
      status_code: 400,
    });
  }

  try {
    await checkUsernameValidity(username);
  } catch (error: any) {
    return construct_development_api_response({
      message: `Your username is invalid. The username was not updated.`,
      response_name: "reason",
      response_data: error.message,
      status_code: 400,
    });
  }

  let userdata_id;
  try {
    const db_query = await databases.getDocument(
      Constants.MAIN_DB_ID,
      Constants.USERDATA_COL_ID,
      [Query.equal("user_id", user_id)],
    );
    userdata_id = db_query.username;
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error as AppwriteException).message === "document_not_found"
    ) {
      userdata_id = null;
    } else {
      return handle_error(error);
    }
  }

  if (!userdata_id) {
    try {
      // Create new userdata entry
      await databases.createDocument(
        Constants.MAIN_DB_ID,
        Constants.USERDATA_COL_ID,
        ID.unique(),
        {
          user_id,
          username,
        },
      );
    } catch (error: any) {
      return handle_error(error);
    }
  } else {
    try {
      // Update existing userdata entry
      await databases.updateDocument(
        Constants.MAIN_DB_ID,
        Constants.USERDATA_COL_ID,
        userdata_id,
        { username },
      );
    } catch (error: any) {
      return handle_error(error);
    }
  }

  return construct_development_api_response({
    message: "The username was updated.",
  });
}

async function checkUsernameValidity(username: string) {
  // Check if username is too long (Appwrite limits to 20)
  if (username.length > 20) {
    throw new Error("Username is too long (must be below 20 characters)");
  }

  // Check if username is empty
  if (username.length < 1) {
    throw new Error("Username is empty");
  }

  // Check if username is comprised of alphanumeric characters
  if (!username.match(/^[0-9a-z]+$/)) {
    throw new Error("Username must only contain alphanumeric characters");
  }
  // Check if others are using the same username
  let db_query;
  try {
    db_query = await databases.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.USERDATA_COL_ID,
      [Query.equal("username", username)],
    );
  } catch (error: any) {
    throw new Error("Username validator fetching failed");
  }
  if (db_query.total > 0) {
    throw new Error("Username is already used");
  }
}
