import type { AuthoringDocument } from "../../../src/lib/domain";

export const subjectGuideDocuments = [
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-economic-democracy",
      slug: "economic-democracy",
      label: "Economic democracy",
      description:
        "A learner path through the meanings, institutional proposals, limitations, and bounded Swedish evidence connected with economic democracy.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "concept", id: "economic-democracy" },
      searchQueries: [
        { query: "economic democracy" },
        { query: "democracy at work" },
        { query: "democratic economy" },
        { query: "who controls the economy" },
      ],
      sections: [
        {
          id: "short-answer",
          role: "short-answer",
          heading: "What does economic democracy mean?",
          narrativeRefs: [{ dossierId: "economic-democracy-dossier" }],
        },
        {
          id: "meanings-and-boundaries",
          role: "meanings-and-boundaries",
          heading: "Does it mean one institutional model?",
          narrativeRefs: [
            {
              dossierId: "economic-democracy-dossier",
              sectionId: "what-question-does-it-ask",
            },
            {
              dossierId: "economic-democracy-dossier",
              sectionId: "does-it-prescribe-one-model",
            },
          ],
          entityRefs: [
            { kind: "concept", id: "social-ownership" },
            { kind: "concept", id: "market-socialism" },
          ],
        },
        {
          id: "institutions-and-mechanisms",
          role: "institutions-and-mechanisms",
          heading: "How might economic authority be reorganized?",
          narrativeRefs: [
            {
              dossierId: "economic-democracy-dossier",
              sectionId: "why-are-ownership-and-control-separate",
            },
          ],
          entityRefs: [
            { kind: "means", id: "regional-wage-earner-fund-boards" },
          ],
          relationshipIds: ["wage-earner-program-advocates-fund-boards"],
        },
        {
          id: "bounded-practice",
          role: "bounded-practice",
          heading: "What can the Swedish funds show?",
          narrativeRefs: [
            {
              dossierId: "economic-democracy-dossier",
              sectionId: "how-do-the-swedish-funds-fit",
            },
            { dossierId: "swedish-wage-earner-funds-case-dossier" },
          ],
          entityRefs: [
            { kind: "case", id: "swedish-wage-earner-funds" },
            { kind: "approach", id: "swedish-wage-earner-fund-program" },
          ],
          relationshipIds: ["enacted-funds-partially-instantiated-program"],
        },
        {
          id: "variants-disputes-and-limits",
          role: "variants-and-disputes",
          heading: "What can democratic designs fail to achieve?",
          narrativeRefs: [
            {
              dossierId: "economic-democracy-dossier",
              sectionId: "what-can-democratic-designs-fail-to-achieve",
            },
          ],
          researchObligationIds: [
            "economic-democracy-property-rights-objection",
            "economic-democracy-decision-cost-objection",
            "economic-democracy-futility-objection",
          ],
        },
        {
          id: "comparisons-and-next-steps",
          role: "comparisons-and-next-steps",
          heading: "Where can this question lead next?",
          entityRefs: [
            { kind: "concept", id: "social-ownership" },
            { kind: "concept", id: "market-socialism" },
            { kind: "challenge", id: "authority-and-accountability" },
            {
              kind: "challenge",
              id: "distribution-of-gains-and-ownership",
            },
          ],
        },
        {
          id: "open-questions",
          role: "open-questions",
          heading: "What remains open?",
          researchObligationIds: ["economic-democracy-causal-identification"],
        },
      ],
      reviewedAt: "2026-09-05",
    },
  },
] satisfies AuthoringDocument[];
