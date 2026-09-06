import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const dossier = attachNarrative("monarchy.md", {
  id: "monarchy-dossier",
  kind: "dossier" as const,
  label: "Monarchy dossier",
  description:
    "Monarchy is a governmental form organized around a continuing monarchic office. Succession, formal authority, practical power, sacred status, and democratic accountability vary independently.",
  subject: { kind: "concept" as const, id: "monarchy" },
  standfirst: "",
  standfirstStatementIds: [
    "monarchy-office-form-definition",
    "monarchy-succession-varies",
    "monarchy-democracy-boundary",
  ],
  sections: [
    {
      id: "meanings",
      heading: "What can monarchy mean?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "monarchy-office-form-definition",
        "monarchy-heredity-boundary",
        "monarchy-head-roles-boundary",
        "monarchy-democracy-boundary",
        "monarchy-authoritarian-boundary",
      ],
      relatedEntityRefs: [
        { kind: "concept" as const, id: "monarchism" },
        {
          kind: "approach" as const,
          id: "constitutional-parliamentary-monarchy",
        },
        { kind: "approach" as const, id: "executive-dynastic-monarchy" },
      ],
    },
    {
      id: "institutions",
      heading: "Which rules need separate examination?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "monarchy-succession-varies",
        "monarchy-formal-practice-boundary",
        "monarchy-reserve-delegated-boundary",
        "japan-practice-influence-question",
      ],
      relatedEntityRefs: [
        { kind: "concept" as const, id: "monarchic-succession" },
        { kind: "concept" as const, id: "executive-authority" },
        { kind: "concept" as const, id: "legislative-accountability" },
      ],
    },
    {
      id: "japan",
      heading: "What does Japan's postwar settlement separate?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "japan-constitution-commencement",
        "japan-emperor-symbol-rule",
        "japan-emperor-no-government-powers",
        "japan-emperor-cabinet-advice",
        "japan-emperor-enumerated-acts",
        "japan-succession-male-line",
        "japan-practice-influence-question",
      ],
      relatedEntityRefs: [
        {
          kind: "case" as const,
          id: "japan-symbolic-emperorship-1947-2004",
        },
      ],
    },
    {
      id: "tonga",
      heading: "What changed in Tonga in 2010?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "tonga-2013-assembly-composition",
        "tonga-king-appoints-pm",
        "tonga-retained-royal-formal-powers",
        "tonga-cabinet-executive-design",
        "tonga-2010-government-formation",
        "tonga-record-mediation-boundary",
      ],
      relatedEntityRefs: [
        {
          kind: "case" as const,
          id: "tonga-constitutional-settlement-2010-2013",
        },
      ],
    },
    {
      id: "saudi-arabia",
      heading: "How does Saudi Arabia allocate authority?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "saudi-monarchy-basic-law",
        "saudi-succession-designation",
        "saudi-crown-prince-designation",
        "saudi-basic-law-king-prime-minister-clause",
        "saudi-2022-crown-prince-prime-minister",
        "saudi-religious-law-rule",
        "saudi-theocracy-classification-boundary",
        "saudi-dynastic-rules-in-use",
        "saudi-ruling-family-institution-herb",
      ],
      relatedEntityRefs: [
        { kind: "case" as const, id: "saudi-basic-law-monarchy-1992-2022" },
      ],
    },
    {
      id: "boundaries",
      heading: "Which neighboring labels should remain separate?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "monarchy-theocracy-boundary",
        "monarchy-republic-boundary",
        "monarchy-empire-boundary",
        "monarchy-colonial-rule-boundary",
        "monarchy-nobility-boundary",
        "three-cases-nonrepresentative",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});
const constitutionalParliamentaryDossier = attachNarrative(
  "constitutional-parliamentary-monarchy.md",
  {
    id: "constitutional-parliamentary-monarchy-dossier",
    kind: "dossier" as const,
    label: "Constitutional parliamentary monarchy dossier",
    description:
      "A monarch holds the head-of-state office while ministers responsible through a legislature conduct government; formal constitutional design does not by itself establish democratic practice or a powerless monarch.",
    subject: {
      kind: "approach" as const,
      id: "constitutional-parliamentary-monarchy",
    },
    standfirst: "",
    standfirstStatementIds: [
      "monarchy-head-roles-boundary",
      "monarchy-democracy-boundary",
    ],
    sections: [
      {
        id: "design",
        heading: "How is authority allocated?",
        body: "",
        traceStatus: "qualified" as const,
        statementIds: [
          "monarchy-formal-practice-boundary",
          "monarchy-reserve-delegated-boundary",
          "japan-emperor-cabinet-advice",
          "tonga-2010-government-formation",
        ],
      },
    ],
    publicationStatus: "reviewed" as const,
    reviewedAt: "2026-09-06",
  },
);
const executiveDynasticDossier = attachNarrative(
  "executive-dynastic-monarchy.md",
  {
    id: "executive-dynastic-monarchy-dossier",
    kind: "dossier" as const,
    label: "Executive dynastic monarchy dossier",
    description:
      "The monarch retains governing authority while other ruling-family members participate in important offices and decisions; the configuration is not reducible to personal rule.",
    subject: { kind: "approach" as const, id: "executive-dynastic-monarchy" },
    standfirst: "",
    standfirstStatementIds: [
      "saudi-basic-law-king-prime-minister-clause",
      "saudi-2022-crown-prince-prime-minister",
      "saudi-dynastic-rules-in-use",
      "saudi-ruling-family-institution-herb",
    ],
    sections: [
      {
        id: "design",
        heading: "What makes the arrangement dynastic?",
        body: "",
        traceStatus: "qualified" as const,
        statementIds: [
          "saudi-monarchy-basic-law",
          "saudi-succession-designation",
          "saudi-crown-prince-designation",
          "saudi-basic-law-king-prime-minister-clause",
          "saudi-2022-crown-prince-prime-minister",
          "saudi-dynastic-rules-in-use",
          "saudi-ruling-family-institution-herb",
          "monarchy-authoritarian-boundary",
        ],
      },
    ],
    publicationStatus: "reviewed" as const,
    reviewedAt: "2026-09-06",
  },
);

