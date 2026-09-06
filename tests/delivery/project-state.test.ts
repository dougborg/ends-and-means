import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  auditDeliverySnapshot,
  canPromote,
  type DeliverySnapshot,
  deliverySnapshotSchema,
  orderedReady,
  selectRelevantPullRequest,
} from "../../scripts/delivery-state.ts";

const fixtureUrl = new URL(
  "../fixtures/delivery/project-valid.json",
  import.meta.url,
);

async function fixture() {
  return JSON.parse(await readFile(fixtureUrl, "utf8")) as DeliverySnapshot;
}

function codes(snapshot: DeliverySnapshot) {
  return new Set(
    auditDeliverySnapshot(snapshot).map((finding) => finding.code),
  );
}

function item(snapshot: DeliverySnapshot, number: number) {
  const found = snapshot.items.find((candidate) => candidate.number === number);
  expect(found).toBeDefined();
  if (!found) throw new Error(`Fixture item #${number} is missing.`);
  return found;
}

describe("delivery Project policy", () => {
  it("accepts a valid thin delivery queue and excludes review from WIP", async () => {
    const snapshot = await fixture();
    expect(auditDeliverySnapshot(snapshot)).toEqual([]);
    expect(canPromote(snapshot, item(snapshot, 5))).toBe(false);
    item(snapshot, 2).status = "In review";
    item(snapshot, 2).linkedPullRequestStates = ["OPEN"];
    expect(canPromote(snapshot, item(snapshot, 5))).toBe(true);
  });

  it("rejects Ready outside 3–5 and deterministically orders Priority independent of item-list order", async () => {
    const tooSmall = await fixture();
    tooSmall.items = tooSmall.items.filter(
      (item) => item.status !== "Ready" || item.number === 4,
    );
    expect(codes(tooSmall)).toContain("READY_SIZE");
    const unordered = await fixture();
    unordered.items.reverse();
    expect(
      orderedReady(unordered.items).map((candidate) => candidate.number),
    ).toEqual([4, 5, 6]);
  });

  it("rejects excess WIP, duplicate workstreams, and non-delivery Platform work", async () => {
    const snapshot = await fixture();
    const ready = item(snapshot, 4);
    ready.status = "In progress";
    ready.updatedAt = snapshot.capturedAt;
    for (const code of ["WIP_LIMIT", "WIP_DUPLICATE_STREAM"])
      expect(codes(snapshot)).toContain(code);
    const platform = item(snapshot, 3);
    platform.labels = ["track:platform-process"];
    expect(codes(snapshot)).toContain("WIP_PLATFORM_SCOPE");
  });

  it("reports stale or unavailable WIP freshness", async () => {
    const stale = await fixture();
    item(stale, 1).updatedAt = "2026-08-01T00:00:00.000Z";
    expect(codes(stale)).toContain("WIP_STALE");
    item(stale, 2).updatedAt = undefined;
    expect(codes(stale)).toContain("WIP_FRESHNESS_UNAVAILABLE");
  });

  it("allows main to advance during valid implementation but blocks stale review handoff", async () => {
    const snapshot = await fixture();
    const active = item(snapshot, 1);
    active.baseCurrent = false;
    expect(codes(snapshot)).not.toContain("CURRENT_BASE");
    expect(codes(snapshot)).not.toContain("STARTING_BASE");
    const review = item(snapshot, 7);
    review.baseCurrent = false;
    expect(codes(snapshot)).toContain("CURRENT_BASE");
  });
});

describe("delivery evidence and dependencies", () => {
  it("detects issue, PR, label, visibility, and Blocked drift", async () => {
    const snapshot = await fixture();
    snapshot.project.public = true;
    const ready = item(snapshot, 4);
    ready.labels = [];
    const active = item(snapshot, 1);
    active.linkedPullRequestStates = ["OPEN"];
    const blocked = item(snapshot, 8);
    blocked.body = "Needs more work.";
    blocked.labels = [];
    const review = item(snapshot, 7);
    review.linkedPullRequestStates = [];
    review.state = "CLOSED";
    const done = item(snapshot, 2);
    done.status = "Done";
    for (const code of [
      "PROJECT_VISIBILITY",
      "STATUS_READY_LABEL",
      "STATUS_PR_REVIEW_DRIFT",
      "BLOCKER_UNNAMED",
      "STATUS_BLOCKED_LABEL",
      "STATUS_REVIEW_WITHOUT_PR",
      "STATUS_CLOSED_NOT_DONE",
      "STATUS_DONE_OPEN",
    ])
      expect(codes(snapshot)).toContain(code);
  });

  it("requires executable dependency-free Ready candidates and lane capacity", async () => {
    const snapshot = await fixture();
    expect(canPromote(snapshot, item(snapshot, 4))).toBe(false);
    const candidate = item(snapshot, 5);
    candidate.body = "Blocked on #42.\n\n## Acceptance criteria\n\n- [ ] Work.";
    expect(canPromote(snapshot, candidate)).toBe(false);
    expect(codes(snapshot)).toContain("READY_NOT_EXECUTABLE");
    candidate.body = "## Acceptance criteria\n\n- [ ] Work.";
    item(snapshot, 2).status = "In review";
    item(snapshot, 2).linkedPullRequestStates = ["OPEN"];
    item(snapshot, 2).reviewEvidence = { copilot: true, adversarial: true };
    item(snapshot, 1).workstream = undefined;
    expect(canPromote(snapshot, candidate)).toBe(false);
  });

  it("accepts a named dependency as a concrete Blocked condition", async () => {
    const snapshot = await fixture();
    const blocked = item(snapshot, 8);
    blocked.body =
      "Depends on #130 establishing the reviewed navigation contract.";
    expect(codes(snapshot)).not.toContain("BLOCKER_UNNAMED");
  });
});

