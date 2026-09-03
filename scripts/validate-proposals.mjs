#!/usr/bin/env node

import { readdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const proposalsRoot = path.join(root, "proposals");
const validator = path.join(root, ".agents/skills/research-content-proposals/scripts/validate-proposal.mjs");

export async function proposalDirectories(directory = proposalsRoot, readDirectory = readdir) {
  const found = [];
  let types = [];
  try {
    types = await readDirectory(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return found;
    throw error;
  }
  for (const type of types.filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const entries = await readDirectory(path.join(directory, type.name), { withFileTypes: true });
    for (const entry of entries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
      found.push(path.join(directory, type.name, entry.name));
    }
  }
  return found;
}

export function validateDirectory(directory, spawn = spawnSync) {
  const result = spawn(process.execPath, [validator, directory], { cwd: root, encoding: "utf8" });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) {
    console.error(`Could not start proposal validator: ${result.error.message}`);
    return false;
  }
  return result.status === 0;
}

export async function main() {
  const directories = await proposalDirectories();
  for (const directory of directories) {
    if (!validateDirectory(directory)) process.exitCode = 1;
  }
  if (!directories.length) console.log("No staged proposals found.");
  else if (!process.exitCode) console.log(`Validated ${directories.length} staged proposal(s).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
