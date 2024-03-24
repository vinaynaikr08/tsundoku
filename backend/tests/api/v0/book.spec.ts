import { test, expect } from "@playwright/test";

test("api v0 book search", async ({ page }) => {
  const response = await page.request.get(
    "http://localhost:3000/api/v0/books/search?title=Harry+Potter",
  );
  const responseBody = JSON.parse(await response.text());
  await expect(response).toBeOK();
  await expect(responseBody.message).toContain("Harry Potter");
});

test("api v0 book search missing param", async ({ page }) => {
  const response = await page.request.get(
    "http://localhost:3000/api/v0/books/search",
  );
  await expect(response.status()).toBe(400);
});
