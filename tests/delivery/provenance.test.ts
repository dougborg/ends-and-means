import { describe, expect, it } from "vitest";
import { packageEvidenceDigest } from "../../scripts/package-provenance.ts";
import { auditLockfilePackages, auditProvenance, type LockfilePackageInventory, type ProvenanceInventory, trackedFilesFromGit } from "../../scripts/provenance.ts";

const inventory: ProvenanceInventory = {
  schemaVersion: 1,
  boundaries: [{ id: "code", pathPrefix: "src/", material: "repository-owned", kind: "code", distribution: "source-only" }],
  rootFiles: [{ path: "package.json", material: "mixed-third-party-metadata", kind: "package-manifest", distribution: "source-only" }],
  assetClasses: [{ class: "images", extensions: [".png"], paths: [], state: "none" }],
  thirdPartyAssets: [],
  dependencies: [{ name: "runtime", scope: "runtime", license: "MIT", source: "https://example.test/source", terms: "https://example.test/license" }],
};

describe("repository provenance inventory", () => {
  it("accepts covered authored files and complete direct dependencies", () => {
    expect(auditProvenance(inventory, ["src/index.ts", "package.json"], { dependencies: { runtime: "1" } }, () => true)).toEqual([]);
  });

  it("rejects unclassified files, unregistered governed assets, and dependency drift", () => {
    expect(auditProvenance(inventory, ["src/index.ts", "public/photo.png", "mystery.txt"], { dependencies: { missing: "1" } }, () => true)).toEqual(expect.arrayContaining([
      "public/photo.png: expected exactly one licensing boundary, found 0",
      "public/photo.png: governed asset lacks provenance metadata",
      "mystery.txt: expected exactly one licensing boundary, found 0",
      "missing: direct dependency lacks provenance metadata",
      "runtime: provenance entry is not a direct dependency",
    ]));
  });

  it("reconciles optional dependencies", () => {
    expect(auditProvenance(inventory, ["src/index.ts", "package.json"], { dependencies: { runtime: "1" }, optionalDependencies: { optional: "1" } }, () => true)).toContain("optional: direct dependency lacks provenance metadata");
  });

  it("rejects empty third-party paths and asset-state drift", () => {
    const changed = structuredClone(inventory);
    changed.thirdPartyAssets.push({ id: "empty", paths: [], origin: "origin", authorOrProvider: "author", licenseOrTerms: "MIT", termsLocator: "https://example.test", modified: false, distribution: "source-only", attribution: "notice", resolution: "none" });
    const assetClass = changed.assetClasses[0];
    if (!assetClass) throw new Error("Missing asset class fixture");
    assetClass.state = "present";
    expect(auditProvenance(changed, ["src/index.ts", "package.json"], { dependencies: { runtime: "1" } }, () => true)).toEqual(expect.arrayContaining([
      "images: state is present but no tracked assets exist",
      "empty: third-party provenance record is incomplete",
    ]));
  });

  it("rejects incomplete root-file boundaries", () => {
    const changed = structuredClone(inventory);
    const rootFile = changed.rootFiles[0];
    if (!rootFile) throw new Error("Missing root file fixture");
    (rootFile as unknown as { material: string }).material = "";
    expect(auditProvenance(changed, ["src/index.ts", "package.json", "NEW.md"], { dependencies: { runtime: "1" } }, () => true)).toEqual(expect.arrayContaining([
      "package.json: root-file licensing boundary is incomplete",
      "NEW.md: expected exactly one licensing boundary, found 0",
    ]));
  });

  it("rejects incomplete, overlapping, and root-versus-prefix classifications", () => {
    const changed = structuredClone(inventory);
    const boundary = changed.boundaries[0];
    if (!boundary) throw new Error("Missing boundary fixture");
    (boundary as unknown as { material: string }).material = "";
    changed.boundaries.push({ id: "nested", pathPrefix: "src/nested/", material: "repository-owned", kind: "code", distribution: "source-only" });
    changed.rootFiles.push({ path: "src/index.ts", material: "repository-owned", kind: "code", distribution: "source-only" });
    expect(auditProvenance(changed, ["src/index.ts", "src/nested/file.ts", "package.json"], { dependencies: { runtime: "1" } }, () => true)).toEqual(expect.arrayContaining([
      "code: directory licensing boundary is incomplete",
      "src/index.ts: expected exactly one licensing boundary, found 2",
      "src/nested/file.ts: expected exactly one licensing boundary, found 2",
    ]));
  });

  it("uses safe file-or-directory-prefix matching for governed assets", () => {
    const changed = structuredClone(inventory);
    changed.thirdPartyAssets.push({ id: "images", paths: ["src/assets/"], origin: "origin", authorOrProvider: "author", licenseOrTerms: "MIT", termsLocator: "https://example.test", modified: false, distribution: "source-only", attribution: "notice", resolution: "none" });
    const assetClass = changed.assetClasses[0];
    if (!assetClass) throw new Error("Missing asset fixture");
    assetClass.paths = ["src/assets/"];
    assetClass.state = "present";
    expect(auditProvenance(changed, ["src/index.ts", "src/assets/nested/photo.png", "package.json"], { dependencies: { runtime: "1" } }, () => true)).toEqual([]);
    const thirdPartyAsset = changed.thirdPartyAssets[0];
    if (!thirdPartyAsset) throw new Error("Missing third-party fixture");
    thirdPartyAsset.paths = ["src/assets/../private/"];
    expect(auditProvenance(changed, ["src/index.ts", "src/assets/nested/photo.png", "package.json"], { dependencies: { runtime: "1" } }, () => true)).toEqual(expect.arrayContaining([
      "src/assets/nested/photo.png: governed asset lacks provenance metadata",
      "images: src/assets/../private/ does not match a safe tracked path or directory prefix",
    ]));
  });

  it("fails incomplete or publishable unresolved third-party records", () => {
    const changed = structuredClone(inventory);
    changed.thirdPartyAssets.push({ id: "unknown", paths: ["src/asset.png"], origin: "unknown", authorOrProvider: "unknown", licenseOrTerms: "unresolved", termsLocator: "missing.txt", modified: false, distribution: "site", attribution: "", resolution: "ask owner" });
    expect(auditProvenance(changed, ["src/asset.png"], { dependencies: { runtime: "1" } }, () => false)).toEqual(expect.arrayContaining([
      "unknown: third-party provenance record is incomplete",
      "unknown: terms locator does not exist",
      "unknown: unresolved material cannot be published",
    ]));
  });
});

