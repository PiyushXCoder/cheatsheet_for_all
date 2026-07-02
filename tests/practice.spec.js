import { test, expect } from "@playwright/test";

test("Practice page lists 150 questions, checkbox persists to localStorage", async ({
  page,
}) => {
  await page.goto("/");

  // open via top-bar button
  await page.locator(".practice-btn").click();
  await expect(page.locator(".practice h1")).toContainText("150");
  await expect(page.locator(".practice-row")).toHaveCount(150);
  await expect(page.locator(".practice-count")).toContainText("0 / 150");

  // check the first question (real checkbox is visually hidden; click the label)
  const first = page.locator(".practice-row").first();
  await first.locator(".practice-check").click();
  await expect(first).toHaveClass(/done/);
  await expect(first.locator("input")).toBeChecked();
  await expect(page.locator(".practice-count")).toContainText("1 / 150");

  // persisted in localStorage
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("practice-done")),
  );
  expect(Object.keys(stored)).toEqual(["contains-duplicate"]);

  // survives reload
  await page.reload();
  await page.locator(".practice-btn").click();
  await expect(page.locator(".practice-count")).toContainText("1 / 150");
  await expect(
    page.locator(".practice-row").first().locator("input"),
  ).toBeChecked();

  // link points at leetcode
  await expect(first.locator("a.practice-title")).toHaveAttribute(
    "href",
    "https://leetcode.com/problems/contains-duplicate/",
  );
});
