import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { workflowReferencesIn } from "../../src/lib/domain";
import { canonicalGraph, entitiesOfKind } from "../../src/lib/domain/canonical";
import { findForbiddenPublicationReference } from "../../src/lib/domain/publication-boundary";

const root = path.resolve(import.meta.dirname, "../..");
const dist = path.join(root, "dist");
const routeFile = (route: string) =>
  path.join(dist, route.replace(/^\//, ""), "index.html");

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map(async (entry) =>
        entry.isDirectory()
          ? walk(path.join(directory, entry.name))
          : [path.join(directory, entry.name)],
      ),
    )
  ).flat();
}

function hrefs(html: string): string[] {
  return [
    ...html.matchAll(/<a\b[^>]*\bhref=(?:"([^"]*)"|'([^']*)')[^>]*>/gi),
  ].map((match) => match[1] ?? match[2] ?? "");
}

function hasElementWithClasses(
  html: string,
  tag: "article" | "header",
  expectedClasses: string[],
): boolean {
  return [...html.matchAll(new RegExp(`<${tag}(?=[\\s/>])[^>]*>`, "gi"))].some(
    ([element]) => {
      const classNames =
        element?.match(/\bclass=(?:"([^"]*)"|'([^']*)')/i)?.slice(1).find(Boolean)
          ?.split(/\s+/)
          .filter(Boolean) ?? [];
      return expectedClasses.every((className) => classNames.includes(className));
    },
  );
}

it("requires the exact supported tag when matching element classes", () => {
  expect(
    hasElementWithClasses('<header-nav class="editorial-header"></header-nav>', "header", [
      "editorial-header",
    ]),
  ).toBe(false);
  expect(
    hasElementWithClasses('<header class="extra editorial-header"></header>', "header", [
      "editorial-header",
    ]),
  ).toBe(true);
});

function stripElement(html: string, tag: "script" | "style"): string {
  let output = html;
  while (true) {
    const lower = output.toLowerCase();
    const start = lower.indexOf(`<${tag}`);
    if (start === -1) return output;
    const close = lower.indexOf(`</${tag}`, start);
    const end = close === -1 ? -1 : lower.indexOf(">", close);
    if (end === -1) return output.slice(0, start);
    output = `${output.slice(0, start)} ${output.slice(end + 1)}`;
  }
}

