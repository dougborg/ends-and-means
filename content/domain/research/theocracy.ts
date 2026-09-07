import type { AuthoringDocument } from "../../../src/lib/domain";

const common = {
  publicationStatus: "reviewed" as const,
  obligationStatus: "open" as const,
  statementIds: [],
  reviewedAt: "2026-09-07",
};
export const theocracyResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "theocracy-threshold-religious-review",
      kind: "research-obligation",
      label: "Threshold from religious review to theocratic rule",
      description:
        "A comparative threshold question about legally binding religious authority.",
      obligationType: "research-gap",
      question:
        "When does official religion or religious-law review become theocratic governing authority rather than a bounded constitutional rule?",
      target: { kind: "concept", id: "theocracy" },
      addressedStatementIds: [
        "theocracy-state-religion-boundary",
        "theocracy-religious-law-boundary",
        "constitutional-theocracy-hybrid",
      ],
      currentLimitation:
        "The reviewed definitions identify relevant powers but do not establish a cross-system threshold that survives different court structures and legal traditions.",
      evidenceNeeded:
        "Comparative constitutional studies of appointment, jurisdiction, review finality, enforcement, amendment, and institutional override in named systems.",
      scope:
        "Formal and practiced public-law institutions; religious demographics and private observance are excluded.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "iran-elections-institutional-autonomy",
      kind: "research-obligation",
      label: "Iranian elections and institutional autonomy",
      description:
        "A rules-in-use question about elected institutions under supervisory powers.",
      obligationType: "counterevidence",
      question:
        "When have Iran's elected executive and legislative institutions exercised consequential autonomy despite candidate screening, religious-law review, and leadership powers?",
      target: { kind: "concept", id: "theocracy" },
      addressedStatementIds: [
        "iran-popular-elections",
        "iran-guardian-council-elections",
        "iran-leader-powers",
        "iran-classification-qualified",
      ],
      currentLimitation:
        "The constitutional text allocates powers but does not measure electoral competition, legislative bargaining, policy divergence, enforcement, or informal intervention after 1989.",
      evidenceNeeded:
        "Periodized Persian-language election records, candidate decisions, legislation, implementation evidence, and rival Iranian and diasporic scholarship.",
      scope:
        "Iranian national institutions from 1989 onward, disaggregated by electoral period and office.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "vatican-delegated-power-practice",
      kind: "research-obligation",
      label: "Delegated and practiced authority in Vatican City",
      description:
        "A rules-in-use question about plenary authority and delegated government.",
      obligationType: "counterevidence",
      question:
        "How often and through which procedures have Vatican City's delegated legislative, executive, and judicial organs acted independently of papal reservation since June 2023?",
      target: { kind: "concept", id: "theocracy" },
      addressedStatementIds: [
        "vatican-pope-sovereign",
        "vatican-legislative-commission",
        "vatican-executive-governorate",
        "vatican-judicial-name",
        "vatican-delegation-boundary",
      ],
      currentLimitation:
        "The Fundamental Law specifies formal delegation, while the reviewed first-year official account does not provide a complete independent record of decisions, reservations, reversals, or judicial administration.",
      evidenceNeeded:
        "Dated legislation, administrative acts, judicial records, reservation decisions, and Catholic canonical-law scholarship that distinguishes state from ecclesial jurisdiction.",
      scope:
        "Vatican City State from 7 June 2023 onward; Holy See governance outside state jurisdiction is excluded.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "theocracy-category-travel",
      kind: "research-obligation",
      label: "Travel of theocracy across theological vocabularies",
      description:
        "A translation and comparison question about a Greek-derived category.",
      obligationType: "counterargument",
      question:
        "Which local concepts in Persian, Arabic, and Italian legal and theological vocabularies align with, resist, or change the analytical category theocracy?",
      target: { kind: "concept", id: "theocracy" },
      addressedStatementIds: [
        "theocracy-contested-family",
        "theocracy-hierocracy-boundary",
        "iran-hybrid-rival-reading",
        "pope-religious-state-office",
      ],
      currentLimitation:
        "The English-language category can compress distinct claims about divine sovereignty, guardianship, jurisprudence, canon law, ecclesial office, and territorial sovereignty.",
      evidenceNeeded:
        "Versioned original-language constitutional and canonical texts, translator notes, conceptual histories, and scholarship by Iranian, Arabic-language, and Catholic legal scholars.",
      scope:
        "Named legal and theological terms in bounded texts and institutions; no claim that one vocabulary represents a religion or language community as a whole.",
      ...common,
    },
  },
] satisfies AuthoringDocument[];
