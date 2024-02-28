import { ID, Permission, Role } from "appwrite";

import { MAIN_DB_ID, BOOK_STAT_COL_ID } from "@/app/Constants";

export function reviewPermissions(user_id: string) {
  return [
    Permission.read(Role.user(user_id)),
    Permission.update(Role.user(user_id)),
    Permission.delete(Role.user(user_id)),
  ];
}

export async function createReview({
  user_id,
  book,
  star_rating,
  description,
  database
}: {
  user_id: string;
  book: string;
  star_rating: Number;
  description: string;
  database: any;
}) {
  let res = await database.createDocument(
    MAIN_DB_ID,
    BOOK_STAT_COL_ID,
    ID.unique(),
    {
      user_id,
      book,
      status,
    },
    reviewPermissions,
  );
  return res.$id;
}
