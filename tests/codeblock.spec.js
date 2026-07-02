import { test, expect } from "@playwright/test";

test("copy button stays put when code scrolls horizontally", async ({
  page,
}) => {
  await page.goto("/");

  await page.locator("pre.code").first().waitFor();

  // pick the index of a code block that actually overflows horizontally
  const idx = await page.evaluate(() => {
    const pres = [...document.querySelectorAll("pre.code")];
    return pres.findIndex((el) => el.scrollWidth > el.clientWidth + 4);
  });
  expect(idx).toBeGreaterThanOrEqual(0); // at least one overflows

  const pre = page.locator("pre.code").nth(idx);
  const btn = page.locator(".code-wrap").nth(idx).locator(".copy-btn");

  const before = await btn.boundingBox();

  const scrolled = await pre.evaluate((el) => {
    el.scrollLeft = el.scrollWidth; // max scroll
    return el.scrollLeft;
  });
  expect(scrolled).toBeGreaterThan(0); // genuinely scrolled

  const after = await btn.boundingBox();
  expect(Math.abs(after.x - before.x)).toBeLessThan(1); // did not move
  expect(Math.abs(after.y - before.y)).toBeLessThan(1);
});

test("word-wrap toggle (button + w key) flips code white-space", async ({
  page,
}) => {
  await page.goto("/");
  const code = page.locator("pre.code code").first();
  const ws = () => code.evaluate((el) => getComputedStyle(el).whiteSpace);
  const attr = () =>
    page.evaluate(() => document.documentElement.getAttribute("data-wrap"));

  expect(await ws()).toBe("pre");

  await page.locator(".wrap-toggle").click();
  expect(await attr()).toBe("on");
  expect(await ws()).toBe("pre-wrap");
  await expect(page.locator(".wrap-toggle")).toHaveAttribute(
    "aria-checked",
    "true",
  );

  // 'w' shortcut toggles back off
  await page.locator("body").press("w");
  expect(await attr()).toBe("off");
  expect(await ws()).toBe("pre");
});
