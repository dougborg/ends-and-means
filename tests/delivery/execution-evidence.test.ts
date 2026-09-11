import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { artifactDigest } from "../../scripts/environment-artifact.ts";
import { executionCommand } from "../../scripts/execution-commands.ts";
import { newVerifiedArtifact } from "../../scripts/execution-context.ts";
import { executionRunIdentity } from "../../scripts/execution-correlation.ts";
import {
  executionHandoff,
  executionHandoffMarkdown,
} from "../../scripts/execution-handoff.ts";
import { refreshExecutionEvidence } from "../../scripts/execution-refresh.ts";
import { projectExecution } from "../../scripts/execution-report.ts";
import type {
  EnvironmentEvidence,
  ExecutionAssignment,
  ExecutionEvent,
} from "../../scripts/execution-schema.ts";

const hash = "a".repeat(64);
const head = "a".repeat(40);
const base = "b".repeat(40);
const synthetic = "c".repeat(40);
const now = new Date("2026-09-10T10:00:00Z");
const environment: EnvironmentEvidence = {
  observedAt: now.toISOString(),
  identity: hash,
  source: { commit: head, dirty: false, inputDigest: hash },
  runtime: {
    node: "26.8.1",
    pnpm: "11.25.0",
    executablesResolved: true,
    packageManagerResolved: true,
    platform: "darwin",
    architecture: "arm64",
    timezone: "PRIVATE_TIMEZONE",
    locale: "PRIVATE_LOCALE",
    profile: "local",
    availableParallelism: 10,
    workers: 3,
  },
  browser: {
    version: "1.63.0",
    revision: "1234",
    browserVersion: "150.0.0",
    available: true,
  },
  readiness: "locally-ready",
  findingCodes: [],
};
const assignment: ExecutionAssignment = {
  identity: hash,
  owner: "PRIVATE_OWNER",
  branch: "PRIVATE_BRANCH",
  worktree: "/PRIVATE_PATH",
  observedAt: now.toISOString(),
  expiresAt: "2026-09-10T11:00:00Z",
};
function events(): ExecutionEvent[] {
  const runId = randomUUID();
  return [
    {
      schemaVersion: 1,
      runId,
      sequence: 0,
      previous: null,
      observedAt: now.toISOString(),
      payload: {
        kind: "prepared",
        issue: 330,
        assignment,
        environment,
        authorization: "operator-confirmed",
        log: "output.log",
        command: executionCommand("verify"),
      },
    },
    {
      schemaVersion: 1,
      runId,
      sequence: 1,
      previous: hash,
      observedAt: now.toISOString(),
      payload: { kind: "spawned", pid: 12345, nonce: randomUUID() },
    },
    {
      schemaVersion: 1,
      runId,
      sequence: 2,
      previous: hash,
      observedAt: now.toISOString(),
      payload: {
        kind: "finished",
        result: "success",
        exitCode: 0,
        signal: null,
        reason: "NONE",
        environment,
        assignmentIdentity: hash,
        logBytes: 0,
        logTruncated: false,
        receipt: {
          commit: head,
          environmentIdentity: hash,
          sourceInputDigest: hash,
          observedAt: now.toISOString(),
          artifact: { directory: "dist", sha256: hash, files: 400 },
        },
      },
    },
  ];
}
describe("execution result identity", () => {
  it("requires full receipt plus unchanged clean input, ownership and environment", () => {
    expect(
      projectExecution(events(), assignment, environment, now).exactHeadPass,
    ).toBe(true);
    for (const change of [
      { source: { ...environment.source, dirty: true } },
      { source: { ...environment.source, commit: base } },
      { identity: "b".repeat(64) },
    ])
      expect(
        projectExecution(
          events(),
          assignment,
          { ...environment, ...change },
          now,
        ).exactHeadPass,
      ).toBe(false);
    expect(
      projectExecution(events(), null, environment, now).exactHeadPass,
    ).toBe(false);
    expect(
      projectExecution(
        events(),
        { ...assignment, identity: "b".repeat(64) },
        environment,
        now,
      ).exactHeadPass,
    ).toBe(false);
    const missing = events();
    const terminal = missing[2];
    if (terminal?.payload.kind === "finished") terminal.payload.receipt = null;
    expect(
      projectExecution(missing, assignment, environment, now),
    ).toMatchObject({
      commandPassed: true,
      exactHeadPass: false,
      blocker: "RECEIPT_UNAVAILABLE",
    });
  });
});
describe("current environment and ownership validity", () => {
  it("keeps historical success but rejects current full PASS when readiness changes without a new fingerprint", () => {
    const unavailable = {
      ...environment,
      readiness: "not-ready" as const,
      findingCodes: ["DEPENDENCY_VIEW_MISMATCH"],
    };
    expect(
      projectExecution(events(), assignment, unavailable, now),
    ).toMatchObject({
      commandPassed: true,
      exactHeadPass: false,
      blocker: "ENVIRONMENT_UNAVAILABLE",
    });
    const focused = events();
    const start = focused[0];
    if (start?.payload.kind !== "prepared") throw new Error("Missing fixture");
    start.payload.command = executionCommand("focused-test", [
      "tests/delivery/example.test.ts",
    ]);
    expect(
      projectExecution(focused, assignment, unavailable, now),
    ).toMatchObject({
      commandPassed: true,
      exactHeadPass: false,
      blocker: "NONE",
    });
  });
  it("rejects expired ownership even when its identity matches the completed record", () => {
    expect(
      projectExecution(
        events(),
        { ...assignment, expiresAt: now.toISOString() },
        environment,
        now,
      ).exactHeadPass,
    ).toBe(false);
  });
  it("expires recorded liveness without using PID as proof", () => {
    const running = events().slice(0, 2);
    expect(projectExecution(running, assignment, environment, now).phase).toBe(
      "active-process",
    );
    expect(
      projectExecution(
        running,
        assignment,
        environment,
        new Date(now.getTime() + 31_000),
      ).phase,
    ).toBe("unknown");
    expect(projectExecution(running, null, environment, now).phase).toBe(
      "unknown",
    );
  });
  it("withholds completion for future-dated observations and excludes private values", () => {
    expect(
      projectExecution(
        events(),
        assignment,
        environment,
        new Date(now.getTime() - 1),
      ).phase,
    ).toBe("unknown");
    expect(
      JSON.stringify(projectExecution(events(), assignment, environment, now)),
    ).not.toMatch(/PRIVATE_|12345/);
  });
});
function reader(checks: unknown, commits: Record<string, unknown> = {}) {
  return (args: string[]) => {
    const path = args.at(-1) ?? "";
    if (path.endsWith("pulls/335"))
      return JSON.stringify({
        number: 335,
        state: "open",
        merged: false,
        head: { sha: head },
        base: { sha: base },
      });
    if (path.includes("check-runs")) return JSON.stringify(checks);
    const commit = commits[path.split("/").at(-1) ?? ""];
    if (commit) return JSON.stringify(commit);
    throw new Error("PRIVATE_API_SENTINEL");
  };
}
const check = {
  id: 1,
  head_sha: head,
  status: "completed",
  conclusion: "success",
};
describe("bounded hosted execution observations", () => {
  it("rejects partial pages, duplicate checks and wrong-head results", () => {
    for (const pages of [
      [{ total_count: 2, check_runs: [check] }],
      [{ total_count: 2, check_runs: [check, check] }],
      [{ total_count: 1, check_runs: [{ ...check, head_sha: base }] }],
    ])
      expect(
        refreshExecutionEvidence(335, undefined, reader(pages)).status,
      ).toBe("unavailable");
  });
  it("retains a separate failing security check even when verification passed", () => {
    expect(
      refreshExecutionEvidence(
        335,
        undefined,
        reader([
          {
            total_count: 2,
            check_runs: [check, { ...check, id: 2, conclusion: "failure" }],
          },
        ]),
      ).status,
    ).toBe("failed");
  });
  it("maps a synthetic hosted merge only with equal tree and both actual parents", () => {
    const checks = [{ total_count: 1, check_runs: [check] }];
    const commits = {
      [head]: { sha: head, tree: { sha: head }, parents: [] },
      [synthetic]: {
        sha: synthetic,
        tree: { sha: head },
        parents: [{ sha: head }, { sha: base }],
      },
    };
    expect(
      refreshExecutionEvidence(335, synthetic, reader(checks, commits))
        .sourceMapping,
    ).toBe("synthetic-merge-equivalent-tree");
    const hostedCommit = commits[synthetic];
    if (!hostedCommit) throw new Error("Missing fixture");
    hostedCommit.tree.sha = base;
    expect(
      refreshExecutionEvidence(335, synthetic, reader(checks, commits))
        .sourceMapping,
    ).toBe("different-tree");
  });
  it("returns timestamped unavailable without arbitrary transport exceptions", () => {
    const result = refreshExecutionEvidence(335, undefined, () => {
      throw new Error("PRIVATE_API_SENTINEL");
    });
    expect(result).toMatchObject({
      source: "github",
      status: "unavailable",
      code: "HOSTED_UNAVAILABLE",
    });
    expect(Number.isNaN(Date.parse(result.observedAt))).toBe(false);
    expect(JSON.stringify(result)).not.toContain("PRIVATE_API_SENTINEL");
  });
});

