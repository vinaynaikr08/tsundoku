import { ID } from "node-appwrite";

import Constants from "@/app/Constants";

export async function createCategory({
  template_id,
  values,
  database,
}: {
  template_id: string;
  values: string;
  database: any;
}) {
  let res = await database.createDocument(
    Constants.MAIN_DB_ID,
    Constants.CUSTOM_PROP_CATEGORY_COL_ID,
    ID.unique(),
    {
      template_id,
      values,
    },
  );
  return res.$id;
}
