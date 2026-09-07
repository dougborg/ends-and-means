import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  auditBacklogIssues,
  type BacklogIssue,
  backlogIssueSchema,
} from "../../scripts/backlog-integrity.ts";

function issue(overrides: Partial<BacklogIssue> = {}): BacklogIssue {
  return backlogIssueSchema.parse({
    number: 1,
    title: "Audit delivery state",
    body: "## Outcome\n\nKeep delivery state truthful.\n\n## Acceptance criteria\n\n- [ ] Audit the declared state.",
    state: "OPEN",
    labels: ["process"],
    ...overrides,
  });
}

function codes(issues: BacklogIssue[]) {
  return auditBacklogIssues(issues).map((finding) => finding.code);
}

describe("repository backlog integrity", () => {
  it("reproduces the corrupted #290 failure with actionable classifications", () => {
    const fixture = JSON.parse(
      readFileSync(
        new URL("../fixtures/delivery/backlog-corrupted.json", import.meta.url),
        "utf8",
      ),
    ).map((entry: unknown) => backlogIssueSchema.parse(entry));
    const findings = auditBacklogIssues(fixture);
    expect(findings.map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        "BACKLOG_LITERAL_ESCAPES",
        "BACKLOG_TERMINAL_CONTROL",
        "BACKLOG_COMMAND_TRANSCRIPT",
      ]),
    );
    expect(findings.every(({ message }) => message.includes("#290"))).toBe(true);
  });

  it("allows long research context and intentional fenced code samples", () => {
    const research = issue({
      title: "Research federated governance",
      labels: ["content", "research"],
      body: `## Outcome\n\n${"Document bounded evidence and counterevidence.\n".repeat(300)}\n## Acceptance criteria\n\n- [ ] Publish a source ledger.`,
    });
    const codeSample = issue({
      number: 2,
      title: "Document test output parsing",
      body: "## Outcome\n\nDocument parser examples.\n\n```text\n[WARN] sample\\n\\n\nRUN v5.0.0\nTest Files 59 passed\nTests 635 passed\nCoverage summary\n^[[96m intentional\n```\n\n## Acceptance criteria\n\n- [ ] Preserve the example.",
    });
    expect(auditBacklogIssues([research, codeSample])).toEqual([]);
  });

  it("flags implausibly large acceptance sections without treating a long body as corruption", () => {
    const oversized = issue({
      body: `## Outcome\n\nSmall outcome.\n\n## Acceptance criteria\n\n${"- [ ] Repeated accidental payload.\n".repeat(300)}`,
    });
    expect(codes([oversized])).toEqual(["BACKLOG_ACCEPTANCE_IMPLAUSIBLE"]);
  });

  it("reports only likely duplicate open scope", () => {
    const first = issue({
      number: 10,
      title: "Remove external font runtime dependency",
      body: "## Outcome\n\nRemove remote font requests from public pages.\n\n## Scope\n\nRemove Google Fonts and preserve local font roles.",
    });
    const duplicate = issue({ ...first, number: 11 });
    const orderedFindings = auditBacklogIssues([first, duplicate]);
    expect(orderedFindings.map(({ code }) => code)).toContain(
      "BACKLOG_LIKELY_DUPLICATE",
    );
    expect(auditBacklogIssues([duplicate, first])).toEqual(orderedFindings);

    const closed = issue({ ...duplicate, state: "CLOSED" });
    expect(codes([first, closed])).not.toContain("BACKLOG_LIKELY_DUPLICATE");

    const child = issue({
      ...duplicate,
      body: `${duplicate.body}\n\n## Relationship\n\nChild of #10.`,
    });
    expect(codes([first, child])).not.toContain("BACKLOG_LIKELY_DUPLICATE");

    const umbrella = issue({
      ...duplicate,
      body: `${duplicate.body}\n\n## Relationship\n\n#10 is the umbrella issue for this bounded subtask.`,
    });
    expect(codes([first, umbrella])).not.toContain("BACKLOG_LIKELY_DUPLICATE");

    const dependency = issue({
      ...duplicate,
      body: `${duplicate.body}\n\n## Relationship\n\nDepends on #10 for the shared prerequisite.`,
    });
    expect(codes([first, dependency])).not.toContain(
      "BACKLOG_LIKELY_DUPLICATE",
    );

    const unrelatedReference = issue({
      ...duplicate,
      body: `${duplicate.body}\n\nSee #10 for a screenshot. A later follow-up may cover docs.`,
    });
    expect(codes([first, unrelatedReference])).toContain(
      "BACKLOG_LIKELY_DUPLICATE",
    );

    const coincidental = issue({
      ...duplicate,
      body: "## Outcome\n\nMeasure font glyph coverage in scanned archival PDFs.\n\n## Scope\n\nResearch OCR failures and source transcription.",
    });
    expect(codes([first, coincidental])).not.toContain("BACKLOG_LIKELY_DUPLICATE");
  });
});
