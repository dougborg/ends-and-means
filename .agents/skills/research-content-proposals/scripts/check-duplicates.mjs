#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

async function loadProposal(target) {
  const resolved = path.resolve(target);
  const file = (await stat(resolved)).isDirectory() ? path.join(resolved, "proposal.json") : resolved;
  return { file, proposal: JSON.parse(await readFile(file, "utf8")) };
}

const normalize = (value) => String(value ?? "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
const STOP_WORDS = new Set(["a", "an", "and", "for", "in", "of", "on", "the", "to"]);
const tokens = (value) => new Set(normalize(value).split(" ").filter((token) => token.length > 2 && !STOP_WORDS.has(token)));
function titleSimilarity(left, right) {
  const a = tokens(left); const b = tokens(right);
  if (a.size < 2 || b.size < 2) return 0;
  const overlap = [...a].filter((token) => b.has(token)).length;
  return overlap / new Set([...a, ...b]).size;
}

async function jsonFiles(root) {
  const found = [];
  async function visit(directory) {
    let entries;
    try { entries = await readdir(directory, { withFileTypes: true }); } catch { return; }
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const item = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(item);
      else if (entry.name.endsWith(".json")) found.push(item);
    }
  }
  await visit(root);
  return found;
}

function collectRecords(value, file, records) {
  if (Array.isArray(value)) { value.forEach((item) => collectRecords(item, file, records)); return; }
  if (!value || typeof value !== "object") return;
  if (typeof value.id === "string") records.push({
    id: value.id,
    label: String(value.title ?? value.name ?? value.question ?? value.id),
    aliases: Array.isArray(value.aliases) ? value.aliases.map(String) : [],
    identifiers: Array.isArray(value.identifiers)
      ? value.identifiers.map(String)
      : Object.values(value.identifiers ?? {}).filter((item) => typeof item === "string"),
    file,
  });
  for (const child of Object.values(value)) collectRecords(child, file, records);
}

export async function findDuplicates(target, repositoryRoot = process.cwd()) {
  const { file, proposal } = await loadProposal(target);
  const files = [
    ...(await jsonFiles(path.join(repositoryRoot, "content"))),
    ...(await jsonFiles(path.join(repositoryRoot, "generated", "content"))),
    ...(await jsonFiles(path.join(repositoryRoot, "proposals"))),
  ].filter((candidate) => path.resolve(candidate) !== path.resolve(file));
  const records = [];
  for (const candidate of [...new Set(files)].sort()) {
    try { collectRecords(JSON.parse(await readFile(candidate, "utf8")), path.relative(repositoryRoot, candidate), records); } catch { /* Ignore invalid staging JSON; proposal validation reports its own file. */ }
  }
  const wantedId = normalize(proposal.id);
  const wantedLabel = normalize(proposal.title);
  const wantedAliases = new Set((proposal.aliases ?? []).map(normalize));
  const wantedIdentifiers = new Set((proposal.identifiers ?? []).map(normalize));
  return records
    .map((record) => {
      const recordNames = [record.label, ...record.aliases].map(normalize);
      const proposalNames = [wantedLabel, ...wantedAliases];
      const identifierMatch = record.identifiers.some((identifier) => wantedIdentifiers.has(normalize(identifier)));
      const aliasMatch = recordNames.some((name) => proposalNames.includes(name));
      const similarity = Math.max(...recordNames.flatMap((name) => proposalNames.map((wanted) => titleSimilarity(name, wanted))));
      const match = normalize(record.id) === wantedId ? "id" : identifierMatch ? "identifier" : aliasMatch ? "title-or-alias" : similarity >= 0.6 ? "similar-title" : undefined;
      return match ? { match, id: record.id, label: record.label, file: record.file, ...(match === "similar-title" ? { similarity: Number(similarity.toFixed(2)) } : {}) } : undefined;
    })
    .filter(Boolean)
    .sort((a, b) => `${a.file}:${a.id}`.localeCompare(`${b.file}:${b.id}`));
}

export function unacknowledgedDuplicates(proposal, candidates) {
  const acknowledged = new Set((proposal.duplicateCandidates ?? []).map((item) => item.id));
  return candidates.filter((candidate) => !acknowledged.has(candidate.id));
}

async function main() {
  const target = process.argv[2];
  if (!target) { console.error("Usage: check-duplicates.mjs <proposal-directory-or-json> [repository-root]"); process.exitCode = 2; return; }
  try {
    const root = path.resolve(process.argv[3] ?? process.cwd());
    const { proposal } = await loadProposal(target);
    const candidates = await findDuplicates(target, root);
    const unacknowledged = unacknowledgedDuplicates(proposal, candidates);
    console.log(JSON.stringify({ duplicateCandidates: candidates, unacknowledged, count: candidates.length }, null, 2));
    if (unacknowledged.length) process.exitCode = 1;
  } catch (error) {
    console.error(JSON.stringify({ errors: [error instanceof Error ? error.message : String(error)] }, null, 2));
    process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main();
