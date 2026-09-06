import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import type { AuthoringDocument } from "../../src/lib/domain";
import {
  compileDomainGraph,
  validateAuthoringDocuments,
} from "../../src/lib/domain";
import {
  canonicalGraph,
  citationsFor,
  subjectGuideBySlug,
} from "../../src/lib/domain/canonical";

const statementIds = [
  "matriliny-maternal-descent-definition",
  "matrilocality-residence-distinction",
  "matriliny-does-not-fix-residence",
  "matriarchy-rule-by-women-dispute",
  "minangkabau-power-varies-by-relation",
  "minangkabau-practices-historically-changing",
  "adat-translation-boundary",
  "nagari-translation-boundary",
  "minangkabau-legal-orders-interact",
  "minangkabau-ancestral-acquired-property-distinction",
  "koto-tinggi-minangkabau-adat-context",
  "koto-tinggi-fieldwork-scope",
  "koto-tinggi-three-institutions",
  "koto-tinggi-formal-participation-rules",
  "koto-tinggi-formal-decision-rule",
  "koto-tinggi-customary-council-contestation",
  "koto-tinggi-budget-rules-in-use",
  "koto-tinggi-budget-consensus",
  "koto-tinggi-administrative-capacity-limit",
  "koto-tinggi-regulatory-preparation-limit",
  "bonjol-study-method-and-voice",
  "bonjol-new-nagari-forest-transition",
  "bonjol-concession-end-transition",
  "bonjol-ulayat-formal-distinction",
  "bonjol-ulayat-delegated-management",
  "bonjol-harta-pusaka-transition",
  "bonjol-bundo-kanduang-role",
  "bonjol-ulayat-sales-rules-in-use",
  "bonjol-neshp-formal-promise",
  "bonjol-neshp-distribution-practice",
  "bonjol-neshp-exclusion-outcome",
  "bonjol-women-testimony-limit",
  "bonjol-five-women-testimony",
  "bonjol-authors-causal-interpretation",
  "bonjol-no-minangkabau-generalization",
  "nagari-law-changed-after-cases",
  "matriliny-does-not-fix-property-control",
  "matriliny-does-not-fix-office",
  "matriliny-does-not-fix-equality",
  "matriarchy-sanday-maternal-centered-interpretation",
  "koto-tinggi-descent-unobserved",
  "koto-tinggi-residence-unobserved",
  "koto-tinggi-participant-count-unreported",
  "koto-tinggi-womens-voice-unidentified",
  "koto-tinggi-formal-speaking-rule",
  "koto-tinggi-formal-consensus-rule",
  "koto-tinggi-formal-vote-fallback",
  "bonjol-harta-pusaka-female-line",
  "bonjol-inheritance-did-not-confer-office-authority",
  "bonjol-bundo-kanduang-not-universal-authority",
  "bonjol-authors-early-marriage-hypothesis",
  "bonjol-authors-gender-norms-hypothesis",
  "bonjol-authors-forum-hypothesis",
  "bonjol-authors-representation-dependence-hypothesis",
  "bonjol-causal-identification-limit",
  "koto-tinggi-representative-council",
  "koto-tinggi-customary-council",
  "koto-tinggi-budget-postponement",
  "koto-tinggi-unspent-funds",
  "koto-tinggi-accounting-difficulty",
  "bonjol-thirteen-key-informants",
  "bonjol-agency-records",
  "bonjol-twenty-seven-women-sample",
  "bonjol-ulayat-sales-contrary-to-custom",
  "bonjol-neshp-member-exclusion",
  "bonjol-five-women-income-loss",
  "bonjol-five-women-weak-influence",
] as const;

const sourceIds = [
  "nurdin-nagari-governance-source",
  "mutolib-bonjol-ulayat-source",
  "blackwood-webs-power-source",
  "sanday-women-center-excerpt-source",
  "sebastian-matrilineal-muslims-source",
  "mardoni-matrilineal-data-center-source",
  "west-sumatra-nagari-law-2018-source",
  "colombijn-padang-landownership-source",
] as const;

const workIds = [
  "nurdin-nagari-governance-work",
  "mutolib-bonjol-ulayat-work",
  "blackwood-webs-power-work",
  "sanday-women-center-work",
  "sebastian-matrilineal-muslims-work",
  "mardoni-matrilineal-data-center-work",
  "west-sumatra-nagari-law-2018-work",
  "colombijn-padang-landownership-work",
] as const;

const caseIds = [
  "koto-tinggi-post-decentralization-governance",
  "koto-tinggi-governance-october-2016",
  "bonjol-melayu-ulayat-governance",
  "bonjol-ulayat-governance-2000-2016",
] as const;

