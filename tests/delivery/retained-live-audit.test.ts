import { spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { requiredTrackLabels } from "../../scripts/delivery-state.ts";

const script = fileURLToPath(
  new URL("../../scripts/audit-delivery.ts", import.meta.url),
);
function run(privatePath: string, bin: string) {
  return spawnSync(
    process.execPath,
    [
      "--import",
      "tsx",
      script,
      "--live-project",
      "--private-state",
      privatePath,
    ],
    { encoding: "utf8", env: { ...process.env, PATH: bin } },
  );
}

describe("retained live inventory and privacy", () => {
  it("reuses fetched issue identity and reports parked PRs outside Project without Git-base validation", () => {
    const directory = mkdtempSync(join(tmpdir(), "delivery-retained-"));
    try {
      const now = new Date();
      const state = JSON.parse(
        readFileSync(
          new URL(
            "../fixtures/delivery/private-state.example.json",
            import.meta.url,
          ),
          "utf8",
        ),
      );
      state.generatedAt = now.toISOString();
      state.expiresAt = new Date(now.getTime() + 3600000).toISOString();
      state.assignments = [];
      Object.assign(state.retained[0], {
        issue: 99,
        disposition: "parked",
        nextReviewCondition: true,
        nextReview: "private-next-review-sentinel",
        decisionRef: "private-decision-sentinel",
        pullRequests: ["https://github.com/dougborg/ends-and-means/pull/199"],
      });
      const privatePath = join(directory, "state.json");
      writeFileSync(privatePath, JSON.stringify(state));
      const calls = join(directory, "calls.jsonl");
      const executable = join(directory, "gh");
      writeFileSync(
        executable,
        `#!${process.execPath}
const { appendFileSync } = require("node:fs");
const args = process.argv.slice(2);
appendFileSync(${JSON.stringify(calls)}, JSON.stringify(args) + "\\n");
const [command, action] = args;
let value;
if (command === "project" && action === "view") value = {number:7,title:"Ends and Means — Delivery",public:false};
else if (command === "project" && action === "item-list") value = {items:[]};
else if (command === "label") value = ${JSON.stringify(requiredTrackLabels.map((name) => ({ name })))};
else if (command === "api" && args.includes("--paginate")) value = [[{number:99,title:"Retained work",body:"Preserved scope",state:"open",updated_at:${JSON.stringify(now.toISOString())},labels:[]}]];
else if (command === "pr") value = {state:"OPEN",baseRefName:"old-base",headRefName:"preserved/branch",headRefOid:"a".repeat(40),isDraft:false,author:{login:"example"},reviews:[],comments:[]};
else { console.error("Unexpected evidence request"); process.exit(1); }
console.log(JSON.stringify(value));
`,
      );
      chmodSync(executable, 0o755);
      const result = run(privatePath, directory);
      expect(result.status, result.stderr).toBe(0);
      expect(result.stdout).toContain(
        "selected unfinished 0/3; started unmerged 1; unknown start 0; known unfinished 1; parked 1",
      );
      expect(result.stdout).toContain(
        "#99: parked; parked; observed unknown; open PR true",
      );
      expect(result.stdout).toContain("evidence age unknown");
      expect(result.stdout + result.stderr).not.toContain(
        "private-next-review-sentinel",
      );
      expect(result.stdout + result.stderr).not.toContain(
        "private-decision-sentinel",
      );
      const requests = readFileSync(calls, "utf8");
      expect(requests).not.toContain('"issue"');
      expect(requests).not.toContain("compare");
      expect(requests).not.toContain("git/ref");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("does not echo private JSON or schema values on invalid input", () => {
    const directory = mkdtempSync(join(tmpdir(), "delivery-private-error-"));
    try {
      const path = join(directory, "invalid.json");
      for (const value of [
        '{"private-secret-sentinel": broken}',
        JSON.stringify({ version: "private-secret-sentinel" }),
      ]) {
        writeFileSync(path, value);
        const result = run(path, "");
        expect(result.status).toBe(2);
        expect(result.stderr).toContain("Project state: INVALID");
        expect(result.stderr).not.toContain("private-secret-sentinel");
      }
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
