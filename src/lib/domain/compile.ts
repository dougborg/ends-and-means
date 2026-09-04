import type { EntityRef } from "./common";
import type { HistoricalDate } from "./cases";
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

function validateHistoricalDate(ownerId: string, field: string, value: HistoricalDate, errors: string[]) {
  if (value.year !== undefined && !Number.isInteger(value.year)) errors.push(`${ownerId}: ${field} year must be an integer`);
  if (value.month !== undefined && (!Number.isInteger(value.month) || value.month < 1 || value.month > 12)) errors.push(`${ownerId}: ${field} month must be between 1 and 12`);
  if (value.day !== undefined && (!Number.isInteger(value.day) || value.day < 1 || value.day > 31)) errors.push(`${ownerId}: ${field} day must be between 1 and 31`);
  if ((value.month !== undefined || value.day !== undefined) && value.year === undefined) errors.push(`${ownerId}: ${field} month/day requires a year`);
  if (value.day !== undefined && value.month === undefined) errors.push(`${ownerId}: ${field} day requires a month`);
  if (value.certainty === "exact" && value.year === undefined) errors.push(`${ownerId}: exact ${field} requires a year`);
  if (value.certainty !== "exact" && !value.note?.trim()) errors.push(`${ownerId}: ${field} with ${value.certainty} certainty requires a note`);
  if (value.year !== undefined && value.month !== undefined && value.day !== undefined) {
    const leapYear = value.year % 4 === 0 && (value.year % 100 !== 0 || value.year % 400 === 0);
    const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][value.month - 1];
    if (daysInMonth !== undefined && value.day > daysInMonth) errors.push(`${ownerId}: ${field} day is invalid for its month`);
  }
}

function validateIsoDate(ownerId: string, field: string, value: string | undefined, errors: string[]) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const year = Number(match?.[1]);
  const month = Number(match?.[2]);
  const day = Number(match?.[3]);
  const parsed = match ? new Date(Date.UTC(year, month - 1, day)) : undefined;
  if (!match || parsed?.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
    errors.push(`${ownerId}: ${field} requires an ISO calendar date`);
  }
}

function comparableDate(value: HistoricalDate, boundary: "start" | "end") {
  if (value.year === undefined) return undefined;
  const month = value.month ?? (boundary === "start" ? 1 : 12);
  const day = value.day ?? (boundary === "start" ? 1 : 31);
  return value.year * 10_000 + month * 100 + day;
}

function statementIdsForCase(entity: DomainEntity) {
  if (entity.kind === "case") return [...entity.conditionStatementIds, ...(entity.overview ?? []).flatMap(({ statementIds }) => statementIds)];
  if (entity.kind === "case-episode") return [
    ...entity.conditionStatementIds,
    ...entity.formalRuleStatementIds,
    ...entity.ruleInUseStatementIds,
    ...entity.interactionStatementIds,
    ...entity.outcomeStatementIds,
  ];
  return [];
}

