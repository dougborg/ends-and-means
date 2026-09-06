import type { AuthoringDocument } from "../../../src/lib/domain";
const common = {
  publicationStatus: "reviewed" as const,
  obligationStatus: "open" as const,
  statementIds: [],
  reviewedAt: "2026-09-06",
};
export const anarchismResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "anarchism-property-exchange-boundaries",
      kind: "research-obligation",
      label: "Property and exchange across anarchist traditions",
      description: "A focused test of differences hidden by the family label.",
      obligationType: "research-gap",
      question:
        "How did named anarchist traditions distinguish possession, property, markets, and distribution?",
      target: { kind: "concept", id: "anarchism" },
      targetSectionId: "disputes",
      addressedStatementIds: [
        "anarchism-tradition-boundary",
        "baker-strategy-disagreement",
      ],
      currentLimitation:
        "The current sources establish strategic diversity but do not compare each tradition's property and exchange rules on common terms.",
      evidenceNeeded:
        "Located primary proposals and independent histories for mutualist, anarcho-communist, syndicalist, and individualist traditions.",
      scope:
        "Selected European and North American traditions from the nineteenth through early twentieth centuries; no universal genealogy.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "anarchism-spanish-participation-boundary",
      kind: "research-obligation",
      label: "Participation and coercion in Spanish anarchist initiatives",
      description: "A bounded counterevidence question about rules in use.",
      obligationType: "counterevidence",
      question:
        "Who could participate in, refuse, or contest selected anarchist-led institutions in Republican Spain from 1936 to 1939?",
      target: { kind: "concept", id: "anarchism" },
      targetSectionId: "spain",
      addressedStatementIds: [
        "spanish-case-plurality",
        "mujeres-libres-gender-counterevidence",
        "spanish-anarchist-gender-subordination",
        "anarchist-case-nonembodiment",
      ],
      currentLimitation:
        "The current synthesis establishes plurality and gender hierarchy but does not compare participation and coercion across institutions.",
      evidenceNeeded:
        "Institution-level rules, participant testimony, local archives, and scholarship that includes dissenters and nonparticipants.",
      scope:
        "Preselected institutions in Republican-held Spain, July 1936–1939; not the whole territory or every anarchist organization.",
      ...common,
    },
  },
] satisfies AuthoringDocument[];
