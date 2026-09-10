import {
  currentExecutionAssignment,
  executionEnvironment,
} from "./execution-context.ts";
import {
  type HostedObservation,
  refreshExecutionEvidence,
} from "./execution-refresh.ts";
import {
  type EnvironmentEvidence,
  type ExecutionAssignment,
  type ExecutionEvent,
  executionLimits,
} from "./execution-schema.ts";
import {
  boundedEntries,
  privateDirectory,
  readExecutionRun,
} from "./execution-store.ts";

function age(at: string, now: Date) {
  const value = now.getTime() - Date.parse(at);
  return value >= 0 ? value : null;
}
function identityBlock(
  start: Extract<ExecutionEvent["payload"], { kind: "prepared" }>,
  end: Extract<ExecutionEvent["payload"], { kind: "finished" }>,
  assignment: ExecutionAssignment | null,
  environment: EnvironmentEvidence | null,
) {
  if (
    !assignment ||
    assignment.identity !== start.assignment?.identity ||
    end.assignmentIdentity !== assignment.identity
  )
    return "OWNERSHIP_UNAVAILABLE";
  if (!start.environment || !end.environment || !environment)
    return "ENVIRONMENT_UNAVAILABLE";
  const sources = [
    start.environment.source,
    end.environment.source,
    environment.source,
  ];
  if (
    sources.some(
      (source) =>
        !source.commit || source.dirty !== false || !source.inputDigest,
    ) ||
    sources.some(
      (source) => JSON.stringify(source) !== JSON.stringify(sources[0]),
    )
  )
    return "INPUT_CHANGED";
  if (
    start.environment.identity !== end.environment.identity ||
    end.environment.identity !== environment.identity
  )
    return "ENVIRONMENT_CHANGED";
  if (
    start.command.scope === "full-local" &&
    (!end.receipt ||
      end.receipt.commit !== environment.source.commit ||
      end.receipt.environmentIdentity !== environment.identity ||
      end.receipt.sourceInputDigest !== environment.source.inputDigest)
  )
    return "RECEIPT_UNAVAILABLE";
  return "NONE";
}