function validateEntityRefs(entityById: Map<string, DomainEntity>, ownerId: string, kind: EntityRef["kind"], ids: string[], label: string, errors: string[]) {
  for (const id of ids) if (entityById.get(id)?.kind !== kind) errors.push(`${ownerId}: unresolved ${label} ${id}`);
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
  const externalIdentities = new Map<string, string>();
  for (const entity of entities) {
    if (!stableId.test(entity.id)) errors.push(`${entity.id}: entity ID is not stable kebab-case`);
    if (!entity.label.trim()) errors.push(`${entity.id}: label is empty`);
    if (!entity.description.trim()) errors.push(`${entity.id}: description is empty`);
    if (entityById.has(entity.id)) errors.push(`${entity.id}: duplicate global entity ID`);
    entityById.set(entity.id, entity);

    const refs = new Set<string>();
    for (const [index, reference] of (entity.externalRefs ?? []).entries()) {
      const key = `${reference.system}:${reference.id ?? reference.url}`;
      if (refs.has(key)) errors.push(`${entity.id}: duplicate external reference ${key}`);
      refs.add(key);
      if (!isHttpUrl(reference.url)) errors.push(`${entity.id}: external reference ${index} requires an HTTP(S) URL`);
      validateIsoDate(entity.id, `external reference ${index} checkedAt`, reference.checkedAt, errors);

      let url: URL | undefined;
      try { url = new URL(reference.url); } catch { /* Reported above. */ }
      if (reference.system === "wikipedia") {
        if (reference.purpose !== "orientation") errors.push(`${entity.id}: Wikipedia references must be orientation links`);
        if (!reference.language) errors.push(`${entity.id}: Wikipedia references require a language`);
        if (url && (url.hostname !== `${reference.language}.wikipedia.org` || !url.pathname.startsWith("/wiki/"))) errors.push(`${entity.id}: Wikipedia reference ${index} does not match its language and article form`);
      }
      if (reference.system === "wikidata") {
        if (reference.purpose !== "identity") errors.push(`${entity.id}: Wikidata references must be identity links`);
        if (!reference.id?.match(/^Q\d+$/)) errors.push(`${entity.id}: Wikidata references require a QID`);
        if (!reference.match) errors.push(`${entity.id}: Wikidata references require exact or close match confidence`);
        if (url && url.hostname !== "www.wikidata.org") errors.push(`${entity.id}: Wikidata reference ${index} requires the canonical host`);
        if (url && reference.id && url.pathname !== `/wiki/${reference.id}`) errors.push(`${entity.id}: Wikidata URL does not match ${reference.id}`);
        if (reference.id?.match(/^Q\d+$/)) {
          const identityKey = `${reference.system}:${reference.id}`;
          const existing = externalIdentities.get(identityKey);
          if (existing) errors.push(`${entity.id}: external identity ${identityKey} already maps to ${existing}`);
          else externalIdentities.set(identityKey, entity.id);
        }
      }
    }
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

    if (entity.kind === "challenge") {
      if (!entity.question.trim()) errors.push(`${entity.id}: Challenge question is empty`);
      if (!entity.rationale.trim()) errors.push(`${entity.id}: Challenge rationale is empty`);
    }

    if (entity.kind === "criterion") {
      if (!entity.definition.trim()) errors.push(`${entity.id}: Criterion definition is empty`);
      if (!entity.evidenceRequirements.length) errors.push(`${entity.id}: Criterion requires evidence guidance`);
      if (!entity.normativeAssumptions.length) errors.push(`${entity.id}: Criterion requires disclosed normative assumptions`);
    }

    if (entity.kind === "comparison-dimension") {
      if (!entity.definition.trim()) errors.push(`${entity.id}: Comparison Dimension definition is empty`);
      if (entity.values.length < 2) errors.push(`${entity.id}: Comparison Dimension requires at least two values`);
      if (!entity.eligibleSubjectKinds.length) errors.push(`${entity.id}: Comparison Dimension requires eligible subject kinds`);
      if (!entity.method.trim()) errors.push(`${entity.id}: Comparison Dimension method is empty`);
      if (!entity.normativeChoices.length) errors.push(`${entity.id}: Comparison Dimension requires disclosed analytical choices`);
      if (!entity.limitations.length) errors.push(`${entity.id}: Comparison Dimension requires limitations`);
      if (!entity.statementIds.length) errors.push(`${entity.id}: Comparison Dimension requires supporting Statements`);
      const valueIds = new Set<string>();
      const valueOrders = new Set<number>();
      for (const value of entity.values) {
        if (!stableId.test(value.id)) errors.push(`${entity.id}: Dimension value ${value.id} is not stable kebab-case`);
        if (!value.label.trim() || !value.description.trim()) errors.push(`${entity.id}: Dimension value ${value.id} requires a label and description`);
        if (valueIds.has(value.id)) errors.push(`${entity.id}: duplicate Dimension value ${value.id}`);
        if (valueOrders.has(value.order)) errors.push(`${entity.id}: duplicate Dimension value order ${value.order}`);
        valueIds.add(value.id);
        valueOrders.add(value.order);
      }
      validateEntityRefs(entityById, entity.id, "statement", entity.statementIds, "Statement", errors);
      validateEntityRefs(entityById, entity.id, "comparison-dimension", entity.knownCorrelationIds, "known correlated Comparison Dimension", errors);
    }

    if (entity.kind === "case" || entity.kind === "case-episode") {
      validateHistoricalDate(entity.id, "startDate", entity.startDate, errors);
      if (entity.endDate) validateHistoricalDate(entity.id, "endDate", entity.endDate, errors);
      const start = comparableDate(entity.startDate, "start");
      const end = entity.endDate && comparableDate(entity.endDate, "end");
      if (start !== undefined && end !== undefined && start > end) {
        errors.push(`${entity.id}: startDate must not be after endDate`);
      }
      if (!entity.locationIds.length) errors.push(`${entity.id}: Case scope requires at least one Place`);
      if (!entity.scope.trim()) errors.push(`${entity.id}: Case scope is empty`);
      for (const placeId of entity.locationIds) {
        if (entityById.get(placeId)?.kind !== "place") errors.push(`${entity.id}: unresolved Place ${placeId}`);
      }
      for (const statementId of statementIdsForCase(entity)) {
        if (entityById.get(statementId)?.kind !== "statement") errors.push(`${entity.id}: unresolved Statement ${statementId}`);
      }
    }

    if (entity.kind === "case") {
      const overview = entity.overview ?? [];
      if (!entity.overviewTitle?.trim()) errors.push(`${entity.id}: Case requires a plain-language overview title`);
      if (!overview.length) errors.push(`${entity.id}: Case requires a plain-language overview`);
      for (const [index, section] of overview.entries()) {
        if (!section.heading.trim() || !section.text.trim()) errors.push(`${entity.id}: overview section ${index} requires a heading and text`);
        if (!section.statementIds.length) errors.push(`${entity.id}: overview section ${index} requires supporting Statements`);
      }
      if (!entity.selectionRationale.trim()) errors.push(`${entity.id}: selection rationale is empty`);
      if (!entity.endDate) {
        validateIsoDate(entity.id, "asOf", entity.asOf, errors);
        validateIsoDate(entity.id, "lastReviewedAt", entity.lastReviewedAt, errors);
        if (!entity.freshness) errors.push(`${entity.id}: ongoing Case requires freshness`);
      }
      for (const episodeId of entity.episodeIds) {
        const episode = entityById.get(episodeId);
        if (episode?.kind !== "case-episode" || episode.caseId !== entity.id) errors.push(`${entity.id}: unresolved or mismatched Case Episode ${episodeId}`);
      }
    }

    if (entity.kind === "case-episode") {
      const parent = entityById.get(entity.caseId);
      if (parent?.kind !== "case") {
        errors.push(`${entity.id}: unresolved parent Case ${entity.caseId}`);
      } else if (!parent.episodeIds.includes(entity.id)) {
        errors.push(`${entity.id}: parent Case ${entity.caseId} does not reference this episode`);
      }
    }

    if (entity.kind === "event") {
      validateHistoricalDate(entity.id, "startDate", entity.startDate, errors);
      if (entity.endDate) validateHistoricalDate(entity.id, "endDate", entity.endDate, errors);
      const start = comparableDate(entity.startDate, "start");
      const end = entity.endDate && comparableDate(entity.endDate, "end");
      if (start !== undefined && end !== undefined && start > end) errors.push(`${entity.id}: startDate must not be after endDate`);
      if (!entity.placeIds.length) errors.push(`${entity.id}: Event requires at least one Place`);
      if (!entity.eventKindIds.length) errors.push(`${entity.id}: Event requires at least one event-kind Concept`);
      if (!entity.descriptionStatementIds.length) errors.push(`${entity.id}: Event requires at least one description Statement`);
      validateEntityRefs(entityById, entity.id, "place", entity.placeIds, "Place", errors);
      validateEntityRefs(entityById, entity.id, "concept", entity.eventKindIds, "event-kind Concept", errors);
      validateEntityRefs(entityById, entity.id, "statement", entity.descriptionStatementIds, "Statement", errors);
    }

    if (entity.kind === "transition") {
      if (entityById.get(entity.caseId)?.kind !== "case") errors.push(`${entity.id}: unresolved Case ${entity.caseId}`);
      if (!entity.fromEpisodeIds.length || !entity.toEpisodeIds.length) errors.push(`${entity.id}: Transition requires before and after Case Episodes`);
      if (!entity.eventIds.length) errors.push(`${entity.id}: Transition requires at least one Event`);
      if (!entity.changedRelationshipIds.length) errors.push(`${entity.id}: Transition requires at least one changed Relationship`);
      validateEntityRefs(entityById, entity.id, "case-episode", entity.fromEpisodeIds, "from Case Episode", errors);
      validateEntityRefs(entityById, entity.id, "case-episode", entity.toEpisodeIds, "to Case Episode", errors);
      validateEntityRefs(entityById, entity.id, "event", entity.eventIds, "Event", errors);
      validateEntityRefs(entityById, entity.id, "statement", entity.explanationStatementIds, "explanation Statement", errors);
      validateEntityRefs(entityById, entity.id, "statement", entity.rivalInterpretationStatementIds, "rival interpretation Statement", errors);
      for (const relationshipId of entity.changedRelationshipIds) {
        if (!relationshipIds.has(relationshipId)) errors.push(`${entity.id}: unresolved changed Relationship ${relationshipId}`);
      }
      for (const episodeId of [...entity.fromEpisodeIds, ...entity.toEpisodeIds]) {
        const episode = entityById.get(episodeId);
        if (episode?.kind === "case-episode" && episode.caseId !== entity.caseId) errors.push(`${entity.id}: Case Episode ${episodeId} belongs to another Case`);
      }
    }
  }


  for (const relationship of relationships) {
    if (relationship.predicate !== "placed-on") continue;
    const dimension = entityById.get(relationship.object.id);
    if (dimension?.kind !== "comparison-dimension") continue;
    if (!dimension.eligibleSubjectKinds.includes(relationship.subject.kind)) {
      errors.push(`${relationship.id}: subject kind ${relationship.subject.kind} is not eligible for ${dimension.id}`);
    }
    if (!relationship.uncertainty.trim()) errors.push(`${relationship.id}: Placement uncertainty is empty`);
    const scope = relationship.scope;
    if (!scope) {
      errors.push(`${relationship.id}: Placement requires an explicit scope`);
    } else {
      if (!scope.note?.trim() && !scope.startDate && !scope.endDate && !scope.placeIds?.length) {
        errors.push(`${relationship.id}: Placement requires an explicit scope`);
      }
      validateEntityRefs(entityById, relationship.id, "place", scope.placeIds ?? [], "scope Place", errors);
    }
    const valueIds = new Set(dimension.values.map(({ id }) => id));
    const value = relationship.value;
    if (value.kind === "category") {
      if (!valueIds.has(value.categoryId)) errors.push(`${relationship.id}: unknown Dimension value ${value.categoryId}`);
    } else {
      const from = dimension.values.find(({ id }) => id === value.fromCategoryId);
      const to = dimension.values.find(({ id }) => id === value.toCategoryId);
      if (!from) errors.push(`${relationship.id}: unknown Dimension range start ${value.fromCategoryId}`);
      if (!to) errors.push(`${relationship.id}: unknown Dimension range end ${value.toCategoryId}`);
      if (from && to && from.order > to.order) errors.push(`${relationship.id}: Dimension range must run from lower to higher order`);
    }
  }

  const citedStatementIds = new Set(relationships.filter((relationship) => relationship.predicate === "cites").map((relationship) => relationship.subject.id));
  for (const entity of entities) {
    if (entity.kind === "statement" && entity.publicationStatus !== "research-needed" && !citedStatementIds.has(entity.id)) {
      errors.push(`${entity.id}: Statement requires a citation to advance beyond research-needed`);
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
