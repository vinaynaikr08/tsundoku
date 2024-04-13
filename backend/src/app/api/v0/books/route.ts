const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";

import { client } from "@/app/appwrite";
import { getOrFailAuthTokens } from "../helpers";
import { checkUserToken } from "../userContext";
import {
  construct_development_api_response,
  handle_error,
} from "../dev_api_response";
import { createBook } from "./common";

const database = new sdk.Databases(client);

export async function POST(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  let title, authors, editions, google_books_id, description, genre;
  try {
    const data = await request.json();
    title = data.title;

    authors =
      "authors" in data &&
      Array.isArray(data.authors) &&
      data.authors.length() > 0
        ? data.authors
        : null;
    editions =
      "editions" in data &&
      Array.isArray(data.editions) &&
      data.editions.length() > 0
        ? data.editions
        : null;
    google_books_id = "google_books_id" in data ? data.google_books_id : null;
    description = "description" in data ? data.description : null;
    genre = "genre" in data ? data.genre : null;
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!title) {
    return construct_development_api_response({
      message: `Required parameters not supplied.`,
      status_code: 400,
    });
  }

  // Create new object
  try {
    const book_id = await createBook({
      database,
      title,
      authors,
      editions,
      google_books_id,
      description,
      genre,
    });

    return construct_development_api_response({
      message: `The book was created.`,
      response_name: "results",
      response_data: {
        book_id,
      },
    });
  } catch (error) {
    return handle_error(error);
  }
}
