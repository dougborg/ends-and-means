import type { AuthoringDocument } from "../../../src/lib/domain";

const base = {
  publicationStatus: "reviewed" as const,
  obligationStatus: "open" as const,
  statementIds: [],
  reviewedAt: "2026-09-06",
};
const obligation = (entity: Record<string, unknown>): AuthoringDocument =>
  ({
    documentType: "entity",
    entity: { ...entity, kind: "research-obligation", ...base },
  }) as unknown as AuthoringDocument;

export const nationalismColonialismImperialismResearchDocuments = [
  obligation({
    id: "nationalism-translation-people-nation",
    label: "Nation and people across languages",
    description:
      "A focused translation question about political membership terms that do not map cleanly onto English nation-state vocabulary.",
    obligationType: "research-gap",
    question:
      "How did selected Hawaiian, Akan, and Bandung participants distinguish nation, people, country, race, community, and self-determination in their own political languages?",
    target: { kind: "concept", id: "nationalism" },
    addressedStatementIds: [
      "nation-state-boundary",
      "self-determination-statehood-boundary",
    ],
    currentLimitation:
      "The current synthesis uses English manifestations and records Hawaiian bilingual provenance but cannot establish equivalent semantic fields across Hawaiian, Akan languages, Indonesian, French, or conference interpretation.",
    evidenceNeeded:
      "Community-authorized language scholarship, original-language political texts, named translators, and histories of each term's institutional use.",
    scope:
      "Selected Hawaiian, Gold Coast/Ghanaian, and Bandung political settings from 1893 through 1963; no universal translation table.",
  }),
  obligation({
    id: "nationalism-unity-exclusion",
    label: "Who national unity excluded",
    description:
      "A counterevidence question about membership and distribution beneath asserted national unity.",
    obligationType: "counterevidence",
    question:
      "Which laws, organizational practices, and affected-person accounts show who could participate in or was excluded from the national projects selected here?",
    target: { kind: "concept", id: "nationalism" },
    addressedStatementIds: [
      "anderson-horizontal-inequality",
      "chatterjee-state-unity-limit",
      "national-unity-exclusion-boundary",
    ],
    currentLimitation:
      "The evidence establishes that asserted fraternity can coexist with inequality but does not compare exclusion by gender, class, race, caste, language, region, or citizenship across the selected cases.",
    evidenceNeeded:
      "Membership rules, voting and property records, women's and labor organizations' sources, and community testimony with publication provenance.",
    scope:
      "The Hawaiian, Bandung, and Ghana cases in their stated periods; not national projects generally.",
  }),
  obligation({
    id: "colonialism-independence-institutional-persistence",
    label: "Institutions after formal independence",
    description:
      "A counterfactual about which institutions would have changed absent continued colonial-era arrangements.",
    obligationType: "counterfactual",
    question:
      "Which property, labor, administrative, military, and financial relations persisted after selected independence transitions, and what credible comparison separates colonial inheritance from later choices and constraints?",
    target: { kind: "concept", id: "colonialism" },
    targetSectionId: "decolonization",
    addressedStatementIds: ["ghana-neocolonial-limit"],
    currentLimitation:
      "The legal transition is documented, but the current evidence neither measures institutional persistence nor identifies a credible causal comparison.",
    evidenceNeeded:
      "Pre/post institutional records, locally grounded histories, distributional evidence, and matched or process-traced comparisons testing rival causal accounts.",
    scope:
      "Ghana after legal independence on 6 March 1957; the evidentiary endpoint remains to be justified by the research.",
  }),
  obligation({
    id: "colonialism-settler-indigenous-scope",
    label: "Indigenous boundaries for settler-colonial analysis",
    description:
      "A counterargument about when an external settler-colonial classification clarifies or overrides Indigenous political descriptions.",
    obligationType: "counterargument",
    question:
      "How do Kānaka Maoli scholars and community institutions bound land, nation, occupation, settlement, and colonial continuity, and where do they dispute the settler-colonial frame?",
    target: { kind: "concept", id: "colonialism" },
    addressedStatementIds: [
      "kaulia-lahui-annexation-refusal",
      "silva-continuing-sovereignty-claim",
      "hawaii-case-boundary",
    ],
    currentLimitation:
      "Silva and the Kūʻē petitions materially shape the account, but two sources cannot establish the range of present community positions or permissions around living knowledge.",
    evidenceNeeded:
      "Published community protocols and statements, Hawaiian-language scholarship, affected-person accounts, and explicit provenance and authorization review.",
    scope:
      "The Hawaiian Kingdom overthrow and annexation history and carefully bounded living claims; not all Indigenous nations or settler colonies.",
  }),
  obligation({
    id: "imperialism-informal-falsifiability",
    label: "Testing informal empire",
    description:
      "A counterevidence question requiring observable thresholds for external direction rather than rhetorical similarity.",
    obligationType: "counterevidence",
    question:
      "What evidence would distinguish asymmetric interdependence from external direction through finance, bases, concessions, trade, or policy conditionality in a specified formally sovereign state?",
    target: { kind: "concept", id: "imperialism" },
    addressedStatementIds: [
      "formal-informal-empire-boundary",
      "nkrumah-neocolonial-definition",
      "imperial-allegation-proof-boundary",
    ],
    currentLimitation:
      "Nkrumah identifies mechanisms, but the current evidence does not set one portable quantitative threshold or test his account against rival explanations in a bounded contemporary case.",
    evidenceNeeded:
      "Contracts, ownership and payment flows, policy records, decision correspondence, counterparty alternatives, and rival process-tracing or causal designs.",
    scope:
      "One named relationship, mechanism, place, and period at a time; no global country ranking.",
  }),
  obligation({
    id: "imperialism-capital-geopolitics-counterfactual",
    label: "Capital and geopolitical rival explanations",
    description:
      "A counterfactual separating accumulation-centered from strategic and state-centered explanations.",
    obligationType: "counterfactual",
    question:
      "Would a selected imperial intervention likely have occurred without the identified investment or commodity interest, given strategic, domestic-political, and ideological alternatives?",
    target: { kind: "concept", id: "imperialism" },
    targetSectionId: "theories",
    addressedStatementIds: ["capitalist-imperialism-rival-boundary"],
    currentLimitation:
      "The present guide identifies rival theory families but does not adjudicate them in one intervention with mechanism-level evidence.",
    evidenceNeeded:
      "Contemporaneous cabinet, military, corporate, financial, and affected-community records plus explicit process-tracing tests of rival predictions.",
    scope:
      "A future named intervention with a bounded decision interval; not imperialism as a whole.",
  }),
] satisfies AuthoringDocument[];
