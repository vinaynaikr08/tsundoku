const sdk = require("node-appwrite");

import { NextRequest } from "next/server";
import { headers } from "next/headers";

import { construct_development_api_response } from "../../../dev_api_response";
import { getUserContextDBAccount } from "../../../userContext";
import { client } from "@/app/appwrite";
import { AppwriteException } from "appwrite";

const users = new sdk.Users(client);

export async function GET(
  request: NextRequest,
  { params }: { params: { user_id: string } },
) {
  const authToken = (headers().get("authorization") || "")
    .split("Bearer ")
    .at(1);

  if (!authToken) {
    return construct_development_api_response({
      message: "Authentication token is missing.",
      status_code: 401,
    });
  }

  const { userAccount } = getUserContextDBAccount(authToken);

  try {
    await userAccount.get();
  } catch (error: any) {
    return construct_development_api_response({
      message: "Authentication token is invalid.",
      status_code: 401,
    });
  }

  const user_id = params.user_id;
  try {
    const user_data = await users.get(user_id);

    return construct_development_api_response({
      message: `Query succeeded.`,
      response_data: user_data.name,
      response_name: "name",
    });
  } catch (error: any) {
    if ((error as AppwriteException).type === "user_not_found") {
      return construct_development_api_response({
        message: "The specified user ID cannot be found.",
        status_code: 404,
      });
    }
    throw error;
  }
}
