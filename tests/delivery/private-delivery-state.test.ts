import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { branchTargetForActiveItem } from "../../scripts/delivery-live-evidence.ts";
import {
  assignmentForIssue,
  parsePrivateDeliveryState,
} from "../../scripts/delivery-private-state.ts";

const fixtureUrl = new URL(
  "../fixtures/delivery/private-state.example.json",
  import.meta.url,
);

async function fixture() {
  return JSON.parse(await readFile(fixtureUrl, "utf8"));
}

describe("private delivery ownership", () => {
  it("loads a fresh explicit assignment without exposing it in Project data", async () => {
    const state = parsePrivateDeliveryState(
      await fixture(),
      new Date("2026-09-06T12:00:00Z"),
    );
    expect(assignmentForIssue(state, 194)?.branch).toBe("chore/example");
  });

  it("fails closed for stale, missing, duplicate, or unavailable state", async () => {
    const raw = await fixture();
    expect(() =>
      parsePrivateDeliveryState(raw, new Date("2026-09-08T00:00:00Z")),
    ).toThrow("expired");
    const state = parsePrivateDeliveryState(
      raw,
      new Date("2026-09-06T12:00:00Z"),
    );
    expect(assignmentForIssue(state, 999)).toBeUndefined();
    expect(() =>
      parsePrivateDeliveryState(
        { ...raw, assignments: [...raw.assignments, raw.assignments[0]] },
        new Date("2026-09-06T12:00:00Z"),
      ),
    ).toThrow("more than one assignment");
  });
});

describe("active branch target selection", () => {
  const open = (baseRefName: string, headRefName = "chore/example") => ({
    state: "OPEN" as const,
    baseRefName,
    headRefName,
  });

  it("uses main for an unstacked assignment without a linked PR", () => {
    expect(
      branchTargetForActiveItem("In progress", "chore/example", []),
    ).toMatchObject({
      base: "main",
      head: "chore/example",
    });
  });

  it("uses the sole linked PR's declared base for a stacked layer", () => {
    expect(
      branchTargetForActiveItem("In progress", "chore/example", [
        open("feat/lower-layer"),
      ]),
    ).toMatchObject({ base: "feat/lower-layer", head: "chore/example" });
  });

  it("rejects an assignment branch that is stale relative to the linked PR", () => {
    expect(
      branchTargetForActiveItem("In progress", "old/branch", [open("main")]),
    ).toMatchObject({ assignmentMatches: false });
  });

  it("fails closed when multiple linked PRs are open", () => {
    expect(
      branchTargetForActiveItem("In progress", "chore/example", [
        open("main"),
        open("feat/lower-layer"),
      ]),
    ).toEqual({ ambiguous: true });
  });
});
