import { describe, expect, it } from "vitest";
import type { SubjectGuide, SubjectGuideSection } from "../../src/lib/domain";
import { canonicalGraph } from "../../src/lib/domain/canonical";
import {
  directSubjectGuideEvidence,
  hasSubjectGuideDirectory,
  subjectGuideSectionHasContent,
  visibleSubjectGuideSections,
} from "../../src/lib/subject-guide-presentation";

const section = (
  id: string,
  selections: Partial<SubjectGuideSection> = {},
): SubjectGuideSection => ({
  id,
  role: "meanings-and-boundaries",
  heading: `A deliberately long learner question about ${id}`,
  ...selections,
});

const fixture = (sections: SubjectGuideSection[]): SubjectGuide => ({
  id: "guide-test-presentation",
  slug: "test-presentation",
  label: "Synthetic guide fixture",
  description: "Synthetic test-only presentation material.",
  publicationStatus: "research-needed",
  primarySubject: { kind: "concept", id: "test-concept" },
  searchQueries: [{ query: "test presentation" }],
  sections,
  reviewedAt: "2026-09-05",
});

describe("SubjectGuide presentation states", () => {
  it("omits the guide directory when the live projection is empty", () => {
    expect(hasSubjectGuideDirectory([])).toBe(false);
    expect(hasSubjectGuideDirectory(canonicalGraph.subjectGuides)).toBe(true);
  });

  it.each([
    ["narrative", { narrativeRefs: [{ dossierId: "test-dossier" }] }],
    ["statement", { statementIds: ["test-statement"] }],
    ["entity", { entityRefs: [{ kind: "concept", id: "test-concept" }] }],
    ["relationship", { relationshipIds: ["test-relationship"] }],
    ["question", { researchObligationIds: ["test-obligation"] }],
  ] satisfies Array<[string, Partial<SubjectGuideSection>]>)(
    "keeps a section selected by %s content",
    (_name, selections) => {
      expect(
        subjectGuideSectionHasContent(section("selected", selections)),
      ).toBe(true);
    },
  );

  it("omits empty optional modules without leaving presentation placeholders", () => {
    const sparse = fixture([
      section("answer", { narrativeRefs: [{ dossierId: "test-dossier" }] }),
      { ...section("depictions"), role: "depictions" },
      { ...section("open-questions"), role: "open-questions" },
    ]);

    expect(visibleSubjectGuideSections(sparse).map(({ id }) => id)).toEqual([
      "answer",
    ]);
  });

  it("preserves dense, long-label, disagreement, and open-research selections in authored order", () => {
    const source = canonicalGraph.subjectGuides.find(
      ({ slug }) => slug === "economic-democracy",
    );
    if (!source) throw new Error("Missing real SubjectGuide fixture");
    const dense = structuredClone(source);
    const comparison = dense.sections.find(
      ({ role }) => role === "comparisons-and-next-steps",
    );
    if (!comparison) throw new Error("Missing comparison fixture");
    comparison.statementIds = ["economic-democracy-beyond-workplace"];

    expect(visibleSubjectGuideSections(dense)).toHaveLength(
      dense.sections.length,
    );
    expect(directSubjectGuideEvidence(comparison)).toEqual([
      "economic-democracy-beyond-workplace",
    ]);
    expect(
      dense.sections.find(({ role }) => role === "variants-and-disputes")
        ?.heading.length,
    ).toBeGreaterThan(40);
    expect(
      dense.sections.find(({ role }) => role === "open-questions")
        ?.researchObligationIds,
    ).toHaveLength(1);
  });
});
