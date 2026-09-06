import { describe, expect, it } from "vitest";
import { citationsFor, dossierForSubject, entitiesOfKind, entityById, researchObligationsForTarget, relationshipsFrom } from "../../src/lib/domain/canonical";

const statementIds = ["zapatista-autonomy-indigenous-context", "zapatista-european-theory-boundary", "jbg-formation-declaration", "jbg-formal-delegation", "jbg-formal-regional-functions", "jbg-formal-municipal-functions", "jbg-declared-ezln-oversight", "jbg-rotation-rules-in-use", "jbg-rotation-learning-purpose", "jbg-reporting-practice", "jbg-accounting-practice", "jbg-gender-participation-limit", "jbg-external-project-control", "jbg-civil-military-authority-limit", "zapatista-hybrid-authority-interpretation", "zapatista-reach-limit", "zapatista-2023-reorganization-declaration", "zapatista-2023-caracoles-continuity", "zapatista-2023-practice-open", "zapatista-anarchist-resemblance", "zapatista-anarchism-boundary", "zapatista-accountability-assessment"];
const expectedKinds = {
  "zapatista-autonomy-indigenous-context": "classification", "zapatista-european-theory-boundary": "editorial-interpretation", "jbg-formation-declaration": "observation", "jbg-formal-delegation": "observation", "jbg-formal-regional-functions": "observation", "jbg-formal-municipal-functions": "observation", "jbg-declared-ezln-oversight": "observation", "jbg-rotation-rules-in-use": "observation", "jbg-rotation-learning-purpose": "observation", "jbg-reporting-practice": "observation", "jbg-accounting-practice": "observation", "jbg-gender-participation-limit": "observation", "jbg-external-project-control": "observation", "jbg-civil-military-authority-limit": "observation", "zapatista-hybrid-authority-interpretation": "classification", "zapatista-reach-limit": "observation", "zapatista-2023-reorganization-declaration": "observation", "zapatista-2023-caracoles-continuity": "observation", "zapatista-2023-practice-open": "observation", "zapatista-anarchist-resemblance": "classification", "zapatista-anarchism-boundary": "editorial-interpretation", "zapatista-accountability-assessment": "editorial-interpretation",
} as const;
const expectedTexts = [
  "Forbis analyzes the councils as an exercise of Indigenous collective autonomy shaped by local histories and a failed effort to secure state recognition.",
  "This case should be interpreted first through Zapatista and Indigenous self-description rather than used as a test of whether a European political theory works.",
  "The EZLN announced that Good Government Councils would be constituted on August 9, 2003, one in each rebel zone and seated in caracoles.",
  "The 2003 design assigned each Good Government Council one or two delegates from every autonomous municipal council in its zone.",
  "The 2003 declaration assigned project oversight, intermunicipal coordination, outside relations, and resource balancing to the Good Government Councils.",
  "The 2003 declaration reserved justice, health, education, housing, land, work, food, commerce, information, culture, and local transit to autonomous municipalities.",
  "The 2003 declaration assigned each zone's CCRI a monitoring role over the Good Government Council to deter corruption, arbitrariness, injustice, and departures from governing by obeying.",
  "Participants in the 2013 autonomy course described Good Government Council service as rotating among groups of delegates.",
  "Zapatista participants described rotating authority as a way for support-base members to learn autonomous government by doing its work.",
  "Zapatista participants described outgoing authorities presenting reports to incoming authorities and to the communities that selected them.",
  "Zapatista participants described recording income and spending with receipts and checking accounts jointly across administrative, vigilance, and information roles.",
  "Participants in the 2013 autonomy course reported that women worked widely in health, education, and agroecology but participated less consistently in some municipal councils and Good Government Councils despite parity rules in one municipality.",
  "Andrews found that Good Government Councils required outside solidarity organizations to seek permission and accept community control over projects and resource allocation.",
  "Ross argues that rotating civilian councils coexisted with continuing political-military authority in the EZLN's CCRI-CG, challenging interpretations that treat council rotation as proof that central authority disappeared.",
  "Gunderson interprets Zapatista organization as a hybrid of distributed community institutions and vertical political-military authority.",
  "Independent scholarship describes Zapatista authorities as overlapping state municipalities and primarily governing people who accepted their legitimacy, so the case does not establish exclusive control over a continuous territory.",
  "In November 2023 the EZLN declared that command and coordination of autonomy had moved from the Good Government Councils and autonomous municipalities to community-level Local Autonomous Governments, with regional collectives and zone assemblies above them.",
  "The 2023 declaration retained the caracoles as bases for mobile zone assemblies while stating that those assemblies depended on regional collectives and community-level governments.",
  "The 2023 communiqué presented a declared design and deferred fuller evaluation of the former institutions, so it cannot by itself establish participation, accountability, reach, or outcomes under the successor structure.",
  "Assemblies, rotating delegates, and decentralized coordination create a limited analytical resemblance between the council episode and some anarchist institutional proposals.",
  "Institutional resemblance alone does not justify classifying the bounded Zapatista episode as anarchist.",
  "Rotation, reporting, and community assemblies support an accountability claim at the level of declared design and participant account, while uneven gender participation and continuing EZLN command authority prevent a general conclusion that all affected people held equal effective control.",
] as const;
const expectedCitationTuples = [
  ["zapatista-autonomy-indigenous-context", "forbis-exercising-rights-source", "supports", "chapter 4, pp. 163–170"], ["zapatista-european-theory-boundary", "forbis-exercising-rights-source", "context", "chapter 4, pp. 163–170"],
  ["jbg-formation-declaration", "ezln-thirteenth-stele-source", "supports", "section beginning “En suma: para cuidar que…”; sentence beginning “El día 9 de agosto…”"], ["jbg-formal-delegation", "ezln-thirteenth-stele-source", "supports", "section beginning “Sus sedes estarán…”; sentence beginning “Estarán formadas…”"], ["jbg-formal-regional-functions", "ezln-thirteenth-stele-source", "supports", "section beginning “En suma: para cuidar que…”; duties list beginning “Contrarrestar el desequilibrio…”"], ["jbg-formal-municipal-functions", "ezln-thirteenth-stele-source", "supports", "section beginning “Siguen siendo funciones exclusivas…”"], ["jbg-declared-ezln-oversight", "ezln-thirteenth-stele-source", "supports", "section beginning “El Comité Clandestino Revolucionario…”"],
  ["jbg-rotation-rules-in-use", "zapatista-autonomous-government-one-source", "supports", "pp. 11–18"], ["jbg-rotation-learning-purpose", "zapatista-autonomous-government-one-source", "supports", "pp. 38–42"], ["jbg-reporting-practice", "zapatista-autonomous-government-one-source", "supports", "pp. 38–42"], ["jbg-accounting-practice", "zapatista-autonomous-government-one-source", "supports", "pp. 55–56"], ["jbg-gender-participation-limit", "zapatista-autonomous-government-one-source", "supports", "pp. 54–56"],
  ["jbg-external-project-control", "andrews-political-autonomy-source", "supports", "pp. 101–107"], ["jbg-civil-military-authority-limit", "ross-autonomist-critique-source", "supports", "pp. 542–543"], ["zapatista-hybrid-authority-interpretation", "ross-autonomist-critique-source", "supports", "pp. 548–550"], ["zapatista-reach-limit", "forbis-exercising-rights-source", "supports", "chapter 4, pp. 171–183"], ["zapatista-reach-limit", "stahler-sholk-autonomies-source", "qualifies", "‘Indigenous and Campesino Autonomies in Mexico’, paragraphs 3–7"],
  ["zapatista-2023-reorganization-declaration", "ezln-new-autonomy-structure-source", "supports", "sections “First”–“Third”; lead text “The main basis…”"], ["zapatista-2023-caracoles-continuity", "ezln-new-autonomy-structure-source", "supports", "section “Fourth”; lead text “The Caracoles…”"], ["zapatista-2023-practice-open", "ezln-new-autonomy-structure-source", "supports", "sections “First” and “Fourth”; lead text “In later writings…”"],
  ["zapatista-anarchist-resemblance", "ross-autonomist-critique-source", "context", "pp. 548–550"], ["zapatista-anarchism-boundary", "ross-autonomist-critique-source", "qualifies", "pp. 548–550"], ["zapatista-anarchism-boundary", "forbis-exercising-rights-source", "supports", "chapter 4, pp. 163–192"], ["zapatista-accountability-assessment", "zapatista-autonomous-government-one-source", "supports", "pp. 38–42 and 54–56"], ["zapatista-accountability-assessment", "ross-autonomist-critique-source", "qualifies", "pp. 542–543"],
] as const;

