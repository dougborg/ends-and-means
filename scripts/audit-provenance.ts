import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { readInstalledPackageEvidence } from "./package-provenance.ts";
import { auditLockfilePackages, auditProvenance, type LockfilePackageInventory, type ProvenanceInventory, trackedFilesFromGit } from "./provenance.ts";

function main() {
  const inventory = JSON.parse(readFileSync("provenance/inventory.json", "utf8")) as ProvenanceInventory;
  const manifest = JSON.parse(readFileSync("package.json", "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
  };
  const lockedInventory = JSON.parse(readFileSync("provenance/pnpm-lock-packages.json", "utf8")) as LockfilePackageInventory;
  const lockfile = parse(readFileSync("pnpm-lock.yaml", "utf8")) as { packages?: Record<string, unknown> };
  const trackedFiles = trackedFilesFromGit(() => execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }));
  const findings = [...auditProvenance(inventory, trackedFiles, manifest, existsSync), ...auditLockfilePackages(lockedInventory, Object.keys(lockfile.packages ?? {}), readInstalledPackageEvidence())];

  if (findings.length > 0) {
    console.error(["Repository provenance: findings", ...findings.map((finding) => `- ${finding}`)].join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`Repository provenance: clean (${trackedFiles.length} tracked files, ${inventory.dependencies.length} direct and ${lockedInventory.packages.length} locked packages)`);
  }
}

try {
  main();
} catch (error) {
  console.error(`Repository provenance: ERROR: ${error instanceof Error ? error.message : "unexpected failure"}`);
  process.exitCode = 1;
}
