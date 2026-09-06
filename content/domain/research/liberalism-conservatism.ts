import type { AuthoringDocument } from "../../../src/lib/domain";

const common = {
  publicationStatus: "reviewed" as const,
  obligationStatus: "open" as const,
  statementIds: [],
  reviewedAt: "2026-09-06",
};

export const liberalismConservatismResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "liberalism-geographic-translation",
      kind: "research-obligation",
      label: "Liberalism across languages and intellectual traditions",
      description:
        "A focused question about how liberal categories travel beyond the Atlantic sources used here.",
      obligationType: "research-gap",
      question:
        "How have political actors outside Europe and North America translated, rejected, or reformulated claims classified as liberal?",
      target: { kind: "concept", id: "liberalism" },
      targetSectionId: "meanings",
      addressedStatementIds: [
        "liberalism-plural-traditions",
        "liberalism-liberty-disputes",
      ],
      currentLimitation:
        "The conceptual synthesis is drawn mainly from English-language Atlantic debates, while the Indian and Japanese cases concern constitutional settlements rather than full local intellectual histories.",
      evidenceNeeded:
        "Primary political texts in original languages, scholarship grounded in local intellectual histories, and explicit analysis of when liberalism is a self-description or an external classification.",
      scope:
        "Preselected traditions, languages, institutions, and periods; no regional essence or claim that one translated label has a universal meaning.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "liberalism-exclusion-domination",
      kind: "research-obligation",
      label: "Liberal claims and structured exclusion",
      description:
        "A focused counterargument about the people excluded from formally universal liberty and rights claims.",
      obligationType: "counterargument",
      question:
        "When did liberal arguments or institutions extend liberty selectively while sustaining imperial, racial, gender, or class domination?",
      target: { kind: "concept", id: "liberalism" },
      targetSectionId: "exclusions",
      addressedStatementIds: [
        "mill-colonial-exclusion",
        "mehta-liberal-empire-tension",
        "pateman-contract-gender-boundary",
      ],
      currentLimitation:
        "The selected sources establish major imperial and gender critiques but do not compare legal membership, material power, and resistance across bounded cases.",
      evidenceNeeded:
        "Colonial and constitutional records, writings by excluded people, gender- and race-specific legal histories, and comparable evidence of formal rights and effective power.",
      scope:
        "Named jurisdictions, populations, and periods; not a claim that all liberal arguments reproduce the same exclusion.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "liberal-conservative-party-label-drift",
      kind: "research-obligation",
      label: "Liberal and conservative party-label drift",
      description:
        "A focused research gap about changing party labels and programs.",
      obligationType: "research-gap",
      question:
        "How have parties using liberal or conservative labels changed their programs across countries and periods?",
      target: { kind: "concept", id: "conservatism" },
      targetSectionId: "party-programmes",
      addressedStatementIds: ["cdu-programme-change-boundary"],
      currentLimitation:
        "The CDU case demonstrates rapid program change within one party, but the present evidence cannot explain label drift across party systems or apply that result to liberal parties.",
      evidenceNeeded:
        "Dated party programs, organizational histories, election materials, and scholarship comparing self-description with external classification in preselected party systems.",
      scope:
        "Named parties and program periods; no inference from contemporary United States party usage to other places or eras.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "conservatism-geographic-translation",
      kind: "research-obligation",
      label: "Conservatism outside its Atlantic genealogy",
      description:
        "A focused question about externally imposed and locally used conservative classifications.",
      obligationType: "research-gap",
      question:
        "Which non-Atlantic actors have used an equivalent of conservatism as a self-description, and when is the term instead an external classification?",
      target: { kind: "concept", id: "conservatism" },
      targetSectionId: "meanings",
      addressedStatementIds: [
        "conservatism-broad-narrow",
        "conservatism-procedural-substantive",
      ],
      currentLimitation:
        "The guide's intellectual genealogy and bounded cases remain European, so they cannot establish how the category works in other languages or institutional histories.",
      evidenceNeeded:
        "Original-language texts, locally grounded intellectual histories, organizational records, and scholarship that separates translation from retrospective classification.",
      scope:
        "Preselected languages, societies, organizations, and periods; not a search for a universal conservative essence.",
      ...common,
    },
  },
] satisfies AuthoringDocument[];
