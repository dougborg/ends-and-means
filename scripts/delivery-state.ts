import { z } from "zod";

export const projectStatuses = [
  "Backlog",
  "Ready",
  "In progress",
  "In review",
  "Blocked",
  "Done",
] as const;
export const workstreams = [
  "Corpus",
  "Reader experience",
  "Platform/process",
] as const;
export const priorities = ["Now", "Next", "Later"] as const;
export const requiredTrackLabels = [
  "track:product-ia",
  "track:anchor-guides",
  "track:organizational-diversity",
  "track:bounded-cases",
  "track:compare-questions",
  "track:trust-evidence",
  "track:visual-design",
  "track:depictions",
  "track:platform-process",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];
export type Workstream = (typeof workstreams)[number];
export type Priority = (typeof priorities)[number];

const trustedCopilotReviewers = new Set([
  "copilot-pull-request-reviewer",
  "copilot-pull-request-reviewer[bot]",
]);

/** Build GitHub's compare route without allowing ref separators/reserved characters to alter the path. */
export function githubComparePath(base: string, head: string) {
  return `repos/dougborg/ends-and-means/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}`;
}

const dateTime = z.string().datetime({ offset: true });
export const agentPathPattern = /^\/root\/[a-z0-9_]+(?:\/[a-z0-9_]+)*$/;

export function parseAgentPath(value: string | undefined) {
  return value && agentPathPattern.test(value) ? value : undefined;
}

const reviewEvidenceSchema = z
  .object({ copilot: z.boolean(), adversarial: z.boolean() })
  .strict();
const ownershipSchema = z
  .object({
    owner: z.string().refine((value) => parseAgentPath(value) !== undefined, {
      message: "Expected a canonical /root/<agent-path> identity",
    }),
    branch: z.string().min(1),
    worktree: z.string().min(1),
  })
  .strict();

export const deliveryItemSchema = z
  .object({
    number: z.number().int().positive(),
    title: z.string().min(1),
    type: z.enum(["Issue", "PullRequest"]),
    state: z.enum(["OPEN", "CLOSED", "MERGED"]),
    status: z.enum(projectStatuses),
    workstream: z.enum(workstreams).optional(),
    priority: z.enum(priorities).optional(),
    labels: z.array(z.string().min(1)),
    body: z.string().optional(),
    updatedAt: dateTime.optional(),
    linkedPullRequestStates: z
      .array(z.enum(["OPEN", "CLOSED", "MERGED"]))
      .optional(),
    linkedPullRequestAmbiguous: z.boolean().optional(),
    ownership: ownershipSchema.optional(),
    baseCurrent: z.boolean().optional(),
    historyLinear: z.boolean().optional(),
    reviewEvidence: reviewEvidenceSchema.optional(),
  })
  .strict();

export const deliverySnapshotSchema = z
  .object({
    project: z
      .object({
        number: z.number().int().positive(),
        title: z.string().min(1),
        public: z.boolean(),
      })
      .strict(),
    capturedAt: dateTime,
    repositoryLabels: z.array(z.string().min(1)),
    items: z.array(deliveryItemSchema),
  })
  .strict();

export type DeliveryItem = z.infer<typeof deliveryItemSchema>;
export type DeliverySnapshot = z.infer<typeof deliverySnapshotSchema>;

export interface DeliveryFinding {
  code: string;
  message: string;
  item?: number;
}

interface ReviewRecord {
  author: { login: string };
  commit: { oid: string };
}

interface ReviewComment {
  body: string;
}

export function reviewEvidenceForHead(
  headOid: string,
  implementationOwner: string | undefined,
  reviews: ReviewRecord[],
  comments: ReviewComment[],
) {
  const marker = new RegExp(
    String.raw`^Independent adversarial review: APPROVED\r?\nReviewer: ([^\r\n]+)\r?\nHead: ${headOid}$`,
  );
  const validOwner = parseAgentPath(implementationOwner);
  return {
    copilot: reviews.some(
      (review) =>
        trustedCopilotReviewers.has(review.author.login) &&
        review.commit.oid === headOid,
    ),
    adversarial: comments.some((comment) => {
      const match = comment.body.match(marker);
      const reviewer = parseAgentPath(match?.[1]);
      return Boolean(validOwner && reviewer && reviewer !== validOwner);
    }),
  };
}

