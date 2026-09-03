#!/usr/bin/env node

import { readdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const proposalsRoot = path.join(root, "proposals");
const validator = path.join(root, ".agents/skills/research-content-proposals/scripts/validate-proposal.mjs");

async function proposalDirectories() {
  const found = [];
  let types = [];
  try { types = await readdir(proposalsRoot, { withFileTypes: true }); } catch { return found; }
  for (const type of types.filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const entries = await readdir(path.join(proposalsRoot, type.name), { withFileTypes: true });
    for (const entry of entries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
      found.push(path.join(proposalsRoot, type.name, entry.name));
    }
  }
  return found;
}

const directories = await proposalDirectories();
for (const directory of directories) {
  const result = spawnSync(process.execPath, [validator, directory], { cwd: root, encoding: "utf8" });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) process.exitCode = 1;
}
if (!directories.length) console.log("No staged proposals found.");
else if (!process.exitCode) console.log(`Validated ${directories.length} staged proposal(s).`);
