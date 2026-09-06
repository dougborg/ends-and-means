import { readFile } from "node:fs/promises";
import { auditCorpusCandidateMatrix } from "./corpus-diversity";

const path = "research/corpus-diversity/candidates.json";
const findings = auditCorpusCandidateMatrix(
  JSON.parse(await readFile(path, "utf8")),
);
console.log("Corpus diversity and source feasibility");
for (const finding of findings)
  console.log(
    `- [${finding.severity}] ${finding.location}: ${finding.message}\n  ${finding.remediation}`,
  );
console.log(
  `Violations: ${findings.filter(({ severity }) => severity === "violation").length}`,
);
console.log(
  `Attention: ${findings.filter(({ severity }) => severity === "attention").length}`,
);
if (findings.some(({ severity }) => severity === "violation"))
  process.exitCode = 1;