describe("delivery evidence completeness", () => {
  it("requires ownership, current-base, linear-history, review, workstream, and track-label evidence", async () => {
    const snapshot = await fixture();
    item(snapshot, 1).ownership = undefined;
    item(snapshot, 1).baseCurrent = undefined;
    item(snapshot, 7).baseCurrent = false;
    item(snapshot, 2).historyLinear = false;
    item(snapshot, 3).workstream = undefined;
    item(snapshot, 7).reviewEvidence = { copilot: true, adversarial: false };
    snapshot.repositoryLabels = snapshot.repositoryLabels.filter(
      (label) => label !== "track:depictions",
    );
    for (const code of [
      "WIP_OWNERSHIP",
      "STARTING_BASE",
      "CURRENT_BASE",
      "LINEAR_HISTORY",
      "WIP_WORKSTREAM",
      "REVIEW_EVIDENCE",
      "TRACK_LABEL",
    ])
      expect(codes(snapshot)).toContain(code);
  });

  it("guards the learner-first dependency chain", async () => {
    const snapshot = await fixture();
    snapshot.items.push(
      {
        number: 119,
        title: "Vision",
        type: "Issue",
        state: "OPEN",
        status: "Backlog",
        labels: [],
      },
      {
        number: 120,
        title: "Contract",
        type: "Issue",
        state: "OPEN",
        status: "In progress",
        workstream: "Reader experience",
        labels: [],
        updatedAt: snapshot.capturedAt,
        ownership: {
          owner: "/root/contract_agent",
          branch: "feat/contract",
          worktree: "/tmp/contract",
        },
        baseCurrent: true,
        historyLinear: true,
      },
      {
        number: 130,
        title: "Prototype",
        type: "Issue",
        state: "OPEN",
        status: "In review",
        workstream: "Reader experience",
        labels: [],
        linkedPullRequestStates: ["OPEN"],
        baseCurrent: true,
        historyLinear: true,
        reviewEvidence: { copilot: true, adversarial: true },
      },
      {
        number: 121,
        title: "Explore",
        type: "Issue",
        state: "OPEN",
        status: "Done",
        labels: [],
      },
    );
    expect(
      auditDeliverySnapshot(snapshot).filter(
        (finding) => finding.code === "LEARNER_SEQUENCE",
      ),
    ).toHaveLength(3);
  });
});

describe("linked pull request selection", () => {
  it("selects the sole open linked PR independently of list order and rejects ambiguity", () => {
    const closed = { state: "CLOSED" as const, id: 1 };
    const open = { state: "OPEN" as const, id: 2 };
    expect(selectRelevantPullRequest([closed, open])).toEqual({
      selected: open,
      ambiguous: false,
    });
    expect(selectRelevantPullRequest([open, closed])).toEqual({
      selected: open,
      ambiguous: false,
    });
    expect(selectRelevantPullRequest([open, { state: "OPEN", id: 3 }])).toEqual(
      { selected: undefined, ambiguous: true },
    );
  });

  it("flags ambiguous linked review PR evidence", async () => {
    const snapshot = await fixture();
    const review = item(snapshot, 7);
    review.linkedPullRequestAmbiguous = true;
    review.linkedPullRequestStates = ["OPEN", "OPEN"];
    review.baseCurrent = undefined;
    review.historyLinear = undefined;
    review.reviewEvidence = undefined;
    for (const code of [
      "PR_AMBIGUOUS",
      "CURRENT_BASE",
      "LINEAR_HISTORY",
      "REVIEW_EVIDENCE",
    ]) {
      expect(codes(snapshot)).toContain(code);
    }
  });
});

describe("delivery evidence schema", () => {
  it("rejects implementation owners outside the documented agent namespace", async () => {
    const snapshot = await fixture();
    const ownership = item(snapshot, 1).ownership;
    if (!ownership) throw new Error("Missing ownership fixture");
    ownership.owner = "reader-agent";
    expect(deliverySnapshotSchema.safeParse(snapshot).success).toBe(false);
  });

  it("runtime-validates malformed snapshot fixtures", async () => {
    const malformed = JSON.parse(
      await readFile(
        new URL("../fixtures/delivery/project-malformed.json", import.meta.url),
        "utf8",
      ),
    );
    const result = deliverySnapshotSchema.safeParse(malformed);
    expect(result.success).toBe(false);
    if (result.success)
      throw new Error("Malformed fixture unexpectedly passed validation.");
    const paths = result.error.issues.map((issue) => issue.path.join("."));
    expect(paths).toEqual(
      expect.arrayContaining([
        "capturedAt",
        "items.0.number",
        "items.0.status",
        "items.0.updatedAt",
      ]),
    );
  });
});
