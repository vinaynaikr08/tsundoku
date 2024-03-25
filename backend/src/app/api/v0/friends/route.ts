const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../dev_api_response";
import { checkUserToken } from "../userContext";
import Constants from "@/app/Constants";
import userPermissions from "../userPermissions";
import { Friends_Status } from "./common";
import { getOrFailAuthTokens } from "../helpers";

const database = new sdk.Databases(client);

export async function GET() {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  let db_query;
  try {
    db_query = await database.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.FRIEND_COL_ID,
      [
        // You might get an error about `or` not existing in `Query`, this is normal
        // This is because the Appwrite Node SDK doesn't have the type declaration for it *yet*
        // @ts-ignore: upstream issue
        Query.or([
          Query.equal("requester", user_id),
          Query.equal("requestee", user_id),
        ]),
      ],
    );
  } catch (error: any) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `All friend relationships for: ${user_id}`,
    response_name: "results",
    response_data: db_query,
  });
}

export async function POST(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

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
        // @ts-ignore: upstream issue
        Query.or(
          // @ts-ignore: upstream issue
          Query.or(
            Query.equal("requester", user_id),
            Query.equal("requestee", requestee_id),
          ),
          // @ts-ignore: upstream issue
          Query.or(
            Query.equal("requester", requestee_id),
            Query.equal("requestee", user_id),
          ),
        ),
      ],
    );
  } catch (error: any) {
    return handle_error(error);
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
      return handle_error(error);
    }
  }

  return construct_development_api_response({
    message: `The friend relation was created.`,
  });
}
