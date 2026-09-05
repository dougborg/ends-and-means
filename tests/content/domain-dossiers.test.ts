import { describe, expect, it } from "vitest";
import {
  compileDomainGraph,
  auditContent,
  formatContentAttentionReport,
  validateAuthoringDocuments,
} from "../../src/lib/domain";
import type { AuthoringDocument, DomainEntity } from "../../src/lib/domain";
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
    expect(dossiers).toHaveLength(5);
    expect(
      dossierForSubject("case", "swedish-wage-earner-funds")?.sections.length,
    ).toBe(4);
    expect(dossierForSubject("concept", "economic-democracy")).toBeUndefined();
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

  it("reports the exact subjects that still need narrative work", () => {
    const report = auditContent(canonicalGraph);
    expect(
      report.dossierCoverage.find(({ kind }) => kind === "approach"),
    ).toMatchObject({ covered: 2, total: 2, missingIds: [] });
    expect(
      report.dossierCoverage.find(({ kind }) => kind === "challenge")
        ?.missingIds,
    ).toEqual(["authority-and-accountability"]);
    expect(formatContentAttentionReport(report)).toContain(
      "missing: social-democracy",
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
        dossierCoverage: [],
        researchGapSections: ["concept:test#open-question"],
        researchNeededEntities: ["concept:test"],
      }),
    ).toContain(
      "concept:test#open-question\n\nResearch-needed entities: 1\n- concept:test",
    );
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
      "test-concept-dossier: narrative section 0 ID is not stable kebab-case",
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
