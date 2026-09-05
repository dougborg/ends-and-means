import { describe, expect, it } from "vitest";
import { compileDomainGraph, validateAuthoringDocuments } from "../../src/lib/domain";
import type { AuthoringDocument, DomainEntity, DomainRelationship, EntityRef } from "../../src/lib/domain";

const entity = (value: DomainEntity): AuthoringDocument => ({ documentType: "entity", entity: value });
const relationships = (subject: EntityRef, values: DomainRelationship[]): AuthoringDocument => ({ documentType: "relationships", subject, relationships: values });
const base = { description: "A scoped test record.", publicationStatus: "research-needed" as const };

const documents: AuthoringDocument[] = [
  entity({ id: "political-ideas", kind: "concept-scheme", label: "Political ideas", scope: "Concepts used to discuss political ideas.", ...base }),
  entity({ id: "democracy", kind: "concept", label: "Democracy", schemeIds: ["political-ideas"], scopeNote: "A contested concept, not one institutional recipe.", ...base }),
  entity({ id: "communism", kind: "concept", label: "Communism", schemeIds: ["political-ideas"], scopeNote: "A contested political-economic concept.", ...base }),
  entity({ id: "anarchism", kind: "concept", label: "Anarchism", schemeIds: ["political-ideas"], scopeNote: "A contested family of political ideas.", ...base }),
  entity({ id: "communist-approaches", kind: "collection", label: "Communist approaches", inclusionRule: "Qualified editorial membership.", editorialPurpose: "Discovery without an exclusive parent.", ...base }),
  entity({ id: "anarchist-approaches", kind: "collection", label: "Anarchist approaches", inclusionRule: "Qualified editorial membership.", editorialPurpose: "Discovery without an exclusive parent.", ...base }),
  entity({ id: "anarcho-communism", kind: "approach", label: "Anarcho-communism", scope: "A specific overlapping approach.", ...base }),
  entity({ id: "central-planning", kind: "means", label: "Central planning", institutionalForm: "Binding administrative coordination over a substantial scope.", ...base }),
  relationships({ kind: "approach", id: "anarcho-communism" }, [
    { id: "anarcho-communism-member-communist", predicate: "member-of", subject: { kind: "approach", id: "anarcho-communism" }, object: { kind: "collection", id: "communist-approaches" }, membership: "qualified", status: "research-needed", statementIds: [] },
    { id: "anarcho-communism-member-anarchist", predicate: "member-of", subject: { kind: "approach", id: "anarcho-communism" }, object: { kind: "collection", id: "anarchist-approaches" }, membership: "qualified", status: "research-needed", statementIds: [] },
  ]),
];

describe("plural domain graph", () => {
  it("compiles modular entities and overlapping memberships into one indexed graph", () => {
    const graph = compileDomainGraph(documents);

    expect(graph.schemaVersion).toBe("plural-graph-1");
    expect(graph.indexes.entitiesById["central-planning"]?.kind).toBe("means");
    expect(graph.indexes.outgoingRelationshipIds["anarcho-communism"]).toEqual([
      "anarcho-communism-member-anarchist",
      "anarcho-communism-member-communist",
    ]);
  });

  it("rejects relationship files that do not own one subject", () => {
    const invalid = [...documents, relationships({ kind: "concept", id: "democracy" }, [{
      id: "wrong-subject",
      predicate: "related-to",
      subject: { kind: "concept", id: "communism" },
      object: { kind: "concept", id: "democracy" },
      status: "research-needed",
      statementIds: [],
    }])];

    expect(validateAuthoringDocuments(invalid)).toContain("document 9: relationship wrong-subject does not match its subject-centered file");
  });

  it("validates the declared subject of empty relationship files", () => {
    const invalid = [...documents, relationships({ kind: "approach", id: "missing-approach" }, [])];

    expect(validateAuthoringDocuments(invalid)).toContain(
      "document 9: unresolved or mistyped document subject approach:missing-approach",
    );
  });

  it("normalizes surrounding whitespace when checking preferred-label uniqueness", () => {
    const invalid = [...documents, entity({
      id: "democracy-with-whitespace",
      kind: "concept",
      label: " Democracy ",
      schemeIds: ["political-ideas"],
      scopeNote: "A duplicate label used to test normalization.",
      ...base,
    })];

    expect(validateAuthoringDocuments(invalid)).toContain(
      "democracy-with-whitespace: preferred label duplicates democracy in political-ideas",
    );
  });

  it("rejects cycles in the direct Concept hierarchy", () => {
    const cyclic = [...documents,
      relationships({ kind: "concept", id: "democracy" }, [{ id: "democracy-broader-communism", predicate: "broader-than", subject: { kind: "concept", id: "democracy" }, object: { kind: "concept", id: "communism" }, status: "research-needed", statementIds: [] }]),
      relationships({ kind: "concept", id: "communism" }, [{ id: "communism-broader-democracy", predicate: "broader-than", subject: { kind: "concept", id: "communism" }, object: { kind: "concept", id: "democracy" }, status: "research-needed", statementIds: [] }]),
    ];

    expect(validateAuthoringDocuments(cyclic)).toContain("Concept broader/narrower relationships contain a cycle");
  });

  it("keeps entity and relationship IDs globally unique", () => {
    const invalid = [...documents, relationships({ kind: "concept", id: "democracy" }, [{
      id: "communism",
      predicate: "related-to",
      subject: { kind: "concept", id: "democracy" },
      object: { kind: "concept", id: "communism" },
      status: "research-needed",
      statementIds: [],
    }])];

    expect(validateAuthoringDocuments(invalid)).toContain("communism: ID collides with an entity ID");
  });
});
