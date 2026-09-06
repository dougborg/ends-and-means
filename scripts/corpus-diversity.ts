import { z } from "zod";

const nonEmpty = z.string().trim().min(1);
const feasibility = z
  .strictObject({
    availability: z.enum(["viable", "partial", "not-found", "not-assessed"]),
    notes: nonEmpty,
    sourceLeads: z.array(
      z.strictObject({
        title: nonEmpty,
        url: z.url(),
        authority: nonEmpty,
        checkedAt: z.iso.date(),
      }),
    ),
  })
  .superRefine(({ availability, sourceLeads }, context) => {
    const evidenceBearing =
      availability === "viable" || availability === "partial";
    if (evidenceBearing && sourceLeads.length === 0)
      context.addIssue({
        code: "custom",
        path: ["sourceLeads"],
        message: `${availability} availability requires at least one checked source lead`,
      });
    if (!evidenceBearing && sourceLeads.length > 0)
      context.addIssue({
        code: "custom",
        path: ["sourceLeads"],
        message: `${availability} availability cannot retain source leads; use partial or viable after checking them`,
      });
  });

export const corpusCandidateSchema = z.strictObject({
  id: nonEmpty.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  status: z.literal("research-possibility"),
  namedPeopleOrCommunity: nonEmpty,
  place: nonEmpty,
  period: z.strictObject({
    start: nonEmpty,
    end: nonEmpty,
    boundaryNotes: nonEmpty,
  }),
  learnerQuestion: nonEmpty,
  contextTags: z
    .array(
      z.enum([
        "east-asian",
        "south-asian",
        "southeast-asian",
        "central-inner-asian",
        "pacific-oceanian",
        "african",
        "islamic",
        "caribbean-diasporic",
        "european",
        "american",
      ]),
    )
    .min(1),
  politicalRelationships: z
    .array(
      z.enum([
        "state",
        "non-state",
        "confederated",
        "imperial",
        "colonial",
        "diasporic",
        "transitional",
      ]),
    )
    .min(1),
  organizationAndAuthority: z.array(nonEmpty).min(1),
  institutionalQuestions: z
    .array(
      z.enum([
        "land",
        "commons",
        "trade",
        "labor",
        "taxation",
        "redistribution",
        "ecology",
      ]),
    )
    .min(1),
  powerQuestions: z
    .array(
      z.enum([
        "caste",
        "slavery-unfree-labor",
        "class",
        "gendered-power",
        "social-reproduction",
      ]),
    )
    .min(1),
  lawAndDisruptionQuestions: z
    .array(
      z.enum([
        "religion",
        "customary-law",
        "informal-authority",
        "colonial-disruption",
      ]),
    )
    .min(1),
  selfDescription: z.strictObject({
    term: nonEmpty,
    provenanceNotes: nonEmpty,
  }),
  sourceFeasibility: z.strictObject({
    communityAuthored: feasibility,
    oralHistory: feasibility,
    primaryMaterial: feasibility,
    independentScholarship: feasibility,
    permissions: nonEmpty,
    access: nonEmpty,
    translation: nonEmpty,
    freshness: nonEmpty,
  }),
  evidenceRisks: z.array(nonEmpty).min(1),
  researchObligations: z
    .array(z.strictObject({ question: nonEmpty, evidenceNeeded: nonEmpty }))
    .min(1),
});

export const corpusCandidateMatrixSchema = z
  .array(corpusCandidateSchema)
  .min(1);
export type CorpusCandidate = z.infer<typeof corpusCandidateSchema>;

export interface CorpusDiversityFinding {
  severity: "violation" | "attention";
  location: string;
  message: string;
  remediation: string;
}

const requiredContexts = [
  "east-asian",
  "south-asian",
  "southeast-asian",
  "central-inner-asian",
  "pacific-oceanian",
  "african",
  "islamic",
  "caribbean-diasporic",
  "european",
  "american",
] as const;

function compareCodeUnits(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function missingContextFindings(candidates: CorpusCandidate[]) {
  const contexts = new Set(
    candidates.flatMap(({ contextTags }) => contextTags),
  );
  return requiredContexts
    .filter((context) => !contexts.has(context))
    .map((context) => ({
      severity: "attention" as const,
      location: `portfolio:${context}`,
      message: `no bounded candidate currently opens the ${context} research context`,
      remediation:
        "groom a specifically named people or community with place, period, question, and viable provenance; do not add a regional token",
    }));
}

function concentrationFindings(candidates: CorpusCandidate[]) {
  if (candidates.length < 4) return [];
  const counts = new Map<string, number>();
  for (const candidate of candidates)
    for (const relationship of new Set(candidate.politicalRelationships))
      counts.set(relationship, (counts.get(relationship) ?? 0) + 1);
  return [...counts]
    .filter(([, count]) => count / candidates.length > 0.6)
    .map(([relationship, count]) => ({
      severity: "attention" as const,
      location: `portfolio:${relationship}`,
      message: `${count} of ${candidates.length} candidates share the ${relationship} relationship`,
      remediation:
        "inspect whether the candidate pool materially narrows organizational comparison; add only independently feasible bounded research, never a quota filler",
    }));
}

export function auditCorpusCandidateMatrix(
  input: unknown,
): CorpusDiversityFinding[] {
  const parsed = corpusCandidateMatrixSchema.safeParse(input);
  if (!parsed.success)
    return parsed.error.issues
      .map((issue) => ({
        severity: "violation" as const,
        location: issue.path.join(".") || "matrix",
        message: issue.message,
        remediation:
          "supply the missing bounded identity, scope, question, relationship, source-feasibility, or evidence-risk field",
      }))
      .sort(
        (a, b) =>
          compareCodeUnits(a.location, b.location) ||
          compareCodeUnits(a.message, b.message),
      );

  const findings: CorpusDiversityFinding[] = [];
  const ids = new Set<string>();
  for (const candidate of parsed.data) {
    if (ids.has(candidate.id))
      findings.push({
        severity: "violation",
        location: candidate.id,
        message: "duplicate candidate ID",
        remediation: "give each bounded research possibility one stable ID",
      });
    ids.add(candidate.id);
  }
  findings.push(
    ...missingContextFindings(parsed.data),
    ...concentrationFindings(parsed.data),
  );

  return findings.sort(
    (a, b) =>
      Number(b.severity === "violation") - Number(a.severity === "violation") ||
      compareCodeUnits(a.location, b.location) ||
      compareCodeUnits(a.message, b.message),
  );
}
