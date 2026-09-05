import type { AuthoringDocument } from "../../../src/lib/domain";

const citations = [
  [
    "social-democracy-contested-definition",
    "berman-social-democracy-source",
    "abstract and pp. 3495–3496",
    "supports",
    "contested-definition-berman",
  ],
  [
    "social-democracy-contested-definition",
    "gilabert-oneill-socialism-source",
    "sections 4.3, paragraph 1, and 5, ‘taming capitalism’ paragraphs 1–2",
    "qualifies",
    "contested-definition-sep",
  ],
  [
    "social-democracy-democratic-revision",
    "berman-social-democracy-source",
    "abstract and pp. 3495–3496",
    "supports",
    "revision-berman",
  ],
  [
    "social-democracy-genealogy-contested",
    "riley-bernsteins-heirs-source",
    "pp. 136–138",
    "qualifies",
    "genealogy-riley",
  ],
  [
    "social-democracy-welfare-state-form",
    "gilabert-oneill-socialism-source",
    "section 4.3, paragraph 1",
    "supports",
    "welfare-state-sep",
  ],
  [
    "social-democracy-contested-capitalism-boundary",
    "berman-social-democracy-source",
    "abstract and pp. 3495–3496",
    "supports",
    "boundary-berman",
  ],
  [
    "social-democracy-contested-capitalism-boundary",
    "gilabert-oneill-socialism-source",
    "section 5, ‘taming capitalism’ paragraphs 1–2",
    "qualifies",
    "boundary-sep",
  ],
] as const;

export const socialDemocracyRelationshipDocuments = citations.map(
  ([statementId, sourceId, locator, role, citationId]) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [
      {
        id: `social-democracy-${citationId}-citation`,
        predicate: "cites" as const,
        subject: { kind: "statement" as const, id: statementId },
        object: { kind: "source" as const, id: sourceId },
        role,
        locator,
      },
    ],
  }),
) satisfies AuthoringDocument[];
