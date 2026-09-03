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
  cp: "centrally-planned-economy",
  sa: "social-anarchist-tradition",
  sc: "state-capitalist-ideal-type",
  ac: "anarcho-capitalist-tradition",
  pe: "participatory-economics",
};

const challengeSpecs: Array<FrameworkChallenge & { inputs: string[] }> = [
  { id: "coordination-of-information-and-resources", question: "How do participants learn what is needed and coordinate resources under dispersed, incomplete, or strategic information?", rationale: "Coordination includes discovery, communication, calculation, and authority rather than presuming one allocation mechanism.", inputs: ["c01"], reviewStatus: "unreviewed-migration" },
  { id: "innovation-risk-and-failure", question: "Who can initiate experiments, who bears their risks, and how does the arrangement learn from failure?", rationale: "Innovation and failure are linked institutional problems involving permission, finance, loss, and adaptation.", inputs: ["c02"], reviewStatus: "unreviewed-migration" },
  { id: "distribution-of-gains-and-ownership", question: "Who captures gains from production, productivity, and ownership—and how can that distribution change?", rationale: "Ownership, control, wages, profit, and wealth are distinct but interacting distributions.", inputs: ["c03", "c06"], reviewStatus: "unreviewed-migration" },
  { id: "authority-accountability-and-abuse", question: "Where does consequential authority sit, how can affected people contest it, and what limits capture or abuse?", rationale: "Power can concentrate in workplaces, firms, associations, markets, or states; institutional safeguards should follow actual positions and powers.", inputs: ["c04", "c07", "c14"], reviewStatus: "unreviewed-migration" },
  { id: "externalities-and-collective-goods", question: "How are diffuse harms, shared resources, and collective goods recognized, governed, and paid for?", rationale: "The problem includes information, jurisdiction, enforcement, and distribution—not only whether prices exist.", inputs: ["c05"], reviewStatus: "unreviewed-migration" },
  { id: "mobility-exit-and-dependence", question: "Can people meaningfully leave firms, communities, or jurisdictions, and what dependencies shape that choice?", rationale: "Formal exit is different from practical mobility when livelihood, care, geography, or membership constrain choice.", inputs: ["c08"], reviewStatus: "unreviewed-migration" },
  { id: "basic-needs-and-security", question: "How are basic needs and protection against predictable life risks provided, and on what terms?", rationale: "Provision must expose access, eligibility, financing, quality, discretion, and dependency.", inputs: ["c09"], reviewStatus: "unreviewed-migration" },
  { id: "transition-and-institutional-change", question: "How can institutions change from a specified starting point, and who bears the costs and risks of transition?", rationale: "A transition is a path with actors, sequencing, resistance, and failure modes—not a property of an ideal endpoint.", inputs: ["c12"], reviewStatus: "unreviewed-migration" },
  { id: "external-coercion-and-defense", question: "How does an arrangement respond to external coercion without making emergency power permanently unaccountable?", rationale: "Defense joins capacity against threats to the internal distribution and duration of coercive authority.", inputs: ["c13"], reviewStatus: "unreviewed-migration" },
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
    output: { traditions: output.traditions.length, challenges: output.challenges.length, criteria: output.criteria.length, responses: output.responses.length, researchNotes: output.researchNotes.length, sources: output.sources.length },
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
