import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const dossier = attachNarrative("populism.md", {
  id: "populism-dossier",
  kind: "dossier" as const,
  label: "Populism dossier",
  description: "Populism is a disputed category for politics that constructs a morally privileged people against an elite; rival definitions select ideology, discourse, style, strategy, or anti-pluralism, and none follows from popularity or policy alone.",
  subject: { kind: "concept" as const, id: "populism" },
  standfirst: "",
  standfirstStatementIds: ["populism-contested-category", "populism-people-elite-core", "popularity-insufficient", "redistribution-insufficient"],
  sections: [
    { id: "definitions", heading: "Why do researchers define populism differently?", body: "", traceStatus: "qualified" as const, statementIds: ["populism-contested-category", "mudde-thin-ideology", "weyland-strategy-definition", "aslanidis-discourse-definition", "moffitt-style-definition", "muller-antipluralism", "populism-label-provenance"] },
    { id: "people-and-elite", heading: "Who counts as the people—and the elite?", body: "", traceStatus: "qualified" as const, statementIds: ["populism-people-elite-core", "people-is-constructed", "anti-elitism-antipluralism-distinct"] },
    { id: "democracy", heading: "Does populism widen or weaken democracy?", body: "", traceStatus: "qualified" as const, statementIds: ["democratic-ambivalence", "anti-elitism-antipluralism-distinct", "popularity-insufficient"] },
    { id: "peoples-party", heading: "What did the United States People's Party claim?", body: "", traceStatus: "qualified" as const, statementIds: ["omaha-corruption-claim", "omaha-institutional-demands", "peoples-party-fusion-boundary", "peoples-party-case-limit"], relatedEntityRefs: [{ kind: "case" as const, id: "us-peoples-party-1890-1896" }] },
    { id: "peronism", heading: "What can the first Perón governments establish?", body: "", traceStatus: "qualified" as const, statementIds: ["peron-social-justice-constitution", "peron-organized-community", "peronism-self-description-boundary", "peron-case-limit"], relatedEntityRefs: [{ kind: "case" as const, id: "peronist-formation-1943-1955" }] },
    { id: "zambia", heading: "How did Sata mobilize in opposition?", body: "", traceStatus: "qualified" as const, statementIds: ["sata-urban-poor-strategy", "sata-china-rhetoric", "zambia-opposition-institution", "zambia-case-limit"], relatedEntityRefs: [{ kind: "case" as const, id: "zambia-pf-opposition-2001-2008" }] },
    { id: "thailand", heading: "Why isn't a redistributive program enough?", body: "", traceStatus: "qualified" as const, statementIds: ["thai-policy-program", "thaksin-classification-developed", "prachaniyom-translation-boundary", "thailand-case-limit"], relatedEntityRefs: [{ kind: "case" as const, id: "thai-rak-thai-government-2001-2006" }] },
    { id: "comparisons", heading: "What should a comparison keep separate?", body: "", traceStatus: "qualified" as const, statementIds: ["populism-label-provenance", "host-ideology-boundary", "redistribution-insufficient", "people-is-constructed"] },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-07",
});

export const populismGuideDocuments = [
  { documentType: "entity", entity: dossier },
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-populism",
      slug: "populism",
      label: "Populism",
      description: "Populism is a disputed category for politics that opposes a morally privileged people to an elite; ideology, discourse, style, strategy, and anti-pluralist definitions select different evidence, and popularity or redistribution alone does not settle the label.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "concept", id: "populism" },
      searchQueries: [
        { query: "populism" },
        { query: "what is populism" },
        { query: "populist meaning" },
        { query: "left wing populism vs right wing populism", resultStatus: "research-gap", disambiguation: "Left and right labels name host projects whose specific institutions and constituencies require separate evidence." },
        { query: "populism and democracy" },
      ],
      sections: [
        { id: "short-answer", role: "short-answer", heading: "What does populism mean?", narrativeRefs: [{ dossierId: "populism-dossier" }] },
        { id: "meanings-and-boundaries", role: "meanings-and-boundaries", heading: "Why does the definition matter?", narrativeRefs: [{ dossierId: "populism-dossier", sectionId: "definitions" }, { dossierId: "populism-dossier", sectionId: "people-and-elite" }], entityRefs: [{ kind: "concept", id: "populism" }] },
        { id: "variants", role: "variants-and-disputes", heading: "What changes across rival definitions?", statementIds: ["mudde-thin-ideology", "weyland-strategy-definition", "aslanidis-discourse-definition", "moffitt-style-definition", "muller-antipluralism"], researchObligationIds: ["populism-definition-sensitivity", "populism-translation-category-travel"] },
        { id: "democracy", role: "institutions-and-mechanisms", heading: "What should democratic analysis test?", narrativeRefs: [{ dossierId: "populism-dossier", sectionId: "democracy" }], statementIds: ["democratic-ambivalence", "anti-elitism-antipluralism-distinct"] },
        { id: "bounded-practice", role: "bounded-practice", heading: "What do four bounded formations show?", narrativeRefs: [{ dossierId: "populism-dossier", sectionId: "peoples-party" }, { dossierId: "populism-dossier", sectionId: "peronism" }, { dossierId: "populism-dossier", sectionId: "zambia" }, { dossierId: "populism-dossier", sectionId: "thailand" }], entityRefs: [{ kind: "case", id: "us-peoples-party-1890-1896" }, { kind: "case", id: "peronist-formation-1943-1955" }, { kind: "case", id: "zambia-pf-opposition-2001-2008" }, { kind: "case", id: "thai-rak-thai-government-2001-2006" }] },
        { id: "comparisons-and-next-steps", role: "comparisons-and-next-steps", heading: "What should be compared next?", narrativeRefs: [{ dossierId: "populism-dossier", sectionId: "comparisons" }], researchObligationIds: ["populism-people-exclusions", "populism-inclusion-antipluralism", "populism-leader-organization-counterfactual", "populism-policy-attribution"] },
        { id: "open-questions", role: "open-questions", heading: "What remains unsettled?", researchObligationIds: ["populism-definition-sensitivity", "populism-people-exclusions", "populism-inclusion-antipluralism", "populism-leader-organization-counterfactual", "populism-translation-category-travel", "populism-policy-attribution"] },
      ],
      reviewedAt: "2026-09-07",
    },
  },
] satisfies AuthoringDocument[];
