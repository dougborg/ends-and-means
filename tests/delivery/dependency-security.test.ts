import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import tomlParse from "markdownlint-cli2/parsers/toml";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const patchedVersion = "1.8.0";
const patchedIntegrity =
  "sha512-kCZr2V3ch9i00x8zXRhjUNVcjG9ijES5dDudkXvUVCT5QlJNQWElSJdZqyPemffHoLNUYwOcou0Fy+ojN0uHSQ==";

type Lockfile = {
  overrides?: Record<string, string>;
  packages?: Record<string, { resolution?: { integrity?: string } }>;
  snapshots?: Record<string, { dependencies?: Record<string, string> }>;
};

describe("TOML parser dependency security", () => {
  it("keeps the markdownlint parser on the reviewed patched resolution", () => {
    const workspace = parse(readFileSync("pnpm-workspace.yaml", "utf8")) as {
      overrides?: Record<string, string>;
    };
    const lockfile = parse(readFileSync("pnpm-lock.yaml", "utf8")) as Lockfile;

    expect(workspace.overrides?.["markdownlint-cli2>smol-toml"]).toBe(
      patchedVersion,
    );
    expect(lockfile.overrides?.["markdownlint-cli2>smol-toml"]).toBe(
      patchedVersion,
    );
    expect(Object.keys(lockfile.packages ?? {})).not.toContain(
      "smol-toml@1.7.0",
    );
    expect(
      lockfile.packages?.[`smol-toml@${patchedVersion}`]?.resolution?.integrity,
    ).toBe(patchedIntegrity);
    expect(
      lockfile.snapshots?.["markdownlint-cli2@0.23.2"]?.dependencies?.[
        "smol-toml"
      ],
    ).toBe(patchedVersion);
  });

  it("parses supported TOML through markdownlint-cli2's public adapter", () => {
    expect(
      tomlParse(
        'title = "Supported configuration"\n[tool.markdownlint]\nenabled = true\n',
      ),
    ).toEqual({
      title: "Supported configuration",
      tool: { markdownlint: { enabled: true } },
    });
  });

  it("rejects the advisory payload within a bounded child process", () => {
    const result = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        [
          'import tomlParse from "markdownlint-cli2/parsers/toml";',
          'try { tomlParse("a=[1 #"); process.exitCode = 2; }',
          "catch (error) { process.stdout.write(JSON.stringify({ rejected: true, type: error?.constructor?.name })); }",
        ].join(" "),
      ],
      { encoding: "utf8", killSignal: "SIGKILL", timeout: 1_500 },
    );

    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      rejected: true,
      type: "TomlError",
    });
  });
});
