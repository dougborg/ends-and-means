import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const democracyDossier = attachNarrative("democracy.md", {
  id: "democracy-dossier",
  kind: "dossier" as const,
  label: "Democracy dossier",
  description:
    "A learner-first distinction among democratic values, procedures, institutions, measurements, and bounded practice.",
  subject: { kind: "concept" as const, id: "democracy" },
  standfirst: "",
  standfirstStatementIds: [
    "democracy-usage-plural",
    "democracy-voting-boundary",
  ],
  sections: [
    {
      id: "meanings",
      heading: "Which claims can democracy make?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "democracy-usage-plural",
        "democracy-public-equality-end",
        "democracy-voting-boundary",
      ],
    },
    {
      id: "institutions",
      heading: "Which institutions can people use?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "democracy-representation-mechanism",
        "democracy-sortition-alternative",
        "democracy-voting-boundary",
      ],
      relatedEntityRefs: [
        {
          kind: "approach" as const,
          id: "representative-democratic-government",
        },
        { kind: "means" as const, id: "electoral-representation" },
        { kind: "means" as const, id: "sortition-deliberative-minipublic" },
      ],
    },
    {
      id: "measurement",
      heading: "How is democracy measured?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["democracy-measurement-selection"],
    },
    {
      id: "bounded-practice",
      heading: "What can one community process show?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["democracy-kahnawake-boundary"],
      relatedEntityRefs: [
        { kind: "case" as const, id: "kahnawake-community-lawmaking" },
      ],
    },
    {
      id: "disputes",
      heading: "Where does democratic authority stop?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "democracy-majority-limit",
        "democracy-public-equality-end",
      ],
    },
    {
      id: "comparisons",
      heading: "How does democracy differ from republic?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "republic-democracy-distinction",
        "india-democratic-republic-self-description",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});

const republicDossier = attachNarrative("republic.md", {
  id: "republic-dossier",
  kind: "dossier" as const,
  label: "Republic dossier",
  description:
    "A learner-first distinction among republic, republican traditions, democracy, and bounded institutional evidence.",
  subject: { kind: "concept" as const, id: "republic" },
  standfirst: "",
  standfirstStatementIds: [
    "republic-form-boundary",
    "republic-democracy-distinction",
    "republicanism-tradition-boundary",
  ],
  sections: [
    {
      id: "meanings",
      heading: "What can republic mean?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "republic-form-boundary",
        "republic-democracy-distinction",
        "republicanism-tradition-boundary",
      ],
    },
    {
      id: "traditions",
      heading: "What do republican traditions value?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["republic-nondomination-end"],
      relatedEntityRefs: [
        { kind: "end" as const, id: "freedom-as-nondomination" },
      ],
    },
    {
      id: "founding-claims",
      heading: "Where did Madison locate authority?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "madison-republic-popular-source",
        "us-republic-elector-boundary",
        "republic-democracy-distinction",
      ],
    },
    {
      id: "bounded-comparisons",
      heading: "Which bounded examples clarify the boundary?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "india-democratic-republic-self-description",
        "republic-kahnawake-divergence",
      ],
      relatedEntityRefs: [
        { kind: "case" as const, id: "kahnawake-community-lawmaking" },
      ],
    },
    {
      id: "disputes",
      heading: "What does the label leave unsettled?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "republic-democracy-distinction",
        "republic-nondomination-end",
        "us-republic-elector-boundary",
      ],
    },
    {
      id: "comparisons",
      heading: "How should republic and democracy be compared?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "republic-form-boundary",
        "democracy-measurement-selection",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});

type SubjectGuideDocument = Extract<
  AuthoringDocument,
  { documentType: "subject-guide" }
>;
const representativeGovernmentDossier = attachNarrative(
  "representative-democratic-government.md",
  {
    id: "representative-democratic-government-dossier",
    kind: "dossier" as const,
    label: "Representative democratic government dossier",
    description: "Electoral authorization and its democratic limits.",
    subject: {
      kind: "approach" as const,
      id: "representative-democratic-government",
    },
    standfirst: "",
    standfirstStatementIds: ["democracy-representation-mechanism"],
    sections: [
      {
        id: "what-the-approach-does",
        heading: "What does the approach do?",
        body: "",
        traceStatus: "qualified" as const,
        statementIds: [
          "democracy-representation-mechanism",
          "democracy-voting-boundary",
        ],
      },
      {
        id: "what-the-approach-cannot-prove",
        heading: "What cannot elections prove by themselves?",
        body: "",
        traceStatus: "qualified" as const,
        statementIds: ["democracy-voting-boundary", "democracy-majority-limit"],
      },
    ],
    publicationStatus: "reviewed" as const,
    reviewedAt: "2026-09-06",
  },
);
const guide = (
  id: "democracy" | "republic",
  sections: SubjectGuideDocument["guide"]["sections"],
): SubjectGuideDocument => ({
  documentType: "subject-guide" as const,
  guide: {
    id: `guide-${id}`,
    slug: id,
    label: id === "democracy" ? "Democracy" : "Republic",
    description:
      id === "democracy"
        ? "Distinguish democratic values, procedures, institutions, measurements, and bounded practice."
        : "Distinguish republic, republican traditions, democracy, and bounded institutional evidence.",
    publicationStatus: "reviewed" as const,
    primarySubject: { kind: "concept" as const, id },
    searchQueries: [
      { query: id },
      {
        query:
          id === "democracy" ? "what is democracy" : "republican government",
      },
    ],
    sections,
    reviewedAt: "2026-09-06",
  },
});

