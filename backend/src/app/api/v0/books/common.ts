import { ID } from "node-appwrite";

import Constants from "@/app/Constants";

export async function createBook({
  title,
  authors,
  editions,
  google_books_id,
  description,
  genre,
  database,
}: {
  title: string;
  authors: string[] | null;
  editions: string[] | null;
  google_books_id: string | null;
  description: string | null;
  genre: string | null;
  database: any;
}) {
  let book_data = {
    title,
  };

  // Assign optional values to book data if present
  Object.assign(
    book_data,
    authors ? { authors } : null,
    editions ? { editions } : null,
    google_books_id ? { google_books_id } : null,
    description ? { description } : null,
    genre ? { genre } : null,
  );

  const res = await database.createDocument(
    Constants.MAIN_DB_ID,
    Constants.BOOK_COL_ID,
    ID.unique(),
    book_data,
  );
  return res.$id;
}
