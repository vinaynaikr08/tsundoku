import { unstable_noStore as noStore } from "next/cache";
import Constants from "@/app/Constants";
import JWTPage from "./JWTPage";
import React from "react";

function JWTServerPage() {
  noStore();
  return (
    <JWTPage
      endpoint={Constants.APPWRITE_ENDPOINT as string}
      project={Constants.APPWRITE_PROJECT_ID as string}
    />
  );
}

export default JWTServerPage;
