import { z } from "zod";
import { privateDeliveryStateSchema } from "./delivery-private-state.ts";

const legacySchema = z
  .object({
    version: z.literal(1),
    repository: z.literal("dougborg/ends-and-means"),
    generatedAt: z.string().datetime({ offset: true }),
    expiresAt: z.string().datetime({ offset: true }),
    assignments: z.array(
      z
        .object({
          issue: z.number().int().positive(),
          owner: z.string().min(1),
          branch: z.string().min(1),
          worktree: z.string().min(1),
        })
        .strict(),
    ),
  })
  .strict();

/** Private, reviewable proposal only. Never writes state or reactivates owners. */
export function proposeDeliveryStateMigration(
  legacy: unknown,
  envelope: Pick<
    z.infer<typeof privateDeliveryStateSchema>,
    "generatedAt" | "expiresAt" | "coordination"
  >,
  historicalReference: string,
) {
  const historical = legacySchema.parse(legacy);
  if (!historicalReference.trim())
    throw new Error(
      "Preserve the original state at an explicit private reference first",
    );
  const candidate = privateDeliveryStateSchema.parse({
    version: 2,
    repository: historical.repository,
    ...envelope,
    assignments: [],
    researchBuffer: [],
    retained: [
      ...new Set(historical.assignments.map((assignment) => assignment.issue)),
    ].map((issue) => {
      const assignments = historical.assignments.filter(
        (assignment) => assignment.issue === issue,
      );
      return {
        issue,
        disposition: "unclassified",
        decisionAt: null,
        decisionEvidence: false,
        started: null,
        startedAt: null,
        resumedAt: null,
        preservedEvidence: true,
        nextReviewCondition: false,
        cleanupPending: false,
        observation: { phase: "unknown", observedAt: null, evidence: false },
        branch: assignments.length === 1 ? assignments[0]?.branch : null,
        pullRequests: [],
        evidenceRefs: [historicalReference],
        nextReview: null,
        decisionRef: null,
        observationRef: null,
      };
    }),
  });
  return { candidate, historical };
}
