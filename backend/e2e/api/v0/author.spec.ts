import { test, expect } from "@playwright/test";

test("api v0 author search", async ({ page }) => {
  const response = await page.request.get(
    "http://localhost:3000/api/v0/authors/search?name=Robert+Muchamore",
  );
  const responseBody = JSON.parse(await response.text());
  await expect(response).toBeOK();
  await expect(responseBody.message).toContain("Robert Muchamore");
});

test("api v0 author search missing param", async ({ page }) => {
  const response = await page.request.get(
    "http://localhost:3000/api/v0/authors/search",
  );
  await expect(response.status()).toBe(400);
});
