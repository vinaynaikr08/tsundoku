const sdk = require("node-appwrite");

import Constants from "@/app/Constants";
import { client } from "@/app/appwrite";
import { AppwriteException } from "node-appwrite";

const database = new sdk.Databases(client);

export async function checkBookExists(book_id: string): Promise<boolean> {
  try {
    await database.getDocument(
      Constants.MAIN_DB_ID,
      Constants.BOOK_COL_ID,
      book_id,
    );
    return true;
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error as AppwriteException).message === "document_not_found"
    ) {
      return false;
    }
    throw error;
  }
}
