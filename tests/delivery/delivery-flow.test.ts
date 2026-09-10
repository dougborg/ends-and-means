import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  auditDeliveryFlow,
  groomingReport,
} from "../../scripts/delivery-flow.ts";
import { parsePrivateDeliveryState } from "../../scripts/delivery-private-state.ts";
import {
  auditDeliverySnapshot,
  canPromote,
  deliverySnapshotSchema,
} from "../../scripts/delivery-state.ts";
import { proposeDeliveryStateMigration } from "../../scripts/delivery-state-migration.ts";

function present<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("Missing fixture value");
  return value;
}

function fixture() {
  return deliverySnapshotSchema.parse(
    JSON.parse(
      readFileSync(
        new URL("../fixtures/delivery/project-valid.json", import.meta.url),
        "utf8",
      ),
    ),
  );
}
function flowFixture() {
  const snapshot = fixture();
  if (!snapshot.flow) throw new Error("Missing flow fixture");
  return { snapshot, flow: snapshot.flow };
}
const codes = (snapshot: ReturnType<typeof fixture>) =>
  auditDeliverySnapshot(snapshot).map((finding) => finding.code);

describe("bounded unfinished delivery", () => {
  it("counts review, blocked and not-started reservations independently of implementation slots", () => {
    const { snapshot, flow } = flowFixture();
    const parked = flow.retained.find((record) => record.issue === 3);
    if (!parked) throw new Error("Missing parked fixture");
    parked.disposition = "selected";
    parked.started = false;
    present(snapshot.items.find((item) => item.number === 3)).status =
      "Blocked";
    expect(groomingReport(snapshot).selectedUnfinished).toBe(4);
    expect(codes(snapshot)).toContain("TRANCHE_LIMIT");
    expect(
      canPromote(
        snapshot,
        present(snapshot.items.find((item) => item.number === 5)),
      ),
    ).toBe(false);
  });

  it("keeps explicitly parked private-only inventory without current-base revalidation", () => {
    const { snapshot, flow } = flowFixture();
    flow.retained.push({
      ...present(flow.retained[0]),
      issue: 99,
      disposition: "parked",
      nextReviewCondition: true,
    });
    snapshot.items.push({
      number: 99,
      title: "Retained outside Project",
      type: "Issue",
      state: "OPEN",
      status: "Backlog",
      labels: [],
      linkedPullRequestStates: ["OPEN"],
      baseCurrent: false,
    });
    const report = groomingReport(snapshot);
    expect(report.inventory.find((row) => row.issue === 99)).toMatchObject({
      disposition: "parked",
      phase: "parked",
      openPr: true,
      evidenceAgeMs: null,
    });
    expect(report.selectedUnfinished).toBe(3);
    expect(report.unfinished).toBe(6);
    expect(codes(snapshot)).not.toContain("CURRENT_BASE");
    present(flow.retained.at(-1)).nextReviewCondition = false;
    expect(codes(snapshot)).toContain("PARKING_EVIDENCE");
  });

  it("does not hide missing classification, missing authoritative identities, or duplicate records", () => {
    const { snapshot, flow } = flowFixture();
    flow.retained = flow.retained.filter((record) => record.issue !== 1);
    expect(
      groomingReport(snapshot).inventory.find((row) => row.issue === 1)
        ?.disposition,
    ).toBe("unclassified");
    expect(codes(snapshot)).toContain("UNFINISHED_UNCLASSIFIED");
    flow.retained.push({ ...present(flow.retained[0]), issue: 999 });
    expect(codes(snapshot)).toContain("RETAINED_ISSUE_UNAVAILABLE");
    flow.retained.push(present(flow.retained[0]));
    expect(codes(snapshot)).toContain("RETAINED_DUPLICATE");
  });

  it("permits zero Ready and zero-to-three prepared issues while keeping eligibility and capacity", () => {
    const { snapshot, flow } = flowFixture();
    flow.researchBuffer = [4, 5, 6];
    expect(auditDeliveryFlow(snapshot)).toEqual([]);
    flow.researchBuffer.push(1);
    expect(codes(snapshot)).toContain("RESEARCH_BUFFER_LIMIT");
    flow.researchBuffer = [];
    snapshot.items = snapshot.items.filter((item) => item.status !== "Ready");
    expect(auditDeliveryFlow(snapshot)).toEqual([]);
  });
});

describe("promotion capacity", () => {
  it("reports unknown start separately without claiming closed implementation is merged", () => {
    const { snapshot, flow } = flowFixture();
    const record = present(
      flow.retained.find((candidate) => candidate.issue === 8),
    );
    record.started = null;
    const item = present(
      snapshot.items.find((candidate) => candidate.number === 8),
    );
    item.state = "CLOSED";
    expect(groomingReport(snapshot).unknownStart).toBe(1);
    expect(
      groomingReport(snapshot).inventory.find((row) => row.issue === 8)
        ?.complete,
    ).toBe(false);
  });

  it("requires explicit selection and both capacity limits for promotion", () => {
    const { snapshot, flow } = flowFixture();
    flow.retained = flow.retained.map((record) =>
      record.issue === 2
        ? { ...record, disposition: "parked", nextReviewCondition: true }
        : record,
    );
    present(snapshot.items.find((item) => item.number === 2)).status =
      "Backlog";
    present(
      snapshot.items.find((item) => item.number === 2),
    ).ownershipEvidence = undefined;
    flow.retained.push({
      ...present(flow.retained[0]),
      issue: 5,
      started: false,
    });
    expect(
      canPromote(
        snapshot,
        present(snapshot.items.find((item) => item.number === 5)),
      ),
    ).toBe(true);
    flow.retained.push(present(flow.retained[0]));
    expect(
      canPromote(
        snapshot,
        present(snapshot.items.find((item) => item.number === 5)),
      ),
    ).toBe(false);
    flow.retained.pop();
    flow.coordination.mode = "user-paused";
    expect(
      canPromote(
        snapshot,
        present(snapshot.items.find((item) => item.number === 5)),
      ),
    ).toBe(false);
  });
});

