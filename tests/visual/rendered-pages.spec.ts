import { expect, test } from "@playwright/test";

const defaultRoutes = [
  "/",
  "/explore/swedish-wage-earner-fund-program/",
  "/explore/swedish-rehn-meidner-model/",
  "/cases/swedish-wage-earner-funds/",
  "/cases/swedish-solidaristic-bargaining/",
  "/compare/",
  "/concepts/economic-democracy/",
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
        const lowContrast = [...document.querySelectorAll("main h1, main h2, main h3, main h4, main p, main a, main summary, main strong, main small")].flatMap((element) => {
          const style = getComputedStyle(element);
          const bounds = element.getBoundingClientRect();
          if (style.visibility === "hidden" || style.display === "none" || bounds.width === 0 || bounds.height === 0) return [];
          const foreground = parseColor(style.color);
          const background = backgroundFor(element);
          const light = Math.max(luminance(foreground), luminance(background));
          const dark = Math.min(luminance(foreground), luminance(background));
          const ratio = (light + 0.05) / (dark + 0.05);
          const fontSize = Number.parseFloat(style.fontSize);
          const fontWeight = style.fontWeight === "bold"
            ? 700
            : style.fontWeight === "normal"
              ? 400
              : Number.parseInt(style.fontWeight, 10) || 400;
          const minimum = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700) ? 3 : 4.5;
          return ratio + 0.01 < minimum ? [{ element: element.tagName.toLowerCase(), text: element.textContent?.trim().slice(0, 80), ratio: Number(ratio.toFixed(2)), minimum }] : [];
        });

        const declared = new Set<string>();
        const used = new Set<string>();
        for (const sheet of [...document.styleSheets]) {
          let rules: CSSRuleList;
          try { rules = sheet.cssRules; } catch { continue; }
          for (const rule of [...rules]) {
            const css = rule.cssText;
            for (const match of css.matchAll(/(--[\w-]+)\s*:/g)) if (match[1]) declared.add(match[1]);
            for (const match of css.matchAll(/var\((--[\w-]+)/g)) if (match[1]) used.add(match[1]);
          }
        }

        return {
          horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          lowContrast,
          undefinedTokens: [...used].filter((token) => !declared.has(token)).sort(),
        };
      });

      expect(browserErrors).toEqual([]);
      expect(audit.horizontalOverflow).toBeLessThanOrEqual(1);
      expect(audit.undefinedTokens).toEqual([]);
      expect(audit.lowContrast).toEqual([]);
    });
  }
}
