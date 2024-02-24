const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { Query } from "appwrite";

import { client } from "@/app/appwrite";

const databases = new sdk.Databases(client);

const MAIN_DB_ID = process.env.mainDBID;
const AUTHOR_COLLECTION_ID = process.env.authorCollectionID;

function construct_development_api_response(
  message: string,
  response_name: string,
  response_data: any,
) {
  return NextResponse.json(
    {
      message,
      warning:
        "You are calling a development API! The schema may change without warning.",
      [response_name]: response_data,
    },
    { status: 200 },
  );
}

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { message: `Parameters not supplied.` },
      { status: 400 },
    );
  }

  let db_query = await databases.listDocuments(
    MAIN_DB_ID,
    AUTHOR_COLLECTION_ID,
    [Query.equal("name", name as string)],
  );

  return construct_development_api_response(
    `DB search results for: ${name}`,
    "results",
    db_query,
  );
}
