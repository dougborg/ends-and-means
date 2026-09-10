import { spawn } from "node:child_process";
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
import { afterEach, describe, expect, it } from "vitest";
import { executionCommand } from "../../scripts/execution-commands.ts";
import { projectExecution } from "../../scripts/execution-report.ts";
import type { ExecutionPayload } from "../../scripts/execution-schema.ts";
import {
  appendExecutionEvent,
  createExecutionRun,
  initializeExecutionStore,
  readExecutionRun,
} from "../../scripts/execution-store.ts";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true });
});
function fixture() {
  const parent = realpathSync(
    mkdtempSync(join(tmpdir(), "execution-record-test-")),
  );
  roots.push(parent);
  const store = initializeExecutionStore(
    join(parent, "records"),
    process.cwd(),
  );
  const run = createExecutionRun(store);
  const payload: ExecutionPayload = {
    kind: "prepared",
    issue: 330,
    command: executionCommand("focused-test", [
      "tests/delivery/execution-store.test.ts",
    ]),
    assignment: null,
    environment: null,
    authorization: "operator-confirmed",
    log: "output.log",
  };
  return {
    store,
    run,
    prepared: appendExecutionEvent(
      store,
      run,
      null,
      payload,
      new Date("2026-09-10T00:00:00Z"),
    ),
  };
}
describe("durable execution observations", () => {
  it("round trips the canonical focused command without relying on object key order", () => {
    const { store, run, prepared } = fixture();
    expect(readExecutionRun(store, run)).toEqual([prepared]);
  });
  it("preserves the first published event when a competing writer uses the same predecessor", () => {
    const { store, run, prepared } = fixture();
    const winner = appendExecutionEvent(store, run, prepared, {
      kind: "spawned",
      pid: 123,
      nonce: randomUUID(),
    });
    expect(() =>
      appendExecutionEvent(store, run, prepared, {
        kind: "not-started",
        reason: "USER_PAUSED",
        enforcement: "operator-report",
      }),
    ).toThrow();
    expect(readExecutionRun(store, run)).toEqual([prepared, winner]);
  });
  it("does not turn a crash after preparation into a known refusal or completion", () => {
    const { prepared } = fixture();
    expect(projectExecution([prepared], null, null).phase).toBe("unknown");
    expect(projectExecution([prepared], null, null).exactHeadPass).toBe(false);
  });
  it("retains nonzero exit independently of missing environment and ownership", () => {
    const { store, run, prepared } = fixture();
    const started = appendExecutionEvent(store, run, prepared, {
      kind: "spawned",
      pid: 123,
      nonce: randomUUID(),
    });
    appendExecutionEvent(store, run, started, {
      kind: "finished",
      result: "failure",
      exitCode: 7,
      signal: null,
      reason: "COMMAND_FAILED",
      environment: null,
      assignmentIdentity: null,
      receipt: null,
      logBytes: 0,
      logTruncated: false,
    });
    expect(
      projectExecution(readExecutionRun(store, run), null, null),
    ).toMatchObject({
      exitCode: 7,
      commandPassed: false,
      exactHeadPass: false,
      blocker: "COMMAND_FAILED",
    });
  });
  it("fails closed on edited history rather than retaining an earlier pass", () => {
    const { store, run, prepared } = fixture();
    writeFileSync(
      join(store, run, "0000.json"),
      JSON.stringify({ ...prepared, sequence: 8 }),
      { mode: 0o600 },
    );
    expect(() => readExecutionRun(store, run)).toThrow();
  });
  it("rejects shell wrappers, option injection and target-changing focused arguments", () => {
    for (const name of ["sh", "pnpm verify | tee output", "node -e"])
      expect(() => executionCommand(name)).toThrow();
    for (const path of [
      "--config=secret",
      "tests/../../outside.test.ts",
      "tests/a.test.ts --coverage",
      "/tmp/secret.test.ts",
    ])
      expect(() => executionCommand("focused-test", [path])).toThrow();
  });
});

function competingWriter(store: string, run: string, prepared: unknown) {
  const module = new URL("../../scripts/execution-store.ts", import.meta.url)
    .href;
  const code = `import { appendExecutionEvent } from ${JSON.stringify(module)}; try { appendExecutionEvent(process.argv[1], process.argv[2], JSON.parse(process.argv[3]), { kind: "not-started", reason: "USER_PAUSED", enforcement: "operator-report" }); } catch { process.exitCode = 2; }`;
  const child = spawn(
    process.execPath,
    [
      "--import",
      resolve("node_modules/tsx/dist/loader.mjs"),
      "--input-type=module",
      "-e",
      code,
      store,
      run,
      JSON.stringify(prepared),
    ],
    { stdio: "ignore" },
  );
  return new Promise<number | null>((resolveExit) =>
    child.once("close", resolveExit),
  );
}
describe("bounded concurrent storage", () => {
  it("publishes exactly one terminal from concurrent OS writers without overwriting", async () => {
    const { store, run, prepared } = fixture();
    const results = await Promise.all([
      competingWriter(store, run, prepared),
      competingWriter(store, run, prepared),
    ]);
    expect(results.sort()).toEqual([0, 2]);
    expect(readExecutionRun(store, run)).toHaveLength(2);
    expect(readExecutionRun(store, run)[1]?.payload.kind).toBe("not-started");
  });
  it("keeps a crash-left allocation lock explicit and refuses over-limit run allocation", () => {
    const { store } = fixture();
    mkdirSync(join(store, ".allocation"), { mode: 0o700 });
    expect(() => createExecutionRun(store)).toThrow(
      "EXECUTION_ALLOCATION_BUSY",
    );
    rmSync(join(store, ".allocation"), { recursive: true });
    for (let index = 1; index < 256; index++)
      mkdirSync(join(store, randomUUID()), { mode: 0o700 });
    expect(() => createExecutionRun(store)).toThrow("EXECUTION_STORAGE_LIMIT");
  });
  it("rejects private stores inside the worktree even when their names start with two dots", () => {
    const { store } = fixture();
    expect(() =>
      initializeExecutionStore(join(store, "..private-records"), store),
    ).toThrow("EXECUTION_STORAGE_OUTSIDE_WORKTREE_REQUIRED");
  });
  it("rejects oversized event files and ignores unpublished crash remnants", () => {
    const { store, run, prepared } = fixture();
    writeFileSync(
      join(store, run, `.pending-${randomUUID()}`),
      "not published",
      { mode: 0o600 },
    );
    expect(readExecutionRun(store, run)).toEqual([prepared]);
    writeFileSync(join(store, run, "0000.json"), "x".repeat(32_769), {
      mode: 0o600,
    });
    expect(() => readExecutionRun(store, run)).toThrow(
      "EXECUTION_FILE_INVALID",
    );
  });
});
