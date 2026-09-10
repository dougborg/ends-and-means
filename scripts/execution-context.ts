import { realpathSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { createGitRunner } from "./delivery-local-git.ts";
import {
  executionAssignmentForIssue,
  parsePrivateDeliveryState,
} from "./delivery-private-state.ts";
import { artifactDigest } from "./environment-artifact.ts";
import { inspectEnvironment } from "./environment-readiness.ts";
import {
  type ArtifactEvidence,
  digestSchema,
  type EnvironmentEvidence,
  type ExecutionAssignment,
  environmentEvidenceSchema,
  runIdSchema,
} from "./execution-schema.ts";
import { boundedEntries, readExecutionFile } from "./execution-store.ts";

export function currentExecutionAssignment(
  path: string,
  issue: number,
  root: string,
): ExecutionAssignment {
  const state = parsePrivateDeliveryState(
    JSON.parse(readExecutionFile(path, 1024 * 1024)),
  );
  const { issue: assignedIssue, ...assignment } = executionAssignmentForIssue(
    state,
    issue,
  );
  if (
    assignedIssue !== issue ||
    realpathSync(assignment.worktree) !== realpathSync(root) ||
    createGitRunner(5_000)(root, ["branch", "--show-current"]) !==
      assignment.branch
  )
    throw new Error("EXECUTION_OWNERSHIP_UNAVAILABLE");
  return assignment;
}
export async function executionEnvironment(
  root: string,
): Promise<EnvironmentEvidence | null> {
  try {
    const result = await inspectEnvironment(root);
    return environmentEvidenceSchema.parse({
      observedAt: result.observedAt,
      identity: result.fingerprintDigest,
      source: result.fingerprint.source,
      runtime: result.fingerprint.runtime,
      browser: result.fingerprint.browser,
      readiness: result.status,
      findingCodes: result.findings.map((finding) => finding.code),
    });
  } catch {
    return null;
  }
}
export function receiptNames(root: string) {
  try {
    return boundedEntries(join(root, ".artifacts/environment"), 128);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}
const receiptEnvelope = z.object({
  executionRunId: runIdSchema.optional(),
  schemaVersion: z.literal(1),
  kind: z.literal("verified-static-artifact"),
  startedAt: z.iso.datetime(),
  observedAt: z.iso.datetime(),
  fingerprintDigest: digestSchema,
  fingerprint: z.object({
    source: z.object({
      commit: z.string().regex(/^[0-9a-f]{40}$/),
      dirty: z.literal(false),
      inputDigest: digestSchema,
    }),
  }),
  artifact: z.object({
    directory: z.literal("dist"),
    sha256: digestSchema,
    files: z.number().int().positive(),
  }),
});
export function newVerifiedArtifact(
  root: string,
  before: string[],
  start: EnvironmentEvidence,
  finish: EnvironmentEvidence,
  runId: string,
): ArtifactEvidence | null {
  try {
    const names = receiptNames(root).filter(
      (name) => !before.includes(name) && /^verified-\d+\.json$/.test(name),
    );
    if (names.length !== 1) return null;
    const receipt = receiptEnvelope.parse(
      JSON.parse(
        readExecutionFile(join(root, ".artifacts/environment", names[0] ?? "")),
      ),
    );
    if (
      receipt.executionRunId !== runId ||
      Date.parse(receipt.startedAt) < Date.parse(start.observedAt) ||
      Date.parse(receipt.observedAt) > Date.parse(finish.observedAt) ||
      Date.parse(receipt.startedAt) > Date.parse(receipt.observedAt) ||
      receipt.fingerprintDigest !== finish.identity ||
      JSON.stringify(receipt.fingerprint.source) !==
        JSON.stringify(finish.source) ||
      JSON.stringify(receipt.artifact) !== JSON.stringify(artifactDigest(root))
    )
      return null;
    return {
      commit: receipt.fingerprint.source.commit,
      sourceInputDigest: receipt.fingerprint.source.inputDigest,
      environmentIdentity: receipt.fingerprintDigest,
      observedAt: receipt.observedAt,
      artifact: receipt.artifact,
    };
  } catch {
    return null;
  }
}
