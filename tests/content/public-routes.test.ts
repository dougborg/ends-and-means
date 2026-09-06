import { describe, expect, it } from "vitest";
import type { EntityRef } from "../../src/lib/domain";
import { canonicalGraph } from "../../src/lib/domain/canonical";
import { hrefForEntity } from "../../src/lib/public-routes";

const routed = [
  [
    { kind: "approach", id: "swedish-wage-earner-fund-program" },
    "/explore/swedish-wage-earner-fund-program/",
  ],
  [
    { kind: "case", id: "swedish-wage-earner-funds" },
    "/cases/swedish-wage-earner-funds/",
  ],
  [
    { kind: "concept", id: "economic-democracy" },
    "/concepts/economic-democracy/",
  ],
  [
    { kind: "challenge", id: "authority-and-accountability" },
    "/challenges/authority-and-accountability/",
  ],
  [
    { kind: "source", id: "herzog-economic-democracy-source" },
    "/sources/herzog-economic-democracy-source/",
  ],
  [
    { kind: "case-episode", id: "enacted-wage-earner-funds-1984-1991" },
    "/cases/swedish-wage-earner-funds/#enacted-wage-earner-funds-1984-1991",
  ],
] satisfies Array<[EntityRef, string]>;

describe("public entity routes", () => {
  it.each(routed)(
    "maps $kind references to their governed public route",
    (reference, expected) => {
      expect(hrefForEntity(reference)).toBe(expected);
    },
  );

  it.each(routed)(
    "fails closed for missing and non-live $kind records",
    (reference, _expected) => {
      expect(
        hrefForEntity({ ...reference, id: `missing-${reference.kind}` }),
      ).toBeUndefined();
      const entity = canonicalGraph.indexes.entitiesById[reference.id];
      if (!entity) throw new Error(`Missing fixture ${reference.id}`);
      const graph = {
        ...canonicalGraph,
        indexes: {
          ...canonicalGraph.indexes,
          entitiesById: {
            ...canonicalGraph.indexes.entitiesById,
            [reference.id]: {
              ...entity,
              publicationStatus: "in-review" as const,
            },
          },
        },
      };
      expect(hrefForEntity(reference, graph)).toBeUndefined();
    },
  );

  it("does not manufacture routes for unsupported or unresolved references", () => {
    expect(
      hrefForEntity({ kind: "means", id: "regional-wage-earner-fund-boards" }),
    ).toBeUndefined();
    expect(
      hrefForEntity({ kind: "case-episode", id: "missing-episode" }),
    ).toBeUndefined();
  });
});
