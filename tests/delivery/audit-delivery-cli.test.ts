import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const script = fileURLToPath(
  new URL("../../scripts/audit-delivery.ts", import.meta.url),
);
const malformed = fileURLToPath(
  new URL("../fixtures/delivery/project-malformed.json", import.meta.url),
);
const malformedPrivateState = fileURLToPath(
  new URL("../fixtures/delivery/private-state-malformed.json", import.meta.url),
);
const deliveryFixtures = fileURLToPath(
  new URL("../fixtures/delivery/", import.meta.url),
);

function run(args: string[], path = process.env.PATH) {
  return spawnSync(process.execPath, ["--import", "tsx", script, ...args], {
    encoding: "utf8",
    env: { ...process.env, PATH: path },
  });
}

function freshPrivateState() {
  const directory = mkdtempSync(join(tmpdir(), "ends-means-private-state-"));
  const path = join(directory, "delivery-state.json");
  const now = Date.now();
  writeFileSync(
    path,
    JSON.stringify({
      version: 2,
      coordination: {
        mode: "running",
        changedAt: new Date(now - 60_000).toISOString(),
        instructionEvidence: true,
        instructionRef: "Example instruction",
        finishStarted: false,
      },
      researchBuffer: [],
      retained: [],
      repository: "dougborg/ends-and-means",
      generatedAt: new Date(now - 60_000).toISOString(),
      expiresAt: new Date(now + 23 * 60 * 60 * 1000).toISOString(),
      assignments: [],
    }),
  );
  return path;
}

describe("delivery audit result classes", () => {
  it("reports repository-only Project state as unavailable while succeeding", () => {
    const result = run(["--repository-only"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Project state: UNAVAILABLE");
    expect(result.stdout).toContain("Backlog integrity: UNAVAILABLE");
  });

  it("distinguishes invalid snapshot schema", () => {
    const result = run(["--project-snapshot", malformed]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: INVALID");
  });

  it("distinguishes unavailable API credentials or executable", () => {
    const result = run(
      ["--live-project", "--private-state", freshPrivateState()],
      "",
    );
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
    const result = run(
      ["--live-project", "--private-state", freshPrivateState()],
      bin,
    );
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: ERROR");
    expect(result.stderr).toContain("HTTP 404");
  });
});

describe("delivery audit complete API responses", () => {
  function runWithIssueResponse(response: string) {
    const bin = mkdtempSync(join(tmpdir(), "ends-means-gh-response-"));
    const privateState = freshPrivateState();
    try {
      const responsePath = join(bin, "issues.json");
      writeFileSync(responsePath, response);
      const executable = join(bin, "gh");
      writeFileSync(
        executable,
        `#!${process.execPath}
const { readFileSync } = require("node:fs");
const [command, action] = process.argv.slice(2);
if (command === "api") process.stdout.write(readFileSync(${JSON.stringify(responsePath)}));
else if (command === "project" && action === "view") console.log(JSON.stringify({number:7,title:"Delivery",public:false}));
else if (command === "project" && action === "item-list") console.log(JSON.stringify({items:[],totalCount:0}));
else if (command === "label" && action === "list") console.log("[]");
else { console.error("Unexpected command"); process.exitCode = 1; }
`,
      );
      chmodSync(executable, 0o755);
      return run(["--live-project", "--private-state", privateState], bin);
    } finally {
      rmSync(bin, { recursive: true, force: true });
      rmSync(dirname(privateState), { recursive: true, force: true });
    }
  }

  const issue = (number: number, body: string) => ({
    number,
    title: `Issue ${number}`,
    body,
    state: "open",
    labels: [],
  });
  const firstPage = () =>
    Array.from({ length: 20 }, (_, index) =>
      issue(index + 1, "Research context. ".repeat(3300)),
    );

  it("validates all pages beyond 1 MiB and retains a final-record finding", () => {
    const response = JSON.stringify([
      firstPage(),
      [issue(21, "\u001b[31mfinal-record sentinel")],
    ]);
    expect(Buffer.byteLength(response)).toBeGreaterThan(1024 * 1024);
    const result = runWithIssueResponse(response);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("BACKLOG_TERMINAL_CONTROL: #21");
    expect(result.stderr).not.toContain("ENOBUFS");
    expect(result.stdout).not.toContain("Project #7: clean");
  });

  it("counts every record in a complete large response", () => {
    const result = runWithIssueResponse(
      JSON.stringify([firstPage(), [issue(21, "Final issue")]]),
    );
    // The deliberately incorrect Project identity and missing labels still fail policy.
    expect(result.status).toBe(1);
    expect(result.stdout).toContain(
      "Backlog integrity: clean (21 open issues checked)",
    );
  });

  it("rejects malformed JSON after the former buffer boundary", () => {
    const result = runWithIssueResponse(
      `${JSON.stringify([firstPage()])}truncated`,
    );
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: INVALID");
    expect(result.stdout).not.toContain("clean");
  });

  it("fails closed when output exceeds the explicit 16 MiB bound", () => {
    const result = runWithIssueResponse(" ".repeat(17 * 1024 * 1024));
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("exceeded the 16 MiB output limit");
    expect(result.stdout).not.toContain("clean");
  });
});

describe("delivery audit input validation", () => {
  it("reports an omitted snapshot path as specific invalid input", () => {
    const result = run(["--project-snapshot"]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain(
      "Project state: INVALID (--project-snapshot requires exactly one path.)",
    );
  });

  it("requires an explicit private state path for live mode", () => {
    const result = run(["--live-project"]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain(
      "Project state: INVALID (--live-project requires --private-state <path>.)",
    );
  });

  it("reports an unreadable private state source as unavailable", () => {
    const result = run([
      "--live-project",
      "--private-state",
      "/missing/private-delivery-state.json",
    ]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: UNAVAILABLE");
    expect(result.stderr).toContain("private delivery state");
  });

  it("reports a directory private-state path as unavailable", () => {
    const result = run(["--live-project", "--private-state", deliveryFixtures]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: UNAVAILABLE");
  });

  it("reports readable malformed private state as invalid", () => {
    const result = run([
      "--live-project",
      "--private-state",
      malformedPrivateState,
    ]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Project state: INVALID");
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
    expect(result.stderr).toContain(
      "Project state: INVALID (Select exactly one project-state mode.)",
    );
  });

  it("rejects unknown flags", () => {
    const result = run(["--repository-only", "--unexpected"]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain(
      "Project state: INVALID (Unknown option: --unexpected.)",
    );
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
