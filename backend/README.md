# Backend

[![Backend Playwright Tests](https://github.com/Purdue-CS307-tsundoku/tsundoku/actions/workflows/backend-playwright-tests.yml/badge.svg)](https://github.com/Purdue-CS307-tsundoku/tsundoku/actions/workflows/backend-playwright-tests.yml)

Backend project for Tsundoku, written with NextJS

## Build

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Test

To run tests, invoke Playwright:

```
npx playwright test     # supply --ui to run an interactive test window
```

## Docs

To see the backend documentation, run the following commands:

```bash
pip install -r requirements.txt
mkdocs serve
```
