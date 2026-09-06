import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

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
    version: z.literal(1),
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
export type PrivateAssignment = PrivateDeliveryState["assignments"][number];

export function parsePrivateDeliveryState(value: unknown, now = new Date()) {
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
  return state;
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
  return parsePrivateDeliveryState(JSON.parse(raw), now);
}

export function isPrivateStateUnavailableError(error: unknown) {
  return unavailableFilesystemCodes.has(
    String((error as NodeJS.ErrnoException | undefined)?.code ?? ""),
  );
}

export function assignmentForIssue(state: PrivateDeliveryState, issue: number) {
  return state.assignments.find((assignment) => assignment.issue === issue);
}
