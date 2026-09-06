import { describe, expect, it } from "vitest";
import type { AuthoringDocument, DomainEntity } from "../../src/lib/domain";
import {
  auditContent,
  compileDomainGraph,
  formatContentAttentionReport,
  validateAuthoringDocuments,
} from "../../src/lib/domain";
import {
  canonicalGraph,
  dossierForSubject,
  entitiesOfKind,
} from "../../src/lib/domain/canonical";

const entity = (value: DomainEntity): AuthoringDocument => ({
  documentType: "entity",
  entity: value,
});

describe("canonical narrative dossiers", () => {
  it("publishes one traceable Dossier for each migrated subject", () => {
    const dossiers = entitiesOfKind("dossier");
    expect(dossiers.map(({ id }) => id)).toEqual(
      expect.arrayContaining([
        "swedish-rehn-meidner-model-dossier",
        "swedish-solidaristic-bargaining-case-dossier",
        "swedish-wage-earner-fund-program-dossier",
        "swedish-wage-earner-funds-case-dossier",
        "distribution-of-gains-and-ownership-dossier",
      ]),
    );
    expect(
      dossierForSubject("case", "swedish-wage-earner-funds")?.sections.length,
    ).toBe(4);
    const economicDemocracy = dossierForSubject(
      "concept",
      "economic-democracy",
    );
    expect(economicDemocracy?.sections).toHaveLength(5);
    expect(economicDemocracy?.standfirstStatementIds).toEqual([
      "economic-democracy-contested-scope",
      "economic-democracy-ownership-is-not-control",
      "economic-democracy-design-and-evidence-limits",
    ]);
    expect(
      economicDemocracy?.sections
        .slice(0, 4)
        .flatMap(({ statementIds }) => statementIds),
    ).toEqual(
      expect.arrayContaining([
        "economic-democracy-contested-scope",
        "economic-democracy-workplace-institutions",
        "economic-democracy-economy-wide-institutions",
        "adamson-representative-firm-governance",
        "economic-democracy-beyond-workplace",
        "economic-democracy-ownership-is-not-control",
        "economic-democracy-design-and-evidence-limits",
        "economic-democracy-property-rights-objection-statement",
        "economic-democracy-decision-cost-objection-statement",
        "economic-democracy-futility-objection-statement",
      ]),
    );
    expect(economicDemocracy?.sections[4]?.statementIds).toEqual([
      "funds-declared-ends",
      "funds-related-ideas-classification",
      "funds-limited-control",
    ]);
    expect(
      dossierForSubject("concept", "social-democracy")?.sections,
    ).toHaveLength(4);
    const socialDemocracy = dossierForSubject("concept", "social-democracy");
    expect(socialDemocracy?.standfirstStatementIds).toEqual([
      "social-democracy-contested-definition",
    ]);
    expect(
      socialDemocracy?.sections
        .slice(0, 3)
        .flatMap(({ statementIds }) => statementIds),
    ).toEqual(
      expect.arrayContaining([
        "social-democracy-democratic-revision",
        "social-democracy-genealogy-contested",
        "social-democracy-welfare-state-form",
        "social-democracy-contested-capitalism-boundary",
      ]),
    );
    expect(socialDemocracy?.sections[3]?.statementIds).toEqual([
      "rehn-meidner-social-democratic-context",
      "funds-partial-instantiation",
    ]);
    expect(dossierForSubject("case", "missing-case")).toBeUndefined();
    expect(
      dossiers
        .flatMap(({ sections }) => sections)
        .every(
          ({ traceStatus, statementIds }) =>
            traceStatus === "research-gap" || statementIds.length > 0,
        ),
    ).toBe(true);
  });
});

describe("social-ownership narrative dossier", () => {
  it("publishes the social-ownership boundaries and related entities", () => {
    const socialOwnership = dossierForSubject("concept", "social-ownership");
    expect(socialOwnership?.sections).toHaveLength(4);
    expect(socialOwnership?.standfirstStatementIds).toEqual([
      "social-ownership-four-questions",
      "social-ownership-control-boundary",
    ]);
    expect(
      socialOwnership?.sections.flatMap(({ statementIds }) => statementIds),
    ).toEqual(
      expect.arrayContaining([
        "social-ownership-four-questions",
        "wright-social-ownership-definition",
        "social-ownership-title-benefit-boundary",
        "social-ownership-rights-are-divisible",
        "social-ownership-control-boundary",
        "social-ownership-returns-boundary",
        "social-ownership-public-title-boundary",
        "social-ownership-economic-democracy-relationship",
        "social-ownership-market-socialism-relationship",
        "rehn-meidner-original-ownership-boundary",
        "meidner-1976-wage-earner-fund-connection",
      ]),
    );
    expect(socialOwnership?.sections[1]?.relatedEntityRefs).toEqual(
      expect.arrayContaining([
        { kind: "challenge", id: "authority-and-accountability" },
        { kind: "criterion", id: "accountability" },
      ]),
    );
  });
});

