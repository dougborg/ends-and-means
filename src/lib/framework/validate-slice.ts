interface EvidenceSlice {
  schemaVersion: string;
  status: string;
  traditionId: string;
  wikipediaUrl: string;
  ends: Array<{ id: string; sourceIds: string[] }>;
  means: Array<{ id: string; sourceIds: string[] }>;
  cases: Array<{ id: string; statements: Array<{ id: string; sourceIds: string[] }> }>;
  trace: { challengeId: string; endIds: string[]; meansIds: string[]; caseIds: string[]; criterion: { id: string } };
  sources: Array<{ id: string; url: string }>;
}

export function validateEvidenceSlice(slice: EvidenceSlice, context: { traditions: Set<string>; challenges: Set<string>; criteria: Set<string> }): string[] {
  const errors: string[] = [];
  if (slice.schemaVersion !== "framework-slice-1") errors.push("unsupported evidence-slice schema");
  if (slice.status !== "review-candidate") errors.push("evidence slice must remain a review candidate until merge");
  if (!context.traditions.has(slice.traditionId)) errors.push(`unknown tradition: ${slice.traditionId}`);
  if (!context.challenges.has(slice.trace.challengeId)) errors.push(`unknown Challenge: ${slice.trace.challengeId}`);
  if (!context.criteria.has(slice.trace.criterion.id)) errors.push(`unknown Criterion: ${slice.trace.criterion.id}`);

  const ids = [...slice.ends, ...slice.means, ...slice.cases, ...slice.sources, ...slice.cases.flatMap(({ statements }) => statements)].map(({ id }) => id);
  if (new Set(ids).size !== ids.length) errors.push("evidence-slice IDs must be globally unique");
  const ends = new Set(slice.ends.map(({ id }) => id));
  const means = new Set(slice.means.map(({ id }) => id));
  const cases = new Set(slice.cases.map(({ id }) => id));
  const sources = new Set(slice.sources.map(({ id }) => id));
  for (const id of slice.trace.endIds) if (!ends.has(id)) errors.push(`trace references unknown End: ${id}`);
  for (const id of slice.trace.meansIds) if (!means.has(id)) errors.push(`trace references unknown Means: ${id}`);
  for (const id of slice.trace.caseIds) if (!cases.has(id)) errors.push(`trace references unknown Case: ${id}`);
  for (const entity of [...slice.ends, ...slice.means, ...slice.cases.flatMap(({ statements }) => statements)]) {
    for (const id of entity.sourceIds) if (!sources.has(id)) errors.push(`${entity.id} references unknown Source: ${id}`);
  }
  for (const { id, url } of slice.sources) {
    try { if (new URL(url).protocol !== "https:") errors.push(`${id} source URL must use HTTPS`); }
    catch { errors.push(`${id} source URL is invalid`); }
  }
  return errors;
}
