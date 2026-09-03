import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import framework from "../../content/framework/graph.json";

const root = path.resolve(import.meta.dirname, "../..");
const dist = path.join(root, "dist");

function routeFile(route: string): string {
  return path.join(dist, route.replace(/^\//, ""), "index.html");
}

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  }));
  return nested.flat();
}

function hrefs(html: string): string[] {
  return [...html.matchAll(/<a\b[^>]*\bhref=(?:"([^"]*)"|'([^']*)')[^>]*>/gi)]
    .map((match) => match[1] ?? match[2] ?? "");
}

function routeHrefs(html: string, prefix: string): string[] {
  return hrefs(html)
    .map((href) => new URL(href, "https://endsandmeans.info").pathname)
    .filter((pathname) => pathname.startsWith(prefix));
}

function stripMarkup(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function resolves(pathname: string): Promise<boolean> {
  const decoded = decodeURIComponent(pathname);
  const candidate = path.join(dist, decoded.replace(/^\//, ""));
  const possibilities = path.extname(candidate)
    ? [candidate]
    : [candidate, `${candidate}.html`, path.join(candidate, "index.html")];

  for (const possibility of possibilities) {
    try {
      if ((await stat(possibility)).isFile()) return true;
    } catch {
      // Try the next form supported by static hosts.
    }
  }
  return false;
}

describe("generated reference routes", () => {
  it("does not publish retired matrix or standalone prototype routes", async () => {
    for (const route of ["/systems/", "/cruxes/", "/cells/", "/prototype/", "/traditions/"]) {
      expect(await resolves(route), route).toBe(false);
    }
  });

  it("renders the migrated framework through clean public routes", async () => {
    const routes = [
      "/", "/topics/", "/challenges/", "/approaches/", "/reading/", "/framework/",
      ...framework.topics.map(({ id }) => `/topics/${id}/`),
      ...framework.challenges.map(({ id }) => `/challenges/${id}/`),
      ...framework.approaches.map(({ id }) => `/approaches/${id}/`),
      ...framework.sources.map(({ id }) => `/sources/${id}/`),
    ];
    expect(routes).toHaveLength(79);

    for (const route of routes) {
      const html = await readFile(routeFile(route), "utf8");
      const text = stripMarkup(html);
      expect(html.match(/<main\b/gi), route).toHaveLength(1);
      expect(html.match(/<h1\b/gi), route).toHaveLength(1);
      expect(text.length, route).toBeGreaterThan(250);
      expect(html, route).not.toMatch(/<astro-island\b/i);
      expect(text, route).not.toMatch(/\bcrux(?:es)?\b/i);
    }

    const home = await readFile(routeFile("/"), "utf8");
    expect(home.match(/class="tradition-card"/g)).toHaveLength(8);
    expect(stripMarkup(home)).toContain("PRIMARY ENTRY POINT / 8 DOSSIERS");
    const primaryNav = home.match(/<nav aria-label="Primary navigation">([\s\S]*?)<\/nav>/)?.[1] ?? "";
    expect(routeHrefs(primaryNav, "/approaches/")[0]).toBe("/approaches/");
    expect(primaryNav.indexOf("Approaches")).toBeLessThan(primaryNav.indexOf("Challenges"));

    const challenge = await readFile(routeFile("/challenges/distribution-of-gains-and-ownership/"), "utf8");
    expect(challenge.match(/class="response-draft"/g)).toHaveLength(8);
    expect(stripMarkup(challenge)).toContain("migrated research leads, not reviewed conclusions");

    const tradition = await readFile(routeFile("/approaches/social-democratic-tradition/"), "utf8");
    expect(tradition.match(/proposed Means<\/small>/g)).toHaveLength(9);
    expect(tradition.match(/<section class="tradition-faq"/g)).toHaveLength(1);
    expect(tradition.match(/<details>/g)).toHaveLength(14);
    expect(stripMarkup(tradition)).toContain("Questions & misconceptions");
    expect(stripMarkup(tradition)).toContain("Evidence to investigate");
    expect(tradition.match(/class="tradition-evidence"/g)).toHaveLength(1);
    expect(stripMarkup(tradition)).toContain("From stated Ends to bounded evidence");
    expect(stripMarkup(tradition)).toContain("Two episodes, kept distinct");
    expect(stripMarkup(tradition)).toContain("COMPLETE ARGUMENT TRACE");
    expect(stripMarkup(tradition)).toContain("EVIDENCE / PUBLISHED ANALYSIS");
    expect(stripMarkup(tradition)).toContain("Who receives benefits, resources, authority, and adjustment costs?");
    expect(hrefs(tradition)).toContain("https://en.wikipedia.org/wiki/Social_democracy");
    expect(hrefs(tradition).filter((href) => href === "https://doi.org/10.2753/JEI0021-3624440306").length).toBeGreaterThanOrEqual(3);
    expect(hrefs(tradition).filter((href) => href === "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/proposition/om-lontagarfonder_g70350/html/").length).toBeGreaterThanOrEqual(3);

    const laissezFaire = await readFile(routeFile("/approaches/laissez-faire-capitalism/"), "utf8");
    expect(laissezFaire).not.toMatch(/class="tradition-evidence"/);

    const topic = await readFile(routeFile("/topics/ownership/"), "utf8");
    expect(stripMarkup(topic)).toContain("Challenges connected to ownership");
    expect(routeHrefs(topic, "/challenges/").filter((href) => href !== "/challenges/")).toHaveLength(3);

    const reading = await readFile(routeFile("/reading/"), "utf8");
    expect(routeHrefs(reading, "/sources/")).toHaveLength(51);
    const source = await readFile(routeFile(`/sources/${framework.sources[0]!.id}/`), "utf8");
    expect(stripMarkup(source)).toContain("Where this source is used");
    expect(stripMarkup(source)).toContain("bibliographic record only");
  });

  it("has no broken internal document or asset links", async () => {
    const htmlFiles = (await walk(dist)).filter((file) => file.endsWith(".html"));
    const broken: string[] = [];

    for (const file of htmlFiles) {
      const html = await readFile(file, "utf8");
      for (const href of hrefs(html)) {
        const url = new URL(href, "https://endsandmeans.info");
        if (url.origin !== "https://endsandmeans.info" || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
        if (!(await resolves(url.pathname))) broken.push(`${path.relative(dist, file)} -> ${href}`);
      }
    }

    expect(broken).toEqual([]);
  });
});
