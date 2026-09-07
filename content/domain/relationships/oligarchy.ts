import type { AuthoringDocument } from "../../../src/lib/domain";

const citations = [
  [
    "oligarchy-aristotle-few-common-interest",
    "aristotle-politics-rackham-source",
    "Book III, chapter 7, 1279a22–1279b10",
    "supports",
  ],
  [
    "oligarchy-aristotle-wealth-distinction",
    "aristotle-politics-rackham-source",
    "Book III, chapter 8, 1279b11–1280a6",
    "supports",
  ],
  [
    "oligarchy-simonton-historical-form",
    "simonton-classical-greek-oligarchy-source",
    "book abstract and chapter 1 abstract",
    "supports",
  ],
  [
    "oligarchy-winters-wealth-defense",
    "winters-oligarchy-encyclopedia-source",
    "abstract, paragraphs 1–2",
    "supports",
  ],
  [
    "oligarchy-page-winters-democracy-coexistence",
    "page-winters-us-oligarchy-source",
    "pp. 731–733",
    "supports",
  ],
  [
    "oligarchy-elite-theory-distinction",
    "page-winters-us-oligarchy-source",
    "pp. 731–735",
    "supports",
  ],
  [
    "oligarchy-polemic-boundary",
    "simonton-classical-greek-oligarchy-source",
    "chapter 1 abstract and book abstract",
    "context",
  ],
  [
    "oligarchy-inequality-boundary",
    "ford-pepinsky-beyond-oligarchy-introduction-source",
    "pp. 1–9",
    "supports",
  ],
  [
    "oligarchy-officeholding-boundary",
    "page-winters-us-oligarchy-source",
    "pp. 731–736",
    "supports",
  ],
  [
    "oligarchy-regime-boundary",
    "gilens-page-testing-theories-source",
    "pp. 564–565 and 573–577",
    "supports",
  ],
  [
    "athens-411-war-crisis",
    "aristotle-athenian-constitution-rackham-source",
    "chapters 29.1–29.4",
    "supports",
  ],
  [
    "athens-411-five-thousand-proposal",
    "aristotle-athenian-constitution-rackham-source",
    "chapter 29.5",
    "supports",
  ],
  [
    "athens-411-four-hundred-actual-rule",
    "aristotle-athenian-constitution-rackham-source",
    "chapter 32.1",
    "supports",
  ],
  [
    "athens-411-coercion",
    "thucydides-peloponnesian-war-crawley-source",
    "Book VIII, chapters 65–66",
    "supports",
  ],
  [
    "athens-411-four-hundred-duration",
    "aristotle-athenian-constitution-rackham-source",
    "chapter 33.1",
    "supports",
  ],
  [
    "athens-411-five-thousand-successor",
    "thucydides-peloponnesian-war-crawley-source",
    "Book VIII, chapter 97.1–2",
    "supports",
  ],
  [
    "athens-411-source-boundary",
    "simonton-classical-greek-oligarchy-source",
    "chapter 1 abstract",
    "context",
  ],
  [
    "indonesia-winters-material-power",
    "winters-indonesia-oligarchy-democracy-source",
    "pp. 11–15",
    "supports",
  ],
  [
    "indonesia-winters-wealth-defense",
    "winters-indonesia-oligarchy-democracy-source",
    "pp. 15–20",
    "supports",
  ],
  [
    "indonesia-democracy-coexistence",
    "ford-pepinsky-beyond-oligarchy-introduction-source",
    "pp. 1–9",
    "supports",
  ],
  [
    "indonesia-hadiz-robison-rival",
    "hadiz-robison-reorganization-power-source",
    "pp. 35–38 and 54–57",
    "supports",
  ],
  [
    "indonesia-beyond-oligarchy-critique",
    "ford-pepinsky-beyond-oligarchy-introduction-source",
    "pp. 1–9",
    "supports",
  ],
  [
    "indonesia-debate-reply",
    "ford-pepinsky-beyond-oligarchy-introduction-source",
    "pp. 1–9",
    "supports",
  ],
  [
    "indonesia-case-boundary",
    "winters-indonesia-oligarchy-democracy-source",
    "title, pp. 11–13",
    "context",
  ],
  [
    "us-gilens-page-dataset",
    "gilens-page-testing-theories-source",
    "pp. 564 and 568–570",
    "supports",
  ],
  [
    "us-gilens-page-elite-effect",
    "gilens-page-testing-theories-source",
    "pp. 572–575, tables 3–4",
    "supports",
  ],
  [
    "us-gilens-page-average-effect",
    "gilens-page-testing-theories-source",
    "pp. 572–575, tables 3–4",
    "supports",
  ],
  [
    "us-gilens-page-not-oligarchy-test",
    "gilens-page-testing-theories-source",
    "pp. 564–566 and 576–577",
    "supports",
  ],
  [
    "us-gilens-earlier-income-gradient",
    "gilens-inequality-responsiveness-source",
    "pp. 778–780 and 793–798",
    "supports",
  ],
  [
    "us-bashir-model-critique",
    "bashir-testing-inferences-source",
    "pp. 1–6",
    "supports",
  ],
  [
    "us-gilens-simulation-reply",
    "gilens-simulating-representation-source",
    "pp. 1–3",
    "supports",
  ],
  [
    "us-study-bounded-conclusion",
    "gilens-page-testing-theories-source",
    "pp. 564–577",
    "supports",
  ],
  [
    "us-study-bounded-conclusion",
    "bashir-testing-inferences-source",
    "pp. 1–6",
    "qualifies",
  ],
  [
    "us-study-bounded-conclusion",
    "gilens-simulating-representation-source",
    "pp. 1–3",
    "qualifies",
  ],
] as const;

export const oligarchyRelationshipDocuments = [
  ...citations.map(([statementId, sourceId, locator, role], index) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [
      {
        id: `oligarchy-citation-${index + 1}`,
        predicate: "cites" as const,
        subject: { kind: "statement" as const, id: statementId },
        object: { kind: "source" as const, id: sourceId },
        role,
        locator,
      },
    ],
  })),
  ...(
    [
      [
        "athens-four-hundred-five-thousand-411-bce",
        "athens-411-source-boundary",
      ],
      ["indonesia-oligarchy-debate-1998-2013", "indonesia-case-boundary"],
      [
        "us-federal-policy-preferences-1981-2002",
        "us-study-bounded-conclusion",
      ],
    ] as const
  ).map(([caseId, statementId], index) => ({
    documentType: "relationships" as const,
    subject: { kind: "case" as const, id: caseId },
    relationships: [
      {
        id: `oligarchy-case-concept-${index + 1}`,
        predicate: "contested-in-case" as const,
        subject: { kind: "case" as const, id: caseId },
        object: { kind: "concept" as const, id: "oligarchy" },
        status: "contested" as const,
        statementIds: [statementId],
      },
    ],
  })),
] satisfies AuthoringDocument[];
