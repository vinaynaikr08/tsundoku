const sdk = require('node-appwrite');

export const client = new sdk.Client();

client
    .setEndpoint(process.env.appwriteEndpoint)
    .setProject(process.env.appwriteProjectID)
    .setKey(process.env.appwriteAPIKey)
    .setSelfSigned();