const commonEnd = (
  id: "democracy" | "republic",
  dossierId: string,
): SubjectGuideDocument["guide"]["sections"] => [
  {
    id: "short-answer",
    role: "short-answer",
    heading:
      id === "democracy" ? "What does democracy mean?" : "What is a republic?",
    narrativeRefs: [{ dossierId }],
  },
  {
    id: "meanings-and-boundaries",
    role: "meanings-and-boundaries",
    heading:
      id === "democracy"
        ? "Which democratic claims must stay separate?"
        : "Which meanings of republic must stay separate?",
    narrativeRefs: [{ dossierId, sectionId: "meanings" }],
  },
];

export const democracyRepublicGuideDocuments = [
  { documentType: "entity", entity: democracyDossier },
  { documentType: "entity", entity: republicDossier },
  { documentType: "entity", entity: representativeGovernmentDossier },
  guide("democracy", [
    ...commonEnd("democracy", "democracy-dossier"),
    {
      id: "institutions-and-mechanisms",
      role: "institutions-and-mechanisms",
      heading: "Which institutions can people use?",
      narrativeRefs: [
        { dossierId: "democracy-dossier", sectionId: "institutions" },
        { dossierId: "democracy-dossier", sectionId: "measurement" },
      ],
    },
    {
      id: "bounded-practice",
      role: "bounded-practice",
      heading: "What can one community process show?",
      narrativeRefs: [
        { dossierId: "democracy-dossier", sectionId: "bounded-practice" },
      ],
      entityRefs: [{ kind: "case", id: "kahnawake-community-lawmaking" }],
    },
    {
      id: "variants-disputes-and-limits",
      role: "variants-and-disputes",
      heading: "Where does democratic authority stop?",
      narrativeRefs: [
        { dossierId: "democracy-dossier", sectionId: "disputes" },
      ],
    },
    {
      id: "comparisons-and-next-steps",
      role: "comparisons-and-next-steps",
      heading: "How does democracy differ from republic?",
      narrativeRefs: [
        { dossierId: "democracy-dossier", sectionId: "comparisons" },
      ],
      entityRefs: [{ kind: "concept", id: "republic" }],
    },
    {
      id: "open-questions",
      role: "open-questions",
      heading: "What remains open?",
      researchObligationIds: ["democracy-inclusion-measurement-boundary"],
    },
  ] satisfies SubjectGuideDocument["guide"]["sections"]),
  guide("republic", [
    ...commonEnd("republic", "republic-dossier"),
    {
      id: "purposes-and-diagnoses",
      role: "purposes-and-diagnoses",
      heading: "What do republican traditions value?",
      narrativeRefs: [
        { dossierId: "republic-dossier", sectionId: "traditions" },
      ],
    },
    {
      id: "institutions-and-mechanisms",
      role: "institutions-and-mechanisms",
      heading: "Where did Madison locate authority?",
      narrativeRefs: [
        { dossierId: "republic-dossier", sectionId: "founding-claims" },
      ],
    },
    {
      id: "bounded-practice",
      role: "bounded-practice",
      heading: "Which bounded examples clarify the boundary?",
      narrativeRefs: [
        { dossierId: "republic-dossier", sectionId: "bounded-comparisons" },
      ],
      entityRefs: [{ kind: "case", id: "kahnawake-community-lawmaking" }],
    },
    {
      id: "variants-disputes-and-limits",
      role: "variants-and-disputes",
      heading: "What does the label leave unsettled?",
      narrativeRefs: [{ dossierId: "republic-dossier", sectionId: "disputes" }],
    },
    {
      id: "comparisons-and-next-steps",
      role: "comparisons-and-next-steps",
      heading: "How should republic and democracy be compared?",
      narrativeRefs: [
        { dossierId: "republic-dossier", sectionId: "comparisons" },
      ],
      entityRefs: [{ kind: "concept", id: "democracy" }],
    },
    {
      id: "open-questions",
      role: "open-questions",
      heading: "What remains open?",
      researchObligationIds: ["republic-self-description-exclusion-boundary"],
    },
  ] satisfies SubjectGuideDocument["guide"]["sections"]),
] satisfies AuthoringDocument[];
