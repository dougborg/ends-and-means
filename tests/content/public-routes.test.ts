import { describe, expect, it } from "vitest";
import type { EntityRef } from "../../src/lib/domain";
import { hrefForEntity } from "../../src/lib/public-routes";

describe("public entity routes", () => {
  it.each([
    [{ kind: "approach", id: "example" }, "/explore/example/"],
    [{ kind: "case", id: "example" }, "/cases/example/"],
    [{ kind: "concept", id: "example" }, "/concepts/example/"],
    [{ kind: "challenge", id: "example" }, "/challenges/example/"],
    [{ kind: "source", id: "example" }, "/sources/example/"],
    [
      { kind: "case-episode", id: "enacted-wage-earner-funds-1984-1991" },
      "/cases/swedish-wage-earner-funds/#enacted-wage-earner-funds-1984-1991",
    ],
  ] satisfies Array<[EntityRef, string]>)(
    "maps $kind references to their governed public route",
    (reference, expected) => {
      expect(hrefForEntity(reference)).toBe(expected);
    },
  );

  it("does not manufacture routes for unsupported or unresolved references", () => {
    expect(hrefForEntity({ kind: "means", id: "example" })).toBeUndefined();
    expect(
      hrefForEntity({ kind: "case-episode", id: "missing-episode" }),
    ).toBeUndefined();
  });
});