function receiptFixture(runId: string) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "execution-artifact-")));
  mkdirSync(join(root, "dist"));
  writeFileSync(join(root, "dist/index.html"), "verified bytes");
  mkdirSync(join(root, ".artifacts/environment"), {
    recursive: true,
    mode: 0o700,
  });
  const receipt = {
    schemaVersion: 1,
    kind: "verified-static-artifact",
    executionRunId: runId,
    startedAt: now.toISOString(),
    observedAt: now.toISOString(),
    fingerprintDigest: hash,
    fingerprint: { source: environment.source },
    artifact: artifactDigest(root),
  };
  const write = (value: unknown, name = "verified-1.json") =>
    writeFileSync(
      join(root, ".artifacts/environment", name),
      JSON.stringify(value),
      { mode: 0o600 },
    );
  return { root, receipt, write };
}
describe("verified receipt association", () => {
  it("requires a matching run, source and actual artifact while preserving standalone schema compatibility", () => {
    const runId = randomUUID();
    const fixture = receiptFixture(runId);
    try {
      fixture.write(fixture.receipt);
      expect(
        newVerifiedArtifact(fixture.root, [], environment, environment, runId)
          ?.artifact.files,
      ).toBe(1);
      for (const id of [undefined, "MALFORMED_PRIVATE_ID", randomUUID()]) {
        fixture.write({ ...fixture.receipt, executionRunId: id });
        expect(
          newVerifiedArtifact(
            fixture.root,
            [],
            environment,
            environment,
            runId,
          ),
        ).toBeNull();
      }
      fixture.write(fixture.receipt);
      writeFileSync(join(fixture.root, "dist/index.html"), "changed bytes");
      expect(
        newVerifiedArtifact(fixture.root, [], environment, environment, runId),
      ).toBeNull();
    } finally {
      rmSync(fixture.root, { recursive: true, force: true });
    }
  });
  it("rejects old and ambiguous receipts instead of choosing the newest timestamp", () => {
    const runId = randomUUID();
    const fixture = receiptFixture(runId);
    try {
      fixture.write(fixture.receipt);
      expect(
        newVerifiedArtifact(
          fixture.root,
          ["verified-1.json"],
          environment,
          environment,
          runId,
        ),
      ).toBeNull();
      fixture.write(fixture.receipt, "verified-2.json");
      expect(
        newVerifiedArtifact(fixture.root, [], environment, environment, runId),
      ).toBeNull();
    } finally {
      rmSync(fixture.root, { recursive: true, force: true });
    }
  });
  it("rejects malformed correlation before substantive verification and allows standalone absence", () => {
    expect(executionRunIdentity({})).toBeUndefined();
    const result = spawnSync(
      process.execPath,
      [resolve("scripts/verify-environment.ts")],
      {
        env: {
          ...process.env,
          ENDS_MEANS_EXECUTION_RUN_ID: "PRIVATE_MALFORMED_ID",
        },
        encoding: "utf8",
        timeout: 10_000,
      },
    );
    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).not.toContain("PRIVATE_MALFORMED_ID");
  });
});

