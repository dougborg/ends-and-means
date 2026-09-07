import { expect, type Page } from "@playwright/test";

/**
 * Wait for the application-owned render boundary of a static Astro page.
 *
 * DOMContentLoaded proves that the response was committed, the document was
 * parsed, and synchronous scripts ran. The visible main landmark is the
 * page-level contract. Third-party activity is not part of application
 * readiness and must not hold navigation assertions open.
 */
export async function gotoRenderedPage(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });

  expect(response?.ok(), route).toBe(true);
  await expect(page.locator("main#main-content"), route).toBeVisible();

  return response;
}