describe("canonical narrative coverage", () => {
  it("reports the exact subjects that still need narrative work", () => {
    const report = auditContent(canonicalGraph);
    expect(
      report.dossierCoverage.find(({ kind }) => kind === "approach"),
    ).toMatchObject({ covered: 3, total: 3, missingIds: [] });
    expect(
      report.dossierCoverage.find(({ kind }) => kind === "challenge")
        ?.missingIds,
    ).toEqual(["authority-and-accountability"]);
    expect(
      report.dossierCoverage.find(({ kind }) => kind === "concept"),
    ).toMatchObject({
      covered: 7,
      total: 13,
      missingIds: [
        "economic-planning",
        "institutional-abolition",
        "market-coordination",
        "market-socialism",
        "social-class",
        "statelessness",
      ],
    });
    expect(formatContentAttentionReport(report)).not.toContain(
      "missing: social-ownership",
    );
    const attentionGraph = structuredClone(canonicalGraph);
    const attentionDossier = attentionGraph.entities.find(
      (entity) => entity.kind === "dossier",
    );
    if (attentionDossier?.kind !== "dossier")
      throw new Error("Missing canonical dossier fixture");
    const attentionSection = attentionDossier.sections[0];
    const attentionEntity = attentionGraph.entities[0];
    if (!attentionSection || !attentionEntity)
      throw new Error("Missing canonical attention fixture");
    attentionSection.traceStatus = "research-gap";
    attentionEntity.publicationStatus = "research-needed";
    const attentionReport = auditContent(attentionGraph);
    expect(attentionReport.researchGapSections).toHaveLength(1);
    expect(attentionReport.researchNeededEntities).toHaveLength(1);
    attentionDossier.publicationStatus = "deprecated";
    expect(
      dossierForSubject(
        attentionDossier.subject.kind,
        attentionDossier.subject.id,
        attentionGraph,
      ),
    ).toBeUndefined();
    expect(
      formatContentAttentionReport({
        subjectGuides: { live: 0, total: 0, liveIds: [] },
        dossierCoverage: [],
        researchGapSections: ["concept:test#open-question"],
        researchNeededEntities: ["concept:test"],
        narrativeAttention: [],
        openResearchObligations: [],
        researchEvidenceAwaitingResolution: [],
        sourcesWithoutCitations: ["source:test"],
        entitiesWithoutRelationships: ["concept:test"],
        dimensionsWithoutPlacements: ["comparison-dimension:test"],
        researchGapSectionsWithoutObligations: ["concept:test#open-question"],
        sourcePreflight: [
          {
            id: "source:test",
            missingMetadata: ["publisher"],
            urlsToVerify: ["https://example.com/source"],
          },
          {
            id: "source:linked",
            missingMetadata: [],
            urlsToVerify: ["https://example.com/linked"],
          },
        ],
      }),
    ).toContain(
      "concept:test#open-question\n\nResearch-needed entities: 1\n- concept:test",
    );
  });
});

