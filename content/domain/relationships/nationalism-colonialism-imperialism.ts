import type { AuthoringDocument } from "../../../src/lib/domain";

const citationRows = [
  [
    "nationalism-attitude-program-boundary",
    "sep-nationalism-source",
    "introduction, paragraphs 1–3",
  ],
  [
    "nation-state-boundary",
    "sep-nationalism-source",
    "section 1, paragraphs 1–5",
  ],
  [
    "self-determination-statehood-boundary",
    "sep-nationalism-source",
    "section 5, paragraphs 1–4",
  ],
  [
    "anderson-imagined-community",
    "anderson-imagined-source",
    "publisher extract, ‘Concepts and Definitions,’ paragraphs 6–9",
  ],
  [
    "anderson-horizontal-inequality",
    "anderson-imagined-source",
    "publisher extract, ‘Concepts and Definitions,’ final paragraph",
  ],
  [
    "chatterjee-derivative-dispute",
    "chatterjee-nationalist-thought-source",
    "publisher description, paragraphs 1–3",
  ],
  [
    "chatterjee-state-unity-limit",
    "chatterjee-nationalist-thought-source",
    "publisher description, paragraphs 4–5",
  ],
  [
    "tagore-nation-society-rival",
    "tagore-nationalism-source",
    "‘Nationalism in the West,’ pp. 9–16",
  ],
  [
    "nationalism-self-description-limit",
    "sep-nationalism-source",
    "introduction and section 1",
  ],
  [
    "national-unity-exclusion-boundary",
    "anderson-imagined-source",
    "publisher extract, final paragraph of ‘Concepts and Definitions’",
  ],
  [
    "colonialism-domination-definition",
    "sep-colonialism-source",
    "section 1, paragraphs 1–3",
  ],
  [
    "colonization-colonialism-boundary",
    "sep-colonialism-source",
    "section 1, paragraphs 1–3",
  ],
  [
    "colonial-arrangements-plural",
    "sep-colonialism-source",
    "section 1, paragraphs 1–3; section 4, paragraphs 1–4",
  ],
  [
    "colonial-formal-practice-boundary",
    "cooper-colonialism-question-source",
    "publisher ‘About the Book,’ paragraphs 1–3",
  ],
  [
    "colonial-archive-mediation",
    "silva-aloha-betrayed-source",
    "publisher description, paragraphs 1–3; table of contents, chapter 4",
  ],
  [
    "cesaire-colonization-civilization-rival",
    "cesaire-discourse-source",
    "pp. 31–36, section beginning ‘A civilization that proves incapable’",
  ],
  [
    "cooper-category-boundary",
    "cooper-colonialism-question-source",
    "publisher ‘About the Book,’ paragraphs 1–3",
  ],
  [
    "decolonization-independence-boundary",
    "getachew-worldmaking-source",
    "book abstract, paragraphs 1–5",
  ],
  [
    "kaulia-lahui-annexation-refusal",
    "silva-1897-petitions-source",
    "paragraph beginning ‘On September 6, 1897,’ especially Kaulia's lāhui statement",
  ],
  [
    "silva-continuing-sovereignty-claim",
    "silva-1897-petitions-source",
    "closing paragraph beginning ‘The Kanaka Maoli continue to protest today’",
  ],
  [
    "colonial-modernization-boundary",
    "chatterjee-nationalist-thought-source",
    "publisher description, paragraphs 2–5",
  ],
  [
    "imperialism-power-extension-definition",
    "sep-colonialism-source",
    "section 1, paragraphs 1–3",
  ],
  [
    "empire-imperialism-boundary",
    "sep-colonialism-source",
    "section 1, paragraphs 1–3",
  ],
  [
    "imperial-mechanisms-plural",
    "nkrumah-neocolonialism-source",
    "chapter 18, paragraphs beginning ‘The first is retention’ and ‘Sometimes a number of rights’",
  ],
  [
    "formal-informal-empire-boundary",
    "nkrumah-neocolonialism-source",
    "introduction, paragraphs 1–8",
  ],
  [
    "nkrumah-neocolonial-definition",
    "nkrumah-neocolonialism-source",
    "introduction, paragraphs 1–8; chapter 18, ‘The mechanisms of neo-colonialism’",
  ],
  [
    "sep-indirect-imperial-boundary",
    "sep-colonialism-source",
    "section 1, paragraphs 1–3",
  ],
  [
    "imperial-cultural-project-boundary",
    "sep-colonialism-source",
    "sections 3 and 5",
  ],
  [
    "capitalist-imperialism-rival-boundary",
    "sep-colonialism-source",
    "section 4, paragraphs 1–8",
  ],
  [
    "imperial-allegation-proof-boundary",
    "nkrumah-neocolonialism-source",
    "introduction and chapter 18",
  ],
  [
    "imperial-country-essence-boundary",
    "cooper-colonialism-question-source",
    "publisher ‘About the Book,’ paragraphs 1–3",
  ],
  [
    "hawaii-petition-scale",
    "hawaii-kue-petitions-source",
    "archival description, paragraphs 15–18; petition SEN 55A-J11.2",
  ],
  [
    "hawaii-petition-language-provenance",
    "hawaii-kue-petitions-source",
    "archival description, paragraph 16; petition SEN 55A-J11.2",
  ],
  [
    "hawaii-annexation-sequence",
    "hawaii-kue-petitions-source",
    "archival description, paragraphs 19–23; Newlands Resolution linked primary record",
  ],
  [
    "hawaii-case-boundary",
    "silva-1897-petitions-source",
    "opening section, paragraph beginning ‘The Hui Aloha ʻĀina for Women’",
  ],
  [
    "bandung-participation",
    "bandung-communique-source",
    "p. 1, opening paragraph",
  ],
  [
    "bandung-anticolonial-principles",
    "bandung-communique-source",
    "pp. 5–6, ‘Problems of Dependent Peoples’; pp. 7–8, ‘Declaration on Promotion of World Peace’",
  ],
  [
    "bandung-worldmaking-boundary",
    "getachew-worldmaking-source",
    "book abstract, paragraphs 1–5",
  ],
  [
    "ghana-legal-independence",
    "ghana-independence-act-source",
    "sections 1(1)–1(2)",
  ],
  [
    "ghana-worldmaking-project",
    "getachew-worldmaking-source",
    "book abstract, paragraphs 2–5; contents, chapter 4",
  ],
  [
    "ghana-neocolonial-limit",
    "nkrumah-neocolonialism-source",
    "introduction, paragraphs 1–8",
  ],
  [
    "un-1514-self-determination",
    "un-resolution-1514-source",
    "operative paragraphs 2 and 5",
  ],
  [
    "decolonization-sequence-limit",
    "getachew-worldmaking-source",
    "book abstract, paragraphs 1–5",
  ],
] as const;

