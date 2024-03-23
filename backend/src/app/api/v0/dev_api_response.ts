import { formatAppwriteUserError, isAppwriteUserError } from "@/app/appwrite";
import { NextResponse } from "next/server";


export function handle_error(error: any) {
  if (isAppwriteUserError(error)) {
    return formatAppwriteUserError(error);
  } else {
    console.error(error);
    return unknown_error_response();
  }
}

export function unknown_error_response() {
  return construct_development_api_response({
    message: "Unknown error. Please contact the developers.",
    status_code: 500,
  });
}

export function construct_development_api_response({
  message,
  response_name,
  response_data,
  status_code = 200,
}: {
  message: string;
  response_name?: string | null;
  response_data?: any | null;
  status_code?: number;
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
