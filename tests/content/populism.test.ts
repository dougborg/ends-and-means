import { describe, expect, it } from "vitest";
import {
  canonicalGraph,
  citationsFor,
  entityById,
  subjectGuideById,
} from "../../src/lib/domain/canonical";

const sourceBases = [
  "mudde-zeitgeist",
  "weyland-contested",
  "aslanidis-ideology",
  "moffitt-global-rise",
  "muller-populism",
  "rovira-ambivalence",
  "peoples-platforms-1896",
  "omaha-congressional-record",
  "argentina-constitution-1949",
  "resnick-populist-strategies",
  "zambia-assembly-2007",
  "thailand-policy-2001",
  "phongpaichit-baker-thaksin",
] as const;

const statementIds = [
  "populism-contested-category",
  "populism-people-elite-core",
  "mudde-thin-ideology",
  "weyland-strategy-definition",
  "aslanidis-discourse-definition",
  "moffitt-style-definition",
  "muller-antipluralism",
  "populism-label-provenance",
  "popularity-insufficient",
  "redistribution-insufficient",
  "anti-elitism-antipluralism-distinct",
  "host-ideology-boundary",
  "democratic-ambivalence",
  "people-is-constructed",
  "omaha-corruption-claim",
  "omaha-institutional-demands",
  "peoples-party-fusion-boundary",
  "peoples-party-case-limit",
  "peron-social-justice-constitution",
  "peron-organized-community",
  "peronism-self-description-boundary",
  "peron-case-limit",
  "sata-urban-poor-strategy",
  "sata-china-rhetoric",
  "zambia-opposition-institution",
  "zambia-case-limit",
  "thai-policy-program",
  "thaksin-classification-developed",
  "prachaniyom-translation-boundary",
  "thailand-case-limit",
] as const;

const caseIds = [
  "us-peoples-party-1890-1896",
  "peronist-formation-1943-1955",
  "zambia-pf-opposition-2001-2008",
  "thai-rak-thai-government-2001-2006",
] as const;

const obligationIds = [
  "populism-definition-sensitivity",
  "populism-people-exclusions",
  "populism-inclusion-antipluralism",
  "populism-leader-organization-counterfactual",
  "populism-translation-category-travel",
  "populism-policy-attribution",
] as const;

describe("foundational populism guide", () => {
  it("publishes the required evidence, case, and open-question floor", () => {
    const guide = subjectGuideById("guide-populism");
    expect(guide?.description).toContain("disputed category");
    expect(guide?.description).not.toMatch(/learner|journey|path|workflow|pull request/i);
    expect(statementIds).toHaveLength(30);
    for (const id of statementIds) {
      expect(entityById(id)?.kind).toBe("statement");
      expect(citationsFor(id).length).toBeGreaterThan(0);
      expect(citationsFor(id).every(({ locator }) => locator.length > 0)).toBe(true);
    }
    const sourceIds = new Set(statementIds.flatMap((id) => citationsFor(id).map(({ object }) => object.id)));
    expect(sourceIds.size).toBeGreaterThanOrEqual(14);
    for (const id of caseIds) expect(entityById(id)?.kind).toBe("case");
    for (const id of obligationIds) expect(entityById(id)?.kind).toBe("research-obligation");
  });

  it("keeps rival definitions attributed and four cases bounded", () => {
    expect(entityById("mudde-thin-ideology")).toMatchObject({ statementKind: "classification" });
    expect(entityById("weyland-strategy-definition")).toMatchObject({ statementKind: "classification" });
    expect(entityById("aslanidis-discourse-definition")).toMatchObject({ statementKind: "classification" });
    expect(entityById("moffitt-style-definition")).toMatchObject({ statementKind: "classification" });
    expect(entityById("muller-antipluralism")).toMatchObject({ statementKind: "classification" });
    expect(
      caseIds.map((id) => {
        const entity = entityById(id);
        return entity?.kind === "case" ? entity.locationIds.at(0) : undefined;
      }),
    ).toEqual([
      "united-states-populism-case",
      "argentina-populism-case",
      "zambia-populism-case",
      "thailand-populism-case",
    ]);
  });

  it("places enacted rules, proposals, interactions, and outcomes in distinct episode fields", () => {
    const peronEpisode = entityById("first-peron-governments-episode");
    expect(peronEpisode).toMatchObject({
      kind: "case-episode",
      formalRuleStatementIds: ["peron-social-justice-constitution"],
      interactionStatementIds: ["peron-organized-community"],
      outcomeStatementIds: [],
    });

    const thaiEpisode = entityById("thaksin-first-governments-episode");
    expect(thaiEpisode).toMatchObject({
      kind: "case-episode",
      formalRuleStatementIds: [],
      interactionStatementIds: [
        "thai-policy-program",
        "thaksin-classification-developed",
      ],
      outcomeStatementIds: [],
    });
  });

  it("pins the complete source, citation, and presentation ledgers", () => {
    const sources = [
      ...sourceBases.map((base) => ({
        work: entityById(`${base}-work`),
        source: entityById(`${base}-source`),
      })),
      {
        work: entityById("peron-philosophy-address-work"),
        source: entityById("peron-philosophy-address-bcn-source"),
      },
    ];
    const citations = Array.from({ length: 32 }, (_, index) =>
      canonicalGraph.relationships.find(
        ({ id }) => id === `populism-citation-${index + 1}`,
      ),
    );
    expect({
      sources,
      citations,
      dossier: entityById("populism-dossier"),
      guide: subjectGuideById("guide-populism"),
    }).toMatchSnapshot();
  });

  it("does not encode Populism as an inherited score or case essence", () => {
    const populism = entityById("populism");
    expect(populism?.kind).toBe("concept");
    expect(populism).not.toHaveProperty("value");
    expect(canonicalGraph.relationships.filter(({ subject }) => subject.id === "populism")).toEqual([]);
    for (const id of caseIds) {
      expect(canonicalGraph.relationships.some(({ subject, object }) => subject.id === id && object.id === "populism")).toBe(false);
    }
  });
});

describe("Perón source identity", () => {
  it("separates the 1949 address from the consulted 2016 edition", () => {
    const work = entityById("peron-philosophy-address-work");
    const source = entityById("peron-philosophy-address-bcn-source");

    expect(work).toMatchObject({
      kind: "work",
      title: "Exposición en el Acto de Clausura del primer Congreso Nacional de Filosofía",
      originalPublicationYear: 1949,
    });
    expect(source).toMatchObject({
      kind: "source",
      title: "Perón, 1949: Discursos, mensajes, correspondencia y escritos I",
      workId: "peron-philosophy-address-work",
      publicationYear: 2016,
      identifiers: { isbn13: "9789506910990" },
      contributorDisplay: [
        "Juan Domingo Perón (speaker)",
        "Biblioteca del Congreso de la Nación, Subdirección de Estudios y Archivos Especiales (compilation, redaction, and general editorial supervision)",
        "Oscar Castellucci (collection director and preface co-author)",
        "Isela María Mo Amavet (preface co-author)",
      ],
    });
    expect(work?.kind).toBe("work");
    expect(source?.kind).toBe("source");
    if (work?.kind !== "work" || source?.kind !== "source") throw new Error("Expected Work and Source entities");
    expect(source.title).not.toBe(work.title);
  });
});