const semanticRelationshipIds = [
  "bonjol-applies-matriliny",
  "matriliny-related-to-matrilocality",
  "matriliny-commonly-confused-with-matriarchy",
] as const;

const requiredRelationshipAbsences = ["koto-tinggi-applies-matriliny"] as const;

function clonedDocuments() {
  return structuredClone(canonicalDocuments);
}

function relationshipIn(documents: AuthoringDocument[], id: string) {
  for (const document of documents) {
    if (document.documentType !== "relationships") continue;
    const relationship = document.relationships.find(
      (candidate) => candidate.id === id,
    );
    if (relationship) return relationship;
  }
  throw new Error(`Missing relationship ${id}`);
}

function exactStatementLedger() {
  return statementIds.map((id) => {
    const entity = canonicalGraph.indexes.entitiesById[id];
    if (entity?.kind !== "statement")
      throw new Error(`Missing Statement ${id}`);
    return {
      id: entity.id,
      label: entity.label,
      statementKind: entity.statementKind,
      text: entity.text,
    };
  });
}

function exactSourceLedger() {
  return sourceIds.map((id) => {
    const entity = canonicalGraph.indexes.entitiesById[id];
    if (entity?.kind !== "source") throw new Error(`Missing Source ${id}`);
    return structuredClone(entity);
  });
}

function exactWorkLedger() {
  return workIds.map((id) => {
    const entity = canonicalGraph.indexes.entitiesById[id];
    if (entity?.kind !== "work") throw new Error(`Missing Work ${id}`);
    return structuredClone(entity);
  });
}

function exactCitationLedger() {
  return statementIds.flatMap((statementId) =>
    citationsFor(statementId).map(({ object, role, locator }) => ({
      statementId,
      sourceId: object.id,
      role,
      locator,
    })),
  );
}

function exactCaseLedger(documents: AuthoringDocument[] = canonicalDocuments) {
  const graph = compileDomainGraph(documents);
  return caseIds.map((id) => {
    const entity = graph.indexes.entitiesById[id];
    if (entity?.kind !== "case" && entity?.kind !== "case-episode")
      throw new Error(`Missing Case or Case Episode ${id}`);
    return structuredClone(entity);
  });
}

function exactRelationshipLedger(
  documents: AuthoringDocument[] = canonicalDocuments,
) {
  const graph = compileDomainGraph(documents);
  return semanticRelationshipIds.map((id) => {
    const relationship = graph.relationships.find((candidate) => candidate.id === id);
    if (!relationship) throw new Error(`Missing relationship ${id}`);
    return structuredClone(relationship);
  });
}

function exactRelationshipAbsenceLedger(
  documents: AuthoringDocument[] = canonicalDocuments,
) {
  const graph = compileDomainGraph(documents);
  return requiredRelationshipAbsences.map((id) => ({
    id,
    absent: !graph.relationships.some((relationship) => relationship.id === id),
  }));
}

function expectEveryFieldDriftDetected<T extends object>(
  rows: T[],
  fields: (keyof T)[],
  ledgerName: string,
) {
  for (const index of rows.keys()) {
    for (const field of fields) {
      const changed = structuredClone(rows);
      const row = changed[index];
      if (!row) throw new Error(`Missing ${ledgerName} ledger row ${index}`);
      Object.assign(row, { [field]: `${String(row[field])} [drift]` });
      expect(changed).not.toEqual(rows);
    }
  }
}

describe("Minangkabau matriliny, property, and authority", () => {
  it("publishes the exact traced Statement and Source ledger", () => {
    expect(statementIds).toHaveLength(67);
    expect(sourceIds).toHaveLength(8);
    expect(workIds).toHaveLength(8);

    for (const id of statementIds) {
      expect(canonicalGraph.indexes.entitiesById[id]).toMatchObject({
        kind: "statement",
        publicationStatus: "reviewed",
      });
      expect(citationsFor(id).length).toBeGreaterThan(0);
      expect(
        citationsFor(id).every(({ locator }) => locator.trim().length > 0),
      ).toBe(true);
    }
    for (const id of sourceIds)
      expect(canonicalGraph.indexes.entitiesById[id]).toMatchObject({
        kind: "source",
        publicationStatus: "reviewed",
      });
    for (const id of workIds)
      expect(canonicalGraph.indexes.entitiesById[id]).toMatchObject({
        kind: "work",
        publicationStatus: "reviewed",
      });
  });

  it("locks every Statement, Work, Source manifestation, and citation tuple", () => {
    expect(exactStatementLedger()).toMatchSnapshot("statements");
    expect(exactWorkLedger()).toMatchSnapshot("works");
    expect(exactSourceLedger()).toMatchSnapshot("sources");
    expect(exactCitationLedger()).toMatchSnapshot("citations");
  });

  it("detects arbitrary Statement, Work, Source, and citation-field drift", () => {
    const statements = exactStatementLedger();
    const works = exactWorkLedger();
    const sources = exactSourceLedger();
    const citations = exactCitationLedger();
    expectEveryFieldDriftDetected(
      statements,
      ["label", "statementKind", "text"],
      "Statement",
    );
    expectEveryFieldDriftDetected(
      works,
      ["title", "workType", "originalPublicationYear"],
      "Work",
    );
    expectEveryFieldDriftDetected(
      sources,
      ["title", "sourceType", "workId", "publicationYear"],
      "Source",
    );
    expectEveryFieldDriftDetected(
      citations,
      ["sourceId", "role", "locator"],
      "citation",
    );
  });
});

