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
    "section 5, introductory paragraph; section 5.2, paragraphs 1–4",
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
    "nabulsi-republicanism-source",
    "abstract, paragraphs 1–2; pp. 701–711",
    "supports",
    "form",
  ],
  [
    "republic-democracy-distinction",
    "keyssar-right-to-vote-source",
    "chapter 1, pp. 3–25",
    "qualifies",
    "democracy-boundary",
  ],
  [
    "republicanism-tradition-boundary",
    "nabulsi-republicanism-source",
    "abstract, paragraphs 1–2; pp. 701–711",
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
    "india-democratic-republic-preamble",
    "india-constitution-source",
    "Preamble",
    "supports",
    "india-preamble",
  ],
  [
    "india-democratic-republic-preamble",
    "khosla-indias-founding-moment-source",
    "introduction, pp. 1–26",
    "context",
    "india-preamble-context",
  ],
  [
    "india-adult-suffrage-rule",
    "india-constitution-source",
    "article 326",
    "supports",
    "india-suffrage",
  ],
  [
    "india-adult-suffrage-rule",
    "khosla-indias-founding-moment-source",
    "introduction, pp. 1–26",
    "context",
    "india-suffrage-context",
  ],
  [
    "us-republic-elector-boundary",
    "us-constitution-source",
    "Article I, section 2, clause 1",
    "supports",
    "elector-boundary",
  ],
  [
    "us-republic-elector-boundary",
    "keyssar-right-to-vote-source",
    "chapter 1, pp. 3–25",
    "context",
    "elector-boundary-context",
  ],
  [
    "kahnawake-cdmrp-bridge",
    "horn-miller-indigenous-participatory-democracy-source",
    "pp. 111–118, community and institutional account of the CDMP",
    "supports",
    "kahnawake-bridge",
  ],
  [
    "republic-kahnawake-transfer-limit",
    "horn-miller-indigenous-participatory-democracy-source",
    "pp. 111–118, community-specific framing of the CDMP",
    "context",
    "kahnawake-transfer",
  ],
] as const;

const democracy = { kind: "concept" as const, id: "democracy" };
const republic = { kind: "concept" as const, id: "republic" };
const approach = {
  kind: "approach" as const,
  id: "representative-democratic-government",
};
const neoRepublican = {
  kind: "approach" as const,
  id: "neo-republican-nondomination",
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
          "india-democratic-republic-preamble",
        ],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: approach,
    relationships: [
      {
        id: "representative-government-member-democratic-traditions",
        predicate: "member-of",
        subject: approach,
        object: { kind: "collection", id: "democratic-traditions" },
        membership: "qualified",
        status: "qualified",
        statementIds: ["democracy-representation-mechanism"],
      },
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
  {
    documentType: "relationships",
    subject: { kind: "means", id: "electoral-representation" },
    relationships: [
      {
        id: "electoral-representation-member-selection-means",
        predicate: "member-of",
        subject: { kind: "means", id: "electoral-representation" },
        object: { kind: "collection", id: "democratic-selection-means" },
        membership: "qualified",
        status: "qualified",
        statementIds: ["democracy-representation-mechanism"],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: { kind: "means", id: "sortition-deliberative-minipublic" },
    relationships: [
      {
        id: "sortition-member-selection-means",
        predicate: "member-of",
        subject: { kind: "means", id: "sortition-deliberative-minipublic" },
        object: { kind: "collection", id: "democratic-selection-means" },
        membership: "qualified",
        status: "qualified",
        statementIds: ["democracy-sortition-alternative"],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: neoRepublican,
    relationships: [
      {
        id: "neo-republican-member-republican-traditions",
        predicate: "member-of",
        subject: neoRepublican,
        object: { kind: "collection", id: "republican-traditions" },
        membership: "qualified",
        status: "qualified",
        statementIds: ["republicanism-tradition-boundary"],
      },
      {
        id: "neo-republican-advances-nondomination",
        predicate: "advances-end",
        subject: neoRepublican,
        object: { kind: "end", id: "freedom-as-nondomination" },
        status: "asserted",
        statementIds: ["republic-nondomination-end"],
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
