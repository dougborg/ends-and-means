import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import { compileDomainGraph } from "../../src/lib/domain";
import {
  buildOrientationAudit,
  validateOrientationAudit,
} from "../../src/lib/domain/orientation-audit";

describe("orientation audit", () => {
  it("inventories every live guide and canonical entity", () => {
    const graph = compileDomainGraph(canonicalDocuments);
    const inventory = buildOrientationAudit(graph);
    const expectedCount =
      graph.entities.filter(({ publicationStatus }) =>
        ["reviewed", "published"].includes(publicationStatus),
      ).length + graph.subjectGuides.length;
    expect(inventory).toHaveLength(expectedCount);
    expect(validateOrientationAudit(graph, inventory)).toEqual([]);
    expect(
      inventory.find(({ id }) => id === "guide-kahnawake-community-lawmaking"),
    ).toMatchObject({
      disposition: "intentionally-unmatched",
      orientationUrls: [],
      identityIds: [],
    });
    expect(inventory.find(({ id }) => id === "sep-democracy-source")).toMatchObject({
      disposition: "not-applicable",
    });
    expect(inventory.find(({ id }) => id === "democracy")?.references).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          system: "wikipedia",
          language: "en",
          checkedAt: "2026-09-06",
        }),
        expect.objectContaining({
          system: "wikidata",
          id: "Q7174",
          match: "exact",
          checkedAt: "2026-09-06",
        }),
      ]),
    );
  });

  it("detects missing, duplicate, and unpublished inventory targets", () => {
    const graph = compileDomainGraph(canonicalDocuments);
    const inventory = buildOrientationAudit(graph);
    const first = inventory[0];
    expect(first).toBeDefined();
    if (!first) return;
    const errors = validateOrientationAudit(graph, [
      ...inventory.slice(1),
      first,
      first,
      { ...first, id: "unpublished-fixture" },
    ]);
    expect(errors).toContain(`${first.targetType}:${first.id}: duplicate audit entry`);
    expect(errors).toContain("entity:unpublished-fixture: target is not published");
  });

  it("changes disposition when an external mapping is removed", () => {
    const graph = compileDomainGraph(canonicalDocuments);
    const democracy = graph.indexes.entitiesById.democracy;
    expect(democracy?.externalRefs).toBeDefined();
    if (!democracy) return;
    democracy.externalRefs = [];
    expect(buildOrientationAudit(graph).find(({ id }) => id === "democracy")).toMatchObject({
      disposition: "intentionally-unmatched",
      orientationUrls: [],
      identityIds: [],
    });
  });
});