describe("pause and observation evidence", () => {
  it("pauses starts/resumptions without waiving review, source dependencies or privacy", () => {
    const { snapshot, flow } = flowFixture();
    flow.coordination.mode = "user-paused";
    expect(codes(snapshot)).toContain("PAUSED_START");
    expect(codes(snapshot)).toContain("PAUSED_COMPLETION");
    flow.coordination.finishStarted = true;
    for (const record of flow.retained)
      record.startedAt = "2026-09-04T00:00:00Z";
    expect(codes(snapshot)).not.toContain("PAUSED_START");
    present(flow.retained[0]).resumedAt = snapshot.capturedAt;
    expect(codes(snapshot)).toContain("PAUSED_START");
    snapshot.project.public = true;
    present(snapshot.items.find((item) => item.number === 7)).reviewEvidence =
      undefined;
    expect(codes(snapshot)).toContain("PROJECT_VISIBILITY");
    expect(codes(snapshot)).toContain("REVIEW_EVIDENCE");
  });

  it("reports process observations honestly, with independent evidence age and unknown starts", () => {
    const { snapshot, flow } = flowFixture();
    const record = present(flow.retained[0]);
    expect(groomingReport(snapshot).inventory[0]).toMatchObject({
      phase: "unknown",
      evidenceAgeMs: null,
      startedAgeMs: null,
    });
    record.observation = {
      phase: "active-process",
      observedAt: snapshot.capturedAt,
      evidence: true,
    };
    expect(groomingReport(snapshot).inventory[0]?.phase).toBe("active-process");
    record.observation.observedAt = "2026-09-04T00:00:00Z";
    expect(groomingReport(snapshot).inventory[0]?.phase).toBe("unknown");
    for (const phase of [
      "local-candidate",
      "dependency-block",
      "approval-tool-block",
    ] as const) {
      record.observation.phase = phase;
      expect(groomingReport(snapshot).inventory[0]?.phase).toBe(phase);
    }
  });

  it("preserves merged cleanup inventory without trusting private completion flags or closed implementation issues", () => {
    const { snapshot, flow } = flowFixture();
    const item = present(snapshot.items.find((item) => item.number === 1));
    item.state = "CLOSED";
    item.status = "Done";
    present(flow.retained[0]).cleanupPending = true;
    expect(groomingReport(snapshot).selectedUnfinished).toBe(3);
    item.linkedPullRequestStates = ["MERGED"];
    expect(groomingReport(snapshot).selectedUnfinished).toBe(2);
    expect(groomingReport(snapshot).inventory[0]).toMatchObject({
      complete: true,
      cleanupPending: true,
    });
  });
});

describe("private migration and evidence age", () => {
  const legacy = {
    version: 1,
    repository: "dougborg/ends-and-means",
    generatedAt: "2026-01-01T00:00:00Z",
    expiresAt: "2026-01-02T00:00:00Z",
    assignments: Array.from({ length: 4 }, (_, index) => ({
      issue: index + 1,
      owner: "historical-example",
      branch: `example/${index}`,
      worktree: `/example/${index}`,
    })),
  };
  it("preserves surplus and historical evidence, never restores stale owners or invents start dates", () => {
    const { candidate, historical } = proposeDeliveryStateMigration(
      legacy,
      {
        generatedAt: "2026-09-05T10:00:00Z",
        expiresAt: "2026-09-06T10:00:00Z",
        coordination: {
          mode: "running",
          changedAt: "2026-09-05T10:00:00Z",
          instructionEvidence: true,
          instructionRef: "Reviewed instruction",
          finishStarted: false,
        },
      },
      "Example preserved historical file",
    );
    expect(historical).toEqual(legacy);
    expect(candidate.assignments).toEqual([]);
    expect(candidate.retained).toHaveLength(4);
    expect(
      candidate.retained.every(
        (record) =>
          record.disposition === "unclassified" &&
          record.started === null &&
          record.startedAt === null &&
          record.observation.observedAt === null,
      ),
    ).toBe(true);
  });
  it("requires v1 migration and prevents a new envelope from renewing an expired assignment", () => {
    expect(() => parsePrivateDeliveryState(legacy)).toThrow(
      "explicit migration",
    );
    const raw = JSON.parse(
      readFileSync(
        new URL(
          "../fixtures/delivery/private-state.example.json",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    raw.generatedAt = "2026-09-08T10:00:00Z";
    raw.expiresAt = "2026-09-09T10:00:00Z";
    expect(() =>
      parsePrivateDeliveryState(raw, new Date("2026-09-08T12:00:00Z")),
    ).toThrow("assignment evidence");
  });
});
