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
function control(child: ChildProcess) {
  let requested: Finished["reason"] | null = null;
  let escalation: ReturnType<typeof setTimeout> | undefined;
  return {
    stop(reason: Finished["reason"]) {
      requested ??= reason;
      if (!ownedAlive(child)) return;
      signalOwned(child, "SIGTERM");
      escalation ??= setTimeout(() => signalOwned(child, "SIGKILL"), 5_000);
    },
    finish() {
      clearTimeout(escalation);
      return requested;
    },
  };
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
  const owner = control(child);
  const interrupted = () => owner.stop("INTERRUPTED");
  const output = (chunk: Buffer) => {
    try {
      log.output(chunk);
    } catch {
      owner.stop("RECORDER_FAILURE");
    }
  };
  const publish = (payload: ExecutionPayload) => {
    try {
      append(payload);
    } catch {
      owner.stop("RECORDER_FAILURE");
    }
  };
  process.once("SIGINT", interrupted);
  process.once("SIGTERM", interrupted);
  child.stdout?.on("data", output);
  child.stderr?.on("data", output);
  return await new Promise((resolve) => {
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let launchFailed = false;
    child.once("spawn", () => {
      const nonce = randomUUID();
      publish({ kind: "spawned", pid: child.pid as number, nonce });
      heartbeat = setInterval(() => {
        if (ownedAlive(child)) publish({ kind: "heartbeat", nonce });
      }, executionLimits.heartbeatMs);
      timer = setTimeout(
        () => owner.stop("RUN_TIMEOUT"),
        executionLimits.timeoutMs,
      );
    });
    child.once("error", () => {
      launchFailed = true;
    });
    child.once("close", (code, signal) => {
      clearInterval(heartbeat);
      clearTimeout(timer);
      process.removeListener("SIGINT", interrupted);
      process.removeListener("SIGTERM", interrupted);
      let logResult = { logBytes: 0, logTruncated: true };
      try {
        logResult = log.close();
      } catch {
        owner.stop("RECORDER_FAILURE");
      }
      resolve({
        ...outcome(code, signal, launchFailed, owner.finish()),
        ...logResult,
      });
    });
  });
}