describe("narrative attention signals", () => {
  it("reports an empty Source identifier object as missing access metadata", () => {
    const graph = structuredClone(canonicalGraph);
    const source = graph.entities.find((entity) => entity.kind === "source");
    if (source?.kind !== "source") throw new Error("Missing Source fixture");
    source.identifiers = {};
    source.resourceLinks = [];

    expect(auditContent(graph).sourcePreflight).toContainEqual(
      expect.objectContaining({
        id: `source:${source.id}`,
        missingMetadata: expect.arrayContaining(["identifier or access link"]),
      }),
    );
  });

  it("reports objective narrative attention signals without scoring prose", () => {
    const attentionGraph = structuredClone(canonicalGraph);
    const dossier = attentionGraph.entities.find(
      (entity) => entity.kind === "dossier",
    );
    if (dossier?.kind !== "dossier") throw new Error("Missing Dossier fixture");
    dossier.standfirst =
      "It is worth noting this complex interplay. Ultimately, it is multifaceted.";
    const report = auditContent(attentionGraph);
    expect(report.narrativeAttention).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          location: `${dossier.subject.kind}:${dossier.subject.id}#standfirst`,
          reason: "generic filler phrase",
        }),
      ]),
    );
    expect(formatContentAttentionReport(report)).toContain(
      "Narrative attention:",
    );
  });

  it("detects repeated phrasing across dossiers without flagging shared vocabulary", () => {
    const attentionGraph = structuredClone(canonicalGraph);
    const dossiers = attentionGraph.entities.filter(
      (entity) => entity.kind === "dossier",
    );
    const first = dossiers[0];
    const second = dossiers[1];
    if (first?.kind !== "dossier" || second?.kind !== "dossier")
      throw new Error("Missing Dossier fixtures");
    const section = second.sections[0];
    if (!section) throw new Error("Missing narrative section fixture");
    first.standfirst =
      "Five appointed boards invested collectively financed capital under statutory ownership caps.";
    section.body =
      "Five appointed boards invested collectively financed capital under statutory ownership caps during the period.";
    expect(auditContent(attentionGraph).narrativeAttention).toContainEqual(
      expect.objectContaining({ reason: "possible repeated phrasing" }),
    );
    section.body =
      "The evidence discusses capital, boards, ownership, and statutory institutions in a different relationship.";
    expect(
      auditContent(attentionGraph).narrativeAttention.filter(
        ({ reason }) => reason === "possible repeated phrasing",
      ),
    ).toEqual([]);
  });
});
const base = {
  description: "A dossier model fixture.",
  publicationStatus: "reviewed" as const,
};

const documents: AuthoringDocument[] = [
  entity({
    id: "test-concept",
    kind: "concept",
    label: "Test concept",
    schemeIds: [],
    scopeNote: "A synthetic fixture only.",
    ...base,
  }),
  entity({
    id: "test-statement",
    kind: "statement",
    label: "Test statement",
    statementKind: "observation",
    text: "A reviewed statement supports the narrative.",
    ...base,
    publicationStatus: "research-needed",
  }),
  entity({
    id: "test-concept-dossier",
    kind: "dossier",
    label: "Test concept dossier",
    subject: { kind: "concept", id: "test-concept" },
    standfirst: "A readable introduction derived from reviewed claims.",
    standfirstStatementIds: ["test-statement"],
    sections: [
      {
        id: "what-it-means",
        heading: "What it means",
        body: "This prose remains traceable to a canonical Statement.",
        traceStatus: "supported",
        statementIds: ["test-statement"],
        relatedEntityRefs: [{ kind: "concept", id: "test-concept" }],
      },
    ],
    reviewedAt: "2026-09-05",
    ...base,
    publicationStatus: "research-needed",
  }),
];

describe("narrative Dossier model", () => {
  it("compiles one traceable presentation record for a canonical subject", () => {
    const graph = compileDomainGraph(documents);
    const dossier = graph.indexes.entitiesById["test-concept-dossier"];
    expect(dossier?.kind).toBe("dossier");
    if (dossier?.kind === "dossier") {
      expect(dossier.subject).toEqual({ kind: "concept", id: "test-concept" });
      expect(dossier.sections[0]?.statementIds).toEqual(["test-statement"]);
    }
    expect(compileDomainGraph([...documents].reverse())).toEqual(graph);
  });

  it("rejects duplicate active dossiers for one subject", () => {
    const invalid = structuredClone(documents);
    const source = invalid[2];
    if (!source) throw new Error("Missing dossier fixture");
    const duplicate = structuredClone(source);
    if (duplicate.documentType === "entity")
      duplicate.entity.id = "another-dossier";
    invalid.push(duplicate);
    expect(validateAuthoringDocuments(invalid)).toContain(
      "another-dossier: dossier subject already belongs to test-concept-dossier",
    );
  });

  it("rejects unresolved traces and related entities", () => {
    const invalid = structuredClone(documents);
    const dossier = invalid[2];
    if (
      dossier?.documentType === "entity" &&
      dossier.entity.kind === "dossier"
    ) {
      const section = dossier.entity.sections[0];
      if (!section) throw new Error("Missing section fixture");
      section.statementIds = ["missing-statement"];
      section.relatedEntityRefs = [
        { kind: "organization", id: "missing-organization" },
      ];
    }
    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain(
      "test-concept-dossier:what-it-means: unresolved Statement missing-statement",
    );
    expect(errors).toContain(
      "test-concept-dossier:what-it-means: unresolved related entity organization:missing-organization",
    );
  });
});

