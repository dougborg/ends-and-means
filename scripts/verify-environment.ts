import { spawn } from "node:child_process";
import {
  artifactDigest,
  writeVerificationEvidence,
} from "./environment-artifact.ts";
import { inspectEnvironment } from "./environment-readiness.ts";
import { executionRunIdentity } from "./execution-correlation.ts";

async function runChecks() {
  return await new Promise<number>((resolve) => {
    const child = spawn("pnpm", ["run", "verify:checks"], {
      stdio: "inherit",
      detached: true,
    });
    const interrupt = () => {
      if (child.pid) {
        try {
          process.kill(-child.pid, "SIGTERM");
        } catch {
          /* The owned command has already exited. */
        }
      }
    };
    process.once("SIGINT", interrupt);
    process.once("SIGTERM", interrupt);
    const cleanup = () => {
      process.removeListener("SIGINT", interrupt);
      process.removeListener("SIGTERM", interrupt);
    };
    child.once("error", () => {
      cleanup();
      resolve(1);
    });
    child.once("close", (code) => {
      cleanup();
      resolve(code ?? 1);
    });
  });
}

async function main() {
  if (process.argv.length !== 2)
    throw new Error(
      "Full verification does not accept scope or target arguments",
    );
  const executionRunId = executionRunIdentity();
  const root = process.cwd();
  const start = await inspectEnvironment(root);
  console.log(JSON.stringify(start));
  if (start.status !== "locally-ready") return 1;
  const exitCode = await runChecks();
  if (exitCode !== 0) return exitCode;
  const finish = await inspectEnvironment(root);
  if (
    finish.status !== "locally-ready" ||
    finish.fingerprintDigest !== start.fingerprintDigest
  )
    throw new Error("Source or environment changed during verification");
  const evidence = {
    ...(executionRunId ? { executionRunId } : {}),
    schemaVersion: 1,
    kind: "verified-static-artifact",
    observedAt: new Date().toISOString(),
    startedAt: start.observedAt,
    fingerprint: start.fingerprint,
    fingerprintDigest: start.fingerprintDigest,
    artifact: artifactDigest(root),
    boundary:
      "pnpm verify passed for this source and dist; hosted exact-head checks and Pages deployment remain separate gates",
  };
  writeVerificationEvidence(root, evidence);
  console.log(JSON.stringify(evidence));
  return 0;
}

try {
  process.exitCode = await main();
} catch {
  console.error(
    "VERIFICATION_ENVIRONMENT: entry arguments, unchanged source, and owned artifact/evidence output are required; inspect the environment matrix.",
  );
  process.exitCode = 1;
}
