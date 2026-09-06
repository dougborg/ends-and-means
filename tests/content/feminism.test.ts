import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import type { AuthoringDocument } from "../../src/lib/domain";
import { compileDomainGraph } from "../../src/lib/domain";
import {
  canonicalGraph,
  citationsFor,
  entityById,
  relationshipsFrom,
  subjectGuideById,
} from "../../src/lib/domain/canonical";

const feminismStatementIds = [
  "feminism-contested-family",
  "feminism-analysis-action-distinction",
  "feminism-public-private-boundary",
  "feminism-traditions-nonexhaustive",
  "liberal-feminism-tradition",
  "radical-feminism-tradition",
  "socialist-feminism-tradition",
  "marxist-feminism-tradition",
  "liberal-feminism-autonomy",
  "radical-feminism-structural-boundary",
  "socialist-feminism-material-boundary",
  "formal-substantive-equality-boundary",
  "crenshaw-single-axis-limit",
  "mohanty-western-universal-limit",
  "moreton-robinson-indigenous-boundary",
  "koyama-transfeminist-self-description",
  "koyama-body-autonomy",
  "sex-gender-trans-boundary",
  "fraser-social-reproduction-definition",
  "fraser-care-capitalism-claim",
  "combahee-self-description",
  "combahee-opposed-interlocking-oppressions",
  "combahee-organizing-practice",
  "combahee-selected-campaigns",
  "combahee-case-boundary",
  "sewa-union-registration",
  "sewa-worker-definition-contest",
  "sewa-cooperative-bank",
  "sewa-quilt-cooperative",
  "sewa-case-boundary",
  "iceland-leave-enacted-design",
  "iceland-fathers-uptake",
  "iceland-care-work-outcomes",
  "iceland-labor-force-participation-gap",
  "iceland-working-hours-gap",
  "iceland-causal-transfer-limit",
  "iceland-payment-cuts-uptake",
];
const feminismSourceBases = [
  "sep-feminist-political-philosophy",
  "combahee-statement",
  "taylor-combahee-reader",
  "crenshaw-demarginalizing",
  "harris-kennedy-combahee",
  "mohanty-western-eyes-revisited",
  "moreton-robinson-talkin-up",
  "koyama-transfeminist-manifesto",
  "fraser-capital-care",
  "sewa-history",
  "ilo-sewa-cooperatives",
  "iceland-parental-leave-law",
  "gislason-iceland-leave",
  "arnalds-eydal-gislason-leave",
] as const;

const feminismCaseIds = [
  "combahee-river-collective-1974-1980",
  "combahee-organizing-episode",
  "sewa-ahmedabad-1972-1977",
  "sewa-ahmedabad-institutions-episode",
  "iceland-parental-leave-2000-2018",
  "iceland-parental-leave-outcomes-episode",
] as const;
const feminismResearchObligationIds = [
  "feminism-universal-subject-exclusion",
  "feminism-translation-nonwestern-naming",
  "feminism-sex-gender-trans-boundaries",
  "feminism-policy-attribution-causal-effects",
] as const;
const feminismRelationshipIds = [
  "liberal-feminism-member-feminist-traditions",
  "socialist-feminism-member-feminist-traditions",
  "marxist-feminism-member-feminist-traditions",
  "radical-feminism-member-feminist-traditions",
  ...Array.from({ length: 42 }, (_, index) => `feminism-citation-${index + 1}`),
  "sewa-episode-used-self-employed-worker-unionism",
  "sewa-episode-used-member-owned-cooperative-finance",
  "iceland-episode-used-nontransferable-parental-leave",
] as const;

function exactEntityLedger(
  ids: readonly string[],
  documents: AuthoringDocument[] = canonicalDocuments,
) {
  const graph = compileDomainGraph(documents);
  return ids.map((id) => {
    const entity = graph.indexes.entitiesById[id];
    if (!entity) throw new Error(`Missing entity ${id}`);
    return structuredClone(entity);
  });
}

function exactRelationshipLedger(
  documents: AuthoringDocument[] = canonicalDocuments,
) {
  const graph = compileDomainGraph(documents);
  return feminismRelationshipIds.map((id) => {
    const relationship = graph.relationships.find((entry) => entry.id === id);
    if (!relationship) throw new Error(`Missing relationship ${id}`);
    return structuredClone(relationship);
  });
}

function exactPresentationLedger(
  documents: AuthoringDocument[] = canonicalDocuments,
) {
  const graph = compileDomainGraph(documents);
  const dossier = graph.indexes.entitiesById["feminism-dossier"];
  const guide = graph.subjectGuideRecords.find(
    ({ id }) => id === "guide-feminism",
  );
  if (dossier?.kind !== "dossier" || !guide)
    throw new Error("Missing feminism Dossier or Subject Guide");
  return [structuredClone(dossier), structuredClone(guide)];
}

function clonedDocuments() {
  return structuredClone(canonicalDocuments);
}