describe("Zapatista caracol and Good Government Council case", () => {
  it("publishes exact bounded Case, episode, Event, Transition, and freshness tuples", () => {
    expect(entityById("zapatista-autonomy-chiapas-1994-present")).toMatchObject({ kind: "case", episodeIds: ["zapatista-caracol-jbg-episode-2003-2023", "zapatista-gal-successor-episode-2023-present"], asOf: "2026-09-06", lastReviewedAt: "2026-09-06", freshness: "review-needed", materialChangeEventIds: ["zapatista-autonomy-reorganization-2023"] });
    expect(entityById("zapatista-caracol-jbg-episode-2003-2023")).toMatchObject({ kind: "case-episode", startDate: { year: 2003, month: 8, certainty: "approximate" }, formalRuleStatementIds: ["jbg-formal-delegation", "jbg-formal-regional-functions", "jbg-formal-municipal-functions", "jbg-declared-ezln-oversight"], ruleInUseStatementIds: ["jbg-rotation-rules-in-use", "jbg-rotation-learning-purpose", "jbg-reporting-practice", "jbg-accounting-practice", "jbg-gender-participation-limit"], interactionStatementIds: ["jbg-external-project-control", "jbg-civil-military-authority-limit"], outcomeStatementIds: ["zapatista-accountability-assessment"] });
    expect(entityById("zapatista-caracoles-jbg-formation-announced-2003")).toMatchObject({ kind: "event", startDate: { year: 2003, month: 7, day: 21, certainty: "exact" } });
    expect(entityById("zapatista-autonomy-reorganization-2023")).toMatchObject({ kind: "event", descriptionStatementIds: ["zapatista-2023-reorganization-declaration", "zapatista-2023-caracoles-continuity"] });
    expect(entityById("zapatista-jbg-to-gal-transition-2023")).toMatchObject({ kind: "transition", changedRelationshipIds: ["zapatista-jbg-episode-used-rotation"], explanationStatementIds: ["zapatista-2023-reorganization-declaration", "zapatista-2023-caracoles-continuity"], rivalInterpretationStatementIds: [] });
  });

  it("keeps organizations distinct and anarchism subordinate to Indigenous autonomy", () => {
    for (const id of ["zapatista-army-national-liberation", "zapatista-support-base-communities", "zapatista-caracoles", "zapatista-good-government-councils", "zapatista-local-autonomous-governments"]) expect(entityById(id)?.kind).toBe("organization");
    const relations = relationshipsFrom("zapatista-caracol-jbg-episode-2003-2023");
    expect(relations.filter(({ object }) => object.id === "indigenous-autonomy")).toHaveLength(1);
    expect(relations.filter(({ object }) => object.id === "anarchism")).toEqual([expect.objectContaining({ predicate: "contested-in-case", status: "qualified", statementIds: ["zapatista-anarchist-resemblance", "zapatista-anarchism-boundary"] })]);
  });

  it("has at least ten atomic located Statements and at least five authoritative Sources", () => {
    expect(statementIds.length).toBeGreaterThanOrEqual(10);
    expect(statementIds.every((id) => entityById(id)?.kind === "statement")).toBe(true);
    expect(statementIds.every((id) => citationsFor(id).length > 0 && citationsFor(id).every(({ locator }) => locator.trim()))).toBe(true);
    expect(new Set(statementIds.flatMap((id) => citationsFor(id).map(({ object }) => object.id))).size).toBeGreaterThanOrEqual(5);
  });

  it("pins every intended Statement kind and every evidence tuple", () => {
    expect(Object.keys(expectedKinds)).toEqual(statementIds);
    expect(Object.fromEntries(statementIds.map((id) => { const statement = entityById(id); return [id, statement?.kind === "statement" ? statement.statementKind : undefined]; }))).toEqual(expectedKinds);
    expect(statementIds.map((id) => { const statement = entityById(id); return statement?.kind === "statement" ? statement.text : undefined; })).toEqual(expectedTexts);
    const actual = statementIds.flatMap((id) => citationsFor(id).map(({ object, role, locator }) => [id, object.id, role, locator]));
    expect(actual).toEqual(expectedCitationTuples);
    const mutation = expectedCitationTuples.map((row, index) => index === 0 ? [row[0], row[1], row[2], "mutated locator"] : [...row]);
    expect(actual).not.toEqual(mutation);
    expect(entityById("ross-autonomist-critique-source")).toMatchObject({ identifiers: { doi: "10.1521/siso.2018.82.4.531" }, description: expect.stringContaining("pp. 531–554") });
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
