import { ID } from "node-appwrite";

import Constants from "@/app/Constants";

import userPermissions from "../../userPermissions";

export async function createData({
  book_id,
  user_id,
  template_id,
  value,
  database,
}: {
  book_id: string;
  user_id: string;
  template_id: string;
  value: string;
  database: any;
}) {
  let res = await database.createDocument(
    Constants.MAIN_DB_ID,
    Constants.CUSTOM_PROP_DATA_COL_ID,
    ID.unique(),
    {
      book_id,
      user_id,
      template_id,
      value,
    },
    userPermissions(user_id),
  );
  return res.$id;
}
