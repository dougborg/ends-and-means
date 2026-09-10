import { createHash, randomUUID } from "node:crypto";
import {
  closeSync,
  constants,
  fstatSync,
  fsyncSync,
  linkSync,
  lstatSync,
  mkdirSync,
  opendirSync,
  openSync,
  readSync,
  realpathSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { assertCommandIdentity } from "./execution-commands.ts";
import {
  type ExecutionEvent,
  type ExecutionPayload,
  executionEventSchema,
  executionLimits,
  runIdSchema,
} from "./execution-schema.ts";

export function privateDirectory(path: string) {
  if (!isAbsolute(path)) throw new Error("EXECUTION_STORAGE_ABSOLUTE_REQUIRED");
  const absolute = resolve(path);
  if (realpathSync(absolute) !== absolute)
    throw new Error("EXECUTION_STORAGE_REDIRECTED");
  const stat = lstatSync(absolute);
  if (
    !stat.isDirectory() ||
    stat.isSymbolicLink() ||
    stat.uid !== process.getuid?.() ||
    (stat.mode & 0o077) !== 0
  )
    throw new Error("EXECUTION_STORAGE_PRIVATE_REQUIRED");
  return absolute;
}
export function initializeExecutionStore(path: string, worktree: string) {
  const absolute = resolve(path);
  const within = relative(realpathSync(worktree), absolute);
  if (
    !isAbsolute(path) ||
    !within ||
    (within !== ".." && !within.startsWith(`..${sep}`) && !isAbsolute(within))
  )
    throw new Error("EXECUTION_STORAGE_OUTSIDE_WORKTREE_REQUIRED");
  const parent = realpathSync(dirname(absolute));
  if (parent !== dirname(absolute))
    throw new Error("EXECUTION_STORAGE_REDIRECTED");
  try {
    mkdirSync(absolute, { mode: 0o700 });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
  }
  return privateDirectory(absolute);
}
export function boundedEntries(path: string, limit: number) {
  const entries: string[] = [];
  const directory = opendirSync(path);
  try {
    for (
      let entry = directory.readSync();
      entry;
      entry = directory.readSync()
    ) {
      if (entries.length === limit) throw new Error("EXECUTION_STORAGE_LIMIT");
      entries.push(entry.name);
    }
  } finally {
    directory.closeSync();
  }
  return entries.sort();
}
export function readExecutionFile(
  path: string,
  limit: number = executionLimits.eventBytes,
) {
  const descriptor = openSync(
    path,
    constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK,
  );
  try {
    const stat = fstatSync(descriptor);
    if (
      !stat.isFile() ||
      stat.uid !== process.getuid?.() ||
      (stat.mode & 0o077) !== 0 ||
      stat.size > limit
    )
      throw new Error("EXECUTION_FILE_INVALID");
    const buffer = Buffer.alloc(limit + 1);
    let length = 0;
    while (length < buffer.length) {
      const count = readSync(
        descriptor,
        buffer,
        length,
        buffer.length - length,
        null,
      );
      if (count === 0) break;
      length += count;
    }
    if (length > limit) throw new Error("EXECUTION_STORAGE_LIMIT");
    return buffer.subarray(0, length).toString("utf8");
  } finally {
    closeSync(descriptor);
  }
}
export function eventDigest(event: ExecutionEvent) {
  return createHash("sha256").update(JSON.stringify(event)).digest("hex");
}
function syncDirectory(path: string) {
  const fd = openSync(
    path,
    constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW,
  );
  try {
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
}

export function createExecutionRun(store: string) {
  privateDirectory(store);
  const lock = join(store, ".allocation");
  try {
    mkdirSync(lock, { mode: 0o700 });
  } catch {
    throw new Error("EXECUTION_ALLOCATION_BUSY");
  }
  try {
    if (
      boundedEntries(store, executionLimits.runs + 1).filter(
        (name) => name !== ".allocation",
      ).length >= executionLimits.runs
    )
      throw new Error("EXECUTION_STORAGE_LIMIT");
    const runId = randomUUID();
    mkdirSync(join(store, runId), { mode: 0o700 });
    syncDirectory(store);
    return runId;
  } finally {
    rmdirSync(lock);
    syncDirectory(store);
  }
}

export function appendExecutionEvent(
  store: string,
  runId: string,
  prior: ExecutionEvent | null,
  payload: ExecutionPayload,
  now = new Date(),
): ExecutionEvent {
  privateDirectory(store);
  runIdSchema.parse(runId);
  const directory = privateDirectory(join(store, runId));
  const sequence = prior ? prior.sequence + 1 : 0;
  const event = executionEventSchema.parse({
    schemaVersion: 1,
    runId,
    sequence,
    previous: prior ? eventDigest(prior) : null,
    observedAt: now.toISOString(),
    payload,
  });
  if (
    prior &&
    (prior.runId !== runId ||
      Date.parse(event.observedAt) < Date.parse(prior.observedAt))
  )
    throw new Error("EXECUTION_EVENT_CONFLICT");
  if (prior) {
    const actual = JSON.parse(
      readExecutionFile(
        join(directory, `${String(prior.sequence).padStart(4, "0")}.json`),
      ),
    );
    if (eventDigest(executionEventSchema.parse(actual)) !== event.previous)
      throw new Error("EXECUTION_EVENT_CONFLICT");
  }
  const history = readExecutionRun(store, runId);
  if (history.length !== sequence) throw new Error("EXECUTION_EVENT_CONFLICT");
  validateHistory([...history, event], runId);
  const raw = `${JSON.stringify(event)}\n`;
  if (Buffer.byteLength(raw) > executionLimits.eventBytes)
    throw new Error("EXECUTION_STORAGE_LIMIT");
  const temporary = join(directory, `.pending-${randomUUID()}`);
  const fd = openSync(
    temporary,
    constants.O_WRONLY |
      constants.O_CREAT |
      constants.O_EXCL |
      constants.O_NOFOLLOW,
    0o600,
  );
  try {
    writeFileSync(fd, raw);
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
  try {
    linkSync(
      temporary,
      join(directory, `${String(sequence).padStart(4, "0")}.json`),
    );
    syncDirectory(directory);
  } catch {
    throw new Error("EXECUTION_EVENT_CONFLICT_OR_STORAGE_FAILURE");
  } finally {
    unlinkSync(temporary);
  }
  return event;
}

export function readExecutionRun(
  store: string,
  runId: string,
): ExecutionEvent[] {
  privateDirectory(store);
  runIdSchema.parse(runId);
  const directory = privateDirectory(join(store, runId));
  const names = boundedEntries(directory, executionLimits.events + 8);
  const eventNames = names.filter((name) => /^\d{4}\.json$/.test(name));
  if (
    names.some(
      (name) =>
        !/^\d{4}\.json$|^output\.log$|^\.pending-[0-9a-f-]+$/.test(name),
    )
  )
    throw new Error("EXECUTION_STORAGE_INVALID");
  const events = eventNames.map((name) => {
    const event = executionEventSchema.parse(
      JSON.parse(readExecutionFile(join(directory, name))),
    );
    if (name !== `${String(event.sequence).padStart(4, "0")}.json`)
      throw new Error("EXECUTION_HISTORY_INVALID");
    return event;
  });
  validateHistory(events, runId);
  return events;
}

function validateChain(
  event: ExecutionEvent,
  prior: ExecutionEvent | null,
  runId: string,
  terminal: boolean,
) {
  if (
    terminal ||
    event.runId !== runId ||
    event.sequence !== (prior ? prior.sequence + 1 : 0) ||
    event.previous !== (prior ? eventDigest(prior) : null)
  )
    throw new Error("EXECUTION_HISTORY_INVALID");
  if (prior && Date.parse(event.observedAt) < Date.parse(prior.observedAt))
    throw new Error("EXECUTION_HISTORY_INVALID");
  if ((prior === null) !== (event.payload.kind === "prepared"))
    throw new Error("EXECUTION_HISTORY_INVALID");
}
function validateFinished(
  payload: Extract<ExecutionPayload, { kind: "finished" }>,
  nonce: string | null,
) {
  if (!nonce && payload.result !== "launch-failed")
    throw new Error("EXECUTION_HISTORY_INVALID");
  if (
    payload.result === "success" &&
    (payload.exitCode !== 0 ||
      payload.signal !== null ||
      payload.reason !== "NONE")
  )
    throw new Error("EXECUTION_HISTORY_INVALID");
  if (
    payload.result === "failure" &&
    (payload.exitCode === null ||
      payload.exitCode === 0 ||
      payload.signal !== null)
  )
    throw new Error("EXECUTION_HISTORY_INVALID");
  if (
    payload.result === "launch-failed" &&
    (nonce !== null || payload.exitCode !== null || payload.signal !== null)
  )
    throw new Error("EXECUTION_HISTORY_INVALID");
}
function advanceNonce(payload: ExecutionPayload, nonce: string | null) {
  if (payload.kind === "prepared") assertCommandIdentity(payload.command);
  if (payload.kind === "spawned") {
    if (nonce) throw new Error("EXECUTION_HISTORY_INVALID");
    return payload.nonce;
  }
  if (payload.kind === "heartbeat" && payload.nonce !== nonce)
    throw new Error("EXECUTION_HISTORY_INVALID");
  if (payload.kind === "not-started" && nonce)
    throw new Error("EXECUTION_HISTORY_INVALID");
  if (payload.kind === "finished") validateFinished(payload, nonce);
  return nonce;
}
function validateHistory(events: ExecutionEvent[], runId: string) {
  let prior: ExecutionEvent | null = null;
  let nonce: string | null = null;
  let terminal = false;
  for (const event of events) {
    validateChain(event, prior, runId, terminal);
    nonce = advanceNonce(event.payload, nonce);
    terminal =
      event.payload.kind === "finished" || event.payload.kind === "not-started";
    prior = event;
  }
}
