import { test, expect } from "@playwright/test";

const body = (page) => page.locator("body");

test("number keys switch language (1=Rust, 2=C++, 3=Lua)", async ({ page }) => {
  await page.goto("/");
  await body(page).press("2");
  await expect(page).toHaveURL(/lang=cpp/);
  await expect(page.locator(".sheet-select")).toHaveValue("cpp");

  await body(page).press("3");
  await expect(page).toHaveURL(/lang=lua/);

  await body(page).press("1");
  await expect(page.locator(".sheet-select")).toHaveValue("rust");
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

test("space e toggles collapse: collapsing keeps focus off, expanding focuses", async ({
  page,
}) => {
  await page.goto("/"); // starts expanded
  const app = page.locator(".app");
  const sidebar = page.locator(".sidebar");

  // expanded -> collapse: must NOT focus the (now hidden) panel
  await body(page).press(" ");
  await body(page).press("e");
  await expect(app).toHaveClass(/collapsed/);
  await expect(sidebar).not.toBeFocused();

  // collapsed -> expand: focuses the panel
  await body(page).press(" ");
  await body(page).press("e");
  await expect(app).not.toHaveClass(/collapsed/);
  await expect(sidebar).toBeFocused();
});

test("space e works even while the sidebar is focused", async ({ page }) => {
  await page.goto("/");
  await body(page).press(" ");
  await body(page).press("o"); // focus sidebar
  await expect(page.locator(".sidebar")).toBeFocused();

  // chord still fires from inside the sidebar and collapses it
  await page.locator(".sidebar").press(" ");
  await page.locator(".sidebar").press("e");
  await expect(page.locator(".app")).toHaveClass(/collapsed/);
});
