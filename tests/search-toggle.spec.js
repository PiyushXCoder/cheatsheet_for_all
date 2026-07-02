import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 780 } });

test("search is hidden by default on mobile and toggles via button + 's'", async ({
  page,
}) => {
  await page.goto("/");

  const search = page.locator(".header .search");
  const toggle = page.locator(".search-toggle");

  // hidden by default, toggle button visible
  await expect(search).toBeHidden();
  await expect(toggle).toBeVisible();

  // button reveals it and focuses the input
  await toggle.click();
  await expect(search).toBeVisible();
  await expect(page.locator(".search input")).toBeFocused();
  await expect(toggle).toHaveClass(/on/);

  // 's' key toggles it back off (press on body, not the input)
  await page.locator(".sheet-select").focus();
  await page.keyboard.press("s");
  await expect(search).toBeHidden();

  // 's' opens again
  await page.keyboard.press("s");
  await expect(search).toBeVisible();
});

test("search bar always visible on desktop (no toggle button)", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 700 });
  await page.goto("/");
  await expect(page.locator(".header .search")).toBeVisible();
  await expect(page.locator(".search-toggle")).toBeHidden();
});
