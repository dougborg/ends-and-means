import { expect, test } from "@playwright/test";

const defaultRoutes = [
  "/",
  "/explore/swedish-wage-earner-fund-program/",
  "/explore/swedish-rehn-meidner-model/",
  "/cases/swedish-wage-earner-funds/",
  "/cases/swedish-solidaristic-bargaining/",
  "/compare/",
  "/concepts/economic-democracy/",
  "/concepts/social-democracy/",
  "/concepts/socialism/",
  "/concepts/communism/",
  "/challenges/distribution-of-gains-and-ownership/",
  "/framework/",
  "/reading/",
  "/research/",
  "/sources/erixon-rehn-meidner-model-source/",
];

const routes = process.env.REVIEW_ROUTES?.split(",")
  .map((route) => route.trim())
  .filter(Boolean)
  .map((route) => route.startsWith("/") ? route : `/${route}`) ?? defaultRoutes;
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile", width: 390, height: 844 },
];

for (const route of routes) {
  for (const viewport of viewports) {
    test(`${route} renders cleanly at ${viewport.name}`, async ({ page }, testInfo) => {
      const browserErrors: string[] = [];
      page.on("console", (message) => { if (message.type() === "error") browserErrors.push(message.text()); });
      page.on("pageerror", (error) => browserErrors.push(error.message));
      await page.setViewportSize(viewport);

      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.ok()).toBe(true);
      await page.screenshot({ path: testInfo.outputPath("page.png"), fullPage: true });

      const audit = await page.evaluate(() => {
        const parseColor = (value: string) => {
          const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
          return { r: channels[0] ?? 0, g: channels[1] ?? 0, b: channels[2] ?? 0, a: channels[3] ?? 1 };
        };
        const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
          const linear = [r, g, b].map((channel) => {
            const value = channel / 255;
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * (linear[0] ?? 0) + 0.7152 * (linear[1] ?? 0) + 0.0722 * (linear[2] ?? 0);
        };
        const backgroundFor = (element: Element) => {
          let current: Element | null = element;
          while (current) {
            const color = parseColor(getComputedStyle(current).backgroundColor);
            if (color.a >= 0.95) return color;
            current = current.parentElement;
          }
          return parseColor(getComputedStyle(document.documentElement).backgroundColor);
        };
        const isHidden = (style: CSSStyleDeclaration, bounds: DOMRect) => [
          style.visibility === "hidden",
          style.display === "none",
          bounds.width === 0,
          bounds.height === 0,
        ].some(Boolean);
        const numericFontWeight = (fontWeight: string) => {
          if (fontWeight === "bold") return 700;
          if (fontWeight === "normal") return 400;
          return Number.parseInt(fontWeight, 10) || 400;
        };
        const minimumContrast = (fontSize: number, fontWeight: number) => {
          if (fontSize >= 24) return 3;
          if (fontSize >= 18.66 && fontWeight >= 700) return 3;
          return 4.5;
        };
        const contrastIssue = (element: Element) => {
          const style = getComputedStyle(element);
          const bounds = element.getBoundingClientRect();
          if (isHidden(style, bounds)) return undefined;
          const foreground = parseColor(style.color);
          const background = backgroundFor(element);
          const light = Math.max(luminance(foreground), luminance(background));
          const dark = Math.min(luminance(foreground), luminance(background));
          const ratio = (light + 0.05) / (dark + 0.05);
          const fontSize = Number.parseFloat(style.fontSize);
          const minimum = minimumContrast(fontSize, numericFontWeight(style.fontWeight));
          if (ratio + 0.01 >= minimum) return undefined;
          return { element: element.tagName.toLowerCase(), text: element.textContent?.trim().slice(0, 80), ratio: Number(ratio.toFixed(2)), minimum };
        };
        const lowContrast = [...document.querySelectorAll("main h1, main h2, main h3, main h4, main p, main a, main summary, main strong, main small")]
          .map(contrastIssue)
          .filter((issue) => issue !== undefined);

        const sheetRules = (sheet: CSSStyleSheet) => {
          try { return [...sheet.cssRules]; } catch { return []; }
        };
        const matches = (css: string, pattern: RegExp) => [...css.matchAll(pattern)]
          .map((match) => match[1])
          .filter((token) => token !== undefined);
        const undefinedTokens = () => {
          const declared = new Set<string>();
          const used = new Set<string>();
          const cssTexts = [...document.styleSheets].flatMap(sheetRules).map((rule) => rule.cssText);
          const inlineCssTexts = [...document.querySelectorAll<HTMLElement>("[style]")].map((element) => element.style.cssText);
          for (const css of [...cssTexts, ...inlineCssTexts]) for (const token of matches(css, /(--[\w-]+)\s*:/g)) declared.add(token);
          for (const css of cssTexts) for (const token of matches(css, /var\((--[\w-]+)\s*\)/g)) used.add(token);
          return [...used].filter((token) => !declared.has(token)).sort();
        };

        const activeNavigationVisible = () => [...document.querySelectorAll('.primary-nav a[aria-current="page"]')].every((element) => {
          const item = element.getBoundingClientRect();
          const navigation = element.closest("nav")?.getBoundingClientRect();
          return Boolean(navigation && item.left >= navigation.left - 1 && item.right <= navigation.right + 1);
        });

        return {
          horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          activeNavigationVisible: activeNavigationVisible(),
          lowContrast,
          undefinedTokens: undefinedTokens(),
        };
      });

      expect(browserErrors).toEqual([]);
      expect(audit.horizontalOverflow).toBeLessThanOrEqual(1);
      expect(audit.activeNavigationVisible).toBe(true);
      expect(audit.undefinedTokens).toEqual([]);
      expect(audit.lowContrast).toEqual([]);
    });
  }
}

