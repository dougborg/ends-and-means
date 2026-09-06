import { describe, expect, it } from "vitest";
import { auditProvenance, type ProvenanceInventory } from "../../scripts/provenance.ts";

const inventory: ProvenanceInventory = {
  schemaVersion: 1,
  boundaries: [{ id: "code", pathPrefix: "src/" }],
  rootFiles: ["package.json"],
  assetClasses: [{ class: "images", extensions: [".png"], state: "none" }],
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
