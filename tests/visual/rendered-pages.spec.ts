import { expect, test, type Locator } from "@playwright/test";

const defaultRoutes = [
  "/",
  "/explore/",
  "/explore/swedish-wage-earner-fund-program/",
  "/explore/swedish-rehn-meidner-model/",
  "/cases/swedish-wage-earner-funds/",
  "/cases/swedish-solidaristic-bargaining/",
  "/cases/kahnawake-community-lawmaking/",
  "/compare/",
  "/concepts/economic-democracy/",
  "/concepts/social-democracy/",
  "/concepts/socialism/",
  "/concepts/communism/",
  "/guides/economic-democracy/",
  "/guides/socialism/",
  "/guides/communism/",
  "/guides/kahnawake-community-lawmaking/",
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

test("subject guide works without JavaScript and keeps evidence adjacent", async ({ browser }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string") throw new Error("Playwright project must configure baseURL");
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/guides/economic-democracy/");
    await expect(page.getByRole("heading", { name: "Economic democracy", level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "On this page: Economic democracy" })).toBeVisible();
    const evidence = page.locator("details.subject-guide__evidence").first();
    await evidence.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(evidence).toHaveAttribute("open", "");
    await expect(evidence.locator(".canonical-claim").first()).toBeVisible();
    const connection = page.locator('[data-relationship-id="enacted-funds-partially-instantiated-program"]');
    const qualification = connection.locator("details.subject-guide__qualification");
    await qualification.locator("summary").click();
    await expect(qualification.getByText("Evidence status")).toBeVisible();
    await expect(qualification.getByText("qualified", { exact: true })).toBeVisible();
  } finally {
    await context.close();
  }
});

test("representative pages have learner-first outlines and unique disclosure names", async ({ page }) => {
  const expected = [
    { route: "/guides/economic-democracy/", h1: "Economic democracy", h2: "Does it mean one institutional model?" },
    { route: "/cases/swedish-wage-earner-funds/", h1: "Swedish wage-earner funds", h2: "What happened in this case?" },
    { route: "/compare/", h1: "Compare promise with practice", h2: "Did the design deliver what its advocates sought?" },
    { route: "/framework/", h1: "Method", h2: "How does an argument connect to evidence?" },
    { route: "/reading/", h1: "Reading", h2: "Which sources support the explanations?" },
  ];
  for (const { route, h1, h2 } of expected) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1, name: h1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 2, name: h2 })).toHaveCount(1);
    const outline = await page.locator("main h1, main h2, main h3").allTextContents();
    expect(outline.every((heading) => heading.trim().length > 0)).toBe(true);
    const summaries = (await page.locator("main details > summary").allTextContents()).map((value) => value.replace(/\s+/g, " ").trim());
    expect(new Set(summaries).size).toBe(summaries.length);
  }
});

test("Kahnawà:ke guide renders its bounded learner framing", async ({ page }) => {
  await page.goto("/guides/kahnawake-community-lawmaking/");
  await expect(
    page.getByRole("heading", { name: "Kahnawà:ke community law-making", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByText(/not an example of one universal “tribal” system/),
  ).toBeVisible();
});

test("subject guide reflows at text zoom without sticky overlap", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto("/guides/economic-democracy/");
  await expect(page.locator(".subject-guide__rail")).toHaveCSS("position", "sticky");
  // Browser zoom reduces the effective CSS viewport. Model 200% zoom by halving
  // the viewport while scaling text, after proving the same page begins above
  // the responsive breakpoint at 100%.
  await page.setViewportSize({ width: 640, height: 1000 });
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  const audit = await page.evaluate(() => {
    const rail = document.querySelector(".subject-guide__rail");
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      railPosition: rail ? getComputedStyle(rail).position : "missing",
    };
  });
  expect(audit.overflow).toBeLessThanOrEqual(1);
  expect(audit.railPosition).toBe("static");
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

test("editorial shells share wide geometry while preserving semantic reading measures", async ({ page }) => {
  const headerUsesSemanticMeasure = async (selector: string) =>
    page.locator(selector).evaluate((header) => {
      const root = document.documentElement;
      const originalToken = root.style.getPropertyValue("--measure-header");
      const before = getComputedStyle(header).maxWidth;
      const control = document.createElement("span");
      control.style.maxWidth = "min(100%, var(--measure-header))";
      try {
        root.style.setProperty("--measure-header", "61rem");
        document.body.append(control);
        return {
          before,
          after: getComputedStyle(header).maxWidth,
          semantic: getComputedStyle(control).maxWidth,
        };
      } finally {
        control.remove();
        if (originalToken) {
          root.style.setProperty("--measure-header", originalToken);
        } else {
          root.style.removeProperty("--measure-header");
        }
      }
    });

  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of ["/framework/", "/reading/"]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("main")).toHaveClass(/site-main--wide/);
    await expect(page.locator("article.editorial-page > header.editorial-header")).toBeVisible();
    const widths = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      main: document.querySelector("main")?.getBoundingClientRect().width ?? 0,
      header: document.querySelector(".editorial-header")?.getBoundingClientRect().width ?? 0,
      standfirst: document.querySelector(".editorial-header > .dek.measure-standfirst")?.getBoundingClientRect().width ?? 0,
    }));
    expect(widths.main / widths.viewport).toBeGreaterThan(0.85);
    expect(widths.header / widths.main).toBeGreaterThan(0.75);
    expect(widths.standfirst / widths.header).toBeGreaterThan(0.55);
    expect(widths.standfirst).toBeLessThanOrEqual(widths.header);
    const headerMeasure = await headerUsesSemanticMeasure(".editorial-header");
    expect(headerMeasure.after).toBe(headerMeasure.semantic);
    expect(headerMeasure.after).not.toBe(headerMeasure.before);
  }

  for (const route of ["/cases/swedish-solidaristic-bargaining/", "/concepts/economic-democracy/"]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const dossierWidths = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      article: document.querySelector(".canonical-dossier")?.getBoundingClientRect().width ?? 0,
      header: document.querySelector(".canonical-dossier > header")?.getBoundingClientRect().width ?? 0,
      standfirst: document.querySelector(".canonical-dossier > header .dossier-standfirst > .dek.measure-standfirst")?.getBoundingClientRect().width ?? 0,
    }));
    expect(dossierWidths.article / dossierWidths.viewport).toBeGreaterThan(0.85);
    expect(dossierWidths.header / dossierWidths.article).toBeGreaterThan(0.75);
    expect(dossierWidths.standfirst / dossierWidths.header).toBeGreaterThan(0.55);
    expect(dossierWidths.standfirst).toBeLessThanOrEqual(dossierWidths.header);
    const headerMeasure = await headerUsesSemanticMeasure(".canonical-dossier > header");
    expect(headerMeasure.after).toBe(headerMeasure.semantic);
    expect(headerMeasure.after).not.toBe(headerMeasure.before);
  }

  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const homepageStandfirst = page.locator(".homepage-hero .dek.measure-standfirst");
  await expect(homepageStandfirst).toBeVisible();
  const homepageMeasures = await homepageStandfirst.evaluate((element) => {
    const actualStyle = getComputedStyle(element);
    const control = document.createElement("span");
    control.className = "measure-standfirst";
    control.style.fontFamily = actualStyle.fontFamily;
    control.style.fontSize = actualStyle.fontSize;
    control.style.position = "absolute";
    control.style.visibility = "hidden";
    document.body.append(control);
    const result = {
      actual: getComputedStyle(element).maxWidth,
      semantic: getComputedStyle(control).maxWidth,
    };
    control.remove();
    return result;
  });
  expect(homepageMeasures.actual).toBe(homepageMeasures.semantic);
});

