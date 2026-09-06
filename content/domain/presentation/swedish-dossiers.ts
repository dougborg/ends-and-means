import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const reviewed = {
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-05",
};

const rawDossierDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "swedish-wage-earner-fund-program-dossier",
      kind: "dossier",
      label: "Swedish wage-earner fund program dossier",
      description:
        "Sweden’s wage-earner fund program sought more even wealth distribution and greater wage-earner influence through five publicly appointed investment boards. Statutory caps and the funds’ small market share limited their control before liquidation.",
      subject: { kind: "approach", id: "swedish-wage-earner-fund-program" },
      standfirst: "",
      standfirstStatementIds: [
        "funds-declared-ends",
        "funds-statutory-design",
        "funds-limited-control",
      ],
      sections: [
        {
          id: "the-problem-it-addressed",
          heading: "The problem it tried to address",
          body: "",
          traceStatus: "supported",
          statementIds: ["funds-declared-ends"],
          relatedEntityRefs: [
            { kind: "end", id: "wage-earner-influence" },
            { kind: "challenge", id: "distribution-of-gains-and-ownership" },
          ],
        },
        {
          id: "the-enacted-mechanism",
          heading: "The mechanism that was enacted",
          body: "",
          traceStatus: "supported",
          statementIds: ["funds-statutory-design"],
          relatedEntityRefs: [
            { kind: "means", id: "regional-wage-earner-fund-boards" },
            { kind: "case", id: "swedish-wage-earner-funds" },
          ],
        },
        {
          id: "why-program-and-practice-differ",
          heading: "Why the ambition and the outcome differ",
          body: "",
          traceStatus: "qualified",
          statementIds: [
            "funds-practice",
            "funds-limited-control",
            "funds-partial-instantiation",
            "funds-related-ideas-classification",
          ],
          relatedEntityRefs: [
            { kind: "concept", id: "economic-democracy" },
            { kind: "concept", id: "collective-capital-formation" },
          ],
        },
        {
          id: "a-contested-and-reversible-institution",
          heading: "A contested and reversible institution",
          body: "",
          traceStatus: "qualified",
          statementIds: ["funds-abolished", "funds-accountability-assessment"],
          relatedEntityRefs: [
            { kind: "transition", id: "wage-earner-funds-to-liquidation" },
            { kind: "challenge", id: "authority-and-accountability" },
          ],
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "swedish-wage-earner-funds-case-dossier",
      kind: "dossier",
      label: "Swedish wage-earner funds case dossier",
      description:
        "The case spans legislative adoption in 1983 through liquidation in 1992; the five Swedish public boards invested from 1984 through 1991 under statutory ownership and voting caps. The funds created collective holdings but never became controlling owners.",
      subject: { kind: "case", id: "swedish-wage-earner-funds" },
      standfirst: "",
      standfirstStatementIds: [
        "funds-statutory-design",
        "funds-declared-ends",
        "funds-limited-control",
      ],
      sections: [
        {
          id: "what-the-funds-were",
          heading: "What the funds were",
          body: "",
          traceStatus: "supported",
          statementIds: ["funds-statutory-design", "funds-declared-ends"],
          relatedEntityRefs: [
            { kind: "case-episode", id: "enacted-wage-earner-funds-1984-1991" },
          ],
        },
        {
          id: "what-they-were-meant-to-do",
          heading: "What they were meant to do",
          body: "",
          traceStatus: "supported",
          statementIds: ["funds-declared-ends"],
          relatedEntityRefs: [
            { kind: "approach", id: "swedish-wage-earner-fund-program" },
          ],
        },
        {
          id: "what-they-did-in-practice",
          heading: "What they did in practice",
          body: "",
          traceStatus: "supported",
          statementIds: ["funds-practice", "funds-limited-control"],
          relatedEntityRefs: [
            {
              kind: "comparison-dimension",
              id: "collective-wage-earner-shareholding-authority",
            },
          ],
        },
        {
          id: "why-the-case-matters",
          heading: "Why the case matters",
          body: "",
          traceStatus: "qualified",
          statementIds: [
            "funds-distribution-assessment",
            "funds-accountability-assessment",
            "funds-abolished",
          ],
          relatedEntityRefs: [
            { kind: "criterion", id: "distribution" },
            { kind: "criterion", id: "accountability" },
          ],
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "swedish-rehn-meidner-model-dossier",
      kind: "dossier",
      label: "Swedish Rehn–Meidner model dossier",
      description:
        "The Rehn–Meidner model combined solidaristic wage policy, active labor-market policy, and restrictive macroeconomic policy to pursue employment, fair wages, price stability, and growth. Sweden applied that package only partially and inconsistently.",
      subject: { kind: "approach", id: "swedish-rehn-meidner-model" },
      standfirst: "",
      standfirstStatementIds: [
        "rehn-meidner-declared-objectives",
        "rehn-meidner-policy-combination",
        "rehn-meidner-partial-swedish-application",
      ],
      sections: [
        {
          id: "several-goals-at-once",
          heading: "A model built around several goals at once",
          body: "",
          traceStatus: "supported",
          statementIds: ["rehn-meidner-declared-objectives"],
          relatedEntityRefs: [{ kind: "end", id: "equality-with-employment" }],
        },
        {
          id: "how-the-parts-were-meant-to-work",
          heading: "How the parts were meant to work together",
          body: "",
          traceStatus: "supported",
          statementIds: [
            "rehn-meidner-policy-combination",
            "active-labor-market-adjustment-design",
            "restrictive-macroeconomic-policy-design",
          ],
          relatedEntityRefs: [
            { kind: "means", id: "solidaristic-wage-bargaining" },
            { kind: "means", id: "active-labor-market-adjustment" },
            {
              kind: "means",
              id: "restrictive-macroeconomic-demand-management",
            },
          ],
        },
        {
          id: "a-model-not-a-name-for-sweden",
          heading: "A model, not a name for Sweden",
          body: "",
          traceStatus: "qualified",
          statementIds: [
            "rehn-meidner-social-democratic-context",
            "rehn-meidner-partial-swedish-application",
            "swedish-active-labor-market-policy-expansion",
          ],
          relatedEntityRefs: [
            { kind: "case", id: "swedish-solidaristic-bargaining" },
            { kind: "concept", id: "social-democracy" },
          ],
        },
        {
          id: "what-the-bounded-evidence-supports",
          heading: "What the bounded evidence supports",
          body: "",
          traceStatus: "qualified",
          statementIds: [
            "solidaristic-wage-compression-timing",
            "wage-compression-restructuring-qualification",
            "interindustry-compression-productivity-result",
          ],
          relatedEntityRefs: [
            {
              kind: "case-episode",
              id: "centralized-solidaristic-bargaining-1956-1983",
            },
          ],
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "swedish-solidaristic-bargaining-case-dossier",
      kind: "dossier",
      label: "Swedish solidaristic bargaining case dossier",
      description:
        "From 1956 to 1983, Swedish peak organizations coordinated wage bargaining while industry and workplace actors implemented agreements. Wage inequality fell rapidly in the 1970s, but the episode cannot by itself establish wider changes in wealth or control.",
      subject: { kind: "case", id: "swedish-solidaristic-bargaining" },
      standfirst: "",
      standfirstStatementIds: [
        "centralized-solidaristic-bargaining-form",
        "solidaristic-wage-compression-timing",
      ],
      sections: [
        {
          id: "the-institutional-arrangement",
          heading: "The institutional arrangement",
          body: "",
          traceStatus: "supported",
          statementIds: ["centralized-solidaristic-bargaining-form"],
          relatedEntityRefs: [
            { kind: "means", id: "solidaristic-wage-bargaining" },
          ],
        },
        {
          id: "its-place-in-the-model",
          heading: "Its place in the model",
          body: "",
          traceStatus: "qualified",
          statementIds: [
            "rehn-meidner-policy-combination",
            "rehn-meidner-partial-swedish-application",
            "swedish-active-labor-market-policy-expansion",
          ],
          relatedEntityRefs: [
            { kind: "approach", id: "swedish-rehn-meidner-model" },
          ],
        },
        {
          id: "what-changed-and-when",
          heading: "What changed—and when",
          body: "",
          traceStatus: "qualified",
          statementIds: [
            "solidaristic-wage-compression-timing",
            "wage-compression-restructuring-qualification",
          ],
        },
        {
          id: "a-differentiated-productivity-result",
          heading: "A differentiated productivity result",
          body: "",
          traceStatus: "qualified",
          statementIds: [
            "interindustry-compression-productivity-result",
            "rehn-meidner-distribution-assessment",
          ],
          relatedEntityRefs: [{ kind: "criterion", id: "distribution" }],
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "distribution-of-gains-and-ownership-dossier",
      kind: "dossier",
      label: "Distribution of gains and ownership dossier",
      description:
        "Distribution includes wages and income as well as wealth, ownership, control, benefits, and adjustment costs. Evidence of wage compression or collective holdings does not by itself establish equality across those other dimensions.",
      subject: { kind: "challenge", id: "distribution-of-gains-and-ownership" },
      standfirst: "",
      standfirstStatementIds: [
        "rehn-meidner-distribution-assessment",
        "funds-distribution-assessment",
      ],
      sections: [
        {
          id: "several-distributions-not-one",
          heading: "Several distributions, not one",
          body: "",
          traceStatus: "qualified",
          statementIds: [
            "rehn-meidner-distribution-assessment",
            "funds-distribution-assessment",
          ],
          relatedEntityRefs: [{ kind: "criterion", id: "distribution" }],
        },
        {
          id: "a-wage-policy-response",
          heading: "A response through wage policy",
          body: "",
          traceStatus: "qualified",
          statementIds: [
            "rehn-meidner-declared-objectives",
            "solidaristic-wage-compression-timing",
            "rehn-meidner-distribution-assessment",
          ],
          relatedEntityRefs: [
            { kind: "approach", id: "swedish-rehn-meidner-model" },
            { kind: "case", id: "swedish-solidaristic-bargaining" },
          ],
        },
        {
          id: "an-ownership-policy-response",
          heading: "A response through collective ownership",
          body: "",
          traceStatus: "qualified",
          statementIds: [
            "funds-declared-ends",
            "funds-limited-control",
            "funds-distribution-assessment",
          ],
          relatedEntityRefs: [
            { kind: "approach", id: "swedish-wage-earner-fund-program" },
            { kind: "case", id: "swedish-wage-earner-funds" },
          ],
        },
        {
          id: "what-a-comparison-must-preserve",
          heading: "What a comparison must preserve",
          body: "",
          traceStatus: "qualified",
          statementIds: [
            "rehn-meidner-distribution-assessment",
            "funds-distribution-assessment",
            "funds-related-ideas-classification",
          ],
        },
      ],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];

const narrativeFileByDossierId = {
  "swedish-wage-earner-fund-program-dossier":
    "swedish-wage-earner-fund-program.md",
  "swedish-wage-earner-funds-case-dossier": "swedish-wage-earner-funds-case.md",
  "swedish-rehn-meidner-model-dossier": "swedish-rehn-meidner-model.md",
  "swedish-solidaristic-bargaining-case-dossier":
    "swedish-solidaristic-bargaining-case.md",
  "distribution-of-gains-and-ownership-dossier":
    "distribution-of-gains-and-ownership.md",
} as const;

function narrativeFileFor(dossierId: string): string {
  if (dossierId in narrativeFileByDossierId) {
    return narrativeFileByDossierId[
      dossierId as keyof typeof narrativeFileByDossierId
    ];
  }
  throw new Error(`No narrative file registered for Dossier ${dossierId}`);
}

export const dossierDocuments = rawDossierDocuments.map((document) => ({
  ...document,
  entity: attachNarrative(
    narrativeFileFor(document.entity.id),
    document.entity,
  ),
})) satisfies AuthoringDocument[];