export function selectRelevantPullRequest<
  T extends { state: "OPEN" | "CLOSED" | "MERGED" },
>(pullRequests: T[]) {
  const open = pullRequests.filter(({ state }) => state === "OPEN");
  return {
    selected: open.length === 1 ? open[0] : undefined,
    ambiguous: open.length > 1,
  };
}

const priorityRank = new Map<Priority, number>(
  priorities.map((priority, index) => [priority, index]),
);

function hasConcreteBlocker(body = "") {
  return /(?:blocked on|blocked by|depends on|dependency\s*:|unblocks? (?:when|after)|blocking condition\s*:)[^\n]+/i.test(
    body,
  );
}

function hasUnmetDependency(body = "") {
  return /(?:blocked on|blocked by|depends on|dependency\s*:)[^\n]+/i.test(
    body,
  );
}

function hasExecutableAcceptance(body = "") {
  return /## Acceptance criteria[\s\S]*- \[ \]/i.test(body);
}

function isDeliveryEnabling(item: DeliveryItem) {
  const labels = new Set(item.labels);
  return (
    labels.has("track:platform-process") &&
    (labels.has("process") ||
      labels.has("testing") ||
      labels.has("github_actions") ||
      labels.has("dependencies"))
  );
}

function isReadyCandidate(item: DeliveryItem) {
  if (item.type !== "Issue" || item.state !== "OPEN" || item.status !== "Ready")
    return false;
  if (
    !item.priority ||
    !item.workstream ||
    !item.labels.includes("status:ready")
  )
    return false;
  if (!hasExecutableAcceptance(item.body) || hasUnmetDependency(item.body))
    return false;
  return item.workstream !== "Platform/process" || isDeliveryEnabling(item);
}

export function orderedReady(items: DeliveryItem[]) {
  return items
    .filter((item) => item.status === "Ready")
    .toSorted((left, right) => {
      const rank =
        (priorityRank.get(left.priority ?? "Later") ?? 2) -
        (priorityRank.get(right.priority ?? "Later") ?? 2);
      return rank || left.number - right.number;
    });
}

function statusFindings(item: DeliveryItem): DeliveryFinding[] {
  const findings: DeliveryFinding[] = [];
  if (item.state !== "OPEN" && item.status !== "Done") {
    findings.push({
      code: "STATUS_CLOSED_NOT_DONE",
      item: item.number,
      message: `#${item.number} is ${item.state} but ${item.status}.`,
    });
  }
  if (item.state === "OPEN" && item.status === "Done") {
    findings.push({
      code: "STATUS_DONE_OPEN",
      item: item.number,
      message: `#${item.number} is open but marked Done.`,
    });
  }
  return [...findings, ...labelStatusFindings(item), ...prStatusFindings(item)];
}

function labelStatusFindings(item: DeliveryItem): DeliveryFinding[] {
  const findings: DeliveryFinding[] = [];
  if (item.status === "Ready" && !item.labels.includes("status:ready")) {
    findings.push({
      code: "STATUS_READY_LABEL",
      item: item.number,
      message: `#${item.number} is Ready without status:ready.`,
    });
  }
  if (item.status !== "Ready" && item.labels.includes("status:ready")) {
    findings.push({
      code: "STATUS_STALE_READY_LABEL",
      item: item.number,
      message: `#${item.number} retains status:ready while ${item.status}.`,
    });
  }
  if (item.status === "Blocked" && !item.labels.includes("status:blocked")) {
    findings.push({
      code: "STATUS_BLOCKED_LABEL",
      item: item.number,
      message: `#${item.number} is Blocked without status:blocked.`,
    });
  }
  if (item.status !== "Blocked" && item.labels.includes("status:blocked")) {
    findings.push({
      code: "STATUS_STALE_BLOCKED_LABEL",
      item: item.number,
      message: `#${item.number} retains status:blocked while ${item.status}.`,
    });
  }
  return findings;
}

