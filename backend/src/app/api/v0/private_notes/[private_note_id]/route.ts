import { NextRequest, NextResponse } from "next/server";

import {
  construct_development_api_response,
  handle_error,
} from "../../dev_api_response";
import Constants from "@/app/Constants";
import { checkUserToken, getUserContextDBAccount } from "../../userContext";
import { AppwriteException } from "node-appwrite";
import { getOrFailAuthTokens } from "../../helpers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { private_note_id: string } },
) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  const { userDB } = getUserContextDBAccount(authToken);

  const data = await request.json();
  const private_note_id = params.private_note_id;

  const notes = data.notes;

  if (!notes) {
    return NextResponse.json(
      { message: "No parameters were given to update." },
      { status: 400 },
    );
  }

  let db_query: any;
  try {
    db_query = await userDB.getDocument(
      Constants.MAIN_DB_ID,
      Constants.PRIVATE_NOTES_COL_ID,
      private_note_id,
    );
  } catch (error) {
    if (error instanceof AppwriteException) {
      return handle_error(error);
    }
  }

  if (db_query.total == 0) {
    return construct_development_api_response({
      message:
        "The specified ID does not have an associated private note entry!",
      status_code: 404,
    });
  } else {
    try {
      await userDB.updateDocument(
        Constants.MAIN_DB_ID,
        Constants.PRIVATE_NOTES_COL_ID,
        private_note_id,
        {
          notes
        },
      );
    } catch (error) {
      handle_error(error);
    }
  }

  return construct_development_api_response({
    message: `The private note item was updated.`,
  });
}
