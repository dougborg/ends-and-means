import { describe, expect, it } from "vitest";
import { compileDomainGraph, validateAuthoringDocuments } from "../../src/lib/domain";
import type { AuthoringDocument, DomainEntity, DomainRelationship, EntityRef } from "../../src/lib/domain";

const entity = (value: DomainEntity): AuthoringDocument => ({ documentType: "entity", entity: value });
const relationships = (subject: EntityRef, values: DomainRelationship[]): AuthoringDocument => ({ documentType: "relationships", subject, relationships: values });
const base = { description: "A synthetic model-contract fixture, not a public research claim.", publicationStatus: "research-needed" as const };
const statement = (id: string): AuthoringDocument => entity({ id, kind: "statement", label: id, statementKind: "editorial-interpretation", text: "Synthetic fixture statement.", ...base });
const definitionStatement = (id: string): AuthoringDocument => entity({ id, kind: "statement", label: id, statementKind: "definition", text: "Synthetic Means specification.", ...base });
const planningFacets = ["authority", "scope", "information", "targets", "revision", "enforcement", "ownership"] as const;

const boundaryDocuments: AuthoringDocument[] = [
  entity({ id: "test-ideas", kind: "concept-scheme", label: "Test ideas", scope: "Synthetic vocabulary.", ...base }),
  entity({ id: "democracy", kind: "concept", label: "Democracy", schemeIds: ["test-ideas"], scopeNote: "A concept, not an institutional recipe or score.", ...base }),
  entity({ id: "socialism", kind: "concept", label: "Socialism", schemeIds: ["test-ideas"], scopeNote: "A synthetic boundary fixture.", ...base }),
  entity({ id: "communism", kind: "concept", label: "Communism", schemeIds: ["test-ideas"], scopeNote: "A synthetic boundary fixture.", ...base }),
  ...["democratic-approaches", "socialist-approaches", "communist-approaches", "anarchist-approaches", "stateless-approaches", "central-planning-arrangements"].map((id) => entity({ id, kind: "collection", label: id, inclusionRule: "Explicit, qualified fixture membership only.", editorialPurpose: "Test overlapping discovery without inheritance.", ...base })),
  entity({ id: "participatory-democracy", kind: "approach", label: "Participatory democracy", scope: "Synthetic approach fixture.", ...base }),
  entity({ id: "anarcho-communism", kind: "approach", label: "Anarcho-communism", scope: "Synthetic overlapping approach fixture.", ...base }),
  entity({ id: "popular-control", kind: "end", label: "Popular control", scope: "Attributed only through an explicit relationship.", ...base }),
  entity({ id: "citizen-assemblies", kind: "means", label: "Citizen assemblies", institutionalForm: "A bounded assembly with specified participation and authority.", ...base }),
  entity({ id: "indicative-central-planning", kind: "means", label: "Indicative central planning", institutionalForm: "Nonbinding targets with explicitly modeled authority, scope, information, revision, and ownership context.", ...base }),
  entity({ id: "test-place", kind: "place", label: "Test place", placeType: "other", ...base }),
  statement("test-overview"),
  statement("test-democracy-interpretation"),
  statement("test-popular-control-attribution"),
  statement("test-assemblies-advocacy"),
  ...planningFacets.map((facet) => definitionStatement(`indicative-planning-${facet}`)),
  entity({ id: "test-measured-feature", kind: "statement", label: "Test measured feature", statementKind: "observation", text: "A synthetic measured Case feature.", ...base }),
  entity({ id: "test-democracy-case", kind: "case", label: "Test democracy case", locationIds: ["test-place"], startDate: { year: 2000, certainty: "exact" }, endDate: { year: 2001, certainty: "exact" }, overviewTitle: "What is this fixture?", overview: [{ heading: "Boundary", text: "A synthetic bounded Case.", statementIds: ["test-overview"] }], scope: "Synthetic case scope.", selectionRationale: "Exercise role separation.", conditionStatementIds: [], episodeIds: ["test-democracy-episode"], ...base }),
  entity({ id: "test-democracy-episode", kind: "case-episode", label: "Test democracy episode", caseId: "test-democracy-case", locationIds: ["test-place"], startDate: { year: 2000, certainty: "exact" }, endDate: { year: 2001, certainty: "exact" }, scope: "Synthetic episode scope.", conditionStatementIds: [], formalRuleStatementIds: [], ruleInUseStatementIds: [], interactionStatementIds: [], outcomeStatementIds: ["test-measured-feature"], ...base }),
  entity({ id: "participation-breadth", kind: "comparison-dimension", label: "Participation breadth", definition: "A synthetic descriptive dimension.", valueType: "ordinal", values: [{ id: "limited", label: "Limited", description: "Synthetic low category.", order: 1 }, { id: "broad", label: "Broad", description: "Synthetic high category.", order: 2 }], eligibleSubjectKinds: ["case-episode"], method: "Place only explicitly bounded fixtures.", normativeChoices: ["Breadth does not establish quality."], knownCorrelationIds: [], limitations: ["Synthetic fixture only."], statementIds: ["test-measured-feature"], ...base }),
  relationships({ kind: "approach", id: "participatory-democracy" }, [
    { id: "participatory-democracy-interprets-democracy", predicate: "interprets-concept", subject: { kind: "approach", id: "participatory-democracy" }, object: { kind: "concept", id: "democracy" }, role: "core", interpretation: "Synthetic interpretation.", status: "research-needed", statementIds: ["test-democracy-interpretation"] },
    { id: "participatory-democracy-advances-popular-control", predicate: "advances-end", subject: { kind: "approach", id: "participatory-democracy" }, object: { kind: "end", id: "popular-control" }, status: "research-needed", statementIds: ["test-popular-control-attribution"] },
    { id: "participatory-democracy-advocates-citizen-assemblies", predicate: "advocates-means", subject: { kind: "approach", id: "participatory-democracy" }, object: { kind: "means", id: "citizen-assemblies" }, status: "research-needed", statementIds: ["test-assemblies-advocacy"] },
    { id: "participatory-democracy-member-democratic", predicate: "member-of", subject: { kind: "approach", id: "participatory-democracy" }, object: { kind: "collection", id: "democratic-approaches" }, membership: "qualified", status: "research-needed", statementIds: [] },
  ]),
  relationships({ kind: "approach", id: "anarcho-communism" }, [
    ...["socialist", "communist", "anarchist", "stateless"].map((family) => ({ id: `anarcho-communism-member-${family}`, predicate: "member-of" as const, subject: { kind: "approach" as const, id: "anarcho-communism" }, object: { kind: "collection" as const, id: `${family}-approaches` }, membership: "qualified" as const, status: "research-needed" as const, statementIds: [] })),
  ]),
  relationships({ kind: "means", id: "indicative-central-planning" }, [
    { id: "indicative-planning-member-central-planning", predicate: "member-of", subject: { kind: "means", id: "indicative-central-planning" }, object: { kind: "collection", id: "central-planning-arrangements" }, membership: "qualified", status: "research-needed", statementIds: [] },
    ...planningFacets.map((facet) => ({ id: `indicative-planning-specified-${facet}`, predicate: "specified-by" as const, subject: { kind: "means" as const, id: "indicative-central-planning" }, object: { kind: "statement" as const, id: `indicative-planning-${facet}` }, facet, status: "research-needed" as const, statementIds: [] })),
  ]),
  relationships({ kind: "case-episode", id: "test-democracy-episode" }, [
    { id: "test-democracy-episode-self-identified-participatory", predicate: "self-identified-with", subject: { kind: "case-episode", id: "test-democracy-episode" }, object: { kind: "approach", id: "participatory-democracy" }, status: "research-needed", statementIds: [] },
    { id: "test-democracy-episode-participation-placement", predicate: "placed-on", subject: { kind: "case-episode", id: "test-democracy-episode" }, object: { kind: "comparison-dimension", id: "participation-breadth" }, value: { kind: "category", categoryId: "broad" }, basis: "case-observation", uncertainty: "Synthetic fixture uncertainty.", scope: { startDate: "2000", endDate: "2001", placeIds: ["test-place"] }, status: "research-needed", statementIds: ["test-measured-feature"] },
  ]),
];

