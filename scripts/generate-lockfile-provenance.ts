import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "yaml";
import { mergePackageEvidence, packageEvidenceDigest, packageIdentity, packageLocators, readCommittedPackageEvidence, readInstalledPackageEvidence } from "./package-provenance.ts";
import type { LockfilePackageInventory } from "./provenance.ts";

const lockfile = parse(readFileSync("pnpm-lock.yaml", "utf8")) as { packages?: Record<string, unknown> };
const installed = mergePackageEvidence(readCommittedPackageEvidence(), readInstalledPackageEvidence());
const packages = Object.keys(lockfile.packages ?? {}).sort().map((key) => {
  const { name, version } = packageIdentity(key);
  const evidence = installed.get(key);
  const license = evidence?.license ?? "unresolved";
  const record = {
    key,
    name,
    version,
    ...packageLocators(name, version),
    source: evidence?.source ?? null,
    license,
    metadataStatus: license === "unresolved" ? "unresolved" : "resolved",
  } as const;
  return { ...record, evidenceDigest: packageEvidenceDigest(record) };
});
const inventory: LockfilePackageInventory = { schemaVersion: 1, lockfile: "pnpm-lock.yaml", packages };
writeFileSync("provenance/pnpm-lock-packages.json", `${JSON.stringify(inventory, null, 2)}\n`);
