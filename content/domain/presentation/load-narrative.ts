import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

export interface LoadedNarrative {
  standfirst: string;
  sections: Record<string, string>;
}

export function loadNarrative(
  filename: string,
  expectedSectionIds: readonly string[],
): LoadedNarrative {
  if (filename !== basename(filename)) throw new Error(`Narrative filename must not contain a path: ${filename}`);
  const pathname = resolve(process.cwd(), "content/domain/presentation/narratives", filename);
  return parseNarrative(readFileSync(pathname, "utf8"), pathname, expectedSectionIds);
}

export function parseNarrative(
  markdown: string,
  location: string,
  expectedSectionIds: readonly string[],
): LoadedNarrative {
  const source = markdown.trim();
  const [standfirst = "", ...blocks] = source.split(/^## /mu);
  const entries = blocks.map((block) => {
      const newline = block.indexOf("\n");
      if (newline === -1) throw new Error(`${location}: narrative section has no body`);
      const id = block.slice(0, newline).trim();
      const body = block.slice(newline + 1).trim();
      if (!body) throw new Error(`${location}: narrative section ${id} has an empty body`);
      return [id, body] as const;
    });
  const duplicateIds = entries.map(([id]) => id).filter((id, index, ids) => ids.indexOf(id) !== index);
  if (duplicateIds.length) throw new Error(`${location}: duplicate narrative sections: ${[...new Set(duplicateIds)].join(", ")}`);
  const sections = Object.fromEntries(entries);
  const actualSectionIds = Object.keys(sections);
  const missing = expectedSectionIds.filter((id) => !(id in sections));
  const unexpected = actualSectionIds.filter((id) => !expectedSectionIds.includes(id));
  if (!standfirst.trim()) throw new Error(`${location}: narrative standfirst is empty`);
  if (missing.length || unexpected.length) {
    throw new Error(`${location}: narrative section mismatch (missing: ${missing.join(", ") || "none"}; unexpected: ${unexpected.join(", ") || "none"})`);
  }
  return { standfirst: standfirst.trim(), sections };
}
