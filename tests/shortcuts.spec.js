import { test, expect } from "@playwright/test";

const body = (page) => page.locator("body");

test("number keys jump to Nth cheatsheet", async ({ page }) => {
  await page.goto("/");
  await body(page).press("3");
  const before = page.url();
  await body(page).press("5");
  await expect(page).toHaveURL(/page=/);
  expect(page.url()).not.toBe(before); // different sheet
});

test("Ctrl+Shift+j / Ctrl+Shift+k step topics", async ({ page }) => {
  await page.goto("/");
  await body(page).press("2"); // land on 2nd sheet (non-default -> has page param)
  await expect(page).toHaveURL(/page=/);
  const u1 = page.url();

  await body(page).press("Control+Shift+J"); // next topic
  await expect(page).not.toHaveURL(u1);

  await body(page).press("Control+Shift+K"); // back
  await expect(page).toHaveURL(u1);
});

test("space o focuses sidebar; j/k move cursor; Enter opens + returns focus", async ({
  page,
}) => {
  await page.goto("/");
  await body(page).press(" ");
  await body(page).press("o");

  const sidebar = page.locator(".sidebar");
  await expect(sidebar).toBeFocused();

  // cursor visible, moves with j
  await sidebar.press("j");
  await expect(page.locator(".sidebar .nav-item.cursor")).toBeVisible();
  await sidebar.press("j");
  await sidebar.press("k");

  const target = await page
    .locator(".sidebar .nav-item.cursor")
    .getAttribute("title");

  await sidebar.press("Enter");

  // focus left the sidebar (back to page)
  await expect(sidebar).not.toBeFocused();
  // opened sheet matches the cursor item
  await expect(
    page.locator(".sidebar .nav-item.active"),
  ).toHaveAttribute("title", target);
});

test("focusing the sidebar on desktop shows no backdrop overlay", async ({
  page,
}) => {
  await page.goto("/"); // Desktop Chrome viewport (wide)
  await body(page).press(" ");
  await body(page).press("o");
  await expect(page.locator(".sidebar")).toBeFocused();
  // the mobile backdrop must not cover the screen on desktop
  await expect(page.locator(".sidebar-backdrop")).toBeHidden();
});

test("space e focuses the sidebar too", async ({ page }) => {
  await page.goto("/");
  await body(page).press(" ");
  await body(page).press("e");
  await expect(page.locator(".sidebar")).toBeFocused();
});
