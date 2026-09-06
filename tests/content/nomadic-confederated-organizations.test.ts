import { describe, expect, it } from "vitest";
import {
  citationsFor,
  dossierForSubject,
  entitiesOfKind,
  entityById,
  researchObligationsForTarget,
  subjectGuideById,
} from "../../src/lib/domain/canonical";

const evidenceTuples = [
  ["jinst-administrative-boundary", "fernandez-gimenez-pastoral-tenure-source", "supports", "pp. 56–57 and 63–65"],
  ["jinst-campsite-rights", "fernandez-gimenez-pastoral-tenure-source", "supports", "pp. 60–62"],
  ["jinst-case-transfer-limit", "fernandez-gimenez-pastoral-tenure-source", "context", "pp. 53–74"],
  ["jinst-fieldwork-provenance", "fernandez-gimenez-pastoral-tenure-source", "supports", "pp. 53–55, ‘Case study sites and methods’"],
  ["jinst-inequality", "fernandez-gimenez-pastoral-tenure-source", "supports", "pp. 58–59 and 62"],
  ["jinst-khot-ail", "fernandez-gimenez-pastoral-tenure-source", "supports", "pp. 61–62, including note 4"],
  ["jinst-mobility-coordination", "fernandez-gimenez-pastoral-tenure-source", "supports", "pp. 58–60"],
  ["jinst-neg-nutgiinkhan-boundary", "fernandez-gimenez-pastoral-tenure-source", "supports", "p. 62, including note 5"],
  ["jinst-pasture-overlap", "fernandez-gimenez-pastoral-tenure-source", "supports", "pp. 62–64"],
  ["jinst-postcollective-change", "fernandez-gimenez-pastoral-tenure-source", "supports", "pp. 56–59"],
  ["jinst-resource-rights-differed", "fernandez-gimenez-pastoral-tenure-source", "supports", "pp. 60–64"],
  ["jinst-seasonal-norms", "fernandez-gimenez-pastoral-tenure-source", "supports", "p. 56"],
  ["jinst-tenure-proposal-limit", "fernandez-gimenez-pastoral-tenure-source", "supports", "pp. 65–74"],
  ["mongolia-later-study-transfer", "allington-context-matters-source", "supports", "abstract; methods summary; conclusions"],
  ["ruwalla-anaza-affiliation", "cicek-tribal-agency-source", "supports", "pp. 602–603 and 607–608"],
  ["ruwalla-archive-mediation", "cicek-tribal-agency-source", "supports", "p. 601, introduction and source note"],
  ["ruwalla-archive-mediation", "stocker-borders-in-motion-source", "supports", "repository abstract, paragraphs 8–10"],
  ["ruwalla-border-bargaining", "cicek-tribal-agency-source", "supports", "pp. 607–609, section ‘Bedouins, Wahhabism and borders’"],
  ["ruwalla-border-concessions", "cicek-tribal-agency-source", "supports", "pp. 602–605 and 613–614"],
  ["ruwalla-case-transfer-limit", "cicek-tribal-agency-source", "context", "pp. 601–614"],
  ["ruwalla-case-transfer-limit", "stocker-borders-in-motion-source", "context", "repository abstract, paragraphs 3–12"],
  ["ruwalla-dira-not-sovereignty", "stocker-borders-in-motion-source", "supports", "repository abstract, paragraphs 7–8"],
  ["ruwalla-jinst-non-equivalence", "fernandez-gimenez-pastoral-tenure-source", "context", "pp. 53–74"],
  ["ruwalla-jinst-non-equivalence", "cicek-tribal-agency-source", "context", "pp. 601–614"],
  ["ruwalla-mashyakha", "stocker-borders-in-motion-source", "supports", "repository abstract, paragraphs 5–6"],
  ["ruwalla-mobility-corridor", "cicek-tribal-agency-source", "supports", "pp. 602–603 and 607–609"],
  ["ruwalla-name-boundary", "stocker-borders-in-motion-source", "supports", "repository abstract, paragraphs 3–4"],
  ["ruwalla-shaykh-consent-limit", "cicek-tribal-agency-source", "supports", "pp. 603–604"],
] as const;

describe("bounded Ruwalla and Jinst cases", () => {
  it("publishes exact case and episode boundaries without retrojection", () => {
    expect(entityById("ruwalla-borderland-organization")).toMatchObject({
      kind: "case", startDate: { year: 1918 }, endDate: { year: 1936 },
      episodeIds: ["ruwalla-borderland-1918-1936"],
    });
    expect(entityById("jinst-postcollective-pastoral-governance")).toMatchObject({
      kind: "case", startDate: { year: 1990 }, endDate: { year: 1997 },
      episodeIds: ["jinst-transition-1990-1997"],
    });
    expect(JSON.stringify(entityById("jinst-transition-1990-1997"))).not.toContain("pasture user group");
  });

  it("preserves every complete evidence tuple exactly", () => {
    const actual = [...new Set(evidenceTuples.map(([statementId]) => statementId))].flatMap((statementId) =>
      citationsFor(statementId).map(({ object, role, locator }) => [statementId, object.id, role, locator]),
    );
    expect(actual).toEqual(evidenceTuples);
  });

  it("keeps terminology provenance and the cross-case non-equivalence explicit", () => {
    expect(entityById("ruwalla-name-boundary")).toMatchObject({ statementKind: "classification" });
    expect(entityById("jinst-neg-nutgiinkhan-boundary")).toMatchObject({ statementKind: "classification" });
    expect(entityById("ruwalla-jinst-non-equivalence")).toMatchObject({
      statementKind: "editorial-interpretation",
      text: expect.stringContaining("different actors, scales, institutions, evidence traditions, and state relationships"),
    });
  });

  it("routes broad phrases to bounded guides without canonizing universal types", () => {
    const forbidden = new Set(["tribe", "confederacy", "nomadic government", "pastoral government"]);
    for (const kind of ["concept", "collection", "approach", "means"] as const) {
      expect(entitiesOfKind(kind).filter(({ label }) => forbidden.has(label.toLowerCase()))).toEqual([]);
    }
    expect(subjectGuideById("guide-ruwalla-borderland-organization")?.searchQueries).toEqual(expect.arrayContaining([
      expect.objectContaining({ query: "Bedouin confederation", disambiguation: expect.stringContaining("not a universal") }),
    ]));
    expect(subjectGuideById("guide-jinst-postcollective-pastoral-governance")?.searchQueries).toEqual(expect.arrayContaining([
      expect.objectContaining({ query: "nomadic government", disambiguation: expect.stringContaining("not a definition") }),
    ]));
  });

  it("publishes canonical-only learner narratives and focused open questions", () => {
    expect(dossierForSubject("case", "ruwalla-borderland-organization")?.sections).toHaveLength(6);
    expect(dossierForSubject("case", "jinst-postcollective-pastoral-governance")?.sections).toHaveLength(7);
    expect(researchObligationsForTarget("case", "ruwalla-borderland-organization").map(({ id }) => id)).toEqual([
      "ruwalla-border-distribution", "ruwalla-nonelite-oral-perspectives", "ruwalla-shaykh-authority-variation",
    ]);
    expect(researchObligationsForTarget("case", "jinst-postcollective-pastoral-governance").map(({ id }) => id)).toEqual([
      "jinst-access-inequality", "jinst-post-1997-continuity", "jinst-translation-oral-provenance",
    ]);
  });
});
