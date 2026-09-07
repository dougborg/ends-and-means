import {
  type BrowserContext,
  expect,
  type Locator,
  type Page,
  type Request,
  test,
} from "@playwright/test";
import { canonicalGraph } from "../../src/lib/domain/canonical";

const defaultRoutes = [
  "/",
  "/explore/",
  "/explore/swedish-wage-earner-fund-program/",
  "/explore/swedish-rehn-meidner-model/",
  "/cases/swedish-wage-earner-funds/",
  "/cases/swedish-solidaristic-bargaining/",
  "/cases/kahnawake-community-lawmaking/",
  "/cases/zapatista-autonomy-chiapas-1994-present/",
  "/cases/ruwalla-borderland-organization/",
  "/cases/jinst-postcollective-pastoral-governance/",
  "/cases/bonjol-melayu-ulayat-governance/",
  "/cases/iceland-parental-leave-2000-2018/",
  "/cases/italian-fascist-dictatorship-1925-1943/",
  "/compare/",
  "/concepts/economic-democracy/",
  "/concepts/democracy/",
  "/concepts/social-democracy/",
  "/concepts/socialism/",
  "/concepts/communism/",
  "/guides/economic-democracy/",
  "/guides/socialism/",
  "/guides/communism/",
  "/guides/authoritarianism/",
  "/guides/capitalism/",
  "/guides/feminism/",
  "/guides/liberalism/",
  "/guides/matriliny-property-authority/",
  "/guides/monarchy/",
  "/cases/japan-symbolic-emperorship-1947-2004/",
  "/cases/tonga-constitutional-settlement-2010-2013/",
  "/cases/saudi-basic-law-monarchy-1992-2022/",
  "/guides/kahnawake-community-lawmaking/",
  "/guides/ruwalla-borderland-organization/",
  "/guides/jinst-postcollective-pastoral-governance/",
  "/challenges/distribution-of-gains-and-ownership/",
  "/framework/",
  "/principles/",
  "/governance/",
  "/reading/",
  "/research/",
  "/sources/erixon-rehn-meidner-model-source/",
];

async function expectNativeNewPageRequest(
  context: BrowserContext,
  sourcePage: Page,
  activate: () => Promise<void>,
  expectedURL: string,
) {
  let navigationRequest: Request | undefined;
  const existingPages = new Set(context.pages());
  const requestPromise = context.waitForEvent("request", {
    predicate: (request) =>
      request.isNavigationRequest() && request.url() === expectedURL,
    timeout: 5_000,
  });

  try {
    await activate();
    navigationRequest = await requestPromise;
    expect(navigationRequest.method()).toBe("GET");
    expect(navigationRequest.resourceType()).toBe("document");
    expect((await navigationRequest.allHeaders())["sec-fetch-dest"]).toBe(
      "document",
    );
    try {
      expect(navigationRequest.frame().page()).not.toBe(sourcePage);
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !/request\s+was issued before the frame is created/.test(error.message)
      ) {
        throw error;
      }
    }
  } finally {
    await requestPromise.catch(() => undefined);
    for (const openedPage of context.pages()) {
      if (!existingPages.has(openedPage) && !openedPage.isClosed()) {
        await openedPage.close();
      }
    }
  }
}

test("external mappings remain a quiet, accessible trust aid", async ({
  page,
}) => {
  await page.goto("/concepts/democracy/");
  await page.getByText("External orientation", { exact: true }).click();
  const apparatus = page.getByRole("complementary", {
    name: "External references",
  });
  await expect(apparatus).toContainText("not evidence");
  await expect(
    apparatus.getByRole("link", { name: "Wikipedia" }),
  ).toHaveAttribute("href", "https://en.wikipedia.org/wiki/Democracy");
  await expect(apparatus.getByRole("link", { name: /Q7174/ })).toContainText(
    "exact match",
  );
});

const routes =
  process.env.REVIEW_ROUTES?.split(",")
    .map((route) => route.trim())
    .filter(Boolean)
    .map((route) => (route.startsWith("/") ? route : `/${route}`)) ??
  defaultRoutes;
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile", width: 390, height: 844 },
];

