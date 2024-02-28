const sdk = require("node-appwrite");

export function getUserContextDBAccount(authToken: string) {
  const userClient = new sdk.Client()
    .setEndpoint(process.env.appwriteEndpoint)
    .setProject(process.env.appwriteProjectID)
    .setJWT(authToken);
  const userDB = new sdk.Databases(userClient);
  const userAccount = new sdk.Account(userClient);

  return { userDB, userAccount };
}
