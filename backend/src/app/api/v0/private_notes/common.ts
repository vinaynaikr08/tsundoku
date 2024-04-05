import { ID } from "node-appwrite";

import Constants from "@/app/Constants";
import userPermissions from "../userPermissions";

export async function createPrivateNote({
  user_id,
  book_id,
  notes,
  database
}: {
  user_id: string;
  book_id: string;
  notes: string;
  database: any;
}) {
  let res = await database.createDocument(
    Constants.MAIN_DB_ID,
    Constants.PRIVATE_NOTES_COL_ID,
    ID.unique(),
    {
      user_id,
      book_id,
      notes,
    },
    userPermissions(user_id),
  );
  return res.$id;
}
