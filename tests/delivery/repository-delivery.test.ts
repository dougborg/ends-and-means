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
    await replace(root, ".github/workflows/security.yml", "permissions: {}", "permissions: write-all");
    await replace(root, ".github/workflows/security.yml", "@3d3c42e5aac5ba805825da76410c181273ba90b1", "@main");
    await replace(root, ".github/actions/verify/action.yml", "persist-credentials: false", "persist-credentials: true");
    const codes = auditRepositoryDelivery(root).map((finding) => finding.code);
    expect(codes).toEqual(expect.arrayContaining(["FORK_SAFETY", "WORKFLOW_PERMISSIONS", "ACTION_PIN", "CHECKOUT_CREDENTIALS"]));
  });

  it("detects cache, lockfile, artifact, required-name, and duplicate-owner drift", async () => {
    const root = await repositoryFixture();
    await replace(root, ".github/actions/verify/action.yml", "cache: pnpm", "cache: npm");
    await replace(root, ".github/actions/verify/action.yml", "pnpm install --frozen-lockfile", "pnpm install");
    await replace(root, ".github/actions/verify/action.yml", "run: pnpm verify", "run: pnpm verify\n\n    - shell: bash\n      run: pnpm lint");
    await replace(root, ".github/workflows/pages.yml", "needs: build-and-verify", "needs: []");
    await replace(root, ".github/workflows/ci.yml", "verify:", "changed-name:");
    const codes = auditRepositoryDelivery(root).map((finding) => finding.code);
    expect(codes).toEqual(expect.arrayContaining(["PNPM_CACHE", "FROZEN_INSTALL", "VERIFY_DUPLICATE", "PAGES_ARTIFACT", "REQUIRED_CHECK_NAME"]));
  });
});
