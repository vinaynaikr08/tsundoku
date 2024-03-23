import { NextRequest, NextResponse } from "next/server";

import {
  construct_development_api_response,
  handle_error,
} from "../../dev_api_response";
import Constants from "@/app/Constants";
import { checkUserToken, getUserContextDBAccount } from "../../userContext";
import { getOrFailAuthTokens } from "../../helpers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { bookstatus_id: string } },
) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const tokenCheck = await checkUserToken(authToken);
  if (tokenCheck instanceof NextResponse) return tokenCheck;

  const { userDB } = getUserContextDBAccount(authToken);

  const data = await request.json();
  const bookstatus_id = params.bookstatus_id;
  const status = data.status;

  if (!status) {
    return NextResponse.json(
      { message: "Parameter `status` not supplied." },
      { status: 400 },
    );
  }

  let db_query: any;
  try {
    db_query = await userDB.getDocument(
      Constants.MAIN_DB_ID,
      Constants.BOOK_STAT_COL_ID,
      bookstatus_id,
    );
  } catch (error) {
    return handle_error(error);
  }

  if (db_query.total == 0) {
    return construct_development_api_response({
      message:
        "The specified ID does not have an associated book status entry!",
      status_code: 404,
    });
  } else {
    try {
      await userDB.updateDocument(
        Constants.MAIN_DB_ID,
        Constants.BOOK_STAT_COL_ID,
        bookstatus_id,
        {
          status: status,
        },
      );
    } catch (error) {
      return handle_error(error);
    }
  }

  return construct_development_api_response({
    message: `The book status item was updated.`,
  });
}
