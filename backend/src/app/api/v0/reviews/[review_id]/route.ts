import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { construct_development_api_response } from "../../dev_api_response";
import Constants from "@/app/Constants";
import { getUserContextDBAccount } from "../../userContext";
import { AppwriteException } from "node-appwrite";
import { appwriteUnavailableResponse } from "../../common_responses";

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

  let db_query: any;
  try {
    db_query = await userDB.getDocument(
      Constants.MAIN_DB_ID,
      Constants.REVIEW_COL_ID,
      review_id,
    );
  } catch (error) {
    if (error instanceof AppwriteException) {
      return appwriteUnavailableResponse();
    }
  }

  if (db_query.total == 0) {
    return construct_development_api_response({
      message:
        "The specified ID does not have an associated book review entry!",
      status_code: 404,
    });
  } else {
    try {
      await userDB.updateDocument(
        Constants.MAIN_DB_ID,
        Constants.REVIEW_COL_ID,
        review_id,
        {
          star_rating: star_rating
            ? star_rating
            : db_query.documents[0].star_rating,
          description: description
            ? description
            : db_query.documents[0].description,
        },
      );
    } catch (error) {
      if (error instanceof AppwriteException) {
        return appwriteUnavailableResponse();
      }
    }
  }

  return construct_development_api_response({
    message: `The book review item was updated.`,
  });
}
