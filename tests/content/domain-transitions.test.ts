import { describe, expect, it } from "vitest";
import { compileDomainGraph, validateAuthoringDocuments } from "../../src/lib/domain";
import type { AuthoringDocument, DomainEntity, DomainRelationship, EntityRef } from "../../src/lib/domain";

const entity = (value: DomainEntity): AuthoringDocument => ({ documentType: "entity", entity: value });
const relationships = (subject: EntityRef, values: DomainRelationship[]): AuthoringDocument => ({ documentType: "relationships", subject, relationships: values });
const base = { description: "A transition model fixture.", publicationStatus: "research-needed" as const };

const documents: AuthoringDocument[] = [
  entity({ id: "test-place", kind: "place", label: "Test place", placeType: "region", ...base }),
  entity({ id: "test-concept", kind: "concept", label: "Test concept", schemeIds: ["test-scheme"], scopeNote: "Fixture.", ...base }),
  entity({ id: "institutional-change", kind: "concept", label: "Institutional change", schemeIds: ["test-scheme"], scopeNote: "Fixture event kind.", ...base }),
  entity({ id: "test-scheme", kind: "concept-scheme", label: "Test scheme", scope: "Fixture.", ...base }),
  entity({ id: "test-approach", kind: "approach", label: "Test approach", scope: "Fixture.", ...base }),
  entity({ id: "test-means", kind: "means", label: "Test means", institutionalForm: "Fixture.", ...base }),
  entity({ id: "test-statement", kind: "statement", label: "Test statement", statementKind: "observation", text: "Fixture observation.", ...base }),
  entity({ id: "test-case", kind: "case", label: "Test case", locationIds: ["test-place"], startDate: { year: 1900, certainty: "exact" }, endDate: { year: 2000, certainty: "exact" }, overview: [{ heading: "Overview", text: "Fixture.", statementIds: ["test-statement"] }], scope: "Fixture.", selectionRationale: "Fixture.", conditionStatementIds: [], episodeIds: ["test-before", "test-after"], ...base }),
  entity({ id: "test-before", kind: "case-episode", label: "Before", caseId: "test-case", locationIds: ["test-place"], startDate: { year: 1900, certainty: "exact" }, endDate: { year: 1949, certainty: "exact" }, scope: "Fixture.", conditionStatementIds: [], formalRuleStatementIds: [], ruleInUseStatementIds: [], interactionStatementIds: [], outcomeStatementIds: [], ...base }),
  entity({ id: "test-after", kind: "case-episode", label: "After", caseId: "test-case", locationIds: ["test-place"], startDate: { year: 1950, certainty: "exact" }, endDate: { year: 2000, certainty: "exact" }, scope: "Fixture.", conditionStatementIds: [], formalRuleStatementIds: [], ruleInUseStatementIds: [], interactionStatementIds: [], outcomeStatementIds: [], ...base }),
  entity({ id: "test-event", kind: "event", label: "Institutional change", eventKindIds: ["institutional-change"], placeIds: ["test-place"], startDate: { year: 1950, certainty: "exact" }, descriptionStatementIds: ["test-statement"], ...base }),
  relationships({ kind: "case-episode", id: "test-after" }, [
    { id: "test-after-concept", predicate: "applies-to-case", subject: { kind: "case-episode", id: "test-after" }, object: { kind: "concept", id: "test-concept" }, status: "research-needed", statementIds: [] },
    { id: "test-after-approach", predicate: "partially-instantiated", subject: { kind: "case-episode", id: "test-after" }, object: { kind: "approach", id: "test-approach" }, status: "research-needed", statementIds: [] },
    { id: "test-after-means", predicate: "used-means", subject: { kind: "case-episode", id: "test-after" }, object: { kind: "means", id: "test-means" }, implementation: "rules-in-use", status: "research-needed", statementIds: [] },
  ]),
  entity({ id: "test-transition", kind: "transition", label: "Test transition", caseId: "test-case", fromEpisodeIds: ["test-before"], toEpisodeIds: ["test-after"], eventIds: ["test-event"], changedRelationshipIds: ["test-after-means"], boundaryStatus: "exact", explanationStatementIds: [], rivalInterpretationStatementIds: [], ...base }),
];

describe("Case relationships and transitions", () => {
  it("compiles plural Case classifications and a before/change/after sequence", () => {
    const graph = compileDomainGraph(documents);
    expect(graph.indexes.outgoingRelationshipIds["test-after"]).toHaveLength(3);
    expect(graph.indexes.entitiesById["test-transition"]?.kind).toBe("transition");
  });

  it("rejects missing transition boundaries and changed relationships", () => {
    const invalid = structuredClone(documents);
    const transition = invalid.at(-1);
    if (transition?.documentType === "entity" && transition.entity.kind === "transition") {
      transition.entity.fromEpisodeIds = [];
      transition.entity.changedRelationshipIds = ["missing-relationship"];
    }
    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain("test-transition: Transition requires before and after Case Episodes");
    expect(errors).toContain("test-transition: unresolved changed Relationship missing-relationship");
  });

  it("rejects transition episodes belonging to another Case", () => {
    const invalid = [...documents, entity({ id: "other-case", kind: "case", label: "Other case", locationIds: ["test-place"], startDate: { year: 1950, certainty: "exact" }, endDate: { year: 2000, certainty: "exact" }, overview: [{ heading: "Overview", text: "Fixture.", statementIds: ["test-statement"] }], scope: "Fixture.", selectionRationale: "Fixture.", conditionStatementIds: [], episodeIds: ["other-episode"], ...base }), entity({ id: "other-episode", kind: "case-episode", label: "Other episode", caseId: "other-case", locationIds: ["test-place"], startDate: { year: 1950, certainty: "exact" }, endDate: { year: 2000, certainty: "exact" }, scope: "Fixture.", conditionStatementIds: [], formalRuleStatementIds: [], ruleInUseStatementIds: [], interactionStatementIds: [], outcomeStatementIds: [], ...base })];
    const transition = invalid[12];
    if (transition?.documentType === "entity" && transition.entity.kind === "transition") transition.entity.toEpisodeIds = ["other-episode"];
    expect(validateAuthoringDocuments(invalid)).toContain("test-transition: Case Episode other-episode belongs to another Case");
  });

  it("rejects evidence-free Events and empty Transition anchors", () => {
    const invalid = structuredClone(documents);
    const event = invalid[10];
    const transition = invalid.at(-1);
    if (event?.documentType === "entity" && event.entity.kind === "event") {
      event.entity.eventKindIds = [];
      event.entity.descriptionStatementIds = [];
    }
    if (transition?.documentType === "entity" && transition.entity.kind === "transition") {
      transition.entity.eventIds = [];
      transition.entity.changedRelationshipIds = [];
    }
    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain("test-event: Event requires at least one event-kind Concept");
    expect(errors).toContain("test-event: Event requires at least one description Statement");
    expect(errors).toContain("test-transition: Transition requires at least one Event");
    expect(errors).toContain("test-transition: Transition requires at least one changed Relationship");
  });
});
