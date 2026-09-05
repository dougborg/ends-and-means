import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { auditDeliverySnapshot, canPromote, type DeliverySnapshot } from "../../scripts/delivery-state.ts";

const fixtureUrl = new URL("../fixtures/delivery/project-valid.json", import.meta.url);

async function fixture() {
  return JSON.parse(await readFile(fixtureUrl, "utf8")) as DeliverySnapshot;
}

function codes(snapshot: DeliverySnapshot) {
  return new Set(auditDeliverySnapshot(snapshot).map((finding) => finding.code));
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
    expect(canPromote(snapshot, "Corpus")).toBe(false);
    item(snapshot, 2).status = "In review";
    item(snapshot, 2).linkedPullRequestStates = ["OPEN"];
    expect(canPromote(snapshot, "Corpus")).toBe(true);
  });

  it("rejects Ready outside 3–5 and missing or unordered Priority", async () => {
    const tooSmall = await fixture();
    tooSmall.items = tooSmall.items.filter((item) => item.status !== "Ready" || item.number === 4);
    expect(codes(tooSmall)).toContain("READY_SIZE");
    const unordered = await fixture();
    item(unordered, 4).priority = "Later";
    expect(codes(unordered)).toContain("READY_PRIORITY_ORDER");
    item(unordered, 5).priority = undefined;
    expect(codes(unordered)).toContain("READY_PRIORITY_MISSING");
  });

  it("rejects excess WIP, duplicate workstreams, and non-delivery Platform work", async () => {
    const snapshot = await fixture();
    const ready = item(snapshot, 4);
    ready.status = "In progress";
    ready.updatedAt = snapshot.capturedAt;
    expect(codes(snapshot)).toEqual(expect.objectContaining(new Set(["WIP_LIMIT", "WIP_DUPLICATE_STREAM"])));
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
    expect(codes(snapshot)).toEqual(expect.objectContaining(new Set([
      "PROJECT_VISIBILITY",
      "STATUS_READY_LABEL",
      "STATUS_PR_REVIEW_DRIFT",
      "BLOCKER_UNNAMED",
      "STATUS_BLOCKED_LABEL",
      "STATUS_REVIEW_WITHOUT_PR",
      "STATUS_CLOSED_NOT_DONE",
    ])));
  });

  it("rejects promotion when the total or requested lane has no capacity", async () => {
    const snapshot = await fixture();
    expect(canPromote(snapshot, "Reader experience")).toBe(false);
    expect(canPromote(snapshot, "Corpus")).toBe(false);
    expect(canPromote(snapshot, "Platform/process")).toBe(false);
  });
});
