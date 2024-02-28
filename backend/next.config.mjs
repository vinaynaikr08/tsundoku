import {withSentryConfig} from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // This should probably be read from environment variables
    // TODO: change to environment variable reading!
    googleBooksAPIKey: "AIzaSyDdeix16-v0urpjbY5x9PMDGgxgMKQrHeU",
    appwriteEndpoint: "https://appwrite.tsundoku.ericswpark.com/v1",
    appwriteProjectID: "65ccf0b6d76765229231",
    appwriteAPIKey:
      "ba7005d251f29e5e5ad881ac21b22f74c188bc206845bbe7963ddf0593e412afb1bb3e4a62a4a9e34df3a637b6ea76c34fa8eb61f76a2db80c76db646621e6bb982be5b576ea03aa84c3426d9e48e4e61b318ed59327bce5534d84e6dc81bd90119e3e5f6c6c4bf3da694fcdf175e4571f5695d3ffa723884851d8b7f290c902",
    mainDBID: "65ce2a55036051cbf5fb",
    bookCollectionID: "65ce2a5a8bea7335ef01",
    authorCollectionID: "65ce2aa3affa7165ee7b",
    editionCollectionID: "65ce394edd6d6603ac1e",
    bookStatusCollectionID: "65da112a731dfc9bc51f",
    reviewCollectionID: "65da5ff3979f452f63d8",
  },
  output: "standalone",
};

export default withSentryConfig(nextConfig, {
// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options

// Suppresses source map uploading logs during build
silent: true,
org: "tsundoku-project-cs-307",
project: "tsundoku-backend",
}, {
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
});