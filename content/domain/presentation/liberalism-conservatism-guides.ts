import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const reviewedAt = "2026-09-06";

const liberalismDossier = attachNarrative("liberalism.md", {
  id: "liberalism-dossier",
  kind: "dossier" as const,
  label: "Liberalism dossier",
  description:
    "Liberalism names competing traditions centered on liberty and justified authority, not one institutional package. British-imperial and gender critiques qualify the reach of those claims, while racial and class exclusions still require separate evidence.",
  subject: { kind: "concept" as const, id: "liberalism" },
  standfirst: "",
  standfirstStatementIds: [
    "liberalism-plural-traditions",
    "liberalism-authority-justification",
    "liberalism-label-insufficient",
    "mill-colonial-exclusion",
    "mehta-liberal-empire-tension",
    "pateman-contract-gender-boundary",
    "liberalism-exclusion-evidence-limit",
    "liberalism-atlantic-taxonomy-limit",
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
        "bell-rival-liberalism-methods",
        "liberalism-atlantic-taxonomy-limit",
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
        "liberalism-exclusion-evidence-limit",
      ],
    },
    {
      id: "bounded-practice",
      heading: "What do two constitutional settlements show?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "india-equality-before-law",
        "india-discrimination-grounds",
        "india-special-provisions",
        "india-liberal-rights-test",
        "japan-legal-equality",
        "japan-marriage-consent",
        "japan-spousal-equality",
        "japan-rights-drafting-boundary",
        "japan-liberal-rights-test",
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
    "Conservatism can name a disposition or a self-conscious tradition, with rival procedural and substantive definitions. British housing and Indian opposition cases test two classified programs without making either a universal model.",
  subject: { kind: "concept" as const, id: "conservatism" },
  standfirst: "",
  standfirstStatementIds: [
    "conservatism-broad-narrow",
    "conservatism-tradition-reform",
    "conservatism-authoritarian-boundary",
    "conservatism-procedural-substantive",
    "right-to-buy-conservatism-boundary",
    "swatantra-conservatism-boundary",
    "conservatism-genealogy-limit",
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
        "huntington-rival-conservatism-types",
        "conservatism-genealogy-limit",
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
      heading: "How did one Christian-democratic program change?",
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
        "right-to-buy-conservative-programme",
        "right-to-buy-statutory-rules",
        "right-to-buy-distribution",
        "right-to-buy-conservatism-boundary",
        "swatantra-economic-conservatism",
        "swatantra-ordered-progress",
        "swatantra-gender-limit",
        "swatantra-opposition-practices",
        "swatantra-conservatism-boundary",
      ],
      relatedEntityRefs: [
        { kind: "case" as const, id: "right-to-buy-england-wales-1980-1988" },
        {
          kind: "case" as const,
          id: "swatantra-opposition-organization-1959-1967",
        },
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
        "right-to-buy-conservatism-boundary",
        "swatantra-conservatism-boundary",
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
        ? "Liberalism contains competing accounts of liberty and justified authority whose institutional meanings and historical exclusions must be specified."
        : "Conservatism can name a disposition or political tradition, and its relationship to reform, authority, and party programs remains disputed.",
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
        "liberalism-imperial-domination",
        "liberalism-gender-contract-boundary",
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
      heading: "How did one Christian-democratic program change?",
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
        { kind: "case", id: "right-to-buy-england-wales-1980-1988" },
        { kind: "case", id: "swatantra-opposition-organization-1959-1967" },
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
        "conservative-party-programme-drift",
        "conservatism-geographic-translation",
      ],
    },
  ]),
] satisfies AuthoringDocument[];
