import { z } from "zod";
import type {
  DeliveryFinding,
  DeliveryItem,
  DeliverySnapshot,
} from "./delivery-state.ts";

const dateTime = z.string().datetime({ offset: true });
export const deliveryFlowLimits = { selected: 3, research: 3 } as const;
export const coordinationSchema = z
  .object({
    mode: z.enum(["running", "user-paused"]),
    changedAt: dateTime,
    instructionEvidence: z.literal(true),
    // Describes the actual instruction, never grants authorization itself.
    finishStarted: z.boolean(),
  })
  .strict();
export const retainedWorkSchema = z
  .object({
    issue: z.number().int().positive(),
    disposition: z.enum(["selected", "parked", "unclassified"]),
    decisionAt: dateTime.nullable(),
    decisionEvidence: z.boolean(),
    started: z.boolean().nullable(),
    startedAt: dateTime.nullable(),
    resumedAt: dateTime.nullable(),
    preservedEvidence: z.boolean(),
    nextReviewCondition: z.boolean(),
    cleanupPending: z.boolean(),
    observation: z
      .object({
        phase: z.enum([
          "active-process",
          "local-candidate",
          "dependency-block",
          "approval-tool-block",
          "unknown",
        ]),
        observedAt: dateTime.nullable(),
        evidence: z.boolean(),
      })
      .strict(),
  })
  .strict();
export const flowSchema = z
  .object({
    coordination: coordinationSchema,
    researchBuffer: z.array(z.number().int().positive()),
    retained: z.array(retainedWorkSchema),
  })
  .strict();
export type DeliveryFlow = z.infer<typeof flowSchema>;

function age(at: string | null, now: string) {
  if (at === null || Date.parse(at) > Date.parse(now)) return null;
  return Date.parse(now) - Date.parse(at);
}

/** Known inventory, not a claim that every historical branch has been discovered. */
export function groomingReport(snapshot: DeliverySnapshot) {
  const records = new Map(
    snapshot.flow?.retained.map((record) => [record.issue, record]),
  );
  const items = new Map(snapshot.items.map((item) => [item.number, item]));
  const numbers = new Set(records.keys());
  for (const item of snapshot.items) {
    if (
      ["In progress", "In review", "Blocked"].includes(item.status) ||
      item.linkedPullRequestStates?.includes("OPEN") ||
      item.ownershipEvidence
    )
      numbers.add(item.number);
  }
  const inventory = [...numbers]
    .sort((a, b) => a - b)
    .map((issue) =>
      inventoryRow(
        issue,
        records.get(issue),
        items.get(issue),
        snapshot.capturedAt,
      ),
    );
  return {
    mode: snapshot.flow?.coordination.mode ?? "unknown",
    selectedUnfinished: inventory.filter(
      (row) => row.disposition === "selected" && !row.complete,
    ).length,
    startedUnmerged: inventory.filter((row) => row.started && !row.complete)
      .length,
    unknownStart: inventory.filter(
      (row) => row.started === null && !row.complete,
    ).length,
    unfinished: inventory.filter((row) => !row.complete).length,
    parked: inventory.filter((row) => row.disposition === "parked").length,
    researchPrepared: snapshot.flow?.researchBuffer.length ?? 0,
    inventory,
  };
}

type RetainedWork = DeliveryFlow["retained"][number];
type InventoryRow = ReturnType<typeof inventoryRow>;
type AddFinding = (code: string, message: string, item?: number) => void;

function observedPhase(
  record: RetainedWork | undefined,
  evidenceAgeMs: number | null,
) {
  if (!record?.observation.evidence) return "unknown";
  const phase = record.observation.phase;
  return phase === "active-process" &&
    (evidenceAgeMs === null || evidenceAgeMs > 60_000)
    ? "unknown"
    : phase;
}

