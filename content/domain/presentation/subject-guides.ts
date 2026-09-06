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
        {
          query: "direct democracy",
          resultStatus: "research-gap",
          disambiguation:
            "This guide concerns democratic authority in economic institutions, not a general account of direct democracy.",
        },
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
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-socialism",
      slug: "socialism",
      label: "Socialism",
      description:
        "A learner path through socialism's disputed meanings, purposes, institutional choices, political strategies, and relationship to bounded practice.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "concept", id: "socialism" },
      searchQueries: [
        { query: "socialism" },
        { query: "what is socialism" },
        { query: "socialist ideas" },
        { query: "socialist economy" },
        {
          query: "worker ownership",
          disambiguation:
            "Worker ownership is one institutional path discussed within broader disputes about social ownership and control.",
        },
        {
          query: "planned economy",
          resultStatus: "research-gap",
          disambiguation:
            "This guide distinguishes disputed socialist planning proposals but is not a general guide to planned economies.",
        },
      ],
      sections: [
        {
          id: "short-answer",
          role: "short-answer",
          heading: "What does socialism mean?",
          narrativeRefs: [{ dossierId: "socialism-dossier" }],
        },
        {
          id: "meanings-and-boundaries",
          role: "meanings-and-boundaries",
          heading: "Why does the word cover different things?",
          narrativeRefs: [
            {
              dossierId: "socialism-dossier",
              sectionId: "why-is-the-term-so-broad",
            },
            {
              dossierId: "socialism-dossier",
              sectionId: "how-do-socialism-and-communism-relate",
            },
          ],
        },
        {
          id: "purposes-and-diagnoses",
          role: "purposes-and-diagnoses",
          heading: "Which purposes recur across socialist traditions?",
          narrativeRefs: [
            {
              dossierId: "socialism-dossier",
              sectionId: "what-defines-socialism",
            },
          ],
        },
        {
          id: "institutions-and-mechanisms",
          role: "institutions-and-mechanisms",
          heading: "Which institutions and routes do socialists dispute?",
          narrativeRefs: [
            {
              dossierId: "socialism-dossier",
              sectionId: "which-institutions-and-paths-are-disputed",
            },
          ],
          entityRefs: [
            { kind: "concept", id: "social-ownership" },
            { kind: "concept", id: "economic-democracy" },
            { kind: "concept", id: "market-socialism" },
            { kind: "concept", id: "social-democracy" },
            { kind: "concept", id: "economic-planning" },
            { kind: "concept", id: "market-coordination" },
            { kind: "concept", id: "social-class" },
          ],
          relationshipIds: [
            "socialism-related-to-social-ownership",
            "socialism-related-to-economic-democracy",
            "socialism-related-to-market-socialism",
            "socialism-related-to-social-democracy",
            "socialism-related-to-economic-planning",
            "socialism-related-to-market-coordination",
            "socialism-related-to-social-class",
          ],
        },
        {
          id: "bounded-practice",
          role: "bounded-practice",
          heading: "What can one Swedish experiment show?",
          narrativeRefs: [
            {
              dossierId: "socialism-dossier",
              sectionId: "what-can-the-swedish-funds-show",
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
          heading: "Where do the strongest boundary disputes remain?",
          researchObligationIds: [
            "socialism-rival-classification-boundary",
            "socialism-democratic-control-threshold",
          ],
        },
        {
          id: "comparisons-and-next-steps",
          role: "comparisons-and-next-steps",
          heading: "Which distinctions should you follow next?",
          entityRefs: [
            { kind: "concept", id: "communism" },
            { kind: "concept", id: "social-ownership" },
            { kind: "concept", id: "economic-democracy" },
            { kind: "concept", id: "social-democracy" },
            { kind: "concept", id: "market-socialism" },
            { kind: "concept", id: "economic-planning" },
            { kind: "concept", id: "market-coordination" },
            { kind: "concept", id: "social-class" },
            { kind: "approach", id: "swedish-wage-earner-fund-program" },
          ],
          relationshipIds: [
            "socialism-related-to-communism",
            "socialism-related-to-economic-planning",
            "socialism-related-to-market-coordination",
            "socialism-related-to-social-class",
          ],
        },
        {
          id: "open-questions",
          role: "open-questions",
          heading: "What remains open?",
          researchObligationIds: [
            "socialism-communism-lexical-history",
            "socialism-democratic-control-threshold",
          ],
        },
      ],
      reviewedAt: "2026-09-06",
    },
  },
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-communism",
      slug: "communism",
      label: "Communism",
      description:
        "A learner path separating communist ideals, programs, political routes, movements, organizational labels, and the evidence needed for bounded practice claims.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "concept", id: "communism" },
      searchQueries: [
        { query: "communism" },
        { query: "what is communism" },
        { query: "communist society" },
        { query: "communist state" },
        {
          query: "communist countries",
          disambiguation:
            "A country or party label does not establish one institutional model; this guide separates claimed identity from bounded practice.",
        },
      ],
      sections: [
        {
          id: "short-answer",
          role: "short-answer",
          heading: "What does communism mean?",
          narrativeRefs: [{ dossierId: "communism-dossier" }],
        },
        {
          id: "meanings-and-boundaries",
          role: "meanings-and-boundaries",
          heading: "Why is the same word used for an ideal, movement, and state label?",
          narrativeRefs: [
            {
              dossierId: "communism-dossier",
              sectionId: "what-can-communism-mean",
            },
          ],
        },
        {
          id: "purposes-and-diagnoses",
          role: "purposes-and-diagnoses",
          heading: "What did Marx and Engels propose?",
          narrativeRefs: [
            {
              dossierId: "communism-dossier",
              sectionId: "what-did-marx-and-engels-propose",
            },
          ],
        },
        {
          id: "institutions-and-mechanisms",
          role: "institutions-and-mechanisms",
          heading: "Did communists agree on institutions or transition?",
          narrativeRefs: [
            {
              dossierId: "communism-dossier",
              sectionId: "did-communists-agree-on-the-path-or-destination",
            },
          ],
          entityRefs: [
            { kind: "concept", id: "social-ownership" },
            { kind: "concept", id: "social-class" },
            { kind: "concept", id: "statelessness" },
          ],
          relationshipIds: [
            "communism-related-to-social-ownership",
            "communism-related-to-social-class",
            "communism-related-to-statelessness",
          ],
        },
        {
          id: "variants-disputes-and-limits",
          role: "variants-and-disputes",
          heading: "Was communism one organization or one global movement?",
          narrativeRefs: [
            {
              dossierId: "communism-dossier",
              sectionId: "was-communism-one-global-movement",
            },
            {
              dossierId: "communism-dossier",
              sectionId: "does-a-communist-label-settle-the-case",
            },
          ],
        },
        {
          id: "comparisons-and-next-steps",
          role: "comparisons-and-next-steps",
          heading: "Which distinction should you examine next?",
          entityRefs: [
            { kind: "concept", id: "socialism" },
            { kind: "concept", id: "social-ownership" },
            { kind: "concept", id: "social-class" },
            { kind: "concept", id: "statelessness" },
          ],
          relationshipIds: [
            "communism-related-to-socialism",
            "communism-related-to-social-class",
            "communism-related-to-statelessness",
          ],
        },
        {
          id: "open-questions",
          role: "open-questions",
          heading: "Which bounded cases still need evidence?",
          researchObligationIds: [
            "communism-claimed-identity-practice-gap",
            "communism-roy-comintern-strategy",
          ],
        },
      ],
      reviewedAt: "2026-09-06",
    },
  },
] satisfies AuthoringDocument[];
