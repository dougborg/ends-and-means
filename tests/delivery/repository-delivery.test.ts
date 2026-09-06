import { cp, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { auditRepositoryDelivery } from "../../scripts/repository-delivery.ts";

async function repositoryFixture() {
  const root = await mkdtemp(join(tmpdir(), "ends-means-delivery-"));
  for (const path of [".github", "package.json", "pnpm-lock.yaml"]) {
    await cp(join(process.cwd(), path), join(root, path), { recursive: true });
  }
  return root;
}

async function replace(root: string, path: string, from: string, to: string) {
  const target = join(root, path);
  await writeFile(target, (await readFile(target, "utf8")).replace(from, to));
}

describe("repository delivery configuration", () => {
  it("has one pnpm-backed verification owner and stable required checks", () => {
    expect(auditRepositoryDelivery(process.cwd())).toEqual([]);
  });

  it("detects unsafe triggers, permissions, mutable actions, and checkout credentials", async () => {
    const root = await repositoryFixture();
    await replace(root, ".github/workflows/security.yml", "pull_request:", "pull_request_target:");
    await replace(root, ".github/workflows/ci.yml", "contents: read", "contents: write");
    await replace(root, ".github/workflows/security.yml", "@3d3c42e5aac5ba805825da76410c181273ba90b1", "@main");
    await replace(root, ".github/actions/verify/action.yml", "persist-credentials: false", "persist-credentials: true");
    const codes = auditRepositoryDelivery(root).map((finding) => finding.code);
    expect(codes).toEqual(expect.arrayContaining(["FORK_SAFETY", "WORKFLOW_PERMISSIONS", "ACTION_PIN", "CHECKOUT_CREDENTIALS"]));
  });

  it("fails closed for omitted permissions, job write-all, and mutable reusable workflows", async () => {
    const root = await repositoryFixture();
    await replace(root, ".github/workflows/ci.yml", "permissions:\n  contents: read", "# permissions intentionally removed");
    await replace(root, ".github/workflows/security.yml", "    permissions:\n      contents: read", "    permissions: write-all");
    await replace(root, ".github/workflows/ci.yml", "    runs-on: ubuntu-latest\n", "    uses: actions/example-workflow@main\n");
    const codes = auditRepositoryDelivery(root).map((finding) => finding.code);
    expect(codes).toEqual(expect.arrayContaining(["WORKFLOW_PERMISSIONS", "ACTION_PIN"]));
  });

  it("audits unsafe workflows with the .yaml extension", async () => {
    const root = await repositoryFixture();
    await writeFile(
      join(root, ".github/workflows/unsafe.yaml"),
      [
        "name: Unsafe extension fixture",
        "on:",
        "  pull_request_target:",
        "permissions: write-all",
        "jobs:",
        "  bypass:",
        "    uses: actions/example-workflow@main",
        "",
      ].join("\n"),
    );
    const codes = auditRepositoryDelivery(root).map((finding) => finding.code);
    expect(codes).toEqual(expect.arrayContaining(["FORK_SAFETY", "WORKFLOW_PERMISSIONS", "ACTION_PIN"]));
  });

  it("detects cache, lockfile, artifact, required-name, and duplicate-owner drift", async () => {
    const root = await repositoryFixture();
    await replace(root, ".github/actions/verify/action.yml", "cache: pnpm", "cache: npm");
    await replace(root, ".github/actions/verify/action.yml", "cache-dependency-path: pnpm-lock.yaml", "cache-dependency-path: package.json");
    await replace(root, ".github/actions/verify/action.yml", "pnpm install --frozen-lockfile", "pnpm install");
    await replace(root, ".github/actions/verify/action.yml", "run: pnpm verify", "run: pnpm verify\n\n    - shell: bash\n      run: pnpm lint");
    await replace(root, ".github/workflows/pages.yml", "needs: build-and-verify", "needs: []");
    await replace(root, ".github/workflows/ci.yml", "verify:", "changed-name:");
    const codes = auditRepositoryDelivery(root).map((finding) => finding.code);
    expect(codes).toEqual(expect.arrayContaining(["PNPM_CACHE", "PNPM_CACHE_KEY", "FROZEN_INSTALL", "VERIFY_DUPLICATE", "PAGES_ARTIFACT", "REQUIRED_CHECK_NAME"]));
  });

  it("detects a missing Pages artifact producer", async () => {
    const root = await repositoryFixture();
    await replace(root, ".github/actions/verify/action.yml", "actions/upload-pages-artifact@", "actions/upload-artifact@");
    expect(auditRepositoryDelivery(root).map((finding) => finding.code)).toContain("PAGES_ARTIFACT");
  });

  it("rejects additional Pages deploy write scopes", async () => {
    const root = await repositoryFixture();
    await replace(root, ".github/workflows/pages.yml", "      pages: write", "      pages: write\n      contents: write");
    expect(auditRepositoryDelivery(root).map((finding) => finding.code)).toContain("PAGES_PERMISSIONS");
  });
});
