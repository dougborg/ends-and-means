import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  findNetworkIdleWaits,
  visualReadinessSources,
} from "../../scripts/browser-readiness-policy";

const repositoryRoot = process.cwd();
const visualDirectory = join(repositoryRoot, "tests", "visual");

describe("browser readiness policy", () => {
  it("does not mistake third-party network quiescence for application readiness", () => {
    const findings = visualReadinessSources(visualDirectory).flatMap((file) =>
      findNetworkIdleWaits(readFileSync(file, "utf8"), file),
    );
    expect(findings).toEqual([]);
  });

  it.each([
    ["double-quoted goto", 'await page.goto("/", { waitUntil: "networkidle" });'],
    ["single-quoted goto", "await page.goto('/', { waitUntil : 'networkidle' });"],
    ["load-state helper", "await browserPage.waitForLoadState( `networkidle` );"],
  ])("rejects the %s mutation", (_name, source) => {
    expect(findNetworkIdleWaits(source)).toHaveLength(1);
  });

  it("follows relative helpers imported from outside the visual directory", () => {
    const fixtureRoot = mkdtempSync(join(tmpdir(), "browser-readiness-"));
    const visual = join(fixtureRoot, "visual");
    mkdirSync(visual);
    writeFileSync(
      join(visual, "imported.spec.ts"),
      'import { open } from "../helper"; void open;',
    );
    writeFileSync(
      join(fixtureRoot, "helper.ts"),
      'export async function open(page: { waitForLoadState(value: string): Promise<void> }) { await page.waitForLoadState("networkidle"); }',
    );
    try {
      const findings = visualReadinessSources(visual).flatMap((file) =>
        findNetworkIdleWaits(readFileSync(file, "utf8"), file),
      );
      expect(findings).toHaveLength(1);
      expect(findings[0]?.method).toBe("waitForLoadState");
    } finally {
      rmSync(fixtureRoot, { recursive: true, force: true });
    }
  });

  it("does not hide an unstable browser contract behind retries", () => {
    const config = readFileSync(
      join(repositoryRoot, "playwright.config.ts"),
      "utf8",
    );
    expect(config).toMatch(/\bretries:\s*0\b/);
  });
});
