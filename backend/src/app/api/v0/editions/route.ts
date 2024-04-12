const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";

import { client } from "@/app/appwrite";
import { getOrFailAuthTokens } from "../helpers";
import { checkUserToken } from "../userContext";
import { construct_development_api_response } from "../dev_api_response";
import { createEdition } from "./common";

const database = new sdk.Databases(client);

export async function POST(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  let isbn_10,
    isbn_13,
    page_count,
    publish_date,
    publisher,
    format,
    thumbnail_url;
  try {
    const data = await request.json();
    isbn_10 = data.isbn_10;
    isbn_13 = data.isbn_13;

    page_count = "page_count" in data ? data.page_count : null;
    publish_date = "publish_date" in data ? data.publish_date : null;
    publisher = "publisher" in data ? data.publisher : null;
    format = "format" in data ? data.format : null;
    thumbnail_url = "thumbnail_url" in data ? data.thumbnail_url : null;
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!isbn_10 || !isbn_13) {
    return construct_development_api_response({
      message: `Required parameters not supplied.`,
      status_code: 400,
    });
  }

  // Create new object
  const edition_id = createEdition({
    database,
    isbn_10,
    isbn_13,
    page_count,
    publish_date,
    publisher,
    format,
    thumbnail_url,
  });

  return construct_development_api_response({
    message: `The edition was created.`,
    response_name: "results",
    response_data: {
      edition_id,
    },
  });
}
