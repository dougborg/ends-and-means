import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { reviewEvidenceForHead } from "../../scripts/delivery-state.ts";

const script = fileURLToPath(
  new URL("../../scripts/emit-review-marker.ts", import.meta.url),
);
const head = "a".repeat(40);
const trustedAssociations = ["OWNER", "MEMBER", "COLLABORATOR"];

function run(args: string[]) {
  return spawnSync(process.execPath, ["--import", "tsx", script, ...args], {
    encoding: "utf8",
  });
}

function runPackageScript(args: string[]) {
  return spawnSync("pnpm", ["emit:review-marker", ...args], {
    encoding: "utf8",
  });
}

function withOutput(callback: (directory: string, output: string) => void) {
  const directory = mkdtempSync(join(tmpdir(), "ends-means-review-marker-"));
  try {
    callback(directory, join(directory, "marker.txt"));
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
}

describe("review marker emitter", () => {
  it.each([
    {
      kind: "independent-approved",
      body: `Independent adversarial review: APPROVED\nHead: ${head}`,
      evidence: { copilot: "missing", adversarial: true },
    },
    {
      kind: "copilot-unavailable",
      body: `Copilot review: UNAVAILABLE\nHead: ${head}`,
      evidence: { copilot: "unavailable", adversarial: false },
    },
  ])("emits and roundtrips $kind", ({ kind, body, evidence }) => {
    withOutput((_directory, output) => {
      const result = run(["--kind", kind, "--head", head, "--output", output]);
      const emitted = readFileSync(output, "utf8");

      expect(result.status).toBe(0);
      expect(emitted).toBe(body);
      expect(Buffer.from(emitted).at(-1)).not.toBe(0x0a);
      expect(statSync(output).mode & 0o777).toBe(0o600);

      for (const authorAssociation of trustedAssociations) {
        expect(
          reviewEvidenceForHead(
            head,
            [],
            [{ body: emitted, authorAssociation }],
          ),
        ).toEqual(evidence);
      }
    });
  });

  it("works through the documented pnpm package script", () => {
    withOutput((_directory, output) => {
      const result = runPackageScript([
        "--kind",
        "independent-approved",
        "--head",
        head,
        "--output",
        output,
      ]);

      expect(result.status).toBe(0);
      expect(readFileSync(output, "utf8")).toBe(
        `Independent adversarial review: APPROVED\nHead: ${head}`,
      );
    });
  });

  it("distinguishes an exact body from a trailing-newline body", () => {
    const body = `Independent adversarial review: APPROVED\nHead: ${head}`;
    expect(
      reviewEvidenceForHead(head, [], [{ body, authorAssociation: "OWNER" }]),
    ).toEqual({ copilot: "missing", adversarial: true });
    expect(
      reviewEvidenceForHead(
        head,
        [],
        [{ body: `${body}\n`, authorAssociation: "OWNER" }],
      ),
    ).toEqual({ copilot: "missing", adversarial: false });
  });
});

describe("review marker input validation", () => {
  it.each([
    ["unknown kind", ["--kind", "approved", "--head", head]],
    ["short OID", ["--kind", "independent-approved", "--head", "abc123"]],
    [
      "non-hex OID",
      ["--kind", "independent-approved", "--head", "z".repeat(40)],
    ],
    [
      "uppercase OID",
      ["--kind", "independent-approved", "--head", "A".repeat(40)],
    ],
    ["inherited constructor kind", ["--kind", "constructor", "--head", head]],
    ["inherited prototype kind", ["--kind", "__proto__", "--head", head]],
    ["inherited toString kind", ["--kind", "toString", "--head", head]],
    ["missing kind", ["--head", head]],
    ["missing head", ["--kind", "independent-approved"]],
    [
      "injected content",
      ["--kind", "independent-approved\nInjected", "--head", head],
    ],
    [
      "extra argument",
      ["--kind", "independent-approved", "--head", head, "extra"],
    ],
  ])("rejects %s", (_name, prefix) => {
    withOutput((_directory, output) => {
      const result = run([...prefix, "--output", output]);
      expect(result.status).toBe(2);
      expect(result.stderr).toContain("Review marker: INVALID");
      expect(existsSync(output)).toBe(false);
    });
  });

  it("rejects a missing output path", () => {
    const result = run(["--kind", "independent-approved", "--head", head]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Missing required option: --output");
  });

  it("refuses to overwrite an existing output file", () => {
    withOutput((_directory, output) => {
      writeFileSync(output, "existing");
      const result = run([
        "--kind",
        "independent-approved",
        "--head",
        head,
        "--output",
        output,
      ]);
      expect(result.status).toBe(2);
      expect(readFileSync(output, "utf8")).toBe("existing");
    });
  });
});
