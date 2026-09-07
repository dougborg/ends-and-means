import { describe, expect, it } from "vitest";
import type { SubjectGuide } from "../../src/lib/domain";
import { canonicalGraph } from "../../src/lib/domain/canonical";
import { buildExploreApproaches } from "../../src/lib/explore-approaches";
import {
  auditExploreAliases,
  buildExploreDirectory,
  markerForExploreSubject,
  matchExploreDirectory,
  normalizeExploreQuery,
  ownedExploreAliases,
} from "../../src/lib/explore-discovery";

function clonedGuides() {
  return structuredClone(canonicalGraph.subjectGuideRecords);
}

function expectPlannedEconomyRouting() {
  const matches = matchExploreDirectory(
    buildExploreDirectory(canonicalGraph.subjectGuides),
    "planned economy",
  );
  expect(matches.map(({ guide }) => guide.id)).toEqual([
    "guide-central-planning",
    "guide-socialism",
  ]);
  expect(matches[0]?.aliases.find(({ query }) => query === "planned economy")?.resultStatus ?? "guide").toBe("guide");
  expect(matches[1]?.aliases.find(({ query }) => query === "planned economy")?.resultStatus).toBe("research-gap");
}

describe("Explore subject markers", () => {
  it("derives truthful reader-facing markers from every eligible subject kind", () => {
    expect(markerForExploreSubject("concept")).toEqual({
      label: "Idea or tradition",
      glyph: "idea-definition",
    });
    expect(markerForExploreSubject("case")).toEqual({
      label: "Bounded case",
      glyph: "bounded-practice",
    });

    const directory = buildExploreDirectory(canonicalGraph.subjectGuides);
    const markerByGuide = new Map(
      directory.map(({ guide, marker }) => [guide.id, marker]),
    );
    for (const guideId of ["guide-republic", "guide-socialism"]) {
      expect(markerByGuide.get(guideId)?.label).toBe("Idea or tradition");
    }
    for (const guideId of [
      "guide-ruwalla-borderland-organization",
      "guide-jinst-postcollective-pastoral-governance",
      "guide-kahnawake-community-lawmaking",
      "guide-tawantinsuyu-imperial-organization",
    ]) {
      expect(markerByGuide.get(guideId)?.label).toBe("Bounded case");
    }
  });
});

describe("learner-first Explore guide discovery", () => {
  it("builds only from the reviewed and published guide projection", () => {
    const records = clonedGuides();
    const first = records[0];
    if (!first) throw new Error("Missing guide fixture");
    first.publicationStatus = "in-review";
    const directory = buildExploreDirectory(records);

    expect(directory).toHaveLength(records.length - 1);
    expect(directory.map(({ guide }) => guide.id)).not.toContain(first.id);
  });

  it("normalizes spelling punctuation and diacritics deterministically", () => {
    expect(normalizeExploreQuery("  Kahnawà:ke—Decision Making ")).toBe(
      "kahnawa ke decision making",
    );
  });

  it.each([
    ["communism", "guide-communism", "guide"],
    ["communist countries", "guide-communism", "guide"],
    ["worker ownership", "guide-socialism", "guide"],
    ["direct democracy", "guide-economic-democracy", "research-gap"],
  ])(
    "routes %s to an owned reviewed destination",
    (query, guideId, resultStatus) => {
      const matches = matchExploreDirectory(
        buildExploreDirectory(canonicalGraph.subjectGuides),
        query,
      );

      expect(matches.map(({ guide }) => guide.id)).toEqual([guideId]);
      expect(
        matches[0]?.aliases.find((alias) => alias.query === query)
          ?.resultStatus ?? "guide",
      ).toBe(resultStatus);
    },
  );

  it("routes planned economy first to the bounded guide while preserving the socialism gap", () => {
    expectPlannedEconomyRouting();
  });

  it("falls back to deterministic all-token matching when no alias is exact", () => {
    const matches = matchExploreDirectory(
      buildExploreDirectory(canonicalGraph.subjectGuides),
      "formal participation",
    );

    expect(matches.map(({ guide }) => guide.id)).toEqual([
      "guide-economic-democracy",
    ]);
  });

  it("matches whole normalized tokens without fragment false positives", () => {
    const directory = buildExploreDirectory(canonicalGraph.subjectGuides);

    expect(
      matchExploreDirectory(directory, "formal participation"),
    ).toHaveLength(1);
    expect(matchExploreDirectory(directory, "formal participate")).toEqual([]);
    expect(matchExploreDirectory(directory, "comm")).toEqual([]);
  });

  it("returns every fuzzy token match rather than selecting a first owner", () => {
    const directory = [
      {
        guide: { id: "guide-b" },
        aliases: [],
        searchText: "shared institutional question",
      },
      {
        guide: { id: "guide-a" },
        aliases: [],
        searchText: "shared historical question",
      },
    ];

    expect(
      matchExploreDirectory(directory, "shared question").map(
        ({ guide }) => guide.id,
      ),
    ).toEqual(["guide-b", "guide-a"]);
  });

  it("returns every explicitly disambiguated owner for an ambiguous phrase", () => {
    const guides = clonedGuides().slice(0, 2);
    for (const guide of guides) {
      guide.searchQueries.push({
        query: "shared phrase",
        disambiguation: `This phrase reaches ${guide.label} in a bounded sense.`,
      });
    }

    expect(
      matchExploreDirectory(buildExploreDirectory(guides), "shared phrase").map(
        ({ guide }) => guide.id,
      ),
    ).toHaveLength(2);
  });
});

