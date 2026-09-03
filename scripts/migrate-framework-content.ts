#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ContentGraph } from "../src/lib/content/model";
import type { FrameworkDraftGraph, FrameworkChallenge, Tradition } from "../src/lib/framework/model";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const traditionIds: Record<string, string> = {
  lf: "laissez-faire-capitalism",
  sd: "social-democratic-tradition",
  ms: "market-socialist-tradition",
  cp: "central-planning-tradition",
  sa: "social-anarchist-tradition",
  sc: "state-capitalist-ideal-type",
  ac: "anarcho-capitalist-tradition",
  pe: "participatory-economics",
};

const traditionOrientation: Record<string, Pick<Tradition, "overview" | "distinctions" | "commonQuestions">> = {
  lf: {
    overview: [
      "Laissez-faire capitalism is a family of arguments for organizing most production and exchange through private property, voluntary contract, market prices, and competition. In its minimal-state forms, public authority still defines and enforces property, contract, and protections against force or fraud.",
      "The tradition places unusual confidence in decentralized choice and price signals, while treating concentrated public discretion as a recurring danger. Its central disputes concern whether nominally voluntary exchange remains meaningfully voluntary when wealth, bargaining power, information, or market access are highly unequal.",
    ],
    distinctions: ["Minimal-state capitalism, not the absence of all government", "A theoretical tradition, not a description of every market economy", "Private ownership and contract as institutions that still require rules and enforcement"],
    commonQuestions: [
      { question: "Is laissez-faire capitalism the same as anarcho-capitalism?", answer: "No. Most laissez-faire traditions retain a state for courts, defense, property, and contract enforcement. Anarcho-capitalism proposes private provision of those functions as well." },
      { question: "Does laissez-faire mean that markets have no rules?", answer: "No. Property, contract, liability, bankruptcy, and corporate forms are rules. The disagreement is mainly about their scope, source, and how much discretionary regulation should accompany them." },
      { question: "Has a completely laissez-faire economy existed?", answer: "That is not established here. Historical economies combine public and private institutions, so the label is better used for a direction of argument or an ideal type than as an unqualified country classification." },
    ],
  },
  sd: {
    overview: [
      "Social-democratic capitalism combines predominantly private ownership and market coordination with democratic government, collective bargaining, social insurance, public services, and economic regulation. It generally seeks to constrain the risks and inequalities of capitalism without replacing markets as the main coordinating institution.",
      "There is no single social-democratic package. Nordic, continental European, and later reform traditions differ over ownership, unions, taxation, industrial policy, universal benefits, and the degree to which workers should share authority inside firms.",
    ],
    distinctions: ["Capitalist ownership with extensive social and democratic constraints", "Broader than a welfare state alone", "Historically variable across parties, countries, and periods"],
    commonQuestions: [
      { question: "Is social democracy the same as democratic socialism?", answer: "They overlap historically and politically, but they are not interchangeable. Many contemporary social democrats accept a durable mixed capitalist economy, while democratic socialists generally seek deeper changes in ownership or economic authority." },
      { question: "Does social democracy mean that the state runs most businesses?", answer: "Not necessarily. Its characteristic arrangements can include private firms, public enterprises, cooperatives, regulated markets, collective bargaining, and tax-funded services in different combinations." },
      { question: "Is the Nordic model one uniform system?", answer: "No. Nordic institutions differ by country and have changed substantially over time. The phrase is a comparative shorthand, not a complete institutional description." },
    ],
  },
  ms: {
    overview: [
      "Market socialism and economic democracy describe proposals that retain markets for at least some allocation while changing who owns firms, who governs workplaces, or who receives returns to capital. Common models emphasize worker cooperatives, social investment funds, public ownership, or combinations of these institutions.",
      "The category contains major disagreements. Some approaches center workplace democracy, others social ownership of investment, and others a mixed economy with stronger worker voice. Their shared question is whether market coordination can be separated from concentrated private ownership and hierarchical control.",
    ],
    distinctions: ["Markets without conventional capital ownership as the defining combination", "Not one blueprint for cooperatives or public ownership", "Workplace authority and investment control are separate design questions"],
    commonQuestions: [
      { question: "Is market socialism a contradiction?", answer: "Not by definition. Markets describe a mode of exchange and coordination; socialism in these proposals describes ownership, governance, or the distribution of investment returns. Whether the combination is stable or desirable remains disputed." },
      { question: "Is every worker cooperative an example of market socialism?", answer: "A cooperative can illustrate one institution associated with the tradition, but a firm operating inside a broader capitalist economy does not by itself establish a system-wide arrangement." },
      { question: "Does market socialism eliminate competition?", answer: "Usually not. Many versions retain competition among enterprises while changing ownership and governance. Other versions limit markets in investment, land, essential services, or other domains." },
    ],
  },
  cp: {
    overview: [
      "Central planning is a family of arrangements that coordinates a substantial scope of production, investment, or distribution through collectively authorized plans and administrative or computational allocation. Ownership alone does not determine the mechanism: the revealing questions are who sets objectives, supplies information, revises targets, allocates resources, and contests decisions.",
      "The family includes hierarchical administrative-command systems, indicative and mixed planning, and democratic or computational proposals. Historical command systems also operated through bargaining, managerial discretion, strategic reporting, and informal exchange; participatory computational designs may distribute operational authority differently. These are distinct institutional forms, not interchangeable evidence.",
    ],
    distinctions: ["Coordination rules, not state ownership alone", "Economy-wide dominance is distinct from public investment or planning inside firms", "Command, indicative, democratic, and computational forms should not be collapsed", "A historical case is not the tradition itself"],
    commonQuestions: [
      { question: "Does central planning mean one office decides every detail?", answer: "Not necessarily. Plans can be hierarchical and distributed across agencies and enterprises. The analytical questions are which decisions are binding, where information moves, and who can correct errors." },
      { question: "Is all public investment central planning?", answer: "No. Governments and firms routinely plan within market economies. This ideal type applies when administrative allocation replaces markets across a substantial range of production and investment decisions." },
      { question: "Would better computers settle the planning debate?", answer: "Computation may change what can be processed, but it does not by itself settle how preferences are expressed, information is elicited, priorities are chosen, power is constrained, or errors are contested." },
    ],
  },
  sa: {
    overview: [
      "Social anarchism groups traditions that reject the state and other entrenched hierarchies while emphasizing cooperation, mutual aid, common or worker control, and federated self-government. It includes mutualist, collectivist, anarcho-communist, and syndicalist currents that disagree over property, exchange, and organization.",
      "Its institutional question is not whether organization disappears, but how coordination and enforcement might occur without a sovereign hierarchy. Proposals therefore focus on associations, councils, communes, unions, federations, and negotiated rules whose authority is intended to remain contestable from below.",
    ],
    distinctions: ["Opposition to hierarchy, not opposition to organization", "Federation and association rather than an isolated localism", "Several incompatible positions on markets, property, and remuneration"],
    commonQuestions: [
      { question: "Does anarchy mean the absence of rules?", answer: "Not in this tradition. Social anarchists typically distinguish rules and collective coordination from a state or entrenched hierarchy. The difficult issue is how rules gain legitimacy and are enforced without recreating domination." },
      { question: "Is social anarchism necessarily anti-market?", answer: "No. Mutualist currents have defended forms of exchange and possession, while anarcho-communist currents reject markets more broadly. The category should preserve that disagreement." },
      { question: "Does local self-government rule out large-scale coordination?", answer: "Not in theory. Federation is meant to connect local bodies across larger scales. Whether those arrangements can coordinate complex interdependence without concentrating authority is a central research question." },
    ],
  },
  sc: {
    overview: [
      "State capitalism and the developmental state are overlapping but contested labels for economies in which markets and firms operate alongside unusually directive public control over finance, investment, strategic sectors, or major enterprises. The state may act as owner, lender, coordinator, regulator, or partner to private capital.",
      "The combined category is useful for exploring state direction, but it can also conceal important differences. Public ownership, authoritarian political control, export-oriented industrial policy, and ordinary regulation are not the same institution and should be separated in historical analysis.",
    ],
    distinctions: ["Market activity combined with directive state ownership or coordination", "Developmental-state and state-capitalist labels overlap but are not synonyms", "A contested analytical category rather than a neutral country classification"],
    commonQuestions: [
      { question: "Is every mixed economy state capitalist?", answer: "That usage would be too broad for this project. The category is most useful where state ownership, credit allocation, or strategic direction plays a defining role rather than merely setting background rules." },
      { question: "Is a developmental state necessarily authoritarian?", answer: "No by definition, although prominent historical cases raise that association. Political regime, administrative capacity, industrial policy, and ownership should be modeled as related but separate dimensions." },
      { question: "Does state ownership eliminate markets?", answer: "No. State-owned firms may sell in markets, compete, earn profits, and operate alongside private firms. Ownership and coordination mechanisms must be described separately." },
    ],
  },
  ac: {
    overview: [
      "Anarcho-capitalism proposes extending private property, contract, and market competition to functions usually assigned to the state, including adjudication, policing, and defense. Its advocates imagine legal and protective services supplied by firms, associations, insurers, or other voluntary arrangements.",
      "It shares market-liberal skepticism of public monopoly but differs by rejecting even the minimal state. The key institutional disputes concern whether rival protection agencies could remain competitive, how rights would be defined without a final public authority, and what meaningful consent requires under unequal bargaining power.",
    ],
    distinctions: ["No state, including no public monopoly on courts or defense", "Distinct from minimal-state liberalism", "A primarily theoretical tradition with disputed historical analogies"],
    commonQuestions: [
      { question: "Is anarcho-capitalism simply laissez-faire capitalism?", answer: "No. Laissez-faire positions commonly retain a minimal state. Anarcho-capitalism proposes private or associational substitutes for its courts, law enforcement, and defense functions." },
      { question: "Does it mean that there would be no law?", answer: "Its advocates propose non-state legal rules and adjudication, not the absence of law. Critics question how conflicting rule systems would be reconciled and how coercive providers would be constrained." },
      { question: "Are medieval Iceland or stateless Somalia proven examples?", answer: "No such classification should be treated as settled. They are contested analogies with institutional and historical differences that require bounded case analysis." },
    ],
  },
  pe: {
    overview: [
      "Participatory economics, often called Parecon, is a specific proposal for coordinating production and consumption through worker and consumer councils rather than conventional markets or central command. Its design combines participatory planning, social ownership, balanced job complexes, and remuneration based on effort or sacrifice.",
      "The model aims to distribute decision-making influence in proportion to how people are affected and to prevent both capitalist ownership and a managerial coordinator class. Its open questions concern information burdens, preference formation, expertise, incentives, and how iterative planning would work beyond models and small-scale exercises.",
    ],
    distinctions: ["A named institutional model rather than a broad family of all participatory practices", "Council-based iterative planning rather than Soviet-style command planning", "Balanced job complexes and effort-based remuneration are core, not optional details"],
    commonQuestions: [
      { question: "Is participatory economics another name for central planning?", answer: "No. It is designed around iterative proposals from worker and consumer councils rather than commands from a central authority. Critics may see related information problems, but the proposed decision structure is different." },
      { question: "Does it retain ordinary markets?", answer: "The full model is intended to replace conventional markets for production and consumption with participatory planning and indicative prices. Partial adaptations may use some of its institutions without adopting the whole model." },
      { question: "Has Parecon been implemented at national scale?", answer: "No national-scale implementation is established in this draft. Its large-scale performance therefore remains a theoretical and research question rather than an observed record." },
    ],
  },
};

