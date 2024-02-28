import { Client } from "appwrite";

export const client = new Client();

client
  .setEndpoint("https://appwrite.tsundoku.ericswpark.com/v1")
  .setProject("65ccf0b6d76765229231");
