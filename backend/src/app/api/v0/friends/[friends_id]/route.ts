const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";

import { client } from "@/app/appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../../dev_api_response";
import Constants from "@/app/Constants";
import { checkUserToken } from "../../userContext";
import { Friends_Status } from "../common";
import { getOrFailAuthTokens } from "../../helpers";

const database = new sdk.Databases(client);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { friends_id: string } },
) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  const data = await request.json();
  const friends_id = params.friends_id;
  const status = data.status;

  if (!status) {
    return NextResponse.json(
      { message: "Parameter `status` not supplied." },
      { status: 400 },
    );
  }

  if (status !== Friends_Status.ACCEPTED) {
    return NextResponse.json(
      {
        message:
          "You're not accepting the friend request but you're using the PATCH method.",
      },
      { status: 400 },
    );
  }

  let db_query: any;
  try {
    db_query = await database.getDocument(
      Constants.MAIN_DB_ID,
      Constants.FRIEND_COL_ID,
      friends_id,
    );
  } catch (error) {
    return handle_error(error);
  }

  if (db_query.total == 0) {
    return construct_development_api_response({
      message:
        "The specified ID does not have an associated friend relations entry!",
      status_code: 404,
    });
  }

  // Check if the user is the requestee and has permissions to accept
  if (db_query.documents[0].requestee !== user_id) {
    return construct_development_api_response({
      message: "You do not have permissions to accept this friend request.",
      status_code: 401,
    });
  }

  try {
    await database.updateDocument(
      Constants.MAIN_DB_ID,
      Constants.FRIEND_COL_ID,
      friends_id,
      {
        status,
      },
    );
  } catch (error) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `The friend relationship was accepted.`,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { friends_id: string } },
) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  const friends_id = params.friends_id;

  let db_query: any;
  try {
    db_query = await database.getDocument(
      Constants.MAIN_DB_ID,
      Constants.FRIEND_COL_ID,
      friends_id,
    );
  } catch (error) {
    return handle_error(error);
  }

  if (db_query.total == 0) {
    return construct_development_api_response({
      message:
        "The specified ID does not have an associated friend relations entry!",
      status_code: 404,
    });
  }

  // Check if the user is the requestee and has permissions to reject or delete
  if (db_query.documents[0].requestee !== user_id) {
    return construct_development_api_response({
      message:
        "You do not have permissions to delete or reject this friend relationship.",
      status_code: 401,
    });
  }

  try {
    await database.deleteDocument(
      Constants.MAIN_DB_ID,
      Constants.FRIEND_COL_ID,
      friends_id,
    );
  } catch (error) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `The friend relationship was deleted or rejected.`,
  });
}
