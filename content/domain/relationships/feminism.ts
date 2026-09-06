import type { AuthoringDocument } from "../../../src/lib/domain";

const feminism = { kind: "concept" as const, id: "feminism" };
const traditions = [
  "liberal-feminism",
  "socialist-feminism",
  "marxist-feminism",
  "radical-feminism",
  "black-feminism",
  "postcolonial-decolonial-feminisms",
  "indigenous-feminisms",
  "transfeminism",
  "queer-feminisms",
] as const;
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
    "section 1, paragraphs 10–29; sections 2.1–2.8",
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
    "20th anniversary ed., introduction and chapters 1–2; publisher synopsis",
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
    "pp. 1–2, operational definitions and stated exclusions",
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
    "statement sections 1–2, Genesis and Beliefs",
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
    "original 1 October 2000 text, Articles 2, 4, 8, 13, and 36",
    "supports",
  ],
  [
    "iceland-leave-enacted-design",
    "gislason-iceland-leave-source",
    "chapter 18, pp. 330–334",
    "context",
  ],
  [
    "iceland-fathers-uptake",
    "gislason-iceland-leave-source",
    "chapter 18, Programmatic success, pp. 336–339",
    "supports",
  ],
  [
    "iceland-care-work-outcomes",
    "arnalds-eydal-gislason-leave-source",
    "abstract; pp. 168–183, results and discussion",
    "supports",
  ],
  [
    "iceland-causal-transfer-limit",
    "gislason-iceland-leave-source",
    "chapter 18, pp. 338–345, austerity and assessment",
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
        statementIds: ["feminism-traditions-nonexhaustive"],
      },
    ],
  })),
  {
    documentType: "relationships",
    subject: { kind: "case-episode", id: "combahee-organizing-episode" },
    relationships: [
      {
        id: "combahee-episode-contested-feminism",
        predicate: "contested-in-case",
        subject: { kind: "case-episode", id: "combahee-organizing-episode" },
        object: feminism,
        status: "qualified",
        statementIds: ["combahee-self-description", "combahee-case-boundary"],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: {
      kind: "case-episode",
      id: "sewa-ahmedabad-institutions-episode",
    },
    relationships: [
      {
        id: "sewa-episode-contested-feminism",
        predicate: "contested-in-case",
        subject: {
          kind: "case-episode",
          id: "sewa-ahmedabad-institutions-episode",
        },
        object: feminism,
        status: "qualified",
        statementIds: ["sewa-case-boundary"],
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
        id: "iceland-leave-episode-contested-feminism",
        predicate: "contested-in-case",
        subject: {
          kind: "case-episode",
          id: "iceland-parental-leave-outcomes-episode",
        },
        object: feminism,
        status: "qualified",
        statementIds: ["iceland-causal-transfer-limit"],
      },
    ],
  },
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
] satisfies AuthoringDocument[];
