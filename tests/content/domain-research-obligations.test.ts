import { describe, expect, it } from "vitest";
import type { AuthoringDocument, EntityRef } from "../../src/lib/domain";
import {
  auditContent,
  claimPublicationLabel,
  compileDomainGraph,
  formatContentAttentionReport,
  validateAuthoringDocuments,
  workflowReferencesIn,
} from "../../src/lib/domain";
import {
  canonicalGraph,
  researchObligationsForTarget,
  researchTargetHref,
} from "../../src/lib/domain/canonical";

const reviewed = { publicationStatus: "reviewed" as const };
const documents: AuthoringDocument[] = [
  {
    documentType: "entity",
    entity: {
      id: "test-concept",
      kind: "concept",
      label: "Test concept",
      description: "A target fixture.",
      schemeIds: [],
      scopeNote: "Synthetic test scope.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "test-result-statement",
      kind: "statement",
      label: "Test result statement",
      description: "A reconciled result fixture.",
      statementKind: "observation",
      text: "New evidence produced a distinct result claim.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "test-statement",
      kind: "statement",
      label: "Test statement",
      description: "A resolution fixture.",
      statementKind: "observation",
      text: "Evidence was reconciled into this claim.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "test-work",
      kind: "work",
      label: "Test work",
      description: "A non-fiction evidence fixture.",
      title: "Test Work",
      workType: "article",
      originalPublicationYear: 2026,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "test-source",
      kind: "source",
      label: "Test source",
      description: "A citable evidence fixture.",
      title: "Test Work",
      sourceType: "article",
      workId: "test-work",
      contributorDisplay: ["Test Author"],
      publicationYear: 2026,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "test-research-obligation",
      kind: "research-obligation",
      label: "Test research obligation",
      description: "A focused open question.",
      obligationType: "counterfactual",
      question: "What would have happened without the intervention?",
      target: { kind: "concept", id: "test-concept" },
      addressedStatementIds: ["test-statement"],
      currentLimitation: "The observed outcome has no comparison path.",
      evidenceNeeded: "A design with an explicit comparison and assumptions.",
      scope: "The defined intervention, population, place, and period.",
      obligationStatus: "open",
      statementIds: [],
      reviewedAt: "2026-09-05",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "test-concept-dossier",
      kind: "dossier",
      label: "Test concept dossier",
      description: "A section-target fixture.",
      subject: { kind: "concept", id: "test-concept" },
      standfirst: "A traceable test summary.",
      standfirstStatementIds: ["test-statement"],
      sections: [
        {
          id: "test-section",
          heading: "What remains open?",
          body: "A traceable test section.",
          traceStatus: "supported",
          statementIds: ["test-statement"],
        },
        {
          id: "other-section",
          heading: "What did later evidence establish?",
          body: "A second traceable test section.",
          traceStatus: "supported",
          statementIds: ["test-result-statement"],
        },
      ],
      reviewedAt: "2026-09-05",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "other-concept",
      kind: "concept",
      label: "Other concept",
      description: "An unrelated target fixture.",
      schemeIds: [],
      scopeNote: "Synthetic unrelated scope.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "other-concept-dossier",
      kind: "dossier",
      label: "Other concept dossier",
      description: "An unrelated Statement-ownership fixture.",
      subject: { kind: "concept", id: "other-concept" },
      standfirst: "An unrelated traceable test summary.",
      standfirstStatementIds: ["test-result-statement"],
      sections: [
        {
          id: "unrelated-section",
          heading: "What belongs elsewhere?",
          body: "An unrelated traceable test section.",
          traceStatus: "supported",
          statementIds: ["test-result-statement"],
        },
      ],
      reviewedAt: "2026-09-05",
      ...reviewed,
    },
  },
  {
    documentType: "relationships",
    subject: { kind: "statement", id: "test-statement" },
    relationships: [
      {
        id: "test-statement-citation",
        predicate: "cites",
        subject: { kind: "statement", id: "test-statement" },
        object: { kind: "source", id: "test-source" },
        role: "supports",
        locator: "p. 1",
      },
    ],
  },
  {
    documentType: "relationships",
    subject: { kind: "statement", id: "test-result-statement" },
    relationships: [
      {
        id: "test-result-statement-citation",
        predicate: "cites",
        subject: { kind: "statement", id: "test-result-statement" },
        object: { kind: "source", id: "test-source" },
        role: "supports",
        locator: "p. 2",
      },
    ],
  },
];

