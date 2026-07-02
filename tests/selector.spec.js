import { test, expect } from "@playwright/test";

test("language selector shows Rust with spaced arrow", async ({ page }) => {
  await page.goto("/");
  const sel = page.locator(".sheet-select");
  await expect(sel).toBeVisible();
  await expect(sel).toHaveValue("rust");

  // arrow must not hug the right edge
  const paddingRight = await sel.evaluate((n) =>
    parseFloat(getComputedStyle(n).paddingRight),
  );
  expect(paddingRight).toBeGreaterThanOrEqual(12);

  await sel.screenshot({ path: "test-results/selector.png" });
});
