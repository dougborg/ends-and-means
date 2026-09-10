import { join } from "node:path";
import {
  configurationFindings,
  runtimeObservation,
  toolchainFindings,
} from "./environment-runtime.ts";
import { runExecutionChild } from "./execution-child.ts";
import { executionCommand } from "./execution-commands.ts";
import {
  currentExecutionAssignment,
  executionEnvironment,
  newVerifiedArtifact,
  receiptNames,
} from "./execution-context.ts";
import type {
  EnvironmentEvidence,
  ExecutionAssignment,
  ExecutionCommand,
  ExecutionEvent,
  ExecutionPayload,
} from "./execution-schema.ts";
import {
  appendExecutionEvent,
  createExecutionRun,
  initializeExecutionStore,
} from "./execution-store.ts";

export interface ExecutionOptions {
  store: string;
  privateState: string;
  issue: number;
  command: string;
  files?: string[];
  authorization?: "operator-confirmed" | "not-recorded";
  note?:
    | "APPROVAL_REPORTED_DENIED"
    | "CAPABILITY_REPORTED_UNAVAILABLE"
    | "USER_PAUSED";
}

function launchBlocker(
  command: ExecutionCommand,
  root: string,
  assignment: ExecutionAssignment | null,
  environment: EnvironmentEvidence | null,
) {
  if (!assignment) return "OWNERSHIP_UNAVAILABLE";
  if (!environment) return "ENVIRONMENT_UNAVAILABLE";
  if (command.name === "readiness") return null;
  const findings = [
    ...toolchainFindings(root, runtimeObservation()),
    ...configurationFindings(
      command.scope === "full-local" ? "verify" : "focused",
    ),
  ];
  return findings.length ? "ENVIRONMENT_UNAVAILABLE" : null;
}
function ownedAssignment(options: ExecutionOptions, root: string) {
  try {
    return currentExecutionAssignment(
      options.privateState,
      options.issue,
      root,
    );
  } catch {
    return null;
  }
}
async function finishExecution(
  options: ExecutionOptions,
  root: string,
  command: ExecutionCommand,
  before: string[],
  runId: string,
  environment: EnvironmentEvidence | null,
  outcome: Awaited<ReturnType<typeof runExecutionChild>>,
  append: (payload: ExecutionPayload) => void,
) {
  const finish = await executionEnvironment(root);
  const endingAssignment = ownedAssignment(options, root)?.identity ?? null;
  const receipt =
    command.scope === "full-local" &&
    outcome.result === "success" &&
    environment &&
    finish
      ? newVerifiedArtifact(root, before, environment, finish, runId)
      : null;
  append({
    kind: "finished",
    ...outcome,
    environment: finish,
    assignmentIdentity: endingAssignment,
    receipt,
  });
}
export async function recordExecution(
  options: ExecutionOptions,
  root = process.cwd(),
) {
  const command = executionCommand(options.command, options.files);
  const store = initializeExecutionStore(options.store, root);
  const runId = createExecutionRun(store);
  let prior: ExecutionEvent | null = null;
  const append = (payload: ExecutionPayload) => {
    prior = appendExecutionEvent(store, runId, prior, payload);
  };
  const assignment = ownedAssignment(options, root);
  const environment = await executionEnvironment(root);
  append({
    kind: "prepared",
    issue: options.issue,
    command,
    assignment,
    environment,
    authorization: options.authorization ?? "not-recorded",
    log: "output.log",
  });
  const refusal =
    options.note ?? launchBlocker(command, root, assignment, environment);
  if (refusal) {
    append({
      kind: "not-started",
      reason: refusal,
      enforcement: options.note ? "operator-report" : "local-precondition",
    });
    return { runId, exitCode: 2 };
  }
  let before: string[];
  try {
    before = command.scope === "full-local" ? receiptNames(root) : [];
  } catch {
    append({
      kind: "not-started",
      reason: "RECORDER_FAILURE",
      enforcement: "local-precondition",
    });
    return { runId, exitCode: 2 };
  }
  let outcome: Awaited<ReturnType<typeof runExecutionChild>>;
  try {
    outcome = await runExecutionChild(
      command.argv,
      root,
      join(store, runId, "output.log"),
      append,
      runId,
    );
  } catch {
    append({
      kind: "not-started",
      reason: "RECORDER_FAILURE",
      enforcement: "local-precondition",
    });
    return { runId, exitCode: 2 };
  }
  await finishExecution(
    options,
    root,
    command,
    before,
    runId,
    environment,
    outcome,
    append,
  );
  return {
    runId,
    exitCode: outcome.result === "success" ? 0 : outcome.exitCode || 1,
  };
}
