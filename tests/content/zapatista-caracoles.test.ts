import { describe, expect, it } from "vitest";
import { citationsFor, dossierForSubject, entitiesOfKind, entityById, researchObligationsForTarget, relationshipsFrom } from "../../src/lib/domain/canonical";

const statementIds = ["zapatista-autonomy-indigenous-context", "jbg-formation-declaration", "jbg-formal-delegation", "jbg-formal-division-of-functions", "jbg-declared-ezln-oversight", "jbg-rotation-rules-in-use", "jbg-gender-participation-limit", "jbg-external-project-control", "jbg-civil-military-authority-limit", "zapatista-reach-limit", "zapatista-2023-reorganization-declaration", "zapatista-2023-caracoles-continuity", "zapatista-2023-practice-open", "zapatista-anarchism-boundary", "zapatista-accountability-assessment"];

describe("Zapatista caracol and Good Government Council case", () => {
  it("publishes exact bounded Case, episode, Event, Transition, and freshness tuples", () => {
    expect(entityById("zapatista-autonomy-chiapas-1994-present")).toMatchObject({ kind: "case", episodeIds: ["zapatista-caracol-jbg-episode-2003-2023", "zapatista-gal-successor-episode-2023-present"], asOf: "2026-09-06", lastReviewedAt: "2026-09-06", freshness: "review-needed", materialChangeEventIds: ["zapatista-autonomy-reorganization-2023"] });
    expect(entityById("zapatista-caracol-jbg-episode-2003-2023")).toMatchObject({ kind: "case-episode", startDate: { year: 2003, month: 8, day: 9, certainty: "exact" }, formalRuleStatementIds: ["jbg-formal-delegation", "jbg-formal-division-of-functions", "jbg-declared-ezln-oversight"], ruleInUseStatementIds: ["jbg-rotation-rules-in-use", "jbg-gender-participation-limit"], interactionStatementIds: ["jbg-external-project-control", "jbg-civil-military-authority-limit"], outcomeStatementIds: ["zapatista-accountability-assessment"] });
    expect(entityById("zapatista-autonomy-reorganization-2023")).toMatchObject({ kind: "event", descriptionStatementIds: ["zapatista-2023-reorganization-declaration", "zapatista-2023-caracoles-continuity"] });
    expect(entityById("zapatista-jbg-to-gal-transition-2023")).toMatchObject({ kind: "transition", changedRelationshipIds: ["zapatista-jbg-episode-used-rotation"], explanationStatementIds: ["zapatista-2023-reorganization-declaration", "zapatista-2023-caracoles-continuity"], rivalInterpretationStatementIds: ["zapatista-2023-practice-open"] });
  });

  it("keeps organizations distinct and anarchism subordinate to Indigenous autonomy", () => {
    for (const id of ["zapatista-army-national-liberation", "zapatista-support-base-communities", "zapatista-caracoles", "zapatista-good-government-councils", "zapatista-local-autonomous-governments"]) expect(entityById(id)?.kind).toBe("organization");
    const relations = relationshipsFrom("zapatista-caracol-jbg-episode-2003-2023");
    expect(relations.filter(({ object }) => object.id === "indigenous-autonomy")).toHaveLength(1);
    expect(relations.filter(({ object }) => object.id === "anarchism")).toEqual([expect.objectContaining({ predicate: "contested-in-case", status: "qualified", statementIds: ["zapatista-anarchism-boundary"] })]);
  });

  it("has at least ten atomic located Statements and at least five authoritative Sources", () => {
    expect(statementIds.length).toBeGreaterThanOrEqual(10);
    expect(statementIds.every((id) => entityById(id)?.kind === "statement")).toBe(true);
    expect(statementIds.every((id) => citationsFor(id).length > 0 && citationsFor(id).every(({ locator }) => locator.trim()))).toBe(true);
    expect(new Set(statementIds.flatMap((id) => citationsFor(id).map(({ object }) => object.id))).size).toBeGreaterThanOrEqual(5);
  });

  it("exposes challenge, criterion, research obligations, and canonical narrative without placeholders", () => {
    expect(entityById("authority-and-accountability")?.kind).toBe("challenge");
    expect(entityById("zapatista-external-coercion")?.kind).toBe("challenge");
    expect(entityById("affected-community-accountability")).toMatchObject({ kind: "criterion", normativeAssumptions: expect.arrayContaining([expect.stringContaining("subject to governing decisions")]) });
    expect(researchObligationsForTarget("case", "zapatista-autonomy-chiapas-1994-present").map(({ id }) => id)).toEqual(expect.arrayContaining(["zapatista-post-2023-rules-in-use", "zapatista-participation-gender-authority", "zapatista-external-coercion-effects"]));
    const dossier = dossierForSubject("case", "zapatista-autonomy-chiapas-1994-present");
    expect(dossier?.standfirst).toMatch(/^From 2003 through 2023/);
    expect(dossier?.sections.every(({ body }) => body && !/placeholder|legacy|migration/i.test(body))).toBe(true);
    expect(entitiesOfKind("case").map(({ id }) => id)).toContain("zapatista-autonomy-chiapas-1994-present");
  });
});
