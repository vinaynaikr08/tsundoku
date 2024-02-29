const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { construct_development_api_response } from "../../dev_api_response";
import { MAIN_DB_ID, REVIEW_COL_ID } from "@/app/Constants";
import { getUserContextDBAccount } from "../../userContext";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { review_id: string } },
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
  const review_id = params.review_id;

  const star_rating = data.status;
  const description = data.description;

  if (!star_rating && !description) {
    return NextResponse.json(
      { message: "No parameters were given to update." },
      { status: 400 },
    );
  }

  let db_query = await userDB.getDocument(MAIN_DB_ID, REVIEW_COL_ID, review_id);

  if (db_query.total == 0) {
    return construct_development_api_response({
      message:
        "The specified ID does not have an associated book review entry!",
      status_code: 404,
    });
  } else {
    await userDB.updateDocument(MAIN_DB_ID, REVIEW_COL_ID, review_id, {
      star_rating: star_rating
        ? star_rating
        : db_query.documents[0].star_rating,
      description: description
        ? description
        : db_query.documents[0].description,
    });
  }

  return construct_development_api_response({
    message: `The book review item was updated.`,
  });
}