describe("Minangkabau bounded case categories", () => {
  it("locks every Case, Case Episode, semantic relationship, and required absence", () => {
    expect(exactCaseLedger()).toMatchSnapshot("cases-and-episodes");
    expect(exactRelationshipLedger()).toMatchSnapshot("semantic-relationships");
    expect(exactRelationshipAbsenceLedger()).toEqual([
      { id: "koto-tinggi-applies-matriliny", absent: true },
    ]);
  });

  it("detects authored Case-slot and relationship drift after compilation", () => {
    const caseDocuments = clonedDocuments();
    const episode = caseDocuments.find(
      (document) =>
        document.documentType === "entity" &&
        document.entity.id === "koto-tinggi-governance-october-2016",
    );
    if (episode?.documentType !== "entity" || episode.entity.kind !== "case-episode")
      throw new Error("Missing Koto Tinggi Case Episode fixture");
    episode.entity.conditionStatementIds = ["koto-tinggi-fieldwork-scope"];
    expect(exactCaseLedger(caseDocuments)).not.toEqual(exactCaseLedger());

    const relationshipDocuments = clonedDocuments();
    const relationship = relationshipIn(
      relationshipDocuments,
      "matriliny-related-to-matrilocality",
    );
    if (relationship.predicate !== "related-to")
      throw new Error("Missing matriliny/matrilocality relationship fixture");
    relationship.statementIds = ["matrilocality-residence-distinction"];
    expect(exactRelationshipLedger(relationshipDocuments)).not.toEqual(
      exactRelationshipLedger(),
    );
  });
});

describe("Minangkabau bounded case assignments", () => {
  it("keeps the two cases and their evidence categories separately bounded", () => {
    expect(
      canonicalGraph.indexes.entitiesById[
        "koto-tinggi-post-decentralization-governance"
      ],
    ).toMatchObject({
      kind: "case",
      locationIds: ["nagari-koto-tinggi-agam", "west-sumatra"],
      conditionStatementIds: ["koto-tinggi-minangkabau-adat-context"],
      episodeIds: ["koto-tinggi-governance-october-2016"],
    });
    expect(
      canonicalGraph.indexes.entitiesById[
        "koto-tinggi-governance-october-2016"
      ],
    ).toMatchObject({
      kind: "case-episode",
      conditionStatementIds: ["koto-tinggi-minangkabau-adat-context"],
      formalRuleStatementIds: [
        "koto-tinggi-three-institutions",
        "koto-tinggi-representative-council",
        "koto-tinggi-customary-council",
        "koto-tinggi-formal-participation-rules",
        "koto-tinggi-formal-decision-rule",
        "koto-tinggi-formal-speaking-rule",
        "koto-tinggi-formal-consensus-rule",
        "koto-tinggi-formal-vote-fallback",
      ],
      ruleInUseStatementIds: [
        "koto-tinggi-budget-rules-in-use",
        "koto-tinggi-budget-postponement",
        "koto-tinggi-budget-consensus",
      ],
      interactionStatementIds: [
        "koto-tinggi-customary-council-contestation",
      ],
      outcomeStatementIds: [
        "koto-tinggi-administrative-capacity-limit",
        "koto-tinggi-unspent-funds",
        "koto-tinggi-accounting-difficulty",
        "koto-tinggi-regulatory-preparation-limit",
      ],
    });
    expect(
      canonicalGraph.indexes.entitiesById["bonjol-melayu-ulayat-governance"],
    ).toMatchObject({
      kind: "case",
      locationIds: ["nagari-bonjol-dharmasraya", "west-sumatra"],
      conditionStatementIds: [
        "bonjol-new-nagari-forest-transition",
        "bonjol-concession-end-transition",
      ],
      episodeIds: ["bonjol-ulayat-governance-2000-2016"],
    });
    expect(
      canonicalGraph.indexes.entitiesById["bonjol-ulayat-governance-2000-2016"],
    ).toMatchObject({
      kind: "case-episode",
      conditionStatementIds: [
        "bonjol-new-nagari-forest-transition",
        "bonjol-concession-end-transition",
      ],
      formalRuleStatementIds: [
        "bonjol-ulayat-formal-distinction",
        "bonjol-harta-pusaka-female-line",
        "bonjol-neshp-formal-promise",
      ],
      ruleInUseStatementIds: [
        "bonjol-ulayat-delegated-management",
        "bonjol-harta-pusaka-transition",
        "bonjol-inheritance-did-not-confer-office-authority",
        "bonjol-ulayat-sales-rules-in-use",
        "bonjol-ulayat-sales-contrary-to-custom",
      ],
      interactionStatementIds: ["bonjol-neshp-distribution-practice"],
      outcomeStatementIds: [
        "bonjol-neshp-exclusion-outcome",
        "bonjol-neshp-member-exclusion",
      ],
    });
  });
});

