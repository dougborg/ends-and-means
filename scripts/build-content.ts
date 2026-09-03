#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { curateContent, type CurationOverrides, type StagingImport } from "../src/lib/content/index";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

async function writeJson(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

export async function buildContent(root = ROOT) {
  const [staging, overrides] = await Promise.all([
    readJson<StagingImport>(resolve(root, "generated/content/import.json")),
    readJson<CurationOverrides>(resolve(root, "content/import-overrides/overrides.json")),
  ]);
  const result = curateContent(staging, overrides);
  await Promise.all([
    writeJson(resolve(root, "generated/content/graph.json"), result.graph),
    writeJson(resolve(root, "generated/reports/content-report.json"), result.report),
  ]);
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { report } = await buildContent();
  process.stdout.write(
    `Curated ${report.counts.systems} systems, ${report.counts.cruxes} cruxes, `
    + `${report.counts.cells} cells, and ${report.counts.sources} sources. `
    + `Milestone diagnostics: ${report.validation.count}; `
    + `release blockers: ${report.releaseReadiness.validation.count + report.unresolved.missingQuestions.length}.\n`,
  );
  if (
    !report.validation.valid
    || report.unresolved.missingJudgments.length > 0
    || report.unresolved.unexpectedJudgments.length > 0
  ) process.exitCode = 1;
}
