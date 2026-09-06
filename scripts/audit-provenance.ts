import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { auditProvenance, type ProvenanceInventory } from "./provenance.ts";

const inventory = JSON.parse(readFileSync("provenance/inventory.json", "utf8")) as ProvenanceInventory;
const manifest = JSON.parse(readFileSync("package.json", "utf8")) as {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};
const trackedFiles = execFileSync("git", ["ls-files"], { encoding: "utf8" }).trim().split("\n").filter(Boolean);
const findings = auditProvenance(inventory, trackedFiles, manifest, existsSync);

if (findings.length > 0) {
  console.error(["Repository provenance: findings", ...findings.map((finding) => `- ${finding}`)].join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Repository provenance: clean (${trackedFiles.length} tracked files, ${inventory.dependencies.length} direct dependencies)`);
}
