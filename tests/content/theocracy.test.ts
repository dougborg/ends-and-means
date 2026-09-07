import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import { compileDomainGraph } from "../../src/lib/domain";
import {
  canonicalGraph,
  citationsFor,
  entityById,
  subjectGuideById,
} from "../../src/lib/domain/canonical";

const statements = [
  "theocracy-contested-family",
  "theocracy-hierocracy-boundary",
  "theocracy-state-religion-boundary",
  "theocracy-religious-law-boundary",
  "theocracy-influence-boundary",
  "theocracy-sacred-monarchy-boundary",
  "theocracy-authoritarianism-boundary",
  "theocracy-polemical-label-boundary",
  "constitutional-theocracy-hybrid",
  "iran-divine-sovereignty-principles",
  "iran-laws-islamic-criteria",
  "iran-popular-elections",
  "iran-separation-under-leader",
  "iran-guardian-council-composition",
  "iran-guardian-council-review",
  "iran-guardian-council-elections",
  "iran-leader-selection",
  "iran-leader-powers",
  "iran-expediency-council",
  "iran-hybrid-rival-reading",
  "iran-classification-qualified",
  "vatican-pope-sovereign",
  "vatican-legislative-commission",
  "vatican-executive-governorate",
  "vatican-judicial-name",
  "holy-see-vatican-distinct",
  "pope-religious-state-office",
  "vatican-delegation-boundary",
  "vatican-classification-qualified",
];
const boundaries = [
  "theocracy-hierocracy-boundary",
  "theocracy-state-religion-boundary",
  "theocracy-religious-law-boundary",
  "theocracy-influence-boundary",
  "theocracy-sacred-monarchy-boundary",
  "theocracy-authoritarianism-boundary",
  "theocracy-polemical-label-boundary",
];
const obligations = [
  "theocracy-threshold-religious-review",
  "iran-elections-institutional-autonomy",
  "vatican-delegated-power-practice",
  "theocracy-category-travel",
];

describe("foundational Theocracy guide", () => {
  it("publishes atomic, sourced claims and focused open questions", () => {
    expect(statements.length).toBeGreaterThanOrEqual(20);
    expect(boundaries.length).toBeGreaterThanOrEqual(5);
    expect(obligations).toHaveLength(4);
    const sources = new Set<string>();
    for (const id of statements) {
      expect(entityById(id)?.kind).toBe("statement");
      const citations = citationsFor(id);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every(({ locator }) => locator.length > 0)).toBe(true);
      citations.forEach(({ object }) => {
        sources.add(object.id);
      });
    }
    expect(sources.size).toBeGreaterThanOrEqual(10);
  });

  it("pins every Statement and precise citation in the evidence ledger", () => {
    expect(
      statements.map((id) => {
        const record = entityById(id);
        if (record?.kind !== "statement") throw new Error(`Missing ${id}`);
        return {
          id,
          statementKind: record.statementKind,
          text: record.text,
          citations: citationsFor(id).map(
            ({ object, role, locator }) => ({ sourceId: object.id, role, locator }),
          ),
        };
      }),
    ).toMatchSnapshot();
  });

  it("pins the concept, cases, placements, obligations, and guide", () => {
    const relationshipIds = [
      "iran-religious-authority-placement",
      "vatican-religious-authority-placement",
    ];
    expect({
      concept: entityById("theocracy"),
      cases: [
        entityById("iran-constitutional-authority-1989-present"),
        entityById("vatican-city-authority-2023-present"),
      ],
      placements: canonicalGraph.relationships.filter(({ id }) =>
        relationshipIds.includes(id),
      ),
      obligations: obligations.map(entityById),
      guide: subjectGuideById("guide-theocracy"),
    }).toMatchSnapshot();
  });
});

describe("Theocracy model boundaries", () => {
  it("keeps unlike concepts independent and placements scoped to episodes", () => {
    const graph = compileDomainGraph(canonicalDocuments);
    expect(
      ["monarchy", "authoritarianism", "totalitarianism"].every(
        (id) => graph.indexes.entitiesById[id]?.kind === "concept",
      ),
    ).toBe(true);
    const placements = graph.relationships.filter(
      ({ predicate, object }) =>
        predicate === "placed-on" &&
        object.id === "religiously-grounded-governing-authority",
    );
    expect(placements.map(({ subject }) => subject.kind)).toEqual([
      "case-episode",
      "case-episode",
    ]);
  });

  it("rejects a placement whose subject is widened from an episode to the Concept", () => {
    const documents = structuredClone(canonicalDocuments);
    const bundle = documents.find(
      (document) =>
        document.documentType === "relationships" &&
        document.relationships.some(
          ({ id }) => id === "iran-religious-authority-placement",
        ),
    );
    if (bundle?.documentType !== "relationships")
      throw new Error("Missing placement");
    const placement = bundle.relationships.find(
      ({ id }) => id === "iran-religious-authority-placement",
    );
    if (placement?.predicate !== "placed-on")
      throw new Error("Missing placement");
    placement.subject = { kind: "concept", id: "theocracy" };
    bundle.subject = placement.subject;
    expect(() => compileDomainGraph(documents)).toThrow();
  });
});
