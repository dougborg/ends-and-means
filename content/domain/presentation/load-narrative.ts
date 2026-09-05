import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface LoadedNarrative {
  standfirst: string;
  sections: Record<string, string>;
}

interface NarrativeSection {
  id: string;
  body: string;
}
interface NarrativeManifest {
  standfirst: string;
  sections: NarrativeSection[];
}

const moduleDirectory = dirname(fileURLToPath(import.meta.url));

export function findProjectRoot(startDirectory = moduleDirectory): string {
  let candidate = resolve(startDirectory);
  const filesystemRoot = parse(candidate).root;
  while (true) {
    const packagePath = resolve(candidate, "package.json");
    if (existsSync(packagePath)) {
      const packageJson = JSON.parse(readFileSync(packagePath, "utf8")) as {
        name?: string;
      };
      if (packageJson.name === "ends-and-means") return candidate;
    }
    if (candidate === filesystemRoot) break;
    candidate = dirname(candidate);
  }
  throw new Error(
    `Could not find the ends-and-means project root from ${startDirectory}`,
  );
}

export function resolveNarrativePath(
  filename: string,
  startDirectory = moduleDirectory,
): string {
  if (filename !== basename(filename))
    throw new Error(`Narrative filename must not contain a path: ${filename}`);
  return resolve(resolveNarrativeDirectory(startDirectory), filename);
}

export function resolveNarrativeDirectory(
  startDirectory = moduleDirectory,
): string {
  return resolve(
    findProjectRoot(startDirectory),
    "content/domain/presentation/narratives",
  );
}

export function loadNarrative(
  filename: string,
  expectedSectionIds: readonly string[],
): LoadedNarrative {
  const pathname = resolveNarrativePath(filename);
  return parseNarrative(
    readFileSync(pathname, "utf8"),
    pathname,
    expectedSectionIds,
  );
}

export function attachNarrative<T extends NarrativeManifest>(
  filename: string,
  manifest: T,
): T {
  const narrative = loadNarrative(
    filename,
    manifest.sections.map(({ id }) => id),
  );
  return {
    ...manifest,
    standfirst: narrative.standfirst,
    sections: manifest.sections.map((section) => ({
      ...section,
      body: narrative.sections[section.id] ?? "",
    })),
  };
}

function assertRestrictedNarrative(markdown: string, location: string): void {
  const prose = markdown.replace(/^## [a-z0-9]+(?:-[a-z0-9]+)*$/gmu, "");
  const unsupportedBlock =
    /^\s*(?:#{1,6}\s|[-+*]\s|\d+[.)]\s|>|```|~~~)|^(?: {4}|\t)\S|^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,}|[=-]{2,})\s*$/mu;
  const unsupportedInline = /(?:`|!\[|<\/?[A-Za-z][^>]*>|<!--)/u;
  if (unsupportedBlock.test(prose) || unsupportedInline.test(prose)) {
    throw new Error(
      `${location}: narrative prose supports paragraphs and inline Markdown only`,
    );
  }
}

export function parseNarrative(
  markdown: string,
  location: string,
  expectedSectionIds: readonly string[],
): LoadedNarrative {
  const source = markdown.trim();
  assertRestrictedNarrative(source, location);
  const [standfirst = "", ...blocks] = source.split(/^## /mu);
  if (standfirst.trim().split(/\n\s*\n/u).length !== 1) {
    throw new Error(
      `${location}: narrative standfirst must be exactly one paragraph`,
    );
  }
  const entries = blocks.map((block) => {
    const newline = block.indexOf("\n");
    if (newline === -1)
      throw new Error(`${location}: narrative section has no body`);
    const id = block.slice(0, newline).trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id))
      throw new Error(`${location}: invalid narrative section id: ${id}`);
    const body = block.slice(newline + 1).trim();
    if (!body)
      throw new Error(`${location}: narrative section ${id} has an empty body`);
    return [id, body] as const;
  });
  const duplicateIds = entries
    .map(([id]) => id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  if (duplicateIds.length)
    throw new Error(
      `${location}: duplicate narrative sections: ${[...new Set(duplicateIds)].join(", ")}`,
    );
  const sections = Object.fromEntries(entries);
  const actualSectionIds = Object.keys(sections);
  const missing = expectedSectionIds.filter((id) => !(id in sections));
  const unexpected = actualSectionIds.filter(
    (id) => !expectedSectionIds.includes(id),
  );
  if (!standfirst.trim())
    throw new Error(`${location}: narrative standfirst is empty`);
  if (missing.length || unexpected.length) {
    throw new Error(
      `${location}: narrative section mismatch (missing: ${missing.join(", ") || "none"}; unexpected: ${unexpected.join(", ") || "none"})`,
    );
  }
  return { standfirst: standfirst.trim(), sections };
}
