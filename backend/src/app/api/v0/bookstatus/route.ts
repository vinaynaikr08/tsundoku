const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { ID, Permission, Query, Role } from "appwrite";

import { client } from "@/app/appwrite";
import { construct_development_api_response } from "../dev_api_response";

const databases = new sdk.Databases(client);

const MAIN_DB_ID = process.env.mainDBID;
const BOOK_STAT_COL_ID = process.env.bookStatusCollectionID;

enum BookStatus_Status {
  WANT_TO_READ,
  CURRENTLY_READING,
  READ,
  DID_NOT_FINISH,
}

function bookStatusPermissions(user_id: string) {
  return [
    Permission.read(Role.user(user_id)),
    Permission.update(Role.user(user_id)),
    Permission.delete(Role.user(user_id)),
  ];
}

async function createBookStatus({
  user_id,
  edition_id,
  status,
}: {
  user_id: string;
  edition_id: string;
  status: BookStatus_Status;
}) {
  let res = await databases.createDocument(
    MAIN_DB_ID,
    BOOK_STAT_COL_ID,
    ID.unique(),
    {
      user_id,
      edition_id,
      status,
    },
    bookStatusPermissions,
  );
  return res.$id;
}

export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json(
      { message: `Parameters not supplied.` },
      { status: 400 },
    );
  }

  let db_query = await databases.listDocuments(MAIN_DB_ID, BOOK_STAT_COL_ID, [
    Query.equal("user_id", user_id as string),
  ]);

  return construct_development_api_response({
    message: `Book status results for: ${user_id}`,
    response_name: "results",
    response_data: db_query,
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const user_id = data.user_id;
  const edition_id = data.edition_id;
  const status = data.status;

  if (!user_id || !edition_id || status) {
    return NextResponse.json(
      { message: `Parameters not supplied.` },
      { status: 400 },
    );
  }

  let db_query = await databases.listDocuments(MAIN_DB_ID, BOOK_STAT_COL_ID, [
    Query.equal("user_id", user_id),
    Query.equal("edition_id", edition_id),
  ]);

  if (db_query.total == 0) {
    // Create new object
    createBookStatus({ user_id, edition_id, status });
  } else {
    const book_status_id = db_query.documents[0].$id;

    await databases.updateDocument(
      MAIN_DB_ID,
      BOOK_STAT_COL_ID,
      book_status_id,
      {
        status: status,
      },
      bookStatusPermissions,
    );
  }

  return construct_development_api_response({
    message: `The book status item was updated.`,
  });
}
