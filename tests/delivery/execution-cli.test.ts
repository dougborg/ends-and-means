import { execFileSync, spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { executionCommand } from "../../scripts/execution-commands.ts";
import { currentExecutionAssignment } from "../../scripts/execution-context.ts";
import {
  appendExecutionEvent,
  createExecutionRun,
  initializeExecutionStore,
} from "../../scripts/execution-store.ts";

const roots: string[] = [];
const script = resolve("scripts/record-execution.mjs");
const tsx = resolve("node_modules/tsx/dist/loader.mjs");
afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true });
});
function fixture(exit: number) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "execution-cli-")));
  roots.push(root);
  const worktree = join(root, "worktree");
  const bin = join(root, "bin");
  mkdirSync(worktree);
  mkdirSync(bin);
  execFileSync("git", ["init", "-b", "test/execution", worktree], {
    stdio: "ignore",
  });
  execFileSync(
    "git",
    [
      "-C",
      worktree,
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "commit",
      "--allow-empty",
      "-m",
      "fixture",
    ],
    { stdio: "ignore" },
  );
  writeFileSync(
    join(bin, "pnpm"),
    `#!/bin/sh\nif [ "$1" = "--version" ]; then echo 11.25.0; exit 0; fi\necho RAW_LOG_SENTINEL\nexit ${exit}\n`,
    { mode: 0o700 },
  );
  writeFileSync(
    join(bin, "gh"),
    '#!/bin/sh\n: > "$0.called"\necho NETWORK_SENTINEL >&2\nexit 1\n',
    { mode: 0o700 },
  );
  const state = JSON.parse(
    readFileSync("tests/fixtures/delivery/private-state.example.json", "utf8"),
  );
  const observedAt = new Date(Date.now() - 1_000).toISOString();
  const expiresAt = new Date(Date.now() + 60_000).toISOString();
  state.generatedAt = observedAt;
  state.expiresAt = expiresAt;
  state.assignments = [
    {
      issue: 194,
      owner: "PRIVATE_OWNER_SENTINEL",
      branch: "test/execution",
      worktree,
      observedAt,
      expiresAt,
    },
  ];
  state.retained[0].branch = "test/execution";
  const privateState = join(root, "state.json");
  writeFileSync(privateState, JSON.stringify(state), { mode: 0o600 });
  const store = join(root, "records");
  const call = (mode: string, extra: string[] = []) =>
    spawnSync(
      process.execPath,
      [
        "--import",
        tsx,
        script,
        mode,
        "--store",
        store,
        "--private-state",
        privateState,
        "--issue",
        "194",
        ...extra,
      ],
      {
        cwd: worktree,
        env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
        encoding: "utf8",
        timeout: 20_000,
      },
    );
  return { call, store, root, bin, worktree, privateState };
}
describe("execution CLI actual direct child outcomes", () => {
  it.each([0, 7])(
    "records actual exit %s while excluding private fields and child logs",
    (exit) => {
      const { call } = fixture(exit);
      const result = call("run", ["--command", "readiness"]);
      expect(result.status).toBe(exit);
      const report = JSON.parse(result.stdout);
      expect(report.current).toMatchObject({
        exitCode: exit,
        commandPassed: exit === 0,
        exactHeadPass: false,
      });
      expect(result.stdout + result.stderr).not.toMatch(
        /PRIVATE_OWNER_SENTINEL|RAW_LOG_SENTINEL|NETWORK_SENTINEL|execution-cli-/,
      );
    },
  );
  it("records reported approval denial as not-started and keeps authorization separate", () => {
    const { call } = fixture(0);
    const result = call("note", [
      "--command",
      "verify",
      "--reason",
      "APPROVAL_REPORTED_DENIED",
      "--authorization",
      "operator-confirmed",
    ]);
    expect(result.status).toBe(2);
    expect(JSON.parse(result.stdout).current).toMatchObject({
      phase: "not-started",
      authorization: "operator-confirmed",
      enforcement: "operator-report",
      exitCode: null,
    });
  });
});
describe("execution interruptions", () => {
  it("records executable disappearance as a launch failure", () => {
    const { call, bin } = fixture(0);
    writeFileSync(
      join(bin, "pnpm"),
      '#!/bin/sh\n/bin/rm "$0"\necho 11.25.0\n',
      { mode: 0o700 },
    );
    // Remove fallback package managers while retaining Git for ownership inspection.
    symlinkSync(process.execPath, join(bin, "node"));
    const previous = process.env.PATH;
    process.env.PATH = "/usr/bin:/bin";
    try {
      const result = call("run", ["--command", "readiness"]);
      expect(result.status).toBe(1);
      expect(JSON.parse(result.stdout).current).toMatchObject({
        phase: "launch-failed",
        exitCode: null,
        blocker: "LAUNCH_FAILED",
      });
    } finally {
      process.env.PATH = previous;
    }
  });
  it("records an actual signal interruption and terminates only its spawned child", async () => {
    const { bin, worktree, store, privateState } = fixture(0);
    writeFileSync(
      join(bin, "pnpm"),
      '#!/bin/sh\nif [ "$1" = "--version" ]; then echo 11.25.0; exit 0; fi\nexec /bin/sleep 30\n',
      { mode: 0o700 },
    );
    const child = spawn(
      process.execPath,
      [
        "--import",
        tsx,
        script,
        "run",
        "--store",
        store,
        "--private-state",
        privateState,
        "--issue",
        "194",
        "--command",
        "readiness",
      ],
      {
        cwd: worktree,
        env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    const closed = new Promise<number | null>((resolveExit) =>
      child.once("close", resolveExit),
    );
    const deadline = Date.now() + 10_000;
    let started = false;
    while (Date.now() < deadline && !started) {
      try {
        started = readdirSync(store).some(
          (run) =>
            !run.startsWith(".") &&
            readdirSync(join(store, run)).includes("0001.json"),
        );
      } catch {
        /* Waiting for durable launch. */
      }
      if (!started)
        await new Promise((resolveWait) => setTimeout(resolveWait, 20));
    }
    child.kill("SIGTERM");
    expect(await closed).toBe(1);
    expect(started).toBe(true);
    expect(JSON.parse(output).current).toMatchObject({
      phase: "interrupted",
      signal: "SIGTERM",
      blocker: "INTERRUPTED",
      exactHeadPass: false,
    });
  }, 15_000);
});
describe("execution argument privacy", () => {
  it("redacts malformed arguments on both output streams", () => {
    const { call } = fixture(0);
    const result = call("run", [
      "--command",
      "SECRET_SENTINEL",
      "--secret",
      "SECRET_SENTINEL",
    ]);
    expect(result.status).toBe(2);
    expect(result.stdout + result.stderr).not.toContain("SECRET_SENTINEL");
    expect(JSON.parse(result.stdout).phase).toBe("unknown");
  });
});

describe("scoped authoring and output bounds", () => {
  it.each([0, 7])(
    "records focused exit %s on dirty source without claiming exact commit PASS",
    (exit) => {
      const { call, worktree } = fixture(exit);
      for (const name of ["package.json", ".node-version", ".nvmrc"])
        writeFileSync(join(worktree, name), readFileSync(name));
      writeFileSync(join(worktree, "dirty.txt"), "authoring change");
      const result = call("run", [
        "--command",
        exit === 0 ? "focused-test" : "focused-coverage",
        "--file",
        "tests/delivery/example.test.ts",
      ]);
      expect(result.status).toBe(exit);
      expect(JSON.parse(result.stdout).current).toMatchObject({
        scope: "focused",
        commandPassed: exit === 0,
        exactHeadPass: false,
        blocker: exit === 0 ? "INPUT_CHANGED" : "COMMAND_FAILED",
      });
    },
  );
  it("drains output beyond the private log cap while preserving completion", () => {
    const { call, bin, store } = fixture(0);
    writeFileSync(
      join(bin, "pnpm"),
      `#!${process.execPath}\nif (process.argv[2] === "--version") console.log("11.25.0"); else process.stdout.write("x".repeat(5 * 1024 * 1024));\n`,
      { mode: 0o700 },
    );
    const result = call("run", ["--command", "readiness"]);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout).current).toMatchObject({
      commandPassed: true,
      logTruncated: true,
    });
    const runId = readdirSync(store)[0];
    if (!runId) throw new Error("Missing durable run");
    const terminal = JSON.parse(
      readFileSync(join(store, runId, "0002.json"), "utf8"),
    );
    expect(terminal.payload.logBytes).toBe(4 * 1024 * 1024);
  });
});

