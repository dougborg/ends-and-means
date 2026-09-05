import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { entitiesOfKind } from "../../src/lib/domain/canonical";

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

function stripMarkup(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, " ")
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
    "/framework/",
    ...entitiesOfKind("approach").map(({ id }) => `/explore/${id}/`),
    ...entitiesOfKind("case").map(({ id }) => `/cases/${id}/`),
    ...entitiesOfKind("concept").map(({ id }) => `/concepts/${id}/`),
    ...entitiesOfKind("challenge").map(({ id }) => `/challenges/${id}/`),
    ...entitiesOfKind("source").map(({ id }) => `/sources/${id}/`),
  ];
  for (const route of routes) {
    const html = await readFile(routeFile(route), "utf8");
    const text = stripMarkup(html);
    expect(html.match(/<main\b/gi), route).toHaveLength(1);
    expect(html.match(/<h1\b/gi), route).toHaveLength(1);
    expect(text.length, route).toBeGreaterThan(200);
    expect(html, route).not.toMatch(/<astro-island\b/i);
    expect(text, route).not.toMatch(
      /transitional|migration status|research draft|working material|first canonical slice|canonical (?:graph|model|catalogue|sources)/i,
    );
  }

  await verifyExploreAndCaseRoutes();
  await verifyReferenceRoutes();
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
  expect(stripMarkup(canonicalCase)).toContain("The argument in plain terms");
  expect(canonicalCase).toContain("<details");

  await verifyConceptRoutes();
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
  expect(stripMarkup(concept)).toContain("Swedish wage-earner fund program");
  expect(hrefs(concept)).toContain(
    "https://en.wikipedia.org/wiki/Economic_democracy",
  );

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
      expect(source, path.relative(root, file)).not.toMatch(
        /archive\/legacy-research|content\/framework|lib\/(?:framework|prototype|content)/,
      );
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
