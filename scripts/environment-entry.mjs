// Built-in Node only: this guard works before dependencies are installed.
import { configurationFindings, runtimeObservation, toolchainFindings } from "./environment-runtime.ts";
const mode = process.argv[2] ?? "command";
if (!["command", "focused", "verify"].includes(mode)) {
  console.error("ENVIRONMENT_ARGUMENT: select command, focused, or verify.");
  process.exitCode = 1;
} else {
  const findings = [...toolchainFindings(process.cwd(), runtimeObservation()), ...configurationFindings(mode)];
  for (const finding of findings) console.error(`${finding.code}: ${finding.remedy}`);
  if (findings.length) process.exitCode = 1;
}
