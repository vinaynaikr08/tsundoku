const sdk = require("node-appwrite");

import Constants from "./Constants";

export const client = new sdk.Client();

client
  .setEndpoint(Constants.APPWRITE_ENDPOINT)
  .setProject(Constants.APPWRITE_PROJECT_ID)
  .setKey(Constants.APPWRITE_API_KEY);
