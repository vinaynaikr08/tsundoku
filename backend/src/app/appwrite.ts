const sdk = require("node-appwrite");

import { AppwriteException } from "node-appwrite";
import Constants from "./Constants";
import { construct_development_api_response } from "./api/v0/dev_api_response";

export const client = new sdk.Client();

client
  .setEndpoint(Constants.APPWRITE_ENDPOINT)
  .setProject(Constants.APPWRITE_PROJECT_ID)
  .setKey(Constants.APPWRITE_API_KEY);

export function isAppwriteUserError(error: any) {
  return (
    error instanceof Error && Math.floor((error as AppwriteException).code! / 100) === 4
  );
}

export function formatAppwriteUserError(error: any) {
  return construct_development_api_response({
    message: (error as AppwriteException).message,
    status_code: (error as AppwriteException).code!,
  });
}
