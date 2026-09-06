import { describe, expect, it } from "vitest";
import {
  canonicalGraph,
  citationsFor,
  subjectGuideBySlug,
} from "../../src/lib/domain/canonical";

const claims = [
  "anarchism-contested-family",
  "anarchism-opposes-domination",
  "anarchism-not-disorganization",
  "anarchism-tradition-boundary",
  "rocker-syndicalist-double-aim",
  "baker-strategy-disagreement",
  "spanish-case-plurality",
  "mujeres-libres-gender-counterevidence",
  "anarchist-case-nonembodiment",
];
describe("Anarchism learner guide", () => {
  it("publishes a complete traced journey", () => {
    const guide = subjectGuideBySlug("anarchism");
    expect(guide?.publicationStatus).toBe("reviewed");
    expect(guide?.sections.map(({ role }) => role)).toEqual(
      expect.arrayContaining([
        "short-answer",
        "meanings-and-boundaries",
        "institutions-and-mechanisms",
        "bounded-practice",
        "variants-and-disputes",
        "comparisons-and-next-steps",
        "open-questions",
      ]),
    );
    for (const id of claims) {
      expect(canonicalGraph.indexes.entitiesById[id]?.kind).toBe("statement");
      expect(
        citationsFor(id).every(({ locator }) => locator.trim().length > 0),
      ).toBe(true);
      expect(citationsFor(id).length).toBeGreaterThan(0);
    }
  });
  it("keeps overlap qualified and non-inheriting", () => {
    for (const id of [
      "anarchism-related-to-socialism",
      "anarchism-related-to-communism",
      "anarchism-related-to-statelessness",
    ])
      {
        const relationship = canonicalGraph.relationships.find(
          ({ id: candidate }) => candidate === id,
        );
        expect(
          relationship && relationship.predicate !== "cites"
            ? relationship.status
            : undefined,
        ).toBe("qualified");
      }
    expect(
      canonicalGraph.indexes.entitiesById[
        "spanish-anarchist-initiatives-1936-1939"
      ],
    ).toMatchObject({
      kind: "case",
      episodeIds: ["spanish-anarchist-initiatives-war-episode"],
    });
    expect(
      canonicalGraph.indexes.entitiesById[
        "anarchism-property-exchange-boundaries"
      ],
    ).toMatchObject({ kind: "research-obligation", obligationStatus: "open" });
  });
});
