const sdk = require("node-appwrite");

import { NextRequest } from "next/server";
import { AppwriteException, Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import { construct_development_api_response } from "../../dev_api_response";

import Constants from "@/app/Constants";
import { GoogleBooksAPI } from "../GoogleBooksAPI";
import { appwriteUnavailableResponse } from "../../common_responses";

const databases = new sdk.Databases(client);

// TODO: delete this route entirely
export async function POST(request: NextRequest) {
  const data = await request.json();
  const gbooks_api_id = data.id;

  let db_query: any;
  databases
    .listDocuments(Constants.MAIN_DB_ID, Constants.BOOK_COL_ID, [
      Query.equal("google_books_id", gbooks_api_id),
    ])
    .then((res: any) => {
      db_query = res;
    })
    .catch((error: any) => {
      if (error instanceof AppwriteException) {
        return appwriteUnavailableResponse(error);
      }
    });

  if (db_query.total == 0) {
    return construct_development_api_response({
      message: `A book with the specified ID ${gbooks_api_id} was not found.`,
      response_name: null,
      response_data: null,
      status_code: 404,
    });
  }

  const target_book_id = db_query.documents[0].$id;

  // Fetch updated book data from the Google Books API
  let gbooks_book_data;
  try {
    gbooks_book_data = await GoogleBooksAPI.getBook(data.id);
  } catch (error: any) {
    return construct_development_api_response({
      message: "The Google Books API is currently unavailable.",
      status_code: 503,
    });
  }

  try {
    await databases.updateDocument(Constants.MAIN_DB_ID, Constants.BOOK_COL_ID, target_book_id, {
      title: gbooks_book_data.volumeInfo.title,
      description: gbooks_book_data.volumeInfo.description,
      genre: gbooks_book_data.volumeInfo.categories[0],
    });
  } catch (error) {
    return appwriteUnavailableResponse(error);
  }

  return construct_development_api_response({
    message: `The book ID ${target_book_id} (Google Books API ID ${gbooks_api_id}) was updated.`,
    response_name: "gbooks_book_data",
    response_data: gbooks_book_data,
  });
}
