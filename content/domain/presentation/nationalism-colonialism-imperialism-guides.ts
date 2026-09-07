import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const reviewedAt = "2026-09-06";
const dossier = (
  id: "nationalism" | "colonialism" | "imperialism",
  description: string,
  standfirstStatementIds: string[],
  sections: {
    id: string;
    heading: string;
    statementIds: string[];
    relatedEntityRefs?: { kind: "case"; id: string }[];
  }[],
) => ({
  documentType: "entity" as const,
  entity: attachNarrative(`${id}.md`, {
    id: `${id}-dossier`,
    kind: "dossier" as const,
    label: `${id[0]?.toUpperCase()}${id.slice(1)} dossier`,
    description,
    subject: { kind: "concept" as const, id },
    standfirst: "",
    standfirstStatementIds,
    sections: sections.map((section) => ({
      ...section,
      body: "",
      traceStatus: "qualified" as const,
    })),
    publicationStatus: "reviewed" as const,
    reviewedAt,
  }),
});

const nationalism = dossier(
  "nationalism",
  "Nationalism can name attachments, programs, or movements concerning nations and self-determination; nation and state remain distinct, and asserted unity cannot establish inclusion or practice.",
  [
    "nationalism-attitude-program-boundary",
    "nation-state-boundary",
    "nationalism-self-description-limit",
  ],
  [
    {
      id: "meanings",
      heading: "Which meanings must stay separate?",
      statementIds: [
        "nationalism-attitude-program-boundary",
        "nation-state-boundary",
        "anderson-imagined-community",
        "chatterjee-derivative-dispute",
        "tagore-nation-society-rival",
      ],
    },
    {
      id: "statuses",
      heading: "Must self-determination mean statehood?",
      statementIds: ["self-determination-statehood-boundary"],
    },
    {
      id: "boundaries",
      heading: "Who belongs to the asserted nation?",
      statementIds: [
        "anderson-horizontal-inequality",
        "chatterjee-state-unity-limit",
        "nationalism-self-description-limit",
        "national-unity-exclusion-boundary",
      ],
    },
    {
      id: "bounded-practice",
      heading: "What do Hawaiʻi, Bandung, and Ghana show?",
      statementIds: [
        "hawaii-petition-scale",
        "hawaii-annexation-sequence",
        "bandung-participation",
        "bandung-anticolonial-principles",
        "ghana-legal-independence",
        "ghana-worldmaking-project",
        "decolonization-sequence-limit",
      ],
      relatedEntityRefs: [
        { kind: "case", id: "hawaiian-overthrow-annexation-1893-1898" },
        { kind: "case", id: "bandung-conference-1955" },
        {
          kind: "case",
          id: "ghana-independence-1957",
        },
      ],
    },
    {
      id: "comparisons",
      heading: "What should comparison keep separate?",
      statementIds: [
        "nationalism-attitude-program-boundary",
        "self-determination-statehood-boundary",
        "nationalism-self-description-limit",
      ],
    },
  ],
);
const colonialism = dossier(
  "colonialism",
  "Colonialism concerns subjugation rather than one universal stage; settlement, indirect command, political concepts, and community political language require separate evidence.",
  [
    "colonialism-domination-definition",
    "colonial-arrangements-plural",
    "colonial-modernization-boundary",
  ],
  [
    {
      id: "meanings",
      heading: "How do colonialism and colonization differ?",
      statementIds: [
        "colonialism-domination-definition",
        "colonization-colonialism-boundary",
        "cesaire-colonization-civilization-rival",
        "cooper-category-boundary",
      ],
    },
    {
      id: "arrangements",
      heading: "Which arrangements changed land, labor, and rule?",
      statementIds: [
        "colonial-arrangements-plural",
        "colonial-formal-practice-boundary",
        "colonial-archive-mediation",
      ],
    },
    {
      id: "decolonization",
      heading: "Does independence end colonial institutions?",
      statementIds: [
        "decolonization-independence-boundary",
        "ghana-neocolonial-limit",
      ],
    },
    {
      id: "boundaries",
      heading: "Whose names and evidence define the boundary?",
      statementIds: [
        "kaulia-lahui-annexation-refusal",
        "silva-continuing-sovereignty-claim",
        "hawaii-petition-language-provenance",
        "colonial-modernization-boundary",
      ],
    },
    {
      id: "bounded-practice",
      heading: "What can bounded transitions establish?",
      statementIds: [
        "hawaii-case-boundary",
        "ghana-legal-independence",
        "ghana-neocolonial-limit",
        "decolonization-sequence-limit",
        "tawantinsuyu-non-embodiment",
      ],
      relatedEntityRefs: [
        { kind: "case", id: "hawaiian-overthrow-annexation-1893-1898" },
        {
          kind: "case",
          id: "ghana-independence-1957",
        },
        { kind: "case", id: "tawantinsuyu-imperial-organization" },
      ],
    },
    {
      id: "comparisons",
      heading: "How should colonial institutions be compared?",
      statementIds: [
        "colonial-formal-practice-boundary",
        "colonial-archive-mediation",
        "decolonization-independence-boundary",
      ],
    },
  ],
);
const imperialism = dossier(
  "imperialism",
  "Imperialism can name extended-power practices or theories, not every empire or unequal relationship; formal status and attributed mechanisms remain separate.",
  [
    "imperialism-power-extension-definition",
    "empire-imperialism-boundary",
    "imperial-allegation-proof-boundary",
  ],
  [
    {
      id: "meanings",
      heading: "How does imperialism differ from empire?",
      statementIds: [
        "imperialism-power-extension-definition",
        "empire-imperialism-boundary",
        "sep-indirect-imperial-boundary",
        "nkrumah-neocolonial-definition",
      ],
    },
    {
      id: "mechanisms",
      heading: "How can power extend beyond formal sovereignty?",
      statementIds: [
        "imperial-mechanisms-plural",
        "formal-informal-empire-boundary",
        "imperial-allegation-proof-boundary",
      ],
    },
    {
      id: "theories",
      heading: "Which explanations compete?",
      statementIds: [
        "capitalist-imperialism-rival-boundary",
        "imperial-cultural-project-boundary",
        "nkrumah-neocolonial-definition",
      ],
    },
    {
      id: "bounded-practice",
      heading: "What do annexation and anticolonial worldmaking show?",
      statementIds: [
        "hawaii-annexation-sequence",
        "bandung-anticolonial-principles",
        "bandung-worldmaking-boundary",
        "ghana-neocolonial-limit",
      ],
      relatedEntityRefs: [
        { kind: "case", id: "hawaiian-overthrow-annexation-1893-1898" },
        { kind: "case", id: "bandung-conference-1955" },
        {
          kind: "case",
          id: "ghana-independence-1957",
        },
      ],
    },
    {
      id: "comparisons",
      heading: "What evidence would establish imperial practice?",
      statementIds: [
        "empire-imperialism-boundary",
        "imperial-allegation-proof-boundary",
        "imperial-country-essence-boundary",
      ],
    },
  ],
);

