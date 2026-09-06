import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import type { AuthoringDocument } from "../../src/lib/domain";
import { compileDomainGraph } from "../../src/lib/domain";
import {
  canonicalGraph,
  citationsFor,
  dossierForSubject,
  researchObligationsForTarget,
  subjectGuideBySlug,
} from "../../src/lib/domain/canonical";

const claims = [
  "liberalism-plural-traditions",
  "liberalism-authority-justification",
  "liberalism-liberty-disputes",
  "liberalism-old-new-boundary",
  "liberalism-label-insufficient",
  "mill-liberty-limiting-principle",
  "mill-colonial-exclusion",
  "mehta-liberal-empire-tension",
  "pateman-contract-gender-boundary",
  "india-equality-before-law",
  "india-discrimination-grounds",
  "india-special-provisions",
  "japan-legal-equality",
  "japan-marriage-consent",
  "japan-spousal-equality",
  "japan-rights-drafting-boundary",
  "conservatism-broad-narrow",
  "conservatism-tradition-reform",
  "conservatism-reaction-boundary",
  "conservatism-authoritarian-boundary",
  "conservatism-procedural-substantive",
  "burke-change-conservation",
  "burke-inheritance-prudence",
  "ahlen-programme-economic-order",
  "ahlen-programme-compromise",
  "duesseldorf-social-market-shift",
  "cdu-programme-change-boundary",
  "bell-rival-liberalism-methods",
  "huntington-rival-conservatism-types",
  "right-to-buy-conservative-programme",
  "right-to-buy-purchase-right",
  "right-to-buy-discounts",
  "right-to-buy-mortgage-duty",
  "right-to-buy-ministerial-intervention",
  "right-to-buy-buyer-distribution",
  "right-to-buy-residual-sector",
  "right-to-buy-rules-changed",
  "swatantra-economic-conservatism",
  "swatantra-ordered-progress",
  "swatantra-gender-limit",
  "swatantra-coalition-practice",
  "swatantra-parliamentary-practice",
  "swatantra-court-practice",
  "swatantra-formal-principles",
  "india-liberal-rights-test",
  "japan-liberal-rights-test",
  "right-to-buy-conservatism-boundary",
  "swatantra-conservatism-boundary",
  "liberalism-exclusion-evidence-limit",
  "liberalism-atlantic-taxonomy-limit",
  "conservatism-genealogy-limit",
] as const;

const sourceBases = [
  "sep-liberalism",
  "mill-on-liberty",
  "mehta-liberalism-empire",
  "pateman-sexual-contract",
  "japan-constitution",
  "nakanishi-japan-rights",
  "sep-conservatism",
  "burke-reflections",
  "cdu-ahlen-programme",
  "cdu-duesseldorf-guidelines",
  "bell-what-is-liberalism",
  "huntington-conservatism-ideology",
  "commons-right-to-buy",
  "housing-act-1980",
  "balasubramanian-free-economy",
  "swatantra-statement-principles",
  "bach-ahlen-history",
] as const;

const caseIds = [
  "india-constitutional-rights-settlement-1946-1950",
  "india-constitutional-rights-episode",
  "japan-constitutional-rights-settlement-1946-1947",
  "japan-constitutional-rights-episode",
  "right-to-buy-england-wales-1980-1998",
  "right-to-buy-initial-operation",
  "swatantra-opposition-organization-1959-1967",
  "swatantra-early-opposition-episode",
] as const;

const obligationIds = [
  "liberalism-geographic-translation",
  "liberalism-imperial-domination",
  "liberalism-gender-contract-boundary",
  "conservative-party-programme-drift",
  "conservatism-geographic-translation",
] as const;

function exactLedger(documents: AuthoringDocument[]) {
  const graph = compileDomainGraph(documents);
  const ids = new Set<string>(claims);
  const entity = (id: string) => {
    const value = graph.indexes.entitiesById[id];
    if (!value) throw new Error(`Missing ledger entity ${id}`);
    return value;
  };
  const citations = graph.relationships.filter(
    ({ predicate, subject }) => predicate === "cites" && ids.has(subject.id),
  );
  return {
    statements: claims.map((id) => entity(id)),
    citations,
    works: sourceBases.map((id) => entity(`${id}-work`)),
    sources: sourceBases.map((id) => entity(`${id}-source`)),
    relationships: graph.relationships.filter(
      ({ predicate, subject }) =>
        predicate !== "cites" &&
        (["liberalism", "conservatism"] as string[]).includes(subject.id),
    ),
    forbiddenCaseClassifications: graph.relationships.filter(
      ({ predicate, subject }) =>
        (caseIds as readonly string[]).includes(subject.id) &&
        ["applies-to-case", "contested-in-case", "embodied"].includes(
          predicate,
        ),
    ),
    cases: caseIds.map(entity),
    guides: ["guide-liberalism", "guide-conservatism"].map((id) =>
      graph.subjectGuides.find((guide) => guide.id === id),
    ),
    dossiers: ["liberalism-dossier", "conservatism-dossier"].map(entity),
    obligations: obligationIds.map(entity),
  };
}

function mutateEntity(
  documents: AuthoringDocument[],
  id: string,
  mutate: (entity: Record<string, unknown>) => void,
) {
  const document = documents.find(
    (candidate) =>
      candidate.documentType === "entity" && candidate.entity.id === id,
  );
  if (document?.documentType !== "entity") throw new Error(`Missing ${id}`);
  mutate(document.entity as unknown as Record<string, unknown>);
}

