import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import type {
  AuthoringDocument,
  DomainRelationship,
  SubjectGuide,
  SubjectGuideDocument,
} from "../../src/lib/domain";
import {
  auditContent,
  compileDomainGraph,
  publicRelationshipLabel,
  validateAuthoringDocuments,
} from "../../src/lib/domain";
import {
  canonicalGraph,
  citationsFor,
  subjectGuideById,
  subjectGuideBySlug,
  subjectGuideRecordById,
} from "../../src/lib/domain/canonical";

function clonedDocuments() {
  return structuredClone(canonicalDocuments);
}

function guideDocument(documents: AuthoringDocument[]) {
  const document = documents.find(
    (candidate): candidate is SubjectGuideDocument =>
      candidate.documentType === "subject-guide",
  );
  if (!document) throw new Error("Missing SubjectGuide fixture");
  return document;
}

function errorsAfter(change: (guide: SubjectGuide) => void) {
  const documents = clonedDocuments();
  change(guideDocument(documents).guide);
  return validateAuthoringDocuments(documents);
}

function selectedStatementIds(guide: SubjectGuide) {
  const ids = new Set(
    guide.sections.flatMap(({ statementIds = [] }) => statementIds),
  );
  for (const section of guide.sections) {
    for (const reference of section.narrativeRefs ?? []) {
      const dossier = canonicalGraph.indexes.entitiesById[reference.dossierId];
      if (dossier?.kind !== "dossier") continue;
      const statementIds = reference.sectionId
        ? dossier.sections.find(({ id }) => id === reference.sectionId)
            ?.statementIds
        : dossier.standfirstStatementIds;
      for (const id of statementIds ?? []) ids.add(id);
    }
  }
  return [...ids];
}

function sectionAt(guide: SubjectGuide, index: number) {
  const section = guide.sections[index];
  if (!section) throw new Error(`Missing SubjectGuide section ${index}`);
  return section;
}

function sectionWithRole(
  guide: SubjectGuide,
  role: SubjectGuide["sections"][number]["role"],
) {
  const section = guide.sections.find((candidate) => candidate.role === role);
  if (!section) throw new Error(`Missing SubjectGuide role ${role}`);
  return section;
}

function firstQuery(guide: SubjectGuide) {
  const query = guide.searchQueries[0];
  if (!query) throw new Error("Missing SubjectGuide query");
  return query;
}

function relationshipIn(documents: AuthoringDocument[], id: string) {
  for (const document of documents) {
    if (document.documentType !== "relationships") continue;
    const relationship = document.relationships.find(
      (candidate) => candidate.id === id,
    );
    if (relationship) return relationship;
  }
  throw new Error(`Missing Relationship ${id}`);
}

describe("compiled learner SubjectGuide composition", () => {
  it("compiles reviewed guides beside, rather than into, the plural graph", () => {
    const guide = subjectGuideBySlug("economic-democracy");

    expect(guide).toBe(subjectGuideById("guide-economic-democracy"));
    expect(guide?.primarySubject).toEqual({
      kind: "concept",
      id: "economic-democracy",
    });
    expect(canonicalGraph.entities.some(({ id }) => id === guide?.id)).toBe(
      false,
    );
    expect(
      canonicalGraph.indexes.entitiesById["economic-democracy"]?.kind,
    ).toBe("concept");
  });

  it("keeps every selected factual passage traceable to cited Statements", () => {
    const guide = subjectGuideById("guide-economic-democracy");
    if (!guide) throw new Error("Missing reviewed SubjectGuide");

    expect(selectedStatementIds(guide).length).toBeGreaterThan(8);
    for (const statementId of selectedStatementIds(guide)) {
      expect(canonicalGraph.indexes.entitiesById[statementId]?.kind).toBe(
        "statement",
      );
      expect(citationsFor(statementId).length).toBeGreaterThan(0);
    }
  });

  it("allows unsupported conditional modules to be omitted cleanly", () => {
    const guide = subjectGuideById("guide-economic-democracy");
    expect(guide?.sections.map(({ role }) => role)).not.toContain("depictions");
    expect(validateAuthoringDocuments(canonicalDocuments)).toEqual([]);
  });

  it("reports live SubjectGuide coverage in the content attention audit", () => {
    const report = auditContent(canonicalGraph);
    expect(report.subjectGuides).toEqual({
      live: 2,
      total: 2,
      liveIds: [
        "guide-economic-democracy",
        "guide-kahnawake-community-lawmaking",
      ],
    });
  });

  it.each(["research-needed", "in-review", "deprecated"] as const)(
    "keeps %s guides in editorial records but out of public resolution",
    (publicationStatus) => {
      const documents = clonedDocuments();
      const guide = guideDocument(documents).guide;
      guide.publicationStatus = publicationStatus;
      guide.redirects = [];

      const graph = compileDomainGraph(documents);
      expect(subjectGuideRecordById(guide.id, graph)).toBe(guide);
      expect(graph.subjectGuideRecords).toHaveLength(2);
      expect(graph.subjectGuides.map(({ id }) => id)).toEqual([
        "guide-kahnawake-community-lawmaking",
      ]);
      expect(subjectGuideById(guide.id, graph)).toBeUndefined();
      expect(subjectGuideBySlug(guide.slug, graph)).toBeUndefined();
    },
  );

  it("compiles presentation records deterministically across document order", () => {
    const graph = compileDomainGraph(canonicalDocuments);
    const reversed = compileDomainGraph([...canonicalDocuments].reverse());

    expect(reversed.subjectGuides).toEqual(graph.subjectGuides);
    expect(reversed.indexes.subjectGuidesById).toEqual(
      graph.indexes.subjectGuidesById,
    );
    expect(reversed.indexes.subjectGuideIdsBySlug).toEqual(
      graph.indexes.subjectGuideIdsBySlug,
    );
  });
});

