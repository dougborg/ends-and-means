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
  const collections = ["traditions", "challenges", "criteria", "responses", "researchNotes", "sources"] as const;
  if (collections.some((key) => !Array.isArray((input as Record<string, unknown>)[key]))) {
    return [...errors, "framework is missing required collections"];
  }

  const value = input as FrameworkDraftGraph;
  if (value.schemaVersion !== "framework-draft-1") errors.push("unsupported framework schema version");
  if (value.status !== "migration-draft") errors.push("migrated framework must remain a draft");
  const traditions = new Set(value.traditions.map(({ id }) => id));
  const challenges = new Set(value.challenges.map(({ id }) => id));
  const criteria = new Set(value.criteria.map(({ id }) => id));
  const sources = new Set(value.sources.map(({ id }) => id));
  const ids = [
    ...traditions, ...challenges, ...criteria, ...sources,
    ...value.responses.map(({ id }) => id),
    ...value.researchNotes.map(({ id }) => id),
    ...value.responses.flatMap(({ means, failureHypotheses }) => [...means, ...failureHypotheses].map(({ id }) => id)),
  ];
  if (new Set(ids).size !== ids.length) errors.push("all framework IDs must be globally unique");

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
