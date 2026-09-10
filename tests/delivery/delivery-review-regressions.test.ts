import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { groomingReport } from "../../scripts/delivery-flow.ts";
import {
  auditDeliverySnapshot,
  deliverySnapshotSchema,
} from "../../scripts/delivery-state.ts";

function fixture() {
  const snapshot = deliverySnapshotSchema.parse(
    JSON.parse(
      readFileSync(
        new URL("../fixtures/delivery/project-valid.json", import.meta.url),
        "utf8",
      ),
    ),
  );
  const flow = snapshot.flow;
  const parked = flow?.retained.find((record) => record.issue === 3);
  const item = snapshot.items.find((record) => record.number === 3);
  if (!flow || !parked || !item) throw new Error("Missing fixture");
  flow.coordination.mode = "user-paused";
  flow.coordination.finishStarted = true;
  for (const record of flow.retained.filter(
    (record) => record.disposition === "selected",
  ))
    record.startedAt = "2026-09-04T00:00:00Z";
  return { snapshot, flow, parked, item };
}
const codes = (snapshot: ReturnType<typeof fixture>["snapshot"]) =>
  auditDeliverySnapshot(snapshot).map((finding) => finding.code);

describe("pause and concealed execution regressions", () => {
  it.each(["parked", "unclassified", "selected"] as const)(
    "rejects known post-pause starts/resumptions for %s work",
    (disposition) => {
      for (const field of ["startedAt", "resumedAt"] as const) {
        const { snapshot, parked } = fixture();
        parked.disposition = disposition;
        parked[field] = snapshot.capturedAt;
        expect(codes(snapshot)).toContain("PAUSED_START");
      }
    },
  );

  it.each(["running", "user-paused"] as const)(
    "rejects parked process/ownership evidence while %s",
    (mode) => {
      for (const evidence of ["process", "ownership"] as const) {
        const { snapshot, flow, parked, item } = fixture();
        flow.coordination.mode = mode;
        if (evidence === "process")
          parked.observation = {
            phase: "active-process",
            observedAt: snapshot.capturedAt,
            evidence: true,
          };
        else item.ownershipEvidence = true;
        expect(codes(snapshot)).toContain("PARKED_EXECUTION");
        if (mode === "user-paused")
          expect(codes(snapshot)).toContain("PAUSED_START");
      }
    },
  );

  it("preserves harmless parked PRs and old process evidence with unknown original start times", () => {
    const { snapshot, parked, item } = fixture();
    item.linkedPullRequestStates = ["OPEN"];
    parked.startedAt = null;
    parked.observation = {
      phase: "active-process",
      observedAt: "2026-09-01T00:00:00Z",
      evidence: true,
    };
    expect(auditDeliverySnapshot(snapshot)).toEqual([]);
  });

  it("does not let finish-started permission cover an unknown start with live process evidence", () => {
    const { snapshot, parked } = fixture();
    parked.started = null;
    parked.observation = {
      phase: "active-process",
      observedAt: snapshot.capturedAt,
      evidence: true,
    };
    expect(codes(snapshot)).toContain("PAUSED_START");
    expect(
      groomingReport(snapshot).inventory.find((row) => row.issue === 3)
        ?.started,
    ).toBe(true);
  });
});
