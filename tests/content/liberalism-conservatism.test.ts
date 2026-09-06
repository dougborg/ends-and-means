import { describe, expect, it } from "vitest";
import {
  canonicalGraph,
  citationsFor,
  dossierForSubject,
  researchObligationsForTarget,
  subjectGuideBySlug,
} from "../../src/lib/domain/canonical";

const claims = [
  "liberalism-plural-traditions",
  "liberalism-authority-justification",
  "liberalism-liberty-disputes",
  "liberalism-old-new-boundary",
  "liberalism-label-insufficient",
  "mill-liberty-limiting-principle",
  "mill-colonial-exclusion",
  "mehta-liberal-empire-tension",
  "pateman-contract-gender-boundary",
  "india-equality-before-law",
  "india-discrimination-grounds",
  "india-special-provisions",
  "japan-legal-equality",
  "japan-marriage-consent",
  "japan-spousal-equality",
  "japan-rights-drafting-boundary",
  "conservatism-broad-narrow",
  "conservatism-tradition-reform",
  "conservatism-reaction-boundary",
  "conservatism-authoritarian-boundary",
  "conservatism-procedural-substantive",
  "burke-change-conservation",
  "burke-inheritance-prudence",
  "ahlen-programme-economic-order",
  "ahlen-programme-compromise",
  "duesseldorf-social-market-shift",
  "cdu-programme-change-boundary",
  "bell-rival-liberalism-methods",
  "huntington-rival-conservatism-types",
  "right-to-buy-conservative-programme",
  "right-to-buy-statutory-rules",
  "right-to-buy-distribution",
  "swatantra-economic-conservatism",
  "swatantra-ordered-progress",
  "swatantra-gender-limit",
  "swatantra-opposition-practices",
  "india-liberal-rights-test",
  "japan-liberal-rights-test",
  "right-to-buy-conservatism-boundary",
  "swatantra-conservatism-boundary",
  "liberalism-exclusion-evidence-limit",
  "liberalism-atlantic-taxonomy-limit",
  "conservatism-genealogy-limit",
] as const;

describe("Liberalism and Conservatism evidence", () => {
  it("keeps every substantive claim atomic and locator-backed", () => {
    expect(claims).toHaveLength(43);
    const sources = new Set<string>();
    for (const id of claims) {
      expect(canonicalGraph.indexes.entitiesById[id]).toMatchObject({
        kind: "statement",
      });
      const citations = citationsFor(id);
      expect(citations.length, id).toBeGreaterThan(0);
      expect(
        citations.every(({ locator }) => locator.trim().length > 0),
        id,
      ).toBe(true);
      for (const citation of citations) sources.add(citation.object.id);
    }
    expect(sources.size).toBeGreaterThanOrEqual(8);
  });

  it("keeps concepts, cases, and classifications distinct", () => {
    expect(canonicalGraph.indexes.entitiesById.liberalism).toMatchObject({
      kind: "concept",
    });
    expect(canonicalGraph.indexes.entitiesById.conservatism).toMatchObject({
      kind: "concept",
    });
    for (const id of [
      "india-constitutional-rights-settlement-1946-1950",
      "japan-constitutional-rights-settlement-1946-1947",
      "right-to-buy-england-wales-1980-1988",
      "swatantra-opposition-organization-1959-1967",
    ])
      expect(canonicalGraph.indexes.entitiesById[id]).toMatchObject({
        kind: "case",
      });
    for (const id of ["liberalism", "conservatism"])
      expect(
        canonicalGraph.relationships.filter(
          ({ subject, predicate }) =>
            subject.id === id &&
            ["advances-end", "advocates-means", "member-of"].includes(
              predicate,
            ),
        ),
      ).toEqual([]);
  });
});

describe("Liberalism and Conservatism guides", () => {
  it("publishes complete traced guides with bounded examples and open questions", () => {
    for (const id of ["liberalism", "conservatism"] as const) {
      const guide = subjectGuideBySlug(id);
      const dossier = dossierForSubject("concept", id);
      expect(guide?.publicationStatus).toBe("reviewed");
      expect(
        dossier?.sections.every(({ statementIds }) => statementIds.length > 0),
      ).toBe(true);
      expect(guide?.sections.map(({ role }) => role)).toEqual(
        expect.arrayContaining([
          "short-answer",
          "meanings-and-boundaries",
          "institutions-and-mechanisms",
          "bounded-practice",
          "variants-and-disputes",
          "comparisons-and-next-steps",
          "open-questions",
        ]),
      );
      expect(
        guide?.sections.find(({ role }) => role === "bounded-practice")
          ?.entityRefs,
      ).toHaveLength(2);
      expect(researchObligationsForTarget("concept", id)).toHaveLength(
        id === "liberalism" ? 3 : 2,
      );
    }
  });
});
