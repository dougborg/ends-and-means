import type { AuthoringDocument } from "../../../src/lib/domain";

const citations = [
  [
    "liberalism-plural-traditions",
    "sep-liberalism-source",
    "introduction, paragraphs 1–2",
    "supports",
  ],
  [
    "liberalism-authority-justification",
    "sep-liberalism-source",
    "section 1.1, paragraphs 1–4",
    "supports",
  ],
  [
    "liberalism-liberty-disputes",
    "sep-liberalism-source",
    "sections 1.1–1.4",
    "supports",
  ],
  [
    "liberalism-old-new-boundary",
    "sep-liberalism-source",
    "sections 2.1–2.3",
    "supports",
  ],
  [
    "liberalism-label-insufficient",
    "sep-liberalism-source",
    "introduction; sections 1–4",
    "supports",
  ],
  [
    "mill-liberty-limiting-principle",
    "mill-on-liberty-source",
    "chapter I, paragraph beginning ‘The object of this Essay’",
    "supports",
  ],
  [
    "mill-colonial-exclusion",
    "mill-on-liberty-source",
    "chapter I, paragraph beginning ‘It is, perhaps, hardly necessary’",
    "supports",
  ],
  [
    "mehta-liberal-empire-tension",
    "mehta-liberalism-empire-source",
    "introduction, pp. 1–28",
    "supports",
  ],
  [
    "pateman-contract-gender-boundary",
    "pateman-sexual-contract-source",
    "chapter 1, pp. 1–18",
    "supports",
  ],
  [
    "india-rights-equality",
    "india-constitution-source",
    "articles 14–15",
    "supports",
  ],
  [
    "india-rights-equality",
    "khosla-indias-founding-moment-source",
    "introduction, pp. 1–26",
    "context",
  ],
  [
    "japan-rights-equality-marriage",
    "japan-constitution-source",
    "articles 14 and 24",
    "supports",
  ],
  [
    "japan-rights-drafting-boundary",
    "nakanishi-japan-rights-source",
    "pp. 1185–1198",
    "supports",
  ],
  [
    "conservatism-broad-narrow",
    "sep-conservatism-source",
    "section 1.1, paragraphs 1–4",
    "supports",
  ],
  [
    "conservatism-tradition-reform",
    "sep-conservatism-source",
    "section 1.3, paragraphs 1–4",
    "supports",
  ],
  [
    "conservatism-reaction-boundary",
    "sep-conservatism-source",
    "section 1.3, paragraphs 1–3",
    "supports",
  ],
  [
    "conservatism-authoritarian-boundary",
    "sep-conservatism-source",
    "section 1.3, paragraphs 2–4",
    "supports",
  ],
  [
    "conservatism-procedural-substantive",
    "sep-conservatism-source",
    "section 1.4, paragraphs 1–6",
    "supports",
  ],
  [
    "burke-change-conservation",
    "burke-reflections-source",
    "paragraph beginning ‘A state without the means of some change’",
    "supports",
  ],
  [
    "burke-inheritance-prudence",
    "burke-reflections-source",
    "paragraph beginning ‘You will observe, that from Magna Charta’",
    "supports",
  ],
  [
    "ahlen-programme-economic-order",
    "cdu-ahlen-programme-source",
    "preamble, paragraphs 1–2",
    "supports",
  ],
  [
    "ahlen-programme-compromise",
    "cdu-ahlen-programme-source",
    "editorial introduction, paragraphs 1–3",
    "supports",
  ],
  [
    "duesseldorf-social-market-shift",
    "cdu-duesseldorf-guidelines-source",
    "pp. 1–4, ‘Soziale Marktwirtschaft’ and principles 1–8",
    "supports",
  ],
  [
    "cdu-programme-change-boundary",
    "cdu-ahlen-programme-source",
    "editorial introduction, paragraphs 1–3",
    "supports",
  ],
  [
    "cdu-programme-change-boundary",
    "cdu-duesseldorf-guidelines-source",
    "pp. 1–4, principles 1–8",
    "context",
  ],
] as const;

export const liberalismConservatismRelationshipDocuments = [
  {
    documentType: "relationships",
    subject: { kind: "concept", id: "liberalism" },
    relationships: [
      {
        id: "liberalism-related-to-conservatism",
        predicate: "related-to",
        subject: { kind: "concept", id: "liberalism" },
        object: { kind: "concept", id: "conservatism" },
        status: "qualified",
        statementIds: [
          "liberalism-plural-traditions",
          "conservatism-broad-narrow",
        ],
      },
    ],
  },
  ...citations.map(([statementId, sourceId, locator, role], index) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [
      {
        id: `${statementId}-cites-${index + 1}`,
        predicate: "cites" as const,
        subject: { kind: "statement" as const, id: statementId },
        object: { kind: "source" as const, id: sourceId },
        role,
        locator,
      },
    ],
  })),
] satisfies AuthoringDocument[];
