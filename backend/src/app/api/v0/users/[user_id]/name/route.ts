const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";

import { construct_development_api_response } from "../../../dev_api_response";
import { checkUserToken } from "../../../userContext";
import { client } from "@/app/appwrite";
import { AppwriteException } from "node-appwrite";
import { getOrFailAuthTokens } from "../../../helpers";

const users = new sdk.Users(client);

export async function GET(
  _request: NextRequest,
  { params }: { params: { user_id: string } },
) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const tokenCheck = await checkUserToken(authToken);
  if (tokenCheck instanceof NextResponse) return tokenCheck;

  const user_id = params.user_id;
  try {
    const user_data = await users.get(user_id);

    return construct_development_api_response({
      message: `Query succeeded.`,
      response_data: user_data.name,
      response_name: "name",
    });
  } catch (error: any) {
    if ((error as AppwriteException).message === "user_not_found") {
      return construct_development_api_response({
        message: "The specified user ID cannot be found.",
        status_code: 404,
      });
    }
    throw error;
  }
}
