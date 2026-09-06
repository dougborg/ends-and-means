import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import { compileDomainGraph } from "../../src/lib/domain";
import {
  canonicalGraph,
  citationsFor,
  dossierForSubject,
  entityById,
  relationshipsFrom,
  researchObligationsForTarget,
  subjectGuideById,
} from "../../src/lib/domain/canonical";

const expected = {
  "monarchy-office-form-definition": [
    "idea-constitutional-monarchs-source",
    "pp. 3–6, ‘Introduction’ and ‘The role of a constitutional monarch’",
  ],
  "monarchy-heredity-boundary": [
    "idea-constitutional-monarchs-source",
    "p. 12, ‘Alternative forms of succession’",
  ],
  "monarchy-succession-varies": [
    "idea-constitutional-monarchs-source",
    "p. 12, ‘Alternative forms of succession’",
  ],
  "monarchy-head-roles-boundary": [
    "idea-constitutional-monarchs-source",
    "pp. 3–8, head of state and parliamentary government",
  ],
  "monarchy-formal-practice-boundary": [
    "idea-constitutional-monarchs-source",
    "pp. 7–13, discretion, advice, and constitutional conventions",
  ],
  "monarchy-reserve-delegated-boundary": [
    "idea-constitutional-monarchs-source",
    "pp. 7–13, advice and discretionary powers",
  ],
  "monarchy-democracy-boundary": [
    "idea-constitutional-monarchs-source",
    "pp. 3–6, monarchy within parliamentary democracies",
  ],
  "monarchy-authoritarian-boundary": [
    "idea-constitutional-monarchs-source",
    "pp. 3–6, limited scope to parliamentary constitutional monarchy",
  ],
  "monarchy-theocracy-boundary": ["saudi-basic-law-source", "articles 1 and 7"],
  "monarchy-republic-boundary": [
    "idea-constitutional-monarchs-source",
    "p. 10, ‘Republic or monarchy?’",
  ],
  "monarchy-empire-boundary": [
    "sep-colonialism-monarchy-boundaries-source",
    "section 1, paragraphs 4–7, imperialism and control over dependent territory",
  ],
  "monarchy-colonial-rule-boundary": [
    "sep-colonialism-monarchy-boundaries-source",
    "opening definition and section 1, paragraphs 1–3",
  ],
  "monarchy-nobility-boundary": [
    "oxford-nobility-definition-source",
    "sense 1, ‘the nobility’",
  ],
  "japan-emperor-symbol-rule": [
    "japan-constitution-moj-source",
    "article 1; Japanese text and government reference translation; site disclaimer",
  ],
  "japan-constitution-commencement": [
    "japan-constitution-moj-source",
    "law date 3 November 1946 and article 100, six-month commencement rule",
  ],
  "japan-emperor-no-government-powers": [
    "japan-constitution-moj-source",
    "article 4",
  ],
  "japan-emperor-cabinet-advice": [
    "japan-constitution-moj-source",
    "article 3",
  ],
  "japan-emperor-enumerated-acts": [
    "japan-constitution-moj-source",
    "articles 6–7",
  ],
  "japan-succession-male-line": [
    "japan-imperial-house-law-source",
    "article 1, Japanese source text on e-Gov",
  ],
  "japan-practice-influence-question": [
    "shugiin-emperor-study-source",
    "‘Main points of Prof. YOKOTA’s statement,’ sections 1–5, especially sections 3–5",
  ],
  "tonga-2013-assembly-composition": [
    "tonga-constitution-constitute-source",
    "clauses 59–60, composition and representative members",
  ],
  "tonga-king-appoints-pm": [
    "tonga-constitution-constitute-source",
    "clause 50A, election and appointment of Prime Minister",
  ],
  "tonga-retained-royal-formal-powers": [
    "tonga-constitution-constitute-source",
    "clause 50, Privy Council",
  ],
  "tonga-cabinet-executive-design": [
    "tonga-constitution-constitute-source",
    "clauses 50A–51, Prime Minister and Cabinet",
  ],
  "tonga-2010-government-formation": [
    "tonga-crown-law-prime-minister-2010-source",
    "media release dated 24 December 2010, first page, paragraphs 2–3",
  ],
  "tonga-record-mediation-boundary": [
    "tonga-constitution-constitute-source",
    "title page and document metadata; no translator or source-text provenance stated",
  ],
  "saudi-monarchy-basic-law": [
    "saudi-basic-law-source",
    "article 5(a), consulted English consolidation",
  ],
  "saudi-succession-designation": ["saudi-basic-law-source", "article 5(b)"],
  "saudi-crown-prince-designation": ["saudi-basic-law-source", "article 5(c)"],
  "saudi-basic-law-king-prime-minister-clause": [
    "saudi-basic-law-source",
    "articles 55–56",
  ],
  "saudi-2022-crown-prince-prime-minister": [
    "spa-2022-prime-minister-order-source",
    "first royal order, paragraphs 1–2, 27 September 2022",
  ],
  "saudi-religious-law-rule": ["saudi-basic-law-source", "articles 1 and 7"],
  "saudi-theocracy-classification-boundary": [
    "loc-saudi-country-study-source",
    "printed pp. 208–209, ‘Islam’ and religious-legal institutions",
  ],
  "saudi-dynastic-rules-in-use": [
    "herb-all-in-family-source",
    "chapter 1, printed p. 8 (PDF p. 10), definition of dynastic monarchy",
  ],
  "saudi-ruling-family-institution-herb": [
    "herb-all-in-family-source",
    "chapter 1, printed p. 8 (PDF p. 10), Saudi Arabia placement and family participation contrast",
  ],
  "three-cases-nonrepresentative": [
    "idea-constitutional-monarchs-source",
    "pp. 3–13, bounded constitutional-monarchy typology",
  ],
} as const;

