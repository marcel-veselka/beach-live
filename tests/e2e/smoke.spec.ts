import { test, expect } from "@playwright/test"

test.describe("Smoke tests", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/Beach Live/)
  })

  test("navigation links are present", async ({ page }) => {
    await page.goto("/")
    // Check that navigation contains main sections
    const nav = page.locator("nav")
    await expect(nav.first()).toBeVisible()
  })

  test("bracket page loads", async ({ page }) => {
    await page.goto("/bracket")
    // Should show either bracket content or empty state
    await expect(page.locator("h1, [class*='empty']").first()).toBeVisible()
  })
})
