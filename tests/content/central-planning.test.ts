import { describe, expect, it } from "vitest";
import {
  citationsFor,
  dossierForSubject,
  entityById,
  relationshipsFrom,
  researchObligationsForTarget,
  subjectGuideBySlug,
} from "../../src/lib/domain/canonical";
import { compileDomainGraph } from "../../src/lib/domain";
import { canonicalDocuments } from "../../content/domain";

const expectedCitations = {
  "central-planning-family-boundary": ["landon-lane-rockoff-cmp-source", "abstract; pp. 1–4"],
  "cmp-authority": ["wpb-war-production-1944-source", "The Controlled Materials Plan in 1944, pp. 73–74"],
  "cmp-scope": ["wpb-war-production-1944-source", "The Controlled Materials Plan in 1944, pp. 73–74"],
  "cmp-information": ["wpb-war-production-1944-source", "The Controlled Materials Plan in 1944, pp. 73–75"],
  "cmp-targets": ["wpb-war-production-1944-source", "The Controlled Materials Plan in 1944, pp. 74–75"],
  "cmp-revision": ["wpb-war-production-1944-source", "The Controlled Materials Plan in 1944, pp. 78–85"],
  "cmp-enforcement": ["wpb-controlled-materials-plan-source", "sections 23–24, pp. 17–18"],
  "cmp-ownership": ["koistinen-arsenal-source", "chapters 12–13, pp. 302–369"],
  "cmp-operating-period": ["bureau-budget-united-states-war-source", "chapter X, pp. 305–306; chapter XV, p. 491"],
  "cmp-distributed-administration": ["wpb-war-production-1944-source", "The Controlled Materials Plan in 1944, pp. 73–75"],
  "cmp-official-performance-account": ["wpb-war-production-1944-source", "The Controlled Materials Plan in 1944, pp. 73, 79–85"],
  "cmp-performance-rival": ["landon-lane-rockoff-cmp-source", "abstract; pp. 24–27"],
  "cmp-power-rival": ["koistinen-arsenal-source", "publisher description, paragraphs 2–3; chapters 8 and 12–13"],
  "cmp-correctability-assessment": ["wpb-war-production-1944-source", "The Controlled Materials Plan in 1944, pp. 79–85"],
} as const;

describe("central planning bounded slice", () => {
  it("pins every substantive statement to the intended source and locator", () => {
    expect(Object.keys(expectedCitations)).toHaveLength(14);
    for (const [statementId, [sourceId, locator]] of Object.entries(expectedCitations)) {
      expect(entityById(statementId), statementId).toMatchObject({ kind: "statement" });
      expect(citationsFor(statementId), statementId).toEqual([
        expect.objectContaining({ object: { kind: "source", id: sourceId }, locator }),
      ]);
    }
    expect(new Set(Object.values(expectedCitations).map(([sourceId]) => sourceId)).size).toBeGreaterThanOrEqual(4);
  });

  it("keeps the Means family, Approach, organizations, and bounded episode distinct", () => {
    expect(entityById("central-planning-arrangements")).toMatchObject({ kind: "collection" });
    expect(entityById("controlled-materials-allocation")).toMatchObject({ kind: "means" });
    expect(entityById("us-wartime-production-mobilization")).toMatchObject({ kind: "approach" });
    for (const id of ["war-production-board", "wpb-requirements-committee", "cmp-claimant-agencies", "cmp-prime-contractors", "cmp-controlled-material-producers"]) {
      expect(entityById(id), id).toMatchObject({ kind: "organization" });
    }
    expect(entityById("cmp-operation-1943-1945")).toMatchObject({
      kind: "case-episode",
      startDate: { year: 1943, month: 4, day: 1 },
      endDate: { year: 1945, month: 9, day: 30 },
    });
    expect(relationshipsFrom("controlled-materials-allocation").filter(({ predicate }) => predicate === "specified-by")).toHaveLength(7);
    expect(relationshipsFrom("cmp-operation-1943-1945")).toEqual(expect.arrayContaining([
      expect.objectContaining({ predicate: "used-means", implementation: "mixed" }),
      expect.objectContaining({ predicate: "partially-instantiated", status: "qualified" }),
      expect.objectContaining({ predicate: "assessed-by", conclusion: "mixed" }),
    ]));
  });

  it("rejects an Organization whose bounded scope is removed", () => {
    const documents = structuredClone(canonicalDocuments);
    const organization = documents.find(
      (document) => document.documentType === "entity" && document.entity.id === "war-production-board",
    );
    if (organization?.documentType !== "entity" || organization.entity.kind !== "organization") {
      throw new Error("missing Organization fixture");
    }
    organization.entity.scope = "";
    expect(() => compileDomainGraph(documents)).toThrow("war-production-board: Organization scope is empty");
  });

  it("publishes one traceable guide and focused unresolved questions", () => {
    const guide = subjectGuideBySlug("central-planning");
    expect(guide?.primarySubject).toEqual({ kind: "case", id: "us-controlled-materials-plan" });
    expect(guide?.sections.map(({ role }) => role)).toEqual([
      "short-answer",
      "meanings-and-boundaries",
      "institutions-and-mechanisms",
      "bounded-practice",
      "variants-and-disputes",
      "comparisons-and-next-steps",
      "open-questions",
    ]);
    expect(dossierForSubject("case", "us-controlled-materials-plan")?.sections).toHaveLength(6);
    expect(researchObligationsForTarget("case", "us-controlled-materials-plan").map(({ id }) => id).sort()).toEqual([
      "cmp-causal-performance-counterfactual",
      "cmp-civilian-priority-counterevidence",
    ]);
  });
});
