import type { AuthoringDocument } from "../../../src/lib/domain";

const concept = {
  kind: "concept" as const,
  id: "collective-capital-formation",
};

const citations = [
  [
    "collective-capital-formation-working-definition",
    "meidner-collective-asset-formation-source",
    "pp. 303–306",
    "supports",
    "working-definition-meidner",
  ],
  [
    "collective-capital-formation-working-definition",
    "furendal-oneill-collective-capital-source",
    "section 2, pp. 308–311",
    "supports",
    "working-definition-furendal",
  ],
  [
    "collective-capital-formation-national-accounts-boundary",
    "oecd-understanding-national-accounts-source",
    "chapter 5, p. 144, ‘Gross fixed capital formation’",
    "supports",
    "national-accounts-boundary",
  ],
  [
    "collective-capital-formation-individual-saving-boundary",
    "meidner-collective-asset-formation-source",
    "pp. 303–305 and 311–313",
    "supports",
    "individual-saving-boundary",
  ],
  [
    "collective-capital-formation-design-choices",
    "furendal-oneill-collective-capital-source",
    "section 2, pp. 310–312",
    "supports",
    "design-choices-furendal",
  ],
  [
    "collective-capital-formation-design-choices",
    "warner-asymmetric-mobilisation-source",
    "section ‘The changing content of the funds’, paragraphs discussing the 1981 design and cash levy",
    "supports",
    "design-choices-warner",
  ],
  [
    "meidner-collective-funds-proposal",
    "meidner-collective-asset-formation-source",
    "pp. 303–310",
    "supports",
    "meidner-proposal",
  ],
  [
    "collective-capital-formation-rights-boundary",
    "furendal-oneill-collective-capital-source",
    "sections 2 and 4.2, pp. 310–312 and 322–325",
    "supports",
    "rights-boundary-furendal",
  ],
  [
    "collective-capital-formation-rights-boundary",
    "wright-envisioning-real-utopias-source",
    "chapter 5, pp. 75–76",
    "supports",
    "rights-boundary-wright",
  ],
  [
    "collective-capital-formation-swedish-case-boundary",
    "swedish-wage-earner-funds-proposition",
    "sections 2.2–2.3 and 4.1–4.3",
    "supports",
    "swedish-case-proposition",
  ],
  [
    "collective-capital-formation-swedish-case-boundary",
    "pontusson-kuruvilla-economic-democracy-source",
    "pp. 783–789",
    "qualifies",
    "swedish-case-assessment",
  ],
  [
    "collective-capital-formation-beneficiary-distance-objection",
    "warner-asymmetric-mobilisation-source",
    "section ‘The changing content of the funds’, paragraphs on individual connection and the 1981 congresses",
    "supports",
    "beneficiary-distance",
  ],
] as const;

export const collectiveCapitalFormationRelationshipDocuments = [
  {
    documentType: "relationships",
    subject: concept,
    relationships: [
      {
        id: "collective-capital-formation-related-to-social-ownership",
        predicate: "related-to",
        subject: concept,
        object: { kind: "concept", id: "social-ownership" },
        status: "qualified",
        statementIds: ["collective-capital-formation-rights-boundary"],
      },
      {
        id: "collective-capital-formation-related-to-economic-democracy",
        predicate: "related-to",
        subject: concept,
        object: { kind: "concept", id: "economic-democracy" },
        status: "qualified",
        statementIds: ["collective-capital-formation-design-choices"],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: { kind: "case", id: "swedish-wage-earner-funds" },
    relationships: [
      {
        id: "swedish-funds-contested-collective-capital-formation",
        predicate: "contested-in-case",
        subject: { kind: "case", id: "swedish-wage-earner-funds" },
        object: concept,
        status: "qualified",
        statementIds: ["collective-capital-formation-swedish-case-boundary"],
      },
    ],
  },
  ...citations.map(([statementId, sourceId, locator, role, id]) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [
      {
        id: `collective-capital-formation-${id}-citation`,
        predicate: "cites" as const,
        subject: { kind: "statement" as const, id: statementId },
        object: { kind: "source" as const, id: sourceId },
        role,
        locator,
      },
    ],
  })),
] satisfies AuthoringDocument[];
