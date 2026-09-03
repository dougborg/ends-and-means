import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { buildImport, parseMatrix, parseReadingList } from '../../scripts/import-content.mjs';

const root = resolve(import.meta.dirname, '../..');
const matrix = await readFile(resolve(root, 'docs/system-comparison-by-crux-v2.md'), 'utf8');
const notes = await readFile(resolve(root, 'docs/political-economy-notes.md'), 'utf8');

test('imports the complete matrix without altering prose', () => {
  const result = parseMatrix(matrix);
  assert.equal(result.systems.length, 8);
  assert.equal(result.cruxes.length, 14);
  assert.equal(result.cells.length, 112);
  assert.deepEqual(result.cruxes[9].columnLabels, { system: 'System', mechanism: 'Evidence base', breaks: 'What it shows' });
  assert.equal(result.cruxes[9].prompt, null);
  assert.equal(result.cells[0].mechanism, 'Prices aggregate dispersed knowledge; profit and loss steer resources (Hayek).');
  assert.match(result.cells[0].breaks, /^Prices omit externalities/);
  assert.equal(new Set(result.cells.map(cell => cell.id)).size, 112);
});

test('imports reading-list bullets with stable editorial metadata', () => {
  const sources = parseReadingList(notes);
  assert.ok(sources.length > 40);
  assert.equal(new Set(sources.map(source => source.id)).size, sources.length);
  assert.equal(sources[0].recommended, true);
  assert.equal(sources.find(source => source.author.includes('Michael Albert')).verificationTier, 'publisher-or-library-checked');
  assert.equal(sources.find(source => source.author.includes('Piketty')).verificationTier, 'not-rechecked');
});

test('leaves judgment-heavy mappings unresolved by default', () => {
  const { content, report } = buildImport(matrix, notes);
  assert.equal(report.unresolved.verdicts.length, 14);
  assert.deepEqual(report.unresolved.structuralGaps[0].missing, ['prompt', 'verdictText']);
  assert.equal(report.unresolved.cellSources.length, 112);
  assert.ok(report.unresolved.referenceHints.length > 0);
  assert.ok(content.cells.every(cell => cell.sourceIds.length === 0));
});

test('rejects overrides that refer to unknown imported IDs', () => {
  assert.throws(() => buildImport(matrix, notes, { version: 1, verdicts: {}, cellSources: { missing: [] }, sourceSplits: {} }), /Unknown cell/);
});
