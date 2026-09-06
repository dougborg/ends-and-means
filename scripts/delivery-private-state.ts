import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

const dateTime = z.string().datetime({ offset: true });

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
  if (Date.parse(state.generatedAt) > now.getTime())
    throw new Error("private delivery state was generated in the future");
  if (Date.parse(state.expiresAt) <= now.getTime())
    throw new Error(`private delivery state expired at ${state.expiresAt}`);
  return state;
}

export function readPrivateDeliveryState(path: string, now = new Date()) {
  return parsePrivateDeliveryState(
    JSON.parse(readFileSync(resolve(path), "utf8")),
    now,
  );
}

export function assignmentForIssue(state: PrivateDeliveryState, issue: number) {
  return state.assignments.find((assignment) => assignment.issue === issue);
}
