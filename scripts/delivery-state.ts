export const projectStatuses = ["Backlog", "Ready", "In progress", "In review", "Blocked", "Done"] as const;
export const workstreams = ["Corpus", "Reader experience", "Platform/process"] as const;
export const priorities = ["Now", "Next", "Later"] as const;

export type ProjectStatus = (typeof projectStatuses)[number];
export type Workstream = (typeof workstreams)[number];
export type Priority = (typeof priorities)[number];

export interface DeliveryItem {
  number: number;
  title: string;
  type: "Issue" | "PullRequest";
  state: "OPEN" | "CLOSED" | "MERGED";
  status: ProjectStatus;
  workstream?: Workstream | undefined;
  priority?: Priority | undefined;
  labels: string[];
  body?: string | undefined;
  updatedAt?: string | undefined;
  linkedPullRequestStates?: Array<"OPEN" | "CLOSED" | "MERGED"> | undefined;
}

export interface DeliverySnapshot {
  project: {
    number: number;
    public: boolean;
  };
  capturedAt: string;
  items: DeliveryItem[];
}

export interface DeliveryFinding {
  code: string;
  message: string;
  item?: number;
}

const priorityRank = new Map<Priority, number>(priorities.map((priority, index) => [priority, index]));

function hasConcreteBlocker(body = "") {
  return /(?:blocked on|blocked by|unblocks? (?:when|after)|blocking condition\s*:)[^\n]+/i.test(body);
}

function isDeliveryEnabling(item: DeliveryItem) {
  const labels = new Set(item.labels);
  return (
    labels.has("track:platform-process") &&
    (labels.has("process") || labels.has("testing") || labels.has("github_actions") || labels.has("dependencies"))
  );
}

function statusFindings(item: DeliveryItem): DeliveryFinding[] {
  const findings: DeliveryFinding[] = [];
  const openPr = item.linkedPullRequestStates?.includes("OPEN") ?? false;
  if (item.state !== "OPEN" && item.status !== "Done") {
    findings.push({ code: "STATUS_CLOSED_NOT_DONE", item: item.number, message: `#${item.number} is ${item.state} but ${item.status}.` });
  }
  if (item.status === "Ready" && !item.labels.includes("status:ready")) {
    findings.push({ code: "STATUS_READY_LABEL", item: item.number, message: `#${item.number} is Ready without status:ready.` });
  }
  if (item.status !== "Ready" && item.labels.includes("status:ready")) {
    findings.push({ code: "STATUS_STALE_READY_LABEL", item: item.number, message: `#${item.number} retains status:ready while ${item.status}.` });
  }
  if (item.status === "Blocked" && !item.labels.includes("status:blocked")) {
    findings.push({ code: "STATUS_BLOCKED_LABEL", item: item.number, message: `#${item.number} is Blocked without status:blocked.` });
  }
  if (item.status === "In progress" && openPr) {
    findings.push({ code: "STATUS_PR_REVIEW_DRIFT", item: item.number, message: `#${item.number} has an open PR but remains In progress.` });
  }
  if (item.status === "In review" && !openPr && item.type !== "PullRequest") {
    findings.push({ code: "STATUS_REVIEW_WITHOUT_PR", item: item.number, message: `#${item.number} is In review without an open linked PR.` });
  }
  return findings;
}

export function canPromote(snapshot: DeliverySnapshot, workstream: Workstream) {
  const active = snapshot.items.filter((item) => item.status === "In progress");
  return active.length < 3 && !active.some((item) => item.workstream === workstream);
}

function auditReady(items: DeliveryItem[]): DeliveryFinding[] {
  const findings: DeliveryFinding[] = [];
  const ready = items.filter((item) => item.status === "Ready");
  if (ready.length < 3 || ready.length > 5) {
    findings.push({ code: "READY_SIZE", message: `Ready contains ${ready.length} items; expected 3–5.` });
  }
  const ranks = ready.map((item) => (item.priority ? priorityRank.get(item.priority) : undefined));
  if (ranks.some((rank) => rank === undefined)) {
    findings.push({ code: "READY_PRIORITY_MISSING", message: "Every Ready item needs a Priority." });
  } else if (ranks.some((rank, index) => index > 0 && (rank ?? 0) < (ranks[index - 1] ?? 0))) {
    findings.push({ code: "READY_PRIORITY_ORDER", message: "Ready items are not ordered Now, Next, then Later." });
  }
  return findings;
}

function auditWip(items: DeliveryItem[], capturedAt: string, staleDays: number): DeliveryFinding[] {
  const findings: DeliveryFinding[] = [];
  const active = items.filter((item) => item.status === "In progress");
  if (active.length > 3) {
    findings.push({ code: "WIP_LIMIT", message: `${active.length} implementation items are In progress; maximum is 3.` });
  }
  for (const stream of workstreams) {
    const inStream = active.filter((item) => item.workstream === stream);
    if (inStream.length > 1) {
      findings.push({ code: "WIP_DUPLICATE_STREAM", message: `${inStream.length} ${stream} items are In progress.` });
    }
  }
  for (const item of active.filter((candidate) => candidate.workstream === "Platform/process")) {
    if (!isDeliveryEnabling(item)) {
      findings.push({ code: "WIP_PLATFORM_SCOPE", item: item.number, message: `#${item.number} is not labeled as delivery-enabling Platform/process work.` });
    }
  }

  const staleCutoff = Date.parse(capturedAt) - staleDays * 24 * 60 * 60 * 1000;
  for (const item of active) {
    if (!item.updatedAt) {
      findings.push({ code: "WIP_FRESHNESS_UNAVAILABLE", item: item.number, message: `#${item.number} has no updatedAt value; freshness is unavailable.` });
    } else if (Date.parse(item.updatedAt) < staleCutoff) {
      findings.push({ code: "WIP_STALE", item: item.number, message: `#${item.number} has been inactive for more than ${staleDays} days.` });
    }
  }
  return findings;
}

export function auditDeliverySnapshot(snapshot: DeliverySnapshot, staleDays = 14): DeliveryFinding[] {
  const findings: DeliveryFinding[] = [];
  if (snapshot.project.public) {
    findings.push({ code: "PROJECT_VISIBILITY", message: "Delivery Project is public; the harness never changes visibility." });
  }
  findings.push(...auditReady(snapshot.items), ...auditWip(snapshot.items, snapshot.capturedAt, staleDays));
  for (const item of snapshot.items) {
    findings.push(...statusFindings(item));
    if (item.status === "Blocked" && !hasConcreteBlocker(item.body)) {
      findings.push({ code: "BLOCKER_UNNAMED", item: item.number, message: `#${item.number} is Blocked without a concrete named condition.` });
    }
  }
  return findings;
}
