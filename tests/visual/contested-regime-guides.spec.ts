import { expect, test } from "@playwright/test";

const routes = [
  "/guides/authoritarianism/",
  "/guides/fascism/",
  "/guides/totalitarianism/",
  "/cases/italian-fascist-dictatorship-1925-1943/",
  "/cases/nazi-consolidation-1933/",
];
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile", width: 390, height: 844 },
];

for (const viewport of viewports) {
  test(`contested regime guides and cases remain readable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.ok(), route).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), `${route} at ${viewport.width}px`).toBeLessThanOrEqual(1);
      const summaries = page.locator("summary");
      expect(await summaries.count(), `${route} evidence disclosures`).toBeGreaterThan(0);
      expect(await summaries.evaluateAll((items) => items.every((item) => (item.textContent ?? "").trim().length > 0))).toBe(true);
    }
  });
}
