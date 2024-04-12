const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

import { client } from "@/app/appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "../../dev_api_response";

import Constants from "@/app/Constants";
import { getRequiredSearchParamOrFail } from "../../helpers";

const databases = new sdk.Databases(client);

export async function GET(request: NextRequest) {
  const name = getRequiredSearchParamOrFail(request, "name");
  if (name instanceof NextResponse) return name;

  const exact = request.nextUrl.searchParams.get("exact") as string;

  let db_query;
  try {
    db_query = await databases.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.AUTHOR_COL_ID,
      [
        exact && exact == "true"
          ? Query.equal("name", name as string)
          : Query.search("name", name as string),
      ],
    );
  } catch (error: any) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `DB search results for: ${name}`,
    response_name: "results",
    response_data: db_query,
  });
}
