import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

export const socialismCommunismVocabularyDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "socialism",
      kind: "concept",
      label: "Socialism",
      description:
        "A contested family of ideas about overcoming capitalist class relations through social and democratic control of production.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Use for the broad contested concept, not as a timeless label for a government, country, party, policy, or single institutional design.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Socialism",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q7272",
          url: "https://www.wikidata.org/wiki/Q7272",
          purpose: "identity",
          match: "exact",
          checkedAt: "2026-09-06",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "communism",
      kind: "concept",
      label: "Communism",
      description:
        "A contested concept used for classless social ideals, revolutionary traditions and movements, political organizations, and claimed historical systems.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Keep the ideal, tradition, movement, party identity, state or regime label, and institutions of every bounded case distinct.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Communism",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q6186",
          url: "https://www.wikidata.org/wiki/Q6186",
          purpose: "identity",
          match: "exact",
          checkedAt: "2026-09-06",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-planning",
      kind: "concept",
      label: "Economic planning",
      description:
        "The idea that production, investment, or allocation can be coordinated through consciously set plans rather than primarily through market exchange.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Use for the broad coordination idea, not as a concrete Means, a complete economic system, or proof of public or social ownership; central-planning institutions require separately specified authority, information, revision, and enforcement rules.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Economic_planning",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q3391448",
          url: "https://www.wikidata.org/wiki/Q3391448",
          purpose: "identity",
          match: "exact",
          checkedAt: "2026-09-06",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "market-coordination",
      kind: "concept",
      label: "Market coordination",
      description:
        "The idea of coordinating production and allocation through exchange, prices, and choices among buyers and sellers.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Use for a coordination idea, not as a synonym for capitalism, private ownership, or an unregulated economy; market rules and ownership arrangements must be identified separately.",
      externalRefs: [{ system: "wikipedia", url: "https://en.wikipedia.org/wiki/Market_economy", purpose: "orientation", language: "en", checkedAt: "2026-09-06" }],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-class",
      kind: "concept",
      label: "Social class",
      description:
        "A contested way of grouping people by their positions in economic and social relations, including relationships to productive property and labor.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not infer one class scheme from the label; ownership, occupation, authority, status, and political identity can produce different classifications.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Social_class",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q187588",
          url: "https://www.wikidata.org/wiki/Q187588",
          purpose: "identity",
          match: "exact",
          checkedAt: "2026-09-06",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "statelessness",
      kind: "concept",
      label: "Statelessness",
      description:
        "The condition or ideal of social organization without a coercive state apparatus.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Keep a proposed stateless ideal distinct from the absence of effective government, from a transition claim, and from evidence about authority in any bounded Case.",
      externalRefs: [{ system: "wikipedia", url: "https://en.wikipedia.org/wiki/Stateless_society", purpose: "orientation", language: "en", checkedAt: "2026-09-06" }],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
