interface ApproachEvidence {
  schemaVersion: string;
  status: string;
  approachId: string;
  wikipediaUrl: string;
  ends: Array<{ id: string; sourceIds: string[] }>;
  means: Array<{ id: string; sourceIds: string[] }>;
  cases: Array<{ id: string; statements: Array<{ id: string; sourceIds: string[] }> }>;
  trace: { challengeId: string; endIds: string[]; meansIds: string[]; caseIds: string[]; criterionId: string };
  sources: Array<{ id: string; url: string }>;
}

export function validateApproachEvidence(evidence: ApproachEvidence, context: { approaches: Set<string>; challenges: Set<string>; criteria: Set<string> }): string[] {
  const errors: string[] = [];
  if (evidence.schemaVersion !== "approach-evidence-1") errors.push("unsupported Approach evidence schema");
  if (evidence.status !== "published") errors.push("reviewed Approach evidence must have published status");
  if (!context.approaches.has(evidence.approachId)) errors.push(`unknown Approach: ${evidence.approachId}`);
  if (!context.challenges.has(evidence.trace.challengeId)) errors.push(`unknown Challenge: ${evidence.trace.challengeId}`);
  if (!context.criteria.has(evidence.trace.criterionId)) errors.push(`unknown Criterion: ${evidence.trace.criterionId}`);

  const ids = [...evidence.ends, ...evidence.means, ...evidence.cases, ...evidence.sources, ...evidence.cases.flatMap(({ statements }) => statements)].map(({ id }) => id);
  if (new Set(ids).size !== ids.length) errors.push("Approach evidence IDs must be globally unique");
  const ends = new Set(evidence.ends.map(({ id }) => id));
  const means = new Set(evidence.means.map(({ id }) => id));
  const cases = new Set(evidence.cases.map(({ id }) => id));
  const sources = new Set(evidence.sources.map(({ id }) => id));
  for (const id of evidence.trace.endIds) if (!ends.has(id)) errors.push(`trace references unknown End: ${id}`);
  for (const id of evidence.trace.meansIds) if (!means.has(id)) errors.push(`trace references unknown Means: ${id}`);
  for (const id of evidence.trace.caseIds) if (!cases.has(id)) errors.push(`trace references unknown Case: ${id}`);
  for (const entity of [...evidence.ends, ...evidence.means, ...evidence.cases.flatMap(({ statements }) => statements)]) {
    for (const id of entity.sourceIds) if (!sources.has(id)) errors.push(`${entity.id} references unknown Source: ${id}`);
  }
  for (const { id, url } of evidence.sources) {
    try { if (new URL(url).protocol !== "https:") errors.push(`${id} source URL must use HTTPS`); }
    catch { errors.push(`${id} source URL is invalid`); }
  }
  return errors;
}
