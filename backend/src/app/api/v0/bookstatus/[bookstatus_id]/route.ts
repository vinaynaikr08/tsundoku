const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { Query } from "appwrite";

import { client } from "@/app/appwrite";
import { construct_development_api_response } from "../../dev_api_response";
import {
  MAIN_DB_ID,
  BOOK_STAT_COL_ID,
  createBookStatus,
  bookStatusPermissions,
} from "../common";

const database = new sdk.Databases(client);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { bookstatus_id: string } },
) {
  const data = await request.json();
  const bookstatus_id = params.bookstatus_id;
  const status = data.status;

  if (!status) {
    return NextResponse.json(
      { message: "Parameter `status` not supplied." },
      { status: 400 },
    );
  }

  let db_query = await database.getDocument(
    MAIN_DB_ID,
    BOOK_STAT_COL_ID,
    bookstatus_id,
  );

  if (db_query.total == 0) {
    return construct_development_api_response({
      message:
        "The specified ID does not have an associated book status entry!",
      status_code: 404,
    });
  } else {
    await database.updateDocument(
      MAIN_DB_ID,
      BOOK_STAT_COL_ID,
      bookstatus_id,
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