function obligationIn(candidate: AuthoringDocument[]) {
  const document = candidate.find(
    (item) =>
      item.documentType === "entity" &&
      item.entity.kind === "research-obligation",
  );
  if (
    document?.documentType !== "entity" ||
    document.entity.kind !== "research-obligation"
  )
    throw new Error("Missing research obligation fixture");
  return document.entity;
}

describe("research obligations", () => {
  it("compiles and audits a typed open obligation", () => {
    const graph = compileDomainGraph(documents);
    const report = auditContent(graph);
    expect(report.openResearchObligations).toEqual([
      {
        id: "test-research-obligation",
        obligationType: "counterfactual",
        target: "concept:test-concept",
        status: "open",
      },
    ]);
    expect(formatContentAttentionReport(report)).toContain(
      "test-research-obligation: counterfactual; concept:test-concept; open",
    );
  });

  it("rejects unresolved targets, unscoped questions, and incomplete lifecycles", () => {
    const invalid = structuredClone(documents);
    const obligation = obligationIn(invalid);
    obligation.target.id = "missing-concept";
    obligation.targetSectionId = "missing-section";
    obligation.question = "Not a question";
    obligation.scope = "";
    obligation.obligationStatus = "resolved";
    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain(
      "test-research-obligation: unresolved or mistyped research target concept:missing-concept",
    );
    expect(errors).toContain(
      "test-research-obligation: unresolved or unpublished Dossier section concept:missing-concept#missing-section",
    );
    expect(errors).toContain(
      "test-research-obligation: research question must end with a question mark",
    );
    expect(errors).toContain("test-research-obligation: scope is empty");
    expect(errors).toContain(
      "test-research-obligation: resolved research obligation requires a resolution rationale",
    );
    expect(errors).toContain(
      "test-research-obligation: resolved research obligation requires a reconciled Statement",
    );
    expect(errors).toContain(
      "test-research-obligation: closed research obligation requires a closure date",
    );
  });

  it("requires reconciled evidence to advance an open obligation", () => {
    const pending = structuredClone(documents);
    const obligation = obligationIn(pending);
    obligation.statementIds = ["test-result-statement"];
    expect(validateAuthoringDocuments(pending)).toContain(
      "test-research-obligation: open research obligation cannot have reconciled Statements; use partially-addressed",
    );
  });

  it("resolves a section target through its subject Dossier", () => {
    const scoped = structuredClone(documents);
    const obligation = obligationIn(scoped);
    obligation.targetSectionId = "test-section";
    expect(
      compileDomainGraph(scoped).indexes.entitiesById[obligation.id],
    ).toMatchObject({
      targetSectionId: "test-section",
    });
  });

  it("does not publish a section link into an unpublished Dossier", () => {
    const invalid = structuredClone(documents);
    const obligation = obligationIn(invalid);
    obligation.targetSectionId = "test-section";
    const dossier = invalid.find(
      (item) =>
        item.documentType === "entity" && item.entity.kind === "dossier",
    );
    if (dossier?.documentType !== "entity" || dossier.entity.kind !== "dossier")
      throw new Error("Missing Dossier fixture");
    dossier.entity.publicationStatus = "in-review";
    expect(validateAuthoringDocuments(invalid)).toContain(
      "test-research-obligation: unresolved or unpublished Dossier section concept:test-concept#test-section",
    );
  });

  it("requires reconciled evidence for partially addressed obligations", () => {
    const partial = structuredClone(documents);
    const obligation = obligationIn(partial);
    obligation.obligationStatus = "partially-addressed";
    expect(validateAuthoringDocuments(partial)).toContain(
      "test-research-obligation: partially addressed research obligation requires a reconciled Statement",
    );
  });
});

