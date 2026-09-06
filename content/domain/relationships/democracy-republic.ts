import type { AuthoringDocument } from "../../../src/lib/domain";

const citations = [
  [
    "democracy-usage-plural",
    "sep-democracy-source",
    "section 1, paragraphs 1–7",
    "supports",
    "uses",
  ],
  [
    "democracy-public-equality-end",
    "sep-democracy-source",
    "section 2.2.3, paragraphs 1–8",
    "supports",
    "equality",
  ],
  [
    "democracy-voting-boundary",
    "sep-democracy-source",
    "section 1, paragraphs 4–7",
    "qualifies",
    "voting",
  ],
  [
    "democracy-representation-mechanism",
    "sep-democracy-source",
    "section 4.2, paragraphs 1–5",
    "supports",
    "representation",
  ],
  [
    "democracy-sortition-alternative",
    "sep-democracy-source",
    "section 4.2.6, paragraphs 1–2",
    "supports",
    "sortition",
  ],
  [
    "democracy-measurement-selection",
    "idea-democracy-indices-methodology-source",
    "chapter 1, ‘The objective’; chapter 2, ‘Measuring the Global State of Democracy’",
    "supports",
    "measurement",
  ],
  [
    "democracy-kahnawake-boundary",
    "horn-miller-indigenous-participatory-democracy-source",
    "pp. 113–118, CDMP as a bridge between systems",
    "supports",
    "kahnawake",
  ],
  [
    "democracy-majority-limit",
    "sep-democracy-source",
    "section 3.3, paragraphs 1–9",
    "supports",
    "majority-limit",
  ],
  [
    "republic-form-boundary",
    "sep-republicanism-source",
    "section 1, paragraphs 1–6",
    "supports",
    "form",
  ],
  [
    "republic-democracy-distinction",
    "federalist-39-source",
    "paragraphs beginning “What, then, are the distinctive characters” and “It is sufficient for such a government”",
    "supports",
    "democracy-boundary",
  ],
  [
    "republicanism-tradition-boundary",
    "sep-republicanism-source",
    "section 1, paragraphs 1–6",
    "supports",
    "tradition",
  ],
  [
    "republic-nondomination-end",
    "sep-republicanism-source",
    "section 1.2, paragraphs 1–6",
    "supports",
    "nondomination",
  ],
  [
    "madison-republic-popular-source",
    "federalist-39-source",
    "paragraph beginning “If we resort for a criterion”",
    "supports",
    "madison",
  ],
  [
    "india-democratic-republic-self-description",
    "india-constitution-source",
    "Preamble; article 326",
    "supports",
    "india",
  ],
  [
    "us-republic-elector-boundary",
    "us-constitution-source",
    "Article I, section 2, clause 1",
    "supports",
    "elector-boundary",
  ],
  [
    "republic-kahnawake-divergence",
    "horn-miller-indigenous-participatory-democracy-source",
    "pp. 111–118, community and institutional account of the CDMP",
    "context",
    "kahnawake-divergence",
  ],
] as const;

const democracy = { kind: "concept" as const, id: "democracy" };
const republic = { kind: "concept" as const, id: "republic" };
const approach = {
  kind: "approach" as const,
  id: "representative-democratic-government",
};

export const democracyRepublicRelationshipDocuments = [
  {
    documentType: "relationships",
    subject: democracy,
    relationships: [
      {
        id: "democracy-related-to-republic",
        predicate: "related-to",
        subject: democracy,
        object: republic,
        status: "qualified",
        statementIds: [
          "republic-democracy-distinction",
          "india-democratic-republic-self-description",
        ],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: approach,
    relationships: [
      {
        id: "representative-government-interprets-democracy",
        predicate: "interprets-concept",
        subject: approach,
        object: democracy,
        role: "core",
        interpretation:
          "One institutional route using elections and delegated public authority.",
        status: "qualified",
        statementIds: [
          "democracy-representation-mechanism",
          "democracy-voting-boundary",
        ],
      },
      {
        id: "representative-government-advances-equal-standing",
        predicate: "advances-end",
        subject: approach,
        object: { kind: "end", id: "equal-political-standing" },
        status: "qualified",
        statementIds: [
          "democracy-public-equality-end",
          "democracy-majority-limit",
        ],
      },
      {
        id: "representative-government-advocates-elections",
        predicate: "advocates-means",
        subject: approach,
        object: { kind: "means", id: "electoral-representation" },
        status: "qualified",
        statementIds: [
          "democracy-representation-mechanism",
          "democracy-voting-boundary",
        ],
      },
    ],
  },
  ...citations.map(([statementId, sourceId, locator, role, suffix]) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [
      {
        id: `${statementId}-cites-${suffix}`,
        predicate: "cites" as const,
        subject: { kind: "statement" as const, id: statementId },
        object: { kind: "source" as const, id: sourceId },
        role,
        locator,
      },
    ],
  })),
] satisfies AuthoringDocument[];
