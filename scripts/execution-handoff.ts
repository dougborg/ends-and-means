import { join } from "node:path";
import type { executionStatus } from "./execution-report.ts";

type Status = Awaited<ReturnType<typeof executionStatus>>;

/** Consume only the validated, bounded status projection; never reopen raw logs. */
export function executionHandoff(report: Status, store: string) {
  if (!("privateEvidence" in report))
    throw new Error("EXECUTION_PRIVATE_REQUIRED");
  const timeline = report.privateEvidence.map((evidence, index) => {
    const attempt = report.attempts[index];
    const first = evidence.events[0];
    const last = evidence.events.at(-1);
    if (!attempt || first?.payload.kind !== "prepared" || !last)
      throw new Error("EXECUTION_HISTORY_INCOMPLETE");
    const spawned = evidence.events.find(
      (event) => event.payload.kind === "spawned",
    );
    const finished = last.payload.kind === "finished";
    // A captured terminal observation can still have unknown process completion.
    const known =
      finished &&
      last.payload.kind === "finished" &&
      last.payload.reason !== "COMPLETION_UNKNOWN" &&
      attempt.evidenceAgeMs !== null &&
      spawned !== undefined;
    return {
      ...attempt,
      runId: first.runId,
      evidenceDirectory: join(store, first.runId),
      logReference: join(store, first.runId, first.payload.log),
      preparedAt: first.observedAt,
      spawnedAt: spawned?.observedAt ?? null,
      terminalObservedAt:
        finished || last.payload.kind === "not-started"
          ? last.observedAt
          : null,
      commandIntervalMs: known ? attempt.elapsedMs : null,
    };
  });
  const intervals = timeline
    .filter((entry) => entry.commandIntervalMs !== null)
    .map(
      (entry) =>
        [
          Date.parse(entry.spawnedAt as string),
          Date.parse(entry.terminalObservedAt as string),
        ] as const,
    )
    .sort((a, b) => a[0] - b[0]);
  let sum = 0;
  let union = 0;
  let priorEnd = -Infinity;
  for (const [start, end] of intervals) {
    sum += end - start;
    union += Math.max(0, end - Math.max(start, priorEnd));
    priorEnd = Math.max(priorEnd, end);
  }
  return {
    schemaVersion: 1,
    kind: "private-execution-handoff",
    issue: report.issue,
    observedAt: report.observedAt,
    phase: report.phase,
    ownershipAvailable: report.ownershipAvailable,
    current: report.current,
    latestRunId: timeline.at(-1)?.runId ?? null,
    blocker: report.blocker,
    nextAction: report.nextAction,
    incompleteRuns: report.incompleteRuns,
    timeline,
    timing: {
      knownCommandIntervals: intervals.length,
      unknownCommandIntervals: timeline.length - intervals.length,
      summedKnownCommandMs: intervals.length ? sum : null,
      unionKnownCommandMs: intervals.length ? union : null,
      overlappingKnownCommandMs: intervals.length ? sum - union : null,
      deliveryElapsedMs: null,
      hostedQueueMs: null,
      userPauseMs: null,
    },
    limits: [
      ...report.limits,
      "Current means the latest prepared attempt, not the most recently completed command or a complete delivery state.",
      "Known intervals cover spawn to terminal capture; summed time double-counts overlapping commands. Union counts each observed instant once; overlap is summed time minus union, not a lifecycle duration.",
      "Incomplete, unstarted and unconfirmed-completion commands have unknown intervals; known totals exclude them and are not total execution or delivery time.",
      "Selection, candidate, review, hosted queue, merge, cleanup and pause durations are not observed by these command records. No time savings are inferred.",
    ],
  };
}

export function executionHandoffMarkdown(
  report: ReturnType<typeof executionHandoff>,
) {
  const lines = [
    `Private command handoff for #${report.issue}: ${report.phase}`,
    "",
    `Observed: ${report.observedAt}. Ownership available: ${report.ownershipAvailable}.`,
    `Latest prepared run: ${report.latestRunId ?? "unknown"}.`,
    `Blocker: ${report.blocker}. ${report.nextAction}`,
    `Incomplete storage observations: ${report.incompleteRuns}.`,
    "",
    "| Run | Command | Scope | Phase | Blocker | Exit / signal | Exact full PASS | Evidence age (ms) | Spawn | Terminal capture | Interval (ms) |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];
  lines.push(...report.timeline.map(markdownRow));
  lines.push("", "Private evidence references:", "");
  for (const entry of report.timeline)
    lines.push(
      `- ${entry.runId}: events ${JSON.stringify(entry.evidenceDirectory)}; log ${JSON.stringify(entry.logReference)}; input ${entry.inputCommit ?? "unknown"}; environment ${entry.environmentIdentity ?? "unknown"}.`,
    );
  const timing = report.timing;
  lines.push(
    "",
    `Known command intervals: ${timing.knownCommandIntervals}; unknown: ${timing.unknownCommandIntervals}.`,
    `Known command time (ms): sum ${timing.summedKnownCommandMs ?? "unknown"}; union ${timing.unionKnownCommandMs ?? "unknown"}; overlap ${timing.overlappingKnownCommandMs ?? "unknown"}.`,
    "Delivery elapsed, hosted queue and user pause time: unknown.",
    "",
    ...report.limits.map((limit) => `- ${limit}`),
  );
  return lines.join("\n");
}

function markdownRow(
  entry: ReturnType<typeof executionHandoff>["timeline"][number],
) {
  return `| ${entry.runId} | ${entry.command} | ${entry.scope} | ${entry.phase} | ${entry.blocker} | ${entry.exitCode ?? "unknown"} / ${entry.signal ?? "none observed"} | ${entry.exactHeadPass ? "yes" : "no"} | ${entry.evidenceAgeMs ?? "unknown"} | ${entry.spawnedAt ?? "unknown"} | ${entry.terminalObservedAt ?? "unknown"} | ${entry.commandIntervalMs ?? "unknown"} |`;
}