describe("research obligation lifecycles", () => {
  it("audits partially reconciled evidence until the obligation closes", () => {
    const partial = structuredClone(documents);
    const obligation = obligationIn(partial);
    obligation.obligationStatus = "partially-addressed";
    obligation.statementIds = ["test-result-statement"];
    const report = auditContent(compileDomainGraph(partial));
    expect(report.researchEvidenceAwaitingResolution).toEqual([
      "test-research-obligation",
    ]);
  });

  it("accepts complete resolved and withdrawn lifecycles", () => {
    const resolved = structuredClone(documents);
    const resolvedObligation = obligationIn(resolved);
    resolvedObligation.obligationStatus = "resolved";
    resolvedObligation.statementIds = ["test-result-statement"];
    resolvedObligation.resolutionRationale =
      "The new evidence answers the scoped question.";
    resolvedObligation.closedAt = "2026-09-05";
    expect(() => compileDomainGraph(resolved)).not.toThrow();

    const withdrawn = structuredClone(documents);
    const withdrawnObligation = obligationIn(withdrawn);
    withdrawnObligation.obligationStatus = "withdrawn";
    withdrawnObligation.resolutionRationale =
      "The question duplicates a better-scoped obligation.";
    withdrawnObligation.closedAt = "2026-09-05";
    expect(() => compileDomainGraph(withdrawn)).not.toThrow();
  });

  it("rejects contradictory lifecycle and claim-ledger states", () => {
    const invalid = structuredClone(documents);
    const obligation = obligationIn(invalid);
    obligation.closedAt = "2026-09-05";
    obligation.statementIds = ["test-statement"];
    obligation.addressedStatementIds = ["test-statement", "test-statement"];
    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain(
      "test-research-obligation: active research obligation cannot have a closure date",
    );
    expect(errors).toContain(
      "test-research-obligation: research obligation repeats an addressed Statement",
    );
    expect(errors).toContain(
      "test-research-obligation: addressed and reconciled Statements must be distinct",
    );
  });
});

describe("research obligation targets and public text", () => {
  it("rejects targets without a public obligation route", () => {
    const invalid = structuredClone(documents);
    const obligation = obligationIn(invalid);
    (obligation.target as EntityRef).kind = "source";
    obligation.target.id = "test-source";
    expect(validateAuthoringDocuments(invalid)).toContain(
      "test-research-obligation: research obligations must target a reader-facing approach, case, challenge, or concept",
    );
  });

  it("requires an exact claim or section target", () => {
    const invalid = structuredClone(documents);
    obligationIn(invalid).addressedStatementIds = [];
    expect(validateAuthoringDocuments(invalid)).toContain(
      "test-research-obligation: research obligation requires an addressed Statement or exact Dossier section",
    );
  });

  it("rejects a Statement owned by an unrelated Dossier", () => {
    const invalid = structuredClone(documents);
    const obligation = obligationIn(invalid);
    obligation.addressedStatementIds = ["test-result-statement"];
    const dossier = invalid.find(
      (item) =>
        item.documentType === "entity" &&
        item.entity.id === "test-concept-dossier",
    );
    if (dossier?.documentType !== "entity" || dossier.entity.kind !== "dossier")
      throw new Error("Missing Dossier fixture");
    dossier.entity.sections[1] = {
      id: "other-section",
      heading: "What did later evidence establish?",
      body: "A second traceable test section.",
      traceStatus: "supported",
      statementIds: [],
    };
    expect(validateAuthoringDocuments(invalid)).toContain(
      "test-research-obligation: addressed Statement test-result-statement is not owned by concept:test-concept",
    );
  });

  it("rejects a Statement owned by the target Dossier but not its exact section", () => {
    const invalid = structuredClone(documents);
    const obligation = obligationIn(invalid);
    obligation.targetSectionId = "test-section";
    obligation.obligationStatus = "partially-addressed";
    obligation.statementIds = ["test-result-statement"];
    expect(validateAuthoringDocuments(invalid)).toContain(
      "test-research-obligation: reconciled Statement test-result-statement is not owned by concept:test-concept#test-section",
    );
  });
});

