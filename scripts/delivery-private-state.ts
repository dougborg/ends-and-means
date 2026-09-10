import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { coordinationSchema, retainedWorkSchema } from "./delivery-flow.ts";

const dateTime = z.string().datetime({ offset: true });
export const privateStateMaximumAgeMs = 24 * 60 * 60 * 1000;
const unavailableFilesystemCodes = new Set([
  "EACCES",
  "EISDIR",
  "ELOOP",
  "EMFILE",
  "ENFILE",
  "ENOENT",
  "ENOTDIR",
  "EPERM",
]);

export class PrivateDeliveryStateUnavailableError extends Error {}

export const privateDeliveryStateSchema = z
  .object({
    version: z.literal(2),
    coordination: coordinationSchema
      .extend({ instructionRef: z.string().min(1) })
      .strict(),
    researchBuffer: z.array(z.number().int().positive()),
    retained: z.array(
      retainedWorkSchema
        .extend({
          branch: z.string().min(1).nullable(),
          pullRequests: z.array(z.string().url()),
          evidenceRefs: z.array(z.string().min(1)),
          nextReview: z.string().min(1).nullable(),
          decisionRef: z.string().min(1).nullable(),
          observationRef: z.string().min(1).nullable(),
        })
        .strict(),
    ),
    repository: z.literal("dougborg/ends-and-means"),
    generatedAt: dateTime,
    expiresAt: dateTime,
    assignments: z.array(
      z
        .object({
          issue: z.number().int().positive(),
          owner: z.string().min(1),
          branch: z.string().min(1),
          worktree: z.string().min(1),
          observedAt: dateTime,
          expiresAt: dateTime,
        })
        .strict(),
    ),
  })
  .strict()
  .superRefine((state, context) => {
    if (Date.parse(state.generatedAt) >= Date.parse(state.expiresAt)) {
      context.addIssue({
        code: "custom",
        path: ["expiresAt"],
        message: "expiresAt must be later than generatedAt",
      });
    }
    if (
      Date.parse(state.expiresAt) - Date.parse(state.generatedAt) >
      privateStateMaximumAgeMs
    ) {
      context.addIssue({
        code: "custom",
        path: ["expiresAt"],
        message: "expiresAt must be no more than 24 hours after generatedAt",
      });
    }
    const seen = new Set<number>();
    for (const [index, assignment] of state.assignments.entries()) {
      if (seen.has(assignment.issue)) {
        context.addIssue({
          code: "custom",
          path: ["assignments", index, "issue"],
          message: `issue ${assignment.issue} has more than one assignment`,
        });
      }
      seen.add(assignment.issue);
    }
  });

export type PrivateDeliveryState = z.infer<typeof privateDeliveryStateSchema>;
export type PrivateAssignment = Pick<
  PrivateDeliveryState["assignments"][number],
  "issue" | "owner" | "branch" | "worktree"
>;

export function parsePrivateDeliveryState(value: unknown, now = new Date()) {
  if ((value as { version?: unknown } | null)?.version === 1)
    throw new Error(
      "version 1 requires explicit migration; retain historical assignments without reactivating expired owners",
    );
  const state = privateDeliveryStateSchema.parse(value);
  const generatedAt = Date.parse(state.generatedAt);
  if (generatedAt > now.getTime())
    throw new Error(
      "generatedAt must not be in the future; refresh the state with the current clock",
    );
  if (now.getTime() - generatedAt > privateStateMaximumAgeMs)
    throw new Error(
      "generatedAt is older than 24 hours; refresh the private delivery state",
    );
  if (Date.parse(state.expiresAt) <= now.getTime())
    throw new Error("expiresAt has passed; refresh the private delivery state");
  validateAssignmentEvidence(state, now);
  validateRetainedReferences(state);
  return state;
}

function validateAssignmentEvidence(state: PrivateDeliveryState, now: Date) {
  for (const assignment of state.assignments) {
    if (
      Date.parse(assignment.observedAt) > now.getTime() ||
      Date.parse(assignment.expiresAt) <= now.getTime() ||
      Date.parse(assignment.expiresAt) <= Date.parse(assignment.observedAt) ||
      Date.parse(assignment.expiresAt) - Date.parse(assignment.observedAt) >
        privateStateMaximumAgeMs
    )
      throw new Error(
        "assignment evidence is future, expired, or longer than 24 hours; refreshing the file does not renew ownership",
      );
    if (
      !state.retained.some(
        (record) =>
          record.issue === assignment.issue &&
          record.branch === assignment.branch,
      )
    )
      throw new Error(
        "each active assignment requires a matching retained issue and branch record",
      );
  }
}

function validateRetainedReferences(state: PrivateDeliveryState) {
  for (const record of state.retained) {
    if (record.decisionEvidence && !record.decisionRef)
      throw new Error(
        "disposition evidence requires a private decision reference",
      );
    if (record.preservedEvidence && !record.evidenceRefs.length)
      throw new Error("preserved evidence requires private references");
    if (record.nextReviewCondition && !record.nextReview)
      throw new Error("parking requires a private next review condition");
    if (record.observation.evidence && !record.observationRef)
      throw new Error(
        "phase evidence requires a private observation reference; an assignment or PID alone is insufficient",
      );
  }
}

export function readPrivateDeliveryState(path: string, now = new Date()) {
  let raw: string;
  try {
    raw = readFileSync(resolve(path), "utf8");
  } catch (error) {
    if (isPrivateStateUnavailableError(error))
      throw new PrivateDeliveryStateUnavailableError(
        "the explicitly supplied private delivery state is unreadable",
      );
    throw error;
  }
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error(
      "private delivery state contains malformed JSON; inspect it privately",
    );
  }
  return parsePrivateDeliveryState(value, now);
}

export function isPrivateStateUnavailableError(error: unknown) {
  return unavailableFilesystemCodes.has(
    String((error as NodeJS.ErrnoException | undefined)?.code ?? ""),
  );
}

export function normalizedDeliveryFlow(state: PrivateDeliveryState) {
  return {
    coordination: coordinationSchema.strip().parse(state.coordination),
    researchBuffer: state.researchBuffer,
    retained: state.retained.map((record) =>
      retainedWorkSchema.strip().parse(record),
    ),
  };
}

export function assignmentForIssue(state: PrivateDeliveryState, issue: number) {
  return state.assignments.find((assignment) => assignment.issue === issue);
}
