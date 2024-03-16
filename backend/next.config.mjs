import { withSentryConfig } from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    googleBooksAPIKey: process.env.TSUNDOKU_BACKEND_GOOGLE_BOOKS_API_KEY,
    appwriteEndpoint: process.env.TSUNDOKU_BACKEND_APPWRITE_ENDPOINT,
    appwriteProjectID: process.env.TSUNDOKU_BACKEND_APPWRITE_PROJECT_ID,
    appwriteAPIKey: process.env.TSUNDOKU_BACKEND_APPWRITE_API_KEY,
    mainDBID: process.env.TSUNDOKU_BACKEND_APPWRITE_MAIN_DB_ID,
    bookCollectionID: process.env.TSUNDOKU_BACKEND_APPWRITE_BOOK_COL_ID,
    authorCollectionID: process.env.TSUNDOKU_BACKEND_APPWRITE_AUTHOR_COL_ID,
    editionCollectionID: process.env.TSUNDOKU_BACKEND_APPWRITE_EDITION_COL_ID,
    bookStatusCollectionID: process.env.TSUNDOKU_BACKEND_APPWRITE_BOOKSTATUS_COL_ID,
    reviewCollectionID: process.env.TSUNDOKU_BACKEND_APPWRITE_REVIEW_COL_ID,
  },
  output: "standalone",
};

export default withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "tsundoku-project-cs-307",
    project: "tsundoku-backend",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);