describe("model-boundary contracts", () => {
  it("keeps democracy's concept, attributed End, Means, Approach, Case feature, and measurement separate", () => {
    const graph = compileDomainGraph(boundaryDocuments);
    expect(["democracy", "popular-control", "citizen-assemblies", "participatory-democracy", "test-measured-feature", "participation-breadth"].map((id) => graph.indexes.entitiesById[id]?.kind)).toEqual(["concept", "end", "means", "approach", "statement", "comparison-dimension"]);
    expect(graph.indexes.entitiesById["test-measured-feature"]?.kind === "statement" && graph.indexes.entitiesById["test-measured-feature"].statementKind).toBe("observation");
    expect(graph.relationships.filter(({ subject }) => subject.id === "participatory-democracy").map(({ predicate }) => predicate)).toEqual(["advances-end", "advocates-means", "interprets-concept", "member-of"]);
    const episodeRelationships = graph.relationships.filter(({ subject }) => subject.id === "test-democracy-episode");
    expect(episodeRelationships.map(({ predicate }) => predicate)).toEqual(["placed-on", "self-identified-with"]);
    expect(episodeRelationships.some(({ predicate }) => ["partially-instantiated", "used-means", "applies-to-case", "contested-in-case"].includes(predicate))).toBe(false);
  });

  it("supports Means families and overlapping Approach memberships without inheritance", () => {
    const graph = compileDomainGraph(boundaryDocuments);
    const planningRelationships = graph.relationships.filter(({ subject }) => subject.id === "indicative-central-planning");
    expect(planningRelationships.filter(({ predicate }) => predicate === "member-of")).toHaveLength(1);
    expect(planningRelationships.filter((relationship) => relationship.predicate === "specified-by").map(({ facet }) => facet).sort()).toEqual([...planningFacets].sort());
    expect(graph.indexes.outgoingRelationshipIds["anarcho-communism"]).toEqual(["anarcho-communism-member-anarchist", "anarcho-communism-member-communist", "anarcho-communism-member-socialist", "anarcho-communism-member-stateless"]);
    expect(graph.relationships.filter(({ subject }) => subject.id === "anarcho-communism").every(({ predicate }) => predicate === "member-of")).toBe(true);
    expect(graph.indexes.entitiesById.socialism?.kind).toBe("concept");
    expect(graph.indexes.entitiesById.communism?.kind).toBe("concept");
    expect(graph.relationships.some(({ subject, object, predicate }) => ["broader-than", "narrower-than"].includes(predicate) && [subject.id, object.id].includes("socialism") && [subject.id, object.id].includes("communism"))).toBe(false);
  });

  it("compiles equivalent document orders to identical ID-stable output", () => {
    const reversed = [...boundaryDocuments].reverse().map((document) => document.documentType === "relationships" ? { ...document, relationships: [...document.relationships].reverse() } : document);
    expect(JSON.stringify(compileDomainGraph(reversed))).toBe(JSON.stringify(compileDomainGraph(boundaryDocuments)));
  });
});