describe("public research text", () => {
  it.each([
    "label",
    "description",
    "question",
    "currentLimitation",
    "evidenceNeeded",
    "scope",
    "resolutionRationale",
  ] as const)("rejects internal workflow references in %s", (field) => {
    const invalid = structuredClone(documents);
    const obligation = obligationIn(invalid);
    obligation[field] = "Track this in pull request #97.";
    expect(validateAuthoringDocuments(invalid)).toContain(
      `test-research-obligation: reader-facing research text contains an internal workflow reference in ${field}`,
    );
  });

  it("detects repository workflow language without rejecting ordinary numbers", () => {
    expect(
      workflowReferencesIn("Tracked in issue 97 on feature/research-work."),
    ).toEqual(["repository issue or pull request", "repository branch"]);
    expect(
      workflowReferencesIn(
        "See https://github.com/example/project/pull/12 during content migration.",
      ),
    ).toEqual(["repository issue or pull request", "migration or draft state"]);
    expect(
      workflowReferencesIn("Article #12 examines migration policy."),
    ).toEqual([]);
  });

  it("labels every Statement publication state truthfully", () => {
    expect(claimPublicationLabel("published")).toBe("Claim published");
    expect(claimPublicationLabel("reviewed")).toBe("Claim reviewed");
    expect(claimPublicationLabel("in-review")).toBe("Claim review in progress");
    expect(claimPublicationLabel("research-needed")).toBe("Research needed");
    expect(claimPublicationLabel("deprecated")).toBe("Claim retired");
  });
});

describe("research obligation routes", () => {
  it("builds section-aware routes for every supported target kind", () => {
    expect(
      researchTargetHref({
        target: { kind: "concept", id: "test-concept" },
        targetSectionId: "test-section",
      }),
    ).toBe("/concepts/test-concept/#test-section");
    expect(
      ["approach", "case", "challenge"].map((kind) =>
        researchTargetHref({
          target: { kind, id: "example" } as never,
        }),
      ),
    ).toEqual(["/explore/example/", "/cases/example/", "/challenges/example/"]);
  });
});

