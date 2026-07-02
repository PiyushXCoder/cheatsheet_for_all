import { test } from "@playwright/test";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

test("take full-page screenshot of default view", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForSelector(".main");

  // Let any animations/lazy content settle
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: join(ROOT, "screenshot.png"),
    fullPage: true,
  });
});
