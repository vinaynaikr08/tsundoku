const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";

import { client } from "@/app/appwrite";
import { getOrFailAuthTokens } from "../helpers";
import { checkUserToken } from "../userContext";
import {
  construct_development_api_response,
  handle_error,
} from "../dev_api_response";
import { createAuthor } from "./common";

const database = new sdk.Databases(client);

export async function POST(request: NextRequest) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  let name;
  try {
    const data = await request.json();
    name = data.name;
  } catch (error) {
    return construct_development_api_response({
      message: "Bad request supplied.",
      status_code: 400,
    });
  }

  if (!name) {
    return construct_development_api_response({
      message: `Required parameters not supplied.`,
      status_code: 400,
    });
  }

  // Create new object
  try {
    const author_id = await createAuthor({
      database,
      name,
    });

    return construct_development_api_response({
      message: `The author ${name} was created.`,
      response_name: "results",
      response_data: {
        name,
        author_id,
      },
    });
  } catch (error) {
    handle_error(error);
  }
}
