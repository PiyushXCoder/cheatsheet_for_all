import { test, expect } from "@playwright/test";

// 820-970px: desktop grid keeps the sidebar column, so the top bar is narrow.
test.use({ viewport: { width: 900, height: 700 } });

test("top bar controls stay visible at 900px (sidebar open)", async ({
  page,
}) => {
  await page.goto("/");

  const overflow = await page
    .locator(".header")
    .evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  // Practice button fully within the header (not clipped off the right)
  const btn = await page.locator(".practice-btn").boundingBox();
  const hdr = await page.locator(".header").boundingBox();
  expect(btn.x + btn.width).toBeLessThanOrEqual(hdr.x + hdr.width + 1);
  await expect(page.locator(".practice-btn")).toBeVisible();

  // search wrapped to its own row below the controls
  const sel = await page.locator(".sheet-select").boundingBox();
  const search = await page.locator(".search").boundingBox();
  expect(search.y).toBeGreaterThan(sel.y + sel.height - 1);
});
