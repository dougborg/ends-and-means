import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const capitalismDossier = attachNarrative("capitalism.md", {
  id: "capitalism-dossier",
  kind: "dossier" as const,
  label: "Capitalism dossier",
  description:
    "Definitions, institutions, historical variation, and limits of capitalism as an analytical concept.",
  subject: { kind: "concept" as const, id: "capitalism" },
  standfirst: "",
  standfirstStatementIds: [
    "capitalism-definition-contested",
    "capitalism-market-boundary",
    "capitalism-institutional-definition",
  ],
  sections: [
    {
      id: "what-defines-capitalism",
      heading: "What defines capitalism?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "capitalism-definition-contested",
        "capitalism-institutional-definition",
        "capitalism-marx-definition",
        "capitalism-polanyi-definition",
        "capitalism-market-boundary",
        "wage-labor-boundary",
      ],
    },
    {
      id: "which-institutions-work-together",
      heading: "Which institutions work together?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "property-possession-boundary",
        "property-rights-plural",
        "wage-labor-boundary",
        "commodity-production-boundary",
        "firm-market-boundary",
        "capital-finance-boundary",
        "market-state-boundary",
      ],
    },
    {
      id: "why-markets-are-not-enough",
      heading: "Why are markets not enough to define it?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "capitalism-market-boundary",
        "market-ownership-boundary",
        "wage-labor-history-limit",
        "commodity-production-boundary",
      ],
    },
    {
      id: "what-do-bounded-cases-show",
      heading: "What do three bounded cases show?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "england-brenner-class-thesis",
        "england-brenner-rival-explanations",
        "ghana-cocoa-smallholder-expansion",
        "ghana-cocoa-classification-limit",
        "china-dual-track-coordination",
        "china-tve-ownership-boundary",
        "china-marketization-classification-limit",
      ],
      relatedEntityRefs: [
        { kind: "case" as const, id: "english-agrarian-market-dependence" },
        { kind: "case" as const, id: "gold-coast-cocoa-expansion" },
        { kind: "case" as const, id: "china-dual-track-market-reforms" },
      ],
    },
    {
      id: "what-remains-disputed",
      heading: "What remains disputed?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "capitalism-definition-contested",
        "capitalism-marx-definition",
        "capitalism-polanyi-definition",
        "england-brenner-rival-explanations",
        "china-marketization-classification-limit",
      ],
    },
    {
      id: "how-to-compare-capitalism",
      heading: "How should capitalist institutions be compared?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "property-rights-plural",
        "wage-labor-boundary",
        "firm-market-boundary",
        "capital-finance-boundary",
        "market-laissez-faire-boundary",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});

const marketEconomyDossier = attachNarrative("market-economy.md", {
  id: "market-economy-dossier",
  kind: "dossier" as const,
  label: "Market economy dossier",
  description:
    "Market exchange, its institutional supports, alternative ownership forms, and its limits as a system label.",
  subject: { kind: "concept" as const, id: "market-economy" },
  standfirst: "",
  standfirstStatementIds: [
    "market-definition-exchange",
    "market-economy-plural-allocation",
    "market-ownership-boundary",
    "market-state-boundary",
  ],
  sections: [
    {
      id: "what-is-a-market-economy",
      heading: "What is a market economy?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "market-definition-exchange",
        "market-economy-plural-allocation",
        "market-ownership-boundary",
        "market-laissez-faire-boundary",
      ],
    },
    {
      id: "what-makes-markets-work",
      heading: "What makes markets work?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "market-state-boundary",
        "property-possession-boundary",
        "property-rights-plural",
        "firm-market-boundary",
        "smith-exchange-division-labor",
      ],
    },
    {
      id: "how-markets-differ-from-capitalism",
      heading: "How do markets differ from capitalism?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "capitalism-market-boundary",
        "market-ownership-boundary",
        "commodity-production-boundary",
        "wage-labor-history-limit",
        "capitalism-institutional-definition",
      ],
    },
    {
      id: "what-do-bounded-cases-show",
      heading: "What do three bounded cases show?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "england-brenner-class-thesis",
        "england-brenner-rival-explanations",
        "ghana-cocoa-smallholder-expansion",
        "ghana-cocoa-resource-reallocation",
        "ghana-cocoa-classification-limit",
        "china-dual-track-coordination",
        "china-tve-ownership-boundary",
        "china-marketization-classification-limit",
      ],
      relatedEntityRefs: [
        { kind: "case" as const, id: "english-agrarian-market-dependence" },
        { kind: "case" as const, id: "gold-coast-cocoa-expansion" },
        { kind: "case" as const, id: "china-dual-track-market-reforms" },
      ],
    },
    {
      id: "what-market-labels-leave-open",
      heading: "What does the label leave open?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "market-economy-plural-allocation",
        "market-ownership-boundary",
        "market-laissez-faire-boundary",
        "capital-finance-boundary",
      ],
    },
    {
      id: "how-to-compare-market-economies",
      heading: "How should market economies be compared?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "property-rights-plural",
        "wage-labor-boundary",
        "firm-market-boundary",
        "market-state-boundary",
        "china-marketization-classification-limit",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});