for (const route of routes) {
  for (const viewport of viewports) {
    // biome-ignore lint/complexity/noExcessiveLinesPerFunction: the per-page browser audit is one cohesive accessibility contract.
    test(`${route} renders cleanly at ${viewport.name}`, async ({
      page,
    }, testInfo) => {
      const browserErrors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") browserErrors.push(message.text());
      });
      page.on("pageerror", (error) => browserErrors.push(error.message));
      await page.setViewportSize(viewport);

      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.ok()).toBe(true);
      await page.screenshot({
        path: testInfo.outputPath("page.png"),
        fullPage: true,
      });

      // biome-ignore lint/complexity/noExcessiveLinesPerFunction: one cohesive in-page accessibility audit.
      const audit = await page.evaluate(() => {
        const parseColor = (value: string) => {
          const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
          return {
            r: channels[0] ?? 0,
            g: channels[1] ?? 0,
            b: channels[2] ?? 0,
            a: channels[3] ?? 1,
          };
        };
        const luminance = ({
          r,
          g,
          b,
        }: {
          r: number;
          g: number;
          b: number;
        }) => {
          const linear = [r, g, b].map((channel) => {
            const value = channel / 255;
            return value <= 0.04045
              ? value / 12.92
              : ((value + 0.055) / 1.055) ** 2.4;
          });
          return (
            0.2126 * (linear[0] ?? 0) +
            0.7152 * (linear[1] ?? 0) +
            0.0722 * (linear[2] ?? 0)
          );
        };
        const backgroundFor = (element: Element) => {
          let current: Element | null = element;
          while (current) {
            const color = parseColor(getComputedStyle(current).backgroundColor);
            if (color.a >= 0.95) return color;
            current = current.parentElement;
          }
          return parseColor(
            getComputedStyle(document.documentElement).backgroundColor,
          );
        };
        const isHidden = (style: CSSStyleDeclaration, bounds: DOMRect) =>
          [
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
          const minimum = minimumContrast(
            fontSize,
            numericFontWeight(style.fontWeight),
          );
          if (ratio + 0.01 >= minimum) return undefined;
          return {
            element: element.tagName.toLowerCase(),
            text: element.textContent?.trim().slice(0, 80),
            ratio: Number(ratio.toFixed(2)),
            minimum,
          };
        };
        const lowContrast = [
          ...document.querySelectorAll(
            "main h1, main h2, main h3, main h4, main p, main a, main summary, main strong, main small",
          ),
        ]
          .map(contrastIssue)
          .filter((issue) => issue !== undefined);

        const sheetRules = (sheet: CSSStyleSheet) => {
          try {
            return [...sheet.cssRules];
          } catch {
            return [];
          }
        };
        const matches = (css: string, pattern: RegExp) =>
          [...css.matchAll(pattern)]
            .map((match) => match[1])
            .filter((token) => token !== undefined);
        const undefinedTokens = () => {
          const declared = new Set<string>();
          const used = new Set<string>();
          const cssTexts = [...document.styleSheets]
            .flatMap(sheetRules)
            .map((rule) => rule.cssText);
          const inlineCssTexts = [
            ...document.querySelectorAll<HTMLElement>("[style]"),
          ].map((element) => element.style.cssText);
          for (const css of [...cssTexts, ...inlineCssTexts])
            for (const token of matches(css, /(--[\w-]+)\s*:/g))
              declared.add(token);
          for (const css of cssTexts)
            for (const token of matches(css, /var\((--[\w-]+)\s*\)/g))
              used.add(token);
          return [...used].filter((token) => !declared.has(token)).sort();
        };

        const activeNavigationVisible = () =>
          [
            ...document.querySelectorAll('.primary-nav a[aria-current="page"]'),
          ].every((element) => {
            const item = element.getBoundingClientRect();
            const navigation = element.closest("nav")?.getBoundingClientRect();
            return Boolean(
              navigation &&
                item.left >= navigation.left - 1 &&
                item.right <= navigation.right + 1,
            );
          });

        return {
          horizontalOverflow:
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
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

test("disclosures expose state and work from the keyboard", async ({
  page,
}) => {
  await page.goto("/explore/swedish-wage-earner-fund-program/");
  const disclosure = page.locator("details.reference-disclosure").first();
  const summary = disclosure.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(disclosure.locator(".canonical-claim").first()).toBeVisible();
});

test("forced colors preserve focus, evidence marks, and current-page state", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/guides/feminism/", { waitUntil: "networkidle" });

  const currentPage = page.locator('.primary-nav a[aria-current="page"]');
  await expect(currentPage).toHaveCSS("text-decoration-line", "underline");

  const evidenceSummary = page
    .locator("details.subject-guide__evidence > summary")
    .first();
  await evidenceSummary.focus();
  await expect(evidenceSummary).toHaveCSS("outline-style", "solid");
  await evidenceSummary.click();

  const evidenceClaim = page
    .locator("details.subject-guide__evidence .canonical-claim")
    .first();
  await expect(evidenceClaim).toBeVisible();
  await expect(evidenceClaim).toHaveCSS("border-top-style", "solid");
});

test("subject guide works without JavaScript and keeps evidence adjacent", async ({
  browser,
}, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string")
    throw new Error("Playwright project must configure baseURL");
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
  });
  try {
    const page = await context.newPage();
    await page.goto("/guides/economic-democracy/");
    await expect(
      page.getByRole("heading", { name: "Economic democracy", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", {
        name: "On this page: Economic democracy",
      }),
    ).toBeVisible();
    const evidence = page.locator("details.subject-guide__evidence").first();
    await evidence.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(evidence).toHaveAttribute("open", "");
    await expect(evidence.locator(".canonical-claim").first()).toBeVisible();
    const connection = page.locator(
      '[data-relationship-id="enacted-funds-partially-instantiated-program"]',
    );
    const qualification = connection.locator(
      "details.subject-guide__qualification",
    );
    await qualification.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(qualification.getByText("Evidence status")).toBeVisible();
    await expect(
      qualification.getByText("qualified", { exact: true }),
    ).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    const mobileOutline = page.locator("details.page-outline__mobile");
    await mobileOutline.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(mobileOutline).toHaveAttribute("open", "");
    const noScriptLink = mobileOutline.getByRole("link", {
      name: "Does it mean one institutional model?",
    });
    await expect(noScriptLink).toHaveAttribute(
      "href",
      "#meanings-and-boundaries",
    );
    await expect(noScriptLink).toBeVisible();
    await noScriptLink.focus();
    await expect(noScriptLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect
      .poll(() => new URL(page.url()).hash, {
        message: "native no-JavaScript anchor navigation updates the URL hash",
        timeout: 5_000,
      })
      .toBe("#meanings-and-boundaries");
    await expect(page.locator("#meanings-and-boundaries")).toBeInViewport();
  } finally {
    await context.close();
  }
});

test("generated outlines navigate long pages and collapse natively on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/guides/economic-democracy/", { waitUntil: "networkidle" });
  const desktopOutline = page.locator(".page-outline__desktop");
  await expect(desktopOutline).toBeVisible();
  await expect(page.locator(".page-outline")).toHaveCSS("position", "sticky");
  await page.evaluate(() => window.scrollTo(0, 1_400));
  const stickyTop = await page
    .locator(".page-outline")
    .evaluate((element) => element.getBoundingClientRect().top);
  expect(stickyTop).toBeGreaterThanOrEqual(0);
  expect(stickyTop).toBeLessThan(32);
  await page.evaluate(() => window.scrollTo(0, 0));
  await desktopOutline
    .getByRole("link", { name: "Does it mean one institutional model?" })
    .click();
  await expect(page).toHaveURL(/#meanings-and-boundaries$/);
  const target = page.locator("#meanings-and-boundaries");
  await expect(target).toBeInViewport();
  expect(
    await target.evaluate((element) => element.getBoundingClientRect().top),
  ).toBeGreaterThanOrEqual(0);
  await expect(target).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(desktopOutline).toBeHidden();
  const mobileOutline = page.locator("details.page-outline__mobile");
  await expect(mobileOutline).toBeVisible();
  await mobileOutline.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(mobileOutline).toHaveAttribute("open", "");
  await expect(
    mobileOutline.getByRole("link", {
      name: "Does it mean one institutional model?",
    }),
  ).toBeVisible();
});

test("qualifying routes derive exact ordered links from rendered targets", async ({
  page,
}) => {
  for (const route of [
    "/guides/economic-democracy/",
    "/explore/swedish-rehn-meidner-model/",
    "/cases/swedish-wage-earner-funds/",
    "/challenges/authority-and-accountability/",
  ]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const links = page.locator(".page-outline__desktop li a");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(3);
    expect(
      await page.locator(".page-outline").getAttribute("data-item-count"),
    ).toBe(String(count));
    const targets: string[] = [];
    for (let index = 0; index < count; index += 1) {
      const link = links.nth(index);
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^#[a-z0-9-]+$/);
      const id = href?.slice(1) ?? "";
      targets.push(id);
      const target = page.locator(`#${id}`);
      await expect(target).toHaveCount(1);
      const label = (await link.textContent())?.replace(/^\d+/, "").trim();
      const targetLabel =
        id === "short-answer"
          ? await target.getAttribute("aria-label")
          : (await target.locator("h1, h2, h3").first().textContent())?.trim();
      expect(label).toBe(targetLabel);
    }
    expect(new Set(targets).size).toBe(targets.length);
  }
});

test("short and out-of-scope real routes omit on-page navigation", async ({
  page,
}) => {
  for (const route of ["/concepts/institutional-abolition/", "/reading/"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator(".page-outline")).toHaveCount(0);
  }
});

test("generated learner pages contain no duplicate fragment identifiers", async ({
  page,
}) => {
  for (const route of [
    "/guides/economic-democracy/",
    "/guides/socialism/",
    "/guides/communism/",
    "/guides/kahnawake-community-lawmaking/",
    "/explore/swedish-rehn-meidner-model/",
    "/cases/swedish-solidaristic-bargaining/",
    "/challenges/authority-and-accountability/",
  ]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const duplicates = await page.locator("[id]").evaluateAll((elements) => {
      const counts = new Map<string, number>();
      for (const element of elements)
        counts.set(element.id, (counts.get(element.id) ?? 0) + 1);
      return [...counts].filter(([, count]) => count > 1).map(([id]) => id);
    });
    expect(duplicates).toEqual([]);
  }
});

test("repeated guide research questions have one fragment owner", async ({
  page,
}) => {
  await page.goto("/guides/socialism/", { waitUntil: "networkidle" });
  const obligationId = "socialism-democratic-control-threshold";
  const repeatedQuestion = page.locator(".research-obligation").filter({
    has: page.getByRole("heading", {
      name: "Which rights and accountability mechanisms are sufficient for productive assets to be under social and democratic control?",
    }),
  });

  await expect(repeatedQuestion).toHaveCount(2);
  await expect(page.locator(`#${obligationId}`)).toHaveCount(1);
  expect(
    await repeatedQuestion.evaluateAll((cards) => cards.map(({ id }) => id)),
  ).toEqual([obligationId, ""]);
  await expect(
    page.locator(`#${obligationId}`).getByRole("heading"),
  ).toHaveText(
    "Which rights and accountability mechanisms are sufficient for productive assets to be under social and democratic control?",
  );
});

test("representative pages have learner-first outlines and unique disclosure names", async ({
  page,
}) => {
  const expected = [
    {
      route: "/guides/economic-democracy/",
      h1: "Economic democracy",
      h2: "Does it mean one institutional model?",
      hasDisclosures: true,
    },
    {
      route: "/cases/swedish-wage-earner-funds/",
      h1: "Swedish wage-earner funds",
      h2: "What happened in this case?",
      hasDisclosures: true,
    },
    {
      route: "/compare/",
      h1: "Compare promise with practice",
      h2: "Did the design deliver what its advocates sought?",
      hasDisclosures: false,
    },
    {
      route: "/framework/",
      h1: "How we research and classify.",
      h2: "How can I check an explanation?",
      hasDisclosures: true,
    },
    {
      route: "/reading/",
      h1: "Reading",
      h2: "Which sources connect to the explanations?",
      hasDisclosures: false,
    },
  ];
  for (const { route, h1, h2, hasDisclosures } of expected) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1, name: h1 })).toHaveCount(
      1,
    );
    await expect(page.getByRole("heading", { level: 2, name: h2 })).toHaveCount(
      1,
    );
    const outline = await page
      .locator("main h1, main h2, main h3")
      .allTextContents();
    expect(outline.every((heading) => heading.trim().length > 0)).toBe(true);
    const summaries = (
      await page.locator("main details > summary").allTextContents()
    ).map((value) => value.replace(/\s+/g, " ").trim());
    expect(summaries.length > 0).toBe(hasDisclosures);
    expect(summaries.every((summary) => summary.length > 0)).toBe(true);
    expect(new Set(summaries).size).toBe(summaries.length);
  }
});

