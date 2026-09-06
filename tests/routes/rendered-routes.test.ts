import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { workflowReferencesIn } from "../../src/lib/domain";
import { canonicalGraph, entitiesOfKind } from "../../src/lib/domain/canonical";
import { editorialGovernanceContract } from "../../src/lib/editorial-governance";
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
    "/governance/",
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
    ["Governance", "/governance/"],
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
    expect(html, route).toContain('href="/third-party-notices.txt"');
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
  expect(stripMarkup(explore)).toContain("What should you know?");
  expect(stripMarkup(explore)).toContain("The mechanism that was enacted");
  expect(stripMarkup(explore)).toContain("Sources for “The problem it tried to address”");
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
  expect(stripMarkup(explore)).toContain("Compare promise with practice");
  expect(stripMarkup(explore)).not.toContain("Compare promise and practice");

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
  expect(stripMarkup(canonicalCase)).toContain("Compare promise with practice");
  expect(stripMarkup(canonicalCase)).not.toContain("Compare promise and practice");
  expect(stripMarkup(canonicalCase)).toContain(
    "How would Swedish listed-company ownership",
  );
  expect(hrefs(canonicalCase)).toContain("/research/");
  expect(stripMarkup(canonicalCase)).toContain("What happened in this case?");
  expect(stripMarkup(canonicalCase)).toContain("What are the case boundaries and records?");
  expect(canonicalCase).toContain("<details");

  await verifyConceptRoutes();
  await verifyOrientationRoutes();
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
  expect(stripMarkup(explore)).toContain("What do you want to understand?");
  expect(stripMarkup(explore)).toContain("communist countries");
  expect(stripMarkup(explore)).toContain("worker ownership");
  expect(stripMarkup(explore)).toContain("direct democracy");
  expect(stripMarkup(explore)).toContain("Research gap");
  expect(explore).not.toMatch(/research-needed|in-review|deprecated/i);

  const guide = await readFile(
    routeFile("/guides/economic-democracy/"),
    "utf8",
  );
  const text = stripMarkup(guide);
  expect(text).toContain("What does economic democracy mean?");
  expect(text).toContain("Does it mean one institutional model?");
  expect(text).toContain("making them a bounded test of one mechanism");
  expect(text).toContain("Sources for the short answer");
  expect(text).toContain("Sources for “What question does it ask?”");
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
  expect(stripMarkup(socialism)).toContain(
    "do not show how socialist institutions would work elsewhere",
  );
  expect(hrefs(socialism)).toContain("/cases/swedish-wage-earner-funds/");
  expect(hrefs(socialism)).toContain("/concepts/economic-planning/");
  expect(hrefs(socialism)).toContain("/concepts/market-coordination/");

  const communism = await readFile(routeFile("/guides/communism/"), "utf8");
  expect(stripMarkup(communism)).toContain("What does communism mean?");
  expect(stripMarkup(communism)).toContain(
    "Why is the same word used for an ideal, movement, and state label?",
  );
  expect(stripMarkup(communism)).toContain("Which bounded cases still need evidence?");
  expect(hrefs(communism)).toContain("/concepts/socialism/");
  expect(hrefs(communism)).toContain("/concepts/social-class/");
  expect(hrefs(communism)).toContain("/concepts/statelessness/");
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
  expect(stripMarkup(concept)).toContain("Definition");
  expect(stripMarkup(concept)).not.toContain("What should you know?");
  expect(stripMarkup(concept)).toContain("Does it prescribe one model?");
  expect(stripMarkup(concept)).toContain(
    "balances worker, shareholder, and community representation",
  );
  expect(stripMarkup(concept)).toContain("attributed proposal");
  expect(stripMarkup(concept)).toContain(
    "ownership, voice, representation, and practical decision power",
  );
  expect(stripMarkup(concept)).toContain("Sources for this overview");
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
  expect(socialDemocracyText).toContain("Sources for this overview");
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

async function verifyOrientationRoutes() {
  const democracy = await readFile(routeFile("/concepts/democracy/"), "utf8");
  expect(hrefs(democracy)).toEqual(
    expect.arrayContaining([
      "https://en.wikipedia.org/wiki/Democracy",
      "https://www.wikidata.org/wiki/Q7174",
    ]),
  );
  expect(stripMarkup(democracy)).toContain(
    "Orientation and identity links are not evidence",
  );
}

