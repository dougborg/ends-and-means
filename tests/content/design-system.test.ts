import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseAstro } from "@astrojs/compiler";
import type { ElementNode, Node as AstroNode } from "@astrojs/compiler/types";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import {
  ident,
  parse as parseCss,
  type Atrule,
  type CssNode,
} from "css-tree";
import { parse as parsePostCss } from "postcss";
import { describe, expect, it } from "vitest";
import EditorialHeader from "../../src/components/EditorialHeader.astro";
import Notice from "../../src/components/Notice.astro";

const root = path.resolve(import.meta.dirname, "../..");
const sourceDirectory = path.join(root, "src");

async function productionStylesheets(
  directory = sourceDirectory,
): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const candidate = path.join(directory, entry.name);
        if (entry.isDirectory()) return productionStylesheets(candidate);
        return entry.isFile() && entry.name.endsWith(".css") ? [candidate] : [];
      }),
    )
  )
    .flat()
    .toSorted();
}

async function stylesheetContents() {
  return Promise.all(
    (await productionStylesheets()).map(async (file) => ({
      file: path.relative(sourceDirectory, file),
      css: await readFile(file, "utf8"),
    })),
  );
}

async function productionAstroFiles(
  directory = sourceDirectory,
): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const candidate = path.join(directory, entry.name);
        if (entry.isDirectory()) return productionAstroFiles(candidate);
        return entry.isFile() && entry.name.endsWith(".astro")
          ? [candidate]
          : [];
      }),
    )
  )
    .flat()
    .toSorted();
}

const namedLayers = new Set(["tokens", "base", "layout", "components", "pages"]);

function findStyleElements(node: AstroNode): ElementNode[] {
  const own = node.type === "element" && node.name === "style" ? [node] : [];
  if (!("children" in node)) return own;
  return own.concat(node.children.flatMap(findStyleElements));
}

async function astroStyleBlocks(source: string): Promise<string[] | undefined> {
  const result = await parseAstro(source, { position: true });
  if (result.diagnostics.length > 0) return undefined;

  const styles = findStyleElements(result.ast);
  if (styles.some((style) => !style.position?.end)) return undefined;
  if (styles.some((style) => style.children.some((child) => child.type !== "text"))) {
    return undefined;
  }
  return styles.map((style) => style.children.map((child) => child.value).join(""));
}

function isAllowedLayer(node: CssNode): node is Atrule {
  if (node.type !== "Atrule" || node.name.toLowerCase() !== "layer") return false;
  if (!node.block || node.prelude?.type !== "AtrulePrelude") return false;
  const prelude = node.prelude.children.toArray();
  const layerList = prelude.length === 1 ? prelude[0] : undefined;
  if (layerList?.type !== "LayerList") return false;
  const layers = layerList.children.toArray();
  return layers.length === 1
    && layers[0]?.type === "Layer"
    && namedLayers.has(ident.decode(layers[0].name));
}

function isWhollyWrappedInNamedLayer(css: string): boolean {
  try {
    parsePostCss(css, { from: undefined });
    const stylesheet = parseCss(css, { context: "stylesheet" });
    return stylesheet.type === "StyleSheet"
      && stylesheet.children.size === 1
      && isAllowedLayer(stylesheet.children.first as CssNode);
  } catch {
    return false;
  }
}

