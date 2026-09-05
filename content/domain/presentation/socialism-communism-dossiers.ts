import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const socialism = attachNarrative("socialism.md", {
  id: "socialism-dossier",
  kind: "dossier" as const,
  label: "Socialism dossier",
  description:
    "An evidence-backed orientation to socialism's minimum boundary, recurring values, institutional disagreements, and relationship to communism.",
  subject: { kind: "concept" as const, id: "socialism" },
  standfirst: "",
  standfirstStatementIds: [
    "socialism-contested-family",
    "socialism-democratic-control-minimum",
  ],
  sections: [
    {
      id: "what-defines-socialism",
      heading: "What defines socialism?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "socialism-democratic-control-minimum",
        "socialism-not-statism",
        "socialism-values-newman",
      ],
      relatedEntityRefs: [
        { kind: "concept" as const, id: "social-ownership" },
        { kind: "concept" as const, id: "economic-democracy" },
      ],
    },
    {
      id: "why-is-the-term-so-broad",
      heading: "Why is the term so broad?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "socialism-contested-family",
        "socialism-three-distinct-questions",
        "socialism-values-newman",
        "socialism-global-historical-variation",
      ],
    },
    {
      id: "which-institutions-and-paths-are-disputed",
      heading: "Which institutions and paths are disputed?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "socialism-market-boundary",
        "socialism-organizational-disagreement",
      ],
      relatedEntityRefs: [
        { kind: "concept" as const, id: "market-socialism" },
        { kind: "concept" as const, id: "social-democracy" },
      ],
    },
    {
      id: "how-do-socialism-and-communism-relate",
      heading: "How do socialism and communism relate?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "modern-communist-traditions-within-socialist-debates",
        "communist-organizational-rivalry",
      ],
      relatedEntityRefs: [{ kind: "concept" as const, id: "communism" }],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-05",
});

const communism = attachNarrative("communism.md", {
  id: "communism-dossier",
  kind: "dossier" as const,
  label: "Communism dossier",
  description:
    "An evidence-backed orientation separating communist ideals, property claims, transition proposals, movements, labels, and bounded practice.",
  subject: { kind: "concept" as const, id: "communism" },
  standfirst: "",
  standfirstStatementIds: [
    "communism-multiple-referents",
    "communist-label-non-embodiment",
  ],
  sections: [
    {
      id: "what-can-communism-mean",
      heading: "What can communism mean?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["communism-multiple-referents"],
    },
    {
      id: "what-did-marx-and-engels-propose",
      heading: "What did Marx and Engels propose?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: [
        "manifesto-communist-immediate-aim",
        "manifesto-bourgeois-property-boundary",
        "manifesto-common-property-class-character",
      ],
    },
    {
      id: "did-communists-agree-on-the-path-or-destination",
      heading: "Did communists agree on the path or destination?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "marx-lower-phase-inherited-limits",
        "marx-lower-phase-labor-distribution",
        "marx-higher-phase-conditions",
        "marx-higher-phase-needs-distribution",
        "lenin-transitional-state-claim",
        "lenin-state-withering-claim",
        "kropotkin-anarchist-communist-route",
        "kropotkin-nonparliamentary-route",
      ],
    },
    {
      id: "was-communism-one-global-movement",
      heading: "Was communism one global movement?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "eley-early-communist-network-geography",
        "eley-comintern-local-revision-interpretation",
      ],
    },
    {
      id: "does-a-communist-label-settle-the-case",
      heading: "Does a communist label settle the case?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["communist-label-non-embodiment"],
      relatedEntityRefs: [{ kind: "concept" as const, id: "socialism" }],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-05",
});

export const socialismCommunismDossierDocuments = [
  { documentType: "entity", entity: socialism },
  { documentType: "entity", entity: communism },
] satisfies AuthoringDocument[];
