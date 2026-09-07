import { expect, test } from "@playwright/test";

const storageKey = "ends-and-means-theme";

test("System follows the initial and changing operating-system preference", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute(
    "data-effective-theme",
    "light",
  );
  await expect(page.getByRole("radio", { name: "System" })).toBeChecked();
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), storageKey))
    .toBeNull();

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute(
    "data-effective-theme",
    "dark",
  );
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  await expect(page.getByRole("radio", { name: "System" })).toBeChecked();
});

test("explicit Light and Dark choices persist across reloads and routes", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("radio", { name: "Dark" }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute(
    "data-effective-theme",
    "dark",
  );
  await expect(page.locator('meta[data-theme-color="dark"]')).toHaveAttribute(
    "media",
    "all",
  );
  await expect(page.locator('meta[data-theme-color="light"]')).toHaveAttribute(
    "media",
    "not all",
  );
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), storageKey))
    .toBe("dark");

  await page.reload();
  await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();
  await page.goto("/guides/capitalism/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();

  await page.getByRole("radio", { name: "Light" }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute(
    "data-effective-theme",
    "light",
  );
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), storageKey))
    .toBe("light");

  await page.getByRole("radio", { name: "System" }).check();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  await expect(page.locator("html")).toHaveAttribute(
    "data-effective-theme",
    "dark",
  );
  await expect(page.locator('meta[data-theme-color="dark"]')).toHaveAttribute(
    "media",
    "(prefers-color-scheme: dark)",
  );
  await expect(page.locator('meta[data-theme-color="light"]')).toHaveAttribute(
    "media",
    "(prefers-color-scheme: light)",
  );
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), storageKey))
    .toBeNull();
});

test("Appearance exposes native selected state and keyboard operation", async ({
  page,
}) => {
  await page.goto("/");
  const group = page.getByRole("group", { name: "Appearance" });
  await expect(group).toBeVisible();
  const system = group.getByRole("radio", { name: "System" });
  await system.focus();
  await page.keyboard.press("ArrowRight");
  await expect(group.getByRole("radio", { name: "Light" })).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.keyboard.press("ArrowRight");
  await expect(group.getByRole("radio", { name: "Dark" })).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("denied storage fails closed to System while current-page choices still work", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("Storage denied", "SecurityError");
      },
    });
  });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.getByRole("radio", { name: "System" })).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute(
    "data-effective-theme",
    "dark",
  );
  await page.getByRole("radio", { name: "Light" }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveAttribute(
    "data-effective-theme",
    "light",
  );
  await page.evaluate(() =>
    dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })),
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("radio", { name: "Light" })).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute(
    "data-effective-theme",
    "light",
  );
});

test("an unknown stored value is discarded rather than becoming a new theme", async ({
  page,
}) => {
  await page.addInitScript(
    (key) => localStorage.setItem(key, "sepia"),
    storageKey,
  );
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.getByRole("radio", { name: "System" })).toBeChecked();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  await expect(page.locator("html")).toHaveAttribute(
    "data-effective-theme",
    "dark",
  );
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), storageKey))
    .toBeNull();
});

test("no JavaScript follows System and omits the inert control", async ({
  browser,
}, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string")
    throw new Error("Playwright project must configure baseURL");
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    colorScheme: "dark",
  });
  try {
    const page = await context.newPage();
    await page.goto("/guides/democracy/");
    await expect(
      page.getByRole("heading", { name: "Democracy", level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole("group", { name: "Appearance" })).toBeHidden();
    await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
    await expect(page.locator("body")).toHaveCSS("color", "rgb(232, 240, 241)");
  } finally {
    await context.close();
  }
});

