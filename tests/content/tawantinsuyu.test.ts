import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import {
  canonicalGraph,
  citationsFor,
  subjectGuideBySlug,
} from "../../src/lib/domain/canonical";

const statementIds = [
  "tawantinsuyu-name-boundary",
  "tawantinsuyu-chronology-boundary",
  "tawantinsuyu-ruler-kin-authority",
  "tawantinsuyu-provincial-indirect-rule",
  "tawantinsuyu-mita-labor",
  "tawantinsuyu-storage-evidence",
  "tawantinsuyu-road-labor",
  "tawantinsuyu-road-power-limit",
  "tawantinsuyu-land-resource-plurality",
  "tawantinsuyu-mitmaq-resettlement",
  "tawantinsuyu-warfare-incorporation",
  "tawantinsuyu-gender-status-variation",
  "tawantinsuyu-huanuco-material",
  "tawantinsuyu-reciprocity-interpretation",
  "tawantinsuyu-extraction-rival",
  "tawantinsuyu-chronicle-mediation",
  "tawantinsuyu-guaman-poma-service",
  "tawantinsuyu-non-embodiment",
] as const;

describe("Tawantinsuyu learner case", () => {
  it("publishes one bounded case guide with traced atomic claims", () => {
    const guide = subjectGuideBySlug("tawantinsuyu-imperial-organization");
    expect(guide?.publicationStatus).toBe("reviewed");
    expect(guide?.primarySubject).toEqual({
      kind: "case",
      id: "tawantinsuyu-imperial-organization",
    });
    expect(statementIds).toHaveLength(18);
    for (const id of statementIds) {
      const statement = canonicalGraph.indexes.entitiesById[id];
      expect(statement?.kind).toBe("statement");
      expect(citationsFor(id).length).toBeGreaterThan(0);
      expect(
        citationsFor(id).every(({ locator }) => locator.trim().length > 0),
      ).toBe(true);
    }
  });

  it("keeps the evidence minima explicit and independently inspectable", () => {
    const requiredSources = [
      "guaman-poma-coronica-source",
      "cieza-chronicle-peru-source",
      "daltroy-hastorf-storehouses-source",
      "huanuco-pampa-project-source",
      "oxford-handbook-incas-source",
      "daltroy-incas-source",
      "rostworowski-inca-realm-source",
      "julien-reading-inca-history-source",
      "adorno-guaman-poma-source",
    ];
    for (const id of requiredSources)
      expect(canonicalGraph.indexes.entitiesById[id]?.kind).toBe("source");

    expect(
      citationsFor("tawantinsuyu-reciprocity-interpretation")[0]?.object.id,
    ).toBe("murra-economic-organization-source");
    expect(citationsFor("tawantinsuyu-extraction-rival")[0]?.object.id).toBe(
      "daltroy-earle-staple-finance-source",
    );
  });

  it("publishes three focused research obligations and a non-embodiment limit", () => {
    const guide = subjectGuideBySlug("tawantinsuyu-imperial-organization");
    const openQuestions = guide?.sections.find(
      ({ role }) => role === "open-questions",
    );
    expect(openQuestions?.researchObligationIds).toEqual([
      "tawantinsuyu-provincial-variation",
      "tawantinsuyu-colonial-translation",
      "tawantinsuyu-reciprocity-extraction-test",
    ]);
    expect(
      canonicalGraph.indexes.entitiesById["tawantinsuyu-non-embodiment"],
    ).toMatchObject({
      kind: "statement",
      statementKind: "editorial-interpretation",
    });
  });

  it("enters public resolution only through canonical documents", () => {
    expect(
      canonicalDocuments.some(
        (document) =>
          document.documentType === "subject-guide" &&
          document.guide.id === "guide-tawantinsuyu-imperial-organization",
      ),
    ).toBe(true);
  });
});
