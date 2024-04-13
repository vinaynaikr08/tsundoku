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
  { params }: { params: { reading_challenge_id: string } },
) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  const { userDB } = getUserContextDBAccount(authToken);

  const data = await request.json();
  const reading_challenge_id = params.reading_challenge_id;

  const name = "name" in data ? data.name : null;
  const book_count = "book_count" in data ? data.book_count : null;
  const start = "start" in data ? data.start : null;
  const end = "end" in data ? data.end : null;

  if (!name && !book_count && !start && !end) {
    return NextResponse.json(
      { message: "No parameters were given to update." },
      { status: 400 },
    );
  }

  let db_query: any;
  try {
    db_query = await userDB.getDocument(
      Constants.MAIN_DB_ID,
      Constants.READING_CHALLENGE_COL_ID,
      reading_challenge_id,
    );
  } catch (error) {
    if (error instanceof AppwriteException) {
      return handle_error(error);
    }
  }

  if (db_query.total == 0) {
    return construct_development_api_response({
      message:
        "The specified ID does not have an associated reading challenge entry!",
      status_code: 404,
    });
  } else {
    try {
      await userDB.updateDocument(
        Constants.MAIN_DB_ID,
        Constants.READING_CHALLENGE_COL_ID,
        reading_challenge_id,
        Object.assign(
          {},
          name ? { name } : null,
          book_count ? { book_count } : null,
          start ? { start } : null,
          end ? { end } : null,
        ),
      );
    } catch (error) {
      handle_error(error);
    }
  }

  return construct_development_api_response({
    message: `The reading challenge item was updated.`,
  });
}
