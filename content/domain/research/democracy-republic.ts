import type { AuthoringDocument } from "../../../src/lib/domain";

const common = {
  publicationStatus: "reviewed" as const,
  obligationStatus: "open" as const,
  statementIds: [],
  reviewedAt: "2026-09-06",
};

export const democracyRepublicResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "democracy-inclusion-measurement-boundary",
      kind: "research-obligation",
      label: "Inclusion and democratic measurement",
      description:
        "A focused counterevidence question about formal inclusion and effective influence.",
      obligationType: "counterevidence",
      question:
        "When do formal voting rights fail to produce meaningfully equal influence for differently situated groups?",
      target: { kind: "concept", id: "democracy" },
      targetSectionId: "measurement",
      addressedStatementIds: ["democracy-measurement-selection"],
      currentLimitation:
        "The current evidence distinguishes procedures from measured attributes but does not compare how exclusion, unequal resources, and institutional design alter influence in named cases.",
      evidenceNeeded:
        "Preselected case comparisons with formal rules, participation and representation data, group-specific outcomes, and evidence from excluded or underrepresented participants.",
      scope:
        "Named institutions and populations under specified rules and periods; not a single global ranking of democratic worth.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "republic-self-description-exclusion-boundary",
      kind: "research-obligation",
      label: "Republican self-description and exclusion",
      description:
        "A focused counterargument about constitutional labels and political membership.",
      obligationType: "counterargument",
      question:
        "Which historical republics coupled popular-government claims with exclusions from citizenship, office, or suffrage?",
      target: { kind: "concept", id: "republic" },
      targetSectionId: "disputes",
      addressedStatementIds: [
        "republic-democracy-distinction",
        "republic-nondomination-end",
        "us-republic-elector-boundary",
      ],
      currentLimitation:
        "The present sources establish that popular derivation and democratic inclusion are distinct but do not yet compare exclusions across republics on common terms.",
      evidenceNeeded:
        "Constitutional texts, franchise and officeholding rules, contemporary claims by excluded people, and independent histories for a preselected cross-regional set of republics.",
      scope:
        "Named constitutional orders and periods; no inference that every republic shared one exclusion regime.",
      ...common,
    },
  },
] satisfies AuthoringDocument[];