function seedStatus(input: ReturnType<typeof fixture>) {
  initializeExecutionStore(input.store, input.worktree);
  const runId = createExecutionRun(input.store);
  const prepared = appendExecutionEvent(input.store, runId, null, {
    kind: "prepared",
    issue: 194,
    command: executionCommand("readiness"),
    assignment: currentExecutionAssignment(
      input.privateState,
      194,
      input.worktree,
    ),
    environment: null,
    authorization: "not-recorded",
    log: "output.log",
  });
  appendExecutionEvent(input.store, runId, prepared, {
    kind: "not-started",
    reason: "USER_PAUSED",
    enforcement: "operator-report",
  });
  writeFileSync(join(input.store, runId, "output.log"), "RAW_LOG_SENTINEL", {
    mode: 0o600,
  });
  return runId;
}
describe("read-only offline status projections", () => {
  it.each([false, true])(
    "reports private=%s without reading logs or invoking GitHub",
    (privateOutput) => {
      const input = fixture(0);
      const runId = seedStatus(input);
      const before = readdirSync(join(input.store, runId));
      const result = input.call("status", privateOutput ? ["--private"] : []);
      expect(result.status).toBe(0);
      expect(JSON.parse(result.stdout)).toMatchObject({
        phase: "not-started",
        hosted: { source: "offline", status: "unavailable" },
      });
      expect(result.stdout + result.stderr).not.toMatch(
        /RAW_LOG_SENTINEL|NETWORK_SENTINEL/,
      );
      expect(result.stdout.includes("PRIVATE_OWNER_SENTINEL")).toBe(
        privateOutput,
      );
      expect(readdirSync(join(input.store, runId))).toEqual(before);
      expect(existsSync(join(input.bin, "gh.called"))).toBe(false);
    },
  );
});