function prStatusFindings(item: DeliveryItem): DeliveryFinding[] {
  const findings: DeliveryFinding[] = [];
  const openPr = item.linkedPullRequestStates?.includes("OPEN") ?? false;
  if (item.status === "In progress" && openPr) {
    findings.push({
      code: "STATUS_PR_REVIEW_DRIFT",
      item: item.number,
      message: `#${item.number} has an open PR but remains In progress.`,
    });
  }
  if (item.status === "In review" && !openPr && item.type !== "PullRequest") {
    findings.push({
      code: "STATUS_REVIEW_WITHOUT_PR",
      item: item.number,
      message: `#${item.number} is In review without an open linked PR.`,
    });
  }
  if (item.linkedPullRequestAmbiguous) {
    findings.push({
      code: "PR_AMBIGUOUS",
      item: item.number,
      message: `#${item.number} has multiple open linked pull requests; review evidence is ambiguous.`,
    });
  }
  return findings;
}

function activeEvidenceFindings(item: DeliveryItem): DeliveryFinding[] {
  const findings: DeliveryFinding[] = [];
  if (item.status === "In progress" && !item.ownership) {
    findings.push({
      code: "WIP_OWNERSHIP",
      item: item.number,
      message: `#${item.number} lacks owner, branch, and worktree evidence.`,
    });
  }
  if (item.status === "In progress" && item.baseCurrent === undefined) {
    findings.push({
      code: "STARTING_BASE",
      item: item.number,
      message: `#${item.number} has no recorded base comparison for its active branch.`,
    });
  }
  if (item.status === "In review" && item.baseCurrent !== true) {
    findings.push({
      code: "CURRENT_BASE",
      item: item.number,
      message: `#${item.number} is not proven current with its base.`,
    });
  }
  if (
    ["In progress", "In review"].includes(item.status) &&
    item.historyLinear !== true
  ) {
    findings.push({
      code: "LINEAR_HISTORY",
      item: item.number,
      message: `#${item.number} is not proven rebase-only and linear.`,
    });
  }
  if (
    item.status === "In review" &&
    (!item.reviewEvidence?.copilot || !item.reviewEvidence.adversarial)
  ) {
    findings.push({
      code: "REVIEW_EVIDENCE",
      item: item.number,
      message: `#${item.number} lacks completed Copilot and adversarial review evidence.`,
    });
  }
  return findings;
}

export function canPromote(
  snapshot: DeliverySnapshot,
  candidate: DeliveryItem,
) {
  if (!isReadyCandidate(candidate)) return false;
  const active = snapshot.items.filter((item) => item.status === "In progress");
  if (active.some((item) => !item.workstream)) return false;
  return (
    active.length < 3 &&
    !active.some((item) => item.workstream === candidate.workstream)
  );
}

function auditReady(items: DeliveryItem[]): DeliveryFinding[] {
  const findings: DeliveryFinding[] = [];
  const ready = orderedReady(items);
  if (ready.length < 3 || ready.length > 5) {
    findings.push({
      code: "READY_SIZE",
      message: `Ready contains ${ready.length} items; expected 3–5.`,
    });
  }
  for (const item of ready.filter(
    (candidate) => !isReadyCandidate(candidate),
  )) {
    findings.push({
      code: "READY_NOT_EXECUTABLE",
      item: item.number,
      message: `#${item.number} is not dependency-free and independently executable.`,
    });
  }
  return findings;
}

