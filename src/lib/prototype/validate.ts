import type { AnalyticalPrototype, Statement } from "./model";
const forbiddenKeys = /^(score|rating|points|grade|index|weight|weighted|aggregate|ranking|rank|overall|verdict|evidence|derivedVerdict|derivedEvidence)$/i;
const norm = (text: string) => text.toLowerCase().replace(/\W/g, "");
export function validateAnalyticalPrototype(input: unknown): string[] {
  const errors: string[] = [];
  const walk = (node: unknown, path = "prototype") => { if (!node || typeof node !== "object") return; for (const [key, child] of Object.entries(node)) { if (forbiddenKeys.test(key)) errors.push(`${path}.${key}: forbidden scoring or verdict field`); walk(child, `${path}.${key}`); } };
  walk(input);
  if (!input || typeof input !== "object") return ["prototype must be an object"];
  const requiredArrays = ["challenges", "sources", "ends", "means", "criteria", "cases", "interpretations", "traces"] as const;
  if (requiredArrays.some((key) => !Array.isArray((input as Record<string, unknown>)[key]))) return ["prototype is missing required collections"];
  const value = input as AnalyticalPrototype;
  if (value.schemaVersion !== "iad-prototype-1") errors.push("unsupported schema version");
  if (value.status !== "non-canonical") errors.push("prototype must remain non-canonical");
  if (value.challenges.length !== 2 || new Set(value.challenges.map(({ id }) => id)).size !== 2) errors.push("prototype must contain exactly two distinct Challenges");
  if (value.cases.length !== 2) errors.push("prototype must contain exactly two bounded cases");
  const sources = new Set(value.sources.map(({ id }) => id));
  const ends = new Set(value.ends.flatMap(({ attributions }) => attributions.map(({ id }) => id)));
  const means = new Set(value.means.map(({ id }) => id));
  const cases = new Set(value.cases.map(({ id }) => id));
  const criteria = new Set(value.criteria.map(({ id }) => id));
  const challenges = new Set(value.challenges.map(({ id }) => id));
  const outcomeCase = new Map(value.cases.flatMap((item) => item.outcomes.map(({ id }) => [id, item.id] as const)));
  const assessmentIds = new Set(value.traces.flatMap(({ assessments }) => assessments.map(({ id }) => id)));
  const interpretationIds = new Set(value.interpretations.map(({ id }) => id));
  const participants = new Set(value.cases.flatMap((item) => item.participants.map(({ id }) => id)));
  const participantCase = new Map(value.cases.flatMap((item) => item.participants.map(({ id }) => [id, item.id] as const)));
  const statements: Statement[] = [...value.ends.flatMap(({ attributions }) => attributions), ...value.means, ...value.cases.flatMap(({ formalRules, rulesInUse, interactionPatterns, outcomes }) => [...formalRules, ...rulesInUse, ...interactionPatterns, ...outcomes]), ...value.interpretations, ...value.traces.flatMap(({ assessments, expectedInteractions }) => [...assessments, ...expectedInteractions])];
  const ids = [...value.sources.map(({ id }) => id), ...value.ends.map(({ id }) => id), ...statements.map(({ id }) => id), ...value.criteria.map(({ id }) => id), ...value.challenges.map(({ id }) => id), ...value.cases.map(({ id }) => id), ...value.cases.flatMap(({ participants }) => participants.map(({ id }) => id)), ...value.traces.map(({ id }) => id)];
  if (new Set(ids).size !== ids.length) errors.push("all prototype IDs must be globally unique");
  for (const statement of statements) { if (!statement.text.trim() || !statement.citations.length) errors.push(`${statement.id}: statement requires text and a citation`); for (const citation of statement.citations) { if (!sources.has(citation.sourceId)) errors.push(`${statement.id}: unresolved source ${citation.sourceId}`); if (!citation.locator.trim()) errors.push(`${statement.id}: citation requires a locator`); } }
  for (const end of value.ends.flatMap(({ attributions }) => attributions)) { if (!end.attributedTo || !end.reasoning || !end.scope.caseIds.length) errors.push(`${end.id}: End attribution requires actor, reasoning, and bounded scope`); for (const id of end.scope.caseIds) if (!cases.has(id)) errors.push(`${end.id}: unresolved scoped case ${id}`); }
  for (const criterion of value.criteria) { if (!criterion.appliesToChallengeIds.length) errors.push(`${criterion.id}: Criterion requires declared applicability`); for (const id of criterion.appliesToChallengeIds) if (!challenges.has(id)) errors.push(`${criterion.id}: unresolved applicable Challenge ${id}`); }
  for (const item of value.cases) { if (!item.period.start || !item.period.end || item.period.start > item.period.end || !item.boundary.trim()) errors.push(`${item.id}: case must be bounded`); if (item.traditionRelationship.traditionId !== value.tradition.id || !item.traditionRelationship.reasoning) errors.push(`${item.id}: requires a reasoned tradition relationship`); const formal = new Set(item.formalRules.map(({ text }) => norm(text))); if (item.rulesInUse.some(({ text }) => formal.has(norm(text)))) errors.push(`${item.id}: formal rules and rules-in-use must remain separate`); for (const rule of item.formalRules) { if (!rule.implementsMeansIds.length) errors.push(`${rule.id}: formal rule must implement a Means`); for (const id of rule.implementsMeansIds) if (!means.has(id)) errors.push(`${rule.id}: unresolved Means ${id}`); } for (const observation of item.interactionPatterns) for (const id of observation.participantIds) if (participantCase.get(id) !== item.id) errors.push(`${observation.id}: participant ${id} is outside its case`); }
  for (const trace of value.traces) { if (!challenges.has(trace.challengeId)) errors.push(`${trace.id}: Challenge is outside prototype scope`); if (![trace.endAttributionIds, trace.meansIds, trace.caseIds, trace.outcomeIds, trace.assessments, trace.expectedInteractions].every((list) => list.length)) errors.push(`${trace.id}: response trace has an empty causal link`); for (const id of trace.endAttributionIds) if (!ends.has(id)) errors.push(`${trace.id}: unresolved End attribution ${id}`); for (const id of trace.meansIds) if (!means.has(id)) errors.push(`${trace.id}: unresolved Means ${id}`); for (const id of trace.caseIds) if (!cases.has(id)) errors.push(`${trace.id}: unresolved case ${id}`); for (const observation of trace.expectedInteractions) for (const id of observation.participantIds) if (!participants.has(id) || !trace.caseIds.includes(participantCase.get(id)!)) errors.push(`${observation.id}: participant ${id} is outside selected cases`); for (const id of trace.outcomeIds) if (!outcomeCase.has(id) || !trace.caseIds.includes(outcomeCase.get(id)!)) errors.push(`${trace.id}: outcome ${id} is outside selected cases`); for (const assessment of trace.assessments) { if (!criteria.has(assessment.criterionId)) errors.push(`${assessment.id}: unresolved Criterion ${assessment.criterionId}`); for (const id of assessment.outcomeIds) if (!trace.outcomeIds.includes(id)) errors.push(`${assessment.id}: outcome ${id} is outside its trace`); for (const id of assessment.interpretationIds) if (!interpretationIds.has(id)) errors.push(`${assessment.id}: unresolved interpretation ${id}`); } }
  for (const challenge of value.challenges) if (!value.traces.some(({ challengeId }) => challengeId === challenge.id)) errors.push(`${challenge.id}: missing response trace`);
  for (const item of value.interpretations) { const resolved = item.target.type === "outcome" ? outcomeCase.has(item.target.id) : assessmentIds.has(item.target.id); if (!resolved || !item.attributedTo.length || !item.reasoning) errors.push(`${item.id}: interpretation requires resolved target, attribution, and reasoning`); }
  const groups = new Map<string, Set<string>>(); for (const item of value.interpretations) { const key = `${item.target.type}:${item.target.id}`; groups.set(key, new Set([...(groups.get(key) ?? []), item.position])); }
  if (![...groups.values()].some((positions) => positions.size > 1)) errors.push("prototype must preserve distinct interpretations of the same evidence");
  return errors;
}
