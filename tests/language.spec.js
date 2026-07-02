import { test, expect } from "@playwright/test";

test("language selector switches between Rust and C++ content", async ({
  page,
}) => {
  await page.goto("/");

  // defaults to Rust
  await expect(page.locator(".sheet-select")).toHaveValue("rust");
  await expect(page.locator(".sidebar")).toContainText("Vec<T>");

  // switch to C++
  await page.locator(".sheet-select").selectOption("cpp");
  await expect(page).toHaveURL(/lang=cpp/);

  // sidebar now shows C++ sheets, code is highlighted as cpp
  await expect(page.locator(".sidebar")).toContainText("vector");
  await expect(page.locator(".sidebar")).not.toContainText("Vec<T>");
  await expect(page.locator("pre.code code").first()).toHaveClass(/language-cpp/);

  // deep link keeps the language and persists across reload
  await page.reload();
  await expect(page.locator(".sheet-select")).toHaveValue("cpp");
  await expect(page.locator("pre.code code").first()).toHaveClass(/language-cpp/);

  // switch back to Rust
  await page.locator(".sheet-select").selectOption("rust");
  await expect(page.locator("pre.code code").first()).toHaveClass(/language-rust/);

  // Lua is available too
  await page.locator(".sheet-select").selectOption("lua");
  await expect(page).toHaveURL(/lang=lua/);
  await expect(page.locator(".sidebar")).toContainText("Tables as Arrays");
  await expect(page.locator("pre.code code").first()).toHaveClass(/language-lua/);
});
