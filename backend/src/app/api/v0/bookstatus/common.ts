import { ID } from "node-appwrite";

import Constants from "@/app/Constants";
import userPermissions from "../userPermissions";

export enum BookStatus_Status {
  WANT_TO_READ,
  CURRENTLY_READING,
  READ,
  DID_NOT_FINISH,
}

export async function createBookStatus({
  user_id,
  book,
  status,
  database,
}: {
  user_id: string;
  book: string;
  status: BookStatus_Status;
  database: any;
}) {
  let res = await database.createDocument(
    Constants.MAIN_DB_ID,
    Constants.BOOK_STAT_COL_ID,
    ID.unique(),
    {
      user_id,
      book,
      status,
    },
    userPermissions(user_id),
  );
  return res.$id;
}