describe("design-system foundations", () => {
  it("keeps every production stylesheet inside the declared cascade architecture", async () => {
    const contents = await stylesheetContents();
    const global =
      contents.find(({ file }) => file === "styles/global.css")?.css ?? "";

    expect(global).toContain("@layer tokens, base, layout, components, pages;");
    for (const { file, css } of contents) {
      expect(css, file).toMatch(
        /@layer (?:tokens|base|layout|components|pages)\s*{/,
      );
    }
  });

  it("rejects Astro style blocks that bypass the named cascade", async () => {
    for (const file of await productionAstroFiles()) {
      const source = await readFile(file, "utf8");
      const styleBlocks = await astroStyleBlocks(source);

      expect(styleBlocks, path.relative(sourceDirectory, file)).toBeDefined();
      for (const css of styleBlocks ?? []) {
        expect(
          isWhollyWrappedInNamedLayer(css),
          path.relative(sourceDirectory, file),
        ).toBe(true);
      }
    }
  });

  it("detects mixed, spoofed, repeated, and malformed Astro style blocks", async () => {
    const invalid = [
      ".bypass{} @layer components{.ok{}}",
      "/* @layer components {.spoof{}} */ .bypass{}",
      "@layer components{.ok{}} @layer pages{.also{}}",
      "@layer components{.missing-close{}",
      "@layer unknown{.wrong{}}",
    ];
    const valid = [
      "@layer components{.ok{color:var(--text)}}",
      "/* why this is local */ @layer pages { .quoted::after { content: '}'; } }",
      "@layer compon\\65 nts { .escaped { color: var(--text); } }",
    ];

    for (const css of invalid) expect(isWhollyWrappedInNamedLayer(css), css).toBe(false);
    for (const css of valid) expect(isWhollyWrappedInNamedLayer(css), css).toBe(true);
    expect(await astroStyleBlocks("<style>@layer components{.ok{}}</style><style>broken"))
      .toBeUndefined();
    expect(await astroStyleBlocks(`---
const example = "<style>.frontmatter-bypass{}</style>";
---
<style is:global data-example=">">@layer components{.ok{}}</style>
<style>@layer pages{.also-ok{content:"}"}}</style>`))
      .toEqual([
        "@layer components{.ok{}}",
        '@layer pages{.also-ok{content:"}"}}',
      ]);
    expect(await astroStyleBlocks("<style is:global>@layer components{.ok{}}</style>"))
      .toEqual(["@layer components{.ok{}}"]);
    const mixedNodes = await astroStyleBlocks(
      "<style>@layer components{.ok{}}</style><style>.bypass{}</style>",
    );
    expect(mixedNodes).toHaveLength(2);
    expect(mixedNodes?.map(isWhollyWrappedInNamedLayer)).toEqual([true, false]);
  });
});

describe("design tokens and shared components", () => {
  it("keeps all color literals and color functions in the token layer", async () => {
    const contents = await stylesheetContents();
    const tokens =
      contents.find(({ file }) => file === "styles/tokens.css")?.css ?? "";

    expect(tokens).toContain("--canvas:");
    expect(tokens).toContain("--measure-page: 90rem");
    expect(tokens).toContain("--space-1: 0.25rem");
    expect(tokens).toContain("--shadow-panel:");
    for (const { file, css } of contents.filter(
      ({ file }) => file !== "styles/tokens.css",
    )) {
      expect(css, file).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(css, file).not.toMatch(
        /\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color|color-mix)\(/i,
      );
      expect(css, file).not.toMatch(
        /var\(--(?:night|sheet|cobalt|amber|teal|muted|display|reading|apparatus|measure|page)\)/,
      );
    }
  });

  it("uses named width roles instead of recreating the shared content measures", async () => {
    const contents = await stylesheetContents();
    const duplicatedMeasure =
      /max-width:\s*(?:68ch|70ch|72ch|46rem|48rem|58rem|64rem|78rem|90rem)\s*;/;
    const duplicatedRail = /minmax\(\s*13rem\s*,\s*18rem\s*\)/;

    for (const { file, css } of contents.filter(
      ({ file }) => file !== "styles/tokens.css",
    )) {
      expect(css, file).not.toMatch(duplicatedMeasure);
      expect(css, file).not.toMatch(duplicatedRail);
    }
  });

  it("gives native summaries the same visible focus foundation", async () => {
    const base = await readFile(path.join(root, "src/styles/base.css"), "utf8");
    expect(base).toContain(
      ":where(a, button, summary, [tabindex]):focus-visible",
    );
    expect(base).toContain("outline: 3px solid var(--focus)");
  });

  it("renders a conventional editorial header without changing heading semantics", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(EditorialHeader, {
      props: { coordinate: "METHOD", title: "Method" },
      slots: {
        default: '<p class="dek measure-standfirst">An answer first.</p>',
      },
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
