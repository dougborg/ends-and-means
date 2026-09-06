import type { AuthoringDocument } from "../../../src/lib/domain";

const target = {
  target: { kind: "concept" as const, id: "collective-capital-formation" },
  targetSectionId: "why-can-collective-funds-lose-support",
  statementIds: [],
  obligationStatus: "open" as const,
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-05",
};

export const collectiveCapitalFormationResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-governance-exit-design",
      kind: "research-obligation",
      label: "Collective-fund governance and exit",
      description:
        "A focused question about contestation and exit without divisible personal capital claims.",
      obligationType: "counterargument",
      question:
        "Which selection, removal, contestation, and exit rules make fund governors answerable while preserving non-divisible collective capital claims?",
      addressedStatementIds: [
        "collective-capital-formation-supporter-distance",
        "collective-capital-formation-individual-saving-boundary",
      ],
      currentLimitation:
        "The evidence identifies distance from intended supporters and distinguishes collective holdings from personal accounts, but does not compare governance and exit designs.",
      evidenceNeeded:
        "Comparative evidence on governor selection and removal, contestation procedures, and forms of exit compatible with non-divisible capital claims.",
      scope:
        "Governance and exit in collectively held investment funds; excludes ordinary individual pension or savings accounts.",
      ...target,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-benefit-allocation",
      kind: "research-obligation",
      label: "Collective-fund benefit allocation",
      description:
        "A focused question about distributing recognizable benefits without dividing the fund's capital.",
      obligationType: "counterargument",
      question:
        "Which benefit-allocation rules produce concrete gains for the represented constituency while keeping the underlying capital collectively held?",
      addressedStatementIds: [
        "collective-capital-formation-unclear-benefits-objection",
        "collective-capital-formation-individual-saving-boundary",
      ],
      currentLimitation:
        "The Swedish debate records uncertainty about tangible benefits but does not establish which allocation rules make gains clear while retaining collective ownership.",
      evidenceNeeded:
        "Comparative evidence on uses of fund returns, beneficiary definitions, distributional incidence, and preservation of collective capital.",
      scope:
        "Allocation of returns or services from collective-capital institutions, distinct from dividing their underlying assets into personal accounts.",
      ...target,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-participant-understanding",
      kind: "research-obligation",
      label: "Participant understanding of collective funds",
      description:
        "A focused question about whether intended participants understand the institution and its effects.",
      obligationType: "research-gap",
      question:
        "Which explanations, disclosures, and participatory practices help intended participants understand a collective fund and recognize its effects?",
      addressedStatementIds: [
        "collective-capital-formation-supporter-distance",
        "collective-capital-formation-unclear-benefits-objection",
      ],
      currentLimitation:
        "One historical debate shows distance and unclear benefits but cannot identify which communication or participation practices improve understanding.",
      evidenceNeeded:
        "Participant research comparing comprehension, perceived relevance, disclosure practices, and opportunities to deliberate across fund designs.",
      scope:
        "Understanding among a fund's intended constituency, not general public familiarity with collective-capital terminology.",
      ...target,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-durable-support",
      kind: "research-obligation",
      label: "Durable support for collective funds",
      description:
        "A focused outcome question about support when institutional purposes compete.",
      obligationType: "counterargument",
      question:
        "Which observed institutional outcomes sustain or weaken participant and political support when capital formation and worker influence compete?",
      addressedStatementIds: [
        "collective-capital-formation-supporter-distance",
        "collective-capital-formation-purpose-objection",
      ],
      currentLimitation:
        "The Swedish case records competing purposes and weak engagement, but a single case does not identify which outcomes cause support to endure or erode.",
      evidenceNeeded:
        "Comparative longitudinal evidence connecting realized control, benefits, participation, and institutional durability to changes in support.",
      scope:
        "Observed support outcomes for collective-capital institutions; excludes claims inferred only from formal design or stated goals.",
      ...target,
    },
  },
] satisfies AuthoringDocument[];