function hasStarted(
  item: DeliveryItem | undefined,
  record: RetainedWork | undefined,
) {
  if (
    record?.started === true ||
    record?.startedAt ||
    record?.resumedAt ||
    (record?.observation.evidence &&
      record.observation.phase === "active-process") ||
    item?.ownershipEvidence === true ||
    item?.linkedPullRequestStates?.includes("OPEN") === true ||
    ["In progress", "In review"].includes(item?.status ?? "")
  )
    return true;
  return record?.started ?? null;
}

function inventoryRow(
  issue: number,
  record: RetainedWork | undefined,
  item: DeliveryItem | undefined,
  capturedAt: string,
) {
  const openPr = item?.linkedPullRequestStates?.includes("OPEN") ?? null;
  const started = hasStarted(item, record);
  // Private flags or a closed implementation issue cannot prove a merge.
  const integrated =
    !openPr &&
    item?.state !== "OPEN" &&
    (item?.state === "MERGED" ||
      item?.linkedPullRequestStates?.includes("MERGED") === true);
  const complete =
    integrated || (started === false && item?.state === "CLOSED");
  const disposition = record?.disposition ?? "unclassified";
  const evidenceAgeMs = age(record?.observation.observedAt ?? null, capturedAt);
  const evidencePhase = observedPhase(record, evidenceAgeMs);
  let phase: string = evidencePhase;
  if (openPr) phase = "open-pr";
  if (disposition === "parked") phase = "parked";
  return {
    issue,
    disposition,
    phase,
    evidencePhase,
    openPr,
    started,
    complete,
    cleanupPending: record?.cleanupPending ?? false,
    evidenceAgeMs,
    startedAgeMs: age(record?.startedAt ?? null, capturedAt),
  };
}

function auditCapacity(
  snapshot: DeliverySnapshot,
  flow: DeliveryFlow,
  add: AddFinding,
) {
  const report = groomingReport(snapshot);
  if (report.selectedUnfinished > deliveryFlowLimits.selected)
    add(
      "TRANCHE_LIMIT",
      `${report.selectedUnfinished} selected unfinished issues exceed the limit of 3; preserve excess work and resolve selection explicitly.`,
    );
  if (flow.researchBuffer.length > deliveryFlowLimits.research)
    add(
      "RESEARCH_BUFFER_LIMIT",
      `${flow.researchBuffer.length} prepared issues exceed the separate research buffer limit of 3.`,
    );
  if (new Set(flow.researchBuffer).size !== flow.researchBuffer.length)
    add(
      "RESEARCH_BUFFER_DUPLICATE",
      "Prepared research issues must be unique.",
    );
  if (
    new Set(flow.retained.map((record) => record.issue)).size !==
    flow.retained.length
  )
    add("RETAINED_DUPLICATE", "Retained issue records must be unique.");
  if (Date.parse(flow.coordination.changedAt) > Date.parse(snapshot.capturedAt))
    add("MODE_FUTURE", "Coordination mode evidence is in the future.");
  for (const issue of flow.researchBuffer) {
    const item =
      snapshot.backlogIssues?.find((candidate) => candidate.number === issue) ??
      snapshot.items.find((candidate) => candidate.number === issue);
    if (item?.state !== "OPEN")
      add(
        "RESEARCH_BUFFER_ISSUE",
        `#${issue} needs an authoritative open issue for prepared research.`,
        issue,
      );
  }
}

function auditDisposition(
  record: RetainedWork,
  item: DeliveryItem | undefined,
  row: InventoryRow,
  add: AddFinding,
) {
  const issue = record.issue;
  if (record.disposition !== "unclassified" && !record.decisionEvidence)
    add(
      "DISPOSITION_EVIDENCE",
      `#${issue} lacks explicit disposition evidence.`,
      issue,
    );
  if (item?.ownershipEvidence && item.status === "Backlog")
    add(
      "ASSIGNMENT_STATUS",
      `#${issue} has active ownership outside an active or blocked Project state.`,
      issue,
    );
  if (record.disposition !== "parked") return;
  if (!row.complete && hasExecutionEvidence(item, row))
    add(
      "PARKED_EXECUTION",
      `#${issue} has active execution evidence while parked; reconcile its disposition without hiding resumed work.`,
      issue,
    );
  if (!record.preservedEvidence || !record.nextReviewCondition)
    add(
      "PARKING_EVIDENCE",
      `#${issue} requires preserved evidence and a next review condition.`,
      issue,
    );
  if (item && !["Backlog", "Blocked", "Done"].includes(item.status))
    add(
      "PARKED_STATUS",
      `#${issue} is parked but remains in the execution queue.`,
      issue,
    );
}

