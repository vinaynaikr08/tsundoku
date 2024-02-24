const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { Query } from "appwrite";

import { client } from "@/app/appwrite";
import { construct_development_api_response } from "../../dev_api_response";

const databases = new sdk.Databases(client);

const MAIN_DB_ID = process.env.mainDBID;
const AUTHOR_COLLECTION_ID = process.env.authorCollectionID;

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

  return construct_development_api_response({
    message: `DB search results for: ${name}`,
    response_name: "results",
    response_data: db_query,
  });
}