describe("Dossier standfirst and gap boundaries", () => {
  it("requires a unique, resolved standfirst trace", () => {
    const invalid = structuredClone(documents);
    const dossier = invalid[2];
    if (
      dossier?.documentType === "entity" &&
      dossier.entity.kind === "dossier"
    ) {
      dossier.entity.standfirstStatementIds = [
        "missing-statement",
        "missing-statement",
      ];
    }
    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain(
      "test-concept-dossier:standfirst: unresolved Statement missing-statement",
    );
    expect(errors).toContain(
      "test-concept-dossier: dossier standfirst repeats a Statement",
    );
  });

  it("keeps explicit research gaps free of claimed support", () => {
    const invalid = structuredClone(documents);
    const dossier = invalid[2];
    if (
      dossier?.documentType === "entity" &&
      dossier.entity.kind === "dossier"
    ) {
      const section = dossier.entity.sections[0];
      if (!section) throw new Error("Missing section fixture");
      section.traceStatus = "research-gap";
    }
    expect(validateAuthoringDocuments(invalid)).toContain(
      "test-concept-dossier: research-gap section what-it-means must not claim supporting Statements",
    );
  });

  it("requires stable section identity and review metadata", () => {
    const invalid = structuredClone(documents);
    const dossier = invalid[2];
    if (
      dossier?.documentType === "entity" &&
      dossier.entity.kind === "dossier"
    ) {
      dossier.entity.reviewedAt = "September 5";
      const section = dossier.entity.sections[0];
      if (!section) throw new Error("Missing section fixture");
      section.id = "Not stable";
    }
    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain(
      "test-concept-dossier: reviewedAt requires an ISO calendar date",
    );
    expect(errors).toContain(
      'test-concept-dossier: narrative section 0 ID "Not stable" is not stable kebab-case',
    );
  });
});

describe("Dossier publication boundaries", () => {
  it("prevents live narrative from relying on unreviewed Statements", () => {
    const invalid = structuredClone(documents);
    const dossier = invalid[2];
    if (dossier?.documentType === "entity" && dossier.entity.kind === "dossier")
      dossier.entity.publicationStatus = "reviewed";
    expect(validateAuthoringDocuments(invalid)).toContain(
      "test-concept-dossier:what-it-means: live Dossier requires reviewed or published Statement test-statement",
    );
    expect(validateAuthoringDocuments(invalid)).toContain(
      "test-concept-dossier:standfirst: live Dossier requires reviewed or published Statement test-statement",
    );
  });

  it("rejects runtime-invalid subject kinds, trace statuses, and duplicate refs", () => {
    const invalid = structuredClone(documents);
    const dossier = invalid[2];
    if (
      dossier?.documentType === "entity" &&
      dossier.entity.kind === "dossier"
    ) {
      const unsafe = dossier.entity as unknown as {
        subject: { kind: string; id: string };
        sections: Array<{
          traceStatus: string;
          statementIds: string[];
          relatedEntityRefs: Array<{ kind: "concept"; id: string }>;
        }>;
      };
      unsafe.subject.kind = "source";
      const section = unsafe.sections[0];
      if (!section) throw new Error("Missing section fixture");
      section.traceStatus = "certain";
      section.statementIds = ["test-statement", "test-statement"];
      section.relatedEntityRefs = [
        { kind: "concept", id: "test-concept" },
        { kind: "concept", id: "test-concept" },
      ];
    }
    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain(
      "test-concept-dossier: invalid dossier subject kind source",
    );
    expect(errors).toContain(
      "test-concept-dossier: narrative section what-it-means has an invalid trace status",
    );
    expect(errors).toContain(
      "test-concept-dossier: narrative section what-it-means repeats a Statement",
    );
    expect(errors).toContain(
      "test-concept-dossier: narrative section what-it-means repeats a related entity",
    );
  });
});
