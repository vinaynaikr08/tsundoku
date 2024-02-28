const sdk = require("node-appwrite");

import { ID, Permission, Role } from "appwrite";

import { MAIN_DB_ID, BOOK_STAT_COL_ID } from "@/app/Constants";

export enum BookStatus_Status {
  WANT_TO_READ,
  CURRENTLY_READING,
  READ,
  DID_NOT_FINISH,
}

export function bookStatusPermissions(user_id: string) {
  return [
    Permission.read(Role.user(user_id)),
    Permission.update(Role.user(user_id)),
    Permission.delete(Role.user(user_id)),
  ];
}

export async function createBookStatus({
  user_id,
  book_id,
  status,
  database
}: {
  user_id: string;
  book_id: string;
  status: BookStatus_Status;
  database: any;
}) {
  let res = await database.createDocument(
    MAIN_DB_ID,
    BOOK_STAT_COL_ID,
    ID.unique(),
    {
      user_id,
      book_id,
      status,
    },
    bookStatusPermissions,
  );
  return res.$id;
}

export function getUserContextDBAccount(authToken: string) {
  const userClient = new sdk.Client()
    .setEndpoint(process.env.appwriteEndpoint)
    .setProject(process.env.appwriteProjectID)
    .setJWT(authToken);
  const userDB = new sdk.Databases(userClient);
  const userAccount = new sdk.Account(userClient);

  return { userDB, userAccount };
}