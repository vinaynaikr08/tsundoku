import { ID } from "node-appwrite";

import { MAIN_DB_ID, REVIEW_COL_ID } from "@/app/Constants";
import userPermissions from "../userPermissions";

export async function createReview({
  user_id,
  book,
  star_rating,
  description,
  database,
}: {
  user_id: string;
  book: string;
  star_rating: Number;
  description: string;
  database: any;
}) {
  let res = await database.createDocument(
    MAIN_DB_ID,
    REVIEW_COL_ID,
    ID.unique(),
    {
      user_id,
      book,
      star_rating,
      description,
    },
    userPermissions(user_id),
  );
  return res.$id;
}
