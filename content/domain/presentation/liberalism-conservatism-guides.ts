import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const reviewedAt = "2026-09-06";

const liberalismDossier = attachNarrative("liberalism.md", {
  id: "liberalism-dossier",
  kind: "dossier" as const,
  label: "Liberalism dossier",
  description:
    "Liberalism's rival accounts of liberty, justified authority, institutions, and social justice, together with imperial and gender exclusions that qualify universal claims.",
  subject: { kind: "concept" as const, id: "liberalism" },
  standfirst: "",
  standfirstStatementIds: [
    "liberalism-plural-traditions",
    "liberalism-authority-justification",
    "liberalism-label-insufficient",
  ],
  sections: [
    {
      id: "meanings",
      heading: "Which liberal traditions must stay separate?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "liberalism-plural-traditions",
        "liberalism-liberty-disputes",
        "liberalism-old-new-boundary",
      ],
    },
    {
      id: "institutions",
      heading: "What does one liberal argument permit?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "mill-liberty-limiting-principle",
        "liberalism-label-insufficient",
      ],
    },
    {
      id: "exclusions",
      heading: "Who was excluded from universal claims?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "mill-colonial-exclusion",
        "mehta-liberal-empire-tension",
        "pateman-contract-gender-boundary",
      ],
    },
    {
      id: "bounded-practice",
      heading: "What do two constitutional settlements show?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "india-rights-equality",
        "japan-rights-equality-marriage",
        "japan-rights-drafting-boundary",
      ],
      relatedEntityRefs: [
        {
          kind: "case" as const,
          id: "india-constitutional-rights-settlement-1946-1950",
        },
        {
          kind: "case" as const,
          id: "japan-constitutional-rights-settlement-1946-1947",
        },
      ],
    },
    {
      id: "comparisons",
      heading: "How should liberalism be compared?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "liberalism-plural-traditions",
        "liberalism-label-insufficient",
        "conservatism-broad-narrow",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt,
});

const conservatismDossier = attachNarrative("conservatism.md", {
  id: "conservatism-dossier",
  kind: "dossier" as const,
  label: "Conservatism dossier",
  description:
    "Conservatism's disputed meanings, arguments for inheritance and prudent change, and variation between a canonical text and postwar party programs.",
  subject: { kind: "concept" as const, id: "conservatism" },
  standfirst: "",
  standfirstStatementIds: [
    "conservatism-broad-narrow",
    "conservatism-tradition-reform",
    "conservatism-authoritarian-boundary",
  ],
  sections: [
    {
      id: "meanings",
      heading: "Which meanings of conservatism must stay separate?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "conservatism-broad-narrow",
        "conservatism-tradition-reform",
        "conservatism-reaction-boundary",
        "conservatism-authoritarian-boundary",
        "conservatism-procedural-substantive",
      ],
    },
    {
      id: "arguments",
      heading: "What did Burke argue?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["burke-change-conservation", "burke-inheritance-prudence"],
    },
    {
      id: "party-programmes",
      heading: "Can a conservative party change economic programs?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "ahlen-programme-economic-order",
        "ahlen-programme-compromise",
        "duesseldorf-social-market-shift",
        "cdu-programme-change-boundary",
      ],
    },
    {
      id: "bounded-practice",
      heading: "What can the bounded examples establish?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "burke-change-conservation",
        "burke-inheritance-prudence",
        "cdu-programme-change-boundary",
      ],
      relatedEntityRefs: [
        { kind: "case" as const, id: "burke-reflections-intervention-1790" },
        { kind: "case" as const, id: "cdu-economic-programmes-1947-1949" },
      ],
    },
    {
      id: "comparisons",
      heading: "How should conservatism be compared?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "conservatism-broad-narrow",
        "conservatism-procedural-substantive",
        "cdu-programme-change-boundary",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt,
});

type Guide = Extract<AuthoringDocument, { documentType: "subject-guide" }>;

const guide = (
  id: "liberalism" | "conservatism",
  sections: Guide["guide"]["sections"],
): Guide => ({
  documentType: "subject-guide",
  guide: {
    id: `guide-${id}`,
    slug: id,
    label: id === "liberalism" ? "Liberalism" : "Conservatism",
    description:
      id === "liberalism"
        ? "Distinguish liberal claims about liberty and justified authority from particular institutions, parties, and unequal historical applications."
        : "Distinguish conservative dispositions and traditions from reaction, authoritarianism, and the changing programs of particular parties.",
    publicationStatus: "reviewed",
    primarySubject: { kind: "concept", id },
    searchQueries: [
      { query: id },
      { query: `what is ${id}` },
      { query: `${id} meaning` },
    ],
    sections,
    reviewedAt,
  },
});

