import type { AuthoringDocument, Dossier } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const reviewed = {
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
};
const dossier = (
  id: "authoritarianism" | "fascism" | "totalitarianism",
  standfirstStatementIds: string[],
  sections: Dossier["sections"],
) =>
  attachNarrative(`${id}.md`, {
    id: `${id}-dossier`,
    kind: "dossier" as const,
    label: `${id[0]?.toUpperCase()}${id.slice(1)} dossier`,
    description:
      id === "authoritarianism"
        ? "Authoritarianism can classify a regime by limited pluralism, restricted mobilization, and weak guiding ideology, or identify practices that undermine accountability across regime types. It is not a synonym for autocracy."
        : id === "fascism"
          ? "Griffin defines fascism through revolutionary ultranationalist rebirth, while Paxton defines it through political behavior. Repression, nationalism, or dictatorship alone does not establish the classification."
          : "Totalitarianism can describe an ideal type organized around a monistic power center, an exclusive guiding ideology, and extensive mobilization. Its validity and ideological uses remain disputed, and the label alone establishes none of those features.",
    subject: { kind: "concept" as const, id },
    standfirst: "",
    standfirstStatementIds,
    sections,
    ...reviewed,
  });

const authoritarianism = dossier(
  "authoritarianism",
  [
    "authoritarian-linz-boundary",
    "authoritarian-practice-boundary",
    "authoritarian-autocracy-nonsynonym",
  ],
  [
    {
      id: "definitions",
      heading: "Which definition is being used?",
      body: "",
      traceStatus: "qualified",
      statementIds: [
        "authoritarian-linz-boundary",
        "authoritarian-practice-boundary",
      ],
    },
    {
      id: "neighbors",
      heading: "How do autocracy and dictatorship differ?",
      body: "",
      traceStatus: "qualified",
      statementIds: [
        "autocracy-operational-boundary",
        "dictatorship-varied-institutions",
        "dictatorship-roman-office-boundary",
        "dictatorship-modern-legitimation-boundary",
        "authoritarian-autocracy-nonsynonym",
      ],
      relatedEntityRefs: [
        { kind: "concept", id: "autocracy" },
        { kind: "concept", id: "dictatorship" },
      ],
    },
    {
      id: "totalitarian-boundary",
      heading: "Why is totalitarianism not just stronger authoritarianism?",
      body: "",
      traceStatus: "qualified",
      statementIds: [
        "authoritarian-not-totalitarian",
        "totalitarian-linz-definition",
      ],
      relatedEntityRefs: [{ kind: "concept", id: "totalitarianism" }],
    },
    {
      id: "disputes",
      heading: "What remains disputed?",
      body: "",
      traceStatus: "qualified",
      statementIds: [
        "dictatorship-modern-legitimation-boundary",
        "authoritarian-practice-boundary",
        "authoritarian-autocracy-nonsynonym",
      ],
    },
  ],
);
const fascism = dossier(
  "fascism",
  [
    "fascism-griffin-definition",
    "fascism-paxton-rival",
    "fascism-label-boundary",
  ],
  [
    {
      id: "definitions",
      heading: "What makes a definition specifically fascist?",
      body: "",
      traceStatus: "qualified",
      statementIds: [
        "fascism-griffin-definition",
        "fascism-paxton-rival",
        "fascism-label-boundary",
      ],
    },
    {
      id: "self-description",
      heading: "What did Italian Fascists claim?",
      body: "",
      traceStatus: "qualified",
      statementIds: [
        "fascism-self-description",
        "fascism-rejects-liberal-democracy",
        "fascism-rejects-liberal-individualism",
        "fascism-state-organizes-nation",
        "fascism-self-description-limit",
      ],
      relatedEntityRefs: [
        { kind: "approach", id: "historical-italian-fascism" },
      ],
    },
    {
      id: "bounded-practice",
      heading: "When did movement become dictatorship in Italy?",
      body: "",
      traceStatus: "qualified",
      statementIds: [
        "italy-party-regime-boundary",
        "italy-movement-party-sequence",
        "italy-coalition-government-1922",
        "italy-dictatorship-transition",
      ],
      relatedEntityRefs: [
        { kind: "case", id: "italian-fascist-dictatorship-1925-1943" },
      ],
    },
    {
      id: "variation",
      heading: "Can one definition erase variation?",
      body: "",
      traceStatus: "qualified",
      statementIds: ["fascism-evidence-region-limit", "fascism-label-boundary"],
    },
  ],
);
const totalitarianism = dossier(
  "totalitarianism",
  [
    "totalitarian-linz-definition",
    "totalitarian-contested-category",
    "totalitarian-polemical-boundary",
  ],
  [
    {
      id: "definitions",
      heading: "What does the classic regime type claim?",
      body: "",
      traceStatus: "qualified",
      statementIds: [
        "totalitarian-linz-definition",
        "totalitarian-arendt-boundary",
        "authoritarian-not-totalitarian",
      ],
    },
    {
      id: "disputes",
      heading: "Why do scholars dispute the category?",
      body: "",
      traceStatus: "qualified",
      statementIds: [
        "totalitarian-contested-category",
        "totalitarian-polemical-boundary",
      ],
    },
    {
      id: "label-history",
      heading: "How did the label travel?",
      body: "",
      traceStatus: "qualified",
      statementIds: [
        "totalitarian-label-history",
        "totalitarian-polemical-boundary",
      ],
    },
    {
      id: "bounded-practice",
      heading: "What can the 1933 German case establish?",
      body: "",
      traceStatus: "qualified",
      statementIds: [
        "nazi-one-party-consolidation",
        "nazi-party-state-law",
        "nazi-control-limit",
        "totalitarian-case-nonembodiment",
      ],
      relatedEntityRefs: [{ kind: "case", id: "nazi-consolidation-1933" }],
    },
  ],
);
const historicalItalianFascism = attachNarrative(
  "historical-italian-fascism.md",
  {
    id: "historical-italian-fascism-dossier",
    kind: "dossier" as const,
    label: "Historical Italian Fascism dossier",
    description:
      "The 1932 Fascist doctrine recorded anti-liberal and anti-Marxian claims centered on state and nation, but those claims do not establish how the regime worked. The movement founded in 1919, the later party, and Mussolini’s 1922 coalition government were distinct stages.",
    subject: { kind: "approach" as const, id: "historical-italian-fascism" },
    standfirst: "",
    standfirstStatementIds: [
      "fascism-self-description",
      "fascism-rejects-liberal-democracy",
      "fascism-rejects-liberal-individualism",
      "fascism-state-organizes-nation",
      "italy-party-regime-boundary",
      "italy-movement-party-sequence",
      "italy-coalition-government-1922",
    ],
    sections: [
      {
        id: "doctrine-and-organization",
        heading: "How did doctrine and organization differ?",
        body: "",
        traceStatus: "qualified" as const,
        statementIds: [
          "fascism-self-description",
          "fascism-rejects-liberal-democracy",
          "fascism-rejects-liberal-individualism",
          "fascism-state-organizes-nation",
          "fascism-self-description-limit",
          "italy-party-regime-boundary",
          "italy-movement-party-sequence",
          "italy-coalition-government-1922",
        ],
      },
      {
        id: "bounded-rule",
        heading: "What does the bounded regime case show?",
        body: "",
        traceStatus: "qualified" as const,
        statementIds: [
          "italy-dictatorship-transition",
          "italy-party-regime-boundary",
          "italy-movement-party-sequence",
          "italy-coalition-government-1922",
        ],
        relatedEntityRefs: [
          {
            kind: "case" as const,
            id: "italian-fascist-dictatorship-1925-1943",
          },
        ],
      },
    ],
    ...reviewed,
  },
);
const linzRegimeAnalysis = attachNarrative("linz-regime-analysis.md", {
  id: "linz-regime-analysis-dossier",
  kind: "dossier" as const,
  label: "Linz regime analysis dossier",
  description:
    "Linz distinguishes an authoritarian ideal type marked by limited pluralism and restricted mobilization from a totalitarian type with a monistic power center, exclusive guiding ideology, and extensive mobilization. These are analytical categories, not automatic labels for a country.",
  subject: { kind: "approach" as const, id: "linz-regime-analysis" },
  standfirst: "",
  standfirstStatementIds: [
    "authoritarian-linz-boundary",
    "totalitarian-linz-definition",
  ],
  sections: [
    {
      id: "authoritarian-type",
      heading: "What defines the authoritarian ideal type?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["authoritarian-linz-boundary"],
    },
    {
      id: "totalitarian-type",
      heading: "How does the totalitarian ideal type differ?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "totalitarian-linz-definition",
        "authoritarian-not-totalitarian",
      ],
    },
  ],
  ...reviewed,
});

