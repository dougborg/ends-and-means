import type { AuthoringDocument } from "../../../src/lib/domain";

const citations = [
  [
    "economic-democracy-contested-scope",
    "herzog-economic-democracy-source",
    "introduction, paragraphs 1–7; section 1.2, paragraphs 1–10",
    "supports",
    "scope-herzog",
  ],
  [
    "economic-democracy-contested-scope",
    "adamson-economic-democracy-source",
    "abstract",
    "qualifies",
    "scope-adamson",
  ],
  [
    "economic-democracy-workplace-institutions",
    "herzog-economic-democracy-source",
    "section 4.1, paragraphs 1–31",
    "supports",
    "workplace-institutions-herzog",
  ],
  [
    "economic-democracy-economy-wide-institutions",
    "herzog-economic-democracy-source",
    "section 1.2, paragraphs 2–10; section 4.2, paragraphs 1–12",
    "supports",
    "economy-wide-institutions-herzog",
  ],
  [
    "adamson-representative-firm-governance",
    "adamson-economic-democracy-source",
    "abstract",
    "supports",
    "representative-governance-adamson",
  ],
  [
    "economic-democracy-beyond-workplace",
    "herzog-economic-democracy-source",
    "section 4.2, paragraphs 1–12",
    "supports",
    "beyond-workplace-herzog",
  ],
  [
    "economic-democracy-ownership-is-not-control",
    "herzog-economic-democracy-source",
    "section 4.1, employee ownership paragraphs 1–5 and codetermination paragraphs 1–3",
    "supports",
    "ownership-control-herzog",
  ],
  [
    "economic-democracy-design-and-evidence-limits",
    "herzog-economic-democracy-source",
    "sections 3.2–3.3 and section 5.3",
    "supports",
    "limits-herzog",
  ],
  [
    "economic-democracy-serious-objections",
    "herzog-economic-democracy-source",
    "sections 3.1–3.3",
    "supports",
    "objections-herzog",
  ],
] as const;

export const economicDemocracyRelationshipDocuments = citations.map(
  ([statementId, sourceId, locator, role, citationId]) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [
      {
        id: `economic-democracy-${citationId}-citation`,
        predicate: "cites" as const,
        subject: { kind: "statement" as const, id: statementId },
        object: { kind: "source" as const, id: sourceId },
        role,
        locator,
      },
    ],
  }),
) satisfies AuthoringDocument[];
