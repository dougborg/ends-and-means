import { describe, expect, it } from "vitest";
import {
  contextualPathwayForRelationship,
  contextualPathwayKind,
  relationshipEndpointKeys,
  relationshipSentence,
} from "../../src/lib/contextual-pathways";
import type { DomainRelationship, EntityRef } from "../../src/lib/domain";
import { canonicalGraph } from "../../src/lib/domain/canonical";

function relationship(id: string) {
  const value = canonicalGraph.relationships.find(
    (candidate) => candidate.id === id,
  );
  if (!value) throw new Error(`Missing relationship fixture ${id}`);
  return value;
}

const economicDemocracy = {
  kind: "concept",
  id: "economic-democracy",
} satisfies EntityRef;

describe("controlled contextual-pathway vocabulary", () => {
  it.each([
    [
      "socialism-related-to-communism",
      "Related subject",
      "Communism",
      { kind: "concept", id: "socialism" },
    ],
    [
      "wage-earner-program-advocates-fund-boards",
      "Institutional pathway",
      "Swedish wage-earner fund program",
      economicDemocracy,
    ],
    [
      "enacted-funds-partially-instantiated-program",
      "Bounded case",
      "Enacted fund-board period, 1984–1991",
      economicDemocracy,
    ],
  ] as const)(
    "maps %s without strengthening its canonical relationship",
    (id, kind, destination, context) => {
      const source = relationship(id);
      const pathway = contextualPathwayForRelationship(
        source,
        context,
        canonicalGraph,
      );
      if (!pathway) throw new Error(`Missing contextual pathway for ${id}`);

      expect(pathway).toMatchObject({
        kind,
        destinationLabel: destination,
        relationship: source,
      });
      expect(pathway.relationship.predicate).toBe(source.predicate);
      expect(pathway.relationship).toBe(source);
      expect(relationshipSentence(pathway)).toContain(
        pathway.relationshipLabel.toLocaleLowerCase("en"),
      );
    },
  );

  it("defines a reader-facing kind for every canonical relationship predicate", () => {
    for (const candidate of canonicalGraph.relationships) {
      expect(contextualPathwayKind(candidate)).toBeTruthy();
    }
  });
});

describe("contextual-pathway publication boundaries", () => {
  it("omits relationships with unpublished endpoints", () => {
    const graph = structuredClone(canonicalGraph);
    const source = relationship("socialism-related-to-communism");
    const target = graph.indexes.entitiesById[source.object.id];
    if (!target) throw new Error("Missing relationship target fixture");
    target.publicationStatus = "in-review";

    expect(
      contextualPathwayForRelationship(source, economicDemocracy, graph),
    ).toBeUndefined();
  });

  it("omits relationships whose target has no public route", () => {
    const source = relationship("wage-earner-program-advocates-fund-boards");
    const context = source.subject;
    expect(
      contextualPathwayForRelationship(source, context, canonicalGraph),
    ).toBeUndefined();
  });

  it("omits a pathway when its supporting Statement is unpublished", () => {
    const graph = structuredClone(canonicalGraph);
    const source = relationship("socialism-related-to-communism");
    if (source.predicate === "cites")
      throw new Error("Expected a non-citation relationship fixture");
    const statementId = source.statementIds[0];
    const statement = statementId
      ? graph.indexes.entitiesById[statementId]
      : undefined;
    if (statement?.kind !== "statement")
      throw new Error("Missing supporting Statement fixture");
    statement.publicationStatus = "in-review";

    expect(
      contextualPathwayForRelationship(
        source,
        { kind: "concept", id: "socialism" },
        graph,
      ),
    ).toBeUndefined();
  });

  it("identifies both typed endpoints so richer paths replace duplicate links", () => {
    const selected = [
      relationship("socialism-related-to-communism"),
      relationship("socialism-related-to-social-class"),
    ] satisfies DomainRelationship[];

    expect([...relationshipEndpointKeys(selected, canonicalGraph)]).toEqual([
      "concept:socialism",
      "concept:communism",
      "concept:social-class",
    ]);
  });

  it("treats an episode pathway as owning its parent Case continuation", () => {
    const selected = [
      relationship("enacted-funds-partially-instantiated-program"),
    ];

    expect(relationshipEndpointKeys(selected, canonicalGraph)).toContain(
      "case:swedish-wage-earner-funds",
    );
  });
});
