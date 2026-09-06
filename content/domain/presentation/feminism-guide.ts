import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const dossier = attachNarrative("feminism.md", {
  id: "feminism-dossier",
  kind: "dossier" as const,
  label: "Feminism dossier",
  description:
    "Feminism names contested movements, analyses, and political projects addressing gendered power and sexist oppression; traditions differ over subjects, causes, institutions, and change, while bounded cases cannot represent the whole family.",
  subject: { kind: "concept" as const, id: "feminism" },
  standfirst: "",
  standfirstStatementIds: [
    "feminism-contested-family",
    "feminism-traditions-nonexhaustive",
    "formal-substantive-equality-boundary",
  ],
  sections: [
    {
      id: "meaning",
      heading: "What does feminism name?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "feminism-contested-family",
        "feminism-analysis-action-distinction",
        "feminism-public-private-boundary",
      ],
    },
    {
      id: "traditions",
      heading: "Why isn't feminism one tradition?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "feminism-traditions-nonexhaustive",
        "liberal-feminism-autonomy",
        "radical-feminism-structural-boundary",
        "socialist-feminism-material-boundary",
        "crenshaw-single-axis-limit",
        "mohanty-western-universal-limit",
        "moreton-robinson-indigenous-boundary",
        "koyama-transfeminist-self-description",
        "koyama-body-autonomy",
        "sex-gender-trans-boundary",
      ],
      relatedEntityRefs: [
        { kind: "collection" as const, id: "feminist-traditions" },
      ],
    },
    {
      id: "equality-and-material-power",
      heading: "Are equal rights enough?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "formal-substantive-equality-boundary",
        "fraser-social-reproduction-definition",
        "fraser-care-capitalism-claim",
      ],
    },
    {
      id: "coalition-and-boundaries",
      heading: "Who can a feminist claim speak for?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "crenshaw-single-axis-limit",
        "mohanty-western-universal-limit",
        "moreton-robinson-indigenous-boundary",
        "sex-gender-trans-boundary",
      ],
    },
    {
      id: "combahee",
      heading: "What can the Combahee collective show?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "combahee-self-description",
        "combahee-organizing-practice",
        "combahee-case-boundary",
      ],
      relatedEntityRefs: [
        { kind: "case" as const, id: "combahee-river-collective-1974-1980" },
      ],
    },
    {
      id: "sewa",
      heading: "How did SEWA combine union and cooperative institutions?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "sewa-union-registration",
        "sewa-cooperative-bank",
        "sewa-quilt-cooperative",
        "sewa-case-boundary",
      ],
      relatedEntityRefs: [
        { kind: "case" as const, id: "sewa-ahmedabad-1972-1981" },
        { kind: "means" as const, id: "self-employed-worker-unionism" },
        { kind: "means" as const, id: "member-owned-cooperative-finance" },
      ],
    },
    {
      id: "iceland",
      heading: "What changed under Iceland's 2000 leave design?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "iceland-leave-enacted-design",
        "iceland-fathers-uptake",
        "iceland-care-work-outcomes",
        "iceland-causal-transfer-limit",
      ],
      relatedEntityRefs: [
        { kind: "case" as const, id: "iceland-parental-leave-2000-2013" },
        { kind: "means" as const, id: "nontransferable-parental-leave" },
      ],
    },
    {
      id: "comparisons",
      heading: "Which distinctions sharpen comparison?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "formal-substantive-equality-boundary",
        "feminism-analysis-action-distinction",
        "feminism-traditions-nonexhaustive",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});

export const feminismGuideDocuments = [
  { documentType: "entity", entity: dossier },
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-feminism",
      slug: "feminism",
      label: "Feminism",
      description:
        "Feminism is a contested family of movements, analyses, and political projects confronting gendered power and sexist oppression; its traditions disagree over political subjects, material relations, institutions, and change, and no selected organization or policy represents the whole.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "concept", id: "feminism" },
      searchQueries: [
        { query: "feminism" },
        { query: "what is feminism" },
        { query: "feminist traditions" },
        {
          query: "intersectional feminism",
          resultStatus: "research-gap",
          disambiguation:
            "Intersectionality is an analytic framework with a wider history than this introductory guide can establish.",
        },
      ],
      sections: [
        {
          id: "short-answer",
          role: "short-answer",
          heading: "What does feminism mean?",
          narrativeRefs: [{ dossierId: "feminism-dossier" }],
        },
        {
          id: "meanings-and-boundaries",
          role: "meanings-and-boundaries",
          heading: "What does the name include—and not include?",
          narrativeRefs: [
            { dossierId: "feminism-dossier", sectionId: "meaning" },
            {
              dossierId: "feminism-dossier",
              sectionId: "coalition-and-boundaries",
            },
          ],
          entityRefs: [{ kind: "concept", id: "feminism" }],
        },
        {
          id: "traditions",
          role: "variants-and-disputes",
          heading: "Where do feminist traditions disagree?",
          narrativeRefs: [
            { dossierId: "feminism-dossier", sectionId: "traditions" },
            {
              dossierId: "feminism-dossier",
              sectionId: "equality-and-material-power",
            },
          ],
          entityRefs: [{ kind: "collection", id: "feminist-traditions" }],
          researchObligationIds: [
            "feminism-universal-subject-exclusion",
            "feminism-translation-nonwestern-naming",
            "feminism-sex-gender-trans-boundaries",
          ],
        },
        {
          id: "institutions",
          role: "institutions-and-mechanisms",
          heading: "Which institutions put claims into practice?",
          entityRefs: [
            { kind: "means", id: "self-employed-worker-unionism" },
            { kind: "means", id: "member-owned-cooperative-finance" },
            { kind: "means", id: "nontransferable-parental-leave" },
          ],
          statementIds: [
            "sewa-union-registration",
            "sewa-cooperative-bank",
            "iceland-leave-enacted-design",
          ],
        },
        {
          id: "bounded-practice",
          role: "bounded-practice",
          heading: "What do three bounded contexts establish?",
          narrativeRefs: [
            { dossierId: "feminism-dossier", sectionId: "combahee" },
            { dossierId: "feminism-dossier", sectionId: "sewa" },
            { dossierId: "feminism-dossier", sectionId: "iceland" },
          ],
          entityRefs: [
            { kind: "case", id: "combahee-river-collective-1974-1980" },
            { kind: "case", id: "sewa-ahmedabad-1972-1981" },
            { kind: "case", id: "iceland-parental-leave-2000-2013" },
          ],
          relationshipIds: [
            "combahee-episode-contested-feminism",
            "sewa-episode-contested-feminism",
            "iceland-leave-episode-contested-feminism",
          ],
        },
        {
          id: "comparisons-and-next-steps",
          role: "comparisons-and-next-steps",
          heading: "What should be compared next?",
          narrativeRefs: [
            { dossierId: "feminism-dossier", sectionId: "comparisons" },
          ],
          entityRefs: [
            { kind: "concept", id: "socialism" },
            { kind: "concept", id: "economic-democracy" },
            { kind: "concept", id: "social-ownership" },
          ],
        },
        {
          id: "open-questions",
          role: "open-questions",
          heading: "What remains unsettled?",
          researchObligationIds: [
            "feminism-universal-subject-exclusion",
            "feminism-translation-nonwestern-naming",
            "feminism-sex-gender-trans-boundaries",
            "feminism-policy-attribution-causal-effects",
          ],
        },
      ],
      reviewedAt: "2026-09-06",
    },
  },
] satisfies AuthoringDocument[];
