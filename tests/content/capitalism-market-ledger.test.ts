import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import type { AuthoringDocument } from "../../src/lib/domain";
import { compileDomainGraph } from "../../src/lib/domain";

const statementIds = [
  "capitalism-definition-contested",
  "capitalism-market-boundary",
  "capitalism-institutional-definition",
  "capitalism-marx-definition",
  "capitalism-polanyi-definition",
  "property-possession-boundary",
  "property-rights-plural",
  "wage-labor-boundary",
  "wage-labor-history-limit",
  "commodity-production-boundary",
  "firm-market-boundary",
  "capital-finance-boundary",
  "market-definition-exchange",
  "market-economy-plural-allocation",
  "market-state-boundary",
  "market-ownership-boundary",
  "market-laissez-faire-boundary",
  "smith-exchange-division-labor",
  "england-brenner-class-thesis",
  "england-brenner-rival-explanations",
  "ghana-cocoa-smallholder-expansion",
  "ghana-cocoa-resource-reallocation",
  "ghana-cocoa-classification-limit",
  "china-dual-track-coordination",
  "china-tve-ownership-boundary",
  "china-marketization-classification-limit",
  "england-case-period-boundary",
  "ghana-case-period-boundary",
  "china-case-period-boundary",
  "china-nonstate-sector-growth",
  "capitalism-legal-order-relation",
  "capitalism-private-property-relation",
  "market-economy-firm-relation",
  "capitalism-market-economy-relation",
] as const;

const caseIds = [
  "english-agrarian-market-dependence",
  "english-agrarian-transformation-1450-1750",
  "gold-coast-cocoa-expansion",
  "gold-coast-cocoa-takeoff-1890-1936",
  "china-dual-track-market-reforms",
  "china-plan-market-coexistence-1978-1993",
] as const;

function ledger(documents: AuthoringDocument[]) {
  const graph = compileDomainGraph(documents);
  const selected = new Set<string>(statementIds);
  const citations = graph.relationships.filter(
    (relationship) =>
      relationship.predicate === "cites" &&
      selected.has(relationship.subject.id),
  );
  const sourceIds = new Set(citations.map(({ object }) => object.id));
  const sources = [...sourceIds].sort().map((id) => {
    const entity = graph.indexes.entitiesById[id];
    if (entity?.kind !== "source") throw new Error(`Missing source ${id}`);
    return entity;
  });
  const workIds = new Set(
    sources.map(({ id, workId }) => {
      if (!workId) throw new Error(`Source ${id} has no Work`);
      return workId;
    }),
  );
  return {
    statements: statementIds.map((id) => {
      const entity = graph.indexes.entitiesById[id];
      if (entity?.kind !== "statement")
        throw new Error(`Missing statement ${id}`);
      return [id, entity.label, entity.statementKind, entity.text];
    }),
    citations: citations
      .map((relationship) => {
        if (relationship.predicate !== "cites")
          throw new Error("Expected citation");
        return [
          relationship.subject.id,
          relationship.object.id,
          relationship.role,
          relationship.locator,
        ];
      })
      .sort((a, b) => a.join("|").localeCompare(b.join("|"))),
    works: [...workIds].sort().map((id) => {
      const entity = graph.indexes.entitiesById[id];
      if (entity?.kind !== "work") throw new Error(`Missing work ${id}`);
      return [
        id,
        entity.title,
        entity.workType,
        entity.originalPublicationYear,
      ];
    }),
    sources: sources.map((entity) => {
      return [
        entity.id,
        entity.title,
        entity.sourceType,
        entity.workId,
        entity.contributorDisplay,
        entity.publicationYear,
        entity.publisher,
        entity.identifiers ?? null,
        entity.resourceLinks,
      ];
    }),
    cases: caseIds.map((id) => {
      const entity = graph.indexes.entitiesById[id];
      if (!entity || (entity.kind !== "case" && entity.kind !== "case-episode"))
        throw new Error(`Missing case record ${id}`);
      return entity;
    }),
    conceptRelationships: graph.relationships.filter(
      ({ predicate, subject }) =>
        predicate === "related-to" &&
        ["capitalism", "market-economy"].includes(subject.id),
    ),
  };
}

