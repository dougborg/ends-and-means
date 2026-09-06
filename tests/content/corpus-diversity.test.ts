import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  auditCorpusCandidateMatrix,
  corpusCandidateMatrixSchema,
} from "../../scripts/corpus-diversity";

const matrixPath = fileURLToPath(
  new URL("../../research/corpus-diversity/candidates.json", import.meta.url),
);
const matrix = JSON.parse(await readFile(matrixPath, "utf8"));

describe("corpus diversity candidate contract", () => {
  it("keeps the bounded seed valid, multidimensional, and non-canonical", async () => {
    const candidates = corpusCandidateMatrixSchema.parse(matrix);
    expect(candidates).toHaveLength(9);
    expect(
      new Set(candidates.flatMap(({ contextTags }) => contextTags)),
    ).toEqual(
      new Set([
        "east-asian",
        "south-asian",
        "southeast-asian",
        "central-inner-asian",
        "pacific-oceanian",
        "african",
        "islamic",
        "caribbean-diasporic",
        "european",
        "american",
      ]),
    );
    expect(
      candidates.every(({ status }) => status === "research-possibility"),
    ).toBe(true);
    expect(
      candidates.every(
        ({ selfDescription, sourceFeasibility }) =>
          selfDescription.provenanceNotes.length > 0 &&
          sourceFeasibility.communityAuthored.notes.length > 0 &&
          sourceFeasibility.independentScholarship.notes.length > 0,
      ),
    ).toBe(true);
    const canonicalIndex = await readFile(
      fileURLToPath(new URL("../../content/domain/index.ts", import.meta.url)),
      "utf8",
    );
    expect(canonicalIndex).not.toMatch(/corpus-diversity|candidates\.json/u);
  });

  it.each([
    "namedPeopleOrCommunity",
    "place",
    "period",
    "learnerQuestion",
    "politicalRelationships",
    "sourceFeasibility",
    "evidenceRisks",
    "researchObligations",
  ])("rejects a candidate missing required field %s", (field) => {
    const candidate = structuredClone(matrix[0]);
    delete candidate[field];
    expect(corpusCandidateMatrixSchema.safeParse([candidate]).success).toBe(
      false,
    );
  });

  it.each(["viable", "partial"] as const)(
    "rejects evidence-bearing %s feasibility without a checked lead",
    (availability) => {
      const candidate = structuredClone(matrix[0]);
      candidate.sourceFeasibility.communityAuthored = {
        availability,
        notes: "A claim of availability without a checked source.",
        sourceLeads: [],
      };
      expect(corpusCandidateMatrixSchema.safeParse([candidate]).success).toBe(
        false,
      );
    },
  );

  it.each(["not-found", "not-assessed"] as const)(
    "rejects %s feasibility that incoherently retains a checked lead",
    (availability) => {
      const candidate = structuredClone(matrix[0]);
      candidate.sourceFeasibility.communityAuthored.availability = availability;
      expect(corpusCandidateMatrixSchema.safeParse([candidate]).success).toBe(
        false,
      );
    },
  );
});

describe("corpus diversity portfolio audit", () => {
  it("reports missing contexts and material relationship concentration without scoring", () => {
    const concentrated = structuredClone(matrix.slice(0, 5));
    for (const candidate of concentrated)
      candidate.politicalRelationships = ["state"];
    const findings = auditCorpusCandidateMatrix(concentrated);
    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: "attention",
          location: "portfolio:state",
          remediation: expect.stringContaining("never a quota filler"),
        }),
        expect.objectContaining({
          severity: "attention",
          location: "portfolio:american",
          remediation: expect.stringContaining(
            "specifically named people or community",
          ),
        }),
      ]),
    );
    expect(
      findings.some(({ message }) => /score|rank|quota/iu.test(message)),
    ).toBe(false);
  });

  it("returns deterministic findings for permuted candidate input", () => {
    const forward = auditCorpusCandidateMatrix(matrix.slice(0, 4));
    const reverse = auditCorpusCandidateMatrix(matrix.slice(0, 4).toReversed());
    expect(reverse).toEqual(forward);
  });

  it("fails closed on malformed and duplicate candidates", () => {
    const malformed = structuredClone(matrix[0]);
    malformed.sourceFeasibility.translation = "";
    const malformedFindings = auditCorpusCandidateMatrix([malformed]);
    expect(malformedFindings).toContainEqual(
      expect.objectContaining({ severity: "violation" }),
    );

    const duplicateFindings = auditCorpusCandidateMatrix([
      matrix[0],
      matrix[0],
    ]);
    expect(duplicateFindings).toContainEqual(
      expect.objectContaining({
        severity: "violation",
        message: "duplicate candidate ID",
      }),
    );
  });
});
