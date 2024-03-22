import { construct_development_api_response } from "../../dev_api_response";

export async function GET(
  { params }: { params: { error_code: string } },
) {
  return construct_development_api_response({
    message: "Here's your simulated error back!",
    status_code: Number(params.error_code),
  });
}
