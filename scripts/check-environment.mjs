// Diagnose missing dependencies without importing tsx or the dependency parser first.
import { configurationFindings, runtimeObservation, toolchainFindings } from "./environment-runtime.ts";
const options = new Set(process.argv.slice(2).filter(value => value !== "--"));
if ([...options].some(value => !["--preview", "--advisory"].includes(value))) {
  console.error("ENVIRONMENT_ARGUMENT: supported options are --preview and --advisory.");
  process.exitCode = 1;
} else {
  const observedAt = new Date().toISOString();
  const abort = new AbortController();
  const interrupted = () => abort.abort();
  process.once("SIGINT", interrupted);
  process.once("SIGTERM", interrupted);
  try {
    const { inspectEnvironment } = await import("./environment-readiness.ts");
    const result = await inspectEnvironment(process.cwd(), { preview: options.has("--preview"), advisory: options.has("--advisory"), signal: abort.signal });
    console.log(JSON.stringify(result, null, 2));
    if (result.status !== "locally-ready" || abort.signal.aborted) process.exitCode = 1;
  } catch {
    const preliminary = [...toolchainFindings(process.cwd(), runtimeObservation()), ...configurationFindings("verify")];
    console.log(JSON.stringify({ schemaVersion: 1, kind: "environment-readiness", observedAt, completedAt: new Date().toISOString(), status: "not-ready", fingerprint: null, fingerprintDigest: null, probes: { preview: { status: "not-run" }, advisory: { status: "not-run" } }, limits: ["Dependency inspection could not load; no capability probes ran."], findings: [...preliminary, { code: "DEPENDENCY_UNAVAILABLE", remedy: "Run the built-in environment-entry.mjs guard, then explicitly set up task-owned frozen dependencies." }] }));
    process.exitCode = 1;
  } finally {
    process.removeListener("SIGINT", interrupted);
    process.removeListener("SIGTERM", interrupted);
  }
}
