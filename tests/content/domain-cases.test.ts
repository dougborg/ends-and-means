import { describe, expect, it } from "vitest";
import { compileDomainGraph, validateAuthoringDocuments } from "../../src/lib/domain";
import type { AuthoringDocument, DomainEntity } from "../../src/lib/domain";

const entity = (value: DomainEntity): AuthoringDocument => ({ documentType: "entity", entity: value });
const base = { description: "A scoped case-model test record.", publicationStatus: "research-needed" as const };

const documents: AuthoringDocument[] = [
  entity({ id: "example-region", kind: "place", label: "Example region", placeType: "region", ...base }),
  entity({
    id: "example-condition",
    kind: "statement",
    label: "Example condition",
    statementKind: "observation",
    text: "A contextual condition requiring later research.",
    ...base,
  }),
  entity({
    id: "example-formal-rule",
    kind: "statement",
    label: "Example formal rule",
    statementKind: "observation",
    text: "A formally stated rule requiring later research.",
    ...base,
  }),
  entity({
    id: "example-rule-in-use",
    kind: "statement",
    label: "Example rule in use",
    statementKind: "observation",
    text: "An observed rule-in-use requiring later research.",
    ...base,
  }),
  entity({
    id: "example-outcome",
    kind: "statement",
    label: "Example outcome",
    statementKind: "observation",
    text: "An observed outcome requiring later research.",
    ...base,
  }),
  entity({
    id: "example-ongoing-case",
    kind: "case",
    label: "Example ongoing case",
    locationIds: ["example-region"],
    startDate: { year: 1994, certainty: "exact" },
    scope: "A model fixture, not a historical claim.",
    selectionRationale: "Exercise ongoing Case validation.",
    conditionStatementIds: ["example-condition"],
    episodeIds: ["example-case-episode"],
    asOf: "2026-09-04",
    lastReviewedAt: "2026-09-04",
    freshness: "current",
    materialChangeEventIds: ["example-material-change"],
    ...base,
  }),
  entity({
    id: "example-case-episode",
    kind: "case-episode",
    label: "Example case episode",
    caseId: "example-ongoing-case",
    locationIds: ["example-region"],
    startDate: { year: 2003, certainty: "approximate", note: "Fixture boundary used to exercise uncertainty." },
    scope: "One bounded institutional configuration.",
    conditionStatementIds: ["example-condition"],
    formalRuleStatementIds: ["example-formal-rule"],
    ruleInUseStatementIds: ["example-rule-in-use"],
    interactionStatementIds: [],
    outcomeStatementIds: ["example-outcome"],
    ...base,
  }),
  entity({ id: "example-change-kind", kind: "concept", label: "Synthetic institutional change", schemeIds: [], scopeNote: "Synthetic Event-kind fixture only.", ...base }),
  entity({ id: "example-material-source", kind: "source", label: "Synthetic material-change source", title: "Synthetic source", sourceType: "other", publicationStatus: "reviewed", description: "A synthetic source used only for a model-boundary test." }),
  entity({ id: "example-material-change", kind: "event", label: "Synthetic material change", description: "A synthetic reviewed Event used only for model-boundary tests.", eventKindIds: ["example-change-kind"], placeIds: ["example-region"], startDate: { year: 2026, certainty: "exact" }, descriptionStatementIds: ["example-outcome"], publicationStatus: "reviewed" }),
  { documentType: "relationships", subject: { kind: "statement", id: "example-outcome" }, relationships: [{ id: "example-outcome-cites-material-source", predicate: "cites", subject: { kind: "statement", id: "example-outcome" }, object: { kind: "source", id: "example-material-source" }, role: "supports", locator: "synthetic locator" }] },
];