const challengeSpecs: Array<FrameworkChallenge & { inputs: string[] }> = [
  { id: "coordination-of-information-and-resources", question: "How do participants learn what is needed and coordinate resources under dispersed, incomplete, or strategic information?", rationale: "Coordination includes discovery, communication, calculation, and authority rather than presuming one allocation mechanism.", topicIds: ["coordination"], inputs: ["c01"], reviewStatus: "unreviewed-migration" },
  { id: "innovation-risk-and-failure", question: "Who can initiate experiments, who bears their risks, and how does the arrangement learn from failure?", rationale: "Innovation and failure are linked institutional problems involving permission, finance, loss, and adaptation.", topicIds: ["coordination", "ownership"], inputs: ["c02"], reviewStatus: "unreviewed-migration" },
  { id: "distribution-of-gains-and-ownership", question: "Who captures gains from production, productivity, and ownership—and how can that distribution change?", rationale: "Ownership, control, wages, profit, and wealth are distinct but interacting distributions.", topicIds: ["ownership", "work"], inputs: ["c03", "c06"], reviewStatus: "unreviewed-migration" },
  { id: "authority-accountability-and-abuse", question: "Where does consequential authority sit, how can affected people contest it, and what limits capture or abuse?", rationale: "Power can concentrate in workplaces, firms, associations, markets, or states; institutional safeguards should follow actual positions and powers.", topicIds: ["power", "work"], inputs: ["c04", "c07", "c14"], reviewStatus: "unreviewed-migration" },
  { id: "externalities-and-collective-goods", question: "How are diffuse harms, shared resources, and collective goods recognized, governed, and paid for?", rationale: "The problem includes information, jurisdiction, enforcement, and distribution—not only whether prices exist.", topicIds: ["coordination", "security"], inputs: ["c05"], reviewStatus: "unreviewed-migration" },
  { id: "mobility-exit-and-dependence", question: "Can people meaningfully leave firms, communities, or jurisdictions, and what dependencies shape that choice?", rationale: "Formal exit is different from practical mobility when livelihood, care, geography, or membership constrain choice.", topicIds: ["work", "power"], inputs: ["c08"], reviewStatus: "unreviewed-migration" },
  { id: "basic-needs-and-security", question: "How are basic needs and protection against predictable life risks provided, and on what terms?", rationale: "Provision must expose access, eligibility, financing, quality, discretion, and dependency.", topicIds: ["security", "work"], inputs: ["c09"], reviewStatus: "unreviewed-migration" },
  { id: "transition-and-institutional-change", question: "How can institutions change from a specified starting point, and who bears the costs and risks of transition?", rationale: "A transition is a path with actors, sequencing, resistance, and failure modes—not a property of an ideal endpoint.", topicIds: ["power", "ownership"], inputs: ["c12"], reviewStatus: "unreviewed-migration" },
  { id: "external-coercion-and-defense", question: "How does an arrangement respond to external coercion without making emergency power permanently unaccountable?", rationale: "Defense joins capacity against threats to the internal distribution and duration of coercive authority.", topicIds: ["security", "power"], inputs: ["c13"], reviewStatus: "unreviewed-migration" },
];