async function verifyMethodRoute() {
  const method = await readFile(routeFile("/framework/"), "utf8");
  expect(method).toMatch(/<main[^>]*class="[^"]*\bsite-main--wide\b[^"]*"/);
  expect(hasElementWithClasses(method, "article", ["editorial-page", "method-page"])).toBe(true);
  expect(hasElementWithClasses(method, "header", ["editorial-header"])).toBe(true);
  expect(method).toMatch(
    /class="comparison-grid criteria-grid"[^>]*data-comparison-columns="3"/,
  );
  expect(method.match(/class="comparison-grid criteria-grid"/g)).toHaveLength(
    1,
  );
  const methodText = stripMarkup(method);
  expect(methodText).toContain("How we research and classify.");
  expect(methodText).toContain("How can I check an explanation?");
  expect(methodText).toContain("What kinds of judgment stay separate?");
  expect(methodText).toContain("Evidence about what happened");
  expect(methodText).toContain("Explanations of why it happened");
  expect(methodText).toContain("Judgments about whether it was good");
  expect(methodText).toContain("A case shows a setting, not a perfect example.");
  expect(methodText).toContain("What does the evidence trail contain?");
  expect(methodText).toContain("A work is the underlying book");
  expect(methodText).toContain("A source is the particular edition");
  expect(methodText).toContain("always names a precise page, table, section, timestamp");
  expect(methodText).toContain("attribute a value or purpose to a named actor");
  expect(methodText).toContain("describe a proposed design");
  expect(methodText).toContain("record a classification or causal hypothesis");
  expect(methodText).toContain("make an editorial interpretation");
  expect(methodText).toContain("factual, attributed, and analytical language");
  expect(methodText).toContain("support, challenge, qualify, or provide context");
  expect(methodText).toContain("These links are orientation aids, not evidence.");
  expect(methodText).toContain("Within a case, an episode narrows attention");
  expect(methodText).toContain("conditions, formal rules, rules in use, interactions, and outcomes");
  expect(methodText).toContain("Qualifications and limits attach to the claims they constrain");
  expect(methodText).toContain("What happens when the evidence is not enough?");
  expect(methodText).toContain("The live site includes only material that has been checked against its sources");
  expect(methodText).toContain("No score or automated rule settles a contested identity.");
  expect(methodText).toContain("Human judgment remains accountable.");
  expect(methodText).toContain("Fairness does not give every account equal weight");
  expect(methodText).toContain("A counterfactual makes the comparison explicit");
  expect(methodText).toContain("Go to the passage");
  expect(methodText).toContain("name the page or claim");
  expect(methodText).toContain("A person reviews the proposal");
  expect(methodText).toContain("public repository history");
  expect(methodText).not.toMatch(/technical apparatus|learner path|pull request|migration/i);
  expect(hrefs(method)).toEqual(expect.arrayContaining([
    "/research/",
    "/governance/",
    "https://github.com/dougborg/ends-and-means/blob/main/docs/project-vision.md",
    "https://github.com/dougborg/ends-and-means/blob/main/docs/editorial-philosophy.md",
    "https://github.com/dougborg/ends-and-means/blob/main/CONTRIBUTING.md",
    expect.stringMatching(/^https:\/\/github\.com\/dougborg\/ends-and-means\/issues\/new\?title=Correction/),
    "https://github.com/dougborg/ends-and-means/blob/main/docs/domain-model.md",
  ]));
}

async function verifyGovernanceRoute() {
  const governance = await readFile(routeFile("/governance/"), "utf8");
  expect(governance).toMatch(/<main[^>]*class="[^"]*\bsite-main--wide\b[^"]*"/);
  expect(hasElementWithClasses(governance, "article", ["editorial-page", "governance-page"])).toBe(true);
  expect(hasElementWithClasses(governance, "header", ["editorial-header"])).toBe(true);
  expect(governance).toContain(`data-editorial-intake="${editorialGovernanceContract.editorialIntake}"`);
  expect(governance).toContain(`data-recusal-authority="${editorialGovernanceContract.conflictedDecision}"`);
  expect(governance).toContain(`data-record-boundary="${editorialGovernanceContract.recordBoundary}"`);
  const links = hrefs(governance);
  expect(links.filter((href) => /title=Correction/.test(href))).toHaveLength(1);
  expect(links.filter((href) => /title=Reconsideration/.test(href))).toHaveLength(1);
  expect(links.some((href) => /security\/advisories|private.*report/i.test(href))).toBe(false);
  expect(stripMarkup(governance)).not.toMatch(/pull request|worktree|\bWIP\b|migration|agent/i);
}

async function verifyReferenceRoutes() {
  await verifyMethodRoute();
  await verifyGovernanceRoute();
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
  expect(stripMarkup(compare)).toContain("Compare promise with practice");
  expect(stripMarkup(compare)).toContain("Did the design deliver what its advocates sought?");
  expect(stripMarkup(compare)).toContain("Why no score?");
  expect(stripMarkup(compare)).toContain(
    "Collective wage-earner shareholding authority",
  );
  expect(stripMarkup(compare)).toContain("This scale describes; it does not judge.");
  expect(stripMarkup(compare)).toContain("1984–1991 · Sweden");
  expect(stripMarkup(compare)).toContain("1992 · Sweden");
  expect(stripMarkup(compare)).not.toContain("1992–1992");
  expect(stripMarkup(compare)).not.toContain("undefined");

  const challenge = await readFile(
    routeFile("/challenges/distribution-of-gains-and-ownership/"),
    "utf8",
  );
  expect(stripMarkup(challenge)).toMatch(/^(?![\s\S]*What should you know\?)[\s\S]*Why this question matters[\s\S]*How published approaches respond/u);
  expect(stripMarkup(challenge)).toContain("Swedish wage-earner fund program");
  expect(stripMarkup(challenge)).toContain("APPROACH / Qualified");
  expect(stripMarkup(challenge)).not.toContain("research-needed");

  const reading = await readFile(routeFile("/reading/"), "utf8");
  expect(reading).toMatch(/<main[^>]*class="[^"]*\bsite-main--wide\b[^"]*"/);
  expect(hasElementWithClasses(reading, "article", ["editorial-page", "reading-page"])).toBe(true);
  expect(hasElementWithClasses(reading, "header", ["editorial-header"])).toBe(true);
  expect(stripMarkup(reading)).toContain("Which sources support the explanations?");
  expect(stripMarkup(reading)).not.toMatch(/published source records|published evidence/i);
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
