const sdk = require("node-appwrite");

import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { AppwriteException, ID, Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import { construct_development_api_response } from "../dev_api_response";
import { getUserContextDBAccount, getUserID } from "../userContext";
import Constants from "@/app/Constants";
import userPermissions from "../userPermissions";
import { appwriteUnavailableResponse } from "../common_responses";
import { Friends_Status } from "./common";

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

  const { userAccount } = getUserContextDBAccount(authToken);

  let user_id;
  try {
    user_id = await getUserID(userAccount);
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
    return appwriteUnavailableResponse(error);
  }

  let db_query;
  try {
    db_query = await database.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.FRIEND_COL_ID,
      [
        // You might get an error about `or` not existing in `Query`, this is normal
        // This is because the Appwrite Node SDK doesn't have the type declaration for it *yet*
        Query.or(
          Query.equal("requester", user_id),
          Query.equal("requestee", user_id),
        ),
      ],
    );
  } catch (error: any) {
    return appwriteUnavailableResponse(error);
  }

  return construct_development_api_response({
    message: `All friend relationships for: ${user_id}`,
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

  let user_id;
  try {
    user_id = await getUserID(userAccount);
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
    return appwriteUnavailableResponse(error);
  }

  let requestee_id;
  try {
    const data = await request.json();
    requestee_id = data.requestee_id;
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!requestee_id) {
    return construct_development_api_response({
      message: `Required parameters not supplied.`,
      status_code: 400,
    });
  }

  if (user_id === requestee_id) {
    return construct_development_api_response({
      message: `Are you Narcissus?`,
      status_code: 400,
    });
  }

  // Check if the users are already friends
  let db_query;
  try {
    db_query = await database.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.FRIEND_COL_ID,
      [
        // You might get an error about `or` not existing in `Query`, this is normal
        // This is because the Appwrite Node SDK doesn't have the type declaration for it *yet*
        Query.or(
          Query.or(
            Query.equal("requester", user_id),
            Query.equal("requestee", requestee_id),
          ),
          Query.or(
            Query.equal("requester", requestee_id),
            Query.equal("requestee", user_id),
          ),
        ),
      ],
    );
  } catch (error: any) {
    return appwriteUnavailableResponse(error);
  }
  if (db_query.total > 0) {
    return construct_development_api_response({
      message: `You're trying to create an already existing friend relationship, or a request is already pending.`,
      status_code: 400,
    });
  } else {
    try {
      await database.createDocument(
        Constants.MAIN_DB_ID,
        Constants.FRIEND_COL_ID,
        ID.unique(),
        {
          requester_id: user_id,
          requestee_id,
          status: Friends_Status.PENDING,
        },
        userPermissions(user_id),
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
  }

  return construct_development_api_response({
    message: `The friend relation was created.`,
  });
}