const addResolvedSourceAndWork = (ids: Set<string>, sourceId: string) => {
  ids.add(sourceId);
  const source = entityById(sourceId);
  expect(source, `unresolved Source ${sourceId}`).toMatchObject({
    kind: "source",
  });
  if (source?.kind !== "source") return;
  const { workId } = source;
  expect(workId, `missing workId for ${sourceId}`).toBeDefined();
  if (!workId) return;
  ids.add(workId);
  expect(
    entityById(workId),
    `unresolved Work ${workId} for ${sourceId}`,
  ).toMatchObject({ kind: "work" });
};

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: this cohesive ledger covers the full monarchy tranche and its mutation boundary.
describe("monarchy evidence and boundaries", () => {
  it("freezes the complete monarchy entity and relationship ledger", () => {
    const ids = new Set(
      canonicalDocuments.flatMap((document) => {
        if (document.documentType === "entity") {
          const { id } = document.entity;
          return id.includes("monarch") ||
            id.startsWith("tonga-") ||
            id.startsWith("saudi-") ||
            id.startsWith("japan-emperor") ||
            id.startsWith("japan-symbolic") ||
            [
              "theocracy",
              "executive-authority",
              "legislative-accountability",
              "tonga",
              "saudi-arabia",
            ].includes(id)
            ? [id]
            : [];
        }
        if (
          document.documentType === "subject-guide" &&
          document.guide.id === "guide-monarchy"
        )
          return [document.guide.id];
        return [];
      }),
    );
    for (const [statementId, [sourceId]] of Object.entries(expected)) {
      ids.add(statementId);
      addResolvedSourceAndWork(ids, sourceId);
      for (const citation of citationsFor(statementId))
        addResolvedSourceAndWork(ids, citation.object.id);
    }
    expect({
      entities: [...ids]
        .filter((id) => id !== "guide-monarchy")
        .sort()
        .map((id) => entityById(id)),
      guide: subjectGuideById("guide-monarchy"),
      relationships: canonicalGraph.relationships.filter(
        ({ id, subject, object }) =>
          id.includes("monarch") || ids.has(subject.id) || ids.has(object.id),
      ),
    }).toMatchSnapshot();
  });

  it("pins at least twenty atomic claims to ten locator-backed sources", () => {
    expect(Object.keys(expected).length).toBeGreaterThanOrEqual(20);
    for (const [id, [source, locator]] of Object.entries(expected)) {
      expect(entityById(id), id).toMatchObject({ kind: "statement" });
      expect(citationsFor(id), id).toContainEqual(
        expect.objectContaining({
          object: { kind: "source", id: source },
          locator,
        }),
      );
    }
    const citedSources = new Set(
      Object.keys(expected).flatMap((id) =>
        citationsFor(id).map(({ object }) => object.id),
      ),
    );
    expect(citedSources.size).toBeGreaterThanOrEqual(10);
    expect(citationsFor("saudi-theocracy-classification-boundary")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          object: { kind: "source", id: "saudi-basic-law-source" },
          locator: "articles 1 and 7, stated religious sources of authority",
          role: "context",
        }),
      ]),
    );
  });

  it("separates original Work years from consulted manifestations", () => {
    for (const [id, originalPublicationYear] of [
      ["idea-constitutional-monarchs-work", 2014],
      ["shugiin-emperor-study-work", 2004],
      ["tonga-crown-law-prime-minister-2010-work", 2010],
      ["spa-2022-prime-minister-order-work", 2022],
      ["loc-saudi-country-study-work", 1993],
    ] as const)
      expect(entityById(id)).toMatchObject({
        kind: "work",
        originalPublicationYear,
      });
    expect(entityById("japan-imperial-house-law-work")).toMatchObject({
      kind: "work",
      title: "Imperial House Act",
      originalPublicationYear: 1947,
    });
    expect(entityById("japan-imperial-house-law-source")).not.toHaveProperty(
      "publicationYear",
    );
  });
  it("keeps office, succession, approach, cases, and neighboring classifications independent", () => {
    expect(entityById("monarchy")).toMatchObject({ kind: "concept" });
    expect(entityById("monarchic-office")).toBeUndefined();
    expect(entityById("monarchic-succession")).toMatchObject({
      kind: "concept",
    });
    expect(entityById("constitutional-parliamentary-monarchy")).toMatchObject({
      kind: "approach",
    });
    for (const id of [
      "japan-symbolic-emperorship-1947-2004",
      "tonga-constitutional-settlement-2010-2013",
      "saudi-basic-law-monarchy-1992-2022",
    ])
      expect(entityById(id)).toMatchObject({
        kind: "case",
        asOf: "2026-09-06",
      });
    expect(relationshipsFrom("monarchy")).toEqual(
      expect.arrayContaining(
        [
          "republic",
          "democracy",
          "authoritarianism",
          "theocracy",
          "monarchic-succession",
          "executive-authority",
          "legislative-accountability",
        ].map((id) =>
          expect.objectContaining({
            predicate: "related-to",
            object: { kind: "concept", id },
            status: "qualified",
          }),
        ),
      ),
    );
    expect(
      relationshipsFrom("monarchy").some(({ predicate }) =>
        [
          "advocates-means",
          "advances-end",
          "member-of",
          "partially-instantiated",
        ].includes(predicate),
      ),
    ).toBe(false);
    expect(
      relationshipsFrom("constitutional-parliamentary-monarchy"),
    ).toContainEqual(
      expect.objectContaining({
        predicate: "interprets-concept",
        object: { kind: "concept", id: "monarchy" },
      }),
    );
    expect(relationshipsFrom("executive-dynastic-monarchy")).toContainEqual(
      expect.objectContaining({
        predicate: "interprets-concept",
        object: { kind: "concept", id: "monarchy" },
      }),
    );
    expect(entityById("japan-symbolic-emperorship-1947-2004")).toMatchObject({
      startDate: { year: 1947, month: 5, day: 3, certainty: "exact" },
      conditionStatementIds: expect.arrayContaining([
        "japan-constitution-commencement",
      ]),
    });
    expect(entityById("japan-symbolic-emperorship-episode")).toMatchObject({
      startDate: { year: 1947, month: 5, day: 3, certainty: "exact" },
      conditionStatementIds: expect.arrayContaining([
        "japan-constitution-commencement",
      ]),
    });
    expect(
      relationshipsFrom("saudi-basic-law-monarchy-episode"),
    ).toContainEqual(
      expect.objectContaining({
        predicate: "partially-instantiated",
        object: { kind: "approach", id: "executive-dynastic-monarchy" },
        status: "qualified",
        statementIds: ["saudi-ruling-family-institution-herb"],
      }),
    );
  });
  it("publishes one complete guide, visible rival boundaries, and four obligations", () => {
    const dossier = dossierForSubject("concept", "monarchy");
    const guide = subjectGuideById("guide-monarchy");
    expect(
      dossier?.sections.every(({ statementIds }) => statementIds.length > 0),
    ).toBe(true);
    expect(guide?.sections.map(({ role }) => role)).toEqual([
      "short-answer",
      "meanings-and-boundaries",
      "institutions-and-mechanisms",
      "bounded-practice",
      "variants-and-disputes",
      "comparisons-and-next-steps",
      "open-questions",
    ]);
    expect(researchObligationsForTarget("concept", "monarchy")).toHaveLength(4);
  });

  it("rejects a monarchy research obligation whose bounded scope is removed", () => {
    const documents = structuredClone(canonicalDocuments);
    const document = documents.find(
      (candidate) =>
        candidate.documentType === "entity" &&
        candidate.entity.id === "monarchy-formal-power-rules-in-use",
    );
    if (
      document?.documentType !== "entity" ||
      document.entity.kind !== "research-obligation"
    )
      throw new Error("Missing monarchy obligation fixture");
    document.entity.scope = "";
    expect(() => compileDomainGraph(documents)).toThrow(
      "monarchy-formal-power-rules-in-use: scope is empty",
    );
  });
});
