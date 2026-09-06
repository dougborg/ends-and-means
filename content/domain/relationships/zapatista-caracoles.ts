import type { AuthoringDocument } from "../../../src/lib/domain";

const episode = {
  kind: "case-episode" as const,
  id: "zapatista-caracol-jbg-episode-2003-2023",
};
const citations = [
  [
    "zapatista-autonomy-indigenous-context",
    "speed-exercising-rights-source",
    "chapter 4, pp. 163–170",
    "supports",
  ],
  [
    "zapatista-european-theory-boundary",
    "speed-exercising-rights-source",
    "chapter 4, pp. 163–170",
    "context",
  ],
  [
    "jbg-formation-declaration",
    "ezln-thirteenth-stele-source",
    "section beginning “En suma, para cuidar…”; clause “se constituirán, el 9 de agosto del 2003…”",
    "supports",
  ],
  [
    "jbg-formal-delegation",
    "ezln-thirteenth-stele-source",
    "section beginning “Sus sedes estarán…”; clause “estará formada por 1 ó 2 delegados…”",
    "supports",
  ],
  [
    "jbg-formal-regional-functions",
    "ezln-thirteenth-stele-source",
    "list beginning “Para tratar de contrarrestar el desequilibrio…”",
    "supports",
  ],
  [
    "jbg-formal-municipal-functions",
    "ezln-thirteenth-stele-source",
    "section beginning “Siguen siendo funciones exclusivas…”",
    "supports",
  ],
  [
    "jbg-declared-ezln-oversight",
    "ezln-thirteenth-stele-source",
    "section beginning “El Comité Clandestino Revolucionario…”",
    "supports",
  ],
  [
    "jbg-rotation-rules-in-use",
    "zapatista-autonomous-government-one-source",
    "pp. 11–18",
    "supports",
  ],
  [
    "jbg-rotation-learning-purpose",
    "zapatista-autonomous-government-one-source",
    "pp. 38–42",
    "supports",
  ],
  [
    "jbg-reporting-practice",
    "zapatista-autonomous-government-one-source",
    "pp. 38–42",
    "supports",
  ],
  [
    "jbg-accounting-practice",
    "zapatista-autonomous-government-one-source",
    "pp. 55–56",
    "supports",
  ],
  [
    "jbg-gender-participation-limit",
    "zapatista-autonomous-government-one-source",
    "pp. 54–56",
    "supports",
  ],
  [
    "jbg-external-project-control",
    "andrews-political-autonomy-source",
    "pp. 101–107",
    "supports",
  ],
  [
    "jbg-civil-military-authority-limit",
    "gunderson-autonomist-critique-source",
    "pp. 542–543",
    "supports",
  ],
  [
    "zapatista-hybrid-authority-interpretation",
    "gunderson-autonomist-critique-source",
    "pp. 548–550",
    "supports",
  ],
  [
    "zapatista-reach-limit",
    "speed-exercising-rights-source",
    "chapter 4, pp. 171–183",
    "supports",
  ],
  [
    "zapatista-reach-limit",
    "stahler-sholk-autonomies-source",
    "‘Indigenous and Campesino Autonomies in Mexico’, paragraphs 3–7",
    "qualifies",
  ],
  [
    "zapatista-2023-reorganization-declaration",
    "ezln-new-autonomy-structure-source",
    "sections “First”–“Fourth”; lead text “The main base…”",
    "supports",
  ],
  [
    "zapatista-2023-caracoles-continuity",
    "ezln-new-autonomy-structure-source",
    "section “Third”; sentence beginning “They are based in the caracoles…”",
    "supports",
  ],
  [
    "zapatista-2023-practice-open",
    "ezln-new-autonomy-structure-source",
    "introductory sentences beginning “I am going to try to explain…” and “At another time…”; section “Sixth”",
    "supports",
  ],
  [
    "zapatista-anarchist-resemblance",
    "gunderson-autonomist-critique-source",
    "pp. 548–550",
    "context",
  ],
  [
    "zapatista-anarchism-boundary",
    "gunderson-autonomist-critique-source",
    "pp. 548–550",
    "qualifies",
  ],
  [
    "zapatista-anarchism-boundary",
    "speed-exercising-rights-source",
    "chapter 4, pp. 163–192",
    "supports",
  ],
  [
    "zapatista-accountability-assessment",
    "zapatista-autonomous-government-one-source",
    "pp. 38–42 and 54–56",
    "supports",
  ],
  [
    "zapatista-accountability-assessment",
    "gunderson-autonomist-critique-source",
    "pp. 542–543",
    "qualifies",
  ],
] as const;

export const zapatistaCaracolesRelationshipDocuments = [
  {
    documentType: "relationships",
    subject: episode,
    relationships: [
      {
        id: "zapatista-jbg-episode-used-rotation",
        predicate: "used-means",
        subject: episode,
        object: { kind: "means", id: "rotating-municipal-delegation" },
        implementation: "mixed",
        status: "qualified",
        statementIds: [
          "jbg-formal-delegation",
          "jbg-rotation-rules-in-use",
          "jbg-rotation-learning-purpose",
          "jbg-reporting-practice",
          "jbg-accounting-practice",
          "jbg-gender-participation-limit",
        ],
      },
      {
        id: "zapatista-jbg-episode-assessed-accountability",
        predicate: "assessed-by",
        subject: episode,
        object: { kind: "criterion", id: "affected-community-accountability" },
        conclusion: "mixed",
        status: "qualified",
        statementIds: ["zapatista-accountability-assessment"],
      },
      {
        id: "zapatista-jbg-episode-applies-indigenous-autonomy",
        predicate: "applies-to-case",
        subject: episode,
        object: { kind: "concept", id: "indigenous-autonomy" },
        status: "asserted",
        statementIds: ["zapatista-autonomy-indigenous-context"],
      },
      {
        id: "zapatista-jbg-episode-contested-anarchism",
        predicate: "contested-in-case",
        subject: episode,
        object: { kind: "concept", id: "anarchism" },
        status: "qualified",
        statementIds: [
          "zapatista-anarchist-resemblance",
          "zapatista-anarchism-boundary",
        ],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: { kind: "criterion", id: "affected-community-accountability" },
    relationships: [
      {
        id: "affected-community-accountability-evaluates-authority",
        predicate: "evaluates-response-to",
        subject: { kind: "criterion", id: "affected-community-accountability" },
        object: { kind: "challenge", id: "authority-and-accountability" },
        status: "qualified",
        statementIds: ["zapatista-accountability-assessment"],
      },
    ],
  },
  ...citations.map(
    ([statementId, sourceId, locator, role], index): AuthoringDocument => ({
      documentType: "relationships",
      subject: { kind: "statement", id: statementId },
      relationships: [
        {
          id: `${statementId}-zapatista-citation-${index + 1}`,
          predicate: "cites",
          subject: { kind: "statement", id: statementId },
          object: { kind: "source", id: sourceId },
          role,
          locator,
        },
      ],
    }),
  ),
] satisfies AuthoringDocument[];
