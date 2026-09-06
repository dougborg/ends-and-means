import type { AuthoringDocument } from "../../../src/lib/domain";

const anarchism = { kind: "concept" as const, id: "anarchism" };
const approach = {
  kind: "approach" as const,
  id: "anarcho-syndicalist-organizing",
};

const cited = [
  [
    "anarchism-contested-family",
    "prichard-anarchism-vsi-source",
    "chapter 1, pp. 1–4",
    "supports",
  ],
  [
    "anarchism-opposes-domination",
    "prichard-anarchism-vsi-source",
    "chapter 1, pp. 4–8",
    "supports",
  ],
  [
    "anarchism-opposes-other-domination",
    "prichard-anarchism-vsi-source",
    "chapter 3, pp. 39–43",
    "supports",
  ],
  [
    "anarchism-property-strategy-disagreement",
    "baker-means-ends-source",
    "chapter 5, pp. 173–176",
    "supports",
  ],
  [
    "anarchism-not-disorganization",
    "prichard-anarchism-vsi-source",
    "chapter 4, pp. 59–63",
    "supports",
  ],
  [
    "anarchism-tradition-boundary",
    "baker-means-ends-source",
    "chapter 5, pp. 173–176",
    "supports",
  ],
  [
    "rocker-syndicalist-double-aim",
    "rocker-anarchosyndicalism-source",
    "chapter 4, pp. 58–61",
    "supports",
  ],
  [
    "baker-strategy-disagreement",
    "baker-means-ends-source",
    "chapter 7, pp. 239–242; chapter 10, pp. 335–339",
    "supports",
  ],
  [
    "spanish-case-plurality",
    "graham-spanish-republic-source",
    "chapter 2, pp. 53–57",
    "supports",
  ],
  [
    "mujeres-libres-gender-counterevidence",
    "ackelsberg-free-women-source",
    "chapter IV, pp. 115–119",
    "supports",
  ],
  [
    "spanish-anarchist-gender-subordination",
    "ackelsberg-free-women-source",
    "chapter VI, pp. 186–190",
    "supports",
  ],
  [
    "anarchosyndicalist-self-identification",
    "rocker-anarchosyndicalism-source",
    "chapter 1, pp. 14–16",
    "supports",
  ],
  [
    "anarchist-case-nonembodiment",
    "graham-spanish-republic-source",
    "introduction, pp. 1–4",
    "context",
  ],
] as const;

export const anarchismRelationshipDocuments = [
  {
    documentType: "relationships",
    subject: anarchism,
    relationships: [
      {
        id: "anarchism-related-to-socialism",
        predicate: "related-to",
        subject: anarchism,
        object: { kind: "concept", id: "socialism" },
        status: "qualified",
        statementIds: ["anarchism-tradition-boundary"],
      },
      {
        id: "anarchism-related-to-communism",
        predicate: "related-to",
        subject: anarchism,
        object: { kind: "concept", id: "communism" },
        status: "qualified",
        statementIds: ["anarchism-tradition-boundary"],
      },
      {
        id: "anarchism-related-to-statelessness",
        predicate: "related-to",
        subject: anarchism,
        object: { kind: "concept", id: "statelessness" },
        status: "qualified",
        statementIds: [
          "anarchism-opposes-domination",
          "anarchism-not-disorganization",
        ],
      },
      {
        id: "anarchism-member-of-anarchist-traditions",
        predicate: "member-of",
        subject: anarchism,
        object: { kind: "collection", id: "anarchist-traditions" },
        membership: "widely-accepted",
        status: "qualified",
        statementIds: ["anarchism-contested-family"],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: { kind: "concept", id: "anarcho-syndicalism" },
    relationships: [
      {
        id: "anarchosyndicalism-tradition-member",
        predicate: "member-of",
        subject: { kind: "concept", id: "anarcho-syndicalism" },
        object: { kind: "collection", id: "anarchist-traditions" },
        membership: "widely-accepted",
        status: "qualified",
        statementIds: ["anarchosyndicalist-self-identification"],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: approach,
    relationships: [
      {
        id: "anarchosyndicalist-approach-interprets-tradition",
        predicate: "interprets-concept",
        subject: approach,
        object: { kind: "concept", id: "anarcho-syndicalism" },
        role: "core",
        interpretation:
          "The approach gives institutional form to the historically named tradition through worker organization and federation.",
        status: "qualified",
        statementIds: [
          "anarchosyndicalist-self-identification",
          "rocker-syndicalist-double-aim",
        ],
      },
      {
        id: "anarchosyndicalism-member-of-anarchist-traditions",
        predicate: "member-of",
        subject: approach,
        object: { kind: "collection", id: "anarchist-traditions" },
        membership: "widely-accepted",
        status: "qualified",
        statementIds: [
          "rocker-syndicalist-double-aim",
          "baker-strategy-disagreement",
        ],
      },
      {
        id: "anarchosyndicalism-interprets-anarchism",
        predicate: "interprets-concept",
        subject: approach,
        object: anarchism,
        role: "core",
        interpretation:
          "Worker federation and direct industrial action are treated as both present organization and preparation for social transformation.",
        status: "qualified",
        statementIds: ["rocker-syndicalist-double-aim"],
      },
      {
        id: "anarchosyndicalism-advances-freedom-from-domination",
        predicate: "advances-end",
        subject: approach,
        object: { kind: "end", id: "freedom-from-domination" },
        status: "qualified",
        statementIds: [
          "anarchism-opposes-domination",
          "rocker-syndicalist-double-aim",
        ],
      },
      {
        id: "anarchosyndicalism-advocates-federation",
        predicate: "advocates-means",
        subject: approach,
        object: { kind: "means", id: "worker-union-federation" },
        status: "qualified",
        statementIds: [
          "anarchism-not-disorganization",
          "rocker-syndicalist-double-aim",
        ],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: {
      kind: "case-episode",
      id: "spanish-anarchist-initiatives-war-episode",
    },
    relationships: [
      {
        id: "spanish-episode-contested-anarchist-classification",
        predicate: "contested-in-case",
        subject: {
          kind: "case-episode",
          id: "spanish-anarchist-initiatives-war-episode",
        },
        object: anarchism,
        status: "qualified",
        statementIds: [
          "spanish-case-plurality",
          "anarchist-case-nonembodiment",
        ],
      },
    ],
  },
  ...cited.map(([statementId, sourceId, locator, role], index) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [
      {
        id: `anarchism-citation-${index + 1}`,
        predicate: "cites" as const,
        subject: { kind: "statement" as const, id: statementId },
        object: { kind: "source" as const, id: sourceId },
        role,
        locator,
      },
    ],
  })),
] satisfies AuthoringDocument[];
