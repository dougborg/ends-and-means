import type { AuthoringDocument } from "../../../src/lib/domain";

const citations = [
  [
    "social-democracy-democratic-revision",
    "berman-roots-social-democracy-source",
    "abstract and pp. 113–144",
    "supports",
  ],
  [
    "social-democracy-reform-institutions",
    "gilabert-oneill-socialism-source",
    "sections 4.3 and 5",
    "supports",
  ],
  [
    "social-democracy-contested-capitalism-boundary",
    "berman-roots-social-democracy-source",
    "abstract and pp. 113–144",
    "supports",
  ],
  [
    "social-democracy-contested-capitalism-boundary",
    "gilabert-oneill-socialism-source",
    "sections 4.3 and 5",
    "qualifies",
  ],
] as const;

export const socialDemocracyRelationshipDocuments = citations.map(
  ([statementId, sourceId, locator, role], index) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [
      {
        id: `${statementId}-social-democracy-citation-${index + 1}`,
        predicate: "cites" as const,
        subject: { kind: "statement" as const, id: statementId },
        object: { kind: "source" as const, id: sourceId },
        role,
        locator,
      },
    ],
  }),
) satisfies AuthoringDocument[];
