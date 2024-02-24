import { test, expect } from "@playwright/test";

test("api v0 book search", async ({ page }) => {
  const response = await page.request.get("http://localhost:3000/api/v0/books/search?Harry+Potter");
  await expect(response).toBeOK();
});
