import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const dossier = attachNarrative("oligarchy.md", {
  id: "oligarchy-dossier",
  kind: "dossier" as const,
  label: "Oligarchy dossier",
  description:
    "Oligarchy is a contested concept for concentrated minority power whose classical, material, organizational, historical, empirical, and polemical uses require different evidence.",
  subject: { kind: "concept" as const, id: "oligarchy" },
  standfirst: "",
  standfirstStatementIds: [
    "oligarchy-aristotle-wealth-distinction",
    "oligarchy-winters-wealth-defense",
    "oligarchy-regime-boundary",
  ],
  sections: [
    {
      id: "meanings",
      heading: "What can oligarchy mean?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "oligarchy-aristotle-few-common-interest",
        "oligarchy-aristotle-wealth-distinction",
        "oligarchy-simonton-historical-form",
        "oligarchy-winters-wealth-defense",
        "oligarchy-page-winters-democracy-coexistence",
        "oligarchy-elite-theory-distinction",
        "oligarchy-polemic-boundary",
      ],
    },
    {
      id: "mechanisms",
      heading: "What would evidence of minority power need to show?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "oligarchy-inequality-boundary",
        "oligarchy-officeholding-boundary",
        "oligarchy-regime-boundary",
        "oligarchy-page-winters-democracy-coexistence",
      ],
    },
    {
      id: "athens",
      heading: "What happened at Athens in 411 BCE?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "athens-411-war-crisis",
        "athens-411-five-thousand-proposal",
        "athens-411-four-hundred-actual-rule",
        "athens-411-coercion",
        "athens-411-four-hundred-duration",
        "athens-411-five-thousand-successor",
        "athens-411-source-boundary",
      ],
      relatedEntityRefs: [
        {
          kind: "case" as const,
          id: "athens-four-hundred-five-thousand-411-bce",
        },
      ],
    },
    {
      id: "indonesia",
      heading: "What does the Indonesian debate disagree about?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "indonesia-winters-material-power",
        "indonesia-winters-wealth-defense",
        "indonesia-democracy-coexistence",
        "indonesia-hadiz-robison-rival",
        "indonesia-beyond-oligarchy-critique",
        "indonesia-debate-reply",
        "indonesia-case-boundary",
      ],
      relatedEntityRefs: [
        { kind: "case" as const, id: "indonesia-oligarchy-debate-1998-2013" },
      ],
    },
    {
      id: "united-states",
      heading: "What did the United States policy study find?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "us-gilens-page-dataset",
        "us-gilens-page-elite-effect",
        "us-gilens-page-average-effect",
        "us-gilens-page-not-oligarchy-test",
        "us-gilens-earlier-income-gradient",
        "us-bashir-model-critique",
        "us-gilens-simulation-reply",
        "us-study-bounded-conclusion",
      ],
      relatedEntityRefs: [
        {
          kind: "case" as const,
          id: "us-federal-policy-preferences-1981-2002",
        },
      ],
    },
    {
      id: "comparisons",
      heading: "Which comparisons prevent category errors?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "oligarchy-elite-theory-distinction",
        "oligarchy-inequality-boundary",
        "oligarchy-officeholding-boundary",
        "oligarchy-regime-boundary",
      ],
      relatedEntityRefs: [
        { kind: "concept" as const, id: "democracy" },
        { kind: "concept" as const, id: "capitalism" },
        { kind: "concept" as const, id: "authoritarianism" },
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});

export const oligarchyGuideDocuments = [
  { documentType: "entity", entity: dossier },
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-oligarchy",
      slug: "oligarchy",
      label: "Oligarchy",
      description:
        "Oligarchy can mean rule by a few, rule by the wealthy, or a theory of durable minority power; those uses require different evidence, and neither inequality nor a powerful elite alone classifies an entire political order.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "concept", id: "oligarchy" },
      searchQueries: [
        { query: "oligarchy" },
        { query: "what is oligarchy" },
        { query: "rule by the few" },
        { query: "rule by the wealthy" },
        {
          query: "plutocracy",
          resultStatus: "research-gap",
          disambiguation:
            "Plutocracy overlaps with wealth-centered uses of oligarchy but requires its own conceptual history and boundaries.",
        },
      ],
      sections: [
        {
          id: "short-answer",
          role: "short-answer",
          heading: "What does oligarchy mean?",
          narrativeRefs: [{ dossierId: "oligarchy-dossier" }],
        },
        {
          id: "meanings-and-boundaries",
          role: "meanings-and-boundaries",
          heading: "Why does one word name several claims?",
          narrativeRefs: [
            { dossierId: "oligarchy-dossier", sectionId: "meanings" },
          ],
          entityRefs: [{ kind: "concept", id: "oligarchy" }],
        },
        {
          id: "mechanisms",
          role: "institutions-and-mechanisms",
          heading: "How could minority power operate?",
          narrativeRefs: [
            { dossierId: "oligarchy-dossier", sectionId: "mechanisms" },
          ],
          researchObligationIds: [
            "oligarchy-minority-delegation-boundary",
            "oligarchy-wealth-political-conversion",
          ],
        },
        {
          id: "disputes",
          role: "variants-and-disputes",
          heading: "Where do the theories disagree?",
          narrativeRefs: [
            { dossierId: "oligarchy-dossier", sectionId: "indonesia" },
            { dossierId: "oligarchy-dossier", sectionId: "united-states" },
          ],
          researchObligationIds: [
            "oligarchy-wealth-defense-travel",
            "oligarchy-us-policy-model-robustness",
          ],
        },
        {
          id: "bounded-practice",
          role: "bounded-practice",
          heading: "What do three bounded cases establish?",
          narrativeRefs: [
            { dossierId: "oligarchy-dossier", sectionId: "athens" },
            { dossierId: "oligarchy-dossier", sectionId: "indonesia" },
            { dossierId: "oligarchy-dossier", sectionId: "united-states" },
          ],
          entityRefs: [
            { kind: "case", id: "athens-four-hundred-five-thousand-411-bce" },
            { kind: "case", id: "indonesia-oligarchy-debate-1998-2013" },
            { kind: "case", id: "us-federal-policy-preferences-1981-2002" },
          ],
        },
        {
          id: "comparisons-and-next-steps",
          role: "comparisons-and-next-steps",
          heading: "What should be compared instead of scored?",
          narrativeRefs: [
            { dossierId: "oligarchy-dossier", sectionId: "comparisons" },
          ],
          entityRefs: [
            { kind: "concept", id: "democracy" },
            { kind: "concept", id: "capitalism" },
            { kind: "concept", id: "authoritarianism" },
          ],
        },
        {
          id: "open-questions",
          role: "open-questions",
          heading: "What remains unsettled?",
          researchObligationIds: [
            "oligarchy-minority-delegation-boundary",
            "oligarchy-wealth-political-conversion",
            "oligarchy-wealth-defense-travel",
            "oligarchy-ancient-translation-reception",
            "oligarchy-us-policy-model-robustness",
            "oligarchy-regime-label-threshold",
          ],
        },
      ],
      reviewedAt: "2026-09-06",
    },
  },
] satisfies AuthoringDocument[];