test("Kahnawà:ke guide renders its bounded learner framing", async ({
  page,
}) => {
  await page.goto("/guides/kahnawake-community-lawmaking/");
  await expect(
    page.getByRole("heading", {
      name: "Kahnawà:ke community law-making",
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/not an example of one universal “tribal” system/),
  ).toBeVisible();
});

test("Ruwalla and Jinst guides render distinct bounded comparisons", async ({
  page,
}) => {
  await page.goto("/guides/ruwalla-borderland-organization/");
  await expect(
    page.getByRole("heading", {
      name: "Ruwalla organization across post-Ottoman borders",
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/rather than one timeless Arabian “tribal system”/),
  ).toBeVisible();
  await page.goto("/guides/jinst-postcollective-pastoral-governance/");
  await expect(
    page.getByRole("heading", {
      name: "Jinst post-collective pastoral governance",
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/single “nomadic government” type/),
  ).toBeVisible();
  await expect(
    page.getByText(
      /differed in scale, leadership, evidence, and state relationship/,
    ),
  ).toBeVisible();
});

for (const route of [
  "/guides/ruwalla-borderland-organization/",
  "/guides/jinst-postcollective-pastoral-governance/",
]) {
  test(`${route} supports zoom, keyboard evidence, accessible structure, and print`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 640, height: 1000 });
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(1);
    await expect(page.locator(".page-outline__desktop")).toBeHidden();
    await expect(page.locator(".page-outline__mobile")).toBeVisible();

    const details = page.locator("main details").first();
    const summary = details.locator("summary");
    await expect(summary).not.toHaveText("");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await expect(details.locator(".canonical-claim").first()).toBeVisible();

    const semantics = await page.evaluate(() => ({
      h1s: document.querySelectorAll("main h1").length,
      duplicateIds: [...document.querySelectorAll("[id]")]
        .map(({ id }) => id)
        .filter((id, index, ids) => ids.indexOf(id) !== index),
      emptySummaries: [
        ...document.querySelectorAll("main details > summary"),
      ].filter((node) => !node.textContent?.trim()).length,
      unlabeledLinks: [...document.querySelectorAll("main a")].filter(
        (node) => !node.textContent?.trim() && !node.getAttribute("aria-label"),
      ).length,
    }));
    expect(semantics).toEqual({
      h1s: 1,
      duplicateIds: [],
      emptySummaries: 0,
      unlabeledLinks: 0,
    });
    await expect(details).toContainText(/supports|context/i);

    await page.emulateMedia({ forcedColors: "active" });
    await expect(summary).toBeVisible();
    await expect(details).toContainText(/supports|context/i);

    await page.emulateMedia({ media: "screen", forcedColors: "none" });
    await page.reload();
    const initiallyClosedDetails = page.locator("main details").first();
    await expect(initiallyClosedDetails).not.toHaveAttribute("open", "");
    await expect(
      initiallyClosedDetails.locator(".canonical-claim").first(),
    ).toBeHidden();
    await page.emulateMedia({ media: "print" });
    await expect(
      initiallyClosedDetails.locator(".canonical-claim").first(),
    ).toBeVisible();
  });
}

