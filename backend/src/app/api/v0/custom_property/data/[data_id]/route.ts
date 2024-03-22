import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { construct_development_api_response } from "@/app/api/v0/dev_api_response";
import Constants from "@/app/Constants";
import { getUserContextDBAccount } from "@/app/api/v0/userContext";
import { appwriteUnavailableResponse } from "@/app/api/v0/common_responses";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { data_id: string } },
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
  const data_id = params.data_id;
  const value = data.value;

  if (!value) {
    return NextResponse.json(
      {
        message:
          "Warning: you're attempting to edit the property data, but didn't supply the updated value.",
      },
      { status: 400 },
    );
  }

  let db_query: any;
  try {
    db_query = await userDB.getDocument(
      Constants.MAIN_DB_ID,
      Constants.CUSTOM_PROP_DATA_COL_ID,
      data_id,
    );
  } catch (error) {
    return appwriteUnavailableResponse(error);
  }

  if (db_query.total == 0) {
    return construct_development_api_response({
      message:
        "The specified ID does not have an associated custom property data entry!",
      status_code: 404,
    });
  } else {
    try {
      await userDB.updateDocument(
        Constants.MAIN_DB_ID,
        Constants.CUSTOM_PROP_DATA_COL_ID,
        data_id,
        { value },
      );
    } catch (error) {
      return appwriteUnavailableResponse(error);
    }
  }

  return construct_development_api_response({
    message: `The custom property category was updated.`,
  });
}
