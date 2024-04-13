import { ID } from "node-appwrite";

import Constants from "@/app/Constants";

export async function createEdition({
  isbn_13,
  isbn_10,
  page_count,
  publish_date,
  publisher,
  format,
  thumbnail_url,
  database,
}: {
  isbn_13: string;
  isbn_10: string;
  page_count: number | null;
  publish_date: string | null;
  publisher: string | null;
  format: string | null;
  thumbnail_url: string | null;
  database: any;
}) {
  let edition_data = {
    isbn_13,
    isbn_10,
  };

  // Assign optional values to edition data if present
  Object.assign(
    edition_data,
    page_count ? { page_count } : null,
    publish_date ? { publish_date } : null,
    publisher ? { publisher } : null,
    format ? { format } : null,
    thumbnail_url ? { thumbnail_url } : null,
  );

  let res = await database.createDocument(
    Constants.MAIN_DB_ID,
    Constants.EDITION_COL_ID,
    ID.unique(),
    edition_data,
  );
  return res.$id;
}