test("subject guide reflows at text zoom without sticky overlap", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto("/guides/economic-democracy/");
  await expect(page.locator(".page-outline")).toHaveCSS("position", "sticky");
  // Browser zoom reduces the effective CSS viewport. Model 200% zoom by halving
  // the viewport while scaling text, after proving the same page begins above
  // the responsive breakpoint at 100%.
  await page.setViewportSize({ width: 640, height: 1000 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  const audit = await page.evaluate(() => {
    const outline = document.querySelector(".page-outline");
    const desktop = document.querySelector(".page-outline__desktop");
    const mobile = document.querySelector(".page-outline__mobile");
    return {
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      outlinePosition: outline ? getComputedStyle(outline).position : "missing",
      desktopDisplay: desktop ? getComputedStyle(desktop).display : "missing",
      mobileDisplay: mobile ? getComputedStyle(mobile).display : "missing",
    };
  });
  expect(audit.overflow).toBeLessThanOrEqual(1);
  expect(audit.outlinePosition).toBe("static");
  expect(audit.desktopDisplay).toBe("none");
  expect(audit.mobileDisplay).not.toBe("none");
});

test("research obligations expose their claim ledger from the keyboard", async ({
  page,
}) => {
  await page.goto("/research/");
  await expect(page.getByText("counterargument / open").first()).toBeVisible();
  const disclosure = page.locator(".research-obligation details").first();
  await disclosure.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(
    disclosure.getByText("Claims this question tests"),
  ).toBeVisible();
  await expect(disclosure.locator(".canonical-claim").first()).toBeVisible();
});

test("social ownership publishes a traceable dossier and focused research question", async ({
  page,
}) => {
  await page.goto("/concepts/social-ownership/");
  await expect(
    page.getByRole("heading", { name: "Which rights must be separated?" }),
  ).toBeVisible();
  await expect(
    page.getByText("Legal title names the recognized holder of an asset."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Economic democracy" }).first(),
  ).toHaveAttribute("href", "/concepts/economic-democracy/");
  await expect(
    page.getByRole("link", { name: "Swedish wage-earner funds" }).first(),
  ).toHaveAttribute("href", "/cases/swedish-wage-earner-funds/");
  const obligation = page.locator(".research-obligation").filter({
    hasText:
      "When does delegated control over collectively held assets cease to count as effective social ownership?",
  });
  await expect(obligation.getByText("counterargument / open")).toBeVisible();
});

test("case-episode fragment links reveal their target", async ({ page }) => {
  await page.goto("/cases/swedish-wage-earner-funds/");
  await page
    .locator('a[href$="#enacted-wage-earner-funds-1984-1991"]')
    .first()
    .click();
  const target = page.locator("#enacted-wage-earner-funds-1984-1991");
  await expect(target).toHaveAttribute("open", "");
  await expect(target.getByText("Formal design")).toBeVisible();
});

test("print exposes closed reference material", async ({ page }) => {
  await page.goto("/cases/swedish-wage-earner-funds/");
  const disclosure = page
    .locator("details.apparatus-group")
    .filter({ has: page.locator(":scope > .apparatus-group__body") })
    .first();
  const body = disclosure.locator(":scope > .apparatus-group__body");
  await expect(body).toBeHidden();
  await page.emulateMedia({ media: "print" });
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(body).toBeVisible();
});

test("Zapatista case exposes freshness, interactions, evidence, and print disclosures", async ({
  page,
}) => {
  await page.goto("/cases/zapatista-autonomy-chiapas-1994-present/");
  await page
    .locator("details.apparatus-group")
    .first()
    .locator("summary")
    .click();
  await expect(page.getByText("Evidence current through:")).toBeVisible();
  await expect(
    page.getByText("This pointer records why the case was re-reviewed"),
  ).toBeVisible();
  await page
    .locator('a[href="#zapatista-autonomy-reorganization-2023"]')
    .click();
  const freshnessTarget = page.locator(
    "#zapatista-autonomy-reorganization-2023",
  );
  await expect(freshnessTarget).toBeVisible();
  await expect(freshnessTarget).toBeFocused();
  const episode = page.locator("#zapatista-caracol-jbg-episode-2003-2023");
  await episode.locator("summary").click();
  await expect(
    episode.getByRole("heading", { name: "Interactions" }),
  ).toBeVisible();
  expect(
    await episode.locator(".canonical-claim").count(),
  ).toBeGreaterThanOrEqual(8);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("details.apparatus-group").first()).toHaveAttribute(
    "open",
    "",
  );
});

test("sparse published records retain the narrative structure", async ({
  page,
}) => {
  for (const route of [
    "/concepts/institutional-abolition/",
    "/challenges/authority-and-accountability/",
  ]) {
    await page.goto(route);
    await expect(page.locator(".narrative-dossier")).toHaveCount(1);
    await expect(page.locator(".narrative-section").first()).toBeVisible();
  }
});

test("criteria grid reflects its content count and stacks only on narrow screens", async ({
  page,
}) => {
  await page.goto("/framework/");
  const grid = page.locator(".criteria-grid");
  await expect(grid).toHaveAttribute("data-comparison-columns", "3");

  for (const viewport of [
    { width: 1440, height: 1000, rows: 2 },
    { width: 820, height: 1180, rows: 2 },
    { width: 390, height: 844, rows: 4 },
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

test("governance policy exposes correction, reconsideration, and keyboard section navigation", async ({
  page,
}) => {
  await page.goto("/governance/");
  const correction = page.getByRole("link", { name: "Send a correction" });
  const reconsideration = page.getByRole("link", {
    name: "Request reconsideration",
  });
  await expect(correction).toHaveAttribute("href", /title=Correction/);
  await expect(reconsideration).toHaveAttribute(
    "href",
    /title=Reconsideration/,
  );
  const sectionLink = page
    .getByRole("navigation", { name: "On this page" })
    .getByRole("link", { name: "AI-assisted work" });
  await sectionLink.focus();
  await expect(sectionLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#ai")).toBeVisible();
});

test("editorial principles survive no JavaScript, zoom, forced colors, print, and keyboard navigation", async ({ browser, page }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string") throw new Error("Playwright project must configure baseURL");
  const noScriptContext = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const noScriptPage = await noScriptContext.newPage();
  await noScriptPage.goto("/principles/");
  await expect(noScriptPage.getByRole("heading", { level: 1, name: "Fairness requires visible judgment." })).toBeVisible();
  await expect(noScriptPage.getByText("Sourced fact", { exact: true })).toBeVisible();
  await noScriptContext.close();

  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto("/principles/");
  const sourceLink = page.getByRole("navigation", { name: "On this page" }).getByRole("link", { name: "Sources and synthesis" });
  await sourceLink.focus();
  await expect(sourceLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#sources")).toBeVisible();
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);

  await page.emulateMedia({ forcedColors: "active" });
  await expect(page.locator("#sources")).toBeVisible();
  await page.emulateMedia({ media: "print", forcedColors: "none" });
  await expect(page.getByText("Counterfactuals", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Suggest a correction in a public GitHub issue" })).toBeVisible();
});

test("governance and principles section targets remain usable at 320 CSS pixels", async ({ page }) => {
  // 320 CSS pixels is the WCAG reflow equivalent of a 1280px viewport at 400% zoom.
  await page.setViewportSize({ width: 320, height: 900 });
  for (const route of ["/governance/", "/principles/"]) {
    await page.goto(route);
    const links = page.getByRole("navigation", { name: "On this page" }).getByRole("link");
    const dimensions = await links.evaluateAll((items) =>
      items.map((item) => {
        const box = item.getBoundingClientRect();
        return { height: box.height, width: box.width };
      }),
    );
    expect(dimensions.every(({ height, width }) => height >= 44 && width >= 44)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  }
});

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: one cohesive cross-shell geometry audit.
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
  for (const route of ["/framework/", "/principles/", "/governance/", "/reading/"]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("main")).toHaveClass(/site-main--wide/);
    await expect(
      page.locator("article.editorial-page > header.editorial-header"),
    ).toBeVisible();
    const widths = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      main: document.querySelector("main")?.getBoundingClientRect().width ?? 0,
      header:
        document.querySelector(".editorial-header")?.getBoundingClientRect()
          .width ?? 0,
      standfirst:
        document
          .querySelector(".editorial-header > .dek.measure-standfirst")
          ?.getBoundingClientRect().width ?? 0,
    }));
    expect(widths.main / widths.viewport).toBeGreaterThan(0.85);
    expect(widths.header / widths.main).toBeGreaterThan(0.75);
    expect(widths.standfirst / widths.header).toBeGreaterThan(0.55);
    expect(widths.standfirst).toBeLessThanOrEqual(widths.header);
    const headerMeasure = await headerUsesSemanticMeasure(".editorial-header");
    expect(headerMeasure.after).toBe(headerMeasure.semantic);
    expect(headerMeasure.after).not.toBe(headerMeasure.before);
  }

  for (const route of [
    "/cases/swedish-solidaristic-bargaining/",
    "/concepts/economic-democracy/",
  ]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const dossierWidths = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      article:
        document.querySelector(".canonical-dossier")?.getBoundingClientRect()
          .width ?? 0,
      header:
        document
          .querySelector(".canonical-dossier > header")
          ?.getBoundingClientRect().width ?? 0,
      standfirst:
        document
          .querySelector(
            ".canonical-dossier > header .dossier-standfirst > .dek.measure-standfirst",
          )
          ?.getBoundingClientRect().width ?? 0,
    }));
    expect(dossierWidths.article / dossierWidths.viewport).toBeGreaterThan(
      0.85,
    );
    expect(dossierWidths.header / dossierWidths.article).toBeGreaterThan(0.75);
    expect(dossierWidths.standfirst / dossierWidths.header).toBeGreaterThan(
      0.55,
    );
    expect(dossierWidths.standfirst).toBeLessThanOrEqual(dossierWidths.header);
    const headerMeasure = await headerUsesSemanticMeasure(
      ".canonical-dossier > header",
    );
    expect(headerMeasure.after).toBe(headerMeasure.semantic);
    expect(headerMeasure.after).not.toBe(headerMeasure.before);
  }

  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const homepageStandfirst = page.locator(
    ".homepage-hero .dek.measure-standfirst",
  );
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
  const primaryLabels = ["Explore", "Cases", "Compare", "Questions"];
  const siteMapLabels = [
    "Home",
    ...primaryLabels,
    "Sources",
    "Method",
    "Principles",
    "Governance",
  ];

  for (const route of [
    "/explore/",
    "/concepts/economic-democracy/",
    "/sources/erixon-rehn-meidner-model-source/",
    "/principles/",
  ]) {
    await page.goto(route);
    const primary = page.getByRole("navigation", { name: "Primary" });
    const siteMap = page.getByRole("navigation", { name: "Site map" });
    await expect(primary.getByRole("link")).toHaveText(primaryLabels);
    await expect(siteMap.getByRole("link")).toHaveText(siteMapLabels);
    await expect(primary.locator('[aria-current="page"]')).toHaveCount(
      route.startsWith("/explore/") || route.startsWith("/concepts/") ? 1 : 0,
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
  const primaryLinks = page.locator('.wordmark, nav[aria-label="Primary"] a');
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
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
        ...document.querySelectorAll(
          ".primary-nav a, .mobile-navigation a, .site-map a",
        ),
      ].map((link) => link.getBoundingClientRect().height),
    }));
    expect(result.overflow).toBeLessThanOrEqual(1);
    expect(
      result.targets
        .filter((height) => height > 0)
        .every((height) => height >= 44),
    ).toBe(true);
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
});

