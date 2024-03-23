import { headers } from "next/headers";
import { construct_development_api_response } from "./dev_api_response";
import { NextRequest } from "next/server";

export function getOrFailAuthTokens() {
  const authToken = (headers().get("authorization") || "")
    .split("Bearer ")
    .at(1);

  if (!authToken) {
    return construct_development_api_response({
      message: "Authentication token is missing.",
      status_code: 401,
    });
  }

  return authToken;
}

export function getRequiredSearchParamOrFail(
  request: NextRequest,
  param_name: string,
) {
  const param = request.nextUrl.searchParams.get(param_name) as string;

  if (!param) {
    return construct_development_api_response({
      message: `Parameter \`${param_name}\` not supplied.`,
      status_code: 400,
    });
  }

  return param;
}
