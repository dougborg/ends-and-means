import type { EntityRef } from "./common";
import type { DomainEntity } from "./entities";
import type { AuthoringDocument, CompiledDomainGraph } from "./graph";
import type { DomainRelationship } from "./relationships";

const stableId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function refKey(ref: EntityRef) {
  return `${ref.kind}:${ref.id}`;
}

function addIndex(index: Record<string, string[]>, key: string, relationshipId: string) {
  (index[key] ??= []).push(relationshipId);
}

function isHttpUrl(value: string) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function detectBroaderCycle(relationships: DomainRelationship[]) {
  const edges = new Map<string, string[]>();
  for (const relationship of relationships) {
    if (relationship.predicate === "broader-than") {
      (edges.get(relationship.subject.id) ?? edges.set(relationship.subject.id, []).get(relationship.subject.id)!).push(relationship.object.id);
    } else if (relationship.predicate === "narrower-than") {
      (edges.get(relationship.object.id) ?? edges.set(relationship.object.id, []).get(relationship.object.id)!).push(relationship.subject.id);
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const next of edges.get(id) ?? []) if (visit(next)) return true;
    visiting.delete(id);
    visited.add(id);
    return false;
  };
  return [...edges.keys()].some(visit);
}

export function validateAuthoringDocuments(documents: AuthoringDocument[]): string[] {
  const errors: string[] = [];
  const entities: DomainEntity[] = [];
  const relationships: DomainRelationship[] = [];

  for (const [index, document] of documents.entries()) {
    if (document.documentType === "entity") {
      entities.push(document.entity);
    } else {
      for (const relationship of document.relationships) {
        if (refKey(relationship.subject) !== refKey(document.subject)) {
          errors.push(`document ${index}: relationship ${relationship.id} does not match its subject-centered file`);
        }
        relationships.push(relationship);
      }
    }
  }

  const entityById = new Map<string, DomainEntity>();
  for (const entity of entities) {
    if (!stableId.test(entity.id)) errors.push(`${entity.id}: entity ID is not stable kebab-case`);
    if (!entity.label.trim()) errors.push(`${entity.id}: label is empty`);
    if (!entity.description.trim()) errors.push(`${entity.id}: description is empty`);
    if (entityById.has(entity.id)) errors.push(`${entity.id}: duplicate global entity ID`);
    entityById.set(entity.id, entity);
  }

  for (const [index, document] of documents.entries()) {
    if (document.documentType !== "relationships") continue;
    const subject = entityById.get(document.subject.id);
    if (!subject || subject.kind !== document.subject.kind) {
      errors.push(`document ${index}: unresolved or mistyped document subject ${refKey(document.subject)}`);
    }
  }

  const relationshipIds = new Set<string>();
  for (const relationship of relationships) {
    if (!stableId.test(relationship.id)) errors.push(`${relationship.id}: relationship ID is not stable kebab-case`);
    if (relationshipIds.has(relationship.id)) errors.push(`${relationship.id}: duplicate relationship ID`);
    if (entityById.has(relationship.id)) errors.push(`${relationship.id}: ID collides with an entity ID`);
    relationshipIds.add(relationship.id);

    const subject = entityById.get(relationship.subject.id);
    const object = entityById.get(relationship.object.id);
    if (!subject || subject.kind !== relationship.subject.kind) errors.push(`${relationship.id}: unresolved or mistyped subject ${refKey(relationship.subject)}`);
    if (!object || object.kind !== relationship.object.kind) errors.push(`${relationship.id}: unresolved or mistyped object ${refKey(relationship.object)}`);
    if (relationship.predicate === "cites") {
      if (!relationship.locator.trim()) errors.push(`${relationship.id}: citation requires a locator`);
    } else {
      if (relationship.status !== "research-needed" && relationship.statementIds.length === 0) {
        errors.push(`${relationship.id}: substantive relationship requires a supporting Statement`);
      }
      for (const statementId of relationship.statementIds) {
        if (entityById.get(statementId)?.kind !== "statement") errors.push(`${relationship.id}: unresolved Statement ${statementId}`);
      }
    }
  }

  for (const entity of entities) {
    const schemeIds = entity.kind === "concept" || entity.kind === "domain" ? entity.schemeIds : [];
    for (const schemeId of schemeIds) {
      if (entityById.get(schemeId)?.kind !== "concept-scheme") errors.push(`${entity.id}: unresolved Concept Scheme ${schemeId}`);
    }

    if (entity.kind === "source") {
      if (entity.workId && entityById.get(entity.workId)?.kind !== "work") errors.push(`${entity.id}: unresolved Work ${entity.workId}`);
      if (entity.identifiers?.doi && !/^10\.\d{4,9}\/[\S]+$/i.test(entity.identifiers.doi)) errors.push(`${entity.id}: DOI must be a bare DOI identifier`);
      if (entity.identifiers?.isbn10 && !/^[\dX]{10}$/i.test(entity.identifiers.isbn10.replaceAll("-", ""))) errors.push(`${entity.id}: invalid ISBN-10`);
      if (entity.identifiers?.isbn13 && !/^\d{13}$/.test(entity.identifiers.isbn13.replaceAll("-", ""))) errors.push(`${entity.id}: invalid ISBN-13`);
      for (const [index, link] of (entity.resourceLinks ?? []).entries()) {
        if (!isHttpUrl(link.url)) errors.push(`${entity.id}: resource link ${index} requires an HTTP(S) URL`);
        if (!link.label.trim()) errors.push(`${entity.id}: resource link ${index} requires a label`);
        if (link.purpose === "purchase" && typeof link.affiliate !== "boolean") errors.push(`${entity.id}: purchase link ${index} must declare affiliate true or false`);
      }
    }
  }

  const citedStatementIds = new Set(relationships.filter((relationship) => relationship.predicate === "cites").map((relationship) => relationship.subject.id));
  for (const entity of entities) {
    if (entity.kind === "statement" && entity.publicationStatus !== "research-needed" && !citedStatementIds.has(entity.id)) {
      errors.push(`${entity.id}: reviewed Statement requires a citation`);
    }
  }

  const preferredLabels = new Map<string, string>();
  for (const entity of entities) {
    if (entity.kind !== "concept") continue;
    for (const schemeId of entity.schemeIds) {
      const key = `${schemeId}:${entity.label.trim().toLocaleLowerCase("en")}`;
      const existing = preferredLabels.get(key);
      if (existing) errors.push(`${entity.id}: preferred label duplicates ${existing} in ${schemeId}`);
      preferredLabels.set(key, entity.id);
    }
  }

  if (detectBroaderCycle(relationships)) errors.push("Concept broader/narrower relationships contain a cycle");
  return errors;
}

export function compileDomainGraph(documents: AuthoringDocument[]): CompiledDomainGraph {
  const errors = validateAuthoringDocuments(documents);
  if (errors.length) throw new Error(`Domain graph validation failed:\n${errors.join("\n")}`);

  const entities = documents.flatMap((document) => document.documentType === "entity" ? [document.entity] : []);
  const relationships = documents.flatMap((document) => document.documentType === "relationships" ? document.relationships : []);
  const entitiesById = Object.fromEntries(entities.map((entity) => [entity.id, entity]));
  const outgoingRelationshipIds: Record<string, string[]> = {};
  const incomingRelationshipIds: Record<string, string[]> = {};
  for (const relationship of relationships) {
    addIndex(outgoingRelationshipIds, relationship.subject.id, relationship.id);
    addIndex(incomingRelationshipIds, relationship.object.id, relationship.id);
  }

  return {
    schemaVersion: "plural-graph-1",
    entities,
    relationships,
    indexes: { entitiesById, outgoingRelationshipIds, incomingRelationshipIds },
  };
}