test("mobile current route survives forced colors and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/concepts/economic-democracy/");
  await page.locator("details.mobile-navigation summary").click();
  const currentLink = page
    .getByRole("navigation", { name: "Mobile navigation" })
    .locator('[aria-current="page"]');
  expect(
    await currentLink.evaluate(
      (link) => getComputedStyle(link).textDecorationLine,
    ),
  ).toContain("underline");
});

test("mobile menu is compact, complete, and predictably enhanced", async ({
  page,
}) => {
  for (const width of [320, 390, 430]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/concepts/economic-democracy/");
    const header = page.locator(".site-header");
    const disclosure = page.locator("details.mobile-navigation");
    const summary = disclosure.locator("summary");
    const height = await header.evaluate(
      (element) => element.getBoundingClientRect().height,
    );
    expect(height).toBeGreaterThanOrEqual(56);
    expect(height).toBeLessThanOrEqual(64);
    await expect(summary).toContainText("Menu");
    await expect(summary).toContainText("Explore");
    await summary.focus();
    const focus = await summary.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        height: element.getBoundingClientRect().height,
        outlineStyle: style.outlineStyle,
        outlineWidth: Number.parseFloat(style.outlineWidth),
      };
    });
    expect(focus.height).toBeGreaterThanOrEqual(44);
    expect(focus.outlineStyle).not.toBe("none");
    expect(focus.outlineWidth).toBeGreaterThanOrEqual(3);
    await page.keyboard.press("Enter");
    await expect(disclosure).toHaveAttribute("open", "");
    await expect(
      page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link"),
    ).toHaveCount(9);
    await page.keyboard.press("Escape");
    await expect(disclosure).not.toHaveAttribute("open", "");
    await expect(summary).toBeFocused();
    await summary.click();
    await page.mouse.click(5, 880);
    await expect(disclosure).not.toHaveAttribute("open", "");
  }

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/research/");
  const researchDisclosure = page.locator("details.mobile-navigation");
  await expect(researchDisclosure.locator("summary")).toContainText(
    "Questions",
  );
  await researchDisclosure.locator("summary").click();
  await expect(researchDisclosure.locator('[aria-current="page"]')).toHaveText(
    "Questions",
  );

  // A 1280px layout viewport resolves to these CSS widths at 200% and 400% zoom.
  for (const width of [640, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/sources/erixon-rehn-meidner-model-source/");
    const disclosure = page.locator("details.mobile-navigation");
    await disclosure.locator("summary").click();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(1);
    await expect(disclosure.locator('[aria-current="page"]')).toHaveText(
      /Sources/,
    );
  }
});

