import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const script = new URL("../../scripts/audit-delivery.ts", import.meta.url).pathname;
const malformed = new URL("../fixtures/delivery/project-malformed.json", import.meta.url).pathname;

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

  it("distinguishes unexpected input errors", () => {
    const result = run(["--project-snapshot", "/missing/delivery-snapshot.json"]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: ERROR");
  });
});
