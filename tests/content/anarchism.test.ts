import { describe, expect, it } from "vitest";
import {
  canonicalGraph,
  citationsFor,
  subjectGuideBySlug,
} from "../../src/lib/domain/canonical";

const claims = [
  "anarchism-contested-family",
  "anarchism-opposes-domination",
  "anarchism-opposes-other-domination",
  "anarchism-property-strategy-disagreement",
  "anarchism-not-disorganization",
  "anarchism-tradition-boundary",
  "rocker-syndicalist-double-aim",
  "baker-strategy-disagreement",
  "spanish-case-plurality",
  "mujeres-libres-gender-counterevidence",
  "spanish-anarchist-gender-subordination",
  "anarchosyndicalist-self-identification",
  "anarchist-case-nonembodiment",
];
const exactCitations = {
  "anarchism-contested-family": [
    "prichard-anarchism-vsi-source",
    "chapter 1, pp. 1–4",
  ],
  "anarchism-opposes-domination": [
    "prichard-anarchism-vsi-source",
    "chapter 1, pp. 4–8",
  ],
  "anarchism-opposes-other-domination": [
    "prichard-anarchism-vsi-source",
    "chapter 3, pp. 39–43",
  ],
  "anarchism-property-strategy-disagreement": [
    "baker-means-ends-source",
    "chapter 5, pp. 173–176",
  ],
  "anarchism-not-disorganization": [
    "prichard-anarchism-vsi-source",
    "chapter 4, pp. 59–63",
  ],
  "anarchism-tradition-boundary": [
    "baker-means-ends-source",
    "chapter 5, pp. 173–176",
  ],
  "rocker-syndicalist-double-aim": [
    "rocker-anarchosyndicalism-source",
    "chapter 4, pp. 58–61",
  ],
  "baker-strategy-disagreement": [
    "baker-means-ends-source",
    "chapter 7, pp. 239–242; chapter 10, pp. 335–339",
  ],
  "spanish-case-plurality": [
    "graham-spanish-republic-source",
    "chapter 2, pp. 53–57",
  ],
  "mujeres-libres-gender-counterevidence": [
    "ackelsberg-free-women-source",
    "chapter IV, pp. 115–119",
  ],
  "spanish-anarchist-gender-subordination": [
    "ackelsberg-free-women-source",
    "chapter VI, pp. 186–190",
  ],
  "anarchosyndicalist-self-identification": [
    "rocker-anarchosyndicalism-source",
    "chapter 4, pp. 54–55",
  ],
  "anarchist-case-nonembodiment": [
    "graham-spanish-republic-source",
    "introduction, pp. 1–4",
  ],
} as const;
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
    for (const [id, [sourceId, locator]] of Object.entries(exactCitations))
      expect(
        citationsFor(id).map((citation) => ({
          sourceId: citation.object.id,
          locator: citation.locator,
        })),
      ).toEqual([{ sourceId, locator }]);
  });
});

describe("Anarchism relationship and identity boundaries", () => {
  it("keeps overlap qualified and non-inheriting", () => {
    for (const id of [
      "anarchism-related-to-socialism",
      "anarchism-related-to-communism",
      "anarchism-related-to-statelessness",
    ]) {
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
      canonicalGraph.indexes.entitiesById["rocker-anarchosyndicalism-work"],
    ).toMatchObject({ kind: "work", originalPublicationYear: 1938 });
    expect(
      canonicalGraph.indexes.entitiesById["rocker-anarchosyndicalism-source"],
    ).toMatchObject({
      kind: "source",
      publicationYear: 2004,
      publisher: "AK Press",
    });
    expect(
      canonicalGraph.indexes.entitiesById["anarcho-syndicalism"],
    ).toMatchObject({ kind: "concept" });
    expect(
      canonicalGraph.indexes.entitiesById["anarcho-syndicalist-organizing"],
    ).toMatchObject({ kind: "approach" });
    expect(
      canonicalGraph.indexes.entitiesById["anarchist-traditions"],
    ).toMatchObject({ kind: "collection" });
    expect(
      canonicalGraph.relationships.find(
        ({ id }) => id === "anarchosyndicalism-tradition-member",
      ),
    ).toMatchObject({
      predicate: "member-of",
      membership: "widely-accepted",
      status: "qualified",
    });
    expect(
      canonicalGraph.relationships.filter(
        ({ subject, predicate }) =>
          subject.id === "anarchist-traditions" &&
          ["advances-end", "advocates-means", "interprets-concept"].includes(
            predicate,
          ),
      ),
    ).toEqual([]);
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
