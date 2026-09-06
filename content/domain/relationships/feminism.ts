import type { AuthoringDocument } from "../../../src/lib/domain";

const traditions = [
  "liberal-feminism",
  "socialist-feminism",
  "marxist-feminism",
  "radical-feminism",
] as const;
const traditionEvidence = {
  "liberal-feminism": "liberal-feminism-tradition",
  "socialist-feminism": "socialist-feminism-tradition",
  "marxist-feminism": "marxist-feminism-tradition",
  "radical-feminism": "radical-feminism-tradition",
} as const;
const citationRows = [
  [
    "feminism-contested-family",
    "sep-feminist-political-philosophy-source",
    "introduction, paragraphs 1–8; section 2, paragraphs 1–3",
    "supports",
  ],
  [
    "feminism-analysis-action-distinction",
    "sep-feminist-political-philosophy-source",
    "introduction, paragraphs 3–8",
    "supports",
  ],
  [
    "feminism-public-private-boundary",
    "sep-feminist-political-philosophy-source",
    "introduction, paragraphs 1–7; section 1, paragraphs 1–9",
    "supports",
  ],
  [
    "feminism-traditions-nonexhaustive",
    "sep-feminist-political-philosophy-source",
    "sections 1–2.8, headings and introductory classifications",
    "supports",
  ],
  [
    "liberal-feminism-tradition",
    "sep-feminist-political-philosophy-source",
    "section 2.1, paragraphs 1–18",
    "supports",
  ],
  [
    "radical-feminism-tradition",
    "sep-feminist-political-philosophy-source",
    "section 2.2, paragraphs 1–12",
    "supports",
  ],
  [
    "socialist-feminism-tradition",
    "sep-feminist-political-philosophy-source",
    "section 2.3, paragraphs 1–18",
    "supports",
  ],
  [
    "marxist-feminism-tradition",
    "sep-feminist-political-philosophy-source",
    "section 2.3, paragraphs 1–18",
    "supports",
  ],
  [
    "liberal-feminism-autonomy",
    "sep-feminist-political-philosophy-source",
    "section 2.1, paragraphs 1–18",
    "supports",
  ],
  [
    "radical-feminism-structural-boundary",
    "sep-feminist-political-philosophy-source",
    "section 2.2, paragraphs 1–12",
    "supports",
  ],
  [
    "socialist-feminism-material-boundary",
    "sep-feminist-political-philosophy-source",
    "section 2.3, paragraphs 1–18",
    "supports",
  ],
  [
    "formal-substantive-equality-boundary",
    "sep-feminist-political-philosophy-source",
    "sections 2.1, 2.3, and 2.5",
    "supports",
  ],
  [
    "crenshaw-single-axis-limit",
    "crenshaw-demarginalizing-source",
    "pp. 139–143",
    "supports",
  ],
  [
    "mohanty-western-universal-limit",
    "mohanty-western-eyes-revisited-source",
    "pp. 501–509 and 522–525",
    "supports",
  ],
  [
    "moreton-robinson-indigenous-boundary",
    "moreton-robinson-talkin-up-source",
    "publisher page, Description paragraphs 1–4",
    "supports",
  ],
  [
    "koyama-transfeminist-self-description",
    "koyama-transfeminist-manifesto-source",
    "pp. 1–2, opening and Primary Principles",
    "supports",
  ],
  [
    "koyama-body-autonomy",
    "koyama-transfeminist-manifesto-source",
    "p. 2, Primary Principles",
    "supports",
  ],
  [
    "sex-gender-trans-boundary",
    "koyama-transfeminist-manifesto-source",
    "p. 1, operational definitions of sex and gender",
    "supports",
  ],
  [
    "fraser-social-reproduction-definition",
    "fraser-capital-care-source",
    "opening paragraphs 1–3",
    "supports",
  ],
  [
    "fraser-care-capitalism-claim",
    "fraser-capital-care-source",
    "opening paragraphs 4–12",
    "supports",
  ],
  [
    "combahee-self-description",
    "combahee-statement-source",
    "PDF pp. 1–3, opening and sections 1–2",
    "supports",
  ],
  [
    "combahee-opposed-interlocking-oppressions",
    "combahee-statement-source",
    "PDF p. 1, opening paragraph",
    "supports",
  ],
  [
    "combahee-self-description",
    "taylor-combahee-reader-source",
    "pp. 15–27 and 109–130",
    "context",
  ],
  [
    "combahee-organizing-practice",
    "taylor-combahee-reader-source",
    "pp. 109–130, interview with Barbara Smith, Beverly Smith, and Demita Frazier",
    "supports",
  ],
  [
    "combahee-selected-campaigns",
    "taylor-combahee-reader-source",
    "pp. 109–130, interview with Barbara Smith, Beverly Smith, and Demita Frazier",
    "supports",
  ],
  [
    "combahee-organizing-practice",
    "harris-kennedy-combahee-source",
    "pp. 280–305",
    "supports",
  ],
  [
    "combahee-case-boundary",
    "taylor-combahee-reader-source",
    "pp. 1–14 and 109–130",
    "supports",
  ],
  [
    "sewa-union-registration",
    "sewa-history-source",
    "Birth of SEWA, paragraphs 1–8",
    "supports",
  ],
  [
    "sewa-worker-definition-contest",
    "sewa-history-source",
    "Birth of SEWA, paragraphs 3–8",
    "supports",
  ],
  [
    "sewa-union-registration",
    "ilo-sewa-cooperatives-source",
    "pp. 13–17",
    "context",
  ],
  [
    "sewa-cooperative-bank",
    "ilo-sewa-cooperatives-source",
    "p. 17, Beginnings of the cooperative journey",
    "supports",
  ],
  [
    "sewa-quilt-cooperative",
    "ilo-sewa-cooperatives-source",
    "p. 17, Beginnings of the cooperative journey",
    "supports",
  ],
  [
    "sewa-case-boundary",
    "ilo-sewa-cooperatives-source",
    "pp. 3, 7, and 13–17",
    "supports",
  ],
  [
    "sewa-case-boundary",
    "sewa-history-source",
    "History of SEWA, paragraphs 1–6",
    "context",
  ],
  [
    "iceland-leave-enacted-design",
    "iceland-parental-leave-law-source",
    "archived consolidation dated 1 October 2000, Articles 2, 4, 8, 13, and 36",
    "supports",
  ],
  [
    "iceland-leave-enacted-design",
    "gislason-iceland-leave-source",
    "chapter 18, pp. 370–387, Abstract and Introduction",
    "context",
  ],
  [
    "iceland-fathers-uptake",
    "gislason-iceland-leave-source",
    "chapter 18, pp. 370–387, A Policy Success? § Programmatic success, paragraphs 1–5 and Figure 18.1",
    "supports",
  ],
  [
    "iceland-care-work-outcomes",
    "arnalds-eydal-gislason-leave-source",
    "printed pp. 247–249, section 5.1 and Figures 2–4",
    "supports",
  ],
  [
    "iceland-labor-force-participation-gap",
    "arnalds-eydal-gislason-leave-source",
    "printed p. 250, section 5.2 and Figure 5",
    "supports",
  ],
  [
    "iceland-working-hours-gap",
    "arnalds-eydal-gislason-leave-source",
    "printed pp. 250–251, section 5.2 and Figure 6",
    "supports",
  ],
  [
    "iceland-causal-transfer-limit",
    "gislason-iceland-leave-source",
    "chapter 18, pp. 370–387, A Policy Success? §§ Programmatic success and Counterclaims to success",
    "supports",
  ],
  [
    "iceland-payment-cuts-uptake",
    "gislason-iceland-leave-source",
    "chapter 18, pp. 378–379, ‘An Enduring System’, subsection ‘Coping with a financial crisis’, especially the paragraph reporting the largest decrease among high-income fathers",
    "supports",
  ],
] as const;