describe("Explore discovery publication boundaries", () => {
  it("fails closed on orphaned, non-public, and ambiguous aliases", () => {
    const guides = clonedGuides();
    const first = guides[0];
    const second = guides[1];
    if (!first || !second) throw new Error("Missing guide fixtures");
    const unpublished = structuredClone(first) as SubjectGuide;
    unpublished.id = "guide-unpublished-fixture";
    unpublished.slug = "unpublished-fixture";
    unpublished.publicationStatus = "research-needed";
    const aliases = ownedExploreAliases(guides);
    aliases.push(
      { guideId: "guide-missing", query: "orphan fixture" },
      { guideId: unpublished.id, query: "unpublished fixture" },
      { guideId: first.id, query: "ambiguous fixture" },
      { guideId: second.id, query: "ambiguous fixture" },
    );

    expect(auditExploreAliases([...guides, unpublished], aliases)).toEqual(
      expect.arrayContaining([
        'guide-missing: discovery alias "orphan fixture" has no Subject Guide owner',
        'guide-unpublished-fixture: discovery alias "unpublished fixture" targets a non-public Subject Guide',
        expect.stringContaining(
          'colliding discovery alias "ambiguous fixture" requires disambiguation',
        ),
      ]),
    );
  });

  it("rejects forged aliases and altered editorial boundaries", () => {
    const guides = clonedGuides();
    const aliases = ownedExploreAliases(guides);
    const first = aliases[0];
    const second = aliases[1];
    if (!first || !second) throw new Error("Missing alias fixtures");
    const alteredQuery = second.query;
    first.query = "forged query";
    second.disambiguation = "A boundary that the owning guide did not approve.";
    second.resultStatus = "research-gap";

    expect(auditExploreAliases(guides, aliases)).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'discovery alias "forged query" does not exactly match',
        ),
        expect.stringContaining(
          `discovery alias ${JSON.stringify(alteredQuery)} does not exactly match`,
        ),
      ]),
    );
  });

  it("sorts by normalized code units with an ID tie-breaker regardless of input order", () => {
    const guides = clonedGuides().slice(0, 3);
    const first = guides[0];
    const second = guides[1];
    const third = guides[2];
    if (!first || !second || !third) throw new Error("Missing guide fixtures");
    first.label = "Álpha";
    first.id = "guide-alpha-z";
    second.label = "alpha";
    second.id = "guide-alpha-a";
    third.label = "Beta";

    const expected = ["guide-alpha-a", "guide-alpha-z", third.id];
    expect(
      buildExploreDirectory([first, second, third]).map(
        ({ guide }) => guide.id,
      ),
    ).toEqual(expected);
    expect(
      buildExploreDirectory([third, first, second]).map(
        ({ guide }) => guide.id,
      ),
    ).toEqual(expected);
  });
});

describe("Explore secondary destinations", () => {
  it("lists only live approaches with a live dossier and resolvable public route", () => {
    const graph = structuredClone(canonicalGraph);
    const approaches = buildExploreApproaches(graph);
    const removed = approaches[0];
    if (!removed) throw new Error("Missing Approach fixture");
    const record = graph.indexes.entitiesById[removed.approach.id];
    if (!record) throw new Error("Missing indexed Approach fixture");
    record.publicationStatus = "in-review";

    expect(
      buildExploreApproaches(graph).map(({ approach }) => approach.id),
    ).not.toContain(removed.approach.id);

    record.publicationStatus = "reviewed";
    const dossier = graph.entities.find(
      (entity) =>
        entity.kind === "dossier" &&
        entity.subject.kind === "approach" &&
        entity.subject.id === record.id,
    );
    if (dossier?.kind !== "dossier")
      throw new Error("Missing Approach dossier fixture");
    dossier.publicationStatus = "research-needed";
    expect(
      buildExploreApproaches(graph).map(({ approach }) => approach.id),
    ).not.toContain(record.id);
  });
});
