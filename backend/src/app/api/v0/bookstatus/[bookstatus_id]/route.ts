import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { construct_development_api_response } from "../../dev_api_response";
import Constants from "@/app/Constants";
import { getUserContextDBAccount } from "../../userContext";
import { appwriteUnavailableResponse } from "../../common_responses";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { bookstatus_id: string } },
) {
  const authToken = (headers().get("authorization") || "")
    .split("Bearer ")
    .at(1);

  if (!authToken) {
    return construct_development_api_response({
      message: "Authentication token is missing.",
      status_code: 401,
    });
  }

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
    return appwriteUnavailableResponse();
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
      return appwriteUnavailableResponse();
    }
  }

  return construct_development_api_response({
    message: `The book status item was updated.`,
  });
}
