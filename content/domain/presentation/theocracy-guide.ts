import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const dossier = attachNarrative("theocracy.md", {
  id: "theocracy-dossier",
  kind: "dossier" as const,
  label: "Theocracy dossier",
  description:
    "Theocracy is a contested classification for governing authority grounded in divine sovereignty, religious law, or religious office; official religion, sacred legitimation, or religious influence alone does not establish it.",
  subject: { kind: "concept" as const, id: "theocracy" },
  standfirst: "",
  standfirstStatementIds: [
    "theocracy-contested-family",
    "theocracy-state-religion-boundary",
    "theocracy-influence-boundary",
  ],
  sections: [
    {
      id: "meanings",
      heading: "What can theocracy mean?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "theocracy-contested-family",
        "theocracy-hierocracy-boundary",
        "constitutional-theocracy-hybrid",
      ],
    },
    {
      id: "boundaries",
      heading: "What does not establish theocracy?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "theocracy-state-religion-boundary",
        "theocracy-religious-law-boundary",
        "theocracy-influence-boundary",
        "theocracy-sacred-monarchy-boundary",
        "theocracy-authoritarianism-boundary",
        "theocracy-polemical-label-boundary",
      ],
    },
    {
      id: "iran",
      heading: "How does Iran's post-1989 design combine authorities?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "iran-divine-sovereignty-principles",
        "iran-laws-islamic-criteria",
        "iran-popular-elections",
        "iran-separation-under-leader",
        "iran-guardian-council-composition",
        "iran-guardian-council-review",
        "iran-guardian-council-elections",
        "iran-leader-selection",
        "iran-leader-powers",
        "iran-expediency-council",
        "iran-hybrid-rival-reading",
        "iran-classification-qualified",
      ],
      relatedEntityRefs: [
        {
          kind: "case" as const,
          id: "iran-constitutional-authority-1989-present",
        },
      ],
    },
    {
      id: "vatican",
      heading: "How does Vatican City's 2023 law allocate power?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "vatican-pope-sovereign",
        "vatican-legislative-commission",
        "vatican-commission-amendment",
        "vatican-executive-governorate",
        "vatican-judicial-name",
        "holy-see-vatican-distinct",
        "pope-religious-state-office",
        "vatican-delegation-boundary",
        "vatican-classification-qualified",
      ],
      relatedEntityRefs: [
        { kind: "case" as const, id: "vatican-city-authority-2023-present" },
      ],
    },
    {
      id: "comparisons",
      heading: "Which neighboring classifications answer different questions?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "theocracy-hierocracy-boundary",
        "theocracy-state-religion-boundary",
        "theocracy-sacred-monarchy-boundary",
        "theocracy-authoritarianism-boundary",
        "holy-see-vatican-distinct",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-07",
});

export const theocracyGuideDocuments: AuthoringDocument[] = [
  { documentType: "entity", entity: dossier },
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-theocracy",
      slug: "theocracy",
      label: "Theocracy",
      description:
        "Theocracy is a contested classification for governing authority grounded in divine sovereignty, religious law, or religious office. Official religion, sacred monarchy, and public religious influence do not by themselves show who governs.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "concept", id: "theocracy" },
      searchQueries: [
        { query: "theocracy" },
        { query: "what is theocracy" },
        { query: "rule by religious leaders" },
        { query: "religious government" },
        {
          query: "clerical rule",
          disambiguation:
            "Rule by clergy is one narrower institutional form, not every use of theocracy.",
        },
      ],
      sections: [
        {
          id: "short-answer",
          role: "short-answer",
          heading: "What does theocracy mean?",
          narrativeRefs: [{ dossierId: "theocracy-dossier" }],
        },
        {
          id: "meanings-and-boundaries",
          role: "meanings-and-boundaries",
          heading: "Why does the term cover different arrangements?",
          narrativeRefs: [
            { dossierId: "theocracy-dossier", sectionId: "meanings" },
          ],
          entityRefs: [{ kind: "concept", id: "theocracy" }],
        },
        {
          id: "institutions",
          role: "institutions-and-mechanisms",
          heading: "Which powers matter for classification?",
          narrativeRefs: [
            { dossierId: "theocracy-dossier", sectionId: "boundaries" },
          ],
          entityRefs: [
            {
              kind: "comparison-dimension",
              id: "religiously-grounded-governing-authority",
            },
          ],
          researchObligationIds: ["theocracy-threshold-religious-review"],
        },
        {
          id: "bounded-practice",
          role: "bounded-practice",
          heading: "What do Iran and Vatican City show?",
          narrativeRefs: [
            { dossierId: "theocracy-dossier", sectionId: "iran" },
            { dossierId: "theocracy-dossier", sectionId: "vatican" },
          ],
          entityRefs: [
            { kind: "case", id: "iran-constitutional-authority-1989-present" },
            { kind: "case", id: "vatican-city-authority-2023-present" },
          ],
          relationshipIds: [
            "iran-religious-authority-placement",
            "vatican-religious-authority-placement",
          ],
        },
        {
          id: "variants-and-disputes",
          role: "variants-and-disputes",
          heading: "Where can formal design mislead?",
          researchObligationIds: [
            "iran-elections-institutional-autonomy",
            "vatican-delegated-power-practice",
          ],
        },
        {
          id: "comparisons-and-next-steps",
          role: "comparisons-and-next-steps",
          heading: "What should be kept separate?",
          narrativeRefs: [
            { dossierId: "theocracy-dossier", sectionId: "comparisons" },
          ],
          entityRefs: [
            { kind: "concept", id: "monarchy" },
            { kind: "concept", id: "authoritarianism" },
            { kind: "concept", id: "totalitarianism" },
          ],
          relationshipIds: ["monarchy-related-to-theocracy"],
        },
        {
          id: "open-questions",
          role: "open-questions",
          heading: "What remains open?",
          researchObligationIds: ["theocracy-category-travel"],
        },
      ],
      reviewedAt: "2026-09-07",
    },
  },
];
