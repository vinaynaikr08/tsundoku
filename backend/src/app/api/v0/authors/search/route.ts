const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import { construct_development_api_response } from "../../dev_api_response";

import Constants from "@/app/Constants";

const databases = new sdk.Databases(client);

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { message: `Parameters not supplied.` },
      { status: 400 },
    );
  }

  let db_query = await databases.listDocuments(
    Constants.MAIN_DB_ID,
    Constants.AUTHOR_COL_ID,
    [Query.search("name", name as string)],
  );

  return construct_development_api_response({
    message: `DB search results for: ${name}`,
    response_name: "results",
    response_data: db_query,
  });
}
