import {
  commandNameSchema,
  type ExecutionCommand,
} from "./execution-schema.ts";

const definitions: Record<
  Exclude<ExecutionCommand["name"], "focused-test" | "focused-coverage">,
  { argv: string[]; scope: ExecutionCommand["scope"] }
> = {
  readiness: { argv: ["pnpm", "environment:check"], scope: "readiness" },
  verify: { argv: ["pnpm", "verify"], scope: "full-local" },
  build: { argv: ["pnpm", "build"], scope: "build" },
  test: { argv: ["pnpm", "test"], scope: "automated-test" },
  coverage: { argv: ["pnpm", "test:coverage"], scope: "automated-test" },
  routes: { argv: ["pnpm", "test:routes"], scope: "automated-test" },
  browser: { argv: ["pnpm", "test:visual"], scope: "automated-test" },
  delivery: {
    argv: ["pnpm", "audit:delivery", "--", "--repository-only"],
    scope: "repository-audit",
  },
};
export function executionCommand(
  name: string,
  files: string[] = [],
): ExecutionCommand {
  const command = commandNameSchema.parse(name);
  if (command !== "focused-test" && command !== "focused-coverage") {
    if (files.length) throw new Error("EXECUTION_ARGUMENT");
    return {
      name: command,
      ...definitions[command],
      argv: [...definitions[command].argv],
    };
  }
  if (
    !files.length ||
    files.length > 6 ||
    files.some(
      (file) =>
        !/^tests\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.test\.ts$/.test(file),
    )
  )
    throw new Error("EXECUTION_ARGUMENT");
  return {
    name: command,
    scope: "focused",
    argv: [
      "pnpm",
      "exec",
      "vitest",
      "run",
      ...files,
      ...(command === "focused-coverage" ? ["--coverage"] : []),
    ],
  };
}

export function assertCommandIdentity(command: ExecutionCommand) {
  const files =
    command.name === "focused-test"
      ? command.argv.slice(4)
      : command.name === "focused-coverage"
        ? command.argv.slice(4, -1)
        : [];
  const expected = executionCommand(command.name, files);
  if (
    expected.scope !== command.scope ||
    JSON.stringify(expected.argv) !== JSON.stringify(command.argv)
  )
    throw new Error("EXECUTION_COMMAND_IDENTITY");
}
