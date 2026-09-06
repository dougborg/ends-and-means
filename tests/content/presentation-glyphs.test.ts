import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Glyph from "../../src/components/Glyph.astro";
import type { EntityKind, SubjectGuideSectionRole } from "../../src/lib/domain";
import {
  glyphFallback,
  glyphForEntityKind,
  glyphForSubjectGuideSection,
  glyphs,
  readerGlyphs,
} from "../../src/lib/presentation-glyphs";

describe("presentation glyph registry", () => {
  it("covers every reader role with a purpose and text fallback", () => {
    expect(Object.keys(readerGlyphs)).toEqual([
      "idea-definition",
      "proposed-aim",
      "institution-mechanism",
      "bounded-practice",
      "question-disagreement",
      "evidence-source",
      "change-over-time",
    ]);
    for (const definition of Object.values(glyphs)) {
      expect(definition.purpose.length).toBeGreaterThan(20);
      expect(definition.fallback.length).toBeGreaterThan(2);
    }
  });

  it("maps every guide section while leaving unsupported entity kinds unmapped", () => {
    const roles: SubjectGuideSectionRole[] = [
      "short-answer",
      "meanings-and-boundaries",
      "purposes-and-diagnoses",
      "institutions-and-mechanisms",
      "bounded-practice",
      "variants-and-disputes",
      "comparisons-and-next-steps",
      "depictions",
      "open-questions",
    ];
    expect(roles.map(glyphForSubjectGuideSection)).toEqual([
      "idea-definition",
      "meaning",
      "proposed-aim",
      "institution-mechanism",
      "bounded-practice",
      "variant",
      "comparison",
      "depiction",
      "question-disagreement",
    ]);
    expect(glyphForEntityKind("concept")).toBe("idea-definition");
    expect(glyphForEntityKind("case")).toBe("bounded-practice");
    expect(glyphForEntityKind("source")).toBe("evidence-source");
    expect(glyphForEntityKind("organization")).toBeUndefined();
    expect(glyphForEntityKind("person" as EntityKind)).toBeUndefined();
    expect(glyphFallback(undefined)).toBeUndefined();
  });

  it("is presentation data and does not expose canonical identifiers", () => {
    for (const definition of Object.values(glyphs)) {
      expect(Object.keys(definition).sort()).toEqual([
        "component",
        "fallback",
        "purpose",
      ]);
      expect(definition).not.toHaveProperty("id");
      expect(definition).not.toHaveProperty("kind");
      expect(definition).not.toHaveProperty("relationships");
    }
  });

  it("renders decorative and informative semantics with a safe missing fallback", async () => {
    const container = await AstroContainer.create();
    const decorative = await container.renderToString(Glyph, {
      props: { glyph: "evidence-source", decorative: true },
    });
    const informative = await container.renderToString(Glyph, {
      props: {
        glyph: "bounded-practice",
        decorative: false,
        label: "Bounded case",
        size: "small",
      },
    });
    const missing = await container.renderToString(Glyph, {
      props: {
        glyph: "not-in-the-registry" as never,
        decorative: false,
        label: "Readable fallback",
      },
    });

    expect(decorative).toContain('aria-hidden="true"');
    expect(decorative).not.toContain("aria-label=");
    expect(informative).toContain('role="img"');
    expect(informative).toContain('aria-label="Bounded case"');
    expect(informative).toContain("glyph--small");
    expect(missing).toContain("Readable fallback");
    expect(missing).not.toContain("<svg");
    expect([decorative, informative, missing].join("\n")).not.toMatch(
      /<script|onload=|onclick=|javascript:/iu,
    );
  });
});