type Guide = Extract<AuthoringDocument, { documentType: "subject-guide" }>;
const guide = (
  id: "nationalism" | "colonialism" | "imperialism",
  description: string,
  cases: string[],
  obligations: string[],
  adjacent: { kind: "concept"; id: string }[],
): Guide => ({
  documentType: "subject-guide",
  guide: {
    id: `guide-${id}`,
    slug: id,
    label: `${id[0]?.toUpperCase()}${id.slice(1)}`,
    description,
    publicationStatus: "reviewed",
    primarySubject: { kind: "concept", id },
    searchQueries: [
      { query: id },
      { query: `what is ${id}` },
      ...(id === "colonialism" ? [{ query: "colonization" }] : []),
      ...(id === "imperialism" ? [{ query: "empire versus imperialism" }] : []),
    ],
    sections: [
      {
        id: "short-answer",
        role: "short-answer",
        heading: `What does ${id} mean?`,
        narrativeRefs: [{ dossierId: `${id}-dossier` }],
      },
      {
        id: "meanings-and-boundaries",
        role: "meanings-and-boundaries",
        heading: "Which meanings and boundaries matter?",
        narrativeRefs: [
          { dossierId: `${id}-dossier`, sectionId: "meanings" },
          ...(id === "nationalism" || id === "colonialism"
            ? [{ dossierId: `${id}-dossier`, sectionId: "boundaries" }]
            : []),
        ],
      },
      {
        id: "institutions-and-mechanisms",
        role: "institutions-and-mechanisms",
        heading: "Which institutions and mechanisms matter?",
        narrativeRefs: [
          {
            dossierId: `${id}-dossier`,
            sectionId:
              id === "nationalism"
                ? "statuses"
                : id === "colonialism"
                  ? "arrangements"
                  : "mechanisms",
          },
        ],
      },
      {
        id: "bounded-practice",
        role: "bounded-practice",
        heading: "What do bounded episodes show?",
        narrativeRefs: [
          { dossierId: `${id}-dossier`, sectionId: "bounded-practice" },
        ],
        entityRefs: cases.map((caseId) => ({
          kind: "case" as const,
          id: caseId,
        })),
      },
      {
        id: "variants-disputes-and-limits",
        role: "variants-and-disputes",
        heading: "Where do serious disputes remain?",
        ...(id === "imperialism"
          ? {
              narrativeRefs: [
                { dossierId: `${id}-dossier`, sectionId: "theories" },
              ],
            }
          : {}),
        researchObligationIds: obligations,
      },
      {
        id: "comparisons-and-next-steps",
        role: "comparisons-and-next-steps",
        heading: "What should be compared next?",
        narrativeRefs: [
          { dossierId: `${id}-dossier`, sectionId: "comparisons" },
        ],
        entityRefs: adjacent,
      },
      {
        id: "open-questions",
        role: "open-questions",
        heading: "What remains unsettled?",
        researchObligationIds: obligations,
      },
    ],
    reviewedAt,
  },
});

