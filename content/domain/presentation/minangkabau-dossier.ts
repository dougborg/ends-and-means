import type { AuthoringDocument, Dossier } from "../../../src/lib/domain";

const dossier = {
  id: "matriliny-property-authority-dossier",
  kind: "dossier",
  label: "Matriliny, property, and authority",
  description:
    "An evidence-backed explanation of why maternal descent does not by itself determine ownership, management, office, or equality.",
  subject: { kind: "concept", id: "matriliny" },
  standfirst:
    "Matriliny traces descent or group membership through a maternal line. It does not, by itself, tell us where spouses live, who controls property, who holds office, or whether people experience equality.",
  standfirstStatementIds: [
    "matriliny-maternal-descent-definition",
    "matriliny-does-not-fix-authority",
  ],
  sections: [
    {
      id: "how-do-the-terms-differ",
      heading: "How do matriliny, matrilocality, and matriarchy differ?",
      body: "Matriliny is a descent principle. Matrilocality concerns where a couple lives after marriage; Sanday describes husbands moving into their wives’ households in the community she studied. Matriarchy is a disputed interpretive category: some use it for women’s rule, while Sanday uses it to describe maternal meanings, cooperation, and women’s social centrality. None of these terms can substitute for evidence about who decides, manages, works, benefits, or speaks in a particular setting.",
      traceStatus: "qualified",
      statementIds: [
        "matriliny-maternal-descent-definition",
        "matrilocality-residence-distinction",
        "matriliny-does-not-fix-authority",
        "matriarchy-rule-by-women-dispute",
      ],
      relatedEntityRefs: [
        { kind: "concept", id: "matrilocality" },
        { kind: "concept", id: "matriarchy" },
      ],
    },
    {
      id: "what-counts-as-power",
      heading: "Can formal office tell us who has power?",
      body: "Not on its own. Blackwood found senior women acting as heirs, household heads, and land controllers in one village even where men claimed formal kin authority. The Bonjol evidence points the other way in a different relationship: women’s inherited claims did not give them practical authority over communal-forest transactions. Power must therefore be traced across specific relationships rather than assigned to all women or all men.",
      traceStatus: "qualified",
      statementIds: [
        "minangkabau-power-varies-by-relation",
        "bonjol-ulayat-formal-distinction",
        "bonjol-harta-pusaka-transition",
      ],
    },
    {
      id: "how-are-local-terms-used",
      heading: "What do the retained local terms mean here?",
      body: "Adat refers here to customs, beliefs, norms, and laws rather than one code. Nagari names both a community and a territorial jurisdiction entangled with Indonesian administration. Adat, Islamic authority, and state administration remain distinct even where they interact. Ulayat describes collective territorial and resource claims. Harta pusaka—rendered harato pusako in the Bonjol article—names ancestral property, while harta pencaharian names property acquired through a person’s own efforts in Colombijn’s 1990s Padang study. The Bonjol authors describe Bundo Kanduang as a respected senior maternal figure with an advisory role; the title does not establish that every woman governs.",
      traceStatus: "qualified",
      statementIds: [
        "adat-translation-boundary",
        "nagari-translation-boundary",
        "minangkabau-legal-orders-interact",
        "minangkabau-ancestral-acquired-property-distinction",
        "bonjol-ulayat-formal-distinction",
        "bonjol-harta-pusaka-transition",
        "bonjol-bundo-kanduang-role",
      ],
    },
    {
      id: "what-can-koto-tinggi-show",
      heading: "What can Koto Tinggi show about public authority?",
      body: "In October 2016, Koto Tinggi’s formal design divided work among an elected executive, a representative council, and a customary council. Meeting rules included women’s-group delegates and consensus procedures, but the study does not establish women’s influence in those meetings. Customary leaders disputed the dual-council arrangement, and one budget episode showed council members using postponement and consensus while administrative capacity remained limited.",
      traceStatus: "qualified",
      statementIds: [
        "koto-tinggi-fieldwork-scope",
        "koto-tinggi-minangkabau-adat-context",
        "koto-tinggi-three-institutions",
        "koto-tinggi-formal-participation-rules",
        "koto-tinggi-formal-decision-rule",
        "koto-tinggi-customary-council-contestation",
        "koto-tinggi-budget-rules-in-use",
        "koto-tinggi-budget-consensus",
        "koto-tinggi-administrative-capacity-limit",
        "koto-tinggi-regulatory-preparation-limit",
      ],
      relatedEntityRefs: [
        { kind: "case", id: "koto-tinggi-post-decentralization-governance" },
        {
          kind: "case-episode",
          id: "koto-tinggi-governance-october-2016",
        },
      ],
    },
    {
      id: "what-can-bonjol-show",
      heading: "What can Bonjol show about inheritance and control?",
      body: "The Bonjol study distinguishes collective ulayat claims, access to land, inherited harta pusaka, delegated management, and the receipt of benefits. It reports that male customary officeholders enabled outsider transactions and controlled an oil-palm recipient list even though the agreement promised plots to 500 households. Some women declined to discuss the dispute; five women who did speak described anger and an inability to influence the men representing the clan.",
      traceStatus: "qualified",
      statementIds: [
        "bonjol-study-method-and-voice",
        "bonjol-ulayat-formal-distinction",
        "bonjol-ulayat-delegated-management",
        "bonjol-harta-pusaka-transition",
        "bonjol-bundo-kanduang-role",
        "bonjol-ulayat-sales-rules-in-use",
        "bonjol-neshp-formal-promise",
        "bonjol-neshp-distribution-practice",
        "bonjol-neshp-exclusion-outcome",
        "bonjol-women-testimony-limit",
        "bonjol-five-women-testimony",
        "bonjol-authors-causal-interpretation",
      ],
      relatedEntityRefs: [
        { kind: "case", id: "bonjol-melayu-ulayat-governance" },
        { kind: "case-episode", id: "bonjol-ulayat-governance-2000-2016" },
      ],
    },
    {
      id: "why-cant-the-cases-be-generalized",
      heading: "Why can’t these cases stand for all Minangkabau communities?",
      body: "They examine different institutions in two places through limited studies conducted in 2016. The Bonjol authors expressly reject a society-wide generalization, and the Koto Tinggi article does not identify whose testimony represents women’s experience. Other scholarship documents historically changing relations among kinship, markets, religion, and the state. Provincial nagari law also changed after both field studies.",
      traceStatus: "qualified",
      statementIds: [
        "koto-tinggi-fieldwork-scope",
        "bonjol-study-method-and-voice",
        "bonjol-new-nagari-forest-transition",
        "bonjol-no-minangkabau-generalization",
        "minangkabau-practices-historically-changing",
        "nagari-law-changed-after-cases",
      ],
    },
  ],
  publicationStatus: "reviewed",
  reviewedAt: "2026-09-06",
} satisfies Dossier;

export const minangkabauDossierDocuments = [
  { documentType: "entity", entity: dossier },
] satisfies AuthoringDocument[];
