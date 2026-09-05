import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const socialDemocracy = attachNarrative("social-democracy.md", {
  id: "social-democracy-dossier",
  kind: "dossier" as const,
  label: "Social democracy dossier",
  description:
    "A concise orientation to social democracy's historical formation, common reform institutions, contested endpoint, and bounded Swedish examples.",
  subject: { kind: "concept" as const, id: "social-democracy" },
  standfirst: "",
  standfirstStatementIds: ["social-democracy-contested-definition"],
  sections: [
    {
      id: "where-the-tradition-came-from",
      heading: "Where did the tradition come from?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: [
        "social-democracy-democratic-revision",
        "social-democracy-genealogy-contested",
      ],
    },
    {
      id: "what-it-often-does",
      heading: "What does it often do in practice?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["social-democracy-welfare-state-form"],
    },
    {
      id: "where-its-boundary-is-contested",
      heading: "Where is its boundary contested?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["social-democracy-contested-capitalism-boundary"],
    },
    {
      id: "how-the-swedish-material-fits",
      heading: "How does the Swedish material fit?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "rehn-meidner-social-democratic-context",
        "funds-partial-instantiation",
      ],
      relatedEntityRefs: [
        { kind: "approach" as const, id: "swedish-rehn-meidner-model" },
        { kind: "approach" as const, id: "swedish-wage-earner-fund-program" },
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-05",
});

const economicDemocracy = attachNarrative("economic-democracy.md", {
  id: "economic-democracy-dossier",
  kind: "dossier" as const,
  label: "Economic democracy dossier",
  description:
    "A concise orientation to economic democracy's contested scope, institutional families, control boundary, evidence limits, and bounded Swedish example.",
  subject: { kind: "concept" as const, id: "economic-democracy" },
  standfirst: "",
  standfirstStatementIds: [
    "economic-democracy-contested-scope",
    "economic-democracy-ownership-is-not-control",
    "economic-democracy-design-and-evidence-limits",
  ],
  sections: [
    {
      id: "what-question-does-it-ask",
      heading: "What question does it ask?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: ["economic-democracy-contested-scope"],
    },
    {
      id: "does-it-prescribe-one-model",
      heading: "Does it prescribe one model?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "economic-democracy-workplace-institutions",
        "economic-democracy-economy-wide-institutions",
        "adamson-representative-firm-governance",
      ],
    },
    {
      id: "why-are-ownership-and-control-separate",
      heading: "Why are ownership and control separate?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: ["economic-democracy-ownership-is-not-control"],
    },
    {
      id: "what-can-democratic-designs-fail-to-achieve",
      heading: "What can democratic designs fail to achieve?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "economic-democracy-beyond-workplace",
        "economic-democracy-design-and-evidence-limits",
        "economic-democracy-property-rights-objection-statement",
        "economic-democracy-decision-cost-objection-statement",
        "economic-democracy-futility-objection-statement",
      ],
    },
    {
      id: "how-do-the-swedish-funds-fit",
      heading: "How do the Swedish funds fit?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "funds-declared-ends",
        "funds-related-ideas-classification",
        "funds-limited-control",
      ],
      relatedEntityRefs: [
        { kind: "approach" as const, id: "swedish-wage-earner-fund-program" },
        { kind: "case" as const, id: "swedish-wage-earner-funds" },
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-05",
});

const socialOwnership = attachNarrative("social-ownership.md", {
  id: "social-ownership-dossier",
  kind: "dossier" as const,
  label: "Social ownership dossier",
  description:
    "A concise orientation to social ownership's distinct legal, beneficial, control, and return dimensions, neighboring concepts, and bounded Swedish examples.",
  subject: { kind: "concept" as const, id: "social-ownership" },
  standfirst: "",
  standfirstStatementIds: [
    "social-ownership-four-questions",
    "social-ownership-control-boundary",
  ],
  sections: [
    {
      id: "what-does-social-ownership-claim",
      heading: "What does social ownership claim?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "social-ownership-four-questions",
        "social-ownership-public-title-boundary",
      ],
    },
    {
      id: "which-rights-must-be-separated",
      heading: "Which rights must be separated?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: [
        "social-ownership-title-benefit-boundary",
        "social-ownership-rights-are-divisible",
        "social-ownership-control-boundary",
        "social-ownership-returns-boundary",
      ],
      relatedEntityRefs: [
        { kind: "challenge" as const, id: "authority-and-accountability" },
        { kind: "criterion" as const, id: "accountability" },
      ],
    },
    {
      id: "how-do-neighboring-concepts-differ",
      heading: "How do neighboring concepts differ?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "social-ownership-economic-democracy-relationship",
        "social-ownership-market-socialism-relationship",
      ],
      relatedEntityRefs: [
        { kind: "concept" as const, id: "economic-democracy" },
        { kind: "concept" as const, id: "market-socialism" },
      ],
    },
    {
      id: "what-do-the-swedish-cases-show",
      heading: "What do the Swedish cases show?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "rehn-meidner-social-ownership-boundary",
        "funds-related-ideas-classification",
        "funds-statutory-design",
        "funds-limited-control",
      ],
      relatedEntityRefs: [
        { kind: "approach" as const, id: "swedish-rehn-meidner-model" },
        { kind: "case" as const, id: "swedish-solidaristic-bargaining" },
        { kind: "approach" as const, id: "swedish-wage-earner-fund-program" },
        { kind: "case" as const, id: "swedish-wage-earner-funds" },
        { kind: "means" as const, id: "regional-wage-earner-fund-boards" },
        { kind: "challenge" as const, id: "distribution-of-gains-and-ownership" },
        { kind: "criterion" as const, id: "distribution" },
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-05",
});

export const foundationalConceptDossierDocuments = [
  { documentType: "entity", entity: socialDemocracy },
  { documentType: "entity", entity: economicDemocracy },
  { documentType: "entity", entity: socialOwnership },
] satisfies AuthoringDocument[];