test("global navigation remains ordered, reachable, and legible across constraints", async ({
  page,
}) => {
  const primaryLabels = [
    "Explore",
    "Cases",
    "Compare",
    "Questions",
  ];
  const siteMapLabels = ["Home", ...primaryLabels, "Sources", "Method"];

  for (const route of [
    "/explore/",
    "/concepts/economic-democracy/",
    "/sources/erixon-rehn-meidner-model-source/",
  ]) {
    await page.goto(route);
    const primary = page.getByRole("navigation", { name: "Primary" });
    const siteMap = page.getByRole("navigation", { name: "Site map" });
    await expect(primary.getByRole("link")).toHaveText(primaryLabels);
    await expect(siteMap.getByRole("link")).toHaveText(siteMapLabels);
    await expect(primary.locator('[aria-current="page"]')).toHaveCount(
      route.startsWith("/sources/") ? 0 : 1,
    );
    await expect(siteMap.locator('[aria-current="page"]')).toHaveCount(1);
  }

  await page.goto("/");
  const expectFocusedTarget = async (link: Locator) => {
    await expect(link).toBeFocused();
    const focus = await link.evaluate((item) => {
      const style = getComputedStyle(item);
      return {
        height: item.getBoundingClientRect().height,
        outlineStyle: style.outlineStyle,
        outlineWidth: Number.parseFloat(style.outlineWidth),
      };
    });
    expect(focus.height).toBeGreaterThanOrEqual(44);
    expect(focus.outlineStyle).not.toBe("none");
    expect(focus.outlineWidth).toBeGreaterThanOrEqual(3);
  };
  const primaryLinks = page.locator(
    '.wordmark, nav[aria-label="Primary"] a',
  );
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  for (let index = 0; index < (await primaryLinks.count()); index += 1) {
    await page.keyboard.press("Tab");
    await expectFocusedTarget(primaryLinks.nth(index));
  }
  const siteMapLinks = page.locator('nav[aria-label="Site map"] a');
  await siteMapLinks.first().focus();
  await expectFocusedTarget(siteMapLinks.first());
  for (let index = 1; index < (await siteMapLinks.count()); index += 1) {
    await page.keyboard.press("Tab");
    await expectFocusedTarget(siteMapLinks.nth(index));
  }

  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/concepts/economic-democracy/");
    const result = await page.evaluate(() => ({
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      targets: [
        ...document.querySelectorAll(".primary-nav a, .site-map a"),
      ].map((link) => link.getBoundingClientRect().height),
    }));
    expect(result.overflow).toBeLessThanOrEqual(1);
    expect(Math.min(...result.targets)).toBeGreaterThanOrEqual(44);
  }

  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto("/sources/erixon-rehn-meidner-model-source/");
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);

  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/concepts/economic-democracy/");
  const currentLink = page
    .getByRole("navigation", { name: "Primary" })
    .locator('[aria-current="page"]');
  expect(
    await currentLink.evaluate(
      (link) => getComputedStyle(link).textDecorationLine,
    ),
  ).toContain("underline");
});