type SubjectGuideDocument = Extract<
  AuthoringDocument,
  { documentType: "subject-guide" }
>;

const guide = (
  id: "capitalism" | "market-economy",
  sections: SubjectGuideDocument["guide"]["sections"],
): SubjectGuideDocument => ({
  documentType: "subject-guide",
  guide: {
    id: `guide-${id}`,
    slug: id,
    label: id === "capitalism" ? "Capitalism" : "Market Economy",
    description:
      id === "capitalism"
        ? "Capitalism has rival definitions that assign different weight to employment, firms, finance, production for exchange, and legal property. Markets existed before modern capitalism, so exchange alone does not establish that classification."
        : "A market economy relies substantially on price-mediated exchange, but it also includes firms, households, law, public authority, and non-market allocation. Market exchange neither requires private ownership nor proves laissez-faire policy or capitalism.",
    publicationStatus: "reviewed",
    primarySubject: { kind: "concept", id },
    searchQueries:
      id === "capitalism"
        ? [
            { query: "capitalism" },
            { query: "what is capitalism" },
            { query: "capitalist economy" },
          ]
        : [
            { query: "market economy" },
            { query: "what is a market economy" },
            {
              query: "free market economy",
              disambiguation:
                "A market economy can be extensively regulated and is not synonymous with laissez-faire.",
            },
          ],
    sections,
    reviewedAt: "2026-09-06",
  },
});

const sections = (
  id: "capitalism" | "market-economy",
  dossierId: string,
  obligations: string[],
): SubjectGuideDocument["guide"]["sections"] => [
  {
    id: "short-answer",
    role: "short-answer",
    heading:
      id === "capitalism" ? "What is capitalism?" : "What is a market economy?",
    narrativeRefs: [{ dossierId }],
  },
  {
    id: "meanings-and-boundaries",
    role: "meanings-and-boundaries",
    heading:
      id === "capitalism"
        ? "Which definitions compete?"
        : "Which boundaries matter?",
    narrativeRefs: [
      {
        dossierId,
        sectionId:
          id === "capitalism"
            ? "what-defines-capitalism"
            : "what-is-a-market-economy",
      },
    ],
  },
  {
    id: "institutions-and-mechanisms",
    role: "institutions-and-mechanisms",
    heading:
      id === "capitalism"
        ? "Which institutions work together?"
        : "What makes markets work?",
    narrativeRefs: [
      {
        dossierId,
        sectionId:
          id === "capitalism"
            ? "which-institutions-work-together"
            : "what-makes-markets-work",
      },
    ],
  },
  {
    id: "bounded-practice",
    role: "bounded-practice",
    heading: "What do three bounded cases show?",
    narrativeRefs: [{ dossierId, sectionId: "what-do-bounded-cases-show" }],
    entityRefs: [
      { kind: "case", id: "english-agrarian-market-dependence" },
      { kind: "case", id: "gold-coast-cocoa-expansion" },
      { kind: "case", id: "china-dual-track-market-reforms" },
    ],
  },
  {
    id: "variants-disputes-and-limits",
    role: "variants-and-disputes",
    heading:
      id === "capitalism"
        ? "What remains disputed?"
        : "What does the label leave open?",
    narrativeRefs: [
      {
        dossierId,
        sectionId:
          id === "capitalism"
            ? "what-remains-disputed"
            : "what-market-labels-leave-open",
      },
    ],
  },
  {
    id: "comparisons-and-next-steps",
    role: "comparisons-and-next-steps",
    heading:
      id === "capitalism"
        ? "Why are capitalism and markets not synonyms?"
        : "How do markets differ from capitalism?",
    narrativeRefs: [
      {
        dossierId,
        sectionId:
          id === "capitalism"
            ? "why-markets-are-not-enough"
            : "how-markets-differ-from-capitalism",
      },
      {
        dossierId,
        sectionId:
          id === "capitalism"
            ? "how-to-compare-capitalism"
            : "how-to-compare-market-economies",
      },
    ],
    entityRefs: [
      {
        kind: "concept",
        id: id === "capitalism" ? "market-economy" : "capitalism",
      },
    ],
  },
  {
    id: "open-questions",
    role: "open-questions",
    heading: "What remains unresolved?",
    researchObligationIds: obligations,
  },
];

export const capitalismMarketGuideDocuments = [
  { documentType: "entity", entity: capitalismDossier },
  { documentType: "entity", entity: marketEconomyDossier },
  guide(
    "capitalism",
    sections("capitalism", "capitalism-dossier", [
      "capitalism-coerced-labor-boundary",
      "capitalism-household-reproduction-boundary",
    ]),
  ),
  guide(
    "market-economy",
    sections("market-economy", "market-economy-dossier", [
      "china-tve-effective-control",
      "gold-coast-cocoa-labor-distribution",
    ]),
  ),
] satisfies AuthoringDocument[];
