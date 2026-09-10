// Built-in Node bootstrap: missing dependencies must not print private loader paths.
try {
  await import("./record-execution.ts");
} catch {
  process.stdout.write(
    '{"schemaVersion":1,"kind":"execution-status","phase":"unknown","code":"EXECUTION_UNAVAILABLE","nextAction":"Inspect the governed runtime and task-owned dependencies; no execution was established."}\n',
  );
  process.exitCode = 2;
}
