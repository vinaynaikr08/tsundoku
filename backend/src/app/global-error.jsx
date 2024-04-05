"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import React from "react";

export default function GlobalError({ error }) {
  React.useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <Error />
      </body>
    </html>
  );
}