export const feminismRelationshipDocuments = [
  ...traditions.map((id) => ({
    documentType: "relationships" as const,
    subject: { kind: "concept" as const, id },
    relationships: [
      {
        id: `${id}-member-feminist-traditions`,
        predicate: "member-of" as const,
        subject: { kind: "concept" as const, id },
        object: { kind: "collection" as const, id: "feminist-traditions" },
        membership: "qualified" as const,
        status: "qualified" as const,
        statementIds: [
          traditionEvidence[id],
          "feminism-traditions-nonexhaustive",
        ],
      },
    ],
  })),
  ...citationRows.map(([statementId, sourceId, locator, role], index) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [
      {
        id: `feminism-citation-${index + 1}`,
        predicate: "cites" as const,
        subject: { kind: "statement" as const, id: statementId },
        object: { kind: "source" as const, id: sourceId },
        role,
        locator,
      },
    ],
  })),
  {
    documentType: "relationships",
    subject: {
      kind: "case-episode",
      id: "sewa-ahmedabad-institutions-episode",
    },
    relationships: [
      {
        id: "sewa-episode-used-self-employed-worker-unionism",
        predicate: "used-means",
        subject: {
          kind: "case-episode",
          id: "sewa-ahmedabad-institutions-episode",
        },
        object: { kind: "means", id: "self-employed-worker-unionism" },
        implementation: "mixed",
        status: "qualified",
        statementIds: [
          "sewa-union-registration",
          "sewa-worker-definition-contest",
        ],
      },
      {
        id: "sewa-episode-used-member-owned-cooperative-finance",
        predicate: "used-means",
        subject: {
          kind: "case-episode",
          id: "sewa-ahmedabad-institutions-episode",
        },
        object: { kind: "means", id: "member-owned-cooperative-finance" },
        implementation: "mixed",
        status: "qualified",
        statementIds: ["sewa-cooperative-bank"],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: {
      kind: "case-episode",
      id: "iceland-parental-leave-outcomes-episode",
    },
    relationships: [
      {
        id: "iceland-episode-used-nontransferable-parental-leave",
        predicate: "used-means",
        subject: {
          kind: "case-episode",
          id: "iceland-parental-leave-outcomes-episode",
        },
        object: { kind: "means", id: "nontransferable-parental-leave" },
        implementation: "mixed",
        status: "qualified",
        statementIds: [
          "iceland-leave-enacted-design",
          "iceland-fathers-uptake",
          "iceland-payment-cuts-uptake",
        ],
      },
    ],
  },
] satisfies AuthoringDocument[];