describe("capitalism and market-economy evidence ledger", () => {
  it("states the coerced-labor research limit without artifact framing", () => {
    const document = canonicalDocuments.find(
      (candidate) =>
        candidate.documentType === "entity" &&
        candidate.entity.id === "capitalism-coerced-labor-boundary",
    );
    if (
      document?.documentType !== "entity" ||
      document.entity.kind !== "research-obligation"
    )
      throw new Error("Missing coerced-labor research obligation");
    expect(document.entity.currentLimitation).toBe(
      "Definitions centered on formally free wage labor do not by themselves reconcile scholarship on the simultaneous use of wage and coerced labor within connected production and financial systems.",
    );
    expect(document.entity.currentLimitation).not.toMatch(
      /\b(?:guide|page|site|artifact)\b/i,
    );
  });

  it("freezes every statement, citation tuple, source record, case slot, and concept relationship", () => {
    expect(ledger(canonicalDocuments)).toMatchSnapshot();
  });

  it("detects statement text and kind mutations", () => {
    const documents = structuredClone(canonicalDocuments);
    const document = documents.find(
      (candidate) =>
        candidate.documentType === "entity" &&
        candidate.entity.id === statementIds[0],
    );
    if (
      document?.documentType !== "entity" ||
      document.entity.kind !== "statement"
    )
      throw new Error("Missing mutation fixture");
    document.entity.text = `${document.entity.text} drift`;
    document.entity.statementKind = "editorial-interpretation";
    expect(ledger(documents)).not.toEqual(ledger(canonicalDocuments));
  });

  it("detects public statement label mutations", () => {
    const documents = structuredClone(canonicalDocuments);
    const document = documents.find(
      (candidate) =>
        candidate.documentType === "entity" &&
        candidate.entity.id === statementIds[0],
    );
    if (
      document?.documentType !== "entity" ||
      document.entity.kind !== "statement"
    )
      throw new Error("Missing label mutation fixture");
    document.entity.label = `${document.entity.label} drift`;
    expect(ledger(documents)).not.toEqual(ledger(canonicalDocuments));
  });

  it.each(["object", "role", "locator"] as const)(
    "detects citation %s mutations",
    (field) => {
      const documents = structuredClone(canonicalDocuments);
      const relationshipDocument = documents.find(
        (candidate) =>
          candidate.documentType === "relationships" &&
          candidate.relationships.some(
            ({ predicate, subject }) =>
              predicate === "cites" && subject.id === statementIds[0],
          ),
      );
      if (relationshipDocument?.documentType !== "relationships")
        throw new Error("Missing citation mutation fixture");
      const citation = relationshipDocument.relationships.find(
        ({ predicate }) => predicate === "cites",
      );
      if (citation?.predicate !== "cites") throw new Error("Missing citation");
      if (field === "object") citation.object.id = "sep-markets-2026-source";
      if (field === "role") citation.role = "context";
      if (field === "locator") citation.locator = "section 9";
      expect(ledger(documents)).not.toEqual(ledger(canonicalDocuments));
    },
  );
});

describe("capitalism Work and Source mutation coverage", () => {
  it.each(["workType", "originalPublicationYear"] as const)(
    "detects Work %s mutations",
    (field) => {
      const documents = structuredClone(canonicalDocuments);
      const document = documents.find(
        (candidate) =>
          candidate.documentType === "entity" &&
          candidate.entity.id === "sep-capitalism-work",
      );
      if (document?.documentType !== "entity" || document.entity.kind !== "work")
        throw new Error("Missing Work mutation fixture");
      if (field === "workType") document.entity.workType = "book";
      if (field === "originalPublicationYear")
        document.entity.originalPublicationYear = 2025;
      expect(ledger(documents)).not.toEqual(ledger(canonicalDocuments));
    },
  );

  it.each(["sourceType", "workId", "publicationYear", "resourceLinks"] as const)(
    "detects Source %s mutations",
    (field) => {
      const documents = structuredClone(canonicalDocuments);
      const document = documents.find(
        (candidate) =>
          candidate.documentType === "entity" &&
          candidate.entity.id === "sep-capitalism-source",
      );
      if (document?.documentType !== "entity" || document.entity.kind !== "source")
        throw new Error("Missing Source mutation fixture");
      if (field === "sourceType") document.entity.sourceType = "edition";
      if (field === "workId") document.entity.workId = "sep-markets-2026-work";
      if (field === "publicationYear") document.entity.publicationYear = 2025;
      if (field === "resourceLinks")
        document.entity.resourceLinks = [
          {
            purpose: "archive",
            url: "https://example.com/drift",
            label: "Drift",
          },
        ];
      expect(ledger(documents)).not.toEqual(ledger(canonicalDocuments));
    },
  );
});
