import type { AuthoringDocument } from "../../../src/lib/domain";

const common = {
  target: { kind: "concept" as const, id: "monarchy" },
  statementIds: [],
  obligationStatus: "open" as const,
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
};
export const monarchyResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "monarchy-formal-power-rules-in-use",
      kind: "research-obligation",
      label: "Formal monarchic power and rules in use",
      description:
        "A focused comparison of legal authority and observed practice.",
      obligationType: "counterevidence",
      question:
        "When do formal powers over appointment, dismissal, legislation, or dissolution predict a monarch's observed interventions?",
      targetSectionId: "institutions",
      addressedStatementIds: [
        "monarchy-formal-practice-boundary",
        "monarchy-reserve-delegated-boundary",
      ],
      currentLimitation:
        "The present evidence identifies the distinction but does not compare preselected interventions under common criteria across the three cases.",
      evidenceNeeded:
        "Official acts, ministerial records, court decisions, legislative proceedings, and independent histories for specified decisions, including non-use of available powers.",
      scope:
        "The cited Japanese postwar materials, Tonga's 2010 reform and election, and Saudi Arabia's 1992/2005 consolidation plus 2022 order; no inference to current completeness or all monarchies.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "monarchy-personal-influence-reserve-power",
      kind: "research-obligation",
      label: "Personal influence, delegated acts, and reserve power",
      description:
        "A focused question separating access and persuasion from legal discretion.",
      obligationType: "research-gap",
      question:
        "How can personal influence be distinguished from ministerially directed official acts and legally reserved discretion in a named monarchic decision?",
      targetSectionId: "institutions",
      addressedStatementIds: [
        "monarchy-formal-practice-boundary",
        "japan-practice-influence-question",
      ],
      currentLimitation:
        "Public ceremony and access may coexist with private consultation, but the current sources do not trace a comparable decision process in each case.",
      evidenceNeeded:
        "Contemporaneous correspondence, diaries, cabinet or palace records, participant testimony, and the legal instrument governing the same decision.",
      scope:
        "Named decisions within one bounded reign and constitutional period; reputation or visibility alone is not influence.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "monarchy-gendered-succession-membership",
      kind: "research-obligation",
      label: "Gendered succession and dynastic membership",
      description:
        "A focused distributional comparison of eligibility and membership rules.",
      obligationType: "counterargument",
      question:
        "How do gender, descent line, marriage, adoption, and designation rules distribute eligibility for succession and membership in the dynasty?",
      addressedStatementIds: [
        "monarchy-succession-varies",
        "japan-succession-male-line",
        "saudi-succession-designation",
        "saudi-crown-prince-designation",
      ],
      currentLimitation:
        "The current sources locate male-line and dynastic restrictions but do not compare how membership loss, marriage, or contested eligibility operates in practice.",
      evidenceNeeded:
        "Current succession statutes and decrees in the original language, official translations, genealogical eligibility records, dispute records, and scholarship centered on affected members.",
      scope:
        "Japan's 1947 Imperial House Act text and Saudi Arabia's Basic Law consolidation through 2005 plus the 2022 order; later changes and other monarchies require separate review.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "tonga-colonial-missionary-mediation",
      kind: "research-obligation",
      label:
        "Colonial and missionary mediation of Tonga's constitutional record",
      description:
        "A provenance question about language, drafting, and institutional translation.",
      obligationType: "research-gap",
      question:
        "Which Tongan actors, missionary advisers, and colonial relationships shaped the 1875 Constitution's categories, translations, and later interpretation?",
      targetSectionId: "tonga",
      addressedStatementIds: ["tonga-record-mediation-boundary"],
      currentLimitation:
        "The consulted consolidation does not identify its translator or source-text provenance, and the present evidence does not compare versioned Tongan texts, drafting records, or Tongan interpretations.",
      evidenceNeeded:
        "Versioned Tongan and English constitutional texts, archival drafting correspondence, Tongan-language scholarship, oral-history provenance where appropriate, and histories identifying translators and advisers.",
      scope:
        "The making and later use of Tonga's 1875 constitutional record through the 2010 settlement; not a claim that external mediation displaced Tongan agency.",
      ...common,
    },
  },
] satisfies AuthoringDocument[];
