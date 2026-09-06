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
  "matriliny-does-not-fix-authority",
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
    expect(statementIds).toHaveLength(36);
    expect(sourceIds).toHaveLength(8);

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
  });

  it("locks every Statement, Source manifestation, and citation tuple", () => {
    expect(exactStatementLedger()).toMatchSnapshot("statements");
    expect(exactSourceLedger()).toMatchSnapshot("sources");
    expect(exactCitationLedger()).toMatchSnapshot("citations");
  });

  it("detects arbitrary Statement and citation-field drift", () => {
    const statements = exactStatementLedger();
    const citations = exactCitationLedger();
    expectEveryFieldDriftDetected(
      statements,
      ["label", "statementKind", "text"],
      "Statement",
    );
    expectEveryFieldDriftDetected(
      citations,
      ["sourceId", "role", "locator"],
      "citation",
    );
  });

  it("keeps the two cases and their evidence categories separately bounded", () => {
    expect(
      canonicalGraph.indexes.entitiesById[
        "koto-tinggi-post-decentralization-governance"
      ],
    ).toMatchObject({
      kind: "case",
      locationIds: ["nagari-koto-tinggi-agam", "west-sumatra"],
      episodeIds: ["koto-tinggi-governance-october-2016"],
    });
    expect(
      canonicalGraph.indexes.entitiesById[
        "koto-tinggi-governance-october-2016"
      ],
    ).toMatchObject({
      kind: "case-episode",
      formalRuleStatementIds: [
        "koto-tinggi-three-institutions",
        "koto-tinggi-formal-participation-rules",
        "koto-tinggi-formal-decision-rule",
      ],
      interactionStatementIds: [
        "koto-tinggi-budget-rules-in-use",
        "koto-tinggi-budget-consensus",
      ],
      outcomeStatementIds: [
        "koto-tinggi-administrative-capacity-limit",
        "koto-tinggi-regulatory-preparation-limit",
      ],
    });
    expect(
      canonicalGraph.indexes.entitiesById["bonjol-melayu-ulayat-governance"],
    ).toMatchObject({
      kind: "case",
      locationIds: ["nagari-bonjol-dharmasraya", "west-sumatra"],
      episodeIds: ["bonjol-ulayat-governance-2000-2016"],
    });
    expect(
      canonicalGraph.indexes.entitiesById["bonjol-ulayat-governance-2000-2016"],
    ).toMatchObject({
      kind: "case-episode",
      formalRuleStatementIds: ["bonjol-neshp-formal-promise"],
      ruleInUseStatementIds: ["bonjol-ulayat-sales-rules-in-use"],
      interactionStatementIds: ["bonjol-neshp-distribution-practice"],
      outcomeStatementIds: ["bonjol-neshp-exclusion-outcome"],
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
