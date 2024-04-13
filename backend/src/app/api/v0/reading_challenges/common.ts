import { ID } from "node-appwrite";

import Constants from "@/app/Constants";
import userPermissions from "../userPermissions";

export async function createReadingChallenge({
  name,
  book_count,
  start,
  end,
  user_id,
  database,
}: {
  name: string;
  book_count: number;
  start: string;
  end: string;
  user_id: string;
  database: any;
}) {
  const res = await database.createDocument(
    Constants.MAIN_DB_ID,
    Constants.READING_CHALLENGE_COL_ID,
    ID.unique(),
    {
      name,
      book_count,
      start,
      end,
      user_id,
    },
    userPermissions(user_id),
  );
  return res.$id;
}