function stripMarkup(html: string): string {
  return stripElement(stripElement(html, "script"), "style")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function resolves(pathname: string): Promise<boolean> {
  const candidate = path.join(
    dist,
    decodeURIComponent(pathname).replace(/^\//, ""),
  );
  for (const possibility of path.extname(candidate)
    ? [candidate]
    : [candidate, `${candidate}.html`, path.join(candidate, "index.html")]) {
    try {
      if ((await stat(possibility)).isFile()) return true;
    } catch {
      /* Try the next static-host form. */
    }
  }
  return false;
}

async function verifyEveryPublicRecordRenders() {
  const routes = [
    "/",
    "/explore/",
    "/cases/",
    "/compare/",
    "/challenges/",
    "/reading/",
    "/research/",
    "/framework/",
    ...entitiesOfKind("approach").map(({ id }) => `/explore/${id}/`),
    ...entitiesOfKind("case").map(({ id }) => `/cases/${id}/`),
    ...entitiesOfKind("concept").map(({ id }) => `/concepts/${id}/`),
    ...entitiesOfKind("challenge").map(({ id }) => `/challenges/${id}/`),
    ...entitiesOfKind("source").map(({ id }) => `/sources/${id}/`),
    ...canonicalGraph.subjectGuides.map(({ slug }) => `/guides/${slug}/`),
  ];
  for (const route of routes) {
    const html = await readFile(routeFile(route), "utf8");
    const text = stripMarkup(html);
    expect(html.match(/<main\b/gi), route).toHaveLength(1);
    expect(html.match(/<h1\b/gi), route).toHaveLength(1);
    expect(text.length, route).toBeGreaterThan(200);
    expect(html, route).not.toMatch(/<astro-island\b/i);
    expect(workflowReferencesIn(text), route).toEqual([]);
    for (const [, classNames] of html.matchAll(
      /class="([^"]*\bdek\b[^"]*)"/g,
    )) {
      expect(classNames?.split(/\s+/), route).toContain("measure-standfirst");
    }
  }

  await verifyExploreAndCaseRoutes();
  await verifyReferenceRoutes();
  await verifyGlobalNavigation();
}

async function verifyGlobalNavigation() {
  const expectedPrimary = [
    ["Explore", "/explore/"],
    ["Cases", "/cases/"],
    ["Compare", "/compare/"],
    ["Questions", "/challenges/"],
  ];
  const expectedSiteMap = [["Home", "/"], ...expectedPrimary,
    ["Sources", "/reading/"],
    ["Method", "/framework/"],
  ];
  const linksIn = (navigation: string) =>
    [
      ...navigation.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi),
    ].map((match) => [stripMarkup(match[2] ?? ""), match[1] ?? ""]);
  const navigationIn = (html: string, name: string) =>
    html.match(
      new RegExp(`<nav[^>]*aria-label="${name}"[^>]*>[\\s\\S]*?<\\/nav>`),
    )?.[0] ?? "";

  for (const [route, currentLabel] of [
    ["/", "Home"],
    ["/explore/", "Explore"],
    ["/guides/economic-democracy/", "Explore"],
    ["/concepts/economic-democracy/", "Explore"],
    ["/sources/erixon-rehn-meidner-model-source/", "Sources"],
  ] as const) {
    const html = await readFile(routeFile(route), "utf8");
    const primary = navigationIn(html, "Primary");
    const siteMap = navigationIn(html, "Site map");
    expect(primary, route).not.toBe("");
    expect(siteMap, route).not.toBe("");
    expect(linksIn(primary), route).toEqual(expectedPrimary);
    expect(linksIn(siteMap), route).toEqual(expectedSiteMap);
    expect(primary.match(/aria-current="page"/g) ?? [], route).toHaveLength(
      ["Explore", "Cases", "Compare", "Questions"].includes(currentLabel)
        ? 1
        : 0,
    );
    expect(siteMap.match(/aria-current="page"/g) ?? [], route).toHaveLength(1);
    expect(siteMap, route).toMatch(
      new RegExp(`aria-current="page"[^>]*>${currentLabel}<`),
    );
  }
}

async function verifyExploreAndCaseRoutes() {
  const home = await readFile(routeFile("/"), "utf8");
  expect(stripMarkup(home)).toContain("Research you can inspect");
  expect(stripMarkup(home)).not.toContain("Earlier working material");
  expect(home).toMatch(/href="\/cases\/">Browse the case directory/);

  const explore = await readFile(
    routeFile("/explore/swedish-wage-earner-fund-program/"),
    "utf8",
  );
  expect(stripMarkup(explore)).toContain("The problem it tried to address");
  expect(stripMarkup(explore)).toContain("The mechanism that was enacted");
  expect(stripMarkup(explore)).toContain("How this section is supported");
  expect(explore).toContain("<details");
  expect(
    explore.match(/class="canonical-claim"/g)?.length,
  ).toBeGreaterThanOrEqual(2);
  expect(stripMarkup(explore)).toContain("Claim reviewed");
  expect(stripMarkup(explore)).not.toContain("undefined");
  expect(hrefs(explore)).toContain(
    "https://en.wikipedia.org/wiki/Employee_funds",
  );
  expect(hrefs(explore)).toContain(
    "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/proposition/om-lontagarfonder_g70350/html/",
  );
  expect(hrefs(explore)).toContain("/cases/swedish-wage-earner-funds/");
  expect(hrefs(explore)).toContain("/compare/");

  const canonicalCase = await readFile(
    routeFile("/cases/swedish-wage-earner-funds/"),
    "utf8",
  );
  expect(stripMarkup(canonicalCase)).toContain("Formal design");
  expect(stripMarkup(canonicalCase)).toContain("Rules in use");
  expect(stripMarkup(canonicalCase)).toContain("Observed outcomes");
  expect(stripMarkup(canonicalCase)).toContain(
    "From wage-earner fund boards to liquidation administration",
  );
  expect(stripMarkup(canonicalCase)).toContain("RELATED IDEAS");
  expect(hrefs(canonicalCase)).toContain("/concepts/economic-democracy/");
  expect(hrefs(canonicalCase)).toContain("https://doi.org/10.1017/eso.2022.23");
  expect(hrefs(canonicalCase)).toContain(
    "/explore/swedish-wage-earner-fund-program/",
  );
  expect(hrefs(canonicalCase)).toContain("/compare/");
  expect(stripMarkup(canonicalCase)).toContain(
    "How would Swedish listed-company ownership",
  );
  expect(hrefs(canonicalCase)).toContain("/research/");
  expect(stripMarkup(canonicalCase)).toContain("The argument in plain terms");
  expect(canonicalCase).toContain("<details");

  await verifyConceptRoutes();
  await verifySubjectGuideRoutes();
}

async function verifySubjectGuideRoutes() {
  const explore = await readFile(routeFile("/explore/"), "utf8");
  expect(stripMarkup(explore)).toContain(
    "Start with what you want to understand",
  );
  expect(hrefs(explore)).toContain("/guides/economic-democracy/");
  expect(hrefs(explore)).toContain("/guides/socialism/");
  expect(hrefs(explore)).toContain("/guides/communism/");

  const guide = await readFile(
    routeFile("/guides/economic-democracy/"),
    "utf8",
  );
  const text = stripMarkup(guide);
  expect(text).toContain("What does economic democracy mean?");
  expect(text).toContain("Does it mean one institutional model?");
  expect(text).toContain("making them a bounded test of one mechanism");
  expect(text).toContain("Check the evidence");
  expect(text).toContain("What remains open?");
  expect(text).not.toContain("Depictions");
  expect(text).not.toMatch(/research-needed|in-review|deprecated/i);
  expect(guide).not.toContain("<astro-island");
  expect(hrefs(guide)).toContain("/concepts/economic-democracy/");
  expect(hrefs(guide)).toContain("/cases/swedish-wage-earner-funds/");
  expect(hrefs(guide)).toContain("#meanings-and-boundaries");

  const socialism = await readFile(routeFile("/guides/socialism/"), "utf8");
  expect(stripMarkup(socialism)).toContain("What does socialism mean?");
  expect(stripMarkup(socialism)).toContain("What can one Swedish experiment show?");
  expect(hrefs(socialism)).toContain("/cases/swedish-wage-earner-funds/");

  const communism = await readFile(routeFile("/guides/communism/"), "utf8");
  expect(stripMarkup(communism)).toContain("What does communism mean?");
  expect(stripMarkup(communism)).toContain(
    "Why is the same word used for an ideal, movement, and state label?",
  );
  expect(stripMarkup(communism)).toContain("Which bounded cases still need evidence?");
  expect(hrefs(communism)).toContain("/concepts/socialism/");
}

async function verifyConceptRoutes() {
  const rehnMeidner = await readFile(
    routeFile("/explore/swedish-rehn-meidner-model/"),
    "utf8",
  );
  const rehnContinue =
    rehnMeidner.match(/<nav class="next-actions"[\s\S]*?<\/nav>/)?.[0] ?? "";
  expect(hrefs(rehnContinue)).toEqual([
    "/cases/swedish-solidaristic-bargaining/",
  ]);
  const bargainingCase = await readFile(
    routeFile("/cases/swedish-solidaristic-bargaining/"),
    "utf8",
  );
  const bargainingContinue =
    bargainingCase.match(/<nav class="next-actions"[\s\S]*?<\/nav>/)?.[0] ?? "";
  expect(hrefs(bargainingContinue)).toEqual([
    "/explore/swedish-rehn-meidner-model/",
  ]);

  const concept = await readFile(
    routeFile("/concepts/economic-democracy/"),
    "utf8",
  );
  expect(stripMarkup(concept)).toContain(
    "How published approaches use this idea",
  );
  expect(stripMarkup(concept)).toContain("Does it prescribe one model?");
  expect(stripMarkup(concept)).toContain(
    "balances worker, shareholder, and community representation",
  );
  expect(stripMarkup(concept)).toContain("attributed proposal");
  expect(stripMarkup(concept)).toContain(
    "ownership, voice, representation, and practical decision power",
  );
  expect(stripMarkup(concept)).toContain("How this summary is supported");
  expect(stripMarkup(concept)).toContain("Swedish wage-earner fund program");
  expect(stripMarkup(concept)).toContain(
    "Under what conditions do codetermination or worker voice",
  );
  expect(hrefs(concept)).toContain("/research/");
  expect(hrefs(concept)).toContain(
    "https://en.wikipedia.org/wiki/Economic_democracy",
  );
  expect(hrefs(concept)).toContain(
    "https://plato.stanford.edu/entries/economic-democracy/",
  );
  expect(hrefs(concept)).toContain(
    "https://doi.org/10.1111/j.1467-9248.1990.tb00569.x",
  );
  expect(hrefs(concept)).toContain(
    "/explore/swedish-wage-earner-fund-program/",
  );
  expect(hrefs(concept)).toContain("/cases/swedish-wage-earner-funds/");

  const socialDemocracy = await readFile(
    routeFile("/concepts/social-democracy/"),
    "utf8",
  );
  const socialDemocracyText = stripMarkup(socialDemocracy);
  expect(socialDemocracyText).toContain("Where did the tradition come from?");
  expect(socialDemocracyText).toContain("How this summary is supported");
  expect(socialDemocracyText).toContain("Dylan Riley treats that genealogy");
  expect(hrefs(socialDemocracy)).toContain(
    "https://doi.org/10.1002/9781118474396.wbept0951",
  );
  expect(hrefs(socialDemocracy)).toContain(
    "https://newleftreview.org/issues/ii76/articles/dylan-riley-bernstein-s-heirs",
  );
  expect(hrefs(socialDemocracy)).toContain(
    "https://plato.stanford.edu/archives/fall2024/entries/socialism/",
  );
  expect(hrefs(socialDemocracy)).toContain(
    "/explore/swedish-rehn-meidner-model/",
  );
  expect(hrefs(socialDemocracy)).toContain(
    "/explore/swedish-wage-earner-fund-program/",
  );
}

async function verifyReferenceRoutes() {
  const method = await readFile(routeFile("/framework/"), "utf8");
  expect(method).toMatch(/<main[^>]*class="[^"]*\bsite-main--wide\b[^"]*"/);
  expect(hasElementWithClasses(method, "article", ["editorial-page", "method-page"])).toBe(true);
  expect(hasElementWithClasses(method, "header", ["editorial-header"])).toBe(true);
  expect(method).toMatch(
    /class="comparison-grid criteria-grid"[^>]*data-comparison-columns="2"/,
  );
  expect(method.match(/class="comparison-grid criteria-grid"/g)).toHaveLength(
    1,
  );

  const research = await readFile(routeFile("/research/"), "utf8");
  const researchText = stripMarkup(research);
  const researchIds = [
    ...research.matchAll(/\bid=(?:"([^"]+)"|'([^']+)')/gi),
  ].map((match) => match[1] ?? match[2]);
  expect(
    new Set(researchIds).size,
    "research page has duplicate element IDs",
  ).toBe(researchIds.length);
  expect(researchText).toContain("What the evidence does not yet settle.");
  expect(researchText).toContain("Counterarguments");
  expect(researchText).toContain("Counterfactual questions");
  expect(researchText).toContain("Research gaps");
  expect(researchText).toContain(
    "Can democratic firm governance coordinate specialized work",
  );
  expect(researchText).toContain("counterargument / open");
  expect(researchText).toContain("Claims this question tests");
  expect(researchText).toContain("Evidence needed");
  expect(hrefs(research)).toContain(
    "/concepts/economic-democracy/#what-can-democratic-designs-fail-to-achieve",
  );
  expect(hrefs(research)).toContain(
    "/concepts/social-democracy/#where-the-tradition-came-from",
  );
  expect(hrefs(research)).toContain(
    "/cases/swedish-wage-earner-funds/#what-they-did-in-practice",
  );

  const compare = await readFile(routeFile("/compare/"), "utf8");
  expect(compare).toContain("<table>");
  expect(stripMarkup(compare)).toContain("Why no score?");
  expect(stripMarkup(compare)).toContain(
    "Collective wage-earner shareholding authority",
  );
  expect(stripMarkup(compare)).toContain("Dimension, not Criterion.");
  expect(stripMarkup(compare)).toContain("1984–1991 · Sweden");
  expect(stripMarkup(compare)).toContain("1992 · Sweden");
  expect(stripMarkup(compare)).not.toContain("1992–1992");
  expect(stripMarkup(compare)).not.toContain("undefined");

  const challenge = await readFile(
    routeFile("/challenges/distribution-of-gains-and-ownership/"),
    "utf8",
  );
  expect(stripMarkup(challenge)).toContain("How published approaches respond");
  expect(stripMarkup(challenge)).toContain("Swedish wage-earner fund program");
  expect(stripMarkup(challenge)).toContain("APPROACH / Qualified");
  expect(stripMarkup(challenge)).not.toContain("research-needed");

  const reading = await readFile(routeFile("/reading/"), "utf8");
  expect(reading).toMatch(/<main[^>]*class="[^"]*\bsite-main--wide\b[^"]*"/);
  expect(hasElementWithClasses(reading, "article", ["editorial-page", "reading-page"])).toBe(true);
  expect(hasElementWithClasses(reading, "header", ["editorial-header"])).toBe(true);
  expect(
    hrefs(reading).filter((href) => href.startsWith("/sources/")),
  ).toHaveLength(entitiesOfKind("source").length);
  expect(stripMarkup(reading)).not.toContain("Every record here is connected");
  const firstSource = entitiesOfKind("source")[0];
  if (!firstSource) throw new Error("Expected at least one canonical Source");
  const source = await readFile(
    routeFile(`/sources/${firstSource.id}/`),
    "utf8",
  );
  expect(stripMarkup(source)).toContain("Where this source is used");
  expect(stripMarkup(source)).toMatch(/supports|qualifies|context|challenges/);
}

describe("canonical public routes", () => {
  it("does not publish retired or archived route families", async () => {
    for (const route of [
      "/systems/",
      "/cruxes/",
      "/cells/",
      "/prototype/",
      "/traditions/",
      "/topics/",
    ])
      expect(await resolves(route), route).toBe(false);
  });

  it("keeps archived research outside production imports", async () => {
    const productionFiles = (await walk(path.join(root, "src"))).filter(
      (file) => /\.(?:astro|ts|css)$/.test(file),
    );
    for (const file of productionFiles) {
      const source = await readFile(file, "utf8");
      expect(
        findForbiddenPublicationReference(source),
        path.relative(root, file),
      ).toBeUndefined();
    }
  });

  it(
    "renders every public record from the canonical graph",
    verifyEveryPublicRecordRenders,
  );

  it("has no broken internal document or asset links", async () => {
    const broken: string[] = [];
    for (const file of (await walk(dist)).filter((candidate) =>
      candidate.endsWith(".html"),
    )) {
      for (const href of hrefs(await readFile(file, "utf8"))) {
        const url = new URL(href, "https://endsandmeans.info");
        if (
          url.origin !== "https://endsandmeans.info" ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          href.startsWith("#")
        )
          continue;
        if (!(await resolves(url.pathname)))
          broken.push(`${path.relative(dist, file)} -> ${href}`);
      }
    }
    expect(broken).toEqual([]);
  });
});
