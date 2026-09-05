import { describe, expect, it } from "vitest";
import { loadNarrative, parseNarrative } from "../../content/domain/presentation/load-narrative";
import { renderSafeMarkdown } from "../../src/lib/markdown";
import { dossierForSubject } from "../../src/lib/domain/canonical";

describe("Markdown narrative authoring", () => {
  it("loads reviewed prose into the typed Dossier manifest", () => {
    const dossier = dossierForSubject("case", "swedish-wage-earner-funds");
    expect(dossier?.standfirst).toContain("From 1984 through 1991");
    expect(dossier?.sections[0]?.body).toContain("public investment fund");
  });

  it("requires Markdown sections to match the typed manifest exactly", () => {
    expect(() => parseNarrative("Standfirst.\n\n## expected\n\nBody.", "fixture.md", ["expected", "missing"])).toThrow(
      "fixture.md: narrative section mismatch (missing: missing; unexpected: none)",
    );
    expect(() => parseNarrative("Standfirst.\n\n## unexpected\n\nBody.", "fixture.md", [])).toThrow(
      "fixture.md: narrative section mismatch (missing: none; unexpected: unexpected)",
    );
    expect(() => parseNarrative("Standfirst.\n\n## repeated\n\nOne.\n\n## repeated\n\nTwo.", "fixture.md", ["repeated"])).toThrow(
      "fixture.md: duplicate narrative sections: repeated",
    );
  });

  it("keeps narrative reads inside the canonical directory", () => {
    expect(() => loadNarrative("../README.md", [])).toThrow("Narrative filename must not contain a path");
  });

  it("escapes raw HTML and unsafe link protocols", () => {
    const html = renderSafeMarkdown('Safe **emphasis**. <script>alert(1)</script> [unsafe](javascript:alert(1))');
    expect(html).toContain("<strong>emphasis</strong>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain('<a href="">unsafe</a>');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("javascript:");
  });
});
