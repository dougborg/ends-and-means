import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const dossier = attachNarrative("welfare-state.md", {
  id: "welfare-state-dossier",
  kind: "dossier" as const,
  label: "Welfare State dossier",
  description:
    "Welfare States combine rules for pooling social risks, transferring income, and providing or financing services; their eligibility, administration, delivery, access, and effects vary, and provision alone establishes neither an ideology nor a political regime.",
  subject: { kind: "concept" as const, id: "welfare-state" },
  standfirst: "",
  standfirstStatementIds: [
    "welfare-state-institutional-category",
    "welfare-design-facets",
    "welfare-political-regime-boundary",
    "welfare-outcome-boundary",
  ],
  sections: [
    {
      id: "definitions",
      heading: "What does Welfare State mean?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "welfare-state-institutional-category",
        "welfare-regime-analytical-category",
        "social-protection-category-boundary",
        "public-spending-insufficient",
        "welfare-political-regime-boundary",
        "esping-welfare-regime-typology",
        "esping-typology-boundary",
        "welfare-mixed-provision",
      ],
    },
    {
      id: "design",
      heading: "Which design choices change who receives support?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "welfare-design-facets",
        "welfare-benefit-forms",
        "welfare-mixed-provision",
        "welfare-outcome-boundary",
      ],
    },
    {
      id: "care",
      heading: "Where do care and households fit?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "care-social-reproduction-boundary",
        "social-care-welfare-mix",
      ],
    },
    {
      id: "purposes",
      heading: "What are welfare institutions meant to do?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "welfare-attributed-purposes",
        "welfare-political-regime-boundary",
        "welfare-outcome-boundary",
      ],
    },
    {
      id: "britain",
      heading: "What changed in Britain from 1942 to 1951?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "beveridge-proposal-boundary",
        "uk-national-insurance-formal-rule",
        "uk-nhs-formal-rule",
        "uk-assistance-formal-rule",
        "britain-welfare-case-limit",
      ],
      relatedEntityRefs: [
        {
          kind: "case" as const,
          id: "britain-welfare-state-formation-1942-1951",
        },
      ],
    },
    {
      id: "costa-rica",
      heading: "How did Costa Rica extend health institutions?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "costa-rica-ccss-formation",
        "costa-rica-universalization-mandate",
        "costa-rica-1973-health-integration",
        "costa-rica-financing-access",
        "costa-rica-welfare-case-limit",
      ],
      relatedEntityRefs: [
        {
          kind: "case" as const,
          id: "costa-rica-social-insurance-health-1941-1973",
        },
      ],
    },
    {
      id: "south-korea",
      heading: "How did South Korean provision change from 1988 to 2008?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "korea-democratization-expansion",
        "korea-crisis-coverage-gap",
        "korea-employment-insurance-expansion",
        "korea-reform-outcome-limit",
        "korea-authoritarian-democratic-boundary",
        "south-korea-welfare-case-limit",
      ],
      relatedEntityRefs: [
        {
          kind: "case" as const,
          id: "south-korea-welfare-expansion-1988-2008",
        },
      ],
    },
    {
      id: "comparisons",
      heading: "What should a comparison keep separate?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "welfare-regime-analytical-category",
        "public-spending-insufficient",
        "welfare-design-facets",
        "welfare-political-regime-boundary",
        "welfare-outcome-boundary",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-07",
});

export const welfareStateGuideDocuments = [
  { documentType: "entity", entity: dossier },
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-welfare-state",
      slug: "welfare-state",
      label: "Welfare State",
      description:
        "Welfare States combine rules for pooling social risks, transferring income, and providing or financing services; eligibility, administration, delivery, access, and effects differ, and provision alone establishes neither an ideology nor a political regime.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "concept", id: "welfare-state" },
      searchQueries: [
        { query: "welfare state" },
        { query: "what is a welfare state" },
        { query: "social safety net" },
        { query: "social protection" },
        {
          query: "welfare state vs socialism",
          disambiguation:
            "Welfare institutions do not by themselves establish social ownership or any one socialist tradition.",
        },
        {
          query: "welfare state vs social democracy",
          disambiguation:
            "Social-democratic projects have supported welfare institutions, but the institutions also appear under other political traditions and regimes.",
        },
      ],
      sections: [
        {
          id: "short-answer",
          role: "short-answer",
          heading: "What is a Welfare State?",
          narrativeRefs: [{ dossierId: "welfare-state-dossier" }],
        },
        {
          id: "meanings-and-boundaries",
          role: "meanings-and-boundaries",
          heading: "Which labels should remain separate?",
          narrativeRefs: [
            { dossierId: "welfare-state-dossier", sectionId: "definitions" },
          ],
          entityRefs: [{ kind: "concept", id: "welfare-state" }],
        },
        {
          id: "institutions-and-mechanisms",
          role: "institutions-and-mechanisms",
          heading: "How do welfare institutions allocate support?",
          narrativeRefs: [
            { dossierId: "welfare-state-dossier", sectionId: "design" },
            { dossierId: "welfare-state-dossier", sectionId: "care" },
          ],
          statementIds: [
            "welfare-design-facets",
            "welfare-benefit-forms",
            "welfare-mixed-provision",
          ],
        },
        {
          id: "purposes-and-diagnoses",
          role: "purposes-and-diagnoses",
          heading: "Why build welfare institutions?",
          narrativeRefs: [
            { dossierId: "welfare-state-dossier", sectionId: "purposes" },
          ],
        },
        {
          id: "bounded-practice",
          role: "bounded-practice",
          heading: "What do three formation periods show?",
          narrativeRefs: [
            { dossierId: "welfare-state-dossier", sectionId: "britain" },
            { dossierId: "welfare-state-dossier", sectionId: "costa-rica" },
            { dossierId: "welfare-state-dossier", sectionId: "south-korea" },
          ],
          entityRefs: [
            { kind: "case", id: "britain-welfare-state-formation-1942-1951" },
            {
              kind: "case",
              id: "costa-rica-social-insurance-health-1941-1973",
            },
            { kind: "case", id: "south-korea-welfare-expansion-1988-2008" },
          ],
        },
        {
          id: "variants-and-disputes",
          role: "variants-and-disputes",
          heading: "Which comparisons remain contested?",
          narrativeRefs: [
            { dossierId: "welfare-state-dossier", sectionId: "comparisons" },
          ],
          researchObligationIds: [
            "welfare-state-unpaid-care-distribution",
            "welfare-state-formal-access-exclusion",
            "welfare-state-authoritarian-provision",
            "welfare-state-nonstate-provision-boundary",
          ],
        },
        {
          id: "comparisons-and-next-steps",
          role: "comparisons-and-next-steps",
          heading: "Which related subjects clarify the boundary?",
          entityRefs: [
            { kind: "concept", id: "social-democracy" },
            { kind: "concept", id: "socialism" },
            { kind: "concept", id: "capitalism" },
          ],
          relationshipIds: [
            "welfare-state-related-to-social-democracy",
            "welfare-state-related-to-socialism",
            "welfare-state-related-to-capitalism",
          ],
        },
        {
          id: "open-questions",
          role: "open-questions",
          heading: "What remains unsettled?",
          researchObligationIds: [
            "welfare-state-unpaid-care-distribution",
            "welfare-state-formal-access-exclusion",
            "welfare-state-authoritarian-provision",
            "welfare-state-nonstate-provision-boundary",
            "welfare-state-institution-outcome-counterfactual",
          ],
        },
      ],
      reviewedAt: "2026-09-07",
    },
  },
] satisfies AuthoringDocument[];
