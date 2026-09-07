import { z } from "zod";

export const backlogIssueSchema = z
  .object({
    number: z.number().int().positive(),
    title: z.string().min(1),
    body: z.string(),
    state: z.enum(["OPEN", "CLOSED"]),
    labels: z.array(z.string().min(1)),
  })
  .strict();

export type BacklogIssue = z.infer<typeof backlogIssueSchema>;

export interface BacklogFinding {
  code: string;
  issue: number;
  message: string;
}

function outsideFences(markdown: string) {
  let fenced = false;
  return markdown
    .split(/\r?\n/)
    .filter((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        fenced = !fenced;
        return false;
      }
      return !fenced;
    })
    .join("\n");
}

function acceptanceSection(body: string) {
  const match = body.match(
    /^##\s+Acceptance criteria\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/im,
  );
  return match?.[1] ?? "";
}

function transcriptEvidence(body: string) {
  const lines = outsideFences(body).split(/\r?\n/);
  const transcriptLines = lines.filter((line) =>
    /(?:^|\s)(?:\[WARN\]|RUN\s+v?\d|Test Files\s+\d|Tests\s+\d+\s+passed|Coverage summary|% Coverage report|\d+\s+passed\s+\(|Process exited with code|Command failed with exit code|npm ERR!| ELIFECYCLE )/i.test(
      line,
    ),
  );
  return transcriptLines.length >= 4;
}

const relationshipPattern =
  /\b(?:umbrella|parent|child|subtask|follow-up|followup|depends on|dependency|supersedes|superseded by|duplicate of|tracks|tracked by|part of)\b/i;

function explicitlyRelated(left: BacklogIssue, right: BacklogIssue) {
  const hasLocalRelationship = (body: string, number: number) => {
    const reference = new RegExp(`#${number}\\b`);
    return body
      .split(/\r?\n|(?<=[.!?])\s+/)
      .some(
        (segment) =>
          reference.test(segment) && relationshipPattern.test(segment),
      );
  };
  return (
    hasLocalRelationship(left.body, right.number) ||
    hasLocalRelationship(right.body, left.number)
  );
}

const ignoredTitleWords = new Set([
  "a",
  "an",
  "and",
  "for",
  "of",
  "the",
  "to",
  "with",
]);

function titleTokens(title: string) {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter((token) => token && !ignoredTitleWords.has(token)),
  );
}

function similarity(left: Set<string>, right: Set<string>) {
  const intersection = [...left].filter((token) => right.has(token)).length;
  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}

function scopeTokens(body: string) {
  const scope = body.match(
    /^##\s+(?:Scope|Outcome)\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/im,
  );
  return titleTokens(scope?.[1] ?? body.slice(0, 1200));
}

function likelyDuplicate(left: BacklogIssue, right: BacklogIssue) {
  if (left.state !== "OPEN" || right.state !== "OPEN") return false;
  if (explicitlyRelated(left, right)) return false;
  const titleSimilarity = similarity(titleTokens(left.title), titleTokens(right.title));
  if (titleSimilarity < 0.8) return false;
  return similarity(scopeTokens(left.body), scopeTokens(right.body)) >= 0.55;
}

function hasTerminalControl(text: string) {
  return text.includes(String.fromCharCode(27)) || /\^\[\[[0-9;]*[A-Za-z]/.test(text);
}

function bodyFindings(issue: BacklogIssue): BacklogFinding[] {
  const findings: BacklogFinding[] = [];
  const outsideCode = outsideFences(issue.body);
  const escapedNewlines = outsideCode.match(/\\[nrt]/g)?.length ?? 0;
  if (escapedNewlines >= 3) {
    findings.push({
      code: "BACKLOG_LITERAL_ESCAPES",
      issue: issue.number,
      message: `#${issue.number} contains ${escapedNewlines} literal escaped control sequences outside code blocks; recreate or edit the body using a file-backed payload with real newlines.`,
    });
  }
  if (hasTerminalControl(outsideCode)) {
    findings.push({
      code: "BACKLOG_TERMINAL_CONTROL",
      issue: issue.number,
      message: `#${issue.number} contains terminal control sequences outside code blocks; remove the pasted terminal formatting and retain only concise evidence.`,
    });
  }
  if (transcriptEvidence(issue.body)) {
    findings.push({
      code: "BACKLOG_COMMAND_TRANSCRIPT",
      issue: issue.number,
      message: `#${issue.number} appears to contain a command or test transcript outside a code block; replace it with a short result summary and link to durable logs when needed.`,
    });
  }
  const acceptance = acceptanceSection(issue.body);
  if (acceptance.length > 8_000 || acceptance.split(/\r?\n/).length > 80) {
    findings.push({
      code: "BACKLOG_ACCEPTANCE_IMPLAUSIBLE",
      issue: issue.number,
      message: `#${issue.number}'s acceptance section is implausibly large; inspect it for an accidental paste and keep executable criteria distinct from research context.`,
    });
  }
  return findings;
}

export function auditBacklogIssues(issues: BacklogIssue[]) {
  const open = issues
    .filter((issue) => issue.state === "OPEN")
    .toSorted((left, right) => left.number - right.number);
  const findings = open.flatMap(bodyFindings);
  for (let leftIndex = 0; leftIndex < open.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < open.length; rightIndex += 1) {
      const left = open[leftIndex];
      const right = open[rightIndex];
      if (!left || !right || !likelyDuplicate(left, right)) continue;
      findings.push({
        code: "BACKLOG_LIKELY_DUPLICATE",
        issue: right.number,
        message: `#${right.number} likely duplicates active scope in #${left.number}; compare outcomes and acceptance criteria, then close one or document an explicit umbrella/child relationship.`,
      });
    }
  }
  return findings;
}
