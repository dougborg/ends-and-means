import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = process.cwd();
const visualDirectory = join(repositoryRoot, "tests", "visual");

function visualTestSources(directory = visualDirectory): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return visualTestSources(path);
    return entry.name.endsWith(".ts") ? [readFileSync(path, "utf8")] : [];
  });
}

describe("browser readiness policy", () => {
  it("does not mistake third-party network quiescence for application readiness", () => {
    expect(visualTestSources().join("\n")).not.toContain(
      'waitUntil: "networkidle"',
    );
  });

  it("does not hide an unstable browser contract behind retries", () => {
    const config = readFileSync(
      join(repositoryRoot, "playwright.config.ts"),
      "utf8",
    );
    expect(config).toMatch(/\bretries:\s*0\b/);
  });
});
