import { describe, expect, it } from "vitest";
import { auditLockfilePackages, auditProvenance, type LockfilePackageInventory, type ProvenanceInventory, trackedFilesFromGit } from "../../scripts/provenance.ts";

const inventory: ProvenanceInventory = {
  schemaVersion: 1,
  boundaries: [{ id: "code", pathPrefix: "src/" }],
  rootFiles: [{ path: "package.json", material: "mixed", kind: "manifest", distribution: "source-only" }],
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
    rootFile.material = "";
    expect(auditProvenance(changed, ["src/index.ts", "package.json", "NEW.md"], { dependencies: { runtime: "1" } }, () => true)).toEqual(expect.arrayContaining([
      "package.json: root-file licensing boundary is incomplete",
      "NEW.md: expected exactly one licensing boundary, found 0",
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
  const locked: LockfilePackageInventory = {
    schemaVersion: 1,
    lockfile: "pnpm-lock.yaml",
    packages: [{ key: "example@1.0.0", name: "example", version: "1.0.0", origin: "https://registry.npmjs.org/example/1.0.0", source: "https://example.test/source", license: "MIT", terms: "https://example.test/terms", metadataStatus: "resolved" }],
  };

  it("requires one complete, consistent record for every exact lock key", () => {
    expect(auditLockfilePackages(locked, ["example@1.0.0"])).toEqual([]);
    const changed = structuredClone(locked);
    const dependency = changed.packages[0];
    if (!dependency) throw new Error("Missing package fixture");
    dependency.source = null;
    expect(auditLockfilePackages(changed, ["example@1.0.0", "missing@2.0.0"])).toEqual(expect.arrayContaining([
      "example@1.0.0: resolved package lacks an upstream source locator",
      "missing@2.0.0: locked package lacks provenance metadata",
    ]));
  });
});

describe("tracked-file discovery", () => {
  it("returns paths and converts git failure into actionable output", () => {
    expect(trackedFilesFromGit(() => "one\ntwo\n")).toEqual(["one", "two"]);
    expect(() => trackedFilesFromGit(() => { throw new Error("missing git"); })).toThrow("Run pnpm audit:provenance inside a Git checkout with git available");
  });
});