describe("Minangkabau guide and validation boundaries", () => {
  it("answers the familiar question without making matriarchy an alias", () => {
    const guide = subjectGuideBySlug("matriliny-property-authority");
    expect(guide?.label).toBe("Does matriliny mean women rule?");
    expect(guide?.primarySubject).toEqual({ kind: "concept", id: "matriliny" });
    expect(guide?.sections.map(({ role }) => role)).toEqual([
      "short-answer",
      "meanings-and-boundaries",
      "institutions-and-mechanisms",
      "bounded-practice",
      "variants-and-disputes",
      "comparisons-and-next-steps",
      "open-questions",
    ]);
    expect(
      guide?.sections.find(({ role }) => role === "open-questions")
        ?.researchObligationIds,
    ).toEqual([
      "koto-tinggi-community-voices",
      "bonjol-inheritance-effective-control",
      "minangkabau-migration-class-generation",
      "minangkabau-religious-authority",
      "minangkabau-state-administration-effects",
    ]);
    expect(canonicalGraph.indexes.entitiesById.matriliny).not.toHaveProperty(
      "alternateLabels",
    );
    expect(canonicalGraph.indexes.entitiesById.matriarchy).not.toHaveProperty(
      "alternateLabels",
    );
    expect(
      canonicalGraph.indexes.entitiesById.matrilocality,
    ).not.toHaveProperty("alternateLabels");
    expect(
      canonicalGraph.relationships.find(
        ({ id }) => id === "matriliny-related-to-matrilocality",
      ),
    ).toMatchObject({ predicate: "related-to", status: "qualified" });
    expect(
      canonicalGraph.relationships.find(
        ({ id }) => id === "matriliny-commonly-confused-with-matriarchy",
      ),
    ).toMatchObject({
      predicate: "commonly-confused-with",
      status: "asserted",
    });
    expect(
      canonicalGraph.relationships.find(
        ({ id }) => id === "koto-tinggi-applies-matriliny",
      ),
    ).toBeUndefined();
  });

  it("keeps the graph deterministic across complete document permutations", () => {
    const graph = compileDomainGraph(canonicalDocuments);
    const reversed = compileDomainGraph([...canonicalDocuments].reverse());
    expect(reversed).toEqual(graph);
  });

  it("rejects a citation when its precise locator is removed", () => {
    const documents = clonedDocuments();
    const citation = relationshipIn(documents, "citation-bonjol-sales");
    if (citation.predicate !== "cites") throw new Error("Expected citation");
    citation.locator = "";
    expect(validateAuthoringDocuments(documents)).toContain(
      "citation-bonjol-sales: citation requires a locator",
    );
  });

  it("rejects an open question attached to a claim outside its dossier section", () => {
    const documents = clonedDocuments();
    const obligation = documents.find(
      (document) =>
        document.documentType === "entity" &&
        document.entity.id === "koto-tinggi-community-voices",
    );
    if (
      obligation?.documentType !== "entity" ||
      obligation.entity.kind !== "research-obligation"
    )
      throw new Error("Missing research-obligation fixture");
    obligation.entity.addressedStatementIds = [
      "bonjol-ulayat-sales-rules-in-use",
    ];
    expect(validateAuthoringDocuments(documents)).toContain(
      "koto-tinggi-community-voices: addressed Statement bonjol-ulayat-sales-rules-in-use is not owned by concept:matriliny#what-can-koto-tinggi-show",
    );
  });
});
