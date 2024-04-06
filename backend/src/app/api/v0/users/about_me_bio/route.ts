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
  return await Get(request, "about_me_bio");
}

export async function PATCH(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  let about_me_bio;
  try {
    const data = await request.json();
    about_me_bio = data.about_me_bio;
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!about_me_bio) {
    return construct_development_api_response({
      message: `You're trying to update the about me bio, but didn't supply the new about me bio as a parameter.`,
      status_code: 400,
    });
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
    try {
      // Create new userdata entry
      await databases.createDocument(
        Constants.MAIN_DB_ID,
        Constants.USERDATA_COL_ID,
        ID.unique(),
        {
          user_id,
          about_me_bio,
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
        { about_me_bio },
      );
    } catch (error: any) {
      return handle_error(error);
    }
  }

  return construct_development_api_response({
    message: "The about me bio was updated.",
  });
}
