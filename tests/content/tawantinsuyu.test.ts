import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import { compileDomainGraph } from "../../src/lib/domain";
import {
  canonicalGraph,
  citationsFor,
  subjectGuideBySlug,
} from "../../src/lib/domain/canonical";

const statementIds = [
  "tawantinsuyu-name-boundary",
  "tawantinsuyu-inka-usage-boundary",
  "tawantinsuyu-inca-spelling-boundary",
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
    expect(statementIds).toHaveLength(20);
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
      "valdeon-cieza-voices-source",
      "upenn-tawantinsuyu-map-source",
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
});

describe("Tawantinsuyu source and publication boundaries", () => {
  it("keeps intellectual-work dates distinct from cited manifestations", () => {
    const authoredWork = canonicalDocuments.find(
      (document) =>
        document.documentType === "entity" &&
        document.entity.id === "cieza-chronicle-peru-work",
    );
    if (
      authoredWork?.documentType !== "entity" ||
      authoredWork.entity.kind !== "work"
    )
      throw new Error("Missing Cieza work fixture");
    expect(authoredWork.entity.originalPublicationYear).toBeUndefined();
    expect(
      Object.hasOwn(
        canonicalGraph.indexes.entitiesById["cieza-chronicle-peru-work"] ?? {},
        "originalPublicationYear",
      ),
    ).toBe(false);
    expect(
      canonicalGraph.indexes.entitiesById["cieza-chronicle-peru-source"],
    ).toMatchObject({
      kind: "source",
      publicationYear: 2010,
    });

    const documents = structuredClone(canonicalDocuments);
    const source = documents.find(
      (document) =>
        document.documentType === "entity" &&
        document.entity.id === "cieza-chronicle-peru-source",
    );
    if (source?.documentType !== "entity" || source.entity.kind !== "source")
      throw new Error("Missing Cieza source fixture");
    source.entity.publicationYear = 2011;
    const mutated = compileDomainGraph(documents);
    expect(
      Object.hasOwn(
        mutated.indexes.entitiesById["cieza-chronicle-peru-work"] ?? {},
        "originalPublicationYear",
      ),
    ).toBe(false);
    expect(
      mutated.indexes.entitiesById["cieza-chronicle-peru-source"],
    ).toMatchObject({
      publicationYear: 2011,
    });
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
