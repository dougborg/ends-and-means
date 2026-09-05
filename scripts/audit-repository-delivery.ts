import { auditRepositoryDelivery } from "./repository-delivery.ts";

const findings = auditRepositoryDelivery(process.cwd());
if (findings.length) {
  for (const finding of findings) console.error(`${finding.code}: ${finding.message}`);
  process.exitCode = 1;
} else {
  console.log("Repository delivery: clean");
}