describe("exact lockfile package inventory", () => {
  const packageRecord = { key: "example@1.0.0", name: "example", version: "1.0.0", origin: "https://registry.npmjs.org/example/1.0.0", source: "https://example.test/source", license: "MIT", terms: "https://www.npmjs.com/package/example/v/1.0.0?activeTab=code", metadataStatus: "resolved" as const };
  const locked: LockfilePackageInventory = {
    schemaVersion: 1,
    lockfile: "pnpm-lock.yaml",
    packages: [{ ...packageRecord, evidenceDigest: packageEvidenceDigest(packageRecord) }],
  };

  it("requires one complete, consistent record for every exact lock key", () => {
    const evidence = new Map([["example@1.0.0", { license: "MIT", source: "https://example.test/source" }]]);
    expect(auditLockfilePackages(locked, ["example@1.0.0"], evidence)).toEqual([]);
    const changed = structuredClone(locked);
    const dependency = changed.packages[0];
    if (!dependency) throw new Error("Missing package fixture");
    dependency.source = null;
    dependency.evidenceDigest = packageEvidenceDigest(dependency);
    expect(auditLockfilePackages(changed, ["example@1.0.0", "missing@2.0.0"], evidence)).toEqual(expect.arrayContaining([
      "example@1.0.0: resolved package lacks an upstream source locator",
      "missing@2.0.0: locked package lacks provenance metadata",
    ]));
  });

  it("rejects license and deterministic locator mutations", () => {
    const changed = structuredClone(locked);
    const changedPackage = changed.packages[0];
    const originalPackage = locked.packages[0];
    if (!changedPackage || !originalPackage) throw new Error("Missing lockfile fixture");
    changedPackage.license = "GPL-3.0-only";
    changedPackage.origin = "https://example.test/arbitrary";
    expect(auditLockfilePackages(changed, ["example@1.0.0"], new Map([["example@1.0.0", { license: "MIT", source: "https://example.test/source" }]]))).toEqual(expect.arrayContaining([
      "example@1.0.0: registry origin or terms locator is not deterministic",
    ]));
    changedPackage.origin = originalPackage.origin;
    expect(auditLockfilePackages(changed, ["example@1.0.0"], new Map([["example@1.0.0", { license: "MIT", source: "https://example.test/source" }]]))).toContain("example@1.0.0: package evidence digest does not match license/source metadata");
    changedPackage.evidenceDigest = packageEvidenceDigest(changedPackage);
    expect(auditLockfilePackages(changed, ["example@1.0.0"], new Map([["example@1.0.0", { license: "MIT", source: "https://example.test/source" }]]))).toContain("example@1.0.0: license or source differs from the installed package manifest");
  });

  it("rejects downgrading installed evidence to unresolved metadata", () => {
    const changed = structuredClone(locked);
    const changedPackage = changed.packages[0];
    if (!changedPackage) throw new Error("Missing lockfile fixture");
    changedPackage.license = "unresolved";
    changedPackage.source = null;
    changedPackage.metadataStatus = "unresolved";
    changedPackage.evidenceDigest = packageEvidenceDigest(changedPackage);
    expect(auditLockfilePackages(changed, ["example@1.0.0"], new Map([["example@1.0.0", { license: "MIT", source: "https://example.test/source" }]]))).toContain(
      "example@1.0.0: installed package evidence must be recorded as resolved",
    );
  });
});

describe("tracked-file discovery", () => {
  it("returns paths and converts git failure into actionable output", () => {
    expect(trackedFilesFromGit(() => "one\0two\r\ninside\0")).toEqual(["one", "two\r\ninside"]);
    expect(() => trackedFilesFromGit(() => { throw new Error("missing git"); })).toThrow("Run pnpm audit:provenance inside a Git checkout with git available");
  });
});
