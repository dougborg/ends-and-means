import { describe, expect, it } from "vitest";
import { compileDomainGraph, validateAuthoringDocuments } from "../../src/lib/domain";
import type { AuthoringDocument, DomainEntity, DomainRelationship, EntityRef } from "../../src/lib/domain";

const entity = (value: DomainEntity): AuthoringDocument => ({ documentType: "entity", entity: value });
const relationships = (subject: EntityRef, values: DomainRelationship[]): AuthoringDocument => ({ documentType: "relationships", subject, relationships: values });
const base = { description: "A scoped evidence test record.", publicationStatus: "reviewed" as const };

const evidenceDocuments: AuthoringDocument[] = [
  entity({
    id: "governing-the-commons",
    kind: "work",
    label: "Governing the Commons",
    title: "Governing the Commons",
    workType: "book",
    originalPublicationYear: 1990,
    ...base,
  }),
  entity({
    id: "governing-the-commons-1990-cup",
    kind: "source",
    label: "Governing the Commons (1990 edition)",
    title: "Governing the Commons: The Evolution of Institutions for Collective Action",
    sourceType: "edition",
    workId: "governing-the-commons",
    contributorDisplay: ["Elinor Ostrom"],
    publicationYear: 1990,
    publisher: "Cambridge University Press",
    identifiers: { isbn13: "9780521405997", openLibraryId: "OL2207752M" },
    resourceLinks: [
      { purpose: "publisher", url: "https://www.cambridge.org/", label: "Publisher page" },
      { purpose: "library", url: "https://search.worldcat.org/", label: "Find in a library" },
      { purpose: "purchase", url: "https://bookshop.org/", label: "Purchase", vendor: "Bookshop.org", affiliate: false },
    ],
    ...base,
  }),
  entity({
    id: "commons-can-be-self-governed",
    kind: "statement",
    label: "Commons can be self-governed",
    statementKind: "observation",
    text: "Some communities durably govern common-pool resources through institutions other than privatization or centralized state control.",
    ...base,
  }),
  relationships({ kind: "statement", id: "commons-can-be-self-governed" }, [{
    id: "commons-can-be-self-governed-cites-ostrom",
    predicate: "cites",
    subject: { kind: "statement", id: "commons-can-be-self-governed" },
    object: { kind: "source", id: "governing-the-commons-1990-cup" },
    role: "supports",
    locator: "Chapter 3",
  }]),
];

describe("domain evidence model", () => {
  it("compiles a Work, citable Source, resource links, and located Statement citation", () => {
    const graph = compileDomainGraph(evidenceDocuments);

    expect(graph.indexes.entitiesById["governing-the-commons"]?.kind).toBe("work");
    expect(graph.indexes.incomingRelationshipIds["governing-the-commons-1990-cup"]).toEqual([
      "commons-can-be-self-governed-cites-ostrom",
    ]);
  });

  it("requires a locator on every citation", () => {
    const invalid = structuredClone(evidenceDocuments);
    const citation = invalid[3];
    if (citation?.documentType === "relationships" && citation.relationships[0]?.predicate === "cites") citation.relationships[0].locator = " ";

    expect(validateAuthoringDocuments(invalid)).toContain("commons-can-be-self-governed-cites-ostrom: citation requires a locator");
  });

  it("requires citations for Statements promoted beyond research-needed", () => {
    expect(validateAuthoringDocuments(evidenceDocuments.slice(0, 3))).toContain(
      "commons-can-be-self-governed: Statement requires a citation to advance beyond research-needed",
    );
  });

  it("keeps purchase links secondary and requires explicit affiliate disclosure", () => {
    const invalid = structuredClone(evidenceDocuments);
    const source = invalid[1];
    if (source?.documentType === "entity" && source.entity.kind === "source") {
      source.entity.resourceLinks = [{ purpose: "purchase", url: "https://example.com/book", label: "Buy" }];
    }

    expect(validateAuthoringDocuments(invalid)).toContain(
      "governing-the-commons-1990-cup: purchase link 0 must declare affiliate true or false",
    );
  });

  it("rejects URL-shaped DOI values as identifiers", () => {
    const invalid = structuredClone(evidenceDocuments);
    const source = invalid[1];
    if (source?.documentType === "entity" && source.entity.kind === "source") {
      source.entity.identifiers = { doi: "https://doi.org/10.1000/example" };
    }

    expect(validateAuthoringDocuments(invalid)).toContain(
      "governing-the-commons-1990-cup: DOI must be a bare DOI identifier",
    );
  });

  it("accepts a paper Source with a bare DOI identifier", () => {
    const paperDocuments: AuthoringDocument[] = [
      entity({
        id: "use-of-knowledge-in-society",
        kind: "work",
        label: "The Use of Knowledge in Society",
        title: "The Use of Knowledge in Society",
        workType: "article",
        originalPublicationYear: 1945,
        ...base,
      }),
      entity({
        id: "use-of-knowledge-aer-1945",
        kind: "source",
        label: "The Use of Knowledge in Society (AER, 1945)",
        title: "The Use of Knowledge in Society",
        sourceType: "article",
        workId: "use-of-knowledge-in-society",
        contributorDisplay: ["F. A. Hayek"],
        publicationYear: 1945,
        identifiers: { doi: "10.1257/aer.35.4.519" },
        resourceLinks: [{ purpose: "authorized-reading", url: "https://www.aeaweb.org/", label: "Journal record" }],
        ...base,
      }),
    ];

    expect(validateAuthoringDocuments(paperDocuments)).toEqual([]);
  });

  it("rejects unresolved Work references and unsafe resource URLs", () => {
    const invalid = structuredClone(evidenceDocuments);
    const source = invalid[1];
    if (source?.documentType === "entity" && source.entity.kind === "source") {
      source.entity.workId = "missing-work";
      source.entity.resourceLinks = [{ purpose: "library", url: "javascript:alert(1)", label: "Unsafe link" }];
    }

    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain("governing-the-commons-1990-cup: unresolved Work missing-work");
    expect(errors).toContain("governing-the-commons-1990-cup: resource link 0 requires an HTTP(S) URL");
  });
});