function auditRecordTimes(
  record: RetainedWork,
  row: InventoryRow,
  capturedAt: string,
  add: AddFinding,
) {
  for (const at of [
    record.decisionAt,
    record.startedAt,
    record.resumedAt,
    record.observation.observedAt,
  ]) {
    if (at && Date.parse(at) > Date.parse(capturedAt))
      add(
        "FLOW_FUTURE",
        `#${row.issue} has future record evidence.`,
        row.issue,
      );
  }
  if (
    record.started === false &&
    (record.startedAt || record.resumedAt || row.started)
  )
    add(
      "START_EVIDENCE_DRIFT",
      `#${row.issue} has start evidence but is declared not started.`,
      row.issue,
    );
}

function hasExecutionEvidence(
  item: DeliveryItem | undefined,
  row: InventoryRow,
) {
  return (
    item?.ownershipEvidence === true ||
    row.evidencePhase === "active-process" ||
    ["In progress", "In review"].includes(item?.status ?? "")
  );
}

function auditPause(
  flow: DeliveryFlow,
  record: RetainedWork,
  row: InventoryRow,
  item: DeliveryItem | undefined,
  add: AddFinding,
) {
  if (flow.coordination.mode !== "user-paused" || row.complete) return;
  const pausedAt = Date.parse(flow.coordination.changedAt);
  const postPauseActivity = [record.startedAt, record.resumedAt].some(
    (at) => at !== null && Date.parse(at) >= pausedAt,
  );
  const executing = hasExecutionEvidence(item, row);
  const missingPriorStart =
    !record.startedAt &&
    ((row.started === true && record.disposition === "selected") || executing);
  if (postPauseActivity || missingPriorStart)
    add(
      "PAUSED_START",
      `#${row.issue} has a post-pause start/resumption or lacks required evidence of a prior start.`,
      row.issue,
    );
  if (!flow.coordination.finishStarted && executing)
    add(
      "PAUSED_COMPLETION",
      `#${row.issue} remains active while the actual pause instruction does not permit completion.`,
      row.issue,
    );
}

export function auditDeliveryFlow(
  snapshot: DeliverySnapshot,
): DeliveryFinding[] {
  const findings: DeliveryFinding[] = [];
  const add: AddFinding = (code, message, item) =>
    findings.push({ code, message, ...(item ? { item } : {}) });
  const flow = snapshot.flow;
  if (!flow) {
    add(
      "FLOW_UNAVAILABLE",
      "Explicit delivery selection, parking, and coordination mode are missing; migrate the snapshot/private state.",
    );
    return findings;
  }
  auditCapacity(snapshot, flow, add);
  for (const row of groomingReport(snapshot).inventory) {
    const record = flow.retained.find(
      (candidate) => candidate.issue === row.issue,
    );
    const item = snapshot.items.find(
      (candidate) => candidate.number === row.issue,
    );
    if (!item)
      add(
        "RETAINED_ISSUE_UNAVAILABLE",
        `#${row.issue} lacks authoritative retained issue state.`,
        row.issue,
      );
    if (row.disposition === "unclassified" && !row.complete)
      add(
        "UNFINISHED_UNCLASSIFIED",
        `#${row.issue} requires explicit selection or parking; it remains in unfinished inventory.`,
        row.issue,
      );
    if (!record) continue;
    auditDisposition(record, item, row, add);
    auditRecordTimes(record, row, snapshot.capturedAt, add);
    auditPause(flow, record, row, item, add);
  }
  return findings;
}
