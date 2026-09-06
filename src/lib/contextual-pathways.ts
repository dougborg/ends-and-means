import type { DomainRelationship, EntityRef } from "./domain";
import { publicRelationshipLabel } from "./domain";
import type { CompiledDomainGraph } from "./domain/graph";
import { hrefForEntity } from "./public-routes";

export type ContextualPathwayKind =
  | "Related subject"
  | "Institutional pathway"
  | "Bounded case"
  | "Question to test"
  | "Purpose"
  | "Comparison"
  | "Depiction"
  | "Evidence";

export interface ContextualPathway {
  relationship: DomainRelationship;
  kind: ContextualPathwayKind;
  href: string;
  destinationLabel: string;
  subjectLabel: string;
  objectLabel: string;
  relationshipLabel: string;
  statementIds: string[];
}

const pathwayKinds = {
  "broader-than": "Related subject",
  "narrower-than": "Related subject",
  "related-to": "Related subject",
  "commonly-confused-with": "Related subject",
  "member-of": "Related subject",
  depicts: "Depiction",
  "addresses-domain": "Related subject",
  "interprets-concept": "Institutional pathway",
  "advances-end": "Purpose",
  "rejects-end": "Purpose",
  "internally-contests-end": "Purpose",
  "advocates-means": "Institutional pathway",
  "permits-means": "Institutional pathway",
  "rejects-means": "Institutional pathway",
  "internally-contests-means": "Institutional pathway",
  "specified-by": "Institutional pathway",
  "applies-to-case": "Bounded case",
  "contested-in-case": "Bounded case",
  "self-identified-with": "Bounded case",
  "influenced-by": "Bounded case",
  "partially-instantiated": "Bounded case",
  "hybridized-with": "Bounded case",
  "departed-from": "Bounded case",
  "used-means": "Bounded case",
  "responds-to": "Question to test",
  "evaluates-response-to": "Question to test",
  "assessed-by": "Question to test",
  "placed-on": "Comparison",
  cites: "Evidence",
} satisfies Record<DomainRelationship["predicate"], ContextualPathwayKind>;

export function contextualPathwayKind(
  relationship: DomainRelationship,
): ContextualPathwayKind {
  return pathwayKinds[relationship.predicate];
}

function sameRef(left: EntityRef, right: EntityRef) {
  return left.kind === right.kind && left.id === right.id;
}

function preferredDestination(
  relationship: DomainRelationship,
  context: EntityRef,
) {
  if (relationship.predicate === "cites") return relationship.object;
  if (sameRef(relationship.subject, context)) return relationship.object;
  if (sameRef(relationship.object, context)) return relationship.subject;
  if (
    relationship.subject.kind === "case" ||
    relationship.subject.kind === "case-episode"
  )
    return relationship.subject;
  return relationship.subject;
}

export function contextualPathwayForRelationship(
  relationship: DomainRelationship,
  context: EntityRef,
  graph: CompiledDomainGraph,
): ContextualPathway | undefined {
  const subject = graph.indexes.entitiesById[relationship.subject.id];
  const object = graph.indexes.entitiesById[relationship.object.id];
  if (
    !subject ||
    subject.kind !== relationship.subject.kind ||
    !object ||
    object.kind !== relationship.object.kind ||
    !["reviewed", "published"].includes(subject.publicationStatus) ||
    !["reviewed", "published"].includes(object.publicationStatus)
  )
    return undefined;

  const statementIds =
    relationship.predicate === "cites"
      ? [relationship.subject.id]
      : relationship.statementIds;
  if (
    statementIds.some((id) => {
      const statement = graph.indexes.entitiesById[id];
      return (
        statement?.kind !== "statement" ||
        !["reviewed", "published"].includes(statement.publicationStatus)
      );
    })
  )
    return undefined;

  const destination = preferredDestination(relationship, context);
  const href = hrefForEntity(destination, graph);
  if (!href) return undefined;
  const destinationEntity = sameRef(destination, relationship.subject)
    ? subject
    : object;

  return {
    relationship,
    kind: contextualPathwayKind(relationship),
    href,
    destinationLabel: destinationEntity.label,
    subjectLabel: subject.label,
    objectLabel: object.label,
    relationshipLabel: publicRelationshipLabel(relationship, "subject"),
    statementIds,
  };
}

export function relationshipEndpointKeys(
  relationships: readonly DomainRelationship[],
  graph: CompiledDomainGraph,
) {
  const keys = new Set<string>();
  for (const { subject, object } of relationships) {
    for (const endpoint of [subject, object]) {
      keys.add(`${endpoint.kind}:${endpoint.id}`);
      const entity = graph.indexes.entitiesById[endpoint.id];
      if (entity?.kind === "case-episode") keys.add(`case:${entity.caseId}`);
    }
  }
  return keys;
}

export function relationshipSentence({
  subjectLabel,
  objectLabel,
  relationshipLabel,
}: Pick<
  ContextualPathway,
  "subjectLabel" | "objectLabel" | "relationshipLabel"
>) {
  return `${subjectLabel} ${relationshipLabel.toLocaleLowerCase("en")} ${objectLabel}.`;
}