test("disclosures expose state and work from the keyboard", async ({ page }) => {
  await page.goto("/explore/swedish-wage-earner-fund-program/");
  const disclosure = page.locator("details.reference-disclosure").first();
  const summary = disclosure.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(disclosure.locator(".canonical-claim").first()).toBeVisible();
});

test("research obligations expose their claim ledger from the keyboard", async ({ page }) => {
  await page.goto("/research/");
  await expect(page.getByText("counterargument / open").first()).toBeVisible();
  const disclosure = page.locator(".research-obligation details").first();
  await disclosure.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(disclosure.getByText("Claims this question tests")).toBeVisible();
  await expect(disclosure.locator(".canonical-claim").first()).toBeVisible();
});

test("social ownership publishes a traceable dossier and focused research question", async ({ page }) => {
  await page.goto("/concepts/social-ownership/");
  await expect(page.getByRole("heading", { name: "Which rights must be separated?" })).toBeVisible();
  await expect(page.getByText("Legal title names the recognized holder of an asset.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Economic democracy" }).first()).toHaveAttribute(
    "href",
    "/concepts/economic-democracy/",
  );
  await expect(page.getByRole("link", { name: "Swedish wage-earner funds" }).first()).toHaveAttribute(
    "href",
    "/cases/swedish-wage-earner-funds/",
  );
  const obligation = page.locator(".research-obligation").filter({
    hasText: "When does delegated control over collectively held assets cease to count as effective social ownership?",
  });
  await expect(obligation.getByText("counterargument / open")).toBeVisible();
});

test("case-episode fragment links reveal their target", async ({ page }) => {
  await page.goto("/cases/swedish-wage-earner-funds/");
  await page.locator('a[href$="#enacted-wage-earner-funds-1984-1991"]').first().click();
  const target = page.locator("#enacted-wage-earner-funds-1984-1991");
  await expect(target).toHaveAttribute("open", "");
  await expect(target.getByText("Formal design")).toBeVisible();
});

test("print exposes closed reference material", async ({ page }) => {
  await page.goto("/cases/swedish-wage-earner-funds/");
  const disclosure = page.locator("details.apparatus-group").filter({ has: page.locator(":scope > .apparatus-group__body") }).first();
  const body = disclosure.locator(":scope > .apparatus-group__body");
  await expect(body).toBeHidden();
  await page.emulateMedia({ media: "print" });
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(body).toBeVisible();
});

test("sparse published records retain the narrative structure", async ({ page }) => {
  for (const route of ["/concepts/institutional-abolition/", "/challenges/authority-and-accountability/"]) {
    await page.goto(route);
    await expect(page.locator(".narrative-dossier")).toHaveCount(1);
    await expect(page.locator(".narrative-section").first()).toBeVisible();
  }
});

test("criteria grid reflects its content count and stacks only on narrow screens", async ({ page }) => {
  await page.goto("/framework/");
  const grid = page.locator(".criteria-grid");
  await expect(grid).toHaveAttribute("data-comparison-columns", "2");

  for (const viewport of [
    { width: 1440, height: 1000, rows: 1 },
    { width: 820, height: 1180, rows: 1 },
    { width: 390, height: 844, rows: 2 },
  ]) {
    await page.setViewportSize(viewport);
    const boxes = await grid.locator(":scope > article").evaluateAll((items) =>
      items.map((item) => {
        const bounds = item.getBoundingClientRect();
        return { width: Math.round(bounds.width), top: Math.round(bounds.top) };
      }),
    );
    expect(new Set(boxes.map(({ width }) => width)).size).toBe(1);
    expect(new Set(boxes.map(({ top }) => top)).size).toBe(viewport.rows);
  }
});
