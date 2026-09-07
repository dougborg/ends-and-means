import type {
  AuthoringDocument,
  DomainRelationship,
} from "../../../src/lib/domain";

type Role = "supports" | "qualifies" | "context" | "challenges";
const rows: [string, string, string, Role][] = [
  [
    "theocracy-contested-family",
    "huzakai-theocracy-source",
    "pp. 342–343, historical meanings and modern forms",
    "supports",
  ],
  [
    "theocracy-hierocracy-boundary",
    "huzakai-theocracy-source",
    "pp. 342–343, divine rule and priestly rule",
    "supports",
  ],
  [
    "theocracy-state-religion-boundary",
    "hirschl-constitutional-theocracy-source",
    "pp. 2–12, definition and four elements",
    "supports",
  ],
  [
    "theocracy-religious-law-boundary",
    "hirschl-constitutional-theocracy-source",
    "pp. 2–12, constitutional status and jurisdiction",
    "supports",
  ],
  [
    "theocracy-influence-boundary",
    "huzakai-theocracy-source",
    "p. 343, institutional forms",
    "qualifies",
  ],
  [
    "theocracy-sacred-monarchy-boundary",
    "huzakai-theocracy-source",
    "pp. 342–343, divine rule and human institutions",
    "qualifies",
  ],
  [
    "theocracy-authoritarianism-boundary",
    "hirschl-constitutional-theocracy-source",
    "pp. 7–12, hybrid constitutional form",
    "supports",
  ],
  [
    "theocracy-polemical-label-boundary",
    "huzakai-theocracy-source",
    "p. 342, conceptual history",
    "context",
  ],
  [
    "constitutional-theocracy-hybrid",
    "hirschl-constitutional-theocracy-source",
    "pp. 2–12, definition and four elements",
    "supports",
  ],
  [
    "iran-divine-sovereignty-principles",
    "iran-constitution-1989-source",
    "article 2",
    "supports",
  ],
  [
    "iran-laws-islamic-criteria",
    "iran-constitution-1989-source",
    "article 4",
    "supports",
  ],
  [
    "iran-popular-elections",
    "iran-constitution-1989-source",
    "article 6",
    "supports",
  ],
  [
    "iran-separation-under-leader",
    "iran-constitution-1989-source",
    "article 57",
    "supports",
  ],
  [
    "iran-guardian-council-composition",
    "iran-constitution-1989-source",
    "articles 91–92",
    "supports",
  ],
  [
    "iran-guardian-council-review",
    "iran-constitution-1989-source",
    "articles 93–96",
    "supports",
  ],
  [
    "iran-guardian-council-elections",
    "iran-constitution-1989-source",
    "article 99",
    "supports",
  ],
  [
    "iran-leader-selection",
    "iran-constitution-1989-source",
    "articles 107 and 111",
    "supports",
  ],
  [
    "iran-leader-powers",
    "iran-constitution-1989-source",
    "article 110",
    "supports",
  ],
  [
    "iran-expediency-council",
    "iran-constitution-1989-source",
    "article 112",
    "supports",
  ],
  [
    "iran-hybrid-rival-reading",
    "iranica-iran-constitution-source",
    "section ‘The Islamic character of the Constitution,’ paragraphs discussing articles 3, 7, and 56–61",
    "supports",
  ],
  [
    "iran-classification-qualified",
    "hirschl-constitutional-theocracy-source",
    "pp. 33–48, Iran",
    "supports",
  ],
  [
    "iran-classification-qualified",
    "iran-constitution-1989-source",
    "articles 4, 6, 57, 91–99, and 107–112",
    "supports",
  ],
  [
    "vatican-pope-sovereign",
    "vatican-fundamental-law-2023-source",
    "article 1",
    "supports",
  ],
  [
    "vatican-legislative-commission",
    "vatican-fundamental-law-2023-source",
    "articles 7–8 as promulgated 13 May 2023",
    "supports",
  ],
  [
    "vatican-commission-amendment",
    "vatican-commission-amendment-2025-source",
    "paragraph 1 and entry-into-force clause",
    "supports",
  ],
  [
    "vatican-executive-governorate",
    "vatican-fundamental-law-2023-source",
    "articles 10–13",
    "supports",
  ],
  [
    "vatican-judicial-name",
    "vatican-fundamental-law-2023-source",
    "article 21",
    "supports",
  ],
  [
    "holy-see-vatican-distinct",
    "holy-see-vatican-distinction-source",
    "sections ‘The Holy See’ and ‘Vatican City State’",
    "supports",
  ],
  [
    "holy-see-vatican-distinct",
    "lateran-treaty-source",
    "section on origins and nature; Lateran Treaty context",
    "context",
  ],
  [
    "pope-religious-state-office",
    "canon-law-331-source",
    "canon 331",
    "supports",
  ],
  [
    "pope-religious-state-office",
    "vatican-fundamental-law-2023-source",
    "article 1",
    "supports",
  ],
  [
    "vatican-delegation-boundary",
    "vatican-fundamental-law-2023-source",
    "articles 1 and 7–21",
    "supports",
  ],
  [
    "vatican-delegation-boundary",
    "vatican-law-one-year-source",
    "sections on legislative and executive implementation",
    "context",
  ],
  [
    "vatican-judicial-name",
    "vatican-judicial-law-2020-source",
    "articles 1–2",
    "context",
  ],
  [
    "vatican-classification-qualified",
    "vatican-fundamental-law-2023-source",
    "articles 1 and 7–21",
    "supports",
  ],
];

