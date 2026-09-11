import { parseArgs } from "node:util";
import { z } from "zod";
import {
  executionHandoff,
  executionHandoffMarkdown,
} from "./execution-handoff.ts";
import { executionMarkdown, executionStatus } from "./execution-report.ts";
import { recordExecution } from "./execution-runner.ts";
import { commandNameSchema } from "./execution-schema.ts";

const argumentsSchema = z
  .object({
    store: z.string().min(1),
    "private-state": z.string().min(1),
    issue: z.coerce.number().int().positive().safe(),
    command: commandNameSchema.optional(),
    file: z.array(z.string()).optional(),
    format: z.enum(["json", "markdown"]).default("json"),
    private: z.boolean().optional(),
    handoff: z.boolean().optional(),
    refresh: z.boolean().optional(),
    pr: z.coerce.number().int().positive().safe().optional(),
    "hosted-source": z
      .string()
      .regex(/^[0-9a-f]{40}$/)
      .optional(),
    authorization: z.enum(["operator-confirmed", "not-recorded"]).optional(),
    reason: z
      .enum([
        "APPROVAL_REPORTED_DENIED",
        "CAPABILITY_REPORTED_UNAVAILABLE",
        "USER_PAUSED",
      ])
      .optional(),
  })
  .strict();
type Arguments = z.infer<typeof argumentsSchema>;
function parseInput() {
  const parsed = parseArgs({
    options: {
      store: { type: "string" },
      "private-state": { type: "string" },
      issue: { type: "string" },
      command: { type: "string" },
      file: { type: "string", multiple: true },
      format: { type: "string" },
      private: { type: "boolean" },
      handoff: { type: "boolean" },
      refresh: { type: "boolean" },
      pr: { type: "string" },
      "hosted-source": { type: "string" },
      authorization: { type: "string" },
      reason: { type: "string" },
    },
    allowPositionals: true,
    strict: true,
  });
  const mode = z
    .tuple([z.enum(["run", "status", "note"])])
    .parse(parsed.positionals)[0];
  const values = argumentsSchema.parse(parsed.values);
  if (values.private && values.format !== "json" && !values.handoff)
    throw new Error("EXECUTION_ARGUMENT");
  validateMode(mode, values);
  return { mode, values };
}
function validateMode(mode: "run" | "status" | "note", values: Arguments) {
  if (
    values.handoff &&
    (mode !== "status" || !values.private || values.refresh)
  )
    throw new Error("EXECUTION_ARGUMENT");
  const hosted =
    values.pr !== undefined || values["hosted-source"] !== undefined;
  if (hosted && !values.refresh) throw new Error("EXECUTION_ARGUMENT");
  if (mode === "status") {
    if (
      [values.command, values.file, values.authorization, values.reason].some(
        (value) => value !== undefined,
      )
    )
      throw new Error("EXECUTION_ARGUMENT");
    return;
  }
  if (values.refresh || hosted || !values.command)
    throw new Error("EXECUTION_ARGUMENT");
  if ((mode === "note") !== (values.reason !== undefined))
    throw new Error("EXECUTION_ARGUMENT");
}
function renderReport(
  report: Awaited<ReturnType<typeof executionStatus>>,
  values: Arguments,
) {
  const handoff = values.handoff
    ? executionHandoff(report, values.store)
    : null;
  return handoff
    ? values.format === "markdown"
      ? executionHandoffMarkdown(handoff)
      : JSON.stringify(handoff, null, 2)
    : values.format === "markdown"
      ? executionMarkdown(report)
      : JSON.stringify(report, null, 2);
}
async function main() {
  const { mode, values } = parseInput();
  const shared = {
    store: values.store,
    privateState: values["private-state"],
    issue: values.issue,
  };
  let exitCode = 0;
  if (mode !== "status") {
    const result = await recordExecution({
      ...shared,
      command: values.command as string,
      ...(values.file ? { files: values.file } : {}),
      ...(values.authorization ? { authorization: values.authorization } : {}),
      ...(values.reason ? { note: values.reason } : {}),
    });
    exitCode = result.exitCode;
  }
  const report = await executionStatus({
    ...shared,
    ...(values.private ? { privateOutput: true } : {}),
    ...(values.refresh ? { refresh: true } : {}),
    ...(values.pr ? { pullRequest: values.pr } : {}),
    ...(values["hosted-source"]
      ? { hostedSource: values["hosted-source"] }
      : {}),
  });
  const output = renderReport(report, values);
  if (Buffer.byteLength(output) > 1024 * 1024)
    throw new Error("EXECUTION_OUTPUT_LIMIT");
  process.stdout.write(`${output}\n`);
  process.exitCode = exitCode;
}
main().catch(() => {
  // Parsing, filesystem and transport exceptions can contain private identities.
  process.stdout.write(
    '{"schemaVersion":1,"kind":"execution-status","phase":"unknown","code":"EXECUTION_UNAVAILABLE","nextAction":"Inspect arguments and private storage; preserved events remain authoritative."}\n',
  );
  process.exitCode = 2;
});