describe("SubjectGuide model boundaries", () => {
  it("rejects entity inheritance and guide-owned factual prose or aliases", () => {
    const errors = errorsAfter((guide) => {
      Object.assign(guide, {
        kind: "",
        body: "",
        alternateLabels: [],
      });
    });

    expect(errors).toContain(
      "guide-economic-democracy: SubjectGuide must not declare an EntityKind",
    );
    expect(errors).toContain(
      "guide-economic-democracy: SubjectGuide selects Dossier narrative instead of owning a body",
    );
    expect(errors).toContain(
      "guide-economic-democracy: SubjectGuide uses searchQueries, not alternateLabels",
    );
  });
});

describe("SubjectGuide publication boundaries", () => {
  it("rejects invalid status and internal workflow language from public text", () => {
    const errors = errorsAfter((guide) => {
      guide.publicationStatus = "ready" as SubjectGuide["publicationStatus"];
      guide.label = "Guide in PR #120";
      sectionAt(guide, 0).heading = "Migration status";
      firstQuery(guide).disambiguation = "See branch feature/guide.";
    });

    expect(errors).toEqual(
      expect.arrayContaining([
        "guide-economic-democracy: invalid publication status ready",
        "guide-economic-democracy: reader-facing guide identity contains an internal workflow reference",
        "guide-economic-democracy:short-answer: heading contains an internal workflow reference",
        "guide-economic-democracy: search-query disambiguation contains an internal workflow reference",
      ]),
    );
  });
});