export const nationalismColonialismImperialismGuideDocuments = [
  nationalism,
  colonialism,
  imperialism,
  guide(
    "nationalism",
    "Nationalism can name attachments, programs, and movements concerning nations and self-determination; it neither equates nation with state nor proves inclusion or practice.",
    [
      "hawaiian-overthrow-annexation-1893-1898",
      "bandung-conference-1955",
      "ghana-independence-1957",
    ],
    ["nationalism-translation-people-nation", "nationalism-unity-exclusion"],
    [
      { kind: "concept", id: "colonialism" },
      { kind: "concept", id: "imperialism" },
      { kind: "concept", id: "indigenous-autonomy" },
    ],
  ),
  guide(
    "colonialism",
    "Colonialism concerns durable domination through specific institutions; conquest, settlement, extraction, administration, and independence must be evidenced rather than treated as one stage.",
    [
      "hawaiian-overthrow-annexation-1893-1898",
      "ghana-independence-1957",
      "tawantinsuyu-imperial-organization",
    ],
    [
      "colonialism-independence-institutional-persistence",
      "colonialism-settler-indigenous-scope",
    ],
    [
      { kind: "concept", id: "imperialism" },
      { kind: "concept", id: "nationalism" },
      { kind: "concept", id: "liberalism" },
    ],
  ),
  guide(
    "imperialism",
    "Imperialism can name extended-power practices or rival theories, not every empire, inequality, or allegation; mechanism, scope, and practice require separate evidence.",
    [
      "hawaiian-overthrow-annexation-1893-1898",
      "bandung-conference-1955",
      "ghana-independence-1957",
    ],
    [
      "imperialism-informal-falsifiability",
      "imperialism-capital-geopolitics-counterfactual",
    ],
    [
      { kind: "concept", id: "colonialism" },
      { kind: "concept", id: "nationalism" },
      { kind: "concept", id: "capitalism" },
    ],
  ),
] satisfies AuthoringDocument[];
