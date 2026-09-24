import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse } from "yaml";
import { mergePackageEvidence, packageEvidenceDigest, packageIdentity, packageLocators, platformObservations, readInstalledPackageEvidence } from "./package-provenance.ts";
import type { LockfilePackageInventory } from "./provenance.ts";

// The audit targets are fixed so the inventory is identical on every host: macOS arm64
// development machines and the Ubuntu x64 (glibc) CI runner. Each target gets its own
// frozen, script-free install of the committed lockfile in a disposable directory.
const auditTargets = {
  darwin: { flags: ["--os", "darwin", "--cpu", "arm64"], libc: undefined },
  linux: { flags: ["--os", "linux", "--cpu", "x64", "--libc", "glibc"], libc: "glibc" },
} as const;

function observeTarget({ flags, libc }: { flags: readonly string[]; libc: string | undefined }) {
  const directory = mkdtempSync(join(tmpdir(), "ends-and-means-provenance-"));
  try {
    for (const file of ["package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml"]) copyFileSync(file, join(directory, file));
    execFileSync("pnpm", ["install", "--frozen-lockfile", "--ignore-scripts", "--prefer-offline", "--reporter", "silent", ...flags], { cwd: directory, stdio: "inherit" });
    return readInstalledPackageEvidence(join(directory, "node_modules", ".pnpm"), libc);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

const lockfile = parse(readFileSync("pnpm-lock.yaml", "utf8")) as { packages?: Record<string, unknown> };
const darwin = observeTarget(auditTargets.darwin);
const linux = observeTarget(auditTargets.linux);
const installed = mergePackageEvidence(darwin, linux);
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
const observations = platformObservations(linux, darwin).map((observation) => `    { ${Object.entries(observation).map(([field, value]) => `${JSON.stringify(field)}: ${JSON.stringify(value)}`).join(", ")} }`);
writeFileSync("provenance/platform-package-evidence.json", `{\n  "schemaVersion": 1,\n  "observations": [\n${observations.join(",\n")}\n  ]\n}\n`);
