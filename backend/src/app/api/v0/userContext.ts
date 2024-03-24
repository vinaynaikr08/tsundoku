const sdk = require("node-appwrite");

import Constants from "@/app/Constants";
import { formatAppwriteUserError, isAppwriteUserError } from "@/app/appwrite";
import { construct_development_api_response } from "./dev_api_response";
import { AppwriteException } from "node-appwrite";

export function getUserContextDBAccount(authToken: string) {
  const userClient = new sdk.Client()
    .setEndpoint(Constants.APPWRITE_ENDPOINT)
    .setProject(Constants.APPWRITE_PROJECT_ID)
    .setJWT(authToken);
  const userDB = new sdk.Databases(userClient);
  const userAccount = new sdk.Account(userClient);

  return { userDB, userAccount };
}

async function getUserID(userAccount: any) {
  return (await userAccount.get()).$id;
}

export async function checkUserToken(token: string) {
  const { userAccount } = getUserContextDBAccount(token);
  try {
    return await getUserID(userAccount);
  } catch (error: any) {
    if (isAppwriteUserError(error)) {
      // @ts-ignore: there's no type declared in AppwriteException, this is expected
      switch ((error as AppwriteException).type) {
        case "user_jwt_invalid":
          return construct_development_api_response({
            message: "Authentication failed.",
            status_code: 401,
          });
        default:
          return formatAppwriteUserError(error);
      }
    } else {
      console.log(error);
      return construct_development_api_response({
        message: "Unknown error. Please contact the developers.",
        status_code: 500,
      });
    }
  }
}
