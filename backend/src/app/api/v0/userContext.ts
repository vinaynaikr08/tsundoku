const sdk = require("node-appwrite");

import Constants from "@/app/Constants";

export function getUserContextDBAccount(authToken: string) {
  const userClient = new sdk.Client()
    .setEndpoint(Constants.APPWRITE_ENDPOINT)
    .setProject(Constants.APPWRITE_PROJECT_ID)
    .setJWT(authToken);
  const userDB = new sdk.Databases(userClient);
  const userAccount = new sdk.Account(userClient);

  return { userDB, userAccount };
}
