import { readFile } from "node:fs/promises";
import path from "node:path";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import EditorialHeader from "../../src/components/EditorialHeader.astro";
import Notice from "../../src/components/Notice.astro";

const root = path.resolve(import.meta.dirname, "../..");

describe("design-system foundations", () => {
  it("keeps palette literals in the token layer and page CSS on semantic roles", async () => {
    const [tokens, global, homepage, challenge] = await Promise.all([
      readFile(path.join(root, "src/styles/tokens.css"), "utf8"),
      readFile(path.join(root, "src/styles/global.css"), "utf8"),
      readFile(path.join(root, "src/styles/homepage.css"), "utf8"),
      readFile(path.join(root, "src/styles/challenge-topic.css"), "utf8"),
    ]);

    expect(tokens).toContain("--canvas:");
    expect(tokens).toContain("--measure-page: 90rem");
    expect(tokens).toContain("--space-1: 0.25rem");
    for (const stylesheet of [global, homepage, challenge]) {
      expect(stylesheet).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(stylesheet).not.toMatch(/var\(--(?:night|sheet|cobalt|amber|teal|muted|display|reading|apparatus|measure|page)\)/);
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