function authoredEntity(documents: AuthoringDocument[], id: string) {
  const document = documents.find(
    (entry) => entry.documentType === "entity" && entry.entity.id === id,
  );
  if (document?.documentType !== "entity")
    throw new Error(`Missing authored ${id}`);
  return document.entity;
}

function authoredRelationship(documents: AuthoringDocument[], id: string) {
  for (const document of documents) {
    if (document.documentType !== "relationships") continue;
    const relationship = document.relationships.find(
      (entry) => entry.id === id,
    );
    if (relationship) return relationship;
  }
  throw new Error(`Missing authored relationship ${id}`);
}

describe("foundational feminism guide", () => {
  it("publishes a substantive direct entry with the required evidence floor", () => {
    const guide = subjectGuideById("guide-feminism");
    expect(guide?.description).toContain("contested family");
    expect(guide?.description).not.toMatch(
      /learner|journey|path|workflow|pull request/i,
    );
    expect(feminismStatementIds).toHaveLength(37);
    for (const id of feminismStatementIds) {
      expect(entityById(id)?.kind).toBe("statement");
      expect(citationsFor(id).length).toBeGreaterThan(0);
      expect(citationsFor(id).every(({ locator }) => locator.length > 0)).toBe(
        true,
      );
    }
    const sourceIds = new Set(
      feminismStatementIds.flatMap((id) =>
        citationsFor(id).map(({ object }) => object.id),
      ),
    );
    expect(sourceIds.size).toBeGreaterThanOrEqual(10);
  });
});

describe("feminism evidence ledgers", () => {
  it("pins every Statement, kind, source, role, and locator in the feminism ledger", () => {
    const ledger = feminismStatementIds.map((id) => {
      const statement = entityById(id);
      if (statement?.kind !== "statement")
        throw new Error(`${id} is not a Statement`);
      return {
        id,
        statementKind: statement.statementKind,
        text: statement.text,
        citations: citationsFor(id).map(({ object, role, locator }) => ({
          sourceId: object.id,
          role,
          locator,
        })),
      };
    });
    expect(ledger).toMatchSnapshot();
  });

  it("keeps Work origins separate from consulted manifestation metadata", () => {
    expect(entityById("moreton-robinson-talkin-up-work")).toMatchObject({
      kind: "work",
      originalPublicationYear: 2000,
    });
    expect(entityById("moreton-robinson-talkin-up-source")).toMatchObject({
      kind: "source",
      publicationYear: 2021,
      publisher: "University of Minnesota Press",
    });
    expect(entityById("sewa-history-work")).not.toHaveProperty(
      "originalPublicationYear",
    );
    expect(entityById("sewa-history-source")).not.toHaveProperty(
      "publicationYear",
    );
    expect(entityById("combahee-statement-work")).toMatchObject({
      kind: "work",
      originalPublicationYear: 1977,
    });
    expect(entityById("combahee-statement-source")).not.toHaveProperty(
      "publicationYear",
    );
  });

  it("pins the complete Work and Source manifestation metadata ledger", () => {
    const ledger = feminismSourceBases.map((base) => {
      const work = entityById(`${base}-work`);
      const source = entityById(`${base}-source`);
      if (work?.kind !== "work" || source?.kind !== "source") {
        throw new Error(`${base} does not resolve to a Work and Source`);
      }
      return {
        base,
        work: {
          title: work.title,
          workType: work.workType,
          originalPublicationYear: work.originalPublicationYear,
        },
        source: {
          title: source.title,
          sourceType: source.sourceType,
          workId: source.workId,
          contributorDisplay: source.contributorDisplay,
          publicationYear: source.publicationYear,
          publisher: source.publisher,
          identifiers: source.identifiers,
          resourceLinks: source.resourceLinks,
        },
      };
    });
    expect(ledger).toMatchSnapshot();
  });
});

describe("feminism exact model ledgers", () => {
  it("pins every relationship, Case, Episode, Dossier, Guide, and Research Obligation", () => {
    expect(exactRelationshipLedger()).toMatchSnapshot("relationships");
    expect(exactEntityLedger(feminismCaseIds)).toMatchSnapshot(
      "cases-and-episodes",
    );
    expect(exactPresentationLedger()).toMatchSnapshot("presentation");
    expect(exactEntityLedger(feminismResearchObligationIds)).toMatchSnapshot(
      "research-obligations",
    );
  });

  it("detects compiler-effective drift across the exact model ledgers", () => {
    const relationshipDocuments = clonedDocuments();
    authoredRelationship(
      relationshipDocuments,
      "iceland-episode-used-nontransferable-parental-leave",
    ).id = "iceland-episode-used-nontransferable-parental-leave-drift";
    expect(() => exactRelationshipLedger(relationshipDocuments)).toThrow(
      /Missing relationship/,
    );

    const caseDocuments = clonedDocuments();
    authoredEntity(
      caseDocuments,
      "sewa-ahmedabad-institutions-episode",
    ).description += " Drift.";
    expect(exactEntityLedger(feminismCaseIds, caseDocuments)).not.toEqual(
      exactEntityLedger(feminismCaseIds),
    );

    const presentationDocuments = clonedDocuments();
    authoredEntity(presentationDocuments, "feminism-dossier").description +=
      " Drift.";
    expect(exactPresentationLedger(presentationDocuments)).not.toEqual(
      exactPresentationLedger(),
    );

    const guideDocuments = clonedDocuments();
    const guideDocument = guideDocuments.find(
      (document) =>
        document.documentType === "subject-guide" &&
        document.guide.id === "guide-feminism",
    );
    if (guideDocument?.documentType !== "subject-guide")
      throw new Error("Missing authored feminism Subject Guide");
    guideDocument.guide.description += " Drift.";
    expect(exactPresentationLedger(guideDocuments)).not.toEqual(
      exactPresentationLedger(),
    );

    const obligationDocuments = clonedDocuments();
    authoredEntity(
      obligationDocuments,
      "feminism-policy-attribution-causal-effects",
    ).description += " Drift.";
    expect(
      exactEntityLedger(feminismResearchObligationIds, obligationDocuments),
    ).not.toEqual(exactEntityLedger(feminismResearchObligationIds));
  });
});