const citationDocuments = citationRows.map(
  ([statementId, sourceId, locator], i) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [
      {
        id: `${statementId}-cites-${i + 1}`,
        predicate: "cites" as const,
        subject: { kind: "statement" as const, id: statementId },
        object: { kind: "source" as const, id: sourceId },
        role: "supports" as const,
        locator,
      },
    ],
  }),
);

const conceptRelations: AuthoringDocument[] = [
  {
    documentType: "relationships",
    subject: { kind: "concept", id: "nationalism" },
    relationships: [
      {
        id: "nationalism-related-to-colonialism",
        predicate: "related-to",
        subject: { kind: "concept", id: "nationalism" },
        object: { kind: "concept", id: "colonialism" },
        status: "qualified",
        statementIds: ["chatterjee-derivative-dispute", "hawaii-case-boundary"],
      },
      {
        id: "nationalism-related-to-imperialism",
        predicate: "related-to",
        subject: { kind: "concept", id: "nationalism" },
        object: { kind: "concept", id: "imperialism" },
        status: "qualified",
        statementIds: [
          "empire-imperialism-boundary",
          "bandung-worldmaking-boundary",
        ],
      },
      {
        id: "nationalism-related-to-self-determination",
        predicate: "related-to",
        subject: { kind: "concept", id: "nationalism" },
        object: { kind: "concept", id: "indigenous-autonomy" },
        status: "qualified",
        statementIds: ["self-determination-statehood-boundary"],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: { kind: "concept", id: "colonialism" },
    relationships: [
      {
        id: "colonialism-related-to-imperialism",
        predicate: "related-to",
        subject: { kind: "concept", id: "colonialism" },
        object: { kind: "concept", id: "imperialism" },
        status: "qualified",
        statementIds: [
          "colonialism-domination-definition",
          "sep-indirect-imperial-boundary",
        ],
      },
      {
        id: "colonialism-related-to-liberalism",
        predicate: "related-to",
        subject: { kind: "concept", id: "colonialism" },
        object: { kind: "concept", id: "liberalism" },
        status: "qualified",
        statementIds: [
          "colonial-modernization-boundary",
          "mehta-liberal-empire-tension",
        ],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: { kind: "concept", id: "imperialism" },
    relationships: [
      {
        id: "imperialism-related-to-capitalism",
        predicate: "related-to",
        subject: { kind: "concept", id: "imperialism" },
        object: { kind: "concept", id: "capitalism" },
        status: "qualified",
        statementIds: ["capitalist-imperialism-rival-boundary"],
      },
    ],
  },
];

export const nationalismColonialismImperialismRelationshipDocuments = [
  ...citationDocuments,
  ...conceptRelations,
] satisfies AuthoringDocument[];
