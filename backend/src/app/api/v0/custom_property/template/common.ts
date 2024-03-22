import { ID } from "node-appwrite";

import Constants from "@/app/Constants";

export enum CustomProperty_Type {
  BOOLEAN,
  CATEGORICAL,
  NUMERICAL,
}

export async function createTemplate({
  name,
  user_id,
  type,
  database,
}: {
  name: string;
  user_id: string;
  type: CustomProperty_Type;
  database: any;
}) {
  let res = await database.createDocument(
    Constants.MAIN_DB_ID,
    Constants.CUSTOM_PROP_TEMPLATE_COL_ID,
    ID.unique(),
    {
      name,
      user_id,
      type,
    },
  );
  return res.$id;
}
