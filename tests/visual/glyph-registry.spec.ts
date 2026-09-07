import { expect, test } from "@playwright/test";
import { canonicalGraph } from "../../src/lib/domain/canonical";

const guideRoutes = canonicalGraph.subjectGuides.map(
  (guide) => `/guides/${guide.slug}/`,
);

test("glyphs remain supplemental, legible, and printable", async ({ page }) => {
  await page.goto("/guides/economic-democracy/", { waitUntil: "networkidle" });

  const glyphs = page.locator("main .glyph");
  const visibleSectionGlyph = page
    .locator(".subject-guide__section > header .glyph")
    .first();
  expect(await glyphs.count()).toBeGreaterThan(6);
  await expect(visibleSectionGlyph).toBeVisible();
  await expect(visibleSectionGlyph.locator("svg")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(visibleSectionGlyph.locator("svg")).toHaveAttribute(
    "focusable",
    "false",
  );
  const bounds = await visibleSectionGlyph.evaluate((element) => {
    const { width, height } = element.getBoundingClientRect();
    return { width, height };
  });
  expect(bounds.width).toBeGreaterThanOrEqual(12);
  expect(bounds.height).toBeGreaterThanOrEqual(12);
  expect(Math.abs(bounds.width - bounds.height)).toBeLessThan(1);

  const labels = await page.locator("main .glyph-label").allTextContents();
  expect(labels.every((label) => label.trim().length > 0)).toBe(true);

  const evidenceGlyph = page
    .locator('.subject-guide__section [data-glyph="bounded-practice"]')
    .first();
  await expect(evidenceGlyph).toBeVisible();
  const lightEvidenceColor = await evidenceGlyph.evaluate(
    (element) => getComputedStyle(element).color,
  );
  await page.evaluate(() => {
    document.documentElement.style.setProperty("--canvas", "#17232b");
    document.documentElement.style.setProperty("--evidence", "#77d9cc");
  });
  await expect(evidenceGlyph).toHaveCSS("color", "rgb(119, 217, 204)");
  expect(
    await evidenceGlyph.evaluate((element) => getComputedStyle(element).color),
  ).not.toBe(lightEvidenceColor);

  await page.emulateMedia({ forcedColors: "active" });
  await expect(visibleSectionGlyph).toHaveCSS("color", "rgb(0, 0, 0)");

  await page.emulateMedia({ media: "print", forcedColors: "none" });
  await expect(visibleSectionGlyph).toBeVisible();
  await expect(visibleSectionGlyph.locator("svg")).toHaveCSS(
    "stroke-width",
    "2.2px",
  );
});

test("representative directories render bounded-case and definition glyphs", async ({
  page,
}) => {
  await page.goto("/explore/", { waitUntil: "networkidle" });
  await expect(
    page.locator('[data-glyph="idea-definition"]').first(),
  ).toBeVisible();
  await expect(
    page.locator('[data-glyph="institution-mechanism"]').first(),
  ).toBeVisible();

  await page.goto("/cases/", { waitUntil: "networkidle" });
  await expect(
    page.locator('[data-glyph="bounded-practice"]').first(),
  ).toBeVisible();
  await expect(page.locator("main svg[role=img]")).toHaveCount(0);
});

test("every current guide uses the restrained section glyph grammar", async ({
  page,
}) => {
  expect(guideRoutes).toHaveLength(21);

  for (const route of guideRoutes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const sections = page.locator(".subject-guide__section");
    const glyphs = sections.locator(":scope > header .glyph");

    expect(await sections.count(), route).toBeGreaterThan(0);
    expect(await glyphs.count(), route).toBe(await sections.count());
    await expect(glyphs.first()).toBeVisible();
    await expect(page.locator("main svg[role=img]"), route).toHaveCount(0);
  }
});

test("glyph labels reflow at 200% text size without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/guides/matriliny-property-authority/", {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });

  await expect(
    page.locator(".subject-guide__section .glyph").first(),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth),
  );
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("guide glyphs remain supplemental static SVG", async ({ page }) => {
    await page.goto("/guides/authoritarianism/");
    const glyph = page.locator(".subject-guide__section .glyph").first();

    await expect(glyph).toBeVisible();
    await expect(glyph.locator("svg")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("main svg[role=img]")).toHaveCount(0);
  });
});
