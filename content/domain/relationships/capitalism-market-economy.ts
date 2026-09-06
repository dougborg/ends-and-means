import type { AuthoringDocument } from "../../../src/lib/domain";

export const capitalismMarketCitations = [
  [
    "capitalism-definition-contested",
    "sep-capitalism-source",
    "section 1, paragraph 1",
    "supports",
  ],
  [
    "capitalism-market-boundary",
    "hodgson-conceptualizing-capitalism-source",
    "chapter 10 abstract, paragraph 1; DOI 10.7208/chicago/9780226168142.003.0010",
    "supports",
  ],
  [
    "capitalism-institutional-definition",
    "hodgson-conceptualizing-capitalism-source",
    "chapter 10 abstract, paragraph 1; DOI 10.7208/chicago/9780226168142.003.0010",
    "supports",
  ],
  [
    "capitalism-marx-definition",
    "marx-capital-volume-one-source",
    "chapter 7, section 2, paragraphs beginning ‘Therefore, the value of labour-power’ and ‘This metamorphosis’",
    "supports",
  ],
  [
    "capitalism-polanyi-definition",
    "polanyi-great-transformation-source",
    "chapter 6, p. 76",
    "supports",
  ],
  [
    "property-possession-boundary",
    "hodgson-conceptualizing-capitalism-source",
    "chapter 4 abstract, paragraph 1; DOI 10.7208/chicago/9780226168142.003.0004",
    "supports",
  ],
  [
    "property-rights-plural",
    "hohfeld-fundamental-legal-conceptions-source",
    "p. 30, table of jural correlatives",
    "supports",
  ],
  [
    "wage-labor-boundary",
    "hodgson-conceptualizing-capitalism-source",
    "chapter 9 abstract, paragraph 1; DOI 10.7208/chicago/9780226168142.003.0009",
    "supports",
  ],
  [
    "wage-labor-history-limit",
    "hodgson-conceptualizing-capitalism-source",
    "chapter 9 abstract, paragraph 1; DOI 10.7208/chicago/9780226168142.003.0009",
    "supports",
  ],
  [
    "commodity-production-boundary",
    "sep-markets-2026-source",
    "section 1, paragraphs 4–5",
    "supports",
  ],
  [
    "firm-market-boundary",
    "sep-markets-2026-source",
    "section 1, paragraph 3",
    "supports",
  ],
  [
    "capital-finance-boundary",
    "hodgson-conceptualizing-capitalism-source",
    "chapter 6 abstract, paragraph 1; DOI 10.7208/chicago/9780226168142.003.0006",
    "supports",
  ],
  [
    "market-definition-exchange",
    "sep-markets-2026-source",
    "section 1, paragraph 1",
    "supports",
  ],
  [
    "market-economy-plural-allocation",
    "sep-markets-2026-source",
    "section 1, paragraph 3",
    "supports",
  ],
  [
    "market-state-boundary",
    "sep-markets-2026-source",
    "section 4.1, paragraph 1",
    "supports",
  ],
  [
    "market-ownership-boundary",
    "sep-markets-2026-source",
    "section 1, paragraphs 4–5",
    "supports",
  ],
  [
    "market-laissez-faire-boundary",
    "sep-markets-2026-source",
    "section 4.3, paragraph 1",
    "supports",
  ],
  [
    "smith-exchange-division-labor",
    "smith-wealth-nations-cannan-source",
    "Book I, chapter III, paragraph 1",
    "supports",
  ],
  [
    "england-brenner-class-thesis",
    "brenner-agrarian-class-structure-source",
    "p. 31",
    "supports",
  ],
  [
    "england-brenner-rival-explanations",
    "aston-philpin-brenner-debate-source",
    "introduction, p. 2",
    "supports",
  ],
  [
    "ghana-cocoa-smallholder-expansion",
    "austin-ghana-cocoa-source",
    "abstract, paragraph 1",
    "supports",
  ],
  [
    "ghana-cocoa-resource-reallocation",
    "austin-ghana-cocoa-source",
    "abstract, paragraph 2",
    "supports",
  ],
  [
    "ghana-cocoa-classification-limit",
    "austin-ghana-cocoa-source",
    "abstract, paragraph 1",
    "supports",
  ],
  [
    "china-dual-track-coordination",
    "naughton-growing-out-plan-source",
    "chapter 3 online summary, paragraph 1",
    "supports",
  ],
  [
    "china-tve-ownership-boundary",
    "naughton-growing-out-plan-source",
    "chapter 4 online summary, paragraph 2",
    "supports",
  ],
  [
    "china-marketization-classification-limit",
    "naughton-growing-out-plan-source",
    "book preface online summary, paragraph 1",
    "supports",
  ],
  [
    "england-case-period-boundary",
    "brenner-agrarian-class-structure-source",
    "pp. 30–31",
    "context",
  ],
  [
    "ghana-case-period-boundary",
    "austin-ghana-cocoa-source",
    "title and abstract, paragraph 1",
    "supports",
  ],
  [
    "china-case-period-boundary",
    "naughton-growing-out-plan-source",
    "title and copyright-page bibliographic record",
    "supports",
  ],
  [
    "china-nonstate-sector-growth",
    "naughton-growing-out-plan-source",
    "chapter 4 online summary, paragraph 1",
    "supports",
  ],
  [
    "capitalism-legal-order-relation",
    "hodgson-conceptualizing-capitalism-source",
    "chapter 10 abstract, paragraph 1; DOI 10.7208/chicago/9780226168142.003.0010",
    "supports",
  ],
  [
    "capitalism-private-property-relation",
    "hodgson-conceptualizing-capitalism-source",
    "chapter 10 abstract, paragraph 1; DOI 10.7208/chicago/9780226168142.003.0010",
    "supports",
  ],
  [
    "market-economy-firm-relation",
    "sep-markets-2026-source",
    "section 1, paragraph 3",
    "supports",
  ],
  [
    "capitalism-market-economy-relation",
    "hodgson-conceptualizing-capitalism-source",
    "chapter 10 abstract, paragraph 1; DOI 10.7208/chicago/9780226168142.003.0010",
    "supports",
  ],
] as const;

