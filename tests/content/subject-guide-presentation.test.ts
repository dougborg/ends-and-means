import { describe, expect, it } from "vitest";
import type {
  DomainRelationship,
  SubjectGuide,
  SubjectGuideSection,
} from "../../src/lib/domain";
import { canonicalGraph } from "../../src/lib/domain/canonical";
import {
  directSubjectGuideEvidence,
  hasSubjectGuideDirectory,
  subjectGuideRelationshipDetails,
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

const baseRelationship = {
  subject: { kind: "concept", id: "subject" },
  object: { kind: "concept", id: "object" },
  status: "contested",
  statementIds: ["statement"] as string[],
  scope: {
    startDate: "1984",
    endDate: "1991",
    placeIds: ["sweden"] as string[],
    note: "Limited to the enacted program.",
  },
} as const;

function relationshipQualificationCases() {
  return [
    [
      "membership",
      {
        ...baseRelationship,
        id: "membership",
        predicate: "member-of",
        object: { kind: "collection", id: "collection" },
        membership: "contested",
      },
      ["Evidence status", "When", "Where", "Scope", "Membership"],
    ],
    [
      "implementation",
      {
        ...baseRelationship,
        id: "implementation",
        predicate: "used-means",
        subject: { kind: "case", id: "case" },
        object: { kind: "means", id: "means" },
        implementation: "rules-in-use",
      },
      ["Evidence status", "When", "Where", "Scope", "Implementation"],
    ],
    [
      "conclusion",
      {
        ...baseRelationship,
        id: "conclusion",
        predicate: "assessed-by",
        subject: { kind: "case", id: "case" },
        object: { kind: "criterion", id: "criterion" },
        conclusion: "mixed",
      },
      ["Evidence status", "When", "Where", "Scope", "Conclusion"],
    ],
    [
      "interpretation",
      {
        ...baseRelationship,
        id: "interpretation",
        predicate: "interprets-concept",
        subject: { kind: "approach", id: "approach" },
        role: "contested",
        interpretation: "A bounded synthetic interpretation.",
      },
      ["Evidence status", "When", "Where", "Scope", "Role", "Interpretation"],
    ],
    [
      "placement",
      {
        ...baseRelationship,
        id: "placement",
        predicate: "placed-on",
        object: { kind: "comparison-dimension", id: "dimension" },
        value: { kind: "range", fromCategoryId: "low", toCategoryId: "high" },
        basis: "case-observation",
        uncertainty: "Evidence varies by period.",
      },
      [
        "Evidence status",
        "When",
        "Where",
        "Scope",
        "Placement",
        "Basis",
        "Uncertainty",
      ],
    ],
  ] satisfies Array<[string, DomainRelationship, string[]]>;
}

describe("SubjectGuide relationship qualifications", () => {
  it.each(relationshipQualificationCases())(
    "preserves %s qualifications behind learner-facing disclosure",
    (_name, relationship, labels) => {
      const details = subjectGuideRelationshipDetails(relationship, {
        entityLabel: (id) => (id === "sweden" ? "Sweden" : undefined),
        placementValueLabel: () => "Low to high",
      });
      expect(details.map(({ label }) => label)).toEqual(labels);
      expect(details).toContainEqual({
        label: "Evidence status",
        value: "contested",
      });
      expect(details).toContainEqual({ label: "Where", value: "Sweden" });
    },
  );

  it("collapses identical scope endpoints and retains citation roles", () => {
    const scoped = subjectGuideRelationshipDetails({
      ...baseRelationship,
      id: "scoped",
      predicate: "related-to",
      scope: { startDate: "1992", endDate: "1992" },
    });
    expect(scoped).toContainEqual({ label: "When", value: "1992" });

    const citation = subjectGuideRelationshipDetails({
      id: "citation",
      predicate: "cites",
      subject: { kind: "statement", id: "statement" },
      object: { kind: "source", id: "source" },
      role: "qualifies",
      locator: "p. 42",
      note: "Read with the appendix.",
    });
    expect(citation).toEqual([
      { label: "Source role", value: "qualifies" },
      { label: "Location in source", value: "p. 42" },
      { label: "Source note", value: "Read with the appendix." },
    ]);
  });
});
