import { NextResponse } from "next/server";

export function construct_development_api_response({
  message,
  response_name,
  response_data,
  status_code,
}: {
  message: string;
  response_name: string | null;
  response_data: any | null;
  status_code: number;
}) {
  if (response_name) {
    return NextResponse.json(
      {
        message,
        warning:
          "You are calling a development API! The schema may change without warning.",
        [response_name]: response_data,
      },
      { status: status_code },
    );
  }
  return NextResponse.json(
    {
      message,
      warning:
        "You are calling a development API! The schema may change without warning.",
    },
    { status: status_code },
  );
}
