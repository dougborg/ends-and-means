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
        "How should a bounded case compare communist self-identification with its actual property, class, distribution, authority, and state institutions?",
      target: { kind: "concept", id: "communism" },
      targetSectionId: "does-a-communist-label-settle-the-case",
      addressedStatementIds: ["communist-label-non-embodiment"],
      currentLimitation:
        "The current boundary prevents embodiment claims but does not yet specify comparable observations for party identity, formal constitutional rules, administrative practice, social hierarchy, or ownership and distribution.",
      evidenceNeeded:
        "Official records and independent historical research for several explicitly bounded episodes, with the same institutional dimensions recorded separately from ideological claims.",
      scope:
        "Self-identified communist parties, governments, and states in named places and periods; not an aggregate verdict on communism or a country-wide timeless label.",
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