type Prepared = Extract<ExecutionEvent["payload"], { kind: "prepared" }>;
type Finished = Extract<ExecutionEvent["payload"], { kind: "finished" }>;
const unknownOutcome = {
  phase: "unknown",
  blocker: "COMPLETION_UNKNOWN",
  commandPassed: false,
  exactHeadPass: false,
};
function finishedOutcome(
  start: Prepared,
  end: Finished,
  assignment: ExecutionAssignment | null,
  environment: EnvironmentEvidence | null,
) {
  const phases = {
    interrupted: "interrupted",
    "launch-failed": "launch-failed",
    success: "completed-command",
    failure: "completed-command",
  };
  const commandPassed = end.result === "success" && end.exitCode === 0;
  const blocker = commandPassed
    ? identityBlock(start, end, assignment, environment)
    : end.reason;
  const fullReady =
    start.command.scope === "full-local" &&
    start.environment?.readiness === "locally-ready" &&
    end.environment?.readiness === "locally-ready";
  return {
    phase: phases[end.result],
    commandPassed,
    blocker,
    exactHeadPass: commandPassed && blocker === "NONE" && fullReady,
  };
}
function currentOutcome(
  start: Prepared,
  end: ExecutionEvent["payload"],
  ageMs: number | null,
  assignment: ExecutionAssignment | null,
  environment: EnvironmentEvidence | null,
  now: Date,
) {
  if (ageMs === null) return unknownOutcome;
  if (end.kind === "finished")
    return finishedOutcome(start, end, assignment, environment);
  if (end.kind === "not-started")
    return { ...unknownOutcome, phase: "not-started", blocker: end.reason };
  if (end.kind !== "spawned" && end.kind !== "heartbeat") return unknownOutcome;
  const owned =
    assignment?.identity === start.assignment?.identity &&
    Date.parse(assignment?.expiresAt ?? "") > now.getTime();
  return owned && ageMs <= executionLimits.staleMs
    ? { ...unknownOutcome, phase: "active-process", blocker: "NONE" }
    : unknownOutcome;
}
function terminalEvidence(end: ExecutionEvent["payload"]) {
  if (end.kind !== "finished")
    return {
      endingCommit: null,
      exitCode: null,
      signal: null,
      logTruncated: null,
      artifact: null,
    };
  const artifact = end.receipt
    ? {
        sha256: end.receipt.artifact.sha256,
        files: end.receipt.artifact.files,
        commit: end.receipt.commit,
      }
    : null;
  return {
    endingCommit: end.environment?.source.commit ?? null,
    exitCode: end.exitCode,
    signal: end.signal,
    logTruncated: end.logTruncated,
    artifact,
  };
}
export function projectExecution(
  events: ExecutionEvent[],
  assignment: ExecutionAssignment | null,
  environment: EnvironmentEvidence | null,
  now = new Date(),
) {
  const first = events[0];
  const last = events.at(-1);
  if (first?.payload.kind !== "prepared" || !last)
    throw new Error("EXECUTION_HISTORY_INCOMPLETE");
  const start = first.payload;
  const end = last.payload;
  const ageMs = age(last.observedAt, now);
  const spawned = events.find((event) => event.payload.kind === "spawned");
  const terminal = end.kind === "finished" || end.kind === "not-started";
  const currentAssignment =
    assignment &&
    Date.parse(assignment.observedAt) <= now.getTime() &&
    Date.parse(assignment.expiresAt) > now.getTime()
      ? assignment
      : null;
  return {
    issue: start.issue,
    command: start.command.name,
    scope: start.command.scope,
    ...currentOutcome(start, end, ageMs, currentAssignment, environment, now),
    observedAt: last.observedAt,
    evidenceAgeMs: ageMs,
    inputCommit: start.environment?.source.commit ?? null,
    environmentIdentity: start.environment?.identity ?? null,
    ...terminalEvidence(end),
    elapsedMs:
      terminal && spawned
        ? Date.parse(last.observedAt) - Date.parse(spawned.observedAt)
        : null,
    observedRunningAgeMs:
      !terminal && spawned ? age(spawned.observedAt, now) : null,
    authorization: start.authorization,
    enforcement: end.kind === "not-started" ? end.enforcement : "not-inferred",
  };
}
export type ExecutionProjection = ReturnType<typeof projectExecution>;
const actions: Record<string, string> = {
  NONE: "Retain this observation; continue the next required gate.",
  COMPLETION_UNKNOWN:
    "Inspect the owned runner and preserved events; do not infer an exit or signal a historical PID.",
  OWNERSHIP_UNAVAILABLE:
    "Reconcile current assignment evidence before claiming current verification.",
  ENVIRONMENT_UNAVAILABLE:
    "Inspect the governed environment with the required capability.",
  INPUT_CHANGED: "Renew affected verification on the intended clean input.",
  ENVIRONMENT_CHANGED:
    "Reconcile environment identities and renew applicable evidence.",
  RECEIPT_UNAVAILABLE:
    "Inspect the full verification artifact receipt; an exit alone does not establish the artifact boundary.",
  APPROVAL_REPORTED_DENIED:
    "Resolve the reported enforcement block; existing authorization is a separate fact.",
  CAPABILITY_REPORTED_UNAVAILABLE:
    "Establish the required capability before another attempt.",
  USER_PAUSED: "Follow the explicit pause/resume instruction.",
  HOSTED_UNAVAILABLE:
    "Refresh hosted evidence with the required capability; unavailable is not clean.",
  HOSTED_PENDING:
    "Wait for the observed hosted checks to finish; retain the local result separately.",
  HOSTED_FAILED:
    "Inspect hosted check failures on the reported head before integration.",
  INTEGRATION_PENDING:
    "Obtain required independent review and integration evidence; checks alone do not authorize merge.",
  LAUNCH_FAILED:
    "Inspect executable or worktree availability before another launch.",
  COMMAND_FAILED:
    "Inspect the scoped command result; do not reinterpret nonzero exit as a full pass.",
  INTERRUPTED:
    "Preserve interruption evidence and establish the next explicit action.",
  RUN_TIMEOUT: "Inspect the bounded command failure before another attempt.",
  RECORDER_FAILURE:
    "Inspect private storage; do not infer missing terminal evidence.",
};

