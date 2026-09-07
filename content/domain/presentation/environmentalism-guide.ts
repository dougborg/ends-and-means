import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const dossier = attachNarrative("environmentalism.md", {
  id: "environmentalism-dossier",
  kind: "dossier" as const,
  label: "Environmentalism dossier",
  description:
    "Environmentalism names contested ethical commitments, movements, and political projects; it differs from environmental science, does not supply one policy program, and must not absorb Indigenous governance into an external category.",
  subject: { kind: "concept" as const, id: "environmentalism" },
  standfirst: "",
  standfirstStatementIds: [
    "environmentalism-contested-family",
    "environmentalism-science-boundary",
    "indigenous-relations-boundary",
  ],
  sections: [
    {
      id: "meanings",
      heading: "What does environmentalism name?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "environmentalism-contested-family",
        "environmentalism-global-history-plural",
        "environmentalism-poor-attributed-classification",
      ],
    },
    {
      id: "boundaries",
      heading: "Which neighboring ideas remain distinct?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "environmentalism-science-boundary",
        "environmentalism-conservation-boundary",
        "environmentalism-sustainability-boundary",
        "environmentalism-climate-boundary",
        "environmentalism-party-policy-boundary",
        "nuclear-environmental-policy-boundary",
      ],
    },
    {
      id: "justice",
      heading: "What changes when justice is part of the question?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "environmentalism-conservation-boundary",
        "environmental-justice-three-dimensions",
        "colonial-conservation-displacement",
        "indigenous-relations-boundary",
      ],
    },
    {
      id: "chipko",
      heading: "Why do interpretations of Chipko differ?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "chipko-commercial-forestry-conflict",
        "chipko-organized-tree-protection",
        "chipko-women-participation",
        "chipko-ecofeminist-rival",
        "chipko-state-community-rival",
        "chipko-local-archive-provenance",
        "chipko-case-boundary",
      ],
      relatedEntityRefs: [
        { kind: "case" as const, id: "chipko-garhwal-1973-1981" },
      ],
    },
    {
      id: "warren-county",
      heading: "How did environmental justice change the frame?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "warren-county-landfill-siting",
        "warren-county-protest",
        "warren-county-landfill-built",
        "gao-siting-pattern",
        "ucc-national-race-finding",
        "ej-summit-principles",
        "warren-county-causal-boundary",
      ],
      relatedEntityRefs: [
        {
          kind: "case" as const,
          id: "warren-county-environmental-justice-1982-1991",
        },
      ],
    },
    {
      id: "te-awa",
      heading: "Why isn't Te Awa Tupua an environmentalist embodiment?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "te-awa-legal-person",
        "te-awa-living-whole",
        "te-awa-tupua-kawa",
        "te-pou-tupua-representation",
        "te-awa-iwi-provenance",
        "te-awa-environmentalism-boundary",
      ],
      relatedEntityRefs: [
        { kind: "case" as const, id: "te-awa-tupua-framework-2017-present" },
      ],
    },
    {
      id: "comparisons",
      heading: "Which questions sharpen comparison?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "environmentalism-conservation-boundary",
        "environmental-justice-three-dimensions",
        "environmentalism-party-policy-boundary",
        "indigenous-relations-boundary",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});

export const environmentalismGuideDocuments = [
  { documentType: "entity", entity: dossier },
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-environmentalism",
      slug: "environmentalism",
      label: "Environmentalism",
      description:
        "Environmentalism includes competing ethical commitments, movements, and political projects concerned with environments and nonhuman life; it is not environmental science, one conservation program, or a label that can be imposed on Indigenous governance.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "concept", id: "environmentalism" },
      searchQueries: [
        { query: "environmentalism" },
        { query: "what is environmentalism" },
        { query: "environmental movement" },
        { query: "environmental justice" },
        { query: "ecology vs environmentalism" },
        { query: "conservation vs environmentalism" },
        { query: "climate change and environmentalism" },
      ],
      sections: [
        {
          id: "short-answer",
          role: "short-answer",
          heading: "What does environmentalism mean?",
          narrativeRefs: [{ dossierId: "environmentalism-dossier" }],
        },
        {
          id: "meanings-and-boundaries",
          role: "meanings-and-boundaries",
          heading: "What belongs together—and what does not?",
          narrativeRefs: [
            { dossierId: "environmentalism-dossier", sectionId: "meanings" },
            { dossierId: "environmentalism-dossier", sectionId: "boundaries" },
          ],
          entityRefs: [{ kind: "concept", id: "environmentalism" }],
        },
        {
          id: "justice",
          role: "variants-and-disputes",
          heading: "Whose environment, knowledge, and authority count?",
          narrativeRefs: [
            { dossierId: "environmentalism-dossier", sectionId: "justice" },
          ],
          researchObligationIds: [
            "environmentalism-colonial-conservation-outcomes",
            "environmentalism-knowledge-authority",
            "environmentalism-north-south-translation",
          ],
        },
        {
          id: "bounded-practice",
          role: "bounded-practice",
          heading: "What do three bounded contexts establish?",
          narrativeRefs: [
            { dossierId: "environmentalism-dossier", sectionId: "chipko" },
            {
              dossierId: "environmentalism-dossier",
              sectionId: "warren-county",
            },
            { dossierId: "environmentalism-dossier", sectionId: "te-awa" },
          ],
          entityRefs: [
            { kind: "case", id: "chipko-garhwal-1973-1981" },
            {
              kind: "case",
              id: "warren-county-environmental-justice-1982-1991",
            },
            { kind: "case", id: "te-awa-tupua-framework-2017-present" },
          ],
        },
        {
          id: "comparisons-and-next-steps",
          role: "comparisons-and-next-steps",
          heading: "What should be compared next?",
          narrativeRefs: [
            { dossierId: "environmentalism-dossier", sectionId: "comparisons" },
          ],
        },
        {
          id: "open-questions",
          role: "open-questions",
          heading: "What remains unsettled?",
          researchObligationIds: [
            "environmentalism-movement-effects",
            "environmentalism-colonial-conservation-outcomes",
            "environmentalism-knowledge-authority",
            "environmentalism-north-south-translation",
            "environmentalism-gendered-claims",
            "environmentalism-nuclear-divergence",
          ],
        },
      ],
      reviewedAt: "2026-09-06",
    },
  },
] satisfies AuthoringDocument[];
