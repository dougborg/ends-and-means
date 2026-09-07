import type { AuthoringDocument } from "../../../src/lib/domain";

const common = {
  publicationStatus: "reviewed" as const,
  obligationStatus: "open" as const,
  statementIds: [],
  reviewedAt: "2026-09-06",
};

export const environmentalismResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "environmentalism-movement-effects",
      kind: "research-obligation",
      label: "Movement effects and coincident policy change",
      description:
        "A causal question separating organizing, institutional response, and concurrent change.",
      obligationType: "counterfactual",
      question:
        "Which environmental movement interventions changed a specified policy or outcome compared with what likely would have happened without them?",
      target: { kind: "concept", id: "environmentalism" },
      targetSectionId: "warren-county",
      addressedStatementIds: [
        "warren-county-protest",
        "warren-county-landfill-built",
        "warren-county-causal-boundary",
      ],
      currentLimitation:
        "The current sequence shows organizing, an immediate defeat, later research, and movement articulation without isolating one intervention's effect.",
      evidenceNeeded:
        "Policy-process records, participant accounts, rival explanations, comparison sites, and research designs that identify mechanism and counterfactual.",
      scope:
        "Named campaigns, institutions, outcomes, places, and periods rather than a general movement-effect estimate.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "environmentalism-colonial-conservation-outcomes",
      kind: "research-obligation",
      label: "Colonial conservation, displacement, and ecological outcomes",
      description:
        "A distributional and institutional comparison of protected-land arrangements.",
      obligationType: "counterevidence",
      question:
        "When conservation restricted customary access or displaced communities, how did authority, livelihoods, and ecological conditions change?",
      target: { kind: "concept", id: "environmentalism" },
      targetSectionId: "justice",
      addressedStatementIds: [
        "environmentalism-conservation-boundary",
        "colonial-conservation-displacement",
      ],
      currentLimitation:
        "The reviewed sources establish the category error and one Himalayan history but not comparative social and ecological outcomes across colonial conservation regimes.",
      evidenceNeeded:
        "Community and archival records, land-tenure histories, before-and-after ecological measures, and comparisons that retain coercion and displacement.",
      scope:
        "Bounded protected-land and forestry institutions under named colonial and postcolonial authorities.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "environmentalism-knowledge-authority",
      kind: "research-obligation",
      label: "Knowledge authority and control",
      description:
        "A question about who may define, share, and use environmental knowledge.",
      obligationType: "counterargument",
      question:
        "Who controls the production and use of knowledge in environmental decisions, and what authority do affected communities retain over restricted or community-held knowledge?",
      target: { kind: "concept", id: "environmentalism" },
      addressedStatementIds: [
        "indigenous-relations-boundary",
        "te-awa-iwi-provenance",
        "te-awa-environmentalism-boundary",
      ],
      currentLimitation:
        "Public statutory and organizational accounts cannot establish consent, access, and authority rules for knowledge that communities have not made public.",
      evidenceNeeded:
        "Community-authorized protocols, public self-descriptions, consent and data-governance rules, and research that does not solicit or expose restricted knowledge.",
      scope:
        "Named communities and institutions under their own publication and access rules; no extraction of restricted knowledge.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "environmentalism-north-south-translation",
      kind: "research-obligation",
      label: "Translation of environmentalist categories",
      description:
        "A focused test of externally applied movement labels across political histories.",
      obligationType: "research-gap",
      question:
        "When do actors claim, translate, reject, or receive labels such as environmentalism, livelihood environmentalism, or environmentalism of the poor?",
      target: { kind: "concept", id: "environmentalism" },
      targetSectionId: "meanings",
      addressedStatementIds: [
        "environmentalism-global-history-plural",
        "environmentalism-poor-attributed-classification",
      ],
      currentLimitation:
        "Two global syntheses and English-language case scholarship cannot establish community self-description or translation across languages and periods.",
      evidenceNeeded:
        "Original-language movement records, named translations, participant oral histories with publication provenance, and scholarship on local political vocabularies.",
      scope:
        "Specific organizations, communities, languages, and periods; no global hierarchy of authentic environmentalism.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "environmentalism-gendered-claims",
      kind: "research-obligation",
      label: "Gendered environmental claims and institutions",
      description:
        "A test of rival explanations for participation and authority.",
      obligationType: "counterargument",
      question:
        "How do labor, property, kinship, political authority, and exposure—not presumed identity—shape gendered participation in environmental action?",
      target: { kind: "concept", id: "environmentalism" },
      targetSectionId: "chipko",
      addressedStatementIds: [
        "chipko-women-participation",
        "chipko-ecofeminist-rival",
        "chipko-state-community-rival",
      ],
      currentLimitation:
        "The Chipko debate identifies material and institutional mechanisms but does not test their operation across other movements or among differently positioned women.",
      evidenceNeeded:
        "Participant accounts and disaggregated studies of work, tenure, caste, class, age, household position, authority, and movement decision-making.",
      scope:
        "Named movements and communities without attributing an innate relationship between women and nature.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "environmentalism-nuclear-divergence",
      kind: "research-obligation",
      label: "Environmental arguments about nuclear technologies",
      description:
        "A policy-boundary question preserving distinct energy and weapons debates.",
      obligationType: "research-gap",
      question:
        "How do environmental actors weigh climate, safety, waste, extraction, land, proliferation, and justice when arguing about nuclear power or nuclear weapons?",
      target: { kind: "concept", id: "environmentalism" },
      targetSectionId: "boundaries",
      addressedStatementIds: [
        "nuclear-environmental-policy-boundary",
        "environmentalism-climate-boundary",
      ],
      currentLimitation:
        "The current guide establishes only that no environmentalist label determines a nuclear position; it does not yet present the strongest rival arguments or their evidence.",
      evidenceNeeded:
        "Primary movement positions, energy-system and weapons evidence, affected-community testimony, and sources that keep civilian power, weapons, waste, mining, and security claims distinct.",
      scope:
        "Specified technologies, institutions, places, periods, and claims; no pro- or anti-nuclear score.",
      ...common,
    },
  },
] satisfies AuthoringDocument[];
