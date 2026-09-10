import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
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
const sentinel = "private-pr-secret-sentinel";
function probe(options: {
  project?: unknown;
  url?: string;
  failure?: "command" | "schema" | "unavailable";
}) {
  const directory = mkdtempSync(join(tmpdir(), "delivery-review-regression-"));
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
      nextReview: "Explicit later selection",
      pullRequests: options.url ? [options.url] : [],
    });
    const path = join(directory, "state.json");
    const calls = join(directory, "calls.jsonl");
    writeFileSync(path, JSON.stringify(state));
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
else if (command === "project" && action === "item-list") value = ${JSON.stringify(options.project ?? { items: [], totalCount: 0 })};
else if (command === "label") value = ${JSON.stringify(requiredTrackLabels.map((name) => ({ name })))};
else if (command === "api") value = [[{number:99,title:"Retained",body:"Preserved scope",state:"open",updated_at:${JSON.stringify(now.toISOString())},labels:[]}]];
else if (command === "pr") {
  const failure = ${JSON.stringify(options.failure)};
  if (failure === "command") { console.error("HTTP 404 ${sentinel}"); process.exit(1); }
  if (failure === "unavailable") { console.error("error connecting ${sentinel}"); process.exit(1); }
  value = {state:${JSON.stringify(sentinel)}};
} else { console.error("Unexpected command"); process.exit(1); }
console.log(JSON.stringify(value));
`,
    );
    chmodSync(executable, 0o755);
    const result = spawnSync(
      process.execPath,
      ["--import", "tsx", script, "--live-project", "--private-state", path],
      { encoding: "utf8", env: { ...process.env, PATH: directory } },
    );
    return {
      ...result,
      calls: existsSync(calls) ? readFileSync(calls, "utf8") : "",
    };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

describe("complete bounded Project reads", () => {
  it.each([
    { items: [], totalCount: 201 },
    { items: [] },
    { items: [], totalCount: -1 },
    {
      items: Array.from({ length: 200 }, (_, i) => ({
        content: { number: i + 1, title: "Issue", type: "Issue" },
        status: "Backlog",
      })),
      totalCount: 201,
    },
  ])(
    "rejects missing, invalid, or incomplete totalCount before a clean report",
    (project) => {
      const result = probe({ project });
      expect(result.status).toBe(2);
      expect(result.stderr).toContain("Project state: INVALID");
      expect(result.stdout).not.toContain("Project #7: clean");
      expect(result.calls).not.toContain('"api"');
    },
  );
  it("accepts an explicitly complete zero-card Project and retains the private-only issue", () => {
    const result = probe({ project: { items: [], totalCount: 0 } });
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("#99: parked");
  });
});

describe("private PR identity and diagnostic boundaries", () => {
  it.each([
    `https://example.com/${sentinel}`,
    `https://github.com/dougborg/ends-and-means/pull/199?secret=${sentinel}`,
    `https://${sentinel}@github.com/dougborg/ends-and-means/pull/199`,
    `https://github.com/another/${sentinel}/pull/199`,
    `https://github.com/dougborg/ends-and-means/pull/${sentinel}`,
  ])(
    "rejects noncanonical private PR identity without emitting or querying it",
    (url) => {
      const result = probe({ url });
      expect(result.status).toBe(2);
      expect(result.stderr).toContain("Project state: INVALID");
      expect(result.stdout + result.stderr + result.calls).not.toContain(
        sentinel,
      );
      expect(result.calls).toBe("");
    },
  );
  it.each(["command", "schema", "unavailable"] as const)(
    "redacts returned private values on %s failure",
    (failure) => {
      const result = probe({
        url: "https://github.com/dougborg/ends-and-means/pull/199",
        failure,
      });
      expect(result.status).toBe(2);
      expect(result.stdout + result.stderr).not.toContain(sentinel);
      expect(result.stderr).toContain("Pull request #199");
      expect(result.calls).toContain(
        '["pr","view","199","--repo","dougborg/ends-and-means"',
      );
      expect(result.calls).not.toContain("https://github.com");
    },
  );
});
