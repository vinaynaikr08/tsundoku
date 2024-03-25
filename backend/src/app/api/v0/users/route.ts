const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";

import {
  construct_development_api_response,
  handle_error,
} from "../dev_api_response";
import { checkUserToken } from "../userContext";
import { client } from "@/app/appwrite";
import { Query } from "node-appwrite";
import { getOrFailAuthTokens } from "../helpers";
import Constants from "@/app/Constants";

const users = new sdk.Users(client);
const databases = new sdk.Databases(client);

export async function DELETE(_request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  try {
    // Delete all user data
    await deleteAllUserDocument(Constants.NOTIFICATION_PREF_COL_ID!, user_id);
    await deleteAllUserDocument(Constants.BOOK_STAT_COL_ID!, user_id);
    await deleteAllUserCustomPropCategories(user_id);
    await deleteAllUserDocument(Constants.CUSTOM_PROP_DATA_COL_ID!, user_id);
    await deleteAllUserDocument(
      Constants.CUSTOM_PROP_TEMPLATE_COL_ID!,
      user_id,
    );
    await deleteAllFriendRelations(user_id);
    await deleteAllUserDocument(Constants.REVIEW_COL_ID!, user_id);
    await deleteAllUserDocument(Constants.USERDATA_COL_ID!, user_id);

    // Delete account from Appwrite
    await users.delete(user_id);
  } catch (error: any) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: "The account was successfully deleted. May we meet again...",
  });
}

async function deleteAllUserDocument(db_id: string, user_id: string) {
  const query = await databases.listDocuments(Constants.MAIN_DB_ID, db_id, [
    Query.equal("user_id", user_id),
  ]);
  for (const doc of query.documents) {
    await databases.deleteDocument(Constants.MAIN_DB_ID, db_id, doc.$id);
  }
}

async function deleteAllUserCustomPropCategories(user_id: string) {
  const query = await databases.listDocuments(
    Constants.MAIN_DB_ID,
    Constants.CUSTOM_PROP_TEMPLATE_COL_ID,
    [Query.equal("user_id", user_id)],
  );
  const target_template_ids = query.documents
    .filter((doc: any) => doc.type === "CATEGORICAL")
    .map((doc: any) => {
      return doc.$id;
    });

  for (const target_template_id of target_template_ids) {
    const category_id = (
      await databases.listDocuments(
        Constants.MAIN_DB_ID,
        Constants.CUSTOM_PROP_CATEGORY_COL_ID,
        [Query.equal("template_id", target_template_id)],
      )
    ).documents[0].$id;
    await databases.deleteDocument(
      Constants.MAIN_DB_ID,
      Constants.CUSTOM_PROP_CATEGORY_COL_ID,
      category_id,
    );
  }
}

async function deleteAllFriendRelations(user_id: string) {
  const friend_relation_ids = await databases
    .listDocuments(Constants.MAIN_DB_ID, Constants.FRIEND_COL_ID, [
      // You might get an error about `or` not existing in `Query`, this is normal
      // This is because the Appwrite Node SDK doesn't have the type declaration for it *yet*
      // @ts-ignore: upstream issue
      Query.or(
        Query.equal("requester", user_id),
        Query.equal("requestee", user_id),
      ),
    ])
    .documents.map((doc: any) => doc.$id);

  for (const friend_relation_id of friend_relation_ids) {
    await databases.deleteDocument(
      Constants.MAIN_DB_ID,
      Constants.FRIEND_COL_ID,
      friend_relation_id,
    );
  }
}