const reviewed = { description: "Evidence boundary fixture.", publicationStatus: "reviewed" as const };
const evidenceBoundaryDocuments: AuthoringDocument[] = [
  entity({ id: "fictional-work", kind: "work", label: "Fictional work", title: "Fictional Work", workType: "fiction", ...reviewed }),
  entity({ id: "fictional-source", kind: "source", label: "Fictional source", title: "Fictional Work", sourceType: "edition", workId: "fictional-work", ...reviewed }),
  entity({ id: "research-work", kind: "work", label: "Research work", title: "Research Work", workType: "report", ...reviewed }),
  entity({ id: "research-source", kind: "source", label: "Research source", title: "Research Work", sourceType: "report", workId: "research-work", ...reviewed }),
  entity({ id: "fictional-arrangement", kind: "depiction", label: "Fictional arrangement", workId: "fictional-work", scope: "An interpretation of the fictional work only.", ...reviewed }),
  entity({ id: "fictional-means", kind: "means", label: "Fictional means", institutionalForm: "A synthetic fictional institution.", ...base }),
  entity({ id: "fictional-arrangement-interpretation", kind: "statement", label: "Fictional arrangement interpretation", statementKind: "editorial-interpretation", text: "A synthetic interpretation of the fictional Work.", ...base }),
  entity({ id: "empirical-observation", kind: "statement", label: "Empirical observation", statementKind: "observation", text: "A synthetic empirical observation.", ...reviewed }),
  relationships({ kind: "depiction", id: "fictional-arrangement" }, [{ id: "fictional-arrangement-depicts-fictional-means", predicate: "depicts", subject: { kind: "depiction", id: "fictional-arrangement" }, object: { kind: "means", id: "fictional-means" }, interpretation: "A synthetic interpretation confined to the fictional work.", status: "research-needed", statementIds: ["fictional-arrangement-interpretation"] }]),
  relationships({ kind: "statement", id: "empirical-observation" }, [
    { id: "empirical-observation-fiction-context", predicate: "cites", subject: { kind: "statement", id: "empirical-observation" }, object: { kind: "source", id: "fictional-source" }, role: "context", locator: "Synthetic locator" },
    { id: "empirical-observation-research-support", predicate: "cites", subject: { kind: "statement", id: "empirical-observation" }, object: { kind: "source", id: "research-source" }, role: "supports", locator: "Synthetic locator" },
  ]),
];

