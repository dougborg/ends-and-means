import { spawn } from "node:child_process";
import { createServer } from "node:net";
import type { EnvironmentFinding } from "./environment-runtime.ts";

export interface ProbeResult {
  status: "passed" | "unavailable" | "finding" | "interrupted";
  code: string;
}

// Own exactly one listening socket. Never connect to or reuse a foreign listener.
export function previewProbe(port: number, signal?: AbortSignal): Promise<ProbeResult> {
  return new Promise(resolve => {
    const server = createServer(socket => socket.destroy());
    let settled = false;
    const finish = (result: ProbeResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener("abort", interrupted);
      server.close(() => resolve(result));
    };
    const interrupted = () => finish({ status: "interrupted", code: "PREVIEW_INTERRUPTED" });
    const timer = setTimeout(() => finish({ status: "unavailable", code: "PREVIEW_TIMEOUT" }), 2_000);
    server.once("error", (error: NodeJS.ErrnoException) => finish({ status: "unavailable", code: error.code === "EADDRINUSE" ? "PREVIEW_COLLISION" : error.code === "EACCES" || error.code === "EPERM" ? "PREVIEW_DENIED" : "PREVIEW_UNAVAILABLE" }));
    server.once("listening", () => finish({ status: "passed", code: "PREVIEW_BIND_OK" }));
    if (signal?.aborted) interrupted();
    else {
      signal?.addEventListener("abort", interrupted, { once: true });
      server.listen({ host: "127.0.0.1", port, exclusive: true });
    }
  });
}

export function classifyAdvisory(exitCode: number | null, stdout: string, interrupted = false): ProbeResult {
  if (interrupted) return { status: "interrupted", code: "ADVISORY_INTERRUPTED" };
  try {
    const audit = JSON.parse(stdout);
    const counts = audit.metadata?.vulnerabilities;
    if (audit.error || !counts || !["info", "low", "moderate", "high", "critical"].every(key => Number.isSafeInteger(counts[key]) && counts[key] >= 0)) throw new Error("Unavailable response");
    if (counts.moderate + counts.high + counts.critical > 0) return { status: "finding", code: "ADVISORY_VULNERABILITY" };
    if (exitCode !== 0) throw new Error("Audit failed");
    return { status: "passed", code: "ADVISORY_THRESHOLD_OK" };
  } catch { return { status: "unavailable", code: "ADVISORY_UNAVAILABLE" }; }
}

export function advisoryProbe(root: string, signal?: AbortSignal): Promise<ProbeResult> {
  if (signal?.aborted) return Promise.resolve({ status: "interrupted", code: "ADVISORY_INTERRUPTED" });
  return new Promise(resolve => {
    const child = spawn("pnpm", ["audit", "--audit-level=moderate", "--json", "--fetch-retries=0", "--fetch-timeout=10000"], { cwd: root, stdio: ["ignore", "pipe", "ignore"], detached: true });
    let stdout = "";
    let reason: "interrupted" | "timeout" | "overflow" | null = null;
    const stop = (cause: "interrupted" | "timeout" | "overflow" = "interrupted") => {
      reason ??= cause;
      if (child.pid) { try { process.kill(-child.pid, "SIGKILL"); } catch { /* Already exited. */ } }
    };
    const interrupted = () => stop("interrupted");
    const timer = setTimeout(() => stop("timeout"), 15_000);
    child.stdout.on("data", chunk => { stdout += String(chunk); if (stdout.length > 2_000_000) stop("overflow"); });
    child.once("error", () => { clearTimeout(timer); signal?.removeEventListener("abort", interrupted); resolve({ status: "unavailable", code: "ADVISORY_UNAVAILABLE" }); });
    child.once("close", code => { clearTimeout(timer); signal?.removeEventListener("abort", interrupted); resolve(reason === "timeout" || reason === "overflow" ? { status: "unavailable", code: reason === "timeout" ? "ADVISORY_TIMEOUT" : "ADVISORY_UNAVAILABLE" } : classifyAdvisory(code, stdout, reason === "interrupted")); });
    if (signal?.aborted) stop();
    else signal?.addEventListener("abort", interrupted, { once: true });
  });
}

export function probeFinding(result: ProbeResult): EnvironmentFinding[] {
  return result.status === "passed" ? [] : [{ code: result.code, remedy: "Record the actual capability result separately from authorization; retry only after a changed condition. Do not clear caches, kill foreign listeners, or weaken verification." }];
}
