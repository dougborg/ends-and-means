import type { AuthoringDocument } from "../../../src/lib/domain";

export const tawantinsuyuGuideDocuments = [
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-tawantinsuyu-imperial-organization",
      slug: "tawantinsuyu-imperial-organization",
      label: "Tawantinsuyu (Inka Empire)",
      description:
        "A bounded guide to how Tawantinsuyu organized authority, labor, provisioning, and incorporated peoples during its imperial expansion.",
      publicationStatus: "reviewed",
      primarySubject: {
        kind: "case",
        id: "tawantinsuyu-imperial-organization",
      },
      searchQueries: [
        { query: "Tawantinsuyu" },
        { query: "Inka Empire" },
        { query: "Inca Empire" },
        {
          query: "Inca socialism",
          disambiguation:
            "A bounded imperial case explaining why a modern ideological label obscures attested Andean institutions.",
        },
        { query: "Inca economy" },
      ],
      sections: [
        {
          id: "short-answer",
          role: "short-answer",
          heading: "What was Tawantinsuyu?",
          narrativeRefs: [
            { dossierId: "tawantinsuyu-imperial-organization-dossier" },
          ],
        },
        {
          id: "meanings-and-boundaries",
          role: "meanings-and-boundaries",
          heading: "What do Tawantinsuyu, Inka, and Inca mean?",
          narrativeRefs: [
            {
              dossierId: "tawantinsuyu-imperial-organization-dossier",
              sectionId: "what-do-the-names-mean",
            },
          ],
        },
        {
          id: "institutions-and-mechanisms",
          role: "institutions-and-mechanisms",
          heading: "How did authority, labor, and provisioning work?",
          narrativeRefs: [
            {
              dossierId: "tawantinsuyu-imperial-organization-dossier",
              sectionId: "who-ruled",
            },
            {
              dossierId: "tawantinsuyu-imperial-organization-dossier",
              sectionId: "how-were-labor-and-resources-organized",
            },
          ],
        },
        {
          id: "bounded-practice",
          role: "bounded-practice",
          heading: "What changed between expansion and invasion?",
          entityRefs: [
            { kind: "case", id: "tawantinsuyu-imperial-organization" },
            {
              kind: "case-episode",
              id: "tawantinsuyu-expansion-consolidation",
            },
            { kind: "case-episode", id: "tawantinsuyu-succession-invasion" },
          ],
        },
        {
          id: "variants-disputes-and-limits",
          role: "variants-and-disputes",
          heading: "What can the evidence establish, and what is disputed?",
          narrativeRefs: [
            {
              dossierId: "tawantinsuyu-imperial-organization-dossier",
              sectionId: "what-do-material-remains-show",
            },
            {
              dossierId: "tawantinsuyu-imperial-organization-dossier",
              sectionId: "was-it-reciprocity-or-extraction",
            },
            {
              dossierId: "tawantinsuyu-imperial-organization-dossier",
              sectionId: "how-should-colonial-accounts-be-read",
            },
          ],
        },
        {
          id: "comparisons-and-next-steps",
          role: "comparisons-and-next-steps",
          heading: "Which distinctions make comparison responsible?",
          narrativeRefs: [
            {
              dossierId: "tawantinsuyu-imperial-organization-dossier",
              sectionId: "what-does-this-case-not-establish",
            },
          ],
        },
        {
          id: "open-questions",
          role: "open-questions",
          heading: "What remains unresolved?",
          researchObligationIds: [
            "tawantinsuyu-provincial-variation",
            "tawantinsuyu-colonial-translation",
            "tawantinsuyu-reciprocity-extraction-test",
          ],
        },
      ],
      reviewedAt: "2026-09-06",
    },
  },
] satisfies AuthoringDocument[];
