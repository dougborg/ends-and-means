import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const dossier = attachNarrative("anarchism.md", {
  id: "anarchism-dossier",
  kind: "dossier" as const,
  label: "Anarchism dossier",
  description:
    "Anarchism names a disputed family of ideas and movements opposed to governing domination. Its proposals use voluntary association, assemblies, delegation, and federation rather than rejecting organization itself.",
  subject: { kind: "concept" as const, id: "anarchism" },
  standfirst: "",
  standfirstStatementIds: [
    "anarchism-contested-family",
    "anarchism-not-disorganization",
  ],
  sections: [
    {
      id: "meaning",
      heading: "What does anarchism mean?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "anarchism-contested-family",
        "anarchism-opposes-domination",
        "anarchism-opposes-other-domination",
        "anarchism-property-strategy-disagreement",
      ],
    },
    {
      id: "organization",
      heading: "Does anarchy mean no organization?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: [
        "anarchism-not-disorganization",
        "rocker-syndicalist-double-aim",
      ],
      relatedEntityRefs: [
        { kind: "means" as const, id: "worker-union-federation" },
      ],
    },
    {
      id: "disputes",
      heading: "Did anarchists share one program?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "anarchism-tradition-boundary",
        "anarchosyndicalist-self-identification",
        "baker-strategy-disagreement",
      ],
    },
    {
      id: "spain",
      heading: "What can Republican Spain show?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "spanish-case-plurality",
        "mujeres-libres-gender-counterevidence",
        "spanish-anarchist-gender-subordination",
        "anarchist-case-nonembodiment",
      ],
      relatedEntityRefs: [
        {
          kind: "case" as const,
          id: "spanish-anarchist-initiatives-1936-1939",
        },
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});
const syndicalism = attachNarrative("anarcho-syndicalism.md", {
  id: "anarcho-syndicalist-organizing-dossier",
  kind: "dossier" as const,
  label: "Anarcho-syndicalist organizing dossier",
  description: "Anarcho-syndicalist organizing uses revolutionary unions both to defend workers under existing conditions and to prepare federated administration of production.",
  subject: { kind: "approach" as const, id: "anarcho-syndicalist-organizing" },
  standfirst: "",
  standfirstStatementIds: ["rocker-syndicalist-double-aim"],
  sections: [
    {
      id: "double-aim",
      heading: "Why organize unions?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "rocker-syndicalist-double-aim",
        "baker-strategy-disagreement",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});
const tradition = attachNarrative("anarcho-syndicalism-tradition.md", {
  id: "anarcho-syndicalism-dossier",
  kind: "dossier" as const,
  label: "Anarcho-syndicalism dossier",
  description: "Anarcho-syndicalism is a historical tradition within libertarian or anarchist socialism that links union organization to wider social transformation.",
  subject: { kind: "concept" as const, id: "anarcho-syndicalism" },
  standfirst: "",
  standfirstStatementIds: ["anarchosyndicalist-self-identification"],
  sections: [
    {
      id: "tradition-and-approach",
      heading: "How do the tradition and approach differ?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "anarchosyndicalist-self-identification",
        "rocker-syndicalist-double-aim",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});
export const anarchismGuideDocuments = [
  { documentType: "entity", entity: dossier },
  { documentType: "entity", entity: syndicalism },
  { documentType: "entity", entity: tradition },
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-anarchism",
      slug: "anarchism",
      label: "Anarchism",
      description:
        "Anarchism is a disputed family of ideas and movements opposed to governing domination, not to organization itself. Its traditions propose different institutions and strategies, and the mixed record of Republican Spain cannot represent anarchism as a whole.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "concept", id: "anarchism" },
      searchQueries: [
        { query: "anarchism" },
        { query: "what is anarchism" },
        { query: "anarchy" },
      ],
      sections: [
        {
          id: "short-answer",
          role: "short-answer",
          heading: "What does anarchism mean?",
          narrativeRefs: [{ dossierId: "anarchism-dossier" }],
        },
        {
          id: "meanings-and-boundaries",
          role: "meanings-and-boundaries",
          heading: "Is anarchism one doctrine?",
          narrativeRefs: [
            { dossierId: "anarchism-dossier", sectionId: "meaning" },
            { dossierId: "anarchism-dossier", sectionId: "disputes" },
          ],
          entityRefs: [{ kind: "collection", id: "anarchist-traditions" }],
        },
        {
          id: "institutions-and-mechanisms",
          role: "institutions-and-mechanisms",
          heading: "How do anarchists propose organizing?",
          narrativeRefs: [
            { dossierId: "anarchism-dossier", sectionId: "organization" },
          ],
          entityRefs: [
            { kind: "approach", id: "anarcho-syndicalist-organizing" },
            { kind: "means", id: "worker-union-federation" },
          ],
          relationshipIds: ["anarchosyndicalism-advocates-federation"],
        },
        {
          id: "bounded-practice",
          role: "bounded-practice",
          heading: "What can Republican Spain show?",
          narrativeRefs: [
            { dossierId: "anarchism-dossier", sectionId: "spain" },
          ],
          entityRefs: [
            { kind: "case", id: "spanish-anarchist-initiatives-1936-1939" },
            {
              kind: "case-episode",
              id: "spanish-anarchist-initiatives-war-episode",
            },
          ],
          relationshipIds: [
            "spanish-episode-contested-anarchist-classification",
          ],
        },
        {
          id: "variants-disputes-and-limits",
          role: "variants-and-disputes",
          heading: "Where do disagreements remain?",
          statementIds: [
            "anarchism-tradition-boundary",
            "baker-strategy-disagreement",
            "mujeres-libres-gender-counterevidence",
            "spanish-anarchist-gender-subordination",
          ],
          researchObligationIds: [
            "anarchism-property-exchange-boundaries",
            "anarchism-spanish-participation-boundary",
          ],
        },
        {
          id: "comparisons-and-next-steps",
          role: "comparisons-and-next-steps",
          heading: "Which neighboring ideas should you compare?",
          entityRefs: [
            { kind: "concept", id: "socialism" },
            { kind: "concept", id: "communism" },
            { kind: "concept", id: "statelessness" },
          ],
          relationshipIds: [
            "anarchism-related-to-socialism",
            "anarchism-related-to-communism",
            "anarchism-related-to-statelessness",
          ],
        },
        {
          id: "open-questions",
          role: "open-questions",
          heading: "What remains open?",
          researchObligationIds: [
            "anarchism-property-exchange-boundaries",
            "anarchism-spanish-participation-boundary",
          ],
        },
      ],
      reviewedAt: "2026-09-06",
    },
  },
] satisfies AuthoringDocument[];
