import { ID } from "node-appwrite";

import Constants from "@/app/Constants";

export async function createReviewVote({
  user_id,
  review_id,
  vote,
  database,
}: {
  user_id: string;
  review_id: string;
  vote: string;
  database: any;
}) {
  const res = await database.createDocument(
    Constants.MAIN_DB_ID,
    Constants.REVIEW_VOTES_COL_ID,
    ID.unique(),
    {
      user_id,
      review_id,
      vote,
    },
  );
  return res.$id;
}
