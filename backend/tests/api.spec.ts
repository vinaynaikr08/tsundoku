import { test, expect } from "@playwright/test";

test("api v0 book search", async ({ page }) => {
  const response = await page.request.get(
    "http://localhost:3000/api/v0/books/search?title=Harry+Potter",
  );
  await expect(response).toBeOK();
});

test("api v0 author search", async ({ page }) => {
  const response = await page.request.get(
    "http://localhost:3000/api/v0/authors/search?name=Robert+Muchamore",
  );
  await expect(response).toBeOK();
});

test("api v0 book search missing param", async ({ page }) => {
  const response = await page.request.get(
    "http://localhost:3000/api/v0/books/search",
  );
  await expect(response.status()).toBe(400);
});

test("api v0 author search missing param", async ({ page }) => {
  const response = await page.request.get(
    "http://localhost:3000/api/v0/authors/search",
  );
  await expect(response.status()).toBe(400);
});

test("api v0 book status missing auth token", async ({ page }) => {
  const response = await page.request.get(
    "http://localhost:3000/api/v0/bookstatus",
  );
  await expect(response.status()).toBe(401);
});

test("api v0 book status by id missing auth token", async ({ page }) => {
  const response = await page.request.patch(
    "http://localhost:3000/api/v0/bookstatus/exampleid/",
  );
  console.log(response);
  await expect(response.status()).toBe(401);
});

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
