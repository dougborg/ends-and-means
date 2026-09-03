#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function slug(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function plain(value: string) {
  return value.replace(/\*\*/g, '').replace(/\*/g, '').replace(/▶\s*/g, '').trim();
}

export function parseMatrix(markdown: string) {
  const systemBlock = markdown.match(/\*\*The eight systems\*\*([\s\S]*?)\n\*\*Verdicts\*\*/)?.[1];
  if (!systemBlock) throw new Error('Could not find system definitions');
  const systems = [...systemBlock.matchAll(/^\d+\. \*\*(.+?)\*\* — (.+)$/gm)].map((m, index) => ({
    id: slug(m[1]!), order: index + 1, name: m[1]!, description: m[2]!
  }));
  if (systems.length !== 8) throw new Error(`Expected 8 systems; found ${systems.length}`);
  const tableNames = ['Laissez-faire', 'Social democracy', 'Market socialism', 'Central planning', 'Social anarchism', 'State capitalism', 'Anarcho-capitalism', 'Parecon'];

  const headings = [...markdown.matchAll(/^## Crux (\d+) — (.+)$/gm)];
  const cruxes: any[] = [];
  const cells: any[] = [];
  for (let i = 0; i < headings.length; i++) {
    const match = headings[i]!;
    const end = headings[i + 1]?.index ?? markdown.length;
    const body = markdown.slice(match.index + match[0].length, end);
    const number = Number(match[1]);
    const title = match[2]!.trim();
    const id = `crux-${String(number).padStart(2, '0')}-${slug(title)}`;
    const prompt = body.match(/^\n+\*(.+?)\*/)?.[1] ?? null;
    const verdict = body.match(/^\*\*Verdict:\*\*\s*(.+)$/m)?.[1] ?? null;
    const allRows = [...body.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/gm)];
    if (!allRows[0]) throw new Error(`Crux ${number}: table is missing`);
    const headerRow = allRows[0]!;
    const columnLabels = { system: headerRow[1]!.trim(), mechanism: headerRow[2]!.trim(), breaks: headerRow[3]!.trim() };
    cruxes.push({ id, number, title, prompt, verdictText: verdict, columnLabels });

    const rows = allRows.slice(2);
    if (rows.length !== systems.length) throw new Error(`Crux ${number}: expected 8 rows; found ${rows.length}`);
    for (const [rowIndex, row] of rows.entries()) {
      const systemName = row[1]!.trim();
      if (systemName !== tableNames[rowIndex]) throw new Error(`Crux ${number}: expected ${tableNames[rowIndex]} row; found ${systemName}`);
      const system = systems[rowIndex]!;
      cells.push({
        id: `${id}--${system.id}`,
        cruxId: id,
        systemId: system.id,
        mechanism: row[2]!.trim(),
        breaks: row[3]!.trim()
      });
    }
  }
  if (cruxes.length !== 14) throw new Error(`Expected 14 cruxes; found ${cruxes.length}`);
  if (cells.length !== 112) throw new Error(`Expected 112 cells; found ${cells.length}`);
  return { systems, cruxes, cells };
}

const CHECKED = ['albert', 'carson', 'kinna', 'bookchin'];
const CONFIRMED = ['schweickart', 'ellerman', 'whyte', 'phillips', 'rozworski', 'cockshott', 'cottrell', 'nove', 'kornai', 'coase', 'proudhon', 'kropotkin', 'bakunin', 'rocker'];

function sourceTier(raw: string) {
  const normalized = plain(raw).toLowerCase();
  if (CHECKED.some(name => normalized.includes(name))) return 'publisher-or-library-checked';
  if (CONFIRMED.some(name => normalized.includes(name))) return 'previously-confirmed';
  return 'not-rechecked';
}

export function parseReadingList(markdown: string) {
  const part = markdown.split(/^## Part 2 — Reading List$/m)[1];
  if (!part) throw new Error('Could not find reading list');
  const beforeCompressed = part.split(/^### A compressed path$/m)[0]!;
  let section = null;
  const candidates: any[] = [];
  const seen = new Map<string, number>();
  for (const line of beforeCompressed.split('\n')) {
    const heading = line.match(/^### (.+)$/);
    if (heading) { section = heading[1]; continue; }
    const item = line.match(/^- (.+)$/);
    if (!item || !section) continue;
    const raw = item[1]!.trim();
    const cleaned = plain(raw);
    const lead = cleaned.split(/\.\s/)[0]!;
    const year = lead.match(/\((\d{4}(?:[–-]\d{2})?)\)/)?.[1] ?? null;
    const author = lead.split(/\s+—\s+/)[0]!.trim();
    const title = lead.match(/—\s+(.+?)(?:\s+\(\d{4})?$/)?.[1]?.replace(/[“”"]/g, '') ?? lead;
    let id = `source-${slug(author)}-${year ?? 'undated'}-${slug(title).slice(0, 64)}`;
    const count = (seen.get(id) ?? 0) + 1;
    seen.set(id, count);
    if (count > 1) id += `-${count}`;
    candidates.push({ id, section: slug(section), sectionTitle: section, recommended: raw.startsWith('**▶'), author, title, year, verificationTier: sourceTier(raw), rawMarkdown: raw });
  }
  return candidates;
}

function referenceHints(cells: any[]) {
  return cells.flatMap(cell => {
    const text = `${cell.mechanism} ${cell.breaks}`;
    const hints = [...text.matchAll(/\(([^()]*(?:19|20)\d{2}[^()]*)\)|\(([A-Z][^();]{2,40})\)/g)].map(m => m[1] ?? m[2]);
    return hints.map(hint => ({ cellId: cell.id, hint }));
  });
}

function validateOverrides(overrides: any, ids: { cruxes: Set<string>; cells: Set<string>; sources: Set<string> }) {
  if (overrides.version !== 1) throw new Error('Override version must be 1');
  for (const id of Object.keys(overrides.verdicts ?? {})) if (!ids.cruxes.has(id)) throw new Error(`Unknown verdict override: ${id}`);
  for (const [id, sourceIds] of Object.entries(overrides.cellSources ?? {}) as Array<[string, string[]]>) {
    if (!ids.cells.has(id)) throw new Error(`Unknown cell source override: ${id}`);
    for (const sourceId of sourceIds) if (!ids.sources.has(sourceId)) throw new Error(`Unknown source override: ${sourceId}`);
  }
  for (const id of Object.keys(overrides.sourceSplits ?? {})) if (!ids.sources.has(id)) throw new Error(`Unknown source split override: ${id}`);
}

export function buildImport(matrixMarkdown: string, notesMarkdown: string, overrides: any = { version: 1, verdicts: {}, cellSources: {}, sourceSplits: {} }) {
  const matrix = parseMatrix(matrixMarkdown);
  const sources = parseReadingList(notesMarkdown);
  validateOverrides(overrides, { cruxes: new Set(matrix.cruxes.map(x => x.id)), cells: new Set(matrix.cells.map(x => x.id)), sources: new Set(sources.map(x => x.id)) });
  const content = {
    schemaVersion: 1,
    systems: matrix.systems,
    cruxes: matrix.cruxes.map(c => ({ ...c, verdict: overrides.verdicts?.[c.id] ?? null })),
    cells: matrix.cells.map(c => ({ ...c, sourceIds: overrides.cellSources?.[c.id] ?? [] })),
    sourceCandidates: sources
  };
  const splitCandidates = sources.filter(s => /\sand\s\*\*|\)\*\* and \*\*|Pair with|co-wrote|&/.test(s.rawMarkdown));
  const report = {
    schemaVersion: 1,
    counts: { systems: content.systems.length, cruxes: content.cruxes.length, cells: content.cells.length, sourceCandidates: sources.length },
    unresolved: {
      structuralGaps: content.cruxes.filter(c => !c.prompt || !c.verdictText).map(c => ({
        cruxId: c.id,
        missing: [!c.prompt && 'prompt', !c.verdictText && 'verdictText'].filter(Boolean),
        reason: 'The source document omits this field; the importer does not synthesize it.'
      })),
      verdicts: content.cruxes.filter(c => !c.verdict).map(c => ({ cruxId: c.id, verdictText: c.verdictText, reason: c.verdictText ? 'Narrative verdict requires editorial classification.' : 'Source document provides no narrative verdict.' })),
      cellSources: content.cells.filter(c => c.sourceIds.length === 0).map(c => ({ cellId: c.id, reason: 'No citation mapping has been reviewed.' })),
      referenceHints: referenceHints(content.cells),
      sourceSplits: splitCandidates.filter(s => !overrides.sourceSplits?.[s.id]).map(s => ({ sourceId: s.id, rawMarkdown: s.rawMarkdown, reason: 'Bullet may describe multiple works or authors; review before splitting.' }))
    }
  };
  return { content, report };
}

async function writeJson(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

export async function run(root: string = ROOT) {
  const [matrix, notes, overridesText] = await Promise.all([
    readFile(resolve(root, 'docs/system-comparison-by-crux-v2.md'), 'utf8'),
    readFile(resolve(root, 'docs/political-economy-notes.md'), 'utf8'),
    readFile(resolve(root, 'content/import-overrides/overrides.json'), 'utf8')
  ]);
  const result = buildImport(matrix, notes, JSON.parse(overridesText));
  await writeJson(resolve(root, 'generated/content/import.json'), result.content);
  await writeJson(resolve(root, 'generated/reports/import-report.json'), result.report);
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { report } = await run();
  process.stdout.write(`Imported ${report.counts.systems} systems, ${report.counts.cruxes} cruxes, ${report.counts.cells} cells, and ${report.counts.sourceCandidates} source candidates.\n`);
}