describe("foundational feminism boundaries", () => {
  it("keeps traditions explicitly non-inheriting", () => {
    const traditionIds = [
      "liberal-feminism",
      "socialist-feminism",
      "marxist-feminism",
      "radical-feminism",
    ];
    for (const id of traditionIds) {
      const relations = relationshipsFrom(id);
      expect(relations).toHaveLength(1);
      expect(relations[0]).toMatchObject({
        predicate: "member-of",
        object: { kind: "collection", id: "feminist-traditions" },
        status: "qualified",
      });
    }
    expect(
      JSON.stringify(relationshipsFrom("feminist-traditions")),
    ).not.toMatch(/advances-end|advocates-means|applies-to-case/);
  });
});

describe("foundational feminism Case and research boundaries", () => {
  it("keeps three cases bounded and distinguishes rule, use, and outcome slots", () => {
    const cases = [
      "combahee-river-collective-1974-1980",
      "sewa-ahmedabad-1972-1977",
      "iceland-parental-leave-2000-2018",
    ].map((id) => entityById(id));
    expect(cases.every((entry) => entry?.kind === "case")).toBe(true);
    expect(
      new Set(
        cases.flatMap((entry) =>
          entry?.kind === "case" ? entry.locationIds : [],
        ),
      ).size,
    ).toBe(3);

    const iceland = entityById("iceland-parental-leave-outcomes-episode");
    expect(iceland).toMatchObject({
      kind: "case-episode",
      startDate: { year: 2000, certainty: "exact" },
      endDate: { year: 2018, certainty: "exact" },
      conditionStatementIds: [],
      formalRuleStatementIds: ["iceland-leave-enacted-design"],
      ruleInUseStatementIds: [
        "iceland-fathers-uptake",
        "iceland-payment-cuts-uptake",
      ],
      outcomeStatementIds: [
        "iceland-care-work-outcomes",
        "iceland-labor-force-participation-gap",
        "iceland-working-hours-gap",
      ],
    });
    expect(entityById("sewa-ahmedabad-institutions-episode")).toMatchObject({
      kind: "case-episode",
      startDate: { year: 1972, certainty: "exact" },
      endDate: { year: 1977, certainty: "exact" },
      conditionStatementIds: [],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: [
        "sewa-cooperative-bank",
        "sewa-quilt-cooperative",
      ],
      interactionStatementIds: ["sewa-worker-definition-contest"],
      outcomeStatementIds: ["sewa-union-registration"],
    });
    expect(entityById("combahee-organizing-episode")).toMatchObject({
      kind: "case-episode",
      conditionStatementIds: [],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: ["combahee-organizing-practice"],
      interactionStatementIds: [],
      outcomeStatementIds: [],
    });
    expect(entityById("combahee-river-collective-1974-1980")).toMatchObject({
      kind: "case",
      conditionStatementIds: [],
    });
    expect(entityById("sewa-ahmedabad-1972-1977")).toMatchObject({
      kind: "case",
      conditionStatementIds: [],
    });
    expect(entityById("iceland-parental-leave-2000-2018")).toMatchObject({
      kind: "case",
      conditionStatementIds: [],
    });
    expect(JSON.stringify(canonicalGraph.relationships)).not.toContain(
      '"predicate":"embodied"',
    );
    expect(JSON.stringify(canonicalGraph.relationships)).not.toMatch(
      /combahee-episode-contested-feminism|sewa-episode-contested-feminism/,
    );
  });

  it("publishes the four focused unresolved boundary questions", () => {
    const guide = subjectGuideById("guide-feminism");
    const open = guide?.sections.find(({ role }) => role === "open-questions");
    expect(open?.researchObligationIds).toEqual([
      "feminism-universal-subject-exclusion",
      "feminism-translation-nonwestern-naming",
      "feminism-sex-gender-trans-boundaries",
      "feminism-policy-attribution-causal-effects",
    ]);
  });
});