describe("SubjectGuide journey requirements", () => {
  it("requires the minimal learner journey and unique section roles", () => {
    const errors = errorsAfter((guide) => {
      const first = sectionAt(guide, 0);
      guide.sections = [first, structuredClone(first)];
    });

    expect(errors).toContain(
      "guide-economic-democracy: duplicate SubjectGuide section short-answer",
    );
    expect(errors).toContain(
      "guide-economic-democracy: duplicate SubjectGuide role short-answer",
    );
    expect(errors).toContain(
      "guide-economic-democracy: missing required SubjectGuide role meanings-and-boundaries",
    );
    expect(errors).toContain(
      "guide-economic-democracy: missing required SubjectGuide role comparisons-and-next-steps",
    );
  });

  it("requires a traced standfirst for the short answer", () => {
    const errors = errorsAfter((guide) => {
      sectionAt(guide, 0).narrativeRefs = [
        {
          dossierId: "economic-democracy-dossier",
          sectionId: "what-question-does-it-ask",
        },
      ];
    });

    expect(errors).toContain(
      "guide-economic-democracy:short-answer: short answer must select exactly one Dossier standfirst",
    );
  });

  it("anchors the short answer to the primary subject", () => {
    const errors = errorsAfter((guide) => {
      sectionAt(guide, 0).narrativeRefs = [
        { dossierId: "social-ownership-dossier" },
      ];
    });

    expect(errors).toContain(
      "guide-economic-democracy:short-answer: short-answer Dossier subject must equal the SubjectGuide primary subject",
    );
  });

  it("requires traced explanatory material for meanings and boundaries", () => {
    const errors = errorsAfter((guide) => {
      const meanings = sectionWithRole(guide, "meanings-and-boundaries");
      meanings.narrativeRefs = [];
      meanings.statementIds = [];
      meanings.entityRefs = [{ kind: "concept", id: "social-ownership" }];
    });

    expect(errors).toContain(
      "guide-economic-democracy:meanings-and-boundaries: meanings and boundaries require traced narrative or a Statement",
    );
  });

  it("rejects unresolved selected records from a live guide", () => {
    const errors = errorsAfter((guide) => {
      const section = sectionAt(guide, 1);
      section.narrativeRefs = [{ dossierId: "missing-dossier" }];
      section.statementIds = ["missing-statement"];
      section.entityRefs = [{ kind: "concept", id: "missing-concept" }];
      section.relationshipIds = ["missing-relationship"];
      section.researchObligationIds = ["missing-obligation"];
    });

    expect(errors).toContain(
      "guide-economic-democracy:meanings-and-boundaries: unresolved Dossier missing-dossier",
    );
    expect(errors).toContain(
      "guide-economic-democracy:meanings-and-boundaries: unresolved Statement missing-statement",
    );
    expect(errors).toContain(
      "guide-economic-democracy:meanings-and-boundaries: unresolved canonical entity concept:missing-concept",
    );
    expect(errors).toContain(
      "guide-economic-democracy:meanings-and-boundaries: unresolved Relationship missing-relationship",
    );
    expect(errors).toContain(
      "guide-economic-democracy:meanings-and-boundaries: unresolved Research Obligation missing-obligation",
    );
  });

  it("rejects immature canonical selections from a live guide", () => {
    const documents = clonedDocuments();
    const conceptDocument = documents.find(
      (document) =>
        document.documentType === "entity" &&
        document.entity.id === "market-socialism",
    );
    if (conceptDocument?.documentType !== "entity")
      throw new Error("Missing selected Concept fixture");
    conceptDocument.entity.publicationStatus = "research-needed";

    expect(validateAuthoringDocuments(documents)).toContain(
      "guide-economic-democracy:meanings-and-boundaries: live SubjectGuide requires reviewed or published entity concept:market-socialism",
    );
  });
});

describe("SubjectGuide relationship evidence boundaries", () => {
  it("requires evidence-bearing live relationships and mature support", () => {
    const documents = clonedDocuments();
    const relationship = relationshipIn(
      documents,
      "wage-earner-program-advocates-fund-boards",
    );
    if (!("status" in relationship))
      throw new Error("Expected an evidence-bearing Relationship");
    relationship.statementIds = [];

    expect(validateAuthoringDocuments(documents)).toContain(
      "guide-economic-democracy:institutions-and-mechanisms: live SubjectGuide Relationship wage-earner-program-advocates-fund-boards requires supporting Statements",
    );

    relationship.statementIds = ["funds-statutory-design"];
    const statement = documents.find(
      (document) =>
        document.documentType === "entity" &&
        document.entity.id === "funds-statutory-design",
    );
    if (statement?.documentType !== "entity")
      throw new Error("Missing supporting Statement");
    statement.entity.publicationStatus = "in-review";
    expect(validateAuthoringDocuments(documents)).toContain(
      "guide-economic-democracy:institutions-and-mechanisms: live SubjectGuide Relationship wage-earner-program-advocates-fund-boards has unpublished supporting Statement funds-statutory-design",
    );

    statement.entity.publicationStatus = "reviewed";
    const endpoint = documents.find(
      (document) =>
        document.documentType === "entity" &&
        document.entity.id === "regional-wage-earner-fund-boards",
    );
    if (endpoint?.documentType !== "entity")
      throw new Error("Missing Relationship endpoint");
    endpoint.entity.publicationStatus = "in-review";
    expect(validateAuthoringDocuments(documents)).toContain(
      "guide-economic-democracy:institutions-and-mechanisms: live SubjectGuide Relationship wage-earner-program-advocates-fund-boards has an unpublished endpoint means:regional-wage-earner-fund-boards",
    );
  });

  it("requires a locator when a live guide selects a citation", () => {
    const documents = clonedDocuments();
    const citation = documents
      .flatMap((document) =>
        document.documentType === "relationships" ? document.relationships : [],
      )
      .find((relationship) => relationship.predicate === "cites");
    if (citation?.predicate !== "cites")
      throw new Error("Missing citation fixture");
    citation.locator = "";
    sectionAt(guideDocument(documents).guide, 1).relationshipIds = [
      citation.id,
    ];

    expect(validateAuthoringDocuments(documents)).toContain(
      `guide-economic-democracy:meanings-and-boundaries: live SubjectGuide citation ${citation.id} requires a locator`,
    );
  });
});