export const monarchyGuideDocuments = [
  { documentType: "entity", entity: dossier },
  { documentType: "entity", entity: constitutionalParliamentaryDossier },
  { documentType: "entity", entity: executiveDynasticDossier },
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-monarchy",
      slug: "monarchy",
      label: "Monarchy",
      description:
        "Monarchy organizes government around a continuing monarchic office, but succession, legal authority, actual power, sacred status, and democratic accountability vary independently.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "concept", id: "monarchy" },
      searchQueries: [
        { query: "monarchy" },
        { query: "what is monarchy" },
        { query: "constitutional monarchy" },
        { query: "king or emperor" },
      ],
      sections: [
        {
          id: "short-answer",
          role: "short-answer",
          heading: "What is monarchy?",
          narrativeRefs: [{ dossierId: "monarchy-dossier" }],
        },
        {
          id: "meanings-and-boundaries",
          role: "meanings-and-boundaries",
          heading: "Which meanings should remain separate?",
          narrativeRefs: [
            { dossierId: "monarchy-dossier", sectionId: "meanings" },
          ],
        },
        {
          id: "institutions-and-mechanisms",
          role: "institutions-and-mechanisms",
          heading: "Who succeeds, acts, and answers?",
          narrativeRefs: [
            { dossierId: "monarchy-dossier", sectionId: "institutions" },
          ],
          entityRefs: [{ kind: "concept", id: "monarchic-succession" }],
        },
        {
          id: "bounded-practice",
          role: "bounded-practice",
          heading: "How do three bounded records differ?",
          narrativeRefs: [
            { dossierId: "monarchy-dossier", sectionId: "japan" },
            { dossierId: "monarchy-dossier", sectionId: "tonga" },
            { dossierId: "monarchy-dossier", sectionId: "saudi-arabia" },
          ],
          entityRefs: [
            { kind: "case", id: "japan-symbolic-emperorship-1947-2004" },
            {
              kind: "case",
              id: "tonga-constitutional-settlement-2010-2013",
            },
            { kind: "case", id: "saudi-basic-law-monarchy-1992-2022" },
          ],
        },
        {
          id: "variants-and-disputes",
          role: "variants-and-disputes",
          heading: "Where can formal design mislead?",
          statementIds: [
            "monarchy-formal-practice-boundary",
            "monarchy-democracy-boundary",
            "monarchy-authoritarian-boundary",
            "monarchy-theocracy-boundary",
            "three-cases-nonrepresentative",
          ],
          researchObligationIds: [
            "monarchy-formal-power-rules-in-use",
            "monarchy-personal-influence-reserve-power",
          ],
        },
        {
          id: "comparisons-and-next-steps",
          role: "comparisons-and-next-steps",
          heading: "What should monarchy be compared with?",
          narrativeRefs: [
            { dossierId: "monarchy-dossier", sectionId: "boundaries" },
          ],
          entityRefs: [
            { kind: "concept", id: "republic" },
            { kind: "concept", id: "democracy" },
            { kind: "concept", id: "authoritarianism" },
            { kind: "concept", id: "theocracy" },
            { kind: "concept", id: "executive-authority" },
            { kind: "concept", id: "legislative-accountability" },
          ],
          relationshipIds: [
            "monarchy-related-to-republic",
            "monarchy-related-to-democracy",
            "monarchy-related-to-authoritarianism",
            "monarchy-related-to-theocracy",
            "monarchy-related-to-executive-authority",
            "monarchy-related-to-legislative-accountability",
          ],
        },
        {
          id: "open-questions",
          role: "open-questions",
          heading: "What evidence remains open?",
          researchObligationIds: [
            "monarchy-formal-power-rules-in-use",
            "monarchy-personal-influence-reserve-power",
            "monarchy-gendered-succession-membership",
            "tonga-colonial-missionary-mediation",
          ],
        },
      ],
      reviewedAt: "2026-09-06",
    },
  },
] satisfies AuthoringDocument[];
