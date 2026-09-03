import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import graph from "../../generated/content/graph.json";

const root = path.resolve(import.meta.dirname, "../..");
const dist = path.join(root, "dist");

const expectedRoutes = [
  ...graph.systems.map(({ id }) => `/systems/${id}/`),
  ...graph.cruxes.map(({ id }) => `/cruxes/${id}/`),
  ...graph.cells.map(({ id }) => `/cells/${id}/`),
];

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
  it("emits exactly 8 system, 14 crux, and 112 cell detail pages", async () => {
    const detailFiles = (await walk(dist))
      .filter((file) => /\/(systems|cruxes|cells)\/.+\/index\.html$/.test(file));

    expect(graph.systems).toHaveLength(8);
    expect(graph.cruxes).toHaveLength(14);
    expect(graph.cells).toHaveLength(112);
    expect(expectedRoutes).toHaveLength(134);
    expect(new Set(expectedRoutes).size).toBe(134);
    expect(detailFiles.map((file) => path.relative(dist, file)).sort())
      .toEqual(expectedRoutes.map((route) => `${route.slice(1)}index.html`).sort());
  });

  it("renders semantic, readable content in static HTML", async () => {
    for (const route of ["/systems/lf/", "/cruxes/c01/", "/cells/lf-c01/"]) {
      const html = await readFile(routeFile(route), "utf8");
      const text = stripMarkup(html);

      expect(html).toMatch(/^<!doctype html>/i);
      expect(html).toMatch(/<html\b[^>]*\blang="en"/i);
      expect(html.match(/<main\b/gi)).toHaveLength(1);
      expect(html.match(/<h1\b/gi)).toHaveLength(1);
      expect(html).toMatch(/<nav\b[^>]*aria-label=/i);
      expect(html).toMatch(/<title>[^<]+<\/title>/i);
      expect(text.length).toBeGreaterThan(250);
      expect(html).not.toMatch(/<astro-island\b/i);
    }

    const cell = await readFile(routeFile("/cells/lf-c01/"), "utf8");
    expect(stripMarkup(cell)).toMatch(/Verdict/i);
    expect(stripMarkup(cell)).toMatch(/Evidence/i);
    expect(stripMarkup(cell)).toMatch(/citation/i);
  });

  it("renders the clean analytical-framework prototype as a standalone static view", async () => {
    const html = await readFile(routeFile("/prototype/"), "utf8");
    const text = stripMarkup(html);

    expect(html).toMatch(/<meta name="robots" content="noindex">/);
    expect(html).toMatch(/data-stage="end"/);
    expect(html).toMatch(/data-panel="assessment"/);
    expect(html.match(/class="trace-node/g)).toHaveLength(12);
    expect(text).toContain("Who captures gains from productivity, wage restraint, and capital ownership—and how can that distribution change?");
    expect(text).toContain("Formal rule");
    expect(text).toContain("Observed practice");
    expect(text).toContain("The same limit can mean different things.");
    expect(text).not.toMatch(/\bcrux(?:es)?\b/i);
  });

  it("links each pivot to the complete, unique set of canonical cells", async () => {
    for (const system of graph.systems) {
      const html = await readFile(routeFile(`/systems/${system.id}/`), "utf8");
      const links = routeHrefs(html, `/cells/${system.id}-`);
      expect(new Set(links), system.id).toEqual(new Set(
        graph.cells.filter((cell) => cell.system === system.id).map((cell) => `/cells/${cell.id}/`),
      ));
      expect(links, `${system.id} contains duplicate cell links`).toHaveLength(new Set(links).size);
    }

    for (const crux of graph.cruxes) {
      const html = await readFile(routeFile(`/cruxes/${crux.id}/`), "utf8");
      const expected = graph.cells.filter((cell) => cell.crux === crux.id).map((cell) => `/cells/${cell.id}/`);
      const links = routeHrefs(html, "/cells/").filter((href) => expected.includes(href));
      expect(new Set(links), crux.id).toEqual(new Set(expected));
      expect(links, `${crux.id} contains duplicate cell links`).toHaveLength(new Set(links).size);
    }
  });

  it("links a cell to both pivots and every row and column neighbor", async () => {
    const current = graph.cells.find(({ id }) => id === "lf-c01")!;
    const html = await readFile(routeFile(`/cells/${current.id}/`), "utf8");
    const links = hrefs(html).map((href) => new URL(href, "https://endsandmeans.info").pathname);
    const expectedNeighbors = graph.cells
      .filter((cell) => cell.id !== current.id && (cell.system === current.system || cell.crux === current.crux))
      .map((cell) => `/cells/${cell.id}/`);

    expect(links).toContain(`/systems/${current.system}/`);
    expect(links).toContain(`/cruxes/${current.crux}/`);
    expect(new Set(links.filter((href) => expectedNeighbors.includes(href))))
      .toEqual(new Set(expectedNeighbors));
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
