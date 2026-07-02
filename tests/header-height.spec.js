import { test, expect } from "@playwright/test";

test("all top-bar controls share the same height", async ({ page }) => {
  await page.goto("/");
  await page.locator(".header").waitFor();

  const controls = [
    page.locator(".sheet-select"),
    page.locator(".search"),
    page.locator(".wrap-toggle"),
    page.locator(".header .icon-btn").locator("visible=true").last(), // theme btn
  ];
  const heights = [];
  for (const c of controls) {
    const box = await c.boundingBox();
    heights.push(Math.round(box.height));
  }

  // every control equals the first
  for (const h of heights) expect(h).toBe(heights[0]);
});
