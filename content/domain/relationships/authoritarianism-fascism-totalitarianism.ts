import type { AuthoringDocument } from "../../../src/lib/domain";

const citations = [
  [
    "authoritarian-linz-boundary",
    "linz-regimes-source",
    "p. 159, ‘Toward a Definition of Authoritarian Regimes,’ definition paragraph",
    "supports",
  ],
  [
    "authoritarian-practice-boundary",
    "glasius-practices-source",
    "pp. 529–531, ‘Authoritarian practices,’ definition and qualification",
    "supports",
  ],
  [
    "autocracy-operational-boundary",
    "vdem-regimes-source",
    "pp. 60–62, Table 1",
    "supports",
  ],
  [
    "dictatorship-varied-institutions",
    "geddes-dictatorships-source",
    "chapter 1, pp. 1–22, especially summary and pp. 3–5",
    "supports",
  ],
  [
    "dictatorship-history-boundary",
    "marquez-dictatorship-source",
    "pp. 67–70, 82–91",
    "supports",
  ],
  [
    "authoritarian-autocracy-nonsynonym",
    "glasius-practices-source",
    "pp. 515–516, abstract and introduction",
    "context",
  ],
  [
    "authoritarian-autocracy-nonsynonym",
    "vdem-regimes-source",
    "pp. 60–62, Table 1",
    "context",
  ],
  [
    "authoritarian-not-totalitarian",
    "linz-regimes-source",
    "pp. 70 and 159, summary definitions",
    "supports",
  ],
  [
    "fascism-griffin-definition",
    "griffin-nature-source",
    "introduction, p. 26",
    "supports",
  ],
  [
    "fascism-paxton-rival",
    "paxton-anatomy-source",
    "chapter 8, p. 218, concluding definition",
    "supports",
  ],
  [
    "fascism-label-boundary",
    "griffin-nature-source",
    "introduction, pp. 1–26",
    "context",
  ],
  [
    "fascism-label-boundary",
    "paxton-anatomy-source",
    "chapter 8, pp. 206–220",
    "context",
  ],
  [
    "fascism-self-description",
    "mussolini-doctrine-source",
    "sections ‘Political and Social Doctrine’ and ‘The Fascist State’",
    "supports",
  ],
  [
    "fascism-self-description-limit",
    "paxton-anatomy-source",
    "chapter 1, pp. 3–23",
    "qualifies",
  ],
  [
    "italy-dictatorship-transition",
    "ushmm-mussolini-source",
    "section ‘Italian Fascism,’ paragraph 6",
    "supports",
  ],
  [
    "italy-party-regime-boundary",
    "ushmm-mussolini-source",
    "section ‘Italian Fascism,’ paragraph 1, first sentence",
    "supports",
  ],
  [
    "italy-movement-party-sequence",
    "ushmm-mussolini-source",
    "section ‘Italian Fascism,’ paragraph 1, first sentence",
    "supports",
  ],
  [
    "italy-coalition-government-1922",
    "ushmm-mussolini-source",
    "section ‘Italian Fascism,’ paragraph 3, first sentence",
    "supports",
  ],
  [
    "fascism-evidence-region-limit",
    "paxton-anatomy-source",
    "chapter 1, pp. 15–17, discussion of national cases and transfer limits",
    "supports",
  ],
  [
    "totalitarian-linz-definition",
    "linz-regimes-source",
    "p. 70, numbered summary definition",
    "supports",
  ],
  [
    "totalitarian-arendt-boundary",
    "arendt-origins-source",
    "chapter 13, p. 460, opening paragraph",
    "supports",
  ],
  [
    "totalitarian-contested-category",
    "bunce-totalitarianism-source",
    "p. 535, paragraphs 1–2",
    "supports",
  ],
  [
    "totalitarian-label-history",
    "marquez-dictatorship-source",
    "pp. 84–87, section ‘Totalitarianism and Authoritarianism’",
    "supports",
  ],
  [
    "totalitarian-polemical-boundary",
    "bunce-totalitarianism-source",
    "p. 535, paragraphs 1–2",
    "supports",
  ],
  [
    "nazi-one-party-consolidation",
    "ushmm-nazi-state-source",
    "sections ‘Foundations of the Nazi State’ and ‘Creating the Führer State’",
    "supports",
  ],
  [
    "nazi-party-state-law",
    "party-state-law-source",
    "document 1395-PS, pp. 978–979, §§1–3; translation and edition note on PDF p. 2",
    "supports",
  ],
  [
    "nazi-control-limit",
    "ushmm-nazi-state-source",
    "section ‘The Gleichschaltung of German Society’",
    "supports",
  ],
  [
    "totalitarian-case-nonembodiment",
    "bunce-totalitarianism-source",
    "p. 535, paragraphs 1–2",
    "context",
  ],
] as const;

const ref = <K extends "concept" | "approach" | "collection" | "case">(
  kind: K,
  id: string,
): { kind: K; id: string } => ({ kind, id });

