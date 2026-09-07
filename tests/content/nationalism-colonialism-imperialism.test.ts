import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import { compileDomainGraph } from "../../src/lib/domain";
import {
  canonicalGraph,
  citationsFor,
  dossierForSubject,
  researchObligationsForTarget,
  subjectGuideBySlug,
} from "../../src/lib/domain/canonical";

const claims = [
  "nationalism-attitude-program-boundary",
  "nation-state-boundary",
  "self-determination-statehood-boundary",
  "anderson-imagined-community",
  "anderson-horizontal-inequality",
  "chatterjee-derivative-dispute",
  "chatterjee-state-unity-limit",
  "tagore-nation-society-rival",
  "nationalism-self-description-limit",
  "national-unity-exclusion-boundary",
  "colonialism-domination-definition",
  "colonization-colonialism-boundary",
  "colonial-arrangements-plural",
  "colonial-formal-practice-boundary",
  "colonial-archive-mediation",
  "cesaire-colonization-civilization-rival",
  "cooper-category-boundary",
  "decolonization-independence-boundary",
  "kaulia-lahui-annexation-refusal",
  "silva-continuing-sovereignty-claim",
  "colonial-modernization-boundary",
  "imperialism-power-extension-definition",
  "empire-imperialism-boundary",
  "imperial-mechanisms-plural",
  "formal-informal-empire-boundary",
  "nkrumah-neocolonial-definition",
  "sep-indirect-imperial-boundary",
  "imperial-cultural-project-boundary",
  "capitalist-imperialism-rival-boundary",
  "imperial-allegation-proof-boundary",
  "imperial-country-essence-boundary",
  "hawaii-petition-scale",
  "hawaii-petition-language-provenance",
  "hawaii-annexation-sequence",
  "hawaii-case-boundary",
  "bandung-participation",
  "bandung-anticolonial-principles",
  "bandung-worldmaking-boundary",
  "ghana-legal-independence",
  "ghana-worldmaking-project",
  "ghana-neocolonial-limit",
  "un-1514-self-determination",
  "decolonization-sequence-limit",
] as const;

const sourceBases = [
  "sep-nationalism",
  "anderson-imagined",
  "chatterjee-nationalist-thought",
  "tagore-nationalism",
  "sep-colonialism",
  "cooper-colonialism-question",
  "cesaire-discourse",
  "silva-aloha-betrayed",
  "hawaii-kue-petitions",
  "silva-1897-petitions",
  "bandung-communique",
  "un-resolution-1514",
  "getachew-worldmaking",
  "nkrumah-neocolonialism",
  "ghana-independence-act",
] as const;
const caseIds = [
  "hawaiian-overthrow-annexation-1893-1898",
  "hawaiian-annexation-resistance-episode",
  "bandung-conference-1955",
  "bandung-communique-episode",
  "ghana-independence-1957",
  "ghana-independence-legal-transition-episode",
  "tawantinsuyu-imperial-organization",
] as const;
const obligationIds = [
  "nationalism-translation-people-nation",
  "nationalism-unity-exclusion",
  "colonialism-independence-institutional-persistence",
  "colonialism-settler-indigenous-scope",
  "imperialism-informal-falsifiability",
  "imperialism-capital-geopolitics-counterfactual",
] as const;

function ledger(documents = canonicalDocuments) {
  const graph = compileDomainGraph(documents);
  const entity = (id: string) => {
    const found = graph.indexes.entitiesById[id];
    if (!found) throw new Error(`Missing ${id}`);
    return found;
  };
  return {
    statements: claims.map(entity),
    works: sourceBases.map((id) => entity(`${id}-work`)),
    sources: sourceBases.map((id) => entity(`${id}-source`)),
    cases: caseIds.map(entity),
    obligations: obligationIds.map(entity),
    guides: ["guide-nationalism", "guide-colonialism", "guide-imperialism"].map(
      (id) => graph.subjectGuides.find((guide) => guide.id === id),
    ),
    dossiers: [
      "nationalism-dossier",
      "colonialism-dossier",
      "imperialism-dossier",
    ].map(entity),
    relationships: graph.relationships.filter(({ subject }) =>
      ["nationalism", "colonialism", "imperialism", ...claims].includes(
        subject.id as never,
      ),
    ),
  };
}

describe("Nationalism, Colonialism, and Imperialism canonical tranche", () => {
  it("pins the exact reviewed ledger", () => {
    expect(ledger()).toMatchSnapshot();
  });

  it("keeps the exact Statement-to-citation locator structure", () => {
    expect(claims).toHaveLength(43);
    const usedSources = new Set<string>();
    for (const id of claims) {
      expect(canonicalGraph.indexes.entitiesById[id]).toMatchObject({
        kind: "statement",
        publicationStatus: "reviewed",
      });
      const citations = citationsFor(id);
      expect(citations.length).toBeGreaterThan(0);
      for (const citation of citations) {
        expect(citation.locator.trim().length).toBeGreaterThan(4);
        usedSources.add(citation.object.id);
      }
    }
    expect(usedSources).toEqual(
      new Set(sourceBases.map((id) => `${id}-source`)),
    );
  });
});

