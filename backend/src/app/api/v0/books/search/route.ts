const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "appwrite";

import { client } from "@/app/appwrite";

const databases = new sdk.Databases(client);

const MAIN_DB_ID = process.env.mainDBID;
const BOOK_COL_ID = process.env.bookCollectionID;
const AUTHOR_COL_ID = process.env.authorCollectionID;
const EDITION_COL_ID = process.env.editionCollectionID;

async function createEdition({
  isbn_13,
  isbn_10,
  publisher,
  publish_date,
  page_count,
}: {
  isbn_13: any;
  isbn_10: any;
  publisher: any;
  publish_date: any;
  page_count: any;
}) {
  let res = await databases.createDocument(
    MAIN_DB_ID,
    EDITION_COL_ID,
    ID.unique(),
    {
      isbn_13,
      isbn_10,
      publisher,
      publish_date,
      page_count,
    },
  );
  return res.$id;
}

async function createAuthor({ name }: { name: any }) {
  let res = await databases.createDocument(
    MAIN_DB_ID,
    AUTHOR_COL_ID,
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
    MAIN_DB_ID,
    BOOK_COL_ID,
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
}

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title") as string;

  let db_query = await databases.listDocuments(MAIN_DB_ID, BOOK_COL_ID, [
    Query.search("title", title),
  ]);

  if (db_query.total == 0) {
    // Fetch some results from the Google Books API and populate the DB
    const gbooks_api_res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}`,
    );
    const gbooks_api_data = await gbooks_api_res.json();

    // Only check the first item (for now)
    if (gbooks_api_data.items.length >= 1) {
      const gbooks_target_book = gbooks_api_data.items[0];
      let author_id = null;

      // Check if author exists
      const author_name = gbooks_target_book.volumeInfo.authors[0];
      let gbook_api_author_query = await databases.listDocuments(
        MAIN_DB_ID,
        AUTHOR_COL_ID,
        [Query.equal("name", author_name)],
      );

      if (gbook_api_author_query.total == 0) {
        // Create new entry and assign author ID
        author_id = createAuthor({ name: author_name });
      } else {
        author_id = gbook_api_author_query.documents[0].$id;
      }

      // Check if book already exists in the database
      let gbook_api_existing_query = await databases.listDocuments(
        MAIN_DB_ID,
        BOOK_COL_ID,
        [Query.equal("google_books_id", gbooks_target_book.id)],
      );

      if (gbook_api_existing_query.total == 0) {
        // Create new entry
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
        });

        createBook({
          title: gbooks_target_book.volumeInfo.title,
          description: gbooks_target_book.volumeInfo.description,
          genre: gbooks_target_book.volumeInfo.categories[0],
          authors: [author_id],
          editions: [edition_id],
          google_books_id: gbooks_target_book.id,
        }).then(() => {
          // Requery DB to return to user
          databases
            .listDocuments(MAIN_DB_ID, BOOK_COL_ID, [
              Query.equal("title", title),
            ])
            .then((db_query: any) => {
              return NextResponse.json(
                { message: `DB search results for: ${title}`, db_query },
                { status: 200 },
              );
            });
        });
      }
    }
  }
  return NextResponse.json(
    { message: `DB search results for: ${title}`, db_query },
    { status: 200 },
  );
}
