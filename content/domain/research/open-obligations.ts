import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = {
  publicationStatus: "reviewed" as const,
  obligationStatus: "open" as const,
  statementIds: [],
  reviewedAt: "2026-09-05",
};

export const openResearchObligationDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-current-hearing-rules",
      kind: "research-obligation",
      label: "Current Kahnawà:ke hearing rules",
      description:
        "A focused freshness check for formal hearing rules after the documented April 2024 revision.",
      obligationType: "research-gap",
      question:
        "Which CDMRP hearing-continuation rules were formally in force after April 18, 2024, and which later revisions had been adopted as of September 5, 2026?",
      target: { kind: "case", id: "kahnawake-community-lawmaking" },
      targetSectionId: "how-does-the-process-work",
      addressedStatementIds: [
        "kahnawake-cdmrp-2024-hearing-rule-change",
        "kahnawake-cdmrp-2024-revised-hearing-rule",
      ],
      currentLimitation:
        "The dated January and April 2024 notices establish successive changes, while the commission’s public process page says revisions remain underway; the available record does not establish a complete current rule set through the review date.",
      evidenceNeeded:
        "Subsequent Kahnawà:ke Legislative Commission decisions, adopted CDMRP regulations or flowcharts with effective dates, and community notices identifying whether later proposals were adopted.",
      scope:
        "Formal CDMRP hearing-continuation rules from April 18, 2024 through September 5, 2026; not an inference about community assent or informal practice.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-participation-representativeness",
      kind: "research-obligation",
      label: "Participation and representation in Kahnawà:ke law-making",
      description:
        "A focused empirical test of who takes part in community law-making and whose views reach enacted laws.",
      obligationType: "counterevidence",
      question:
        "From 2009 through 2026, did participants in Kahnawà:ke’s Type I law-making hearings represent the affected community across different laws?",
      target: { kind: "case", id: "kahnawake-community-lawmaking" },
      targetSectionId: "what-do-we-know-about-practice",
      addressedStatementIds: [
        "kahnawake-cdmrp-type-one-design",
        "kahnawake-cdmrp-survey-attendance",
        "kahnawake-cdmrp-survey-concerns",
        "kahnawake-cdmrp-survey-sampling-limit",
      ],
      currentLimitation:
        "The formal process gives participants a voice, but the available survey does not establish who attended particular law-making sessions or whether participants reflected the people affected by each law.",
      evidenceNeeded:
        "Session-level attendance records, participant characteristics collected with community approval, draft-to-final change records, and interviews or surveys that include nonparticipants and affected groups.",
      scope:
        "Type I Kahnawà:ke laws and hearings from the first public hearing in 2009 through 2026; it does not infer participation in Longhouse, Confederacy, electoral, or informal community decisions.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-governing-authority-legitimacy",
      kind: "research-obligation",
      label: "Competing sources of governing authority in Kahnawà:ke",
      description:
        "A focused question about how community members understand the authority of institutions that the current evidence keeps distinct.",
      obligationType: "research-gap",
      question:
        "How do Kahnawa’kehró:non distinguish the authority of the Mohawk Council, Longhouse institutions, the Legislative Commission, and community hearing participants in law-making?",
      target: { kind: "case", id: "kahnawake-community-lawmaking" },
      targetSectionId: "is-this-simply-traditional-government",
      addressedStatementIds: [
        "kahnawake-cdmrp-hybrid-classification",
        "kahnawake-cdmrp-trust-contestation",
      ],
      currentLimitation:
        "Horn-Miller records rival positions and mistrust but does not provide a current, institution-by-institution account of legitimacy across the community.",
      evidenceNeeded:
        "Community-directed interviews, oral histories where participants authorize their use, institutional records, and research that preserves differences among political, legal, social, and spiritual authority.",
      scope:
        "Kahnawà:ke law-making authority from 2005 through 2026; it does not generalize to every Kanien’kehá:ka community or to the Haudenosaunee Confederacy as a whole.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-jurisdiction-enforcement",
      kind: "research-obligation",
      label: "Jurisdiction and enforcement of Kahnawà:ke laws",
      description:
        "A bounded institutional question about how law-making authority connects to enforcement when legal orders overlap.",
      obligationType: "research-gap",
      question:
        "For Kahnawà:ke laws enacted through the community process from 2005 through 2026, how did Canadian and Quebec institutions affect recognition and enforcement?",
      target: { kind: "case", id: "kahnawake-community-lawmaking" },
      addressedStatementIds: [
        "indian-act-band-administrative-definition",
        "indian-act-band-council-definition",
        "kahnawake-case-not-tribal-embodiment",
      ],
      currentLimitation:
        "The current case identifies overlapping community and Canadian institutional categories but does not trace recognition, conflict-of-law rules, or enforcement for particular enacted laws.",
      evidenceNeeded:
        "Selected enacted laws, court and tribunal records, enforcement agreements, administrative records, and community accounts for a preselected sample of legal disputes.",
      scope:
        "A sample of Kahnawà:ke laws enacted from 2005 through 2026; each field such as justice, membership, land, or commerce requires its own legal and institutional bounds.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "socialism-rival-classification-boundary",
      kind: "research-obligation",
      label: "Rival classifications of socialism",
      description:
        "A focused challenge to treating one institutional threshold as the whole boundary of a diverse historical family.",
      obligationType: "counterargument",
      question:
        "Does a social-and-democratic-control threshold exclude traditions historically classified as socialist chiefly through equality, cooperation, or state-led development?",
      target: { kind: "concept", id: "socialism" },
      targetSectionId: "what-defines-socialism",
      addressedStatementIds: [
        "socialism-democratic-control-minimum",
        "socialism-values-newman",
      ],
      currentLimitation:
        "The page contrasts Gilabert and O'Neill's institutional boundary with Newman's values-based history but does not yet test either classification against the strongest rival historical taxonomies.",
      evidenceNeeded:
        "Primary self-definitions and serious intellectual histories that classify ethical, cooperative, social-democratic, and state-development traditions, with explicit inclusion and exclusion criteria.",
      scope:
        "Named socialist traditions and classification rules in the nineteenth and twentieth centuries; not a verdict about whether every self-description is analytically decisive.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "socialism-communism-lexical-history",
      kind: "research-obligation",
      label: "Socialism and communism beyond the represented genealogy",
      description:
        "A bounded lexical-history question about meanings omitted by the current modern European source base.",
      obligationType: "research-gap",
      question:
        "How did selected non-European writers and movements distinguish terms translated as socialism and communism before and outside the Marxist lineage represented here?",
      target: { kind: "concept", id: "socialism" },
      targetSectionId: "how-do-socialism-and-communism-relate",
      addressedStatementIds: [
        "modern-communist-traditions-within-socialist-debates",
      ],
      currentLimitation:
        "The current genealogy is deliberately limited to modern traditions represented by English-language European primary texts and two synthetic histories.",
      evidenceNeeded:
        "Locally authored primary texts, specialist lexical histories, and scholarship attentive to translation in a small set of named languages and regions.",
      scope:
        "A comparative sample selected before research begins; it must not infer one universal prehistory from European vocabulary or translated communal practices.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "communism-roy-comintern-strategy",
      kind: "research-obligation",
      label: "M. N. Roy and Comintern strategy in India",
      description:
        "A regionally bounded test of a synthetic historian's interpretation using locally situated primary and scholarly accounts.",
      obligationType: "research-gap",
      question:
        "Between 1920 and 1928, did M. N. Roy and communist organizers in India reject Comintern strategy for organizing anti-colonial revolution?",
      target: { kind: "concept", id: "communism" },
      targetSectionId: "was-communism-one-global-movement",
      addressedStatementIds: [
        "eley-early-communist-network-geography",
        "eley-comintern-local-revision-interpretation",
      ],
      currentLimitation:
        "The current page reports Eley's synthesis but does not test it against Roy's writings, Indian organizational records, or locally authored scholarship.",
      evidenceNeeded:
        "Roy's dated writings and correspondence, Indian communist and anti-colonial organizational records, and scholarship by historians grounded in the region and relevant languages.",
      scope:
        "India and Roy's Comintern relationship from 1920 through 1928; Mariátegui, other regions, and later party-state development require separate obligations.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "socialism-democratic-control-threshold",
      kind: "research-obligation",
      label: "Democratic-control threshold for socialism",
      description:
        "A focused institutional question about when nominally public or collective ownership provides effective social control.",
      obligationType: "research-gap",
      question:
        "Which rights and accountability mechanisms are sufficient for productive assets to be under social and democratic control?",
      target: { kind: "concept", id: "socialism" },
      targetSectionId: "what-defines-socialism",
      addressedStatementIds: [
        "socialism-democratic-control-minimum",
        "socialism-not-statism",
      ],
      currentLimitation:
        "The definition distinguishes social control from undemocratic state control but does not establish a test across worker, community, public, cooperative, and delegated ownership arrangements.",
      evidenceNeeded:
        "Comparative institutional research specifying appointment, removal, participation, transparency, investment, use, and surplus-allocation rights in formal rules and practice.",
      scope:
        "Governance of productive assets; this question does not assume that one ownership form is sufficient or necessary in every socialist tradition.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "communism-claimed-identity-practice-gap",
      kind: "research-obligation",
      label: "Communist identity and bounded institutional practice",
      description:
        "A focused case-design question for comparing communist self-identification with institutions and rules in use.",
      obligationType: "research-gap",
      question:
        "Between adoption of the 1936 Soviet Constitution and Stalin's death in 1953, did formal ownership and rules in use eliminate a class with privileged control over productive assets?",
      target: { kind: "concept", id: "communism" },
      targetSectionId: "does-a-communist-label-settle-the-case",
      addressedStatementIds: ["communist-label-non-embodiment"],
      currentLimitation:
        "The current boundary prevents an embodiment claim but supplies no evidence about who exercised effective control over productive assets in this bounded Soviet period.",
      evidenceNeeded:
        "The constitution and property law, administrative and enterprise records, evidence about appointment and removal powers and privileged benefits, and independent Soviet social and economic history.",
      scope:
        "The Soviet Union from 1936 through 1953 and the single question of class control over productive assets; distribution, political repression, and later periods require separate obligations.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-ownership-delegation-accountability-gap",
      kind: "research-obligation",
      label: "Delegated control and social-ownership accountability",
      description:
        "A focused objection concerning nominally social assets controlled by officials, trustees, or fund managers who may not remain answerable to the intended constituency.",
      obligationType: "counterargument",
      question:
        "When does delegated control over collectively held assets cease to count as effective social ownership?",
      target: { kind: "concept", id: "social-ownership" },
      targetSectionId: "which-rights-must-be-separated",
      addressedStatementIds: ["social-ownership-control-boundary"],
      currentLimitation:
        "The current account separates title, benefit, control, and returns but does not establish a threshold at which delegation becomes unaccountable control by managers or the state.",
      evidenceNeeded:
        "Strong primary critiques and comparative cases that trace appointment, removal, transparency, contestation, voting, and surplus-allocation rights in practice.",
      scope:
        "Delegated governance of productive assets claimed to be held for workers, communities, or the public; not a claim that every representative or professional manager defeats social ownership.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-democracy-property-rights-objection",
      kind: "research-obligation",
      label: "Property-rights objection to economic democracy",
      description:
        "A focused objection concerning property rights and democratic authority in economic institutions.",
      obligationType: "counterargument",
      question:
        "Should owners' property rights take priority over democratic participation in firms?",
      target: { kind: "concept", id: "economic-democracy" },
      targetSectionId: "what-can-democratic-designs-fail-to-achieve",
      addressedStatementIds: [
        "economic-democracy-property-rights-objection-statement",
      ],
      currentLimitation:
        "The current account identifies this objection through Herzog's synthesis but does not yet test its strongest independent formulation.",
      evidenceNeeded:
        "A serious primary argument for the priority of ownership rights, its institutional assumptions, and directly responsive scholarship.",
      scope:
        "Normative authority within firms; claims about markets, state regulation, or particular ownership forms require separate treatment.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-democracy-decision-cost-objection",
      kind: "research-obligation",
      label: "Decision-cost objection to economic democracy",
      description:
        "A focused objection concerning coordination, competence, and the costs of democratic firm governance.",
      obligationType: "counterargument",
      question:
        "Can democratic firm governance coordinate specialized work without unacceptable decision costs?",
      target: { kind: "concept", id: "economic-democracy" },
      targetSectionId: "what-can-democratic-designs-fail-to-achieve",
      addressedStatementIds: [
        "economic-democracy-decision-cost-objection-statement",
      ],
      currentLimitation:
        "The current account identifies decision cost and competence concerns but does not independently compare their strongest versions with specific democratic designs.",
      evidenceNeeded:
        "Primary critical arguments and comparative evidence that distinguish direct participation, elected management, and representative governance.",
      scope:
        "Coordination and competence within firms; economy-wide planning and claims about distributive justice remain outside this question.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-democracy-futility-objection",
      kind: "research-obligation",
      label: "Futility objection to economic democracy",
      description:
        "A focused objection concerning formal participation that fails to change effective power.",
      obligationType: "counterargument",
      question:
        "When can formal economic participation reproduce domination instead of redistributing authority?",
      target: { kind: "concept", id: "economic-democracy" },
      targetSectionId: "what-can-democratic-designs-fail-to-achieve",
      addressedStatementIds: [
        "economic-democracy-futility-objection-statement",
      ],
      currentLimitation:
        "Herzog surveys exclusion, informal hierarchy, and wider market constraints, but the current account does not test when those mechanisms defeat formal rights.",
      evidenceNeeded:
        "Primary objections and bounded cases comparing formal governance rights with participation, minority inclusion, and decisions in practice.",
      scope:
        "The gap between formal and effective authority in democratic economic institutions; not a claim that every such institution fails.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-democracy-causal-identification",
      kind: "research-obligation",
      label: "Causal identification of democratic workplace effects",
      description:
        "An empirical-design question about attributing outcomes to worker voice or codetermination.",
      obligationType: "research-gap",
      question:
        "Under what conditions do codetermination or worker voice change firm outcomes independently of firm size, unionization, selection, and national institutions?",
      target: { kind: "concept", id: "economic-democracy" },
      targetSectionId: "what-can-democratic-designs-fail-to-achieve",
      addressedStatementIds: ["economic-democracy-design-and-evidence-limits"],
      currentLimitation:
        "Observed differences between firms or countries do not by themselves identify what the same units would have experienced without the institution.",
      evidenceNeeded:
        "Comparative studies with credible natural experiments, panel designs, discontinuities, or other explicit identification strategies.",
      scope:
        "Empirical claims about workplace-level participation and representation; not every economy-wide model of economic democracy.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "swedish-funds-ownership-counterfactual",
      kind: "research-obligation",
      label: "Counterfactual ownership without the Swedish funds",
      description:
        "A causal question about ownership changes attributable to the enacted wage-earner funds.",
      obligationType: "counterfactual",
      question:
        "How would Swedish listed-company ownership and wage-earner control have changed without the enacted funds?",
      target: { kind: "case", id: "swedish-wage-earner-funds" },
      targetSectionId: "what-they-did-in-practice",
      addressedStatementIds: ["funds-limited-control"],
      currentLimitation:
        "Available sources establish the funds' holdings and limited control but do not identify the ownership path Sweden would have followed without them.",
      evidenceNeeded:
        "A comparative or synthetic design with explicit ownership measures, treatment timing, comparison units, causal assumptions, and sensitivity tests.",
      scope:
        "Ownership and effective control associated with the five enacted boards from 1984 through abolition.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "swedish-funds-wage-formation-counterfactual",
      kind: "research-obligation",
      label: "Counterfactual wage formation without the Swedish funds",
      description:
        "A causal question about wage formation attributable to the enacted wage-earner funds.",
      obligationType: "counterfactual",
      question:
        "How would Swedish wage formation have changed without the enacted funds?",
      target: { kind: "case", id: "swedish-wage-earner-funds" },
      targetSectionId: "what-they-were-meant-to-do",
      addressedStatementIds: ["funds-declared-ends"],
      currentLimitation:
        "The available account identifies the enacted purposes and financing rules but does not isolate any effect on wage bargaining or wage restraint.",
      evidenceNeeded:
        "A design that specifies wage outcomes, treatment timing, bargaining institutions, comparison units, and concurrent labor-market policies.",
      scope:
        "Wage formation during the operation of the five enacted boards; the earlier Rehn–Meidner bargaining model is a separate intervention.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "swedish-funds-investment-counterfactual",
      kind: "research-obligation",
      label: "Counterfactual investment without the Swedish funds",
      description:
        "A causal question about investment changes attributable to the enacted wage-earner funds.",
      obligationType: "counterfactual",
      question:
        "How would Swedish capital formation and firms' investment financing have changed without the enacted funds?",
      target: { kind: "case", id: "swedish-wage-earner-funds" },
      addressedStatementIds: ["funds-statutory-design", "funds-practice"],
      currentLimitation:
        "The available account establishes the funds' financing and investment practice but not the investment path that would have occurred without them.",
      evidenceNeeded:
        "A comparative design with explicit capital-formation or financing outcomes, treatment timing, comparison units, and controls for concurrent macroeconomic changes.",
      scope:
        "Investment and capital formation associated with the five enacted boards from 1984 through abolition.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "swedish-funds-political-durability-counterfactual",
      kind: "research-obligation",
      label: "Counterfactual political durability of the Swedish funds",
      description:
        "A causal question about which institutional choices affected the funds' political durability.",
      obligationType: "counterfactual",
      question:
        "Would a different governance or representation design have made the enacted funds more politically durable?",
      target: { kind: "case", id: "swedish-wage-earner-funds" },
      targetSectionId: "why-the-case-matters",
      addressedStatementIds: [
        "funds-accountability-assessment",
        "funds-abolished",
      ],
      currentLimitation:
        "The available account establishes abolition and identifies accountability questions but does not isolate which design choices affected political support.",
      evidenceNeeded:
        "Comparative institutional evidence that specifies alternative governance designs, measures political durability, and tests rival explanations for abolition.",
      scope:
        "The political durability of the five enacted boards; claims about the feasibility of all collective funds remain outside this question.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-democracy-postwar-conditions",
      kind: "research-obligation",
      label: "Conditions for postwar social-democratic reform",
      description:
        "A comparative question prompted by competing accounts of social democracy's reform capacity.",
      obligationType: "research-gap",
      question:
        "Does social-democratic reform capacity decline when favorable postwar economic and institutional conditions are absent?",
      target: { kind: "concept", id: "social-democracy" },
      targetSectionId: "where-the-tradition-came-from",
      addressedStatementIds: ["social-democracy-genealogy-contested"],
      currentLimitation:
        "Riley argues that favorable economic conditions enabled reform, but the available comparisons do not test that dependence across countries and periods.",
      evidenceNeeded:
        "Comparative historical evidence with explicit case selection, measures of reform capacity, and competing explanations for variation over time.",
      scope:
        "Postwar reform capacity in democratic capitalist settings; not a general verdict on every social-democratic tradition or policy.",
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
