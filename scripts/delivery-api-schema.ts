import { z } from "zod";

export const commitOidSchema = z.string().regex(/^[0-9a-f]{40}$/);

export const compareSchema = z
  .object({
    merge_base_commit: z.object({ sha: commitOidSchema }),
    commits: z.array(z.object({ parents: z.array(z.unknown()) }).passthrough()),
  })
  .passthrough();

export const mainRefSchema = z.object({
  object: z.object({ sha: commitOidSchema }),
});
