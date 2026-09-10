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

/** Only canonical public identities may leave private retained state for GitHub reads. */
export const retainedPullRequestUrlSchema = z
  .string()
  .regex(/^https:\/\/github\.com\/dougborg\/ends-and-means\/pull\/[1-9][0-9]*$/)
  .refine(
    (url) => Number.isSafeInteger(Number(url.split("/").at(-1))),
    "Pull request number must be a positive safe integer",
  );
