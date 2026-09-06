import { describe, expect, it } from "vitest";
import {
  citationsFor,
  dossierForSubject,
  entityById,
  relationshipsFrom,
  researchObligationsForTarget,
  subjectGuideById,
} from "../../src/lib/domain/canonical";

const expectedCitations = {
  "democracy-usage-plural": [
    "sep-democracy-source",
    "section 1, paragraphs 1–7",
  ],
  "democracy-public-equality-end": [
    "sep-democracy-source",
    "section 2.2.3, paragraphs 1–8",
  ],
  "democracy-voting-boundary": [
    "sep-democracy-source",
    "section 1, paragraphs 4–7",
  ],
  "democracy-representation-mechanism": [
    "sep-democracy-source",
    "section 4.2, paragraphs 1–5",
  ],
  "democracy-sortition-alternative": [
    "sep-democracy-source",
    "section 4.2.6, paragraphs 1–2",
  ],
  "democracy-measurement-selection": [
    "idea-democracy-indices-methodology-source",
    "chapter 1, ‘The objective’; chapter 2, ‘Measuring the Global State of Democracy’",
  ],
  "democracy-kahnawake-boundary": [
    "horn-miller-indigenous-participatory-democracy-source",
    "pp. 113–118, CDMP as a bridge between systems",
  ],
  "democracy-majority-limit": [
    "sep-democracy-source",
    "section 3.3, paragraphs 1–9",
  ],
  "republic-form-boundary": [
    "sep-republicanism-source",
    "section 1, paragraphs 1–6",
  ],
  "republic-democracy-distinction": [
    "federalist-39-source",
    "paragraphs beginning “What, then, are the distinctive characters” and “It is sufficient for such a government”",
  ],
  "republicanism-tradition-boundary": [
    "sep-republicanism-source",
    "section 1, paragraphs 1–6",
  ],
  "republic-nondomination-end": [
    "sep-republicanism-source",
    "section 1.2, paragraphs 1–6",
  ],
  "madison-republic-popular-source": [
    "federalist-39-source",
    "paragraph beginning “If we resort for a criterion”",
  ],
  "us-republic-elector-boundary": [
    "us-constitution-source",
    "Article I, section 2, clause 1",
  ],
  "india-democratic-republic-self-description": [
    "india-constitution-source",
    "Preamble; article 326",
  ],
  "republic-kahnawake-divergence": [
    "horn-miller-indigenous-participatory-democracy-source",
    "pp. 111–118, community and institutional account of the CDMP",
  ],
} as const;

describe("democracy and republic evidence", () => {
  it("pins every atomic statement to its exact source and locator", () => {
    expect(Object.keys(expectedCitations)).toHaveLength(16);
    for (const [statementId, [sourceId, locator]] of Object.entries(
      expectedCitations,
    )) {
      expect(entityById(statementId), statementId).toMatchObject({
        kind: "statement",
      });
      expect(citationsFor(statementId), statementId).toEqual([
        expect.objectContaining({
          object: { kind: "source", id: sourceId },
          locator,
        }),
      ]);
    }
    expect(
      new Set(Object.values(expectedCitations).map(([sourceId]) => sourceId))
        .size,
    ).toBeGreaterThanOrEqual(6);
  });

  it("keeps concepts, traditions, approaches, ends, means, and evidence distinct", () => {
    expect(entityById("democracy")).toMatchObject({ kind: "concept" });
    expect(entityById("republic")).toMatchObject({ kind: "concept" });
    expect(entityById("representative-democratic-government")).toMatchObject({
      kind: "approach",
    });
    expect(entityById("equal-political-standing")).toMatchObject({
      kind: "end",
    });
    expect(entityById("electoral-representation")).toMatchObject({
      kind: "means",
    });
    expect(relationshipsFrom("democracy")).toContainEqual(
      expect.objectContaining({
        id: "democracy-related-to-republic",
        status: "qualified",
      }),
    );
    expect(
      relationshipsFrom("democracy").some(({ predicate }) =>
        ["advances-end", "advocates-means", "member-of"].includes(predicate),
      ),
    ).toBe(false);
    expect(
      relationshipsFrom("republic").some(({ predicate }) =>
        ["advances-end", "advocates-means", "member-of"].includes(predicate),
      ),
    ).toBe(false);
  });
});

describe("democracy and republic learner journeys", () => {
  it("publishes complete traceable guides with bounded evidence and open questions", () => {
    for (const id of ["democracy", "republic"] as const) {
      const dossier = dossierForSubject("concept", id);
      const guide = subjectGuideById(`guide-${id}`);
      expect(
        dossier?.sections.every(({ statementIds }) => statementIds.length > 0),
      ).toBe(true);
      expect(guide?.sections.map(({ role }) => role)).toEqual(
        id === "democracy"
          ? [
              "short-answer",
              "meanings-and-boundaries",
              "institutions-and-mechanisms",
              "bounded-practice",
              "variants-and-disputes",
              "comparisons-and-next-steps",
              "open-questions",
            ]
          : [
              "short-answer",
              "meanings-and-boundaries",
              "purposes-and-diagnoses",
              "institutions-and-mechanisms",
              "bounded-practice",
              "variants-and-disputes",
              "comparisons-and-next-steps",
              "open-questions",
            ],
      );
      expect(
        guide?.sections.find(({ role }) => role === "bounded-practice")
          ?.entityRefs,
      ).toContainEqual({ kind: "case", id: "kahnawake-community-lawmaking" });
      expect(researchObligationsForTarget("concept", id)).toHaveLength(1);
    }
  });
});