function readRuns(
  store: string,
  issue: number,
  assignment: ExecutionAssignment | null,
  environment: EnvironmentEvidence | null,
  observedAt: Date,
) {
  const runs: Array<{ events: ExecutionEvent[]; report: ExecutionProjection }> =
    [];
  let incompleteRuns = 0;
  for (const runId of boundedEntries(store, executionLimits.runs + 1)) {
    if (runId === ".allocation") {
      incompleteRuns++;
      continue;
    }
    const events = readExecutionRun(store, runId);
    if (!events.length) {
      incompleteRuns++;
      continue;
    }
    if (
      events[0]?.payload.kind === "prepared" &&
      events[0].payload.issue === issue
    )
      runs.push({
        events,
        report: projectExecution(events, assignment, environment, observedAt),
      });
  }
  runs.sort(
    (a, b) =>
      (a.events[0]?.observedAt ?? "").localeCompare(
        b.events[0]?.observedAt ?? "",
      ) || (a.events[0]?.runId ?? "").localeCompare(b.events[0]?.runId ?? ""),
  );
  return { runs, incompleteRuns };
}
function overallBlocker(
  latest: ExecutionProjection | null,
  hosted: HostedObservation,
  incomplete: number,
) {
  if (incomplete) return "COMPLETION_UNKNOWN";
  if (!latest) return "COMPLETION_UNKNOWN";
  if (latest.blocker !== "NONE" || hosted.source === "offline")
    return latest.blocker;
  const codes = {
    unavailable: "HOSTED_UNAVAILABLE",
    pending: "HOSTED_PENDING",
    failed: "HOSTED_FAILED",
    "checks-passed": "INTEGRATION_PENDING",
  };
  return codes[hosted.status];
}
export async function executionStatus(
  options: {
    store: string;
    issue: number;
    privateState: string;
    refresh?: boolean;
    pullRequest?: number;
    hostedSource?: string;
    privateOutput?: boolean;
  },
  root = process.cwd(),
) {
  privateDirectory(options.store);
  let assignment: ExecutionAssignment | null = null;
  try {
    assignment = currentExecutionAssignment(
      options.privateState,
      options.issue,
      root,
    );
  } catch {
    /* Unavailable ownership stays explicit. */
  }
  const environment = await executionEnvironment(root);
  const observedAt = new Date();
  const { runs, incompleteRuns } = readRuns(
    options.store,
    options.issue,
    assignment,
    environment,
    observedAt,
  );
  const latest = runs.at(-1)?.report ?? null;
  const hosted: HostedObservation = options.refresh
    ? refreshExecutionEvidence(options.pullRequest, options.hostedSource)
    : {
        source: "offline",
        observedAt: observedAt.toISOString(),
        status: "unavailable",
        code: "HOSTED_NOT_REQUESTED",
      };
  const blocker = overallBlocker(latest, hosted, incompleteRuns);
  const report = {
    schemaVersion: 1,
    kind: "execution-status",
    phaseVersion: 1,
    issue: options.issue,
    observedAt: observedAt.toISOString(),
    source: "local-event-log",
    phase: incompleteRuns ? "unknown" : (latest?.phase ?? "unknown"),
    current: latest,
    completedChecks: runs
      .filter((run) => run.report.commandPassed)
      .map((run) => ({
        command: run.report.command,
        scope: run.report.scope,
        observedAt: run.report.observedAt,
        exactHeadPass: run.report.exactHeadPass,
      })),
    attempts: runs.map((run) => run.report),
    incompleteRuns,
    ownershipAvailable: Boolean(assignment),
    hosted,
    blocker,
    nextAction: actions[blocker] ?? actions.COMPLETION_UNKNOWN,
    limits: [
      "Recent heartbeats prove a recorded observation, not perpetual liveness; PID alone is never ownership.",
      "Elapsed time covers recorded spawn to terminal capture; unknown historical intervals and time savings stay unknown.",
      "Command exit, full local verification, independent review, hosted checks, merge and deployment are separate evidence.",
      "Operator-reported authorization or denial is not a tool permission grant.",
    ],
  };
  return options.privateOutput
    ? {
        ...report,
        privateEvidence: runs.map((run) => ({
          runId: run.events[0]?.runId,
          events: run.events,
        })),
      }
    : report;
}

export function executionMarkdown(
  report: Awaited<ReturnType<typeof executionStatus>>,
) {
  const lines = [
    `Execution status for #${report.issue}: ${report.phase}`,
    "",
    `Observed: ${report.observedAt} (${report.source}).`,
    `Blocker: ${report.blocker}. ${report.nextAction}`,
    "",
    "| Command | Scope | Phase | Exit | Exact full PASS | Age (ms) | Elapsed (ms) |",
    "| --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const run of report.attempts)
    lines.push(
      `| ${run.command} | ${run.scope} | ${run.phase} | ${run.exitCode ?? "unknown"} | ${run.exactHeadPass ? "yes" : "no"} | ${run.evidenceAgeMs ?? "unknown"} | ${run.elapsedMs ?? "unknown"} |`,
    );
  lines.push(
    "",
    `Hosted: ${report.hosted.status}; ${report.hosted.code}; observed ${report.hosted.observedAt}.`,
    `Incomplete storage observations: ${report.incompleteRuns}.`,
  );
  return lines.join("\n");
}
