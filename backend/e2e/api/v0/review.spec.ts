import { test, expect } from "@playwright/test";

test("api v0 review missing auth token", async ({ page }) => {
  const response = await page.request.get(
    "http://localhost:3000/api/v0/reviews/",
  );
  await expect(response.status()).toBe(401);
});

test("api v0 review by id missing auth token", async ({ page }) => {
  const response = await page.request.patch(
    "http://localhost:3000/api/v0/reviews/exampleid/",
  );
  console.log(response);
  await expect(response.status()).toBe(401);
});
