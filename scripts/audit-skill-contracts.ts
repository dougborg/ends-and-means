import { auditSkillContracts } from "./skill-contracts.ts";

const findings = auditSkillContracts(process.cwd());
if (findings.length) {
  for (const finding of findings) console.error(`${finding.code}: ${finding.message}`);
  process.exitCode = 1;
} else {
  console.log("Repository skills: clean (delivery, research, editorial, and publication capabilities checked)");
}