describe("SubjectGuide role boundaries", () => {
  it("accepts bounded practice selected through a Case Dossier", () => {
    const errors = errorsAfter((guide) => {
      const bounded = sectionWithRole(guide, "bounded-practice");
      bounded.entityRefs = [];
      bounded.narrativeRefs = [
        { dossierId: "swedish-wage-earner-funds-case-dossier" },
      ];
    });

    expect(errors).toEqual([]);
  });

  it("requires role-specific bounded cases, depictions, and open questions", () => {
    const errors = errorsAfter((guide) => {
      const bounded = sectionWithRole(guide, "bounded-practice");
      bounded.narrativeRefs = [];
      bounded.entityRefs = [{ kind: "concept", id: "economic-democracy" }];
      const questions = sectionWithRole(guide, "open-questions");
      questions.researchObligationIds = [];
      guide.sections.push({
        id: "depictions",
        role: "depictions",
        heading: "How is it depicted?",
        entityRefs: [{ kind: "concept", id: "economic-democracy" }],
      });
    });

    expect(errors).toContain(
      "guide-economic-democracy:bounded-practice: bounded practice must select a Case or Case Episode",
    );
    expect(errors).toContain(
      "guide-economic-democracy:open-questions: open questions require a Research Obligation",
    );
    expect(errors).toContain(
      "guide-economic-democracy:depictions: depictions must select a Depiction",
    );
  });
});

describe("SubjectGuide discovery identity", () => {
  it("normalizes search queries and requires explicit collision disambiguation", () => {
    const documents = clonedDocuments();
    const duplicate = structuredClone(guideDocument(documents));
    duplicate.guide.id = "guide-democratic-economy";
    duplicate.guide.slug = "democratic-economy";
    duplicate.guide.searchQueries = [{ query: "  ECONOMIC   DEMOCRACY " }];
    documents.push(duplicate);

    expect(validateAuthoringDocuments(documents)).toContain(
      'guide-economic-democracy: colliding search query "economic democracy" requires disambiguation',
    );
    firstQuery(guideDocument(documents).guide).disambiguation =
      "The broad learner guide.";
    const slugCollision = guideDocument(documents).guide.searchQueries.find(
      ({ query }) => query === "democratic economy",
    );
    if (!slugCollision) throw new Error("Missing search-query fixture");
    slugCollision.disambiguation = "The broad learner guide.";
    firstQuery(duplicate.guide).disambiguation =
      "A narrower use of the phrase.";
    expect(validateAuthoringDocuments(documents)).toEqual([]);
  });

  it("rejects ambiguous public paths and unreviewed redirects", () => {
    const documents = clonedDocuments();
    const duplicate = structuredClone(guideDocument(documents));
    duplicate.guide.id = "guide-another-economic-democracy";
    duplicate.guide.redirects = [];
    documents.push(duplicate);
    const guide = guideDocument(documents).guide;
    guide.publicationStatus = "in-review";
    guide.redirects = [
      { from: "economic-democracy", reviewedAt: "2026-09-05" },
    ];

    const errors = validateAuthoringDocuments(documents);
    expect(errors).toContain(
      "guide-another-economic-democracy: SubjectGuide slug already belongs to guide-economic-democracy",
    );
    expect(errors).toContain(
      "guide-economic-democracy: only a live SubjectGuide may own a redirect",
    );
    expect(errors).toContain(
      "guide-economic-democracy: redirect economic-democracy collides with an active SubjectGuide slug",
    );
  });

  it("reserves active slugs against another guide's search query", () => {
    const documents = clonedDocuments();
    const duplicate = structuredClone(guideDocument(documents));
    duplicate.guide.id = "guide-another-economic-democracy";
    duplicate.guide.slug = "another-economic-democracy";
    duplicate.guide.searchQueries = [{ query: "Economic democracy" }];
    documents.push(duplicate);

    expect(validateAuthoringDocuments(documents)).toContain(
      'guide-another-economic-democracy: colliding search query "economic democracy" requires disambiguation',
    );
    expect(validateAuthoringDocuments(documents)).toContain(
      'guide-another-economic-democracy: search query "economic democracy" collides with active SubjectGuide slug owned by guide-economic-democracy and requires disambiguation',
    );
  });
});