export const liberalismConservatismGuideDocuments = [
  { documentType: "entity", entity: liberalismDossier },
  { documentType: "entity", entity: conservatismDossier },
  guide("liberalism", [
    {
      id: "short-answer",
      role: "short-answer",
      heading: "What is liberalism?",
      narrativeRefs: [{ dossierId: "liberalism-dossier" }],
    },
    {
      id: "meanings-and-boundaries",
      role: "meanings-and-boundaries",
      heading: "Which liberal traditions must stay separate?",
      narrativeRefs: [
        { dossierId: "liberalism-dossier", sectionId: "meanings" },
      ],
    },
    {
      id: "institutions-and-mechanisms",
      role: "institutions-and-mechanisms",
      heading: "What does one liberal argument permit?",
      narrativeRefs: [
        { dossierId: "liberalism-dossier", sectionId: "institutions" },
      ],
    },
    {
      id: "variants-disputes-and-limits",
      role: "variants-and-disputes",
      heading: "Who was excluded from universal claims?",
      narrativeRefs: [
        { dossierId: "liberalism-dossier", sectionId: "exclusions" },
      ],
    },
    {
      id: "bounded-practice",
      role: "bounded-practice",
      heading: "What do two constitutional settlements show?",
      narrativeRefs: [
        { dossierId: "liberalism-dossier", sectionId: "bounded-practice" },
      ],
      entityRefs: [
        {
          kind: "case",
          id: "india-constitutional-rights-settlement-1946-1950",
        },
        {
          kind: "case",
          id: "japan-constitutional-rights-settlement-1946-1947",
        },
      ],
    },
    {
      id: "comparisons-and-next-steps",
      role: "comparisons-and-next-steps",
      heading: "How should liberalism be compared?",
      narrativeRefs: [
        { dossierId: "liberalism-dossier", sectionId: "comparisons" },
      ],
      entityRefs: [{ kind: "concept", id: "conservatism" }],
    },
    {
      id: "open-questions",
      role: "open-questions",
      heading: "What remains open?",
      researchObligationIds: [
        "liberalism-geographic-translation",
        "liberalism-exclusion-domination",
      ],
    },
  ]),
  guide("conservatism", [
    {
      id: "short-answer",
      role: "short-answer",
      heading: "What is conservatism?",
      narrativeRefs: [{ dossierId: "conservatism-dossier" }],
    },
    {
      id: "meanings-and-boundaries",
      role: "meanings-and-boundaries",
      heading: "Which meanings must stay separate?",
      narrativeRefs: [
        { dossierId: "conservatism-dossier", sectionId: "meanings" },
      ],
    },
    {
      id: "purposes-and-diagnoses",
      role: "purposes-and-diagnoses",
      heading: "What did Burke argue?",
      narrativeRefs: [
        { dossierId: "conservatism-dossier", sectionId: "arguments" },
      ],
    },
    {
      id: "institutions-and-mechanisms",
      role: "institutions-and-mechanisms",
      heading: "Can a party change economic programs?",
      narrativeRefs: [
        { dossierId: "conservatism-dossier", sectionId: "party-programmes" },
      ],
    },
    {
      id: "bounded-practice",
      role: "bounded-practice",
      heading: "What can the bounded examples establish?",
      narrativeRefs: [
        { dossierId: "conservatism-dossier", sectionId: "bounded-practice" },
      ],
      entityRefs: [
        { kind: "case", id: "burke-reflections-intervention-1790" },
        { kind: "case", id: "cdu-economic-programmes-1947-1949" },
      ],
    },
    {
      id: "variants-disputes-and-limits",
      role: "variants-and-disputes",
      heading: "What does the label leave unsettled?",
      narrativeRefs: [
        { dossierId: "conservatism-dossier", sectionId: "meanings" },
      ],
    },
    {
      id: "comparisons-and-next-steps",
      role: "comparisons-and-next-steps",
      heading: "How should conservatism be compared?",
      narrativeRefs: [
        { dossierId: "conservatism-dossier", sectionId: "comparisons" },
      ],
      entityRefs: [{ kind: "concept", id: "liberalism" }],
    },
    {
      id: "open-questions",
      role: "open-questions",
      heading: "What remains open?",
      researchObligationIds: [
        "liberal-conservative-party-label-drift",
        "conservatism-geographic-translation",
      ],
    },
  ]),
] satisfies AuthoringDocument[];
