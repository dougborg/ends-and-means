import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type {
  CompiledDomainGraph,
  DomainEntity,
  DomainRelationship,
  SubjectGuide,
} from "../src/lib/domain";

export type PreflightSeverity = "violation" | "human-review";

export interface PreflightFinding {
  severity: PreflightSeverity;
  code: string;
  subject: string;
  message: string;
}

export interface PreflightInput {
  graph: CompiledDomainGraph;
  baseGraph?: CompiledDomainGraph;
  changedEntityIds: string[];
  changedRelationshipIds: string[];
  changedGuideIds: string[];
  removedEntityIds?: string[];
  removedRelationshipIds?: string[];
  removedGuideIds?: string[];
  changedFiles: string[];
  changedTestText?: string;
}

export interface PreflightResult {
  base: string;
  files: string[];
  entities: DomainEntity[];
  relationships: DomainRelationship[];
  guides: SubjectGuide[];
  removedEntityIds: string[];
  removedRelationshipIds: string[];
  removedGuideIds: string[];
  findings: PreflightFinding[];
}

const artifactLanguage =
  /\b(?:(?:the|this|our|a)\s+(?:guide|dossier|page|site|artifact)|(?:learner|reader)[-\s]+(?:paths?|journeys?))\b/iu;
const strongPredicates = new Set([
  "advances-end",
  "rejects-end",
  "advocates-means",
  "rejects-means",
  "used-means",
  "assessed-by",
  "partially-instantiated",
]);

function codeUnitCompare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function finding(
  severity: PreflightSeverity,
  code: string,
  subject: string,
  message: string,
): PreflightFinding {
  return { severity, code, subject, message };
}

