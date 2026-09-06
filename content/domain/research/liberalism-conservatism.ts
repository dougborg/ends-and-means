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
        "A focused question about liberal categories in selected Indian political debate.",
      obligationType: "research-gap",
      question:
        "How did Indian political writers between 1858 and 1950 translate, reject, or reformulate British claims classified as liberal?",
      target: { kind: "concept", id: "liberalism" },
      targetSectionId: "meanings",
      addressedStatementIds: [
        "liberalism-plural-traditions",
        "liberalism-liberty-disputes",
      ],
      currentLimitation:
        "The conceptual synthesis is drawn mainly from English-language Atlantic debates, while the Indian and Japanese cases concern constitutional settlements rather than full local intellectual histories.",
      evidenceNeeded:
        "Selected English, Bengali, Hindi, and Urdu political texts, locally grounded intellectual histories, and explicit analysis of self-description versus later classification.",
      scope:
        "Selected Indian political debates from 1858 through constitutional adoption in 1950; no claim that one language, movement, or imported label represents Indian thought.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "liberalism-imperial-domination",
      kind: "research-obligation",
      label: "Liberal claims and imperial domination",
      description:
        "A focused counterargument about British liberal liberty claims and imperial rule in India.",
      obligationType: "counterargument",
      question:
        "How did nineteenth-century British liberal arguments justify imperial authority in India despite commitments to liberty and self-determination?",
      target: { kind: "concept", id: "liberalism" },
      targetSectionId: "exclusions",
      addressedStatementIds: [
        "mill-colonial-exclusion",
        "mehta-liberal-empire-tension",
      ],
      currentLimitation:
        "Mill and Mehta establish a British-imperial tension but do not yet center political arguments made by colonized Indian actors or compare rival liberal positions across administrations.",
      evidenceNeeded:
        "British Indian administrative records, writings by Indian critics and reformers, and intellectual histories comparing explicit liberty claims with specified exercises of imperial authority.",
      scope:
        "British rule in India and selected nineteenth-century arguments; not a claim that all liberal traditions justified empire in the same way.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "liberalism-gender-contract-boundary",
      kind: "research-obligation",
      label: "Liberal contract and women's political standing",
      description:
        "A focused counterargument about formally general contract claims and women's legal and political subordination.",
      obligationType: "counterargument",
      question:
        "Which marriage, property, and citizenship rules sustained women's subordination in the contract traditions criticized by Pateman?",
      target: { kind: "concept", id: "liberalism" },
      targetSectionId: "exclusions",
      addressedStatementIds: ["pateman-contract-gender-boundary"],
      currentLimitation:
        "Pateman supplies a theoretical critique without testing it against one bounded jurisdiction's formal rules and women's own political arguments.",
      evidenceNeeded:
        "Marriage, property, and citizenship law; contemporary arguments by women; and gender history for one preselected jurisdiction and period.",
      scope:
        "One selected jurisdiction between 1850 and 1950; race and class exclusions require separately designed questions.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "conservative-party-programme-drift",
      kind: "research-obligation",
      label: "Conservative party-program drift",
      description:
        "A focused research gap about changing party labels and programs.",
      obligationType: "research-gap",
      question:
        "How did the British Conservative Party's housing commitments change between its 1974 and 1992 manifestos?",
      target: { kind: "concept", id: "conservatism" },
      targetSectionId: "bounded-practice",
      addressedStatementIds: ["right-to-buy-conservative-programme"],
      currentLimitation:
        "The current evidence traces commitments before the 1980 enactment but does not compare the party's later changes to eligibility, discounts, receipts, and replacement housing.",
      evidenceNeeded:
        "The party's 1974–1992 manifestos, housing legislation, parliamentary debate, and independent histories separating program change from institutional outcomes.",
      scope:
        "The British Conservative Party's housing program from 1974 through 1992; no inference about other conservative parties or policy domains.",
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
        "How did Japanese actors use hōshu in party and constitutional debate from the 1955 party-system formation through 1970?",
      target: { kind: "concept", id: "conservatism" },
      targetSectionId: "meanings",
      addressedStatementIds: [
        "conservatism-broad-narrow",
        "conservatism-procedural-substantive",
      ],
      currentLimitation:
        "A locally grounded classification establishes one Indian use of economic conservatism but does not establish how Japanese self-description and later scholarly classification relate.",
      evidenceNeeded:
        "Japanese-language party programs and debates, locally grounded histories, and scholarship that distinguishes self-description, translation, and retrospective classification.",
      scope:
        "Japanese party and constitutional debates from 1955 through 1970; not a claim that hōshu has one stable or universal translation.",
      ...common,
    },
  },
] satisfies AuthoringDocument[];