describe("fiction and empirical evidence boundary", () => {
  it("allows fiction as context when non-fiction evidence supports the empirical Statement", () => {
    expect(validateAuthoringDocuments(evidenceBoundaryDocuments)).toEqual([]);
  });

  it("does not let a fictional Work Source satisfy empirical support", () => {
    const invalid = structuredClone(evidenceBoundaryDocuments);
    const citations = invalid.at(-1);
    if (citations?.documentType === "relationships") {
      citations.relationships = [
        { id: "empirical-observation-fiction-support", predicate: "cites", subject: { kind: "statement", id: "empirical-observation" }, object: { kind: "source", id: "fictional-source" }, role: "supports", locator: "Synthetic locator" },
      ];
    }
    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain("empirical-observation-fiction-support: fictional Work Source cannot support empirical Statement empirical-observation");
    expect(errors).toContain("empirical-observation: empirical outcome or assessment requires a non-fiction supporting Source");
  });

  it("does not treat a Source without a resolved Work as eligible empirical support", () => {
    const invalid = structuredClone(evidenceBoundaryDocuments);
    const source = invalid[3];
    if (source?.documentType === "entity" && source.entity.kind === "source") delete source.entity.workId;
    expect(validateAuthoringDocuments(invalid)).toContain("empirical-observation: empirical outcome or assessment requires a non-fiction supporting Source");
  });

  it("rejects a fictional Work Source challenging an empirical Statement", () => {
    const invalid = structuredClone(evidenceBoundaryDocuments);
    const citations = invalid.at(-1);
    if (citations?.documentType === "relationships") citations.relationships.push({ id: "empirical-observation-fiction-challenge", predicate: "cites", subject: { kind: "statement", id: "empirical-observation" }, object: { kind: "source", id: "fictional-source" }, role: "challenges", locator: "Synthetic locator" });
    expect(validateAuthoringDocuments(invalid)).toContain("empirical-observation-fiction-challenge: fictional Work Source cannot challenge empirical Statement empirical-observation");
  });

  it("rejects fictional support even while an empirical Statement is research-needed", () => {
    const invalid = structuredClone(evidenceBoundaryDocuments);
    const observation = invalid.find((document) => document.documentType === "entity" && document.entity.id === "empirical-observation");
    if (observation?.documentType === "entity") observation.entity.publicationStatus = "research-needed";
    const citations = invalid.at(-1);
    if (citations?.documentType === "relationships") citations.relationships.push({ id: "research-needed-observation-fiction-support", predicate: "cites", subject: { kind: "statement", id: "empirical-observation" }, object: { kind: "source", id: "fictional-source" }, role: "supports", locator: "Synthetic locator" });
    expect(validateAuthoringDocuments(invalid)).toContain("research-needed-observation-fiction-support: fictional Work Source cannot support empirical Statement empirical-observation");
  });

  it("requires depicts evidence to be an editorial interpretation", () => {
    const invalid = structuredClone(evidenceBoundaryDocuments);
    const interpretation = invalid.find((document) => document.documentType === "entity" && document.entity.id === "fictional-arrangement-interpretation");
    if (interpretation?.documentType === "entity" && interpretation.entity.kind === "statement") interpretation.entity.statementKind = "observation";
    expect(validateAuthoringDocuments(invalid)).toContain("fictional-arrangement-depicts-fictional-means: Depiction requires editorial-interpretation Statement fictional-arrangement-interpretation");
  });

  it("requires a Depiction to identify a fictional Work", () => {
    const invalid = structuredClone(evidenceBoundaryDocuments);
    const depiction = invalid[4];
    if (depiction?.documentType === "entity" && depiction.entity.kind === "depiction") depiction.entity.workId = "research-work";
    expect(validateAuthoringDocuments(invalid)).toContain("fictional-arrangement: Depiction requires a fictional Work");
  });

  it("applies the non-fiction support rule to criterion assessments", () => {
    const assessmentDocuments: AuthoringDocument[] = [
      ...evidenceBoundaryDocuments,
      entity({ id: "test-assessment-place", kind: "place", label: "Assessment place", placeType: "other", ...base }),
      entity({ id: "test-assessment", kind: "statement", label: "Test assessment", statementKind: "editorial-interpretation", text: "A synthetic assessment.", ...reviewed }),
      entity({ id: "test-criterion", kind: "criterion", label: "Test criterion", definition: "Synthetic criterion.", evidenceRequirements: ["Synthetic evidence."], normativeAssumptions: ["Synthetic assumption."], limitations: ["Synthetic limitation."], ...base }),
      entity({ id: "test-assessment-case", kind: "case", label: "Assessment case", locationIds: ["test-assessment-place"], startDate: { year: 2000, certainty: "exact" }, endDate: { year: 2001, certainty: "exact" }, overviewTitle: "What is assessed?", overview: [{ heading: "Overview", text: "Synthetic assessment case.", statementIds: ["empirical-observation"] }], scope: "Synthetic scope.", selectionRationale: "Exercise assessment evidence.", conditionStatementIds: [], episodeIds: [], ...base }),
      relationships({ kind: "case", id: "test-assessment-case" }, [{ id: "test-case-assessed-by-test-criterion", predicate: "assessed-by", subject: { kind: "case", id: "test-assessment-case" }, object: { kind: "criterion", id: "test-criterion" }, conclusion: "inconclusive", status: "research-needed", statementIds: ["test-assessment"] }]),
      relationships({ kind: "statement", id: "test-assessment" }, [{ id: "test-assessment-fiction-context", predicate: "cites", subject: { kind: "statement", id: "test-assessment" }, object: { kind: "source", id: "fictional-source" }, role: "context", locator: "Synthetic locator" }]),
    ];

    expect(validateAuthoringDocuments(assessmentDocuments)).toContain("test-assessment: empirical outcome or assessment requires a non-fiction supporting Source");
  });
});