describe("Nationalism, Colonialism, and Imperialism boundary fixtures", () => {
  it("models publisher pages separately from consulted full-text manifestations", () => {
    for (const id of [
      "anderson-imagined",
      "chatterjee-nationalist-thought",
      "cooper-colonialism-question",
      "getachew-worldmaking",
      "silva-aloha-betrayed",
    ]) {
      const source = canonicalGraph.indexes.entitiesById[`${id}-source`];
      expect(source).toMatchObject({
        kind: "source",
        sourceType: "web-page",
        resourceLinks: [expect.objectContaining({ purpose: "publisher" })],
      });
    }
    expect(
      canonicalGraph.indexes.entitiesById["cesaire-discourse-source"],
    ).toMatchObject({
      kind: "source",
      sourceType: "edition",
      resourceLinks: [
        expect.objectContaining({ purpose: "authorized-reading" }),
      ],
    });
    for (const id of ["silva-1897-petitions"]) {
      expect(canonicalGraph.indexes.entitiesById[`${id}-source`]).toMatchObject(
        {
          kind: "source",
          resourceLinks: [
            expect.objectContaining({ purpose: "authorized-reading" }),
          ],
        },
      );
    }
  });

  it("publishes three independently useful guides and six focused obligations", () => {
    for (const id of ["nationalism", "colonialism", "imperialism"] as const) {
      expect(subjectGuideBySlug(id)?.primarySubject).toEqual({
        kind: "concept",
        id,
      });
      expect(
        dossierForSubject("concept", id)?.standfirst.length,
      ).toBeGreaterThan(80);
      expect(researchObligationsForTarget("concept", id)).toHaveLength(2);
    }
    expect(obligationIds).toHaveLength(6);
  });

  it("keeps cases bounded and prevents embodiment or inherited classification", () => {
    const forbidden = canonicalGraph.relationships.filter(
      ({ predicate, subject }) =>
        caseIds.includes(subject.id as never) &&
        ["embodied", "applies-to-case", "contested-in-case"].includes(
          predicate,
        ),
    );
    expect(forbidden).toEqual([]);
    expect(
      canonicalGraph.indexes.entitiesById[
        "hawaiian-overthrow-annexation-1893-1898"
      ],
    ).toMatchObject({
      kind: "case",
      startDate: { year: 1893 },
      endDate: { year: 1898 },
    });
    expect(
      canonicalGraph.indexes.entitiesById["ghana-independence-1957"],
    ).toMatchObject({
      kind: "case",
      startDate: { year: 1957, month: 3, day: 6 },
      endDate: { year: 1957, month: 3, day: 6 },
      episodeIds: ["ghana-independence-legal-transition-episode"],
    });
    expect(
      canonicalGraph.indexes.entitiesById[
        "ghana-independence-legal-transition-episode"
      ],
    ).toMatchObject({
      formalRuleStatementIds: ["ghana-legal-independence"],
      interactionStatementIds: [],
      outcomeStatementIds: [],
    });
  });
});

describe("Nationalism, Colonialism, and Imperialism mutation fixtures", () => {
  it("detects claim, citation, and guide ledger mutations", () => {
    const changed = structuredClone(canonicalDocuments);
    const claim = changed.find(
      (doc) =>
        doc.documentType === "entity" &&
        doc.entity.id === "nation-state-boundary",
    );
    if (claim?.documentType !== "entity" || claim.entity.kind !== "statement")
      throw new Error("missing statement");
    claim.entity.text += " drift";
    expect(ledger(changed)).not.toEqual(ledger());

    const citationDocs = structuredClone(canonicalDocuments);
    const citation = citationDocs.find(
      (doc) =>
        doc.documentType === "relationships" &&
        doc.subject.id === "nation-state-boundary",
    );
    if (
      citation?.documentType !== "relationships" ||
      citation.relationships[0]?.predicate !== "cites"
    )
      throw new Error("missing citation");
    citation.relationships[0].locator = "drift";
    expect(ledger(citationDocs)).not.toEqual(ledger());

    const guideDocs = structuredClone(canonicalDocuments);
    const guide = guideDocs.find(
      (doc) =>
        doc.documentType === "subject-guide" &&
        doc.guide.id === "guide-nationalism",
    );
    if (guide?.documentType !== "subject-guide")
      throw new Error("missing guide");
    guide.guide.description += " drift";
    expect(ledger(guideDocs)).not.toEqual(ledger());
  });
});