function handoffFor(
  histories: ExecutionEvent[][],
  currentEnvironment = environment,
) {
  const attempts = histories.map((history) =>
    projectExecution(history, assignment, currentEnvironment, now),
  );
  return executionHandoff(
    {
      schemaVersion: 1,
      kind: "execution-status",
      phaseVersion: 1,
      issue: 330,
      observedAt: now.toISOString(),
      source: "local-event-log",
      phase: attempts.at(-1)?.phase ?? "unknown",
      current: attempts.at(-1) ?? null,
      attempts,
      completedChecks: [],
      incompleteRuns: 0,
      ownershipAvailable: true,
      hosted: {
        source: "offline",
        observedAt: now.toISOString(),
        status: "unavailable",
        code: "HOSTED_NOT_REQUESTED",
      },
      blocker: attempts.at(-1)?.blocker ?? "COMPLETION_UNKNOWN",
      nextAction: "Inspect evidence.",
      limits: [],
      privateEvidence: histories.map((history) => ({
        runId: history[0]?.runId,
        events: history,
      })),
    },
    "/PRIVATE_STORE",
  );
}
function timedEvents(start: number, end: number) {
  const history = events();
  history.forEach((event, index) => {
    event.observedAt = new Date(
      now.getTime() + (index === 2 ? end : start),
    ).toISOString();
  });
  return history;
}
describe("private command handoff timeline", () => {
  it("retains successful, failed and interrupted command outcomes with scope and age", () => {
    const success = timedEvents(-10_000, -8_000);
    const failure = timedEvents(-7_000, -5_000);
    const interrupted = timedEvents(-4_000, -1_000);
    const failedEnd = failure[2];
    const interruptedEnd = interrupted[2];
    if (
      failedEnd?.payload.kind !== "finished" ||
      interruptedEnd?.payload.kind !== "finished"
    )
      throw new Error("Fixture");
    Object.assign(failedEnd.payload, {
      result: "failure",
      exitCode: 7,
      reason: "COMMAND_FAILED",
    });
    Object.assign(interruptedEnd.payload, {
      result: "interrupted",
      exitCode: null,
      signal: "SIGTERM",
      reason: "INTERRUPTED",
    });
    const report = handoffFor([success, failure, interrupted]);
    expect(
      report.timeline.map((entry) => [
        entry.commandPassed,
        entry.phase,
        entry.commandIntervalMs,
      ]),
    ).toEqual([
      [true, "completed-command", 2_000],
      [false, "completed-command", 2_000],
      [false, "interrupted", 3_000],
    ]);
    expect(report.current).toMatchObject({
      signal: "SIGTERM",
      scope: "full-local",
      evidenceAgeMs: 1_000,
    });
    expect(executionHandoffMarkdown(report)).toContain("INTERRUPTED");
    expect(executionHandoffMarkdown(report)).toContain("/PRIVATE_STORE");
  });
  it("counts the union once across nested and overlapping intervals, with no delivery-duration inference", () => {
    const report = handoffFor([
      timedEvents(-10_000, -5_000),
      timedEvents(-9_000, -8_000),
      timedEvents(-6_000, -2_000),
      timedEvents(-1_000, 0),
    ]);
    expect(report.timing).toMatchObject({
      summedKnownCommandMs: 11_000,
      unionKnownCommandMs: 9_000,
      overlappingKnownCommandMs: 2_000,
      deliveryElapsedMs: null,
      hostedQueueMs: null,
      userPauseMs: null,
    });
  });
  it("keeps prepared, stale heartbeat, unconfirmed completion and future observations unknown", () => {
    const unknown = timedEvents(-4_000, -1_000);
    const terminal = unknown[2];
    if (terminal?.payload.kind !== "finished") throw new Error("Fixture");
    terminal.payload.reason = "COMPLETION_UNKNOWN";
    const report = handoffFor([
      events().slice(0, 1),
      timedEvents(-60_000, -40_000).slice(0, 2),
      unknown,
      timedEvents(1_000, 2_000),
    ]);
    expect(
      report.timeline.every((entry) => entry.commandIntervalMs === null),
    ).toBe(true);
    expect(report.timing).toMatchObject({
      knownCommandIntervals: 0,
      unknownCommandIntervals: 4,
      summedKnownCommandMs: null,
      unionKnownCommandMs: null,
    });
    expect(handoffFor([]).latestRunId).toBeNull();
  });
});
describe("private handoff current identity", () => {
  it("preserves historical success while refusing current PASS after input or environment changes", () => {
    for (const changed of [
      { ...environment, identity: "b".repeat(64) },
      { ...environment, source: { ...environment.source, commit: base } },
    ]) {
      const report = handoffFor([timedEvents(-2_000, -1_000)], changed);
      expect(report.current).toMatchObject({
        commandPassed: true,
        exactHeadPass: false,
      });
      expect(report.timeline[0]?.commandIntervalMs).toBe(1_000);
      expect(report.blocker).not.toBe("NONE");
    }
  });
});