function duplicates(ids: string[]) {
  return [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
}

function publicText(entity: DomainEntity): string[] {
  if (entity.kind === "dossier")
    return [
      entity.label,
      entity.description,
      entity.standfirst,
      ...entity.sections.flatMap(({ heading, body }) => [heading, body]),
    ];
  if (entity.kind === "research-obligation")
    return [
      entity.label,
      entity.description,
      entity.question,
      entity.currentLimitation,
      entity.evidenceNeeded,
      entity.scope,
    ];
  return [entity.label, entity.description];
}

function artifactFindings(id: string, status: string, text: string[]) {
  if (!["reviewed", "published"].includes(status)) return [];
  return text.some((value) => artifactLanguage.test(value))
    ? [
        finding(
          "violation",
          "artifact-language",
          id,
          "Replace artifact-centered wording with a direct substantive proposition.",
        ),
      ]
    : [];
}

function sourceFindings(
  entity: Extract<DomainEntity, { kind: "source" }>,
  entityById: Record<string, DomainEntity>,
) {
  const findings: PreflightFinding[] = [];
  if (!["reviewed", "published"].includes(entity.publicationStatus))
    return findings;
  const fields = [
    ["workId", entity.workId],
    ["contributorDisplay", entity.contributorDisplay?.length],
    ["publicationYear", entity.publicationYear],
    ["publisher", entity.publisher],
    [
      "identifiers",
      entity.identifiers && Object.keys(entity.identifiers).length,
    ],
    ["resourceLinks", entity.resourceLinks?.length],
  ] as const;
  for (const [field, value] of fields)
    if (!value)
      findings.push(
        finding(
          "human-review",
          "source-manifestation-field",
          entity.id,
          `Optional manifestation field ${field} is unavailable; confirm that omission is accurate and never derive it from the Work.`,
        ),
      );
  if (entity.workId && entityById[entity.workId]?.kind !== "work")
    findings.push(
      finding(
        "violation",
        "source-work-resolution",
        entity.id,
        `workId ${entity.workId} must resolve to a Work.`,
      ),
    );
  return findings;
}

function statementFindings(
  entity: Extract<DomainEntity, { kind: "statement" }>,
  relationships: DomainRelationship[],
) {
  const citations = relationships.filter(
    (item): item is Extract<DomainRelationship, { predicate: "cites" }> =>
      item.predicate === "cites" && item.subject.id === entity.id,
  );
  const findings = citations
    .filter(({ locator }) => !locator.trim())
    .map(({ id }) =>
      finding(
        "violation",
        "citation-locator",
        id,
        "Record a precise non-empty locator.",
      ),
    );
  if (entity.publicationStatus === "reviewed" && citations.length === 0)
    findings.push(
      finding(
        "violation",
        "statement-citation",
        entity.id,
        "A reviewed Statement needs at least one Statement→Source→role→locator tuple.",
      ),
    );
  return findings;
}

function caseFindings(
  entity: Extract<DomainEntity, { kind: "case" }>,
  entityById: Record<string, DomainEntity>,
) {
  const repeated = duplicates(entity.episodeIds);
  const findings = repeated.length
    ? [
        finding(
          "violation",
          "duplicate-case-slot",
          entity.id,
          `Duplicate episodeIds: ${repeated.join(", ")}.`,
        ),
      ]
    : [];
  for (const id of entity.episodeIds) {
    const episode = entityById[id];
    if (episode?.kind !== "case-episode" || episode.caseId !== entity.id)
      findings.push(
        finding(
          "violation",
          "case-episode-slot",
          entity.id,
          `${id} must resolve to a Case Episode whose caseId is ${entity.id}.`,
        ),
      );
  }
  return findings;
}

function episodeFindings(
  entity: Extract<DomainEntity, { kind: "case-episode" }>,
  entityById: Record<string, DomainEntity>,
) {
  const findings: PreflightFinding[] = [];
  const slots = [
    ["conditionStatementIds", entity.conditionStatementIds],
    ["formalRuleStatementIds", entity.formalRuleStatementIds],
    ["ruleInUseStatementIds", entity.ruleInUseStatementIds],
    ["interactionStatementIds", entity.interactionStatementIds],
    ["outcomeStatementIds", entity.outcomeStatementIds],
  ] as const;
  const slotNamesByStatement = new Map<string, string[]>();
  for (const [slot, ids] of slots) {
    const repeated = duplicates(ids);
    if (repeated.length)
      findings.push(
        finding(
          "violation",
          "duplicate-case-slot",
          entity.id,
          `${slot} repeats ${repeated.join(", ")}.`,
        ),
      );
    for (const id of ids)
      if (entityById[id]?.kind !== "statement")
        findings.push(
          finding(
            "violation",
            "case-slot-eligibility",
            entity.id,
            `${slot} entry ${id} must resolve to a Statement.`,
          ),
        );
      else
        slotNamesByStatement.set(id, [
          ...(slotNamesByStatement.get(id) ?? []),
          slot,
        ]);
  }
  for (const [id, slotNames] of slotNamesByStatement)
    if (new Set(slotNames).size > 1)
      findings.push(
        finding(
          "violation",
          "cross-case-slot-duplicate",
          entity.id,
          `${id} appears in distinct semantic slots: ${slotNames.join(", ")}. Split the propositions or select the correct slot.`,
        ),
      );
  return findings;
}

function entityFindings(entity: DomainEntity, graph: CompiledDomainGraph) {
  const findings = artifactFindings(
    entity.id,
    entity.publicationStatus,
    publicText(entity),
  );
  if (entity.kind === "source")
    findings.push(...sourceFindings(entity, graph.indexes.entitiesById));
  if (entity.kind === "statement")
    findings.push(...statementFindings(entity, graph.relationships));
  if (entity.kind === "case")
    findings.push(...caseFindings(entity, graph.indexes.entitiesById));
  if (entity.kind === "case-episode")
    findings.push(...episodeFindings(entity, graph.indexes.entitiesById));
  return findings;
}

function relationshipFindings(
  relationship: DomainRelationship,
  entityById: Record<string, DomainEntity>,
) {
  if (relationship.predicate === "cites") return [];
  const findings: PreflightFinding[] = [];
  if (relationship.statementIds.length === 0)
    findings.push(
      finding(
        "violation",
        "relationship-support",
        relationship.id,
        "Record proposition-specific supporting Statement IDs.",
      ),
    );
  for (const id of relationship.statementIds)
    if (entityById[id]?.kind !== "statement")
      findings.push(
        finding(
          "violation",
          "relationship-support-resolution",
          relationship.id,
          `Supporting ID ${id} must resolve to a Statement.`,
        ),
      );
  const kinds = relationship.statementIds.flatMap((id) => {
    const entity = entityById[id];
    return entity?.kind === "statement" ? [entity.statementKind] : [];
  });
  if (
    strongPredicates.has(relationship.predicate) &&
    kinds.length > 0 &&
    kinds.every(
      (kind) =>
        kind === "editorial-interpretation" || kind === "classification",
    )
  )
    findings.push(
      finding(
        "human-review",
        "relationship-support-semantics",
        relationship.id,
        `${relationship.predicate} is supported only by ${[...new Set(kinds)].join("/")} Statements; confirm that the proposition supports this predicate.`,
      ),
    );
  return findings;
}

function coverageFindings(input: PreflightInput, substantive: boolean) {
  const findings: PreflightFinding[] = [];
  const subject = input.changedFiles.join(", ") || "changed tranche";
  const tests = input.changedTestText ?? "";
  const changedIds = [
    ...input.changedEntityIds,
    ...input.changedRelationshipIds,
    ...input.changedGuideIds,
    ...(input.removedEntityIds ?? []),
    ...(input.removedRelationshipIds ?? []),
    ...(input.removedGuideIds ?? []),
  ];
  const uncoveredIds = changedIds.filter((id) => !tests.includes(id));
  if (substantive && uncoveredIds.length > 0)
    findings.push(
      finding(
        "human-review",
        "exact-ledger-coverage",
        uncoveredIds.join(", "),
        "These changed or removed IDs do not appear in changed tests or snapshots. This is an ID-presence signal, not proof that an existing ledger is semantically complete.",
      ),
    );
  if (substantive && !/mutation|drift|not\.toEqual|not\.toMatch/isu.test(tests))
    findings.push(
      finding(
        "human-review",
        "mutation-coverage",
        subject,
        "No coarse negative-fixture syntax was found in changed tests. This heuristic does not prove whether existing mutation coverage exercises the changed IDs.",
      ),
    );
  if (
    input.changedFiles.some((path) =>
      /content\/domain\/index\.ts$|canonical-domain\.test\.ts$|domain-(?:dossiers|subject-guides|research-obligations)\.test\.ts$/u.test(
        path,
      ),
    )
  )
    findings.push(
      finding(
        "human-review",
        "additive-inventory",
        "corpus registries",
        "Reconcile additive corpus inventories after the final rebase; do not replace already-merged entries.",
      ),
    );
  return findings;
}

export function runContentSemanticPreflight(
  input: PreflightInput,
  base = "unknown",
): PreflightResult {
  const entities = input.graph.entities.filter(({ id }) =>
    new Set(input.changedEntityIds).has(id),
  );
  const relationships = input.graph.relationships.filter(({ id }) =>
    new Set(input.changedRelationshipIds).has(id),
  );
  const guides = input.graph.subjectGuideRecords.filter(({ id }) =>
    new Set(input.changedGuideIds).has(id),
  );
  const findings = entities.flatMap((entity) =>
    entityFindings(entity, input.graph),
  );
  findings.push(
    ...guides.flatMap((guide) =>
      artifactFindings(guide.id, guide.publicationStatus, [
        guide.label,
        guide.description,
        ...guide.sections.map(({ heading }) => heading),
      ]),
    ),
  );
  findings.push(
    ...relationships.flatMap((relationship) =>
      relationshipFindings(relationship, input.graph.indexes.entitiesById),
    ),
  );
  findings.push(
    ...coverageFindings(
      input,
      entities.length +
        relationships.length +
        guides.length +
        (input.removedEntityIds?.length ?? 0) +
        (input.removedRelationshipIds?.length ?? 0) +
        (input.removedGuideIds?.length ?? 0) >
        0,
    ),
  );

  findings.sort((left, right) =>
    codeUnitCompare(
      `${left.severity}|${left.code}|${left.subject}|${left.message}`,
      `${right.severity}|${right.code}|${right.subject}|${right.message}`,
    ),
  );
  return {
    base,
    files: [...input.changedFiles].sort(),
    entities,
    relationships,
    guides,
    removedEntityIds: [...(input.removedEntityIds ?? [])].sort(),
    removedRelationshipIds: [...(input.removedRelationshipIds ?? [])].sort(),
    removedGuideIds: [...(input.removedGuideIds ?? [])].sort(),
    findings,
  };
}

function git(args: string[]) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function changedIds<T extends { id: string }>(base: T[], head: T[]) {
  const baseById = new Map(base.map((value) => [value.id, value]));
  return head
    .filter(
      (value) =>
        JSON.stringify(value) !== JSON.stringify(baseById.get(value.id)),
    )
    .map(({ id }) => id)
    .sort();
}

function removedIds<T extends { id: string }>(base: T[], head: T[]) {
  const headIds = new Set(head.map(({ id }) => id));
  return base
    .map(({ id }) => id)
    .filter((id) => !headIds.has(id))
    .sort();
}

export function discoverGraphChanges(
  base: CompiledDomainGraph,
  head: CompiledDomainGraph,
) {
  return {
    changedEntityIds: changedIds(base.entities, head.entities),
    changedRelationshipIds: changedIds(base.relationships, head.relationships),
    changedGuideIds: changedIds(
      base.subjectGuideRecords,
      head.subjectGuideRecords,
    ),
    removedEntityIds: removedIds(base.entities, head.entities),
    removedRelationshipIds: removedIds(base.relationships, head.relationships),
    removedGuideIds: removedIds(
      base.subjectGuideRecords,
      head.subjectGuideRecords,
    ),
  };
}

async function loadGraph(path: string) {
  const module = await import(
    `${pathToFileURL(resolve(path)).href}?preflight=${Date.now()}`
  );
  return module.canonicalGraph as CompiledDomainGraph;
}

async function loadBaseGraph(base: string) {
  const directory = await mkdtemp(join(tmpdir(), "ends-means-preflight-"));
  try {
    const archive = execFileSync("git", ["archive", "--format=tar", base], {
      maxBuffer: 64 * 1024 * 1024,
    });
    execFileSync("tar", ["-xf", "-", "-C", directory], { input: archive });
    await symlink(
      resolve("node_modules"),
      join(directory, "node_modules"),
      "dir",
    );
    return await loadGraph(join(directory, "src/lib/domain/canonical.ts"));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function readChangedTests(files: string[]) {
  const testFiles = files.filter((file) =>
    /^(?:tests\/|.*\.snap$)/u.test(file),
  );
  return (
    await Promise.all(
      testFiles.map(async (file) => {
        try {
          return await readFile(file, "utf8");
        } catch (error) {
          if (
            error instanceof Error &&
            "code" in error &&
            error.code === "ENOENT"
          )
            return "";
          throw error;
        }
      }),
    )
  ).join("\n");
}

interface CliDependencies {
  baseGraph: CompiledDomainGraph;
  headGraph: CompiledDomainGraph;
  files: string[];
  changedTestText?: string;
  log: (message: string) => void;
}

export async function runCli(
  argv = process.argv.slice(2),
  dependencies?: CliDependencies,
) {
  const baseArg = argv
    .find((argument) => argument.startsWith("--base="))
    ?.slice("--base=".length);
  const base =
    baseArg ||
    process.env.CONTENT_PREFLIGHT_BASE ||
    git(["merge-base", "HEAD", "origin/main"]);
  const files =
    dependencies?.files ??
    git(["diff", "--name-only", `${base}...HEAD`])
      .split("\n")
      .filter(Boolean);
  const canonicalGraph =
    dependencies?.headGraph ?? (await loadGraph("src/lib/domain/canonical.ts"));
  const baseGraph = dependencies?.baseGraph ?? (await loadBaseGraph(base));
  const changes = discoverGraphChanges(baseGraph, canonicalGraph);
  const changedTestText =
    dependencies?.changedTestText ?? (await readChangedTests(files));
  const result = runContentSemanticPreflight(
    {
      graph: canonicalGraph,
      baseGraph,
      ...changes,
      changedFiles: files,
      changedTestText,
    },
    base,
  );
  (dependencies?.log ?? console.log)(formatContentSemanticPreflight(result));
  if (result.findings.some(({ severity }) => severity === "violation"))
    process.exitCode = 1;
}

function entityInventoryLine(entity: DomainEntity): string | undefined {
  if (entity.kind === "work")
    return `- Work ${entity.id}: ${entity.workType}; ${entity.originalPublicationYear ?? "year unavailable"}; ${entity.title}`;
  if (entity.kind === "source")
    return `- Source ${entity.id}: ${entity.sourceType}; ${entity.publicationYear ?? "year unavailable"}; ${entity.publisher ?? "publisher unavailable"}; contributors=${entity.contributorDisplay?.join(" | ") ?? "unavailable"}; identifiers=${JSON.stringify(entity.identifiers ?? {})}; links=${entity.resourceLinks?.map(({ purpose }) => purpose).join(" | ") ?? "none"}`;
  if (entity.kind === "statement")
    return `- Statement ${entity.id}: ${entity.statementKind}; ${entity.label}; ${entity.text}`;
  if (entity.kind === "case")
    return `- Case ${entity.id}: episodes=${entity.episodeIds.join(" | ") || "none"}`;
  if (entity.kind === "case-episode")
    return `- Episode ${entity.id}: conditions=${entity.conditionStatementIds.length}; formal=${entity.formalRuleStatementIds.length}; practice=${entity.ruleInUseStatementIds.length}; interactions=${entity.interactionStatementIds.length}; outcomes=${entity.outcomeStatementIds.length}`;
  if (entity.kind === "dossier" || entity.kind === "research-obligation")
    return `- Public trace ${entity.kind} ${entity.id}`;
  return undefined;
}

function relationshipInventoryLine(relationship: DomainRelationship) {
  return relationship.predicate === "cites"
    ? `- Citation ${relationship.subject.id} → ${relationship.object.id}; ${relationship.role}; ${relationship.locator}`
    : `- Relationship ${relationship.id}: ${relationship.subject.id} → ${relationship.predicate} → ${relationship.object.id}; ${relationship.status}; support=${relationship.statementIds.join(" | ") || "none"}`;
}

export function formatContentSemanticPreflight(result: PreflightResult) {
  const lines = [
    "Semantic content preflight",
    `Base: ${result.base}`,
    `Changed files: ${result.files.length}`,
    `Inventory: ${result.entities.length} entities; ${result.relationships.length} relationships; ${result.guides.length} Subject Guides`,
    `Removed: ${result.removedEntityIds.length} entities; ${result.removedRelationshipIds.length} relationships; ${result.removedGuideIds.length} Subject Guides`,
  ];
  for (const id of result.removedEntityIds)
    lines.push(`- Removed entity ${id}`);
  for (const id of result.removedRelationshipIds)
    lines.push(`- Removed relationship ${id}`);
  for (const id of result.removedGuideIds)
    lines.push(`- Removed Subject Guide ${id}`);
  for (const entity of result.entities) {
    const line = entityInventoryLine(entity);
    if (line) lines.push(line);
  }
  for (const relationship of result.relationships)
    lines.push(relationshipInventoryLine(relationship));
  for (const guide of result.guides)
    lines.push(
      `- Public trace subject-guide ${guide.id}: sections=${guide.sections.length}`,
    );
  const violations = result.findings.filter(
    ({ severity }) => severity === "violation",
  );
  const signals = result.findings.filter(
    ({ severity }) => severity === "human-review",
  );
  lines.push(
    `Violations: ${violations.length}`,
    ...violations.map(
      ({ code, subject, message }) => `- [${code}] ${subject}: ${message}`,
    ),
  );
  lines.push(
    `Human-review signals: ${signals.length}`,
    ...signals.map(
      ({ code, subject, message }) => `- [${code}] ${subject}: ${message}`,
    ),
  );
  lines.push(
    "Human review still owns source verification, statement atomicity, interpretive support, case scope, counterevidence, and narrative fairness.",
  );
  return lines.join("\n");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href)
  await runCli();
