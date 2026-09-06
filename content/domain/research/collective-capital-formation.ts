import type { AuthoringDocument } from "../../../src/lib/domain";

export const collectiveCapitalFormationResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-accountability-design",
      kind: "research-obligation",
      label: "Accountable collective capital governance",
      description:
        "A focused institutional question about making collective funds answerable and materially legible to their intended constituency.",
      obligationType: "counterargument",
      question:
        "Which governance, benefit, and exit rules let intended beneficiaries contest collective-fund decisions and recognize concrete gains without converting the fund into divisible individual accounts?",
      target: { kind: "concept", id: "collective-capital-formation" },
      targetSectionId: "why-can-collective-funds-lose-support",
      addressedStatementIds: [
        "collective-capital-formation-beneficiary-distance-objection",
      ],
      statementIds: [],
      obligationStatus: "open",
      currentLimitation:
        "The Swedish debate identifies distance and weak individual connection as political problems, but one historical case cannot establish which governance design resolves them across institutions or constituencies.",
      evidenceNeeded:
        "Comparative evidence on fund elections, removal and contestation rights, benefit allocation, participant understanding, and durable support across collective-capital institutions.",
      scope:
        "Collectively governed investment funds with non-divisible capital claims; excludes ordinary individual pension or savings accounts.",
      publicationStatus: "reviewed",
      reviewedAt: "2026-09-05",
    },
  },
] satisfies AuthoringDocument[];
