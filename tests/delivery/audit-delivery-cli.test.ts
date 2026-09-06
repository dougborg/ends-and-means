import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const script = fileURLToPath(
  new URL("../../scripts/audit-delivery.ts", import.meta.url),
);
const malformed = fileURLToPath(
  new URL("../fixtures/delivery/project-malformed.json", import.meta.url),
);

function run(args: string[], path = process.env.PATH) {
  return spawnSync(process.execPath, ["--import", "tsx", script, ...args], {
    encoding: "utf8",
    env: { ...process.env, PATH: path },
  });
}

describe("delivery audit result classes", () => {
  it("distinguishes invalid snapshot schema", () => {
    const result = run(["--project-snapshot", malformed]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: INVALID");
  });

  it("distinguishes unavailable API credentials or executable", () => {
    const result = run(["--live-project"], "");
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: UNAVAILABLE");
  });

  it("reports actionable gh failures as errors rather than unavailable API", () => {
    const bin = mkdtempSync(join(tmpdir(), "ends-means-gh-"));
    const executable = join(bin, "gh");
    writeFileSync(
      executable,
      "#!/bin/sh\necho 'gh: Not Found (HTTP 404)' >&2\nexit 1\n",
    );
    chmodSync(executable, 0o755);
    const result = run(["--live-project"], bin);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: ERROR");
    expect(result.stderr).toContain("HTTP 404");
  });

  it("reports an omitted snapshot path as specific invalid input", () => {
    const result = run(["--project-snapshot"]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain(
      "Project state: INVALID (--project-snapshot requires exactly one path.)",
    );
  });

  it("does not consume another flag as a snapshot path", () => {
    const result = run(["--project-snapshot", "--repository-only"]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: INVALID");
  });

  it.each([
    ["--repository-only", "--live-project"],
    ["--live-project", "--repository-only"],
  ])("rejects conflicting modes %s %s", (...args) => {
    const result = run(args);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: INVALID (Select exactly one project-state mode.)");
  });

  it("rejects unknown flags", () => {
    const result = run(["--repository-only", "--unexpected"]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: INVALID (Unknown option: --unexpected.)");
  });

  it("distinguishes unexpected input errors", () => {
    const result = run([
      "--project-snapshot",
      "/missing/delivery-snapshot.json",
    ]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: ERROR");
  });
});
