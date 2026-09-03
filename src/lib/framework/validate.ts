import type { FrameworkDraftGraph } from "./model";

const forbiddenKeys = /^(system|systems|crux|cruxes|cell|cells|verdict|evidence|needsCitation)$/i;

export function validateFrameworkDraft(input: unknown): string[] {
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
  const collections = ["traditions", "topics", "challenges", "criteria", "responses", "researchNotes", "sources"] as const;
  if (collections.some((key) => !Array.isArray((input as Record<string, unknown>)[key]))) {
    return [...errors, "framework is missing required collections"];
  }

  const value = input as FrameworkDraftGraph;
  if (value.schemaVersion !== "framework-draft-1") errors.push("unsupported framework schema version");
  if (value.status !== "migration-draft") errors.push("migrated framework must remain a draft");
  const traditions = new Set(value.traditions.map(({ id }) => id));
  const topics = new Set(value.topics.map(({ id }) => id));
  const challenges = new Set(value.challenges.map(({ id }) => id));
  const criteria = new Set(value.criteria.map(({ id }) => id));
  const sources = new Set(value.sources.map(({ id }) => id));
  const ids = [
    ...traditions, ...topics, ...challenges, ...criteria, ...sources,
    ...value.responses.map(({ id }) => id),
    ...value.researchNotes.map(({ id }) => id),
    ...value.responses.flatMap(({ means, failureHypotheses }) => [...means, ...failureHypotheses].map(({ id }) => id)),
  ];
  if (new Set(ids).size !== ids.length) errors.push("all framework IDs must be globally unique");
  for (const tradition of value.traditions) {
    if (tradition.overview.length < 2 || tradition.overview.some((paragraph) => !paragraph.trim())) errors.push(`${tradition.id}: overview requires at least 2 substantive paragraphs`);
    if (tradition.distinctions.length < 3 || tradition.distinctions.some((item) => !item.trim())) errors.push(`${tradition.id}: requires at least 3 boundary distinctions`);
    if (tradition.commonQuestions.length < 3) errors.push(`${tradition.id}: requires at least 3 common questions`);
    for (const item of tradition.commonQuestions) if (!item.question.trim() || !item.answer.trim()) errors.push(`${tradition.id}: common question requires a question and answer`);
  }
  for (const challenge of value.challenges) {
    if (!challenge.topicIds.length) errors.push(`${challenge.id}: Challenge requires at least one Topic`);
    for (const topicId of challenge.topicIds) if (!topics.has(topicId)) errors.push(`${challenge.id}: unresolved Topic ${topicId}`);
  }

  for (const response of value.responses) {
    if (!traditions.has(response.traditionId)) errors.push(`${response.id}: unresolved tradition`);
    if (!challenges.has(response.challengeId)) errors.push(`${response.id}: unresolved Challenge`);
    if (!response.means.length || !response.failureHypotheses.length) errors.push(`${response.id}: migrated response is empty`);
    for (const statement of [...response.means, ...response.failureHypotheses]) {
      if (!statement.text.trim()) errors.push(`${statement.id}: statement text is empty`);
      if (!statement.researchNeeded || statement.claimKind !== "unreviewed-editorial-claim") errors.push(`${statement.id}: migrated claim must remain explicitly unreviewed`);
      for (const sourceId of statement.citations) if (!sources.has(sourceId)) errors.push(`${statement.id}: unresolved source ${sourceId}`);
    }
  }
  for (const note of value.researchNotes) {
    if (!traditions.has(note.traditionId)) errors.push(`${note.id}: unresolved tradition`);
    if (note.criterionId && !criteria.has(note.criterionId)) errors.push(`${note.id}: unresolved Criterion`);
    if (!note.text.trim() || !note.researchNeeded) errors.push(`${note.id}: research note must contain draft text and require research`);
  }
  return errors;
}
