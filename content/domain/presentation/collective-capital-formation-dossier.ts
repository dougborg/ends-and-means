import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const dossier = attachNarrative("collective-capital-formation.md", {
  id: "collective-capital-formation-dossier",
  kind: "dossier" as const,
  label: "Collective capital formation dossier",
  description:
    "A concise guide to collective accumulation, its national-accounts and individual-saving boundaries, institutional choices, and bounded Swedish example.",
  subject: { kind: "concept" as const, id: "collective-capital-formation" },
  standfirst: "",
  standfirstStatementIds: [
    "collective-capital-formation-working-definition",
    "collective-capital-formation-national-accounts-boundary",
    "collective-capital-formation-statistical-governance-boundary",
    "collective-capital-formation-rights-boundary",
  ],
  sections: [
    {
      id: "what-does-collective-mean-here",
      heading: "What does collective mean here?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "collective-capital-formation-working-definition",
        "collective-capital-formation-individual-saving-boundary",
        "collective-capital-formation-governing-constituency",
        "collective-capital-formation-rights-boundary",
      ],
    },
    {
      id: "how-is-this-different-from-investment-statistics",
      heading: "How is this different from investment statistics?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: [
        "collective-capital-formation-national-accounts-boundary",
        "collective-capital-formation-statistical-governance-boundary",
        "collective-capital-formation-working-definition",
      ],
    },
    {
      id: "what-design-choices-matter",
      heading: "What design choices matter?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "meidner-profit-share-contribution-proposal",
        "meidner-profit-share-rate-suggestion",
        "meidner-central-fund-destination-proposal",
        "meidner-share-payment-instrument-proposal",
        "meidner-union-board-election-proposal",
        "meidner-shareholder-vote-allocation-proposal",
        "swedish-1981-funds-cash-financing",
        "collective-capital-formation-financing-governance-boundary",
        "collective-capital-formation-governing-constituency",
        "collective-capital-formation-individual-saving-boundary",
        "collective-capital-formation-rights-boundary",
      ],
      relatedEntityRefs: [
        { kind: "concept" as const, id: "social-ownership" },
        { kind: "concept" as const, id: "economic-democracy" },
      ],
    },
    {
      id: "what-does-the-swedish-case-show",
      heading: "What does the Swedish case show?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "funds-statutory-design",
        "funds-abolished",
        "collective-capital-formation-swedish-case-classification",
      ],
      relatedEntityRefs: [
        { kind: "approach" as const, id: "swedish-wage-earner-fund-program" },
        { kind: "case" as const, id: "swedish-wage-earner-funds" },
      ],
    },
    {
      id: "why-can-collective-funds-lose-support",
      heading: "Why can collective funds lose support?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "collective-capital-formation-supporter-distance",
        "collective-capital-formation-unclear-benefits-objection",
        "collective-capital-formation-purpose-objection",
        "collective-capital-formation-individual-saving-boundary",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-05",
});

export const collectiveCapitalFormationDossierDocuments = [
  { documentType: "entity", entity: dossier },
] satisfies AuthoringDocument[];