export const authoritarianismFascismTotalitarianismRelationshipDocuments: AuthoringDocument[] =
  [
    ...citations.map(([statementId, sourceId, locator, role], index) => ({
      documentType: "relationships" as const,
      subject: { kind: "statement" as const, id: statementId },
      relationships: [
        {
          id: `${statementId}-cites-${index}`,
          predicate: "cites" as const,
          subject: { kind: "statement" as const, id: statementId },
          object: { kind: "source" as const, id: sourceId },
          role,
          locator,
          status: "accepted" as const,
        },
      ],
    })),
    {
      documentType: "relationships",
      subject: ref("concept", "authoritarianism"),
      relationships: [
        {
          id: "authoritarianism-related-autocracy",
          predicate: "related-to",
          subject: ref("concept", "authoritarianism"),
          object: ref("concept", "autocracy"),
          status: "qualified",
          statementIds: ["authoritarian-autocracy-nonsynonym"],
        },
        {
          id: "authoritarianism-related-dictatorship",
          predicate: "related-to",
          subject: ref("concept", "authoritarianism"),
          object: ref("concept", "dictatorship"),
          status: "qualified",
          statementIds: [
            "dictatorship-history-boundary",
            "dictatorship-varied-institutions",
          ],
        },
        {
          id: "authoritarianism-related-totalitarianism",
          predicate: "related-to",
          subject: ref("concept", "authoritarianism"),
          object: ref("concept", "totalitarianism"),
          status: "qualified",
          statementIds: ["authoritarian-not-totalitarian"],
        },
      ],
    },
    {
      documentType: "relationships",
      subject: ref("concept", "fascism"),
      relationships: [
        {
          id: "fascism-related-authoritarianism",
          predicate: "related-to",
          subject: ref("concept", "fascism"),
          object: ref("concept", "authoritarianism"),
          status: "qualified",
          statementIds: ["fascism-label-boundary"],
        },
        {
          id: "fascism-related-totalitarianism",
          predicate: "related-to",
          subject: ref("concept", "fascism"),
          object: ref("concept", "totalitarianism"),
          status: "qualified",
          statementIds: ["totalitarian-contested-category"],
        },
      ],
    },
    {
      documentType: "relationships",
      subject: ref("approach", "historical-italian-fascism"),
      relationships: [
        {
          id: "italian-fascism-interprets-fascism",
          predicate: "interprets-concept",
          subject: ref("approach", "historical-italian-fascism"),
          object: ref("concept", "fascism"),
          role: "core",
          interpretation:
            "The documented doctrine and governing project of the Italian Fascist movement and party.",
          status: "qualified",
          statementIds: [
            "fascism-self-description",
            "fascism-self-description-limit",
          ],
        },
        {
          id: "italian-fascism-member-fascist-movements",
          predicate: "member-of",
          subject: ref("approach", "historical-italian-fascism"),
          object: ref("collection", "fascist-movements"),
          membership: "widely-accepted",
          status: "qualified",
          statementIds: ["italy-party-regime-boundary"],
        },
      ],
    },
    {
      documentType: "relationships",
      subject: ref("approach", "linz-regime-analysis"),
      relationships: [
        {
          id: "linz-analysis-interprets-authoritarianism",
          predicate: "interprets-concept",
          subject: ref("approach", "linz-regime-analysis"),
          object: ref("concept", "authoritarianism"),
          role: "core",
          interpretation:
            "An ideal type based on pluralism, ideology, mobilization, and leadership limits.",
          status: "qualified",
          statementIds: ["authoritarian-linz-boundary"],
        },
        {
          id: "linz-analysis-interprets-totalitarianism",
          predicate: "interprets-concept",
          subject: ref("approach", "linz-regime-analysis"),
          object: ref("concept", "totalitarianism"),
          role: "core",
          interpretation:
            "A contrasting ideal type built around a monistic center, ideology, and mobilization.",
          status: "qualified",
          statementIds: [
            "totalitarian-linz-definition",
            "authoritarian-not-totalitarian",
          ],
        },
        {
          id: "linz-analysis-member-totalitarian",
          predicate: "member-of",
          subject: ref("approach", "linz-regime-analysis"),
          object: ref("collection", "totalitarianism-analyses"),
          membership: "widely-accepted",
          status: "qualified",
          statementIds: ["totalitarian-linz-definition"],
        },
      ],
    },
    {
      documentType: "relationships",
      subject: ref("case", "italian-fascist-dictatorship-1925-1943"),
      relationships: [
        {
          id: "italian-fascist-case-partial",
          predicate: "partially-instantiated",
          subject: ref("case", "italian-fascist-dictatorship-1925-1943"),
          object: ref("approach", "historical-italian-fascism"),
          status: "qualified",
          statementIds: [
            "italy-dictatorship-transition",
            "italy-party-regime-boundary",
          ],
        },
      ],
    },
  ];