const relationships: DomainRelationship[] = [
  ...rows.map(([statementId, sourceId, locator, role], i) => ({
    id: `${statementId}-cites-${i + 1}`,
    predicate: "cites" as const,
    subject: { kind: "statement" as const, id: statementId },
    object: { kind: "source" as const, id: sourceId },
    role,
    locator,
  })),
  {
    id: "theocracy-contested-in-iran",
    predicate: "contested-in-case" as const,
    subject: { kind: "case", id: "iran-constitutional-authority-1989-present" },
    object: {
      kind: "concept",
      id: "theocracy",
    },
    status: "qualified" as const,
    statementIds: [
      "iran-classification-qualified",
      "iran-hybrid-rival-reading",
    ],
  },
  {
    id: "theocracy-contested-in-vatican",
    predicate: "contested-in-case" as const,
    subject: { kind: "case", id: "vatican-city-authority-2023-present" },
    object: {
      kind: "concept",
      id: "theocracy",
    },
    status: "qualified" as const,
    statementIds: [
      "vatican-classification-qualified",
      "holy-see-vatican-distinct",
      "vatican-commission-amendment",
    ],
  },
  {
    id: "iran-religious-authority-placement",
    predicate: "placed-on" as const,
    subject: {
      kind: "case-episode" as const,
      id: "iran-post-1989-constitutional-episode",
    },
    object: {
      kind: "comparison-dimension" as const,
      id: "religiously-grounded-governing-authority",
    },
    value: {
      kind: "category" as const,
      categoryId: "cross-branch-supervision",
    },
    basis: "declared-design" as const,
    uncertainty:
      "High confidence in the cited formal allocation; rules in use, contested elections, and the relative power of institutions require separate evidence.",
    scope: {
      startDate: "1989-07-28",
      endDate: "2026-09-07",
      placeIds: ["iran"],
      note: "The amended constitutional design, not Iranian society or a classification of Islam or Shi'a traditions.",
    },
    status: "qualified" as const,
    statementIds: [
      "iran-laws-islamic-criteria",
      "iran-separation-under-leader",
      "iran-guardian-council-review",
      "iran-leader-powers",
      "iran-classification-qualified",
    ],
  },
  {
    id: "vatican-religious-authority-placement",
    predicate: "placed-on" as const,
    subject: {
      kind: "case-episode" as const,
      id: "vatican-post-2023-fundamental-law-episode",
    },
    object: {
      kind: "comparison-dimension" as const,
      id: "religiously-grounded-governing-authority",
    },
    value: {
      kind: "category" as const,
      categoryId: "plenary-religious-office",
    },
    basis: "declared-design" as const,
    uncertainty:
      "High confidence in ultimate authority under the 2023 law as amended through 19 November 2025; ordinary delegated practice and the distinct international personality of the Holy See remain outside this placement.",
    scope: {
      startDate: "2023-06-07",
      endDate: "2026-09-07",
      placeIds: ["vatican-city"],
      note: "Vatican City's formal design, not Catholic people, Catholicism, or Christianity.",
    },
    status: "qualified" as const,
    statementIds: [
      "vatican-pope-sovereign",
      "vatican-commission-amendment",
      "pope-religious-state-office",
      "vatican-delegation-boundary",
      "vatican-classification-qualified",
    ],
  },
];

const grouped = new Map<string, typeof relationships>();
for (const relationship of relationships) {
  const key = `${relationship.subject.kind}:${relationship.subject.id}`;
  grouped.set(key, [...(grouped.get(key) ?? []), relationship]);
}

export const theocracyRelationshipDocuments: AuthoringDocument[] = [
  ...grouped.values(),
].map((group) => {
  const first = group[0];
  if (!first) throw new Error("Empty Theocracy relationship group");
  return {
    documentType: "relationships",
    subject: first.subject,
    relationships: group,
  };
});
