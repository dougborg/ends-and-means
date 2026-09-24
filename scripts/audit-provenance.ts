import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { mergePackageEvidence, readCommittedPackageEvidence, readInstalledPackageEvidence } from "./package-provenance.ts";
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
  const evidence = mergePackageEvidence(readCommittedPackageEvidence(), readInstalledPackageEvidence());
  const lockfileFindings = auditLockfilePackages(lockedInventory, Object.keys(lockfile.packages ?? {}), evidence);
  const findings = [...auditProvenance(inventory, trackedFiles, manifest, existsSync), ...lockfileFindings];

  if (findings.length > 0) {
    const remedy = lockfileFindings.length > 0 ? ["After an intentional dependency change, including a Dependabot update, run pnpm inventory:dependencies and commit the provenance files."] : [];
    console.error(["Repository provenance: findings", ...findings.map((finding) => `- ${finding}`), ...remedy].join("\n"));
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