function auditWip(
  items: DeliveryItem[],
  capturedAt: string,
  staleDays: number,
): DeliveryFinding[] {
  const findings: DeliveryFinding[] = [];
  const active = items.filter((item) => item.status === "In progress");
  if (active.length > 3)
    findings.push({
      code: "WIP_LIMIT",
      message: `${active.length} implementation items are In progress; maximum is 3.`,
    });
  for (const stream of workstreams) {
    const inStream = active.filter((item) => item.workstream === stream);
    if (inStream.length > 1)
      findings.push({
        code: "WIP_DUPLICATE_STREAM",
        message: `${inStream.length} ${stream} items are In progress.`,
      });
  }
  for (const item of active) {
    if (!item.workstream)
      findings.push({
        code: "WIP_WORKSTREAM",
        item: item.number,
        message: `#${item.number} has no workstream.`,
      });
    if (item.workstream === "Platform/process" && !isDeliveryEnabling(item)) {
      findings.push({
        code: "WIP_PLATFORM_SCOPE",
        item: item.number,
        message: `#${item.number} is not labeled as delivery-enabling Platform/process work.`,
      });
    }
  }
  const staleCutoff = Date.parse(capturedAt) - staleDays * 24 * 60 * 60 * 1000;
  for (const item of active) {
    if (!item.updatedAt)
      findings.push({
        code: "WIP_FRESHNESS_UNAVAILABLE",
        item: item.number,
        message: `#${item.number} has no updatedAt value; freshness is unavailable.`,
      });
    else if (Date.parse(item.updatedAt) < staleCutoff)
      findings.push({
        code: "WIP_STALE",
        item: item.number,
        message: `#${item.number} has been inactive for more than ${staleDays} days.`,
      });
  }
  return findings;
}

function auditLearnerSequence(items: DeliveryItem[]): DeliveryFinding[] {
  const byNumber = new Map(items.map((item) => [item.number, item]));
  const vision = byNumber.get(119);
  const contract = byNumber.get(120);
  const prototype = byNumber.get(130);
  const downstream = [100, 101, 102, 117, 118, 121, 122].flatMap((number) => {
    const item = byNumber.get(number);
    return item ? [item] : [];
  });
  const findings: DeliveryFinding[] = [];
  if (
    contract &&
    contract.status === "In progress" &&
    vision?.status !== "Done"
  )
    findings.push({
      code: "LEARNER_SEQUENCE",
      item: 120,
      message: "#120 started before #119 completed.",
    });
  if (
    prototype &&
    ["In progress", "In review", "Done"].includes(prototype.status) &&
    contract?.status !== "Done"
  )
    findings.push({
      code: "LEARNER_SEQUENCE",
      item: 130,
      message: "#130 advanced before #120 completed.",
    });
  for (const item of downstream.filter((candidate) =>
    ["In progress", "In review", "Done"].includes(candidate.status),
  )) {
    if (prototype?.status !== "Done")
      findings.push({
        code: "LEARNER_SEQUENCE",
        item: item.number,
        message: `#${item.number} advanced before #130 completed.`,
      });
  }
  return findings;
}

export function auditDeliverySnapshot(
  snapshot: DeliverySnapshot,
  staleDays = 14,
): DeliveryFinding[] {
  const findings: DeliveryFinding[] = [];
  if (
    snapshot.project.number !== 7 ||
    snapshot.project.title !== "Ends and Means — Delivery"
  ) {
    findings.push({
      code: "PROJECT_IDENTITY",
      message: `Expected Ends and Means — Delivery Project #7; received ${snapshot.project.title} #${snapshot.project.number}.`,
    });
  }
  if (snapshot.project.public)
    findings.push({
      code: "PROJECT_VISIBILITY",
      message:
        "Delivery Project is public; the harness never changes visibility.",
    });
  for (const label of requiredTrackLabels) {
    if (!snapshot.repositoryLabels.includes(label))
      findings.push({
        code: "TRACK_LABEL",
        message: `Required track label ${label} is missing.`,
      });
  }
  findings.push(
    ...auditReady(snapshot.items),
    ...auditWip(snapshot.items, snapshot.capturedAt, staleDays),
    ...auditLearnerSequence(snapshot.items),
  );
  for (const item of snapshot.items) {
    findings.push(...statusFindings(item), ...activeEvidenceFindings(item));
    if (item.status === "Blocked" && !hasConcreteBlocker(item.body))
      findings.push({
        code: "BLOCKER_UNNAMED",
        item: item.number,
        message: `#${item.number} is Blocked without a concrete named condition.`,
      });
  }
  return findings;
}