test("mobile menu yields focus and closes at its keyboard boundary", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/concepts/economic-democracy/");

  const disclosure = page.locator("details.mobile-navigation");
  const summary = disclosure.locator("summary");
  const menuLinks = page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link");
  const breadcrumb = page
    .getByRole("navigation", { name: "Breadcrumb" })
    .getByRole("link");

  await summary.focus();
  await page.keyboard.press("Enter");
  await menuLinks.last().focus();
  await page.keyboard.press("Tab");

  await expect(disclosure).not.toHaveAttribute("open", "");
  await expect(breadcrumb).toBeFocused();
  const focusPresentation = await breadcrumb.evaluate((link) => {
    const bounds = link.getBoundingClientRect();
    const topmost = document.elementFromPoint(
      bounds.left + bounds.width / 2,
      bounds.top + bounds.height / 2,
    );
    const style = getComputedStyle(link);
    return {
      unobscured: topmost === link || link.contains(topmost),
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    };
  });
  expect(focusPresentation.unobscured).toBe(true);
  expect(focusPresentation.outlineStyle).not.toBe("none");
  expect(focusPresentation.outlineWidth).toBeGreaterThanOrEqual(3);

  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(disclosure).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(disclosure).not.toHaveAttribute("open", "");
  await expect(summary).toBeFocused();
});