const capitalism = { kind: "concept" as const, id: "capitalism" };
const marketEconomy = { kind: "concept" as const, id: "market-economy" };
const related = (
  subject: typeof capitalism | typeof marketEconomy,
  objectId: string,
  statementIds: string[],
) => ({
  id: `${subject.id}-related-to-${objectId}`,
  predicate: "related-to" as const,
  subject,
  object: { kind: "concept" as const, id: objectId },
  status: "qualified" as const,
  statementIds,
});

export const capitalismMarketRelationshipDocuments = [
  {
    documentType: "relationships",
    subject: capitalism,
    relationships: [
      related(capitalism, "market-economy", [
        "capitalism-market-economy-relation",
      ]),
      related(capitalism, "private-property", [
        "capitalism-private-property-relation",
      ]),
      related(capitalism, "wage-labor", [
        "capitalism-institutional-definition",
        "wage-labor-history-limit",
      ]),
      related(capitalism, "finance", [
        "capitalism-institutional-definition",
        "capital-finance-boundary",
      ]),
      related(capitalism, "legal-order", ["capitalism-legal-order-relation"]),
    ],
  },
  {
    documentType: "relationships",
    subject: marketEconomy,
    relationships: [
      related(marketEconomy, "business-firm", ["market-economy-firm-relation"]),
      related(marketEconomy, "legal-order", ["market-state-boundary"]),
    ],
  },
  ...capitalismMarketCitations.map(
    ([statementId, sourceId, locator, role], index) => ({
      documentType: "relationships" as const,
      subject: { kind: "statement" as const, id: statementId },
      relationships: [
        {
          id: `${statementId}-citation-${index + 1}`,
          predicate: "cites" as const,
          subject: { kind: "statement" as const, id: statementId },
          object: { kind: "source" as const, id: sourceId },
          role,
          locator,
          status: "reviewed" as const,
        },
      ],
    }),
  ),
] satisfies AuthoringDocument[];
