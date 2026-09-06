import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import EditorialHeader from "../../src/components/EditorialHeader.astro";
import Notice from "../../src/components/Notice.astro";

const root = path.resolve(import.meta.dirname, "../..");
const sourceDirectory = path.join(root, "src");

async function productionStylesheets(directory = sourceDirectory): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) return productionStylesheets(candidate);
    return entry.isFile() && entry.name.endsWith(".css") ? [candidate] : [];
  }))).flat().toSorted();
}

async function stylesheetContents() {
  return Promise.all((await productionStylesheets()).map(async (file) => ({
    file: path.relative(sourceDirectory, file),
    css: await readFile(file, "utf8"),
  })));
}

describe("design-system foundations", () => {
  it("keeps every production stylesheet inside the declared cascade architecture", async () => {
    const contents = await stylesheetContents();
    const global = contents.find(({ file }) => file === "styles/global.css")?.css ?? "";

    expect(global).toContain("@layer tokens, base, layout, components, pages;");
    for (const { file, css } of contents) {
      expect(css, file).toMatch(/@layer (?:tokens|base|layout|components|pages)\s*{/);
    }
  });

  it("keeps all color literals and color functions in the token layer", async () => {
    const contents = await stylesheetContents();
    const tokens = contents.find(({ file }) => file === "styles/tokens.css")?.css ?? "";

    expect(tokens).toContain("--canvas:");
    expect(tokens).toContain("--measure-page: 90rem");
    expect(tokens).toContain("--space-1: 0.25rem");
    expect(tokens).toContain("--shadow-panel:");
    for (const { file, css } of contents.filter(({ file }) => file !== "styles/tokens.css")) {
      expect(css, file).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(css, file).not.toMatch(/\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color|color-mix)\(/i);
      expect(css, file).not.toMatch(/var\(--(?:night|sheet|cobalt|amber|teal|muted|display|reading|apparatus|measure|page)\)/);
    }
  });

  it("uses named width roles instead of recreating the shared content measures", async () => {
    const contents = await stylesheetContents();
    const duplicatedMeasure = /max-width:\s*(?:68ch|70ch|72ch|46rem|48rem|58rem|64rem|78rem|90rem)\s*;/;
    const duplicatedRail = /minmax\(\s*13rem\s*,\s*18rem\s*\)/;

    for (const { file, css } of contents.filter(({ file }) => file !== "styles/tokens.css")) {
      expect(css, file).not.toMatch(duplicatedMeasure);
      expect(css, file).not.toMatch(duplicatedRail);
    }
  });

  it("gives native summaries the same visible focus foundation", async () => {
    const base = await readFile(path.join(root, "src/styles/base.css"), "utf8");
    expect(base).toContain(":where(a, button, summary, [tabindex]):focus-visible");
    expect(base).toContain("outline: 3px solid var(--focus)");
  });

  it("renders a conventional editorial header without changing heading semantics", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(EditorialHeader, {
      props: { coordinate: "METHOD", title: "Method" },
      slots: { default: '<p class="dek measure-standfirst">An answer first.</p>' },
    });

    expect(html).toContain('<header class="editorial-header">');
    expect(html).toContain("<h1>Method</h1>");
    expect(html).toContain("An answer first.");
  });

  it("renders notices with explicit semantic tone and compact rhythm", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Notice, {
      props: { tone: "caution", compact: true },
      slots: { default: "Evidence remains unsettled." },
    });

    expect(html).toContain("notice--caution");
    expect(html).toContain("notice--compact");
    expect(html).toContain("Evidence remains unsettled.");
  });
});
