const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../../dev_api_response";
import Constants from "@/app/Constants";
import { GoogleBooksAPI } from "../GoogleBooksAPI";
import { getRequiredSearchParamOrFail } from "../../helpers";

const databases = new sdk.Databases(client);

async function createEdition({
  isbn_13,
  isbn_10,
  publisher,
  publish_date,
  page_count,
  thumbnail_url,
}: {
  isbn_13: any;
  isbn_10: any;
  publisher: any;
  publish_date: any;
  page_count: any;
  thumbnail_url: string;
}) {
  let res = await databases.createDocument(
    Constants.MAIN_DB_ID,
    Constants.EDITION_COL_ID,
    ID.unique(),
    {
      isbn_13,
      isbn_10,
      publisher,
      publish_date,
      page_count,
      thumbnail_url,
    },
  );
  return res.$id;
}

async function createAuthor({ name }: { name: any }) {
  let res = await databases.createDocument(
    Constants.MAIN_DB_ID,
    Constants.AUTHOR_COL_ID,
    ID.unique(),
    {
      name,
    },
  );
  return res.$id;
}

async function createBook({
  title,
  description,
  genre,
  authors,
  editions,
  google_books_id,
}: {
  title: any;
  description: any;
  genre: any;
  authors: any;
  editions: any;
  google_books_id: any;
}) {
  let res = await databases.createDocument(
    Constants.MAIN_DB_ID,
    Constants.BOOK_COL_ID,
    ID.unique(),
    {
      title,
      description,
      genre,
      authors,
      editions,
      google_books_id,
    },
  );

  return res.$id;
}

async function get_or_create_author_id(name: string) {
  let query = await databases.listDocuments(
    Constants.MAIN_DB_ID,
    Constants.AUTHOR_COL_ID,
    [Query.equal("name", name)],
  );

  if (query.total == 0) {
    return await createAuthor({ name: name });
  } else {
    return query.documents[0].$id;
  }
}

export async function GET(request: NextRequest) {
  const title = getRequiredSearchParamOrFail(request, "title");
  if (title instanceof NextResponse) return title;

  const simulateAPIFailure = request.nextUrl.searchParams.get(
    "simulateAPIFailure",
  ) as string;

  if (simulateAPIFailure && simulateAPIFailure === "true") {
    return construct_development_api_response({
      message: "The Google Books API is currently unavailable.",
      status_code: 503,
    });
  }

  let db_query;
  try {
    db_query = await databases.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.BOOK_COL_ID,
      [Query.search("title", title)],
    );
  } catch (error: any) {
    return handle_error(error);
  }

  if (db_query.total == 0) {
    // Fetch some results from the Google Books API and populate the DB
    let gbooks_books;
    try {
      gbooks_books = await GoogleBooksAPI.searchBooks(title);
    } catch (error: any) {
      return construct_development_api_response({
        message: "The Google Books API is currently unavailable.",
        status_code: 503,
      });
    }
    if (gbooks_books.length >= 1) {
      for (const gbooks_target_book of gbooks_books) {
        // Get author information
        let author_id;
        try {
          author_id = await get_or_create_author_id(
            gbooks_target_book.volumeInfo.authors[0],
          );
        } catch (error) {
          // This book probably doesn't have an author, skip
          continue;
        }

        // Check if book already exists in the database
        let gbook_api_existing_query = await databases.listDocuments(
          Constants.MAIN_DB_ID,
          Constants.BOOK_COL_ID,
          [Query.equal("google_books_id", gbooks_target_book.id)],
        );

        if (gbook_api_existing_query.total == 0) {
          // Create new entry
          try {
            const edition_id = await createEdition({
              isbn_13: gbooks_target_book.volumeInfo.industryIdentifiers.find(
                (e: any) => e.type === "ISBN_13",
              ).identifier,
              isbn_10: gbooks_target_book.volumeInfo.industryIdentifiers.find(
                (e: any) => e.type === "ISBN_10",
              ).identifier,
              publisher: gbooks_target_book.volumeInfo.publisher,
              publish_date: gbooks_target_book.volumeInfo.published_date,
              page_count: gbooks_target_book.volumeInfo.pageCount,
              thumbnail_url: gbooks_target_book.volumeInfo.imageLinks.thumbnail,
            });

            await createBook({
              title: gbooks_target_book.volumeInfo.title,
              description: gbooks_target_book.volumeInfo.description,
              genre: gbooks_target_book.volumeInfo.categories[0],
              authors: [author_id],
              editions: [edition_id],
              google_books_id: gbooks_target_book.id,
            });

            // Fetch from DB to refresh
            db_query = await databases.listDocuments(
              Constants.MAIN_DB_ID,
              Constants.BOOK_COL_ID,
              [Query.search("title", title)],
            );
          } catch (error) {
            if (error instanceof TypeError) {
              // This book doesn't have one of the required fields, skip
              continue;
            } else {
              return handle_error(error);
            }
          }
        }
      }
    }
  }
  return construct_development_api_response({
    message: `DB search results for: ${title}`,
    response_name: "results",
    response_data: db_query,
  });
}
