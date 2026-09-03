import {
  CRUX_IDS, EVIDENCE_LEVELS, EXTERNAL_LINK_KINDS, SOURCE_TYPES, SYSTEM_IDS,
  VERDICTS, VERIFICATION_STATUSES,
  type ContentGraph,
} from "./model";

export type DiagnosticGroup = "shape" | "identity" | "coverage" | "references" | "citations";

export interface Diagnostic {
  code: string;
  message: string;
  entity?: string;
  path?: string;
}

export interface ValidationReport {
  valid: boolean;
  diagnostics: Record<DiagnosticGroup, Diagnostic[]>;
  count: number;
}

export interface ValidationOptions {
  /** Release mode requires a resolved citation and forbids needsCitation. */
  citationMode?: "milestone" | "release";
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const inEnum = (value: unknown, values: readonly string[]) => typeof value === "string" && values.includes(value);

export function validateContentGraph(input: unknown, options: ValidationOptions = {}): ValidationReport {
  const diagnostics: ValidationReport["diagnostics"] = {
    shape: [], identity: [], coverage: [], references: [], citations: [],
  };
  const add = (group: DiagnosticGroup, code: string, message: string, entity?: string, path?: string) =>
    diagnostics[group].push({ code, message, ...(entity && { entity }), ...(path && { path }) });

  if (!isRecord(input)) {
    add("shape", "graph.invalid", "Content graph must be an object.");
    return finish(diagnostics);
  }

  const collectionNames = ["systems", "cruxes", "cells", "sources", "cases", "claims"] as const;
  const collections: Record<(typeof collectionNames)[number], Record<string, unknown>[]> = Object.create(null);
  for (const name of collectionNames) {
    if (!Array.isArray(input[name])) {
      add("shape", "collection.invalid", `${name} must be an array.`, undefined, name);
      collections[name] = [];
    } else {
      collections[name] = input[name].filter((item, index): item is Record<string, unknown> => {
        if (isRecord(item)) return true;
        add("shape", "entity.invalid", `${name}[${index}] must be an object.`, undefined, `${name}.${index}`);
        return false;
      });
    }
  }

  const index = (name: keyof typeof collections) => {
    const ids = new Set<string>();
    for (const [position, entity] of collections[name].entries()) {
      if (typeof entity.id !== "string" || !entity.id) {
        add("shape", "id.required", `${name}[${position}] requires a non-empty string id.`, undefined, `${name}.${position}.id`);
      } else if (ids.has(entity.id)) {
        add("identity", "id.duplicate", `Duplicate ${name} id '${entity.id}'.`, entity.id);
      } else ids.add(entity.id);
    }
    return ids;
  };
  const systemIds = index("systems");
  const cruxIds = index("cruxes");
  const cellIds = index("cells");
  const sourceIds = index("sources");
  const caseIds = index("cases");
  index("claims");

  validateExactIds("system", systemIds, SYSTEM_IDS, add);
  validateExactIds("crux", cruxIds, CRUX_IDS, add);

  for (const entity of collections.systems) {
    if (!inEnum(entity.id, SYSTEM_IDS)) add("shape", "system.id.invalid", `Unknown system id '${String(entity.id)}'.`, stringId(entity));
  }
  for (const entity of collections.cruxes) {
    if (!inEnum(entity.id, CRUX_IDS)) add("shape", "crux.id.invalid", `Unknown crux id '${String(entity.id)}'.`, stringId(entity));
  }

  const pairCounts = new Map<string, number>();
  for (const cell of collections.cells) {
    const id = stringId(cell);
    if (!inEnum(cell.system, SYSTEM_IDS)) add("shape", "cell.system.invalid", `Cell has invalid system '${String(cell.system)}'.`, id, "system");
    if (!inEnum(cell.crux, CRUX_IDS)) add("shape", "cell.crux.invalid", `Cell has invalid crux '${String(cell.crux)}'.`, id, "crux");
    if (!inEnum(cell.verdict, VERDICTS)) add("shape", "cell.verdict.invalid", `Cell has invalid verdict '${String(cell.verdict)}'.`, id, "verdict");
    if (!inEnum(cell.evidence, EVIDENCE_LEVELS)) add("shape", "cell.evidence.invalid", `Cell has invalid evidence '${String(cell.evidence)}'.`, id, "evidence");
    if (typeof cell.system === "string" && typeof cell.crux === "string") {
      const expectedId = `${cell.system}-${cell.crux}`;
      pairCounts.set(expectedId, (pairCounts.get(expectedId) ?? 0) + 1);
      if (cell.id !== expectedId) add("identity", "cell.id.mismatch", `Cell id must be '${expectedId}'.`, id);
    }
    validateRefs(cell, "sources", sourceIds, "source", id, add);
    validateRefs(cell, "cases", caseIds, "case", id, add);
    if (typeof cell.needsCitation !== "boolean")
      add("shape", "cell.needsCitation.invalid", "Cell must expose citation status as a boolean.", id, "needsCitation");

    const sourceRefs = stringArray(cell.sources);
    const caseRefs = stringArray(cell.cases);
    const resolved = sourceRefs.some((ref) => sourceIds.has(ref)) || caseRefs.some((ref) => caseIds.has(ref));
    if (!resolved && cell.needsCitation !== true)
      add("citations", "cell.citation.unacknowledged", "Cell has no resolved citation and must set needsCitation: true.", id);
    if (options.citationMode === "release" && (!resolved || cell.needsCitation !== false))
      add("citations", "cell.citation.release", "Release cells require a resolved source or case and needsCitation: false.", id);
  }

  for (const system of SYSTEM_IDS) for (const crux of CRUX_IDS) {
    const pair = `${system}-${crux}`;
    const count = pairCounts.get(pair) ?? 0;
    if (count === 0) add("coverage", "cell.pair.missing", `Missing cell for ${system} × ${crux}.`, pair);
    else if (count > 1) add("coverage", "cell.pair.duplicate", `Expected one cell for ${system} × ${crux}; found ${count}.`, pair);
  }

  for (const source of collections.sources) {
    const id = stringId(source);
    if (!inEnum(source.type, SOURCE_TYPES)) add("shape", "source.type.invalid", `Source has invalid type '${String(source.type)}'.`, id, "type");
    if (!inEnum(source.verified, VERIFICATION_STATUSES)) add("shape", "source.verified.invalid", "Source requires a valid verified status.", id, "verified");
    if (source.links !== undefined) {
      if (!Array.isArray(source.links)) add("shape", "source.links.invalid", "Source links must be an array.", id, "links");
      else for (const [i, link] of source.links.entries()) {
        if (!isRecord(link) || !inEnum(link.kind, EXTERNAL_LINK_KINDS) || typeof link.url !== "string")
          add("shape", "source.link.invalid", "External link requires a valid kind and URL string.", id, `links.${i}`);
        else {
          try { new URL(link.url); } catch { add("shape", "source.link.url.invalid", `Invalid external URL '${link.url}'.`, id, `links.${i}.url`); }
          if (link.kind === "purchase" && typeof link.affiliate !== "boolean")
            add("shape", "source.link.affiliate.required", "Purchase links must declare affiliate true or false.", id, `links.${i}.affiliate`);
        }
      }
    }
  }

  for (const historicalCase of collections.cases) {
    const id = stringId(historicalCase);
    validateRefs(historicalCase, "sources", sourceIds, "source", id, add);
    for (const system of stringArray(historicalCase.systems))
      if (!systemIds.has(system)) add("references", "case.system.unresolved", `Unknown system reference '${system}'.`, id, "systems");
  }

  for (const claim of collections.claims) {
    const id = stringId(claim);
    validateRefs(claim, "sources", sourceIds, "source", id, add);
    validateRefs(claim, "cases", caseIds, "case", id, add);
    if (!isRecord(claim.parent) || !["cell", "case"].includes(String(claim.parent.type)) || typeof claim.parent.id !== "string") {
      add("shape", "claim.parent.invalid", "Claim parent must identify a cell or case.", id, "parent");
    } else {
      const targets = claim.parent.type === "cell" ? cellIds : caseIds;
      if (!targets.has(claim.parent.id)) add("references", "claim.parent.unresolved", `Unknown ${claim.parent.type} parent '${claim.parent.id}'.`, id, "parent.id");
    }
  }

  return finish(diagnostics);
}

function stringId(entity: Record<string, unknown>): string | undefined {
  return typeof entity.id === "string" ? entity.id : undefined;
}
function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
function validateRefs(
  entity: Record<string, unknown>, field: string, targets: Set<string>, kind: string,
  id: string | undefined,
  add: (group: DiagnosticGroup, code: string, message: string, entity?: string, path?: string) => void,
) {
  const value = entity[field];
  if (!Array.isArray(value)) {
    add("shape", "references.invalid", `${field} must be an array.`, id, field);
    return;
  }
  for (const ref of value) {
    if (typeof ref !== "string") add("shape", "reference.invalid", `${field} entries must be strings.`, id, field);
    else if (!targets.has(ref)) add("references", `${kind}.unresolved`, `Unknown ${kind} reference '${ref}'.`, id, field);
  }
}
function validateExactIds(
  kind: string, actual: Set<string>, expected: readonly string[],
  add: (group: DiagnosticGroup, code: string, message: string, entity?: string) => void,
) {
  for (const id of expected) if (!actual.has(id)) add("coverage", `${kind}.missing`, `Missing required ${kind} '${id}'.`, id);
  if (actual.size !== expected.length) add("coverage", `${kind}.count`, `Expected ${expected.length} ${kind}s; found ${actual.size}.`);
}
function finish(diagnostics: ValidationReport["diagnostics"]): ValidationReport {
  const count = Object.values(diagnostics).reduce((total, entries) => total + entries.length, 0);
  return { valid: count === 0, diagnostics, count };
}

export function assertValidContentGraph(input: unknown, options?: ValidationOptions): asserts input is ContentGraph {
  const report = validateContentGraph(input, options);
  if (!report.valid) throw new ContentValidationError(report);
}

export class ContentValidationError extends Error {
  constructor(public readonly report: ValidationReport) {
    super(`Content graph validation failed with ${report.count} diagnostic(s).`);
    this.name = "ContentValidationError";
  }
}
