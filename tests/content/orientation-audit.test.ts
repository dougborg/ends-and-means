import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import { compileDomainGraph } from "../../src/lib/domain";
import {
  buildOrientationAudit,
  validateOrientationAudit,
} from "../../src/lib/domain/orientation-audit";

const canonicalGraph = () =>
  compileDomainGraph(structuredClone(canonicalDocuments));

describe("orientation audit", () => {
  it("inventories every live guide and canonical entity", () => {
    const graph = canonicalGraph();
    const inventory = buildOrientationAudit(graph);
    const expectedCount =
      graph.entities.filter(({ publicationStatus }) =>
        ["reviewed", "published"].includes(publicationStatus),
      ).length +
      graph.subjectGuides.filter(({ publicationStatus }) =>
        ["reviewed", "published"].includes(publicationStatus),
      ).length;
    expect(inventory).toHaveLength(expectedCount);
    expect(inventory).toHaveLength(1262);
    expect(
      inventory.filter(({ disposition }) => disposition === "mapped"),
    ).toHaveLength(205);
    expect(
      inventory.filter(
        ({ disposition }) => disposition === "intentionally-unmatched",
      ),
    ).toHaveLength(23);
    expect(
      inventory.filter(({ disposition }) => disposition === "not-applicable"),
    ).toHaveLength(1034);
    expect(
      inventory.filter(({ disposition }) => disposition !== "not-applicable"),
    ).toMatchSnapshot("eligible-target-decisions");
    expect(validateOrientationAudit(graph, inventory)).toEqual([]);
    expect(
      inventory.find(({ id }) => id === "guide-kahnawake-community-lawmaking"),
    ).toMatchObject({
      disposition: "mapped",
      orientationUrls: ["https://en.wikipedia.org/wiki/Kahnawake"],
      identityIds: [],
    });
    expect(
      inventory.find(({ id }) => id === "sep-democracy-source"),
    ).toMatchObject({
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
    expect(inventory.find(({ id }) => id === "oligarchy")).toMatchObject({
      disposition: "mapped",
      orientationUrls: ["https://en.wikipedia.org/wiki/Oligarchy"],
      identityIds: ["Q79751"],
    });
    for (const id of [
      "indonesia-oligarchy-debate-1998-2013",
      "indonesia-post-new-order-power-debate",
      "us-federal-policy-preferences-1981-2002",
      "us-policy-responsiveness-analysis-1981-2002",
    ]) {
      expect(inventory.find((candidate) => candidate.id === id)).toMatchObject({
        disposition: "intentionally-unmatched",
        orientationUrls: [],
        identityIds: [],
      });
    }
  });
});

describe("orientation audit mutation enforcement", () => {
  it("detects missing, duplicate, and actual unpublished graph targets", () => {
    const graph = canonicalGraph();
    const inventory = buildOrientationAudit(graph);
    const first = inventory[0];
    expect(first).toBeDefined();
    if (!first) return;
    const errors = validateOrientationAudit(graph, [
      ...inventory.slice(1),
      first,
      first,
    ]);
    expect(errors).toContain(
      `${first.targetType}:${first.id}: duplicate audit entry`,
    );
    const unpublished = graph.indexes.entitiesById["sep-democracy-source"];
    expect(unpublished).toBeDefined();
    if (!unpublished) return;
    unpublished.publicationStatus = "in-review";
    expect(
      buildOrientationAudit(graph).some(({ id }) => id === unpublished.id),
    ).toBe(false);
    expect(validateOrientationAudit(graph)).not.toContain(
      "entity:sep-democracy-source: stale reviewed decision",
    );
  });

  it("rejects a mapped target downgraded to an arbitrary absence", () => {
    const graph = canonicalGraph();
    const inventory = buildOrientationAudit(graph);
    const democracy = inventory.find(({ id }) => id === "democracy");
    expect(democracy).toBeDefined();
    if (!democracy) return;
    Object.assign(democracy, {
      disposition: "intentionally-unmatched",
      reason: "arbitrary",
      references: [],
      orientationUrls: [],
      identityIds: [],
      consideredCandidates: [],
    });
    expect(validateOrientationAudit(graph, inventory)).toEqual(
      expect.arrayContaining([
        "entity:democracy: reviewed disposition changed",
        "entity:democracy: reviewed reason changed",
        "entity:democracy: reviewed reference tuple changed",
      ]),
    );
  });
});

describe("orientation-only boundary enforcement", () => {
  it("rejects an orientation-only mapping without its explanatory boundary", () => {
    const graph = canonicalGraph();
    const inventory = buildOrientationAudit(graph);
    const statelessness = inventory.find(({ id }) => id === "statelessness");
    expect(statelessness).toBeDefined();
    if (!statelessness) return;
    statelessness.reason = "Useful background.";
    expect(validateOrientationAudit(graph, inventory)).toEqual(
      expect.arrayContaining([
        "entity:statelessness: orientation-only mapping lacks the reviewed explanatory-target boundary",
        "entity:statelessness: reviewed reason changed",
      ]),
    );
  });
});

describe("orientation audit tuple enforcement", () => {
  it("rejects stale/conflicting tuples and mappings on inapplicable kinds", () => {
    const graph = canonicalGraph();
    const democracy = graph.indexes.entitiesById.democracy;
    const source = graph.indexes.entitiesById["sep-democracy-source"];
    const wikipedia = democracy?.externalRefs?.[0];
    if (!democracy || !source || !wikipedia) return;
    democracy.externalRefs = [
      { ...wikipedia, checkedAt: "2026-09-05" },
      ...(democracy.externalRefs?.slice(1) ?? []),
    ];
    source.externalRefs = [
      {
        system: "wikidata",
        id: "Q1",
        url: "https://www.wikidata.org/wiki/Q1",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ];
    const errors = validateOrientationAudit(graph);
    expect(errors).toContain(
      "entity:democracy: reviewed reference tuple changed",
    );
    expect(errors.join("\n")).toContain(
      "sep-democracy-source: absent entry contains a mapping",
    );
  });
});

describe("orientation rejected-candidate enforcement", () => {
  it("rejects an unmatched decision with its candidate review erased", () => {
    const graph = canonicalGraph();
    const inventory = buildOrientationAudit(graph);
    const accountability = inventory.find(
      ({ id }) => id === "authority-and-accountability",
    );
    expect(accountability).toBeDefined();
    if (!accountability) return;
    accountability.consideredCandidates = [];
    expect(validateOrientationAudit(graph, inventory)).toEqual(
      expect.arrayContaining([
        "entity:authority-and-accountability: unmatched decision lacks a reviewed candidate",
        "entity:authority-and-accountability: reviewed rejected-candidate decision changed",
      ]),
    );
  });

  it("rejects a generic category placeholder as a candidate review", () => {
    const graph = canonicalGraph();
    const inventory = buildOrientationAudit(graph);
    const accountability = inventory.find(({ id }) => id === "accountability");
    expect(accountability).toBeDefined();
    if (!accountability) return;
    accountability.consideredCandidates = [
      {
        title: "Concept",
        url: "https://en.wikipedia.org/wiki/Concept",
        boundary: `Concept is broader than ${accountability.label}.`,
        resolution: {
          canonicalArticleTitle: "Concept",
          canonicalArticleUrl: "https://en.wikipedia.org/wiki/Concept",
          pageKind: "article",
          checkedAt: "2026-09-06",
        },
      },
    ];
    expect(validateOrientationAudit(graph, inventory)).toContain(
      "entity:accountability: rejected candidate is a category placeholder",
    );
  });

  it("rejects stale canonical resolution and non-article candidates", () => {
    const graph = canonicalGraph();
    const inventory = buildOrientationAudit(graph);
    const candidate = inventory.find(
      ({ id }) => id === "affected-community-accountability",
    );
    expect(candidate).toBeDefined();
    if (!candidate?.consideredCandidates[0]) return;
    candidate.consideredCandidates[0].resolution.canonicalArticleTitle =
      "Changed";
    candidate.consideredCandidates[0].url =
      "https://en.wikipedia.org/wiki/List_of_political_concepts";
    expect(validateOrientationAudit(graph, inventory)).toEqual(
      expect.arrayContaining([
        "entity:affected-community-accountability: rejected candidate lacks checked canonical resolution",
        "entity:affected-community-accountability: rejected candidate resolves to a non-article page",
      ]),
    );
  });
});

describe("orientation audit projections and publication scope", () => {
  it("rejects corrupt projected labels, orientation URLs, and identity IDs", () => {
    const graph = canonicalGraph();
    const inventory = buildOrientationAudit(graph);
    const democracy = inventory.find(
      ({ targetType, id }) => targetType === "entity" && id === "democracy",
    );
    expect(democracy).toBeDefined();
    if (!democracy) return;
    democracy.label = "Evil label";
    democracy.orientationUrls = ["https://en.wikipedia.org/wiki/Evil"];
    democracy.identityIds = ["Q1"];
    expect(validateOrientationAudit(graph, inventory)).toEqual(
      expect.arrayContaining([
        "entity:democracy: projected label changed",
        "entity:democracy: projected orientation URLs changed",
        "entity:democracy: projected identity IDs changed",
      ]),
    );
  });

  it("rejects canonical source-graph label drift", () => {
    const graph = canonicalGraph();
    const democracy = graph.indexes.entitiesById.democracy;
    expect(democracy).toBeDefined();
    if (!democracy) return;
    democracy.label = "Democracy (renamed without orientation review)";
    expect(validateOrientationAudit(graph)).toContain(
      "entity:democracy: canonical label changed from reviewed ledger",
    );
  });

  it("omits a real unpublished subject guide", () => {
    const graph = canonicalGraph();
    const guide = graph.subjectGuides.find(
      ({ id }) => id === "guide-democracy",
    );
    expect(guide).toBeDefined();
    if (!guide) return;
    guide.publicationStatus = "in-review";
    expect(
      buildOrientationAudit(graph).some(
        ({ targetType, id }) =>
          targetType === "subject-guide" && id === guide.id,
      ),
    ).toBe(false);
    expect(validateOrientationAudit(graph)).toContain(
      "subject-guide:guide-democracy: stale reviewed decision",
    );
  });
});

describe("orientation audit closed-world behavior", () => {
  it("rejects stale reviewed decisions", () => {
    const graph = canonicalGraph();
    const target = graph.indexes.entitiesById.accountability;
    if (!target) return;
    target.publicationStatus = "in-review";
    expect(validateOrientationAudit(graph)).toContain(
      "entity:accountability: stale reviewed decision",
    );
  });

  it("fails closed for a new eligible target and is permutation deterministic", () => {
    const graph = canonicalGraph();
    const template = graph.indexes.entitiesById.democracy;
    if (template?.kind !== "concept") return;
    const added = {
      ...template,
      id: "new-reviewed-concept",
      label: "New reviewed concept",
      externalRefs: [],
    };
    graph.entities.push(added);
    graph.indexes.entitiesById[added.id] = added;
    expect(validateOrientationAudit(graph)).toContain(
      "entity:new-reviewed-concept: missing target-specific reviewed decision",
    );
    const forward = buildOrientationAudit(canonicalGraph());
    const reversed = buildOrientationAudit(
      compileDomainGraph(structuredClone([...canonicalDocuments].reverse())),
    );
    expect(reversed).toEqual(forward);
  });
});