describe("SubjectGuide relationship language", () => {
  it("provides readable labels without changing relationship predicates", () => {
    const relationship = canonicalGraph.relationships.find(
      ({ id }) => id === "enacted-funds-partially-instantiated-program",
    );
    if (!relationship) throw new Error("Missing relationship fixture");

    expect(publicRelationshipLabel(relationship, "subject")).toBe(
      "Partly puts into practice",
    );
    expect(publicRelationshipLabel(relationship, "object")).toBe(
      "Partly put into practice by",
    );
    expect(relationship.predicate).toBe("partially-instantiated");
  });

  it("labels case application from both ends", () => {
    const relationship = {
      id: "test-applies",
      predicate: "applies-to-case",
      subject: { kind: "case", id: "test-case" },
      object: { kind: "concept", id: "test-concept" },
      status: "asserted",
      statementIds: ["test-statement"],
    } satisfies DomainRelationship;

    expect(publicRelationshipLabel(relationship, "subject")).toBe(
      "Applies this idea",
    );
    expect(publicRelationshipLabel(relationship, "object")).toBe(
      "Applied in this case",
    );
  });

  it.each([
    ["supports", "Cites as support", "Supports"],
    ["challenges", "Cites as a challenge", "Challenges"],
    ["qualifies", "Cites as a qualification", "Qualifies"],
    ["context", "Cites for context", "Provides context for"],
  ] as const)(
    "labels %s citations by reading direction",
    (role, subjectLabel, objectLabel) => {
      const relationship = {
        id: `test-${role}-citation`,
        predicate: "cites",
        subject: { kind: "statement", id: "test-statement" },
        object: { kind: "source", id: "test-source" },
        role,
        locator: "p. 1",
      } satisfies DomainRelationship;

      expect(publicRelationshipLabel(relationship, "subject")).toBe(
        subjectLabel,
      );
      expect(publicRelationshipLabel(relationship, "object")).toBe(objectLabel);
    },
  );
});

describe("planned Communism guide fixture", () => {
  it("compiles as an editorial record without entering the live projection", () => {
    const base = {
      description: "Synthetic test-only material.",
      publicationStatus: "research-needed" as const,
    };
    const documents: AuthoringDocument[] = [
      {
        documentType: "entity",
        entity: {
          id: "test-political-ideas",
          kind: "concept-scheme",
          label: "Test political ideas",
          scope: "Synthetic concepts for a SubjectGuide boundary fixture.",
          ...base,
        },
      },
      {
        documentType: "entity",
        entity: {
          id: "test-communism",
          kind: "concept",
          label: "Test Communism",
          schemeIds: ["test-political-ideas"],
          scopeNote: "A synthetic primary subject, not researched content.",
          ...base,
        },
      },
      {
        documentType: "entity",
        entity: {
          id: "test-communism-scope-statement",
          kind: "statement",
          label: "Test scope statement",
          statementKind: "definition",
          text: "Synthetic fixture text with no claim about communism.",
          ...base,
        },
      },
      {
        documentType: "entity",
        entity: {
          id: "test-communism-dossier",
          kind: "dossier",
          label: "Test Communism dossier",
          subject: { kind: "concept", id: "test-communism" },
          standfirst: "Synthetic fixture standfirst.",
          standfirstStatementIds: ["test-communism-scope-statement"],
          sections: [
            {
              id: "meanings",
              heading: "Synthetic meanings fixture",
              body: "Synthetic fixture section.",
              traceStatus: "supported",
              statementIds: ["test-communism-scope-statement"],
            },
          ],
          reviewedAt: "2026-09-05",
          ...base,
        },
      },
      {
        documentType: "subject-guide",
        guide: {
          id: "guide-test-communism",
          slug: "test-communism",
          label: "Test Communism guide",
          description: "A synthetic structural guide fixture.",
          publicationStatus: "research-needed",
          primarySubject: { kind: "concept", id: "test-communism" },
          searchQueries: [{ query: "what is test communism" }],
          sections: [
            {
              id: "short-answer",
              role: "short-answer",
              heading: "Synthetic short answer",
              narrativeRefs: [{ dossierId: "test-communism-dossier" }],
            },
            {
              id: "meanings",
              role: "meanings-and-boundaries",
              heading: "Synthetic meanings",
              narrativeRefs: [
                {
                  dossierId: "test-communism-dossier",
                  sectionId: "meanings",
                },
              ],
            },
            {
              id: "next-steps",
              role: "comparisons-and-next-steps",
              heading: "Synthetic next steps",
              entityRefs: [{ kind: "concept", id: "test-communism" }],
            },
          ],
          reviewedAt: "2026-09-05",
        },
      },
    ];

    const graph = compileDomainGraph(documents);
    expect(subjectGuideRecordById("guide-test-communism", graph)).toBeDefined();
    expect(graph.subjectGuideRecords).toHaveLength(1);
    expect(graph.subjectGuides).toEqual([]);
    expect(subjectGuideById("guide-test-communism", graph)).toBeUndefined();
    expect(subjectGuideBySlug("test-communism", graph)).toBeUndefined();
  });
});