test("Dark theme integrates with mobile navigation, forced colors, zoom, and print", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("radio", { name: "Dark" }).check();
  await page.locator("details.mobile-navigation summary").click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();

  await page.emulateMedia({ forcedColors: "active" });
  await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();
  await expect(
    page.getByRole("radio", { name: "Dark" }).locator("+ span"),
  ).toHaveCSS("border-style", "solid");

  await page.emulateMedia({ forcedColors: "none" });
  await page.setViewportSize({ width: 640, height: 900 });
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

  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("group", { name: "Appearance" })).toBeHidden();
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
  await expect(page.locator("html")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("Dark semantic text pairs meet their required contrast", async ({
  page,
}) => {
  await page.addInitScript(
    (key) => localStorage.setItem(key, "dark"),
    storageKey,
  );
  await page.goto("/");
  const ratios = await page.evaluate(() => {
    const channels = (value: string) =>
      value
        .match(/[\d.]+/g)
        ?.slice(0, 3)
        .map(Number) ?? [];
    const luminance = (value: string) => {
      const linear = channels(value).map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return (
        0.2126 * (linear[0] ?? 0) +
        0.7152 * (linear[1] ?? 0) +
        0.0722 * (linear[2] ?? 0)
      );
    };
    const contrast = (foreground: string, background: string) => {
      const element = document.createElement("span");
      element.style.color = `var(--${foreground})`;
      element.style.backgroundColor = `var(--${background})`;
      document.body.append(element);
      const style = getComputedStyle(element);
      const high = Math.max(
        luminance(style.color),
        luminance(style.backgroundColor),
      );
      const low = Math.min(
        luminance(style.color),
        luminance(style.backgroundColor),
      );
      element.remove();
      return (high + 0.05) / (low + 0.05);
    };
    return {
      body: contrast("text", "canvas"),
      surface: contrast("text", "surface"),
      muted: contrast("text-muted", "canvas"),
      link: contrast("link", "canvas"),
      visited: contrast("link-visited", "canvas"),
      evidence: contrast("evidence-text", "evidence-surface"),
      caution: contrast("caution-text", "caution-surface"),
      inverse: contrast("text-inverse", "link"),
      focus: contrast("focus", "canvas"),
    };
  });

  for (const [role, ratio] of Object.entries(ratios)) {
    expect(ratio, role).toBeGreaterThanOrEqual(role === "focus" ? 3 : 4.5);
  }
});

const darkRouteContracts = [
  {
    route: "/",
    landmarks: [".homepage-hero", ".homepage-trace", ".public-commitments"],
  },
  {
    route: "/guides/capitalism/",
    landmarks: [
      ".subject-guide",
      ".subject-guide__layout",
      ".reference-disclosure",
    ],
  },
  {
    route: "/cases/swedish-wage-earner-funds/",
    landmarks: [
      ".case-dossier",
      ".page-outline-layout",
      ".reference-apparatus",
    ],
  },
  {
    route: "/compare/",
    landmarks: [".comparison-table", ".dimension-scale", ".dimension-table"],
  },
  {
    route: "/challenges/",
    landmarks: [".challenge-topic-page", ".indexed-list"],
  },
  {
    route: "/framework/",
    landmarks: [".method-page", ".method-sequence", ".criteria-section"],
  },
  { route: "/reading/", landmarks: [".reading-page", ".reading-section"] },
  {
    route: "/governance/",
    landmarks: [".governance-page", ".section-jump", ".method-records"],
  },
  {
    route: "/research/",
    landmarks: [".research-agenda", ".research-agenda__group"],
  },
];

for (const { route, landmarks } of darkRouteContracts) {
  test(`${route} preserves its hierarchy and semantic surfaces in Dark`, async ({
    page,
  }) => {
    await page.addInitScript(
      (key) => localStorage.setItem(key, "dark"),
      storageKey,
    );
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveAttribute(
      "data-effective-theme",
      "dark",
    );
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("main h2").first()).toBeVisible();
    for (const selector of landmarks)
      await expect(page.locator(selector).first(), selector).toBeVisible();
    const hierarchy = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const body = getComputedStyle(document.body);
      const selectedTheme = document.querySelector(
        ".theme-control input:checked + span",
      );
      if (!(selectedTheme instanceof HTMLElement))
        throw new Error("Selected Appearance option is required");
      const selected = getComputedStyle(selectedTheme);
      return {
        colorScheme: root.colorScheme,
        canvasBackground: root.backgroundColor,
        text: body.color,
        selectedBackground: selected.backgroundColor,
        selectedText: selected.color,
      };
    });
    expect(hierarchy.colorScheme).toBe("dark");
    expect(hierarchy.canvasBackground).not.toBe("rgba(0, 0, 0, 0)");
    expect(hierarchy.text).not.toBe(hierarchy.canvasBackground);
    expect(hierarchy.selectedBackground).not.toBe("rgba(0, 0, 0, 0)");
    expect(hierarchy.selectedBackground).toBe(hierarchy.text);
    expect(hierarchy.selectedBackground).not.toBe(hierarchy.canvasBackground);
    expect(hierarchy.selectedText).not.toBe(hierarchy.selectedBackground);
  });
}