test("mobile links preserve native pointer, touch, keyboard, and new-context navigation", async ({
  browser,
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/research/");
  await page.locator("details.mobile-navigation summary").click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Cases" })
    .click();
  await expect(page).toHaveURL(/\/cases\/$/);

  await page.goto("/research/");
  await page.locator("details.mobile-navigation summary").click();
  const compare = page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Compare" });
  await compare.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/compare\/$/);

  await page.goto("/research/");
  await page.locator("details.mobile-navigation summary").click();
  const questions = page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Questions" });
  const platformModifier = process.platform === "darwin" ? "Meta" : "Control";
  await expectNativeNewPageRequest(
    page.context(),
    page,
    () => questions.click({ modifiers: [platformModifier] }),
    new URL("/challenges/", page.url()).href,
  );

  await expectNativeNewPageRequest(
    page.context(),
    page,
    () =>
      page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "Sources" })
        .click({ button: "middle" }),
    new URL("/reading/", page.url()).href,
  );

  const touchContext = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  try {
    const touchPage = await touchContext.newPage();
    await touchPage.goto("/research/");
    await touchPage.locator("details.mobile-navigation summary").tap();
    await touchPage
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Cases" })
      .tap();
    await expect(touchPage).toHaveURL(/\/cases\/$/);
  } finally {
    await touchContext.close();
  }
});

test("mobile navigation does not enter the narrow print layout", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/guides/communism/");
  const disclosure = page.locator("details.mobile-navigation");
  await disclosure.locator("summary").click();
  await expect(disclosure).toHaveAttribute("open", "");
  await page.emulateMedia({ media: "print" });
  await expect(disclosure).toBeHidden();
  expect(
    await disclosure.evaluate((element) => {
      const { width, height } = element.getBoundingClientRect();
      return { width, height };
    }),
  ).toEqual({ width: 0, height: 0 });
  await expect(
    page.getByRole("navigation", { name: "Site map" }),
  ).toBeVisible();
});

test("mobile menu retains native navigation without JavaScript", async ({
  browser,
}, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string")
    throw new Error("Playwright project must configure baseURL");
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 320, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/guides/economic-democracy/");
  const disclosure = page.locator("details.mobile-navigation");
  await disclosure.locator("summary").click();
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(disclosure.getByRole("link")).toHaveCount(9);
  await expect(disclosure.locator('[aria-current="page"]')).toHaveText(
    /Explore/,
  );
  await context.close();
});