describe("bounded Case model", () => {
  it("compiles an ongoing Case with a bounded episode and separated observations", () => {
    const graph = compileDomainGraph(documents);

    expect(graph.indexes.entitiesById["example-ongoing-case"]?.kind).toBe("case");
    expect(graph.indexes.entitiesById["example-case-episode"]?.kind).toBe("case-episode");
  });

  it("requires freshness metadata for ongoing Cases", () => {
    const invalid = structuredClone(documents);
    const ongoingCase = invalid[5];
    if (ongoingCase?.documentType === "entity" && ongoingCase.entity.kind === "case") {
      delete ongoingCase.entity.asOf;
      delete ongoingCase.entity.lastReviewedAt;
      delete ongoingCase.entity.freshness;
    }

    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain("example-ongoing-case: asOf requires an ISO calendar date");
    expect(errors).toContain("example-ongoing-case: lastReviewedAt requires an ISO calendar date");
    expect(errors).toContain("example-ongoing-case: ongoing Case requires freshness");
  });

  it("rejects unresolved Places, Statements, episodes, and parent Cases", () => {
    const invalid = structuredClone(documents);
    const ongoingCase = invalid[5];
    const episode = invalid[6];
    if (ongoingCase?.documentType === "entity" && ongoingCase.entity.kind === "case") {
      ongoingCase.entity.locationIds = ["missing-place"];
      ongoingCase.entity.conditionStatementIds = ["missing-statement"];
      ongoingCase.entity.episodeIds = ["missing-episode"];
    }
    if (episode?.documentType === "entity" && episode.entity.kind === "case-episode") episode.entity.caseId = "missing-case";

    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain("example-ongoing-case: unresolved Place missing-place");
    expect(errors).toContain("example-ongoing-case: unresolved Statement missing-statement");
    expect(errors).toContain("example-ongoing-case: unresolved or mismatched Case Episode missing-episode");
    expect(errors).toContain("example-case-episode: unresolved parent Case missing-case");
  });

  it("supports BCE years and requires notes for uncertain boundaries", () => {
    const invalid = structuredClone(documents);
    const episode = invalid[6];
    if (episode?.documentType === "entity" && episode.entity.kind === "case-episode") {
      episode.entity.startDate = { year: -507, certainty: "approximate" };
    }

    expect(validateAuthoringDocuments(invalid)).toContain(
      "example-case-episode: startDate with approximate certainty requires a note",
    );
  });

  it("rejects inverted date ranges", () => {
    const invalid = structuredClone(documents);
    const episode = invalid[6];
    if (episode?.documentType === "entity" && episode.entity.kind === "case-episode") {
      episode.entity.startDate = { year: 2004, certainty: "exact" };
      episode.entity.endDate = { year: 2003, certainty: "exact" };
    }

    expect(validateAuthoringDocuments(invalid)).toContain("example-case-episode: startDate must not be after endDate");
  });

  it("rejects impossible calendar dates", () => {
    const invalid = structuredClone(documents);
    const ongoingCase = invalid[5];
    const episode = invalid[6];
    if (ongoingCase?.documentType === "entity" && ongoingCase.entity.kind === "case") ongoingCase.entity.asOf = "2026-02-30";
    if (episode?.documentType === "entity" && episode.entity.kind === "case-episode") {
      episode.entity.startDate = { year: 2025, month: 2, day: 30, certainty: "exact" };
    }

    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain("example-ongoing-case: asOf requires an ISO calendar date");
    expect(errors).toContain("example-case-episode: startDate day is invalid for its month");
  });

  it("requires a reciprocal parent-to-episode reference", () => {
    const invalid = structuredClone(documents);
    const ongoingCase = invalid[5];
    if (ongoingCase?.documentType === "entity" && ongoingCase.entity.kind === "case") ongoingCase.entity.episodeIds = [];

    expect(validateAuthoringDocuments(invalid)).toContain(
      "example-case-episode: parent Case example-ongoing-case does not reference this episode",
    );
  });

  it("validates material-change pointers as cited, deterministic freshness metadata", () => {
    expect(validateAuthoringDocuments(documents)).toEqual([]);
    const invalid = structuredClone(documents);
    const ongoingCase = invalid[5];
    if (ongoingCase?.documentType === "entity" && ongoingCase.entity.kind === "case") ongoingCase.entity.materialChangeEventIds = ["missing-event", "missing-event"];
    expect(validateAuthoringDocuments(invalid)).toEqual(expect.arrayContaining([
      "example-ongoing-case: material-change Event IDs must be unique",
      "example-ongoing-case: unresolved material-change Event missing-event",
    ]));
  });
});

describe("historical date contracts", () => {
  it("reports incomplete and non-integral historical dates", () => {
    const invalid = structuredClone(documents);
    const episode = invalid[6];
    if (episode?.documentType === "entity" && episode.entity.kind === "case-episode") {
      episode.entity.startDate = { year: 2000.5, month: 13, day: 32, certainty: "exact" };
      episode.entity.endDate = { day: 4, certainty: "exact" };
    }

    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toEqual(expect.arrayContaining([
      "example-case-episode: startDate year must be an integer",
      "example-case-episode: startDate month must be between 1 and 12",
      "example-case-episode: startDate day must be between 1 and 31",
      "example-case-episode: endDate month/day requires a year",
      "example-case-episode: endDate day requires a month",
      "example-case-episode: exact endDate requires a year",
    ]));
  });
});
