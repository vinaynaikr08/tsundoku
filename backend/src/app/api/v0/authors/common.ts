import { ID } from "node-appwrite";

import Constants from "@/app/Constants";

export async function createAuthor({
  name,
  database,
}: {
  name: string;
  database: any;
}) {
  const res = await database.createDocument(
    Constants.MAIN_DB_ID,
    Constants.AUTHOR_COL_ID,
    ID.unique(),
    {
      name,
    },
  );
  return res.$id;
}