test("homepage purpose and evidence trail survive no JavaScript, zoom, and keyboard use", async ({
  browser,
  page,
}, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string")
    throw new Error("Playwright project must configure baseURL");
  const noScriptContext = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const noScriptPage = await noScriptContext.newPage();
  await noScriptPage.goto("/");
  await expect(
    noScriptPage.getByRole("heading", {
      level: 1,
      name: "The label is only the beginning.",
    }),
  ).toBeVisible();
  await expect(
    noScriptPage.getByRole("link", { name: /Explore the subjects/ }),
  ).toBeVisible();
  await expect(
    noScriptPage.getByText("Exact location", { exact: true }),
  ).toBeVisible();
  await expect(noScriptPage.getByText("Role", { exact: true })).toBeVisible();
  await expect(noScriptPage.locator(".homepage-trace__map")).toHaveCSS(
    "grid-template-columns",
    /^\d+(?:\.\d+)?px$/,
  );
  await noScriptContext.close();

  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto("/");
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
  const primary = page.getByRole("link", { name: /Explore the subjects/ });
  await primary.focus();
  await expect(primary).toBeFocused();
  const outline = await primary.evaluate(
    (element) => getComputedStyle(element).outlineStyle,
  );
  expect(outline).not.toBe("none");

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  const traceMap = page.locator(".homepage-trace__map");
  await expect(traceMap).toHaveCSS(
    "grid-template-columns",
    /^\d+(?:\.\d+)?px \d+(?:\.\d+)?px$/,
  );
  await page
    .getByRole("link", { name: /Open the claim and its citations/ })
    .click();
  await expect(page).toHaveURL(
    /\/guides\/capitalism\/#capitalism-marx-definition$/,
  );
  const claim = page.locator("#capitalism-marx-definition");
  await expect(claim).toBeVisible();
  await expect(
    claim.getByText("chapter 7, section 2", { exact: false }),
  ).toBeVisible();

  await page.goto("/");
  await page.emulateMedia({ forcedColors: "active" });
  await expect(page.locator(".homepage-trace")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await page.emulateMedia({ media: "print", forcedColors: "none" });
  const correctionLink = page.getByRole("link", {
    name: "suggest a correction",
  });
  const printedSuffix = await correctionLink.evaluate(
    (element) => getComputedStyle(element, "::after").content,
  );
  expect(printedSuffix).toContain(
    "github.com/dougborg/ends-and-means/issues/new",
  );
  expect(printedSuffix).not.toContain("%3A");
});

test("Explore search preserves owned meanings and explicit research gaps", async ({
  page,
}) => {
  await page.goto("/explore/", { waitUntil: "networkidle" });
  const search = page.getByRole("searchbox", {
    name: "What do you want to understand?",
  });
  const results = page.locator("[data-subject-result]:visible");

  await search.fill("communist countries");
  await expect
    .poll(() => new URL(page.url()).searchParams.get("q"))
    .toBe("communist countries");
  await expect(results).toHaveCount(1);
  await expect(
    results.getByRole("heading", { name: "Communism" }),
  ).toBeVisible();
  await expect(
    results.getByText(
      /A country or party label does not establish one institutional model/,
    ),
  ).toBeVisible();

  await search.fill("direct democracy");
  await expect(results).toHaveCount(1);
  await expect(
    results.getByRole("heading", { name: "Economic democracy" }),
  ).toBeVisible();
  await expect(
    results.getByText("Research gap", { exact: true }),
  ).toBeVisible();
  await expect(
    results.getByText(/not a general account of direct democracy/),
  ).toBeVisible();

  await search.fill("a subject that is not here");
  await expect(results).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: "No subject guide matches that phrase.",
    }),
  ).toBeVisible();
  await expect(page.locator("#subject-search-status")).toContainText(
    "No reviewed guides match",
  );

  await search.fill("");
  await expect
    .poll(() => new URL(page.url()).searchParams.has("q"))
    .toBe(false);
  await expect(results).toHaveCount(canonicalGraph.subjectGuides.length);
});

test("Explore restores query state from initial URLs and browser history", async ({
  page,
}) => {
  await page.goto("/explore/?q=communism", { waitUntil: "networkidle" });
  const search = page.getByRole("searchbox", {
    name: "What do you want to understand?",
  });
  const results = page.locator("[data-subject-result]:visible");
  await expect(search).toHaveValue("communism");
  await expect(results).toHaveCount(1);

  await page.evaluate(() =>
    history.pushState(null, "", "/explore/?q=socialism"),
  );
  await page.evaluate(() => history.back());
  await expect(search).toHaveValue("communism");
  await page.evaluate(() => history.forward());
  await expect(search).toHaveValue("socialism");
  await expect(
    results.getByRole("heading", { name: "Socialism" }),
  ).toBeVisible();
});

test("Explore directory remains complete without JavaScript", async ({
  browser,
}, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string")
    throw new Error("Playwright project must configure baseURL");
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
  });
  try {
    const page = await context.newPage();
    await page.goto("/explore/?q=communism", { waitUntil: "networkidle" });
    await expect(page.locator("[data-subject-result]")).toHaveCount(
      canonicalGraph.subjectGuides.length,
    );
    expect(await page.locator("noscript").textContent()).toContain(
      "Use your browser's Find command",
    );
    await expect(
      page.getByText("communist countries", { exact: true }),
    ).toBeAttached();
    await expect(
      page.getByRole("link", { name: "Learn about Communism →" }),
    ).toHaveAttribute("href", "/guides/communism/");
  } finally {
    await context.close();
  }
});

test("Explore search reflows for mobile and text zoom", async ({ page }) => {
  for (const width of [320, 390, 640]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/explore/", { waitUntil: "networkidle" });
    if (width === 640)
      await page.evaluate(() => {
        document.documentElement.style.zoom = "2";
      });
    await page
      .getByRole("searchbox", { name: "What do you want to understand?" })
      .fill("worker ownership");
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(1);
    await expect(
      page.getByRole("link", { name: "Learn about Socialism →" }),
    ).toBeVisible();
  }
});

test("central planning guide, case, and approach remain readable across viewports", async ({
  page,
}) => {
  const routes = [
    "/guides/central-planning/",
    "/cases/us-controlled-materials-plan/",
    "/explore/us-wartime-production-mobilization/",
  ];
  const viewports = [
    { width: 1440, height: 1000 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
        `${route} at ${viewport.width}px`,
      ).toBeLessThanOrEqual(1);
      const summaries = page.locator("summary");
      expect(
        await summaries.count(),
        `${route} should expose evidence disclosures`,
      ).toBeGreaterThan(0);
      expect(
        await summaries.evaluateAll((items) =>
          items.every((item) => (item.textContent ?? "").trim().length > 0),
        ),
        `${route} disclosure names`,
      ).toBe(true);
    }
  }
});
