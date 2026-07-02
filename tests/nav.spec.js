import { test, expect } from "@playwright/test";

test("clicking sidebar topic clears search and navigates", async ({ page }) => {
  await page.goto("/");

  // type a search -> forces all-sheets view
  await page.locator(".search input").fill("vec");
  await expect(page).toHaveURL(/q=vec/);

  // click a specific topic in the sidebar
  const item = page.locator(".sidebar .nav-item", { hasText: "Ownership" });
  await item.click();

  // search cleared
  await expect(page.locator(".search input")).toHaveValue("");
  await expect(page).not.toHaveURL(/q=/);

  // that topic is active and its page is shown
  await expect(item).toHaveClass(/active/);
  await expect(page).toHaveURL(/page=/);
});

test("Escape twice clears the search", async ({ page }) => {
  await page.goto("/");
  const input = page.locator(".search input");
  await input.fill("vec");
  await expect(page).toHaveURL(/q=vec/);
  await expect(input).toBeFocused();

  // 1st Escape blurs, query still set
  await page.keyboard.press("Escape");
  await expect(input).not.toBeFocused();
  await expect(input).toHaveValue("vec");

  // 2nd Escape clears it
  await page.keyboard.press("Escape");
  await expect(input).toHaveValue("");
  await expect(page).not.toHaveURL(/q=/);
});
