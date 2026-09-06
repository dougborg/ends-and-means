import type { AuthoringDocument } from "../../../src/lib/domain";

export const minangkabauGuideDocuments = [
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-matriliny-property-authority",
      slug: "matriliny-property-authority",
      label: "Does matriliny mean women rule?",
      description:
        "Matriliny traces descent through a maternal line; it does not settle where spouses live, who controls inherited or collective property, who holds customary or public office, or who benefits from shared resources. Two bounded West Sumatran cases show why residence, inheritance, management, representation, and equality must be examined separately.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "concept", id: "matriliny" },
      searchQueries: [
        { query: "matriliny" },
        { query: "matrilineal society" },
        { query: "does matriliny mean women rule" },
        { query: "Minangkabau women" },
        { query: "Minangkabau property" },
        {
          query: "matriarchy",
          disambiguation:
            "Maternal-line descent and disputed meanings of matriarchy are distinct rather than aliases.",
        },
      ],
      sections: [
        {
          id: "short-answer",
          role: "short-answer",
          heading: "Does matriliny mean women rule?",
          narrativeRefs: [
            { dossierId: "matriliny-property-authority-dossier" },
          ],
        },
        {
          id: "meanings-and-boundaries",
          role: "meanings-and-boundaries",
          heading: "Which distinctions matter first?",
          narrativeRefs: [
            {
              dossierId: "matriliny-property-authority-dossier",
              sectionId: "how-do-the-terms-differ",
            },
            {
              dossierId: "matriliny-property-authority-dossier",
              sectionId: "how-are-local-terms-used",
            },
          ],
          entityRefs: [
            { kind: "concept", id: "matrilocality" },
            { kind: "concept", id: "matriarchy" },
          ],
          relationshipIds: [
            "matriliny-related-to-matrilocality",
            "matriliny-commonly-confused-with-matriarchy",
          ],
        },
        {
          id: "institutions-and-mechanisms",
          role: "institutions-and-mechanisms",
          heading: "How should power and property be traced?",
          narrativeRefs: [
            {
              dossierId: "matriliny-property-authority-dossier",
              sectionId: "what-counts-as-power",
            },
          ],
        },
        {
          id: "bounded-practice",
          role: "bounded-practice",
          heading: "What do two named nagari show?",
          narrativeRefs: [
            {
              dossierId: "matriliny-property-authority-dossier",
              sectionId: "what-can-koto-tinggi-show",
            },
            {
              dossierId: "matriliny-property-authority-dossier",
              sectionId: "what-can-bonjol-show",
            },
          ],
          entityRefs: [
            {
              kind: "case",
              id: "koto-tinggi-post-decentralization-governance",
            },
            { kind: "case", id: "bonjol-melayu-ulayat-governance" },
          ],
          relationshipIds: ["bonjol-applies-matriliny"],
        },
        {
          id: "variants-disputes-and-limits",
          role: "variants-and-disputes",
          heading: "What do these studies leave unsettled?",
          narrativeRefs: [
            {
              dossierId: "matriliny-property-authority-dossier",
              sectionId: "why-cant-the-cases-be-generalized",
            },
          ],
        },
        {
          id: "comparisons-and-next-steps",
          role: "comparisons-and-next-steps",
          heading: "What should a comparison keep separate?",
          statementIds: [
            "matriliny-does-not-fix-residence",
            "matriliny-does-not-fix-property-control",
            "matriliny-does-not-fix-office",
            "matriliny-does-not-fix-equality",
            "minangkabau-power-varies-by-relation",
            "nagari-law-changed-after-cases",
          ],
          entityRefs: [
            {
              kind: "case-episode",
              id: "koto-tinggi-governance-october-2016",
            },
            { kind: "case-episode", id: "bonjol-ulayat-governance-2000-2016" },
          ],
        },
        {
          id: "open-questions",
          role: "open-questions",
          heading: "What evidence is still missing?",
          researchObligationIds: [
            "koto-tinggi-community-voices",
            "bonjol-inheritance-effective-control",
            "minangkabau-migration-class-generation",
            "minangkabau-religious-authority",
            "minangkabau-state-administration-effects",
          ],
        },
      ],
      reviewedAt: "2026-09-06",
    },
  },
] satisfies AuthoringDocument[];
