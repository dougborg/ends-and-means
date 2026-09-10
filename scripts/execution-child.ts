import { type ChildProcess, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { closeSync, constants, fsyncSync, openSync, writeSync } from "node:fs";
import { executionRunIdentity } from "./execution-correlation.ts";
import { type ExecutionPayload, executionLimits } from "./execution-schema.ts";

type Finished = Extract<ExecutionPayload, { kind: "finished" }>;
type Outcome = Pick<
  Finished,
  "exitCode" | "signal" | "result" | "reason" | "logBytes" | "logTruncated"
>;
function ownedAlive(child: ChildProcess) {
  return (
    Boolean(child.pid) && child.exitCode === null && child.signalCode === null
  );
}
function signalOwned(child: ChildProcess, signal: NodeJS.Signals) {
  if (!ownedAlive(child) || !child.pid) return;
  try {
    process.kill(-child.pid, signal);
  } catch {
    /* The live runner's actual owned child already exited. */
  }
}
function boundedLog(path: string) {
  const fd = openSync(
    path,
    constants.O_WRONLY |
      constants.O_CREAT |
      constants.O_EXCL |
      constants.O_NOFOLLOW,
    0o600,
  );
  let logBytes = 0;
  let logTruncated = false;
  return {
    output(chunk: Buffer) {
      const room = executionLimits.logBytes - logBytes;
      const bytes = chunk.subarray(0, Math.max(0, room));
      let written = 0;
      while (written < bytes.length) {
        const count = writeSync(fd, bytes, written, bytes.length - written);
        if (count === 0) throw new Error("EXECUTION_LOG_WRITE");
        written += count;
        logBytes += count;
      }
      logTruncated ||= chunk.length > room;
    },
    close() {
      try {
        fsyncSync(fd);
      } finally {
        closeSync(fd);
      }
      return { logBytes, logTruncated };
    },
  };
}
function outcome(
  code: number | null,
  signal: NodeJS.Signals | null,
  failed: boolean,
  requested: Finished["reason"] | null,
): Omit<Outcome, "logBytes" | "logTruncated"> {
  if (failed)
    return {
      result: "launch-failed",
      exitCode: null,
      signal: null,
      reason: "LAUNCH_FAILED",
    };
  const known = [
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
  ];
  const normalized =
    signal && !known.includes(signal)
      ? "OTHER"
      : (signal as Finished["signal"]);
  if (requested || signal)
    return {
      result: "interrupted",
      exitCode: code,
      signal: normalized,
      reason: requested ?? "INTERRUPTED",
    };
  return {
    result: code === 0 ? "success" : "failure",
    exitCode: code,
    signal: null,
    reason: code === 0 ? "NONE" : "COMMAND_FAILED",
  };
}
// The live runner owns these timers and pipes, never a recovered historical PID.
class ChildObservation {
  private requested: Finished["reason"] | null = null;
  private heartbeat: ReturnType<typeof setInterval> | undefined;
  private deadline: ReturnType<typeof setTimeout> | undefined;
  private escalation: ReturnType<typeof setTimeout> | undefined;
  private drain: ReturnType<typeof setTimeout> | undefined;
  private finalDeadline: ReturnType<typeof setTimeout> | undefined;
  private launchFailed = false;
  private settled = false;
  private directExit: {
    code: number | null;
    signal: NodeJS.Signals | null;
  } | null = null;
  private readonly interrupt = () => this.stop("INTERRUPTED");

  private readonly child: ChildProcess;
  private readonly log: ReturnType<typeof boundedLog>;
  private readonly append: (payload: ExecutionPayload) => void;
  private readonly resolve: (value: Outcome) => void;
  constructor(
    child: ChildProcess,
    log: ReturnType<typeof boundedLog>,
    append: (payload: ExecutionPayload) => void,
    resolve: (value: Outcome) => void,
  ) {
    this.child = child;
    this.log = log;
    this.append = append;
    this.resolve = resolve;
    process.once("SIGINT", this.interrupt);
    process.once("SIGTERM", this.interrupt);
    child.stdout?.on("data", (chunk) => this.output(chunk));
    child.stderr?.on("data", (chunk) => this.output(chunk));
    child.once("spawn", () => this.started());
    child.once("error", () => {
      this.launchFailed = true;
    });
    child.once("exit", (code, signal) => {
      if (this.settled) return;
      this.directExit = { code, signal };
      // A descendant may retain inherited pipes after its leader exits.
      this.drain = setTimeout(() => this.finish(true), 5_000);
    });
    child.once("close", (code, signal) => {
      this.directExit ??= { code, signal };
      this.finish(false);
    });
  }
  private publish(payload: ExecutionPayload) {
    try {
      this.append(payload);
    } catch {
      this.stop("RECORDER_FAILURE");
    }
  }
  private output(chunk: Buffer) {
    if (this.settled) return;
    try {
      this.log.output(chunk);
    } catch {
      this.stop("RECORDER_FAILURE");
    }
  }
  private started() {
    const nonce = randomUUID();
    this.publish({ kind: "spawned", pid: this.child.pid as number, nonce });
    this.heartbeat = setInterval(() => {
      if (ownedAlive(this.child)) this.publish({ kind: "heartbeat", nonce });
    }, executionLimits.heartbeatMs);
    this.deadline = setTimeout(
      () => this.stop("RUN_TIMEOUT"),
      executionLimits.timeoutMs,
    );
  }
  private stop(reason: Finished["reason"]) {
    if (this.settled) return;
    this.requested ??= reason;
    signalOwned(this.child, "SIGTERM");
    this.escalation ??= setTimeout(() => {
      signalOwned(this.child, "SIGKILL");
      this.finalDeadline = setTimeout(() => this.finish(true), 5_000);
    }, 5_000);
  }
  private finish(abandoned: boolean) {
    if (this.settled) return;
    this.settled = true;
    clearInterval(this.heartbeat);
    for (const timer of [
      this.deadline,
      this.escalation,
      this.drain,
      this.finalDeadline,
    ])
      clearTimeout(timer);
    process.removeListener("SIGINT", this.interrupt);
    process.removeListener("SIGTERM", this.interrupt);
    if (abandoned) {
      this.requested = "COMPLETION_UNKNOWN";
      this.child.stdout?.destroy();
      this.child.stderr?.destroy();
      this.child.unref();
    }
    let logResult = { logBytes: 0, logTruncated: true };
    try {
      logResult = this.log.close();
    } catch {
      this.requested = "RECORDER_FAILURE";
    }
    const direct = this.directExit ?? { code: null, signal: null };
    this.resolve({
      ...outcome(direct.code, direct.signal, this.launchFailed, this.requested),
      ...logResult,
      logTruncated: abandoned || logResult.logTruncated,
    });
  }
}
export async function runExecutionChild(
  argv: string[],
  root: string,
  logPath: string,
  append: (payload: ExecutionPayload) => void,
  runId: string,
): Promise<Outcome> {
  const correlation = executionRunIdentity({
    ENDS_MEANS_EXECUTION_RUN_ID: runId,
  });
  const log = boundedLog(logPath);
  let child: ReturnType<typeof spawn>;
  try {
    child = spawn(argv[0] ?? "", argv.slice(1), {
      cwd: root,
      env: { ...process.env, ENDS_MEANS_EXECUTION_RUN_ID: correlation },
      detached: true,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    log.close();
    throw error;
  }
  return await new Promise((resolve) => {
    new ChildObservation(child, log, append, resolve);
  });
}
