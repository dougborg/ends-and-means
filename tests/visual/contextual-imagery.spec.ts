import { expect, type Page, test } from "@playwright/test";
import { gotoRenderedPage } from "./support/rendered-page";

const routes = [
  "/concepts/social-ownership/",
  "/concepts/populism/",
  "/guides/central-planning/",
  "/guides/populism/",
  "/guides/tawantinsuyu-imperial-organization/",
  "/guides/economic-democracy/",
  "/concepts/liberalism/",
];

async function expectReservedImageLayout(
  page: Page,
  route: string,
  placementId: string,
  assetPattern: string,
) {
  let releaseAsset = () => {};
  let requestSeen = false;
  const waiting = new Promise<void>((resolve) => {
    releaseAsset = resolve;
  });
  await page.route(assetPattern, async (request) => {
    requestSeen = true;
    await waiting;
    await request.continue();
  });
  try {
    await gotoRenderedPage(page, route);
    const figure = page.locator(`[data-contextual-placement="${placementId}"]`);
    const image = figure.locator("img");
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => requestSeen).toBe(true);
    const before = await figure.evaluate((element) => {
      const imageBox = element.querySelector("img")?.getBoundingClientRect();
      const captionBox = element
        .querySelector("figcaption")
        ?.getBoundingClientRect();
      return {
        imageHeight: imageBox?.height ?? 0,
        imageWidth: imageBox?.width ?? 0,
        captionTop: captionBox?.top ?? 0,
      };
    });
    expect(before.imageWidth).toBeGreaterThan(0);
    expect(before.imageHeight).toBeGreaterThan(0);
    releaseAsset();
    await expect
      .poll(() =>
        image.evaluate((item) => (item as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    const after = await figure.evaluate((element) => {
      const imageBox = element.querySelector("img")?.getBoundingClientRect();
      const captionBox = element
        .querySelector("figcaption")
        ?.getBoundingClientRect();
      return {
        imageHeight: imageBox?.height ?? 0,
        imageWidth: imageBox?.width ?? 0,
        captionTop: captionBox?.top ?? 0,
      };
    });
    for (const key of ["imageHeight", "imageWidth", "captionTop"] as const)
      expect(Math.abs(after[key] - before[key]), key).toBeLessThanOrEqual(1);
  } finally {
    releaseAsset();
    await page.unroute(assetPattern);
  }
}

test("contextual imagery remains stable across responsive layouts", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 820, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      await gotoRenderedPage(page, route);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
        `${route} at ${viewport.width}px`,
      ).toBeLessThanOrEqual(1);
      const media = page.locator("[data-contextual-placement]");
      for (let index = 0; index < (await media.count()); index += 1) {
        const figure = media.nth(index);
        await expect(figure).toBeVisible();
        const image = figure.locator("img");
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveJSProperty("complete", true);
        expect(
          await image.evaluate(
            (element) => (element as HTMLImageElement).naturalWidth,
          ),
        ).toBeGreaterThan(0);
        await expect(
          figure.getByRole("link", { name: "Source record" }),
        ).toHaveAttribute("href", /^https:\/\//);
        await expect(
          figure.getByRole("link", { name: /^Rights note:/ }),
        ).toHaveAttribute("href", /^https:\/\//);
      }
    }
  }
});

test("diagrams expose evidence and source marks retain exact identity", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoRenderedPage(page, "/concepts/populism/");
  const diagram = page.locator(
    '[data-concept-diagram="populism-attributed-accounts-diagram"]',
  );
  await expect(diagram.locator(":scope > ol > li")).toHaveCount(5);
  const evidence = diagram.locator("details");
  await evidence.locator("summary").focus();
  await evidence.locator("summary").press("Enter");
  await expect(evidence).toHaveAttribute("open", "");
  await expect(evidence.locator(".canonical-claim")).toHaveCount(7);

  await page.emulateMedia({ colorScheme: "dark" });
  await gotoRenderedPage(page, "/guides/central-planning/");
  const wpb = page.locator(
    '[data-contextual-placement="central-planning-wpb-seal"]',
  );
  await expect(wpb).toHaveAttribute(
    "data-context-entity",
    "organization:war-production-board",
  );
  await expect(wpb.locator("img")).toHaveAttribute("alt", "");
  await expect(wpb.locator("img")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await expect(wpb).toContainText("War Production Board");

  await gotoRenderedPage(page, "/guides/tawantinsuyu-imperial-organization/");
  await expect(
    page.locator(
      '[data-contextual-placement="tawantinsuyu-guaman-poma-drawing"] img',
    ),
  ).toHaveAttribute("alt", /woman weaving at an upright loom/);
});

test("intrinsic dimensions reserve raster and SVG layout before decoding", async ({
  page,
}) => {
  await page.setViewportSize({ width: 820, height: 1000 });
  await expectReservedImageLayout(
    page,
    "/guides/populism/",
    "populism-peoples-party-print",
    "**/contextual-media/peoples-party-1892-*",
  );
  await expectReservedImageLayout(
    page,
    "/guides/central-planning/",
    "central-planning-wpb-seal",
    "**/contextual-media/war-production-board-seal.svg",
  );
});

test("contextual media remains legible without scripts, in print, and in forced colors", async ({
  browser,
  page,
}, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string")
    throw new Error("Playwright project must configure baseURL");
  const noScript = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const mobile = await noScript.newPage();
  await gotoRenderedPage(mobile, "/guides/populism/");
  await expect(
    mobile.locator(
      '[data-contextual-placement="populism-peoples-party-print"]',
    ),
  ).toBeVisible();
  expect(
    await mobile.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  await noScript.close();

  await page.setViewportSize({ width: 640, height: 900 });
  await page.emulateMedia({ colorScheme: "dark", forcedColors: "active" });
  await gotoRenderedPage(page, "/concepts/social-ownership/");
  await expect(
    page.locator('[data-concept-diagram="social-ownership-rights-diagram"]'),
  ).toBeVisible();
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
  await page.emulateMedia({ media: "print", forcedColors: "none" });
  await expect(
    page.locator('[data-contextual-placement="social-ownership-sweden-place"]'),
  ).toBeVisible();
  await expect(
    page.locator(
      '[data-contextual-placement="social-ownership-sweden-place"] figcaption',
    ),
  ).toContainText("Sweden");
});
