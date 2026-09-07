import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import type { AuthoringDocument } from "../../src/lib/domain";
import { compileDomainGraph } from "../../src/lib/domain";
import {
  citationsFor,
  entityById,
  subjectGuideById,
} from "../../src/lib/domain/canonical";

const statementIds = [
  "environmentalism-contested-family",
  "environmentalism-science-boundary",
  "environmentalism-conservation-boundary",
  "environmentalism-sustainability-boundary",
  "environmentalism-climate-boundary",
  "environmentalism-party-policy-boundary",
  "environmentalism-global-history-plural",
  "environmentalism-poor-attributed-classification",
  "environmental-justice-three-dimensions",
  "indigenous-relations-boundary",
  "colonial-conservation-displacement",
  "nuclear-environmental-policy-boundary",
  "chipko-commercial-forestry-conflict",
  "chipko-organized-tree-protection",
  "chipko-women-participation",
  "chipko-ecofeminist-rival",
  "chipko-state-community-rival",
  "chipko-local-archive-provenance",
  "chipko-case-boundary",
  "warren-county-landfill-siting",
  "warren-county-protest",
  "warren-county-landfill-built",
  "gao-siting-pattern",
  "ucc-national-race-finding",
  "ej-summit-principles",
  "warren-county-causal-boundary",
  "te-awa-legal-person",
  "te-awa-living-whole",
  "te-awa-tupua-kawa",
  "te-pou-tupua-representation",
  "te-awa-iwi-provenance",
  "te-awa-environmentalism-boundary",
] as const;

const caseIds = [
  "chipko-garhwal-1973-1981",
  "warren-county-environmental-justice-1982-1991",
  "te-awa-tupua-framework-2017-present",
] as const;

const obligationIds = [
  "environmentalism-movement-effects",
  "environmentalism-colonial-conservation-outcomes",
  "environmentalism-knowledge-authority",
  "environmentalism-north-south-translation",
  "environmentalism-gendered-claims",
  "environmentalism-nuclear-divergence",
] as const;

function authoredEntity(documents: AuthoringDocument[], id: string) {
  const document = documents.find(
    (entry) => entry.documentType === "entity" && entry.entity.id === id,
  );
  if (document?.documentType !== "entity") throw new Error(`Missing ${id}`);
  return document.entity;
}

describe("foundational Environmentalism guide", () => {
  it("keeps the evidence floor and precise locators visible", () => {
    expect(statementIds.length).toBeGreaterThanOrEqual(20);
    for (const id of statementIds) {
      expect(entityById(id)?.kind).toBe("statement");
      expect(citationsFor(id).length).toBeGreaterThan(0);
      expect(citationsFor(id).every(({ locator }) => locator.length > 0)).toBe(
        true,
      );
    }
    const sourceIds = new Set(
      statementIds.flatMap((id) =>
        citationsFor(id).map(({ object }) => object.id),
      ),
    );
    expect(sourceIds.size).toBeGreaterThanOrEqual(10);
    expect(obligationIds.length).toBeGreaterThanOrEqual(4);
  });

  it("pins Statements, citation roles, and locators", () => {
    expect(
      statementIds.map((id) => {
        const record = entityById(id);
        if (record?.kind !== "statement") throw new Error(`Missing ${id}`);
        return {
          id,
          statementKind: record.statementKind,
          text: record.text,
          citations: citationsFor(id).map(({ object, role, locator }) => ({
            sourceId: object.id,
            role,
            locator,
          })),
        };
      }),
    ).toMatchSnapshot();
  });

  it("pins the Concept, bounded cases, obligations, and guide", () => {
    expect({
      concept: entityById("environmentalism"),
      cases: caseIds.map((id) => entityById(id)),
      obligations: obligationIds.map((id) => entityById(id)),
      guide: subjectGuideById("guide-environmentalism"),
    }).toMatchSnapshot();
  });

  it("publishes three bounded contexts rather than embodiments", () => {
    for (const id of caseIds) expect(entityById(id)?.kind).toBe("case");
    expect(entityById("te-awa-tupua-framework-2017-present")).toMatchObject({
      startDate: { year: 2017 },
      asOf: "2026-09-06",
    });
  });
});

describe("Environmentalism model boundaries", () => {
  it("keeps environmentalism independent from its cases and policies", () => {
    const graph = compileDomainGraph(canonicalDocuments);
    const relationships = graph.relationships.filter(
      ({ subject, object }) =>
        subject.id === "environmentalism" || object.id === "environmentalism",
    );
    expect(relationships).toHaveLength(3);
    expect(
      relationships.every(
        (relationship) =>
          relationship.predicate === "contested-in-case" &&
          relationship.status === "contested",
      ),
    ).toBe(true);
  });

  it("rejects removal of the Te Awa Tupua identity boundary", () => {
    const documents = structuredClone(canonicalDocuments);
    const record = authoredEntity(
      documents,
      "te-awa-tupua-framework-2017-present",
    );
    if (record.kind !== "case") throw new Error("Expected Case");
    record.scope = "";
    expect(() => compileDomainGraph(documents)).toThrow(
      /te-awa-tupua-framework-2017-present.*scope/,
    );
  });
});
