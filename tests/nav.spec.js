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
