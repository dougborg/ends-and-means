import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { branchTargetForActiveItem } from "../../scripts/delivery-live-evidence.ts";
import {
  assignmentForIssue,
  isPrivateStateUnavailableError,
  parsePrivateDeliveryState,
} from "../../scripts/delivery-private-state.ts";

const fixtureUrl = new URL(
  "../fixtures/delivery/private-state.example.json",
  import.meta.url,
);

async function fixture() {
  return JSON.parse(await readFile(fixtureUrl, "utf8"));
}

async function namedFixture(name: string) {
  return JSON.parse(
    await readFile(
      new URL(
        `../fixtures/delivery/private-state-${name}.json`,
        import.meta.url,
      ),
      "utf8",
    ),
  );
}

describe("private delivery ownership", () => {
  it("loads a fresh explicit assignment without exposing it in Project data", async () => {
    const state = parsePrivateDeliveryState(
      await fixture(),
      new Date("2026-09-06T12:00:00Z"),
    );
    expect(assignmentForIssue(state, 194)?.branch).toBe("chore/example");
  });

  it("fails closed for expired, missing, or duplicate state", async () => {
    const raw = await fixture();
    expect(() =>
      parsePrivateDeliveryState(raw, new Date("2026-09-07T10:00:00Z")),
    ).toThrow("expiresAt has passed");
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

  it("rejects a validity interval longer than 24 hours", async () => {
    const raw = await namedFixture("long-lived");
    expect(() =>
      parsePrivateDeliveryState(raw, new Date("2026-09-06T12:00:00Z")),
    ).toThrow("no more than 24 hours");
  });

  it("rejects state generated more than 24 hours ago", async () => {
    const raw = await namedFixture("old");
    expect(() =>
      parsePrivateDeliveryState(raw, new Date("2026-09-06T12:00:00Z")),
    ).toThrow("generatedAt is older than 24 hours");
  });

  it("rejects any future generatedAt rather than tolerating clock skew", async () => {
    const raw = await namedFixture("future");
    expect(() =>
      parsePrivateDeliveryState(raw, new Date("2026-09-06T12:00:00Z")),
    ).toThrow("generatedAt must not be in the future");
  });

  it.each([
    "EACCES",
    "EISDIR",
    "ELOOP",
    "EMFILE",
    "ENFILE",
    "ENOENT",
    "ENOTDIR",
    "EPERM",
  ])("classifies %s as unavailable filesystem state", (code) => {
    expect(isPrivateStateUnavailableError({ code })).toBe(true);
  });

  it("does not classify readable malformed content as unavailable", () => {
    expect(isPrivateStateUnavailableError(new SyntaxError("bad JSON"))).toBe(
      false,
    );
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
