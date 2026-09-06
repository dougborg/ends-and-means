import { execFileSync } from "node:child_process";
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  createGitRunner,
  localGitEvidence,
} from "../../scripts/delivery-local-git.ts";

const roots: string[] = [];

function git(cwd: string, ...args: string[]) {
  return execFileSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function repository() {
  const root = mkdtempSync(join(tmpdir(), "ends-means-local-git-"));
  roots.push(root);
  const origin = join(root, "origin.git");
  const coordinator = join(root, "coordinator");
  mkdirSync(coordinator);
  execFileSync("git", ["init", "--bare", origin]);
  git(coordinator, "init", "-b", "main");
  git(coordinator, "config", "user.email", "test@example.test");
  git(coordinator, "config", "user.name", "Delivery Test");
  writeFileSync(join(coordinator, "base.txt"), "base\n");
  git(coordinator, "add", "base.txt");
  git(coordinator, "commit", "-m", "base");
  git(coordinator, "remote", "add", "origin", origin);
  git(coordinator, "push", "-u", "origin", "main");
  execFileSync("git", [
    "--git-dir",
    origin,
    "symbolic-ref",
    "HEAD",
    "refs/heads/main",
  ]);
  return { root, origin, coordinator };
}

function addWorktree(fixture: ReturnType<typeof repository>, name: string) {
  const path = join(fixture.root, name);
  const branch = `feature/${name}`;
  git(fixture.coordinator, "worktree", "add", "-b", branch, path);
  writeFileSync(join(path, `${name}.txt`), `${name}\n`);
  git(path, "add", `${name}.txt`);
  git(path, "commit", "-m", name);
  return { path, branch, head: git(path, "rev-parse", "HEAD") };
}

function inspect(
  fixture: ReturnType<typeof repository>,
  worktree: ReturnType<typeof addWorktree>,
  assignedPath = worktree.path,
) {
  return localGitEvidence(
    {
      issue: 201,
      owner: "private-owner",
      branch: worktree.branch,
      worktree: assignedPath,
    },
    {
      coordinatorWorktree: fixture.coordinator,
      expectedRemote: () => true,
    },
  );
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true });
});

describe("registered worktree integration", () => {
  it("accepts a registered linear worktree", () => {
    const fixture = repository();
    const worktree = addWorktree(fixture, "registered");
    expect(inspect(fixture, worktree)).toEqual({
      baseCurrent: true,
      historyLinear: true,
    });
  });

  it("rejects a standalone clone with the same origin", () => {
    const fixture = repository();
    const clone = join(fixture.root, "standalone");
    execFileSync("git", ["clone", fixture.origin, clone]);
    git(clone, "config", "user.email", "test@example.test");
    git(clone, "config", "user.name", "Delivery Test");
    git(clone, "checkout", "-b", "feature/standalone");
    const worktree = {
      path: clone,
      branch: "feature/standalone",
      head: git(clone, "rev-parse", "HEAD"),
    };
    expect(inspect(fixture, worktree)).toEqual({
      failure: "WORKTREE_UNAVAILABLE",
    });
  });

  it("rejects a stale registered-worktree record whose path disappeared", () => {
    const fixture = repository();
    const worktree = addWorktree(fixture, "stale");
    rmSync(worktree.path, { recursive: true });
    expect(inspect(fixture, worktree)).toEqual({
      failure: "WORKTREE_UNAVAILABLE",
    });
  });

  it("accepts a symlink spelling of the exact registered path", () => {
    const fixture = repository();
    const worktree = addWorktree(fixture, "linked");
    const link = join(fixture.root, "worktree-link");
    symlinkSync(worktree.path, link);
    expect(inspect(fixture, worktree, link)).toEqual({
      baseCurrent: true,
      historyLinear: true,
    });
  });

  it("selects the assigned entry among multiple registered worktrees", () => {
    const fixture = repository();
    addWorktree(fixture, "first");
    const second = addWorktree(fixture, "second");
    expect(inspect(fixture, second)).toEqual({
      baseCurrent: true,
      historyLinear: true,
    });
  });
});

describe("bounded noninteractive Git execution", () => {
  it("disables credential prompts for subprocesses", () => {
    const directory = mkdtempSync(join(tmpdir(), "ends-means-fake-git-"));
    roots.push(directory);
    const executable = join(directory, "git");
    writeFileSync(
      executable,
      '#!/bin/sh\nprintf \'%s|%s|%s|%s|%s\' "$GIT_TERMINAL_PROMPT" "$GCM_INTERACTIVE" "$SSH_ASKPASS_REQUIRE" "$GIT_ASKPASS" "$GIT_SSH_COMMAND"\n',
    );
    chmodSync(executable, 0o755);
    const runner = createGitRunner(1_000, { PATH: directory });
    expect(runner(directory, ["status"])).toBe(
      "0|Never|never|/usr/bin/false|ssh -oBatchMode=yes",
    );
  });

  it("terminates a Git subprocess that exceeds its bound", () => {
    const directory = mkdtempSync(join(tmpdir(), "ends-means-slow-git-"));
    roots.push(directory);
    const executable = join(directory, "git");
    writeFileSync(executable, "#!/bin/sh\nsleep 1\n");
    chmodSync(executable, 0o755);
    const runner = createGitRunner(20, { PATH: `${directory}:/bin` });
    expect(() => runner(directory, ["status"])).toThrow();
  });
});
