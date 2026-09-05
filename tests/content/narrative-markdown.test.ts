import { describe, expect, it } from "vitest";
import {
  attachNarrative,
  loadNarrative,
  parseNarrative,
  resolveNarrativeDirectory,
  resolveNarrativePath,
} from "../../content/domain/presentation/load-narrative";
import { dossierForSubject } from "../../src/lib/domain/canonical";
import { renderSafeMarkdown } from "../../src/lib/markdown";
import { validateNarrativeLines } from "../../src/lib/narrative-lines";

describe("Markdown narrative authoring", () => {
  it("loads reviewed prose into the typed Dossier manifest", () => {
    const dossier = dossierForSubject("case", "swedish-wage-earner-funds");
    expect(dossier?.standfirst).toContain("From 1984 through 1991");
    expect(dossier?.sections[0]?.body).toContain("public investment fund");
  });
});

describe("Markdown narrative contracts", () => {
  it("requires Markdown sections to match the typed manifest exactly", () => {
    expect(() =>
      parseNarrative("Standfirst.\n\n## expected\n\nBody.", "fixture.md", [
        "expected",
        "missing",
      ]),
    ).toThrow(
      "fixture.md: narrative section mismatch (missing: missing; unexpected: none)",
    );
    expect(() =>
      parseNarrative("Standfirst.\n\n## unexpected\n\nBody.", "fixture.md", []),
    ).toThrow(
      "fixture.md: narrative section mismatch (missing: none; unexpected: unexpected)",
    );
    expect(() =>
      parseNarrative(
        "Standfirst.\n\n## repeated\n\nOne.\n\n## repeated\n\nTwo.",
        "fixture.md",
        ["repeated"],
      ),
    ).toThrow("fixture.md: duplicate narrative sections: repeated");
  });

  it("keeps narrative reads inside the canonical directory", () => {
    expect(() => loadNarrative("../README.md", [])).toThrow(
      "Narrative filename must not contain a path",
    );
  });

  it("resolves narratives from nested project directories", () => {
    expect(
      resolveNarrativePath(
        "swedish-wage-earner-funds-case.md",
        `${process.cwd()}/docs`,
      ),
    ).toBe(
      `${process.cwd()}/content/domain/presentation/narratives/swedish-wage-earner-funds-case.md`,
    );
    expect(resolveNarrativeDirectory()).toBe(
      `${process.cwd()}/content/domain/presentation/narratives`,
    );
  });

  it("derives the Markdown section contract from the typed manifest", () => {
    expect(() =>
      attachNarrative("swedish-wage-earner-funds-case.md", {
        standfirst: "",
        sections: [{ id: "what-the-funds-were", body: "" }],
      }),
    ).toThrow(
      "unexpected: what-they-were-meant-to-do, what-they-did-in-practice, why-the-case-matters",
    );
  });
});

describe("Markdown narrative syntax", () => {
  it("restricts narratives to one standfirst paragraph and inline Markdown", () => {
    expect(() =>
      parseNarrative("One.\n\nTwo.\n\n## section\n\nBody.", "fixture.md", [
        "section",
      ]),
    ).toThrow("standfirst must be exactly one paragraph");
    for (const unsupported of [
      "# Heading",
      "- list",
      "> quote",
      "```text",
      "<aside>Note</aside>",
      "---",
      "Heading\n===",
      "    indented code",
      "Body with <em>markup</em>.",
      "Body with ![an image](image.svg).",
      "Body with `inline code`.",
    ]) {
      expect(() =>
        parseNarrative(
          `Standfirst.\n\n## section\n\n${unsupported}`,
          "fixture.md",
          ["section"],
        ),
      ).toThrow("supports paragraphs and inline Markdown only");
    }
  });

  it("enforces complete semantic sentences on individual source lines", () => {
    expect(
      validateNarrativeLines(
        "Dr. Smith followed [the evidence](https://example.com).",
      ),
    ).toEqual([]);
    expect(
      validateNarrativeLines("This sentence continues\nonto another line."),
    ).toEqual([
      { line: 1, message: "prose lines must contain one complete sentence" },
    ]);
  });

  it("escapes raw HTML and unsafe link protocols", () => {
    const html = renderSafeMarkdown(
      "Safe **emphasis**. <script>alert(1)</script> [unsafe](javascript:alert(1))",
    );
    expect(html).toContain("<strong>emphasis</strong>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain('<a href="">unsafe</a>');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("javascript:");
  });
});