const expectedOpenResearchObligations = [
  {
    id: "anarchism-property-exchange-boundaries",
    obligationType: "research-gap",
    target: "concept:anarchism#disputes",
    status: "open",
  },
  {
    id: "anarchism-spanish-participation-boundary",
    obligationType: "counterevidence",
    target: "concept:anarchism#spain",
    status: "open",
  },
  {
    id: "cmp-causal-performance-counterfactual",
    obligationType: "counterfactual",
    target: "case:us-controlled-materials-plan#what-can-the-episode-show",
    status: "open",
  },
  {
    id: "cmp-civilian-priority-counterevidence",
    obligationType: "counterevidence",
    target: "case:us-controlled-materials-plan#who-held-which-authority",
    status: "open",
  },
  ...[
    ["collective-capital-formation-benefit-allocation", "counterargument"],
    ["collective-capital-formation-durable-support", "counterargument"],
    ["collective-capital-formation-governance-exit-design", "counterargument"],
    ["collective-capital-formation-participant-understanding", "research-gap"],
  ].map(([id, obligationType]) => ({
    id,
    obligationType,
    target:
      "concept:collective-capital-formation#why-can-collective-funds-lose-support",
    status: "open",
  })),
  {
    id: "communism-claimed-identity-practice-gap",
    obligationType: "research-gap",
    target: "concept:communism#does-a-communist-label-settle-the-case",
    status: "open",
  },
  {
    id: "communism-roy-comintern-strategy",
    obligationType: "research-gap",
    target: "concept:communism#was-communism-one-global-movement",
    status: "open",
  },
  {
    id: "democracy-inclusion-measurement-boundary",
    obligationType: "counterevidence",
    target: "concept:democracy#measurement",
    status: "open",
  },
  {
    id: "economic-democracy-causal-identification",
    obligationType: "research-gap",
    target:
      "concept:economic-democracy#what-can-democratic-designs-fail-to-achieve",
    status: "open",
  },
  {
    id: "economic-democracy-decision-cost-objection",
    obligationType: "counterargument",
    target:
      "concept:economic-democracy#what-can-democratic-designs-fail-to-achieve",
    status: "open",
  },
  {
    id: "economic-democracy-futility-objection",
    obligationType: "counterargument",
    target:
      "concept:economic-democracy#what-can-democratic-designs-fail-to-achieve",
    status: "open",
  },
  {
    id: "economic-democracy-property-rights-objection",
    obligationType: "counterargument",
    target:
      "concept:economic-democracy#what-can-democratic-designs-fail-to-achieve",
    status: "open",
  },
  {
    id: "kahnawake-cdmrp-current-hearing-rules",
    obligationType: "research-gap",
    target: "case:kahnawake-community-lawmaking#how-does-the-process-work",
    status: "open",
  },
  {
    id: "kahnawake-cdmrp-jurisdiction-enforcement",
    obligationType: "research-gap",
    target: "case:kahnawake-community-lawmaking",
    status: "open",
  },
  {
    id: "kahnawake-cdmrp-participation-representativeness",
    obligationType: "counterevidence",
    target: "case:kahnawake-community-lawmaking#what-do-we-know-about-practice",
    status: "open",
  },
  {
    id: "kahnawake-governing-authority-legitimacy",
    obligationType: "research-gap",
    target:
      "case:kahnawake-community-lawmaking#is-this-simply-traditional-government",
    status: "open",
  },
  {
    id: "republic-self-description-exclusion-boundary",
    obligationType: "counterargument",
    target: "concept:republic#disputes",
    status: "open",
  },
  {
    id: "social-democracy-postwar-conditions",
    obligationType: "research-gap",
    target: "concept:social-democracy#where-the-tradition-came-from",
    status: "open",
  },
  {
    id: "social-ownership-delegation-accountability-gap",
    obligationType: "counterargument",
    target: "concept:social-ownership#which-rights-must-be-separated",
    status: "open",
  },
  {
    id: "socialism-communism-lexical-history",
    obligationType: "research-gap",
    target: "concept:socialism#how-do-socialism-and-communism-relate",
    status: "open",
  },
  {
    id: "socialism-democratic-control-threshold",
    obligationType: "research-gap",
    target: "concept:socialism#what-defines-socialism",
    status: "open",
  },
  {
    id: "socialism-rival-classification-boundary",
    obligationType: "counterargument",
    target: "concept:socialism#what-defines-socialism",
    status: "open",
  },
  {
    id: "swedish-funds-investment-counterfactual",
    obligationType: "counterfactual",
    target: "case:swedish-wage-earner-funds",
    status: "open",
  },
  {
    id: "swedish-funds-ownership-counterfactual",
    obligationType: "counterfactual",
    target: "case:swedish-wage-earner-funds#what-they-did-in-practice",
    status: "open",
  },
  {
    id: "swedish-funds-political-durability-counterfactual",
    obligationType: "counterfactual",
    target: "case:swedish-wage-earner-funds#why-the-case-matters",
    status: "open",
  },
  {
    id: "swedish-funds-wage-formation-counterfactual",
    obligationType: "counterfactual",
    target: "case:swedish-wage-earner-funds#what-they-were-meant-to-do",
    status: "open",
  },
  {
    id: "tawantinsuyu-colonial-translation",
    obligationType: "research-gap",
    target:
      "case:tawantinsuyu-imperial-organization#how-should-colonial-accounts-be-read",
    status: "open",
  },
  {
    id: "tawantinsuyu-provincial-variation",
    obligationType: "counterevidence",
    target: "case:tawantinsuyu-imperial-organization#who-ruled",
    status: "open",
  },
  {
    id: "tawantinsuyu-reciprocity-extraction-test",
    obligationType: "counterargument",
    target:
      "case:tawantinsuyu-imperial-organization#was-it-reciprocity-or-extraction",
    status: "open",
  },
  { id: "zapatista-external-coercion-effects", obligationType: "counterfactual", target: "case:zapatista-autonomy-chiapas-1994-present", status: "open" },
  { id: "zapatista-participation-gender-authority", obligationType: "counterevidence", target: "case:zapatista-autonomy-chiapas-1994-present#how-did-it-work", status: "open" },
  { id: "zapatista-post-2023-rules-in-use", obligationType: "counterevidence", target: "case:zapatista-autonomy-chiapas-1994-present#what-changed-in-2023", status: "open" },
];

describe("canonical research agenda", () => {
  it("publishes the exact initial obligations", () => {
    const report = auditContent(canonicalGraph);
    expect(report.openResearchObligations).toEqual(
      expectedOpenResearchObligations,
    );
    expect(
      researchObligationsForTarget("concept", "economic-democracy").map(
        ({ id }) => id,
      ),
    ).toEqual([
      "economic-democracy-causal-identification",
      "economic-democracy-decision-cost-objection",
      "economic-democracy-futility-objection",
      "economic-democracy-property-rights-objection",
    ]);
    expect(researchObligationsForTarget("concept", "missing")).toEqual([]);
    expect(
      researchObligationsForTarget("concept", "social-ownership").map(
        ({ id }) => id,
      ),
    ).toEqual(["social-ownership-delegation-accountability-gap"]);
  });
});