function migrateLanguage(value: string) {
  return value.replace(/\bcruxes\b/gi, "Challenges").replace(/\bcrux\b/gi, "Challenge");
}

export async function migrateFrameworkContent(root = ROOT) {
  const graph = JSON.parse(await readFile(resolve(root, "generated/content/graph.json"), "utf8")) as ContentGraph;
  const challenges = challengeSpecs.map(({ inputs: _inputs, ...challenge }) => challenge);
  const traditions: Tradition[] = graph.systems.map((item) => ({
    id: traditionIds[item.id]!,
    name: item.name,
    description: migrateLanguage(item.description),
    ...traditionOrientation[item.id]!,
    caveat: "Exploratory ideal-type description. It does not identify a country, case, advocate, or internally uniform tradition.",
    reviewStatus: "unreviewed-migration",
  }));
  const sourceByInput = new Map(graph.sources.map((source) => [source.id, source]));
  const consumed = new Set<string>();
  const audit: Array<Record<string, unknown>> = [];

  const responses = traditions.flatMap((tradition) => challengeSpecs.map((challenge) => {
    const systemInput = Object.entries(traditionIds).find(([, id]) => id === tradition.id)![0];
    const fragments = graph.cells.filter((cell) => cell.system === systemInput && challenge.inputs.includes(cell.crux));
    fragments.forEach((cell) => consumed.add(cell.id));
    const citationIds = (cell: (typeof fragments)[number]) => cell.sources.filter((id) => sourceByInput.has(id));
    audit.push(...fragments.map((cell) => ({
      inputId: cell.id,
      disposition: "response-draft",
      targetId: `${tradition.id}--${challenge.id}`,
      withheld: ["verdict", "evidence"],
      reason: "Narrative retained as uncited research hypotheses; evaluative labels do not enter the replacement graph.",
    })));
    return {
      id: `${tradition.id}--${challenge.id}`,
      traditionId: tradition.id,
      challengeId: challenge.id,
      means: fragments.map((cell, index) => ({ id: `${tradition.id}--${challenge.id}--means-${index + 1}`, text: migrateLanguage(cell.mechanism), role: "proposed-means" as const, claimKind: "unreviewed-editorial-claim" as const, citations: citationIds(cell), researchNeeded: true as const })),
      failureHypotheses: fragments.map((cell, index) => ({ id: `${tradition.id}--${challenge.id}--failure-${index + 1}`, text: migrateLanguage(cell.breaks), role: "failure-hypothesis" as const, claimKind: "unreviewed-editorial-claim" as const, citations: citationIds(cell), researchNeeded: true as const })),
      reviewStatus: "unreviewed-migration" as const,
    };
  }));

  const researchNotes = graph.cells.filter((cell) => cell.crux === "c10" || cell.crux === "c11").map((cell) => {
    consumed.add(cell.id);
    const traditionId = traditionIds[cell.system]!;
    const historical = cell.crux === "c10";
    const id = `${traditionId}--${historical ? "historical-evidence-inventory" : "scale-and-transferability"}`;
    audit.push({ inputId: cell.id, disposition: historical ? "historical-evidence-inventory" : "criterion-observation", targetId: id, withheld: ["verdict", "evidence"], reason: historical ? "Track record is evidence about bounded cases, not a Challenge." : "Scale is a contextual transferability Criterion, not necessarily a shared institutional problem." });
    return {
      id,
      traditionId,
      kind: historical ? "historical-evidence-inventory" as const : "criterion-observation" as const,
      ...(!historical && { criterionId: "scale-and-transferability" }),
      text: migrateLanguage(`${cell.mechanism} ${cell.breaks}`.trim()),
      researchNeeded: true as const,
    };
  });

  const output: FrameworkDraftGraph = {
    schemaVersion: "framework-draft-1",
    status: "migration-draft",
    traditions,
    topics: [
      { id: "ownership", label: "Ownership", description: "Who may control productive assets, transfer them, and receive the gains or losses attached to them?" },
      { id: "work", label: "Work", description: "How livelihood, authority, bargaining power, mobility, and security are organized around labor." },
      { id: "security", label: "Security", description: "How people and institutions respond to basic needs, shared risks, collective harms, and external threats." },
      { id: "coordination", label: "Coordination", description: "How information, resources, experimentation, and collective action are organized under uncertainty." },
      { id: "power", label: "Power", description: "Where consequential authority sits, how it changes, and how affected people can contest or constrain it." },
    ],
    challenges,
    criteria: [
      { id: "distribution", label: "Distribution", definition: "Who receives benefits, resources, authority, and adjustment costs?", normativeAssumptions: ["Concentrated advantages and involuntary burdens require explicit justification."], evidenceRequirements: ["Measures must distinguish income, wealth, ownership, control, access, and risk."], limitations: ["Improvement on one distribution does not establish improvement on another."], reviewStatus: "unreviewed-migration" },
      { id: "accountability", label: "Accountability", definition: "Can affected people inspect, contest, and replace consequential decision-makers?", normativeAssumptions: ["Consequential authority should be answerable to those it affects."], evidenceRequirements: ["Formal powers and observed practice must both be documented."], limitations: ["Formal contestability does not establish equal practical influence."], reviewStatus: "unreviewed-migration" },
      { id: "scale-and-transferability", label: "Scale and transferability", definition: "Which contextual conditions are necessary for an observed mechanism to operate elsewhere or at another scale?", normativeAssumptions: ["No bounded case automatically supplies a universal blueprint."], evidenceRequirements: ["Compare population, jurisdiction, material conditions, participants, and rule levels."], limitations: ["Scale may change several mechanisms at once and cannot be reduced to population size."], reviewStatus: "unreviewed-migration" },
    ],
    responses,
    researchNotes,
    sources: graph.sources.map((source) => ({ id: source.id, authors: source.authors, title: source.title, ...(source.year && { year: source.year }), kind: source.type, reviewStatus: source.verified, ...(source.section && { section: source.section }), ...(source.note && { note: source.note }), ...(source.links && { links: source.links }), ...(source.identifiers && { identifiers: source.identifiers }) })),
  };

  const expected = new Set(graph.cells.map(({ id }) => id));
  const missing = [...expected].filter((id) => !consumed.has(id));
  if (missing.length || consumed.size !== expected.size) throw new Error(`Migration coverage failure: ${missing.join(", ")}`);
  const report = {
    input: { systems: graph.systems.length, topics: graph.cruxes.length, comparisons: graph.cells.length, sources: graph.sources.length },
    output: { traditions: output.traditions.length, topics: output.topics.length, challenges: output.challenges.length, criteria: output.criteria.length, responses: output.responses.length, researchNotes: output.researchNotes.length, sources: output.sources.length },
    coverage: { consumed: consumed.size, missing },
    audit,
  };
  await mkdir(resolve(root, "content/framework"), { recursive: true });
  await mkdir(resolve(root, "generated/reports"), { recursive: true });
  await Promise.all([
    writeFile(resolve(root, "content/framework/draft.json"), `${JSON.stringify(output, null, 2)}\n`),
    writeFile(resolve(root, "generated/reports/framework-migration.json"), `${JSON.stringify(report, null, 2)}\n`),
  ]);
  return { output, report };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { report } = await migrateFrameworkContent();
  process.stdout.write(`Migrated ${report.coverage.consumed} source comparisons into ${report.output.responses} response drafts and ${report.output.researchNotes} research notes.\n`);
}
