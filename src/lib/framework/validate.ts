import type { ApproachGraph } from "./model";

const forbiddenKeys = /^(system|systems|crux|cruxes|cell|cells|verdict|evidence|needsCitation)$/i;
const approachKinds = new Set(["tradition", "ideal-type", "institutional-family", "named-model", "political-program"]);
const institutionalDomains = new Set(["ownership", "allocation-coordination", "workplace-governance", "political-authority", "social-provision", "law-coercion", "transition-change"]);

export function validateApproachGraph(input: unknown): string[] {
  const errors: string[] = [];
  const walk = (node: unknown, path = "framework") => {
    if (!node || typeof node !== "object") return;
    for (const [key, child] of Object.entries(node)) {
      if (forbiddenKeys.test(key)) errors.push(`${path}.${key}: legacy field is forbidden`);
      walk(child, `${path}.${key}`);
    }
  };
  walk(input);
  if (!input || typeof input !== "object") return ["framework must be an object"];
  const collections = ["approaches", "topics", "challenges", "criteria", "responses", "researchNotes", "sources"] as const;
  if (collections.some((key) => !Array.isArray((input as Record<string, unknown>)[key]))) {
    return [...errors, "framework is missing required collections"];
  }

  const value = input as ApproachGraph;
  if (value.schemaVersion !== "approach-graph-1") errors.push("unsupported framework schema version");
  const approaches = new Set(value.approaches.map(({ id }) => id));
  const topics = new Set(value.topics.map(({ id }) => id));
  const challenges = new Set(value.challenges.map(({ id }) => id));
  const criteria = new Set(value.criteria.map(({ id }) => id));
  const sources = new Set(value.sources.map(({ id }) => id));
  const ids = [
    ...approaches, ...topics, ...challenges, ...criteria, ...sources,
    ...value.responses.map(({ id }) => id),
    ...value.researchNotes.map(({ id }) => id),
    ...value.responses.flatMap(({ means, failureHypotheses }) => [...means, ...failureHypotheses].map(({ id }) => id)),
  ];
  if (new Set(ids).size !== ids.length) errors.push("all framework IDs must be globally unique");
  for (const approach of value.approaches) {
    if (!approachKinds.has(approach.kind)) errors.push(`${approach.id}: invalid Approach kind ${approach.kind}`);
    if (!approach.domains.length) errors.push(`${approach.id}: requires at least one institutional domain`);
    if (new Set(approach.domains).size !== approach.domains.length) errors.push(`${approach.id}: institutional domains must be unique`);
    for (const domain of approach.domains) if (!institutionalDomains.has(domain)) errors.push(`${approach.id}: invalid institutional domain ${domain}`);
    if (approach.overview.length < 2 || approach.overview.some((paragraph) => !paragraph.trim())) errors.push(`${approach.id}: overview requires at least 2 substantive paragraphs`);
    if (approach.distinctions.length < 3 || approach.distinctions.some((item) => !item.trim())) errors.push(`${approach.id}: requires at least 3 boundary distinctions`);
    if (approach.commonQuestions.length < 3) errors.push(`${approach.id}: requires at least 3 common questions`);
    for (const item of approach.commonQuestions) if (!item.question.trim() || !item.answer.trim()) errors.push(`${approach.id}: common question requires a question and answer`);
  }
  for (const challenge of value.challenges) {
    if (!challenge.topicIds.length) errors.push(`${challenge.id}: Challenge requires at least one Topic`);
    for (const topicId of challenge.topicIds) if (!topics.has(topicId)) errors.push(`${challenge.id}: unresolved Topic ${topicId}`);
  }

  for (const response of value.responses) {
    if (!approaches.has(response.approachId)) errors.push(`${response.id}: unresolved Approach`);
    if (!challenges.has(response.challengeId)) errors.push(`${response.id}: unresolved Challenge`);
    if (!response.means.length || !response.failureHypotheses.length) errors.push(`${response.id}: migrated response is empty`);
    for (const statement of [...response.means, ...response.failureHypotheses]) {
      if (!statement.text.trim()) errors.push(`${statement.id}: statement text is empty`);
      if (!statement.researchNeeded || statement.claimKind !== "unreviewed-editorial-claim") errors.push(`${statement.id}: migrated claim must remain explicitly unreviewed`);
      for (const sourceId of statement.citations) if (!sources.has(sourceId)) errors.push(`${statement.id}: unresolved source ${sourceId}`);
    }
  }
  for (const note of value.researchNotes) {
    if (!approaches.has(note.approachId)) errors.push(`${note.id}: unresolved Approach`);
    if (note.criterionId && !criteria.has(note.criterionId)) errors.push(`${note.id}: unresolved Criterion`);
    if (!note.text.trim() || !note.researchNeeded) errors.push(`${note.id}: research note must contain draft text and require research`);
  }
  return errors;
}
