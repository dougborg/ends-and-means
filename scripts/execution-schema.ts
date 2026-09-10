import { z } from "zod";
import { commitOidSchema } from "./delivery-api-schema.ts";

export const executionLimits = {
  runs: 256,
  events: 256,
  eventBytes: 32_768,
  logBytes: 4 * 1024 * 1024,
  heartbeatMs: 10_000,
  staleMs: 30_000,
  timeoutMs: 15 * 60_000,
} as const;
const timestamp = z.iso.datetime({ offset: true });
export const digestSchema = z.string().regex(/^[0-9a-f]{64}$/);
export const runIdSchema = z.uuid();
const nullableDigest = digestSchema.nullable();
const sourceSchema = z
  .object({
    commit: commitOidSchema.nullable(),
    dirty: z.boolean().nullable(),
    inputDigest: nullableDigest,
  })
  .strict();
export const environmentEvidenceSchema = z
  .object({
    observedAt: timestamp,
    identity: digestSchema,
    source: sourceSchema,
    runtime: z
      .object({
        node: z
          .string()
          .regex(/^\d+\.\d+\.\d+$/)
          .nullable(),
        pnpm: z
          .string()
          .regex(/^\d+\.\d+\.\d+$/)
          .nullable(),
        executablesResolved: z.boolean(),
        packageManagerResolved: z.boolean(),
        platform: z.enum([
          "linux",
          "darwin",
          "win32",
          "aix",
          "freebsd",
          "openbsd",
          "sunos",
          "android",
          "haiku",
          "cygwin",
          "netbsd",
        ]),
        architecture: z.string().regex(/^[a-z0-9]{1,16}$/),
        timezone: z.string().max(80),
        locale: z.string().max(40),
        profile: z.enum(["local", "hosted"]),
        availableParallelism: z.number().int().positive(),
        workers: z.number().int().positive(),
      })
      .strict(),
    browser: z
      .object({
        version: z.string().max(30).nullable(),
        revision: z.string().max(20).nullable(),
        browserVersion: z.string().max(30).nullable(),
        available: z.boolean(),
      })
      .strict(),
    readiness: z.enum(["locally-ready", "not-ready"]),
    findingCodes: z.array(z.string().regex(/^[A-Z_]{1,60}$/)).max(40),
  })
  .strict();
export type EnvironmentEvidence = z.infer<typeof environmentEvidenceSchema>;
export const commandNameSchema = z.enum([
  "readiness",
  "verify",
  "build",
  "test",
  "coverage",
  "routes",
  "browser",
  "delivery",
  "focused-test",
  "focused-coverage",
]);
const commandSchema = z
  .object({
    name: commandNameSchema,
    argv: z.array(z.string().min(1).max(200)).min(2).max(12),
    scope: z.enum([
      "readiness",
      "full-local",
      "build",
      "automated-test",
      "focused",
      "repository-audit",
    ]),
  })
  .strict();
export type ExecutionCommand = z.infer<typeof commandSchema>;
const assignmentSchema = z
  .object({
    identity: digestSchema,
    owner: z.string().min(1).max(200),
    branch: z.string().min(1).max(250),
    worktree: z.string().min(1).max(1_024),
    observedAt: timestamp,
    expiresAt: timestamp,
  })
  .strict();
export type ExecutionAssignment = z.infer<typeof assignmentSchema>;
export const blockerCodeSchema = z.enum([
  "NONE",
  "APPROVAL_REPORTED_DENIED",
  "CAPABILITY_REPORTED_UNAVAILABLE",
  "USER_PAUSED",
  "OWNERSHIP_UNAVAILABLE",
  "ENVIRONMENT_UNAVAILABLE",
  "LAUNCH_FAILED",
  "COMMAND_FAILED",
  "INTERRUPTED",
  "RUN_TIMEOUT",
  "RECORDER_FAILURE",
  "COMPLETION_UNKNOWN",
  "INPUT_CHANGED",
  "ENVIRONMENT_CHANGED",
  "RECEIPT_UNAVAILABLE",
  "HOSTED_UNAVAILABLE",
  "HOSTED_PENDING",
  "HOSTED_FAILED",
  "INTEGRATION_PENDING",
]);
const receiptSchema = z
  .object({
    commit: commitOidSchema,
    environmentIdentity: digestSchema,
    sourceInputDigest: digestSchema,
    observedAt: timestamp,
    artifact: z
      .object({
        directory: z.literal("dist"),
        sha256: digestSchema,
        files: z.number().int().positive(),
      })
      .strict(),
  })
  .strict();
export type ArtifactEvidence = z.infer<typeof receiptSchema>;
const prepared = z
  .object({
    kind: z.literal("prepared"),
    issue: z.number().int().positive().safe(),
    command: commandSchema,
    assignment: assignmentSchema.nullable(),
    environment: environmentEvidenceSchema.nullable(),
    authorization: z.enum(["operator-confirmed", "not-recorded"]),
    log: z.literal("output.log"),
  })
  .strict();
const spawned = z
  .object({
    kind: z.literal("spawned"),
    pid: z.number().int().positive(),
    nonce: runIdSchema,
  })
  .strict();
const heartbeat = z
  .object({ kind: z.literal("heartbeat"), nonce: runIdSchema })
  .strict();
const blocked = z
  .object({
    kind: z.literal("not-started"),
    reason: blockerCodeSchema,
    enforcement: z.enum(["operator-report", "local-precondition"]),
  })
  .strict();
const finished = z
  .object({
    kind: z.literal("finished"),
    result: z.enum(["success", "failure", "launch-failed", "interrupted"]),
    exitCode: z.number().int().min(0).max(255).nullable(),
    signal: z
      .enum([
        "SIGINT",
        "SIGTERM",
        "SIGKILL",
        "SIGHUP",
        "SIGABRT",
        "SIGSEGV",
        "SIGPIPE",
        "SIGBUS",
        "SIGILL",
        "SIGFPE",
        "SIGQUIT",
        "SIGTRAP",
        "OTHER",
      ])
      .nullable(),
    reason: blockerCodeSchema,
    environment: environmentEvidenceSchema.nullable(),
    assignmentIdentity: nullableDigest,
    receipt: receiptSchema.nullable(),
    logBytes: z.number().int().nonnegative().max(executionLimits.logBytes),
    logTruncated: z.boolean(),
  })
  .strict();
export const executionPayloadSchema = z.discriminatedUnion("kind", [
  prepared,
  spawned,
  heartbeat,
  blocked,
  finished,
]);
export type ExecutionPayload = z.infer<typeof executionPayloadSchema>;
export const executionEventSchema = z
  .object({
    schemaVersion: z.literal(1),
    runId: runIdSchema,
    sequence: z
      .number()
      .int()
      .min(0)
      .max(executionLimits.events - 1),
    previous: nullableDigest,
    observedAt: timestamp,
    payload: executionPayloadSchema,
  })
  .strict();
export type ExecutionEvent = z.infer<typeof executionEventSchema>;
