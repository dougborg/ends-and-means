import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { commitOidSchema } from "./delivery-api-schema.ts";

const markerKinds = {
  "copilot-unavailable": "Copilot review: UNAVAILABLE",
  "independent-approved": "Independent adversarial review: APPROVED",
} as const;

type MarkerKind = keyof typeof markerKinds;

type MarkerOptions = {
  head: string;
  kind: MarkerKind;
  output: string;
};

class MarkerInputError extends Error {}

function requiredValue(args: string[], index: number, option: string) {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new MarkerInputError(`${option} requires one value.`);
  }
  return value;
}

export function parseMarkerOptions(args: string[]): MarkerOptions {
  const values = new Map<string, string>();
  const allowed = new Set(["--head", "--kind", "--output"]);

  for (let index = 0; index < args.length; index += 2) {
    const option = args[index];
    if (!option || !allowed.has(option)) {
      throw new MarkerInputError(`Unknown option: ${option ?? "<missing>"}.`);
    }
    if (values.has(option)) {
      throw new MarkerInputError(`Duplicate option: ${option}.`);
    }
    values.set(option, requiredValue(args, index, option));
  }

  for (const option of allowed) {
    if (!values.has(option)) {
      throw new MarkerInputError(`Missing required option: ${option}.`);
    }
  }

  const kind = values.get("--kind") ?? "";
  if (!Object.hasOwn(markerKinds, kind)) {
    throw new MarkerInputError(
      "--kind must be independent-approved or copilot-unavailable.",
    );
  }

  const head = values.get("--head") ?? "";
  if (!commitOidSchema.safeParse(head).success) {
    throw new MarkerInputError(
      "--head must be an exact lowercase 40-hex commit OID.",
    );
  }

  return {
    head,
    kind: kind as MarkerKind,
    output: values.get("--output") ?? "",
  };
}

export function reviewMarkerBody(kind: MarkerKind, head: string) {
  return `${markerKinds[kind]}\nHead: ${head}`;
}

export function emitReviewMarker(options: MarkerOptions) {
  try {
    writeFileSync(
      options.output,
      reviewMarkerBody(options.kind, options.head),
      {
        encoding: "utf8",
        flag: "wx",
        mode: 0o600,
      },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new MarkerInputError(`Could not create the --output file: ${detail}`);
  }
}

function main() {
  try {
    emitReviewMarker(parseMarkerOptions(process.argv.slice(2)));
    process.stdout.write("Review marker body file created.\n");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Review marker: INVALID (${detail})\n`);
    process.exitCode = 2;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main();
