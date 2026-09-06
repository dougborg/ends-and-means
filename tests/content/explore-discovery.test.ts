import { describe, expect, it } from "vitest";
import type { SubjectGuide } from "../../src/lib/domain";
import { canonicalGraph } from "../../src/lib/domain/canonical";
import {
  auditExploreAliases,
  buildExploreDirectory,
  matchExploreDirectory,
  normalizeExploreQuery,
  ownedExploreAliases,
} from "../../src/lib/explore-discovery";

function clonedGuides() {
  return structuredClone(canonicalGraph.subjectGuideRecords);
}

describe("learner-first Explore discovery", () => {
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
    ["planned economy", "guide-socialism", "research-gap"],
  ])("routes %s to an owned reviewed destination", (query, guideId, resultStatus) => {
    const matches = matchExploreDirectory(
      buildExploreDirectory(canonicalGraph.subjectGuides),
      query,
    );

    expect(matches.map(({ guide }) => guide.id)).toEqual([guideId]);
    expect(
      matches[0]?.aliases.find((alias) => alias.query === query)?.resultStatus ??
        "guide",
    ).toBe(resultStatus);
  });

  it("falls back to deterministic all-token matching when no alias is exact", () => {
    const matches = matchExploreDirectory(
      buildExploreDirectory(canonicalGraph.subjectGuides),
      "economic limitations",
    );

    expect(matches.map(({ guide }) => guide.id)).toEqual([
      "guide-economic-democracy",
    ]);
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
        expect.stringContaining('colliding discovery alias "ambiguous fixture" requires disambiguation'),
      ]),
    );
    expect(() => buildExploreDirectory([...guides, unpublished], aliases)).toThrow(
      /Invalid Explore discovery aliases/,
    );
  });
});
