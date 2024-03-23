import { NextRequest, NextResponse } from "next/server";

import {
  construct_development_api_response,
  handle_error,
} from "@/app/api/v0/dev_api_response";
import Constants from "@/app/Constants";
import { getUserContextDBAccount } from "@/app/api/v0/userContext";
import { getOrFailAuthTokens } from "../../../helpers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { category_id: string } },
) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const { userDB } = getUserContextDBAccount(authToken);

  const data = await request.json();
  const category_id = params.category_id;
  const values = data.values;

  if (!values) {
    return NextResponse.json(
      {
        message:
          "Warning: you're attempting to edit the category, but didn't supply the values.",
      },
      { status: 400 },
    );
  }

  let db_query: any;
  try {
    db_query = await userDB.getDocument(
      Constants.MAIN_DB_ID,
      Constants.CUSTOM_PROP_CATEGORY_COL_ID,
      category_id,
    );
  } catch (error) {
    return handle_error(error);
  }

  if (db_query.total == 0) {
    return construct_development_api_response({
      message:
        "The specified ID does not have an associated custom property category!",
      status_code: 404,
    });
  } else {
    try {
      await userDB.updateDocument(
        Constants.MAIN_DB_ID,
        Constants.CUSTOM_PROP_CATEGORY_COL_ID,
        category_id,
        { values },
      );
    } catch (error) {
      return handle_error(error);
    }
  }

  return construct_development_api_response({
    message: `The custom property category was updated.`,
  });
}