describe("Liberalism and Conservatism exact ledgers", () => {
  it("pins the complete public evidence, relationship, Case, guide, Dossier, and research ledgers", () => {
    expect(exactLedger(canonicalDocuments)).toMatchSnapshot();
  });

  it.each([
    ["Statement", "liberalism-plural-traditions", "text"],
    ["Work", "cdu-ahlen-programme-work", "workType"],
    ["Source", "cdu-ahlen-programme-source", "publicationYear"],
    ["Case", "right-to-buy-initial-operation", "conditionStatementIds"],
    ["Dossier", "liberalism-dossier", "description"],
    ["Research Obligation", "liberalism-geographic-translation", "description"],
  ] as const)("detects %s ledger mutation", (_label, id, field) => {
    const documents = structuredClone(canonicalDocuments);
    mutateEntity(documents, id, (entity) => {
      entity[field] = field.endsWith("Ids")
        ? []
        : `${String(entity[field])} drift`;
    });
    expect(exactLedger(documents)).not.toEqual(exactLedger(canonicalDocuments));
  });

  it.each(["object", "role", "locator"] as const)(
    "detects citation %s mutation",
    (field) => {
      const documents = structuredClone(canonicalDocuments);
      const document = documents.find(
        (candidate) =>
          candidate.documentType === "relationships" &&
          candidate.subject.id === "liberalism-plural-traditions",
      );
      if (document?.documentType !== "relationships")
        throw new Error("Missing citation");
      const citation = document.relationships[0];
      if (citation?.predicate !== "cites") throw new Error("Missing citation");
      if (field === "object") citation.object.id = "sep-conservatism-source";
      if (field === "role") citation.role = "context";
      if (field === "locator") citation.locator = "section drift";
      expect(exactLedger(documents)).not.toEqual(
        exactLedger(canonicalDocuments),
      );
    },
  );

  it("detects SubjectGuide composition mutation", () => {
    const documents = structuredClone(canonicalDocuments);
    const document = documents.find(
      (candidate) =>
        candidate.documentType === "subject-guide" &&
        candidate.guide.id === "guide-liberalism",
    );
    if (document?.documentType !== "subject-guide")
      throw new Error("Missing guide");
    document.guide.description = `${document.guide.description} drift`;
    expect(exactLedger(documents)).not.toEqual(exactLedger(canonicalDocuments));
  });
});

describe("Liberalism and Conservatism evidence", () => {
  it("keeps every substantive claim atomic and locator-backed", () => {
    expect(claims).toHaveLength(51);
    const sources = new Set<string>();
    for (const id of claims) {
      expect(canonicalGraph.indexes.entitiesById[id]).toMatchObject({
        kind: "statement",
      });
      const citations = citationsFor(id);
      expect(citations.length, id).toBeGreaterThan(0);
      expect(
        citations.every(({ locator }) => locator.trim().length > 0),
        id,
      ).toBe(true);
      for (const citation of citations) sources.add(citation.object.id);
    }
    expect(sources.size).toBeGreaterThanOrEqual(8);
  });

  it("keeps concepts, cases, and classifications distinct", () => {
    expect(canonicalGraph.indexes.entitiesById.liberalism).toMatchObject({
      kind: "concept",
    });
    expect(canonicalGraph.indexes.entitiesById.conservatism).toMatchObject({
      kind: "concept",
    });
    for (const id of [
      "india-constitutional-rights-settlement-1946-1950",
      "japan-constitutional-rights-settlement-1946-1947",
      "right-to-buy-england-wales-1980-1998",
      "swatantra-opposition-organization-1959-1967",
    ])
      expect(canonicalGraph.indexes.entitiesById[id]).toMatchObject({
        kind: "case",
      });
    for (const id of ["liberalism", "conservatism"])
      expect(
        canonicalGraph.relationships.filter(
          ({ subject, predicate }) =>
            subject.id === id &&
            ["advances-end", "advocates-means", "member-of"].includes(
              predicate,
            ),
        ),
      ).toEqual([]);
  });
});

describe("Liberalism and Conservatism guides", () => {
  it("publishes complete traced guides with bounded examples and open questions", () => {
    for (const id of ["liberalism", "conservatism"] as const) {
      const guide = subjectGuideBySlug(id);
      const dossier = dossierForSubject("concept", id);
      expect(guide?.publicationStatus).toBe("reviewed");
      expect(
        dossier?.sections.every(({ statementIds }) => statementIds.length > 0),
      ).toBe(true);
      const roles = guide?.sections.map(({ role }) => role) ?? [];
      expect(roles).toEqual(
        expect.arrayContaining([
          "short-answer",
          "meanings-and-boundaries",
          "institutions-and-mechanisms",
          "bounded-practice",
          "comparisons-and-next-steps",
          "open-questions",
        ]),
      );
      expect(roles.includes("variants-and-disputes")).toBe(id === "liberalism");
      expect(
        guide?.sections.find(({ role }) => role === "bounded-practice")
          ?.entityRefs,
      ).toHaveLength(2);
      expect(researchObligationsForTarget("concept", id)).toHaveLength(
        id === "liberalism" ? 3 : 2,
      );
    }
  });
});
