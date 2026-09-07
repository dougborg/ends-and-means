import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import type { AuthoringDocument } from "../../src/lib/domain";
import { compileDomainGraph } from "../../src/lib/domain";
import {
  citationsFor,
  entityById,
  subjectGuideById,
} from "../../src/lib/domain/canonical";

const statementIds = [
  "oligarchy-aristotle-few-common-interest",
  "oligarchy-aristotle-wealth-distinction",
  "oligarchy-simonton-historical-form",
  "oligarchy-winters-wealth-defense",
  "oligarchy-page-winters-democracy-coexistence",
  "oligarchy-elite-theory-distinction",
  "oligarchy-polemic-boundary",
  "oligarchy-inequality-boundary",
  "oligarchy-officeholding-boundary",
  "oligarchy-regime-boundary",
  "athens-411-war-crisis",
  "athens-411-five-thousand-proposal",
  "athens-411-four-hundred-actual-rule",
  "athens-411-coercion",
  "athens-411-four-hundred-duration",
  "athens-411-five-thousand-successor",
  "athens-411-source-boundary",
  "indonesia-winters-material-power",
  "indonesia-winters-wealth-defense",
  "indonesia-democracy-coexistence",
  "indonesia-hadiz-robison-rival",
  "indonesia-beyond-oligarchy-critique",
  "indonesia-debate-reply",
  "indonesia-case-boundary",
  "us-gilens-page-dataset",
  "us-gilens-page-elite-effect",
  "us-gilens-page-average-effect",
  "us-gilens-page-not-oligarchy-test",
  "us-gilens-earlier-income-gradient",
  "us-bashir-model-critique",
  "us-gilens-simulation-reply",
  "us-study-bounded-conclusion",
] as const;

const rivalDefinitionIds = [
  "oligarchy-aristotle-few-common-interest",
  "oligarchy-aristotle-wealth-distinction",
  "oligarchy-simonton-historical-form",
  "oligarchy-winters-wealth-defense",
  "oligarchy-page-winters-democracy-coexistence",
  "oligarchy-elite-theory-distinction",
] as const;

const caseIds = [
  "athens-four-hundred-five-thousand-411-bce",
  "indonesia-oligarchy-debate-1998-2013",
  "us-federal-policy-preferences-1981-2002",
] as const;

const obligationIds = [
  "oligarchy-minority-delegation-boundary",
  "oligarchy-wealth-political-conversion",
  "oligarchy-wealth-defense-travel",
  "oligarchy-ancient-translation-reception",
  "oligarchy-us-policy-model-robustness",
  "oligarchy-regime-label-threshold",
] as const;

function cloneDocuments() {
  return structuredClone(canonicalDocuments);
}

function authoredEntity(documents: AuthoringDocument[], id: string) {
  const document = documents.find(
    (entry) => entry.documentType === "entity" && entry.entity.id === id,
  );
  if (document?.documentType !== "entity") throw new Error(`Missing ${id}`);
  return document.entity;
}

describe("foundational Oligarchy guide", () => {
  it("keeps rival meanings and the evidence floor visible", () => {
    expect(statementIds.length).toBeGreaterThanOrEqual(24);
    expect(rivalDefinitionIds).toHaveLength(6);
    for (const id of statementIds) {
      expect(entityById(id)?.kind).toBe("statement");
      expect(citationsFor(id).length).toBeGreaterThan(0);
      expect(citationsFor(id).every(({ locator }) => locator.length > 0)).toBe(
        true,
      );
    }
    const sourceIds = new Set(
      statementIds.flatMap((id) =>
        citationsFor(id).map(({ object }) => object.id),
      ),
    );
    expect(sourceIds.size).toBeGreaterThanOrEqual(12);
    expect(obligationIds).toHaveLength(6);
  });

  it("pins every Statement, citation role, and locator in the evidence ledger", () => {
    expect(
      statementIds.map((id) => {
        const record = entityById(id);
        if (record?.kind !== "statement") throw new Error(`Missing ${id}`);
        return {
          id,
          statementKind: record.statementKind,
          text: record.text,
          citations: citationsFor(id).map(
            ({ object, role, locator, note }) => ({
              sourceId: object.id,
              role,
              locator,
              ...(note ? { note } : {}),
            }),
          ),
        };
      }),
    ).toMatchSnapshot();
  });

  it("pins the scoped Concept, bounded cases, open questions, and guide composition", () => {
    expect({
      concept: entityById("oligarchy"),
      cases: caseIds.map((id) => entityById(id)),
      obligations: obligationIds.map((id) => entityById(id)),
      guide: subjectGuideById("guide-oligarchy"),
    }).toMatchSnapshot();
  });

  it("publishes three bounded cases rather than country verdicts", () => {
    for (const id of caseIds) expect(entityById(id)?.kind).toBe("case");
    expect(
      entityById("athens-four-hundred-five-thousand-411-bce"),
    ).toMatchObject({ startDate: { year: -411 }, endDate: { year: -411 } });
    expect(entityById("indonesia-oligarchy-debate-1998-2013")).toMatchObject({
      startDate: { year: 1998 },
      endDate: { year: 2013 },
    });
    expect(entityById("us-federal-policy-preferences-1981-2002")).toMatchObject(
      {
        startDate: { year: 1981 },
        endDate: { year: 2002 },
      },
    );
  });
});

describe("Oligarchy model boundaries", () => {
  it("keeps Oligarchy independent from Democracy, Capitalism, and Authoritarianism", () => {
    const graph = compileDomainGraph(canonicalDocuments);
    const authoredRelationships = graph.relationships.filter(
      ({ subject, object }) =>
        subject.id === "oligarchy" || object.id === "oligarchy",
    );
    expect(
      authoredRelationships.every(
        ({ predicate }) => predicate === "contested-in-case",
      ),
    ).toBe(true);
    expect(
      subjectGuideById("guide-oligarchy")?.sections.at(-2)?.entityRefs,
    ).toEqual([
      { kind: "concept", id: "democracy" },
      { kind: "concept", id: "capitalism" },
      { kind: "concept", id: "authoritarianism" },
    ]);
  });

  it("rejects removal of the bounded U.S. Case scope", () => {
    const caseDocuments = cloneDocuments();
    const boundedCase = authoredEntity(
      caseDocuments,
      "us-federal-policy-preferences-1981-2002",
    );
    if (boundedCase.kind !== "case") throw new Error("Expected Case");
    boundedCase.scope = "";
    expect(() => compileDomainGraph(caseDocuments)).toThrow(
      "us-federal-policy-preferences-1981-2002: Case scope is empty",
    );
  });
});
