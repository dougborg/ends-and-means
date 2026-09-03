import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';
import { buildImport, parseMatrix, parseReadingList } from '../../scripts/import-content';

const root = resolve(import.meta.dirname, '../..');
const matrix = await readFile(resolve(root, 'docs/system-comparison-by-crux-v2.md'), 'utf8');
const notes = await readFile(resolve(root, 'docs/political-economy-notes.md'), 'utf8');

test('imports the complete matrix without altering prose', () => {
  const result = parseMatrix(matrix);
  expect(result.systems).toHaveLength(8); expect(result.cruxes).toHaveLength(14); expect(result.cells).toHaveLength(112);
  expect(result.cruxes[9]!.columnLabels).toEqual({ system: 'System', mechanism: 'Evidence base', breaks: 'What it shows' });
  expect(result.cruxes[9]!.prompt).toBeNull();
  expect(result.cells[0]!.mechanism).toBe('Prices aggregate dispersed knowledge; profit and loss steer resources (Hayek).');
  expect(result.cells[0]!.breaks).toMatch(/^Prices omit externalities/);
  expect(new Set(result.cells.map(cell => cell.id)).size).toBe(112);
});

test('imports reading-list bullets with stable editorial metadata', () => {
  const sources = parseReadingList(notes);
  expect(sources.length).toBeGreaterThan(40);
  expect(new Set(sources.map(source => source.id)).size).toBe(sources.length);
  expect(sources[0]!.recommended).toBe(true);
  expect(sources.find(source => source.author.includes('Michael Albert'))!.verificationTier).toBe('publisher-or-library-checked');
  expect(sources.find(source => source.author.includes('Piketty'))!.verificationTier).toBe('not-rechecked');
});

test('leaves judgment-heavy mappings unresolved by default', () => {
  const { content, report } = buildImport(matrix, notes);
  expect(report.unresolved.verdicts).toHaveLength(14);
  expect(report.unresolved.structuralGaps[0]!.missing).toEqual(['prompt', 'verdictText']);
  expect(report.unresolved.cellSources).toHaveLength(112);
  expect(report.unresolved.referenceHints.length).toBeGreaterThan(0);
  expect(content.cells.every(cell => cell.sourceIds.length === 0)).toBe(true);
});

test('rejects overrides that refer to unknown imported IDs', () => {
  expect(() => buildImport(matrix, notes, { version: 1, verdicts: {}, cellSources: { missing: [] }, sourceSplits: {} })).toThrow(/Unknown cell/);
});
