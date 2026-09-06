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
  "koto-tinggi-customary-council-contestation",
  "koto-tinggi-budget-rules-in-use",
  "koto-tinggi-administrative-capacity-limit",
  "bonjol-study-method-and-voice",
  "bonjol-new-nagari-forest-transition",
  "bonjol-ulayat-formal-distinction",
  "bonjol-harta-pusaka-transition",
  "bonjol-bundo-kanduang-role",
  "bonjol-ulayat-sales-rules-in-use",
  "bonjol-neshp-formal-promise",
  "bonjol-neshp-distribution-practice",
  "bonjol-women-testimony-limit",
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

describe("Minangkabau matriliny, property, and authority", () => {
  it("publishes the exact traced Statement and Source ledger", () => {
    expect(statementIds).toHaveLength(29);
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

  it("keeps the two cases and their evidence categories separately bounded", () => {
    expect(
      canonicalGraph.indexes.entitiesById[
        "koto-tinggi-post-decentralization-governance"
      ],
    ).toMatchObject({
      kind: "case",
      locationIds: ["nagari-koto-tinggi-agam", "west-sumatra"],
      episodeIds: ["koto-tinggi-governance-2001-2016"],
    });
    expect(
      canonicalGraph.indexes.entitiesById["koto-tinggi-governance-2001-2016"],
    ).toMatchObject({
      kind: "case-episode",
      formalRuleStatementIds: [
        "koto-tinggi-three-institutions",
        "koto-tinggi-formal-participation-rules",
      ],
      ruleInUseStatementIds: ["koto-tinggi-customary-council-contestation"],
      interactionStatementIds: ["koto-tinggi-budget-rules-in-use"],
      outcomeStatementIds: ["koto-tinggi-administrative-capacity-limit"],
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
      formalRuleStatementIds: [
        "bonjol-ulayat-formal-distinction",
        "bonjol-harta-pusaka-transition",
        "bonjol-neshp-formal-promise",
      ],
      ruleInUseStatementIds: [
        "bonjol-ulayat-sales-rules-in-use",
        "bonjol-neshp-distribution-practice",
      ],
      interactionStatementIds: ["bonjol-women-testimony-limit"],
      outcomeStatementIds: ["bonjol-authors-causal-interpretation"],
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
