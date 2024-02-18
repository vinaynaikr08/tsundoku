const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { Query } from "appwrite";

import { client } from "@/app/appwrite";

const databases = new sdk.Databases(client);

const MAIN_DB_ID = process.env.mainDBID;
const BOOK_COL_ID = process.env.bookCollectionID;

async function getBookFromGoogleBooksAPI(id: string) {
  const gbooks_api_res = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${id}`,
  );
  return await gbooks_api_res.json();
}

function construct_development_api_response(
  message: string,
  response_name: string | null,
  response_data: any | null,
  status_code: number,
) {
  if (response_name) {
    return NextResponse.json(
      {
        message,
        warning:
          "You are calling a development API! The schema may change without warning.",
        [response_name]: response_data,
      },
      { status: status_code },
    );
  }
  return NextResponse.json(
    {
      message,
      warning:
        "You are calling a development API! The schema may change without warning.",
    },
    { status: status_code },
  );
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const gbooks_api_id = data.id;

  let db_query = await databases.listDocuments(MAIN_DB_ID, BOOK_COL_ID, [
    Query.equal("google_books_id", gbooks_api_id),
  ]);

  if (db_query.total == 0) {
    return construct_development_api_response(
      `A book with the specified ID ${gbooks_api_id} was not found.`,
      null,
      null,
      404,
    );
  }

  const target_book_id = db_query.documents[0].$id;

  // Fetch updated book data from the Google Books API
  const gbooks_book_data = await getBookFromGoogleBooksAPI(data.id);

  await databases.updateDocument(MAIN_DB_ID, BOOK_COL_ID, target_book_id, {
    title: gbooks_book_data.volumeInfo.title,
    description: gbooks_book_data.volumeInfo.description,
    genre: gbooks_book_data.volumeInfo.categories[0],
  });

  return construct_development_api_response(
    `The book ID ${target_book_id} (Google Books API ID ${gbooks_api_id}) was updated.`,
    "gbooks_book_data",
    gbooks_book_data,
    200,
  );
}