type Guide = Extract<AuthoringDocument, { documentType: "subject-guide" }>;
const guide = (
  id: "authoritarianism" | "fascism" | "totalitarianism",
  sections: Guide["guide"]["sections"],
): Guide => ({
  documentType: "subject-guide",
  guide: {
    id: `guide-${id}`,
    slug: id,
    label: id.charAt(0).toUpperCase() + id.slice(1),
    description:
      id === "authoritarianism"
        ? "Authoritarianism can classify political regimes or identify practices that undermine accountability across regime types. Those uses overlap without making authoritarianism, autocracy, and dictatorship synonyms."
        : id === "fascism"
          ? "Fascism names a disputed revolutionary ultranationalist ideology and historically connected political behavior, not every repressive or nationalist government. Rival definitions and the bounded Italian evidence separate doctrine, organization, seizure of power, and rule."
          : "Totalitarianism is a contested category for rule organized around a monistic power center, an exclusive ideology, and extensive mobilization. Its Cold War history and polemical use mean that applying the label does not prove that a regime achieved total control.",
    publicationStatus: "reviewed",
    primarySubject: { kind: "concept", id },
    searchQueries: [
      { query: id },
      { query: `${id} definition` },
      { query: `${id} meaning` },
    ],
    sections,
    reviewedAt: "2026-09-06",
  },
});
const guideSections = (id: string): Guide["guide"]["sections"] => [
  {
    id: "short-answer",
    role: "short-answer",
    heading: "What is the short answer?",
    narrativeRefs: [{ dossierId: `${id}-dossier` }],
  },
  {
    id: "meanings-and-boundaries",
    role: "meanings-and-boundaries",
    heading: "Which meanings must stay separate?",
    narrativeRefs: [{ dossierId: `${id}-dossier`, sectionId: "definitions" }],
  },
  ...(id === "authoritarianism"
    ? []
    : [
        {
          id: "bounded-practice",
          role: "bounded-practice" as const,
          heading: "What can bounded evidence establish?",
          narrativeRefs: [
            { dossierId: `${id}-dossier`, sectionId: "bounded-practice" },
          ],
          entityRefs:
            id === "totalitarianism"
              ? [{ kind: "case" as const, id: "nazi-consolidation-1933" }]
              : [
                  {
                    kind: "case" as const,
                    id: "italian-fascist-dictatorship-1925-1943",
                  },
                ],
        },
      ]),
  {
    id: "variants-disputes-and-limits",
    role: "variants-and-disputes",
    heading: "What remains disputed?",
    narrativeRefs: [
      {
        dossierId: `${id}-dossier`,
        sectionId: id === "fascism" ? "variation" : "disputes",
      },
    ],
  },
  {
    id: "comparisons-and-next-steps",
    role: "comparisons-and-next-steps",
    heading: "Which neighboring terms should you compare?",
    entityRefs:
      id === "authoritarianism"
        ? [
            { kind: "concept", id: "autocracy" },
            { kind: "concept", id: "dictatorship" },
            { kind: "concept", id: "totalitarianism" },
          ]
        : id === "fascism"
          ? [
              { kind: "concept", id: "authoritarianism" },
              { kind: "concept", id: "totalitarianism" },
            ]
          : [
              { kind: "concept", id: "authoritarianism" },
              { kind: "concept", id: "fascism" },
            ],
  },
  {
    id: "open-questions",
    role: "open-questions",
    heading: "What remains open?",
    researchObligationIds: [
      id === "authoritarianism"
        ? "authoritarian-practice-regime-transfer"
        : id === "fascism"
          ? "fascism-crossregional-boundary"
          : "totalitarian-control-evidence",
    ],
  },
];

export const authoritarianismFascismTotalitarianismGuideDocuments: AuthoringDocument[] =
  [
    { documentType: "entity", entity: authoritarianism },
    { documentType: "entity", entity: fascism },
    { documentType: "entity", entity: totalitarianism },
    { documentType: "entity", entity: historicalItalianFascism },
    { documentType: "entity", entity: linzRegimeAnalysis },
    guide("authoritarianism", guideSections("authoritarianism")),
    guide("fascism", guideSections("fascism")),
    guide("totalitarianism", guideSections("totalitarianism")),
  ];
