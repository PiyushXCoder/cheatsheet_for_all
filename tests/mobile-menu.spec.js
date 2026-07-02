import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 780 } });

test("floating menu toggles sidebar on small screens", async ({ page }) => {
  await page.goto("/");

  const fab = page.locator(".floating-menu-btn");
  const sidebar = page.locator(".sidebar");

  // floating button visible, header hamburger hidden
  await expect(fab).toBeVisible();
  await expect(page.locator(".header .menu-btn")).toBeHidden();

  // sidebar off-screen initially
  expect((await sidebar.boundingBox()).x).toBeLessThan(0);

  // 50% opacity at rest
  expect(await fab.evaluate((n) => getComputedStyle(n).opacity)).toBe("0.5");

  // bottom-left placement
  const box = await fab.boundingBox();
  expect(box.x).toBeLessThan(60);
  expect(box.y).toBeGreaterThan(700);

  // open
  await fab.click();
  await expect(sidebar).toHaveClass(/open/);
  await page.waitForTimeout(300); // slide-in transition
  expect((await sidebar.boundingBox()).x).toBe(0);
  await page.screenshot({ path: "test-results/mobile-open.png" });

  // backdrop closes
  await page.locator(".sidebar-backdrop").click({ position: { x: 350, y: 400 } });
  await expect(sidebar).not.toHaveClass(/open/);
});