describe("execution bootstrap privacy", () => {
  it("redacts dependency loader failure before the recorder can initialize", () => {
    const input = fixture(0);
    const wrapper = join(input.root, "PRIVATE_BOOTSTRAP_SENTINEL.mjs");
    writeFileSync(wrapper, readFileSync("scripts/record-execution.mjs"));
    const result = spawnSync(process.execPath, [wrapper, "status"], {
      encoding: "utf8",
      timeout: 10_000,
    });
    expect(result.status).toBe(2);
    expect(JSON.parse(result.stdout).phase).toBe("unknown");
    expect(result.stdout + result.stderr).not.toMatch(
      /PRIVATE_BOOTSTRAP_SENTINEL|ERR_MODULE_NOT_FOUND|execution-cli-/,
    );
  });
});

function startAsyncRun(input: ReturnType<typeof fixture>) {
  const child = spawn(
    process.execPath,
    [
      "--import",
      tsx,
      script,
      "run",
      "--store",
      input.store,
      "--private-state",
      input.privateState,
      "--issue",
      "194",
      "--command",
      "readiness",
    ],
    {
      cwd: input.worktree,
      env: { ...process.env, PATH: `${input.bin}:${process.env.PATH}` },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });
  const closed = new Promise<number | null>((resolveExit) =>
    child.once("close", resolveExit),
  );
  return { child, closed, output: () => ({ stdout, stderr }) };
}
async function waitForExitedLeader(
  input: ReturnType<typeof fixture>,
  pidFile: string,
) {
  const deadline = Date.now() + 8_000;
  while (Date.now() < deadline) {
    try {
      const runId = readdirSync(input.store).find(
        (name) => !name.startsWith("."),
      );
      const started = JSON.parse(
        readFileSync(join(input.store, runId ?? "", "0001.json"), "utf8"),
      );
      const descendant = Number(readFileSync(pidFile, "utf8"));
      try {
        process.kill(started.payload.pid, 0);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ESRCH")
          return { runId, descendant };
      }
    } catch {
      /* Wait only for this fixture's observed launch and direct exit. */
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 20));
  }
  throw new Error("Fixture leader did not exit");
}
describe("bounded inherited-pipe completion", () => {
  it.each([false, true])(
    "fails closed after leader exit with interrupt=%s and leaves descendant cleanup explicit",
    async (interrupt) => {
      const input = fixture(0);
      const pidFile = join(input.root, "descendant.pid");
      const program = `#!${process.execPath}\nconst { spawn } = require("node:child_process"); const { writeFileSync } = require("node:fs"); if (process.argv[2] === "--version") { console.log("11.25.0"); } else { const descendant = spawn(process.execPath, ["-e", "setTimeout(() => {}, 20000)"], { stdio: ["ignore", "inherit", "inherit"] }); writeFileSync(${JSON.stringify(pidFile)}, String(descendant.pid)); descendant.unref(); process.exit(0); }\n`;
      writeFileSync(join(input.bin, "pnpm"), program, { mode: 0o700 });
      const run = startAsyncRun(input);
      let descendant: number | undefined;
      try {
        const observed = await waitForExitedLeader(input, pidFile);
        descendant = observed.descendant;
        const exitedAt = Date.now();
        if (interrupt) run.child.kill("SIGTERM");
        expect(await run.closed).toBe(1);
        expect(Date.now() - exitedAt).toBeLessThan(10_000);
        const report = JSON.parse(run.output().stdout);
        expect(report.current).toMatchObject({
          phase: "unknown",
          exitCode: 0,
          signal: null,
          commandPassed: false,
          exactHeadPass: false,
          blocker: "COMPLETION_UNKNOWN",
          logTruncated: true,
        });
        expect(report.nextAction).toContain(
          "descendant cleanup may be unconfirmed",
        );
        expect(run.output().stderr).toBe("");
        const terminal = JSON.parse(
          readFileSync(
            join(input.store, observed.runId ?? "", "0002.json"),
            "utf8",
          ),
        );
        expect(terminal.payload).toMatchObject({
          kind: "finished",
          exitCode: 0,
          reason: "COMPLETION_UNKNOWN",
        });
        // Product deliberately did not use the exited leader's numeric group ID.
        // This test owns the never-restarted descendant and cleans it separately.
        expect(() => process.kill(descendant as number, 0)).not.toThrow();
      } finally {
        if (descendant === undefined && existsSync(pidFile))
          descendant = Number(readFileSync(pidFile, "utf8"));
        if (descendant) {
          try {
            process.kill(descendant, "SIGKILL");
          } catch {
            /* Fixture exited. */
          }
        }
        if (run.child.exitCode === null) run.child.kill("SIGKILL");
        await run.closed;
      }
    },
    15_000,
  );
});
