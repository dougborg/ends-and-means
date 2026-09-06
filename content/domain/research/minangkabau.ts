import type { AuthoringDocument } from "../../../src/lib/domain";

const base = {
  target: { kind: "concept" as const, id: "matriliny" },
  statementIds: [],
  obligationStatus: "open" as const,
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
};

export const minangkabauResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "koto-tinggi-community-voices",
      kind: "research-obligation",
      label: "Koto Tinggi community voices and influence",
      description:
        "A focused gap concerning who participated in the Koto Tinggi study and development meetings.",
      obligationType: "research-gap",
      question:
        "Whose accounts support the Koto Tinggi findings, and how did women’s-group delegates and other residents influence decisions rather than merely hold formal seats?",
      targetSectionId: "what-can-koto-tinggi-show",
      addressedStatementIds: [
        "koto-tinggi-fieldwork-scope",
        "koto-tinggi-formal-participation-rules",
      ],
      currentLimitation:
        "The article names observation, interviews, a focus group, and document study but gives no participant counts, demographic breakdown, interview schedule, or attributed testimony from women; no community-controlled Koto Tinggi record has been located.",
      evidenceNeeded:
        "Period-appropriate meeting records and community publications, a complete methods appendix or author clarification, and separately attributed testimony from women’s-group delegates and other affected residents.",
      scope:
        "Koto Tinggi’s nagari institutions and development meetings documented in 2016; October dates the fieldwork, not every reported meeting, and no inference is made to other nagari.",
      ...base,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "bonjol-inheritance-effective-control",
      kind: "research-obligation",
      label: "Inheritance and effective control in Bonjol",
      description:
        "A focused test of nominal claims, management authority, disposal, and receipt of benefits.",
      obligationType: "counterevidence",
      question:
        "Across Melayu-clan households in Bonjol, who could inherit, use, manage, transfer, contest, and receive income from each category of land?",
      targetSectionId: "what-can-bonjol-show",
      addressedStatementIds: [
        "bonjol-ulayat-formal-distinction",
        "bonjol-harta-pusaka-transition",
        "bonjol-ulayat-sales-rules-in-use",
        "bonjol-neshp-distribution-practice",
      ],
      currentLimitation:
        "The study distinguishes several rights and reports contested transactions, but its 27-household snapshot does not provide a complete property ledger or a representative distribution of control and benefits.",
      evidenceNeeded:
        "A predeclared sample linking land category, lineage membership, formal claim, actual manager, consent procedure, transfer history, dispute record, labor contribution, and benefits received.",
      scope:
        "Melayu-clan ulayat and converted smallholdings in Nagari Bonjol from 2000 through April 2016; separately report other clans and later periods.",
      ...base,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "minangkabau-migration-class-generation",
      kind: "research-obligation",
      label: "Migration, class, and generation within matrilineal relations",
      description:
        "A distributional question about who can exercise kin and property claims under changing social conditions.",
      obligationType: "research-gap",
      question:
        "How do migration history, wealth, education, occupation, and generation alter women’s and men’s ability to exercise kinship and property claims in specified Minangkabau communities?",
      addressedStatementIds: [
        "minangkabau-power-varies-by-relation",
        "minangkabau-practices-historically-changing",
        "bonjol-authors-causal-interpretation",
      ],
      currentLimitation:
        "The present sources identify these differences as mechanisms or contexts but do not measure their separate effects across comparable households and communities.",
      evidenceNeeded:
        "Community-specific longitudinal or comparative evidence stratified by migration, wealth, education, occupation, and generation, with claims and practices reported separately.",
      scope:
        "Named Minangkabau communities and cohorts; no regional average should be treated as a timeless kinship rule.",
      ...base,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "minangkabau-religious-authority",
      kind: "research-obligation",
      label: "Religious authority and matrilineal practice",
      description:
        "A focused question about how religious interpretation enters specific property and family decisions.",
      obligationType: "research-gap",
      question:
        "Which religious actors, doctrines, and forums shape inheritance, marriage, residence, and property decisions in particular Minangkabau communities, and how are disagreements resolved?",
      addressedStatementIds: [
        "minangkabau-practices-historically-changing",
        "adat-translation-boundary",
        "minangkabau-power-varies-by-relation",
      ],
      currentLimitation:
        "The present evidence establishes interaction between adat and Islamic reform or authority but does not trace a decision from competing interpretations to an observed outcome in either bounded case.",
      evidenceNeeded:
        "Located decisions, sermons or religious opinions, customary records, litigant or household testimony, and observed outcomes for one defined dispute or institutional process.",
      scope:
        "Specified decisions and religious institutions in named nagari and periods; not Islam or Minangkabau practice in general.",
      ...base,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "minangkabau-state-administration-effects",
      kind: "research-obligation",
      label: "State administration and local authority",
      description:
        "A causal question about administrative reforms and distributions of local authority.",
      obligationType: "counterfactual",
      question:
        "How would authority, participation, property control, and dispute resolution likely have differed in Koto Tinggi and Bonjol without the specific decentralization, village-governance, and forest-administration changes they experienced?",
      addressedStatementIds: [
        "koto-tinggi-three-institutions",
        "koto-tinggi-customary-council-contestation",
        "bonjol-new-nagari-forest-transition",
        "nagari-law-changed-after-cases",
      ],
      currentLimitation:
        "The studies describe institutional change and subsequent practice but do not identify the reforms’ effects separately from leadership, markets, forest concessions, clan relations, or longer historical change.",
      evidenceNeeded:
        "A documented comparison with pre-reform practice or matched nagari exposed to different administrative timing, plus process evidence linking the legal change to actor authority and outcomes.",
      scope:
        "The named governance and forest institutions in Koto Tinggi and Bonjol from about 2000 through 2016; later law requires a separate period.",
      ...base,
    },
  },
] satisfies AuthoringDocument[];
