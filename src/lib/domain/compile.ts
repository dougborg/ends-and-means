import type { HistoricalDate } from "./cases";
import type { EntityRef } from "./common";
import type { DomainEntity } from "./entities";
import type { AuthoringDocument, CompiledDomainGraph } from "./graph";
import type { DomainRelationship } from "./relationships";

const stableId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const dossierSubjectKinds = new Set([
  "concept",
  "collection",
  "approach",
  "end",
  "means",
  "challenge",
  "criterion",
  "place",
  "case",
  "case-episode",
  "event",
  "transition",
  "comparison-dimension",
  "person",
  "organization",
  "depiction",
]);
const narrativeTraceStatuses = new Set([
  "supported",
  "qualified",
  "research-gap",
]);

function refKey(ref: EntityRef) {
  return `${ref.kind}:${ref.id}`;
}

function addIndex(
  index: Record<string, string[]>,
  key: string,
  relationshipId: string,
) {
  index[key] ??= [];
  index[key].push(relationshipId);
}

function addMapValue<T>(map: Map<string, T[]>, key: string, value: T) {
  const values = map.get(key);
  if (values) values.push(value);
  else map.set(key, [value]);
}

function compareIds(left: { id: string }, right: { id: string }) {
  return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
}

function isHttpUrl(value: string) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function reportInvalid(errors: string[], invalid: boolean, message: string) {
  if (invalid) errors.push(message);
}

function validateCalendarDay(
  ownerId: string,
  field: string,
  value: HistoricalDate,
  errors: string[],
) {
  if (
    value.year === undefined ||
    value.month === undefined ||
    value.day === undefined
  )
    return;
  const leapYear =
    value.year % 4 === 0 && (value.year % 100 !== 0 || value.year % 400 === 0);
  const daysInMonth = [
    31,
    leapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][value.month - 1];
  reportInvalid(
    errors,
    daysInMonth !== undefined && value.day > daysInMonth,
    `${ownerId}: ${field} day is invalid for its month`,
  );
}

function validateHistoricalDate(
  ownerId: string,
  field: string,
  value: HistoricalDate,
  errors: string[],
) {
  reportInvalid(
    errors,
    value.year !== undefined && !Number.isInteger(value.year),
    `${ownerId}: ${field} year must be an integer`,
  );
  reportInvalid(
    errors,
    value.month !== undefined &&
      (!Number.isInteger(value.month) || value.month < 1 || value.month > 12),
    `${ownerId}: ${field} month must be between 1 and 12`,
  );
  reportInvalid(
    errors,
    value.day !== undefined &&
      (!Number.isInteger(value.day) || value.day < 1 || value.day > 31),
    `${ownerId}: ${field} day must be between 1 and 31`,
  );
  reportInvalid(
    errors,
    (value.month !== undefined || value.day !== undefined) &&
      value.year === undefined,
    `${ownerId}: ${field} month/day requires a year`,
  );
  reportInvalid(
    errors,
    value.day !== undefined && value.month === undefined,
    `${ownerId}: ${field} day requires a month`,
  );
  reportInvalid(
    errors,
    value.certainty === "exact" && value.year === undefined,
    `${ownerId}: exact ${field} requires a year`,
  );
  reportInvalid(
    errors,
    value.certainty !== "exact" && !value.note?.trim(),
    `${ownerId}: ${field} with ${value.certainty} certainty requires a note`,
  );
  validateCalendarDay(ownerId, field, value, errors);
}

function validateIsoDate(
  ownerId: string,
  field: string,
  value: string | undefined,
  errors: string[],
) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const year = Number(match?.[1]);
  const month = Number(match?.[2]);
  const day = Number(match?.[3]);
  const parsed = match ? new Date(Date.UTC(year, month - 1, day)) : undefined;
  if (
    !match ||
    parsed?.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
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
  if (entity.kind === "case") return entity.conditionStatementIds;
  if (entity.kind === "case-episode")
    return [
      ...entity.conditionStatementIds,
      ...entity.formalRuleStatementIds,
      ...entity.ruleInUseStatementIds,
      ...entity.interactionStatementIds,
      ...entity.outcomeStatementIds,
    ];
  return [];
}

function validateEntityRefs(
  entityById: Map<string, DomainEntity>,
  ownerId: string,
  kind: EntityRef["kind"],
  ids: string[],
  label: string,
  errors: string[],
) {
  for (const id of ids)
    if (entityById.get(id)?.kind !== kind)
      errors.push(`${ownerId}: unresolved ${label} ${id}`);
}

function detectBroaderCycle(relationships: DomainRelationship[]) {
  const edges = new Map<string, string[]>();
  for (const relationship of relationships) {
    if (relationship.predicate === "broader-than") {
      addMapValue(edges, relationship.subject.id, relationship.object.id);
    } else if (relationship.predicate === "narrower-than") {
      addMapValue(edges, relationship.object.id, relationship.subject.id);
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

function collectDocuments(documents: AuthoringDocument[], errors: string[]) {
  const entities: DomainEntity[] = [];
  const relationships: DomainRelationship[] = [];

  for (const [index, document] of documents.entries()) {
    if (document.documentType === "entity") {
      entities.push(document.entity);
    } else {
      for (const relationship of document.relationships) {
        if (refKey(relationship.subject) !== refKey(document.subject)) {
          errors.push(
            `document ${index}: relationship ${relationship.id} does not match its subject-centered file`,
          );
        }
        relationships.push(relationship);
      }
    }
  }

  return { entities, relationships };
}

function validateExternalReference(
  entity: DomainEntity,
  index: number,
  reference: NonNullable<DomainEntity["externalRefs"]>[number],
  externalIdentities: Map<string, string>,
  errors: string[],
) {
  if (!isHttpUrl(reference.url))
    errors.push(
      `${entity.id}: external reference ${index} requires an HTTP(S) URL`,
    );
  validateIsoDate(
    entity.id,
    `external reference ${index} checkedAt`,
    reference.checkedAt,
    errors,
  );
  let url: URL | undefined;
  try {
    url = new URL(reference.url);
  } catch {
    /* Reported above. */
  }
  if (reference.system === "wikipedia") {
    reportInvalid(
      errors,
      reference.purpose !== "orientation",
      `${entity.id}: Wikipedia references must be orientation links`,
    );
    reportInvalid(
      errors,
      !reference.language,
      `${entity.id}: Wikipedia references require a language`,
    );
    reportInvalid(
      errors,
      Boolean(
        url &&
          (url.hostname !== `${reference.language}.wikipedia.org` ||
            !url.pathname.startsWith("/wiki/")),
      ),
      `${entity.id}: Wikipedia reference ${index} does not match its language and article form`,
    );
  }
  if (reference.system !== "wikidata") return;
  reportInvalid(
    errors,
    reference.purpose !== "identity",
    `${entity.id}: Wikidata references must be identity links`,
  );
  reportInvalid(
    errors,
    !reference.id?.match(/^Q\d+$/),
    `${entity.id}: Wikidata references require a QID`,
  );
  reportInvalid(
    errors,
    !reference.match,
    `${entity.id}: Wikidata references require exact or close match confidence`,
  );
  reportInvalid(
    errors,
    Boolean(url && url.hostname !== "www.wikidata.org"),
    `${entity.id}: Wikidata reference ${index} requires the canonical host`,
  );
  reportInvalid(
    errors,
    Boolean(url && reference.id && url.pathname !== `/wiki/${reference.id}`),
    `${entity.id}: Wikidata URL does not match ${reference.id}`,
  );
  if (!reference.id?.match(/^Q\d+$/)) return;
  const identityKey = `${reference.system}:${reference.id}`;
  const existing = externalIdentities.get(identityKey);
  if (existing)
    errors.push(
      `${entity.id}: external identity ${identityKey} already maps to ${existing}`,
    );
  else externalIdentities.set(identityKey, entity.id);
}

function indexAndValidateEntity(
  entity: DomainEntity,
  entityById: Map<string, DomainEntity>,
  externalIdentities: Map<string, string>,
  errors: string[],
) {
  if (!stableId.test(entity.id))
    errors.push(`${entity.id}: entity ID is not stable kebab-case`);
  if (!entity.label.trim()) errors.push(`${entity.id}: label is empty`);
  if (!entity.description.trim())
    errors.push(`${entity.id}: description is empty`);
  if (entityById.has(entity.id))
    errors.push(`${entity.id}: duplicate global entity ID`);
  entityById.set(entity.id, entity);

  const refs = new Set<string>();
  for (const [index, reference] of (entity.externalRefs ?? []).entries()) {
    const key = `${reference.system}:${reference.id ?? reference.url}`;
    if (refs.has(key))
      errors.push(`${entity.id}: duplicate external reference ${key}`);
    refs.add(key);
    validateExternalReference(
      entity,
      index,
      reference,
      externalIdentities,
      errors,
    );
  }
}

function indexAndValidateEntities(entities: DomainEntity[], errors: string[]) {
  const entityById = new Map<string, DomainEntity>();
  const externalIdentities = new Map<string, string>();
  for (const entity of entities) {
    indexAndValidateEntity(entity, entityById, externalIdentities, errors);
  }

  return entityById;
}

function validateRelationshipDocuments(
  documents: AuthoringDocument[],
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  for (const [index, document] of documents.entries()) {
    if (document.documentType !== "relationships") continue;
    const subject = entityById.get(document.subject.id);
    if (!subject || subject.kind !== document.subject.kind) {
      errors.push(
        `document ${index}: unresolved or mistyped document subject ${refKey(document.subject)}`,
      );
    }
  }
}

function validateRelationship(
  relationship: DomainRelationship,
  entityById: Map<string, DomainEntity>,
  relationshipIds: Set<string>,
  errors: string[],
) {
  if (!stableId.test(relationship.id))
    errors.push(`${relationship.id}: relationship ID is not stable kebab-case`);
  if (relationshipIds.has(relationship.id))
    errors.push(`${relationship.id}: duplicate relationship ID`);
  if (entityById.has(relationship.id))
    errors.push(`${relationship.id}: ID collides with an entity ID`);
  relationshipIds.add(relationship.id);

  const subject = entityById.get(relationship.subject.id);
  const object = entityById.get(relationship.object.id);
  if (!subject || subject.kind !== relationship.subject.kind)
    errors.push(
      `${relationship.id}: unresolved or mistyped subject ${refKey(relationship.subject)}`,
    );
  if (!object || object.kind !== relationship.object.kind)
    errors.push(
      `${relationship.id}: unresolved or mistyped object ${refKey(relationship.object)}`,
    );
  if (relationship.predicate === "cites") {
    reportInvalid(
      errors,
      !relationship.locator.trim(),
      `${relationship.id}: citation requires a locator`,
    );
  } else validateSubstantiveRelationship(relationship, entityById, errors);
}

function validateSubstantiveRelationship(
  relationship: Exclude<DomainRelationship, { predicate: "cites" }>,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  if (
    relationship.status !== "research-needed" &&
    relationship.statementIds.length === 0
  ) {
    errors.push(
      `${relationship.id}: substantive relationship requires a supporting Statement`,
    );
  }
  for (const statementId of relationship.statementIds) {
    if (entityById.get(statementId)?.kind !== "statement")
      errors.push(`${relationship.id}: unresolved Statement ${statementId}`);
  }
  if (relationship.predicate === "depicts") {
    if (!relationship.interpretation.trim())
      errors.push(`${relationship.id}: Depiction interpretation is empty`);
    for (const statementId of relationship.statementIds) {
      const statement = entityById.get(statementId);
      if (
        statement?.kind === "statement" &&
        statement.statementKind !== "editorial-interpretation"
      ) {
        errors.push(
          `${relationship.id}: Depiction requires editorial-interpretation Statement ${statementId}`,
        );
      }
    }
  }
}

function validateRelationships(
  relationships: DomainRelationship[],
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const relationshipIds = new Set<string>();
  for (const relationship of relationships)
    validateRelationship(relationship, entityById, relationshipIds, errors);

  return relationshipIds;
}

type EntityOf<K extends DomainEntity["kind"]> = Extract<
  DomainEntity,
  { kind: K }
>;

function validateSchemes(
  entity: DomainEntity,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const schemeIds =
    entity.kind === "concept" || entity.kind === "domain"
      ? entity.schemeIds
      : [];
  for (const schemeId of schemeIds) {
    if (entityById.get(schemeId)?.kind !== "concept-scheme")
      errors.push(`${entity.id}: unresolved Concept Scheme ${schemeId}`);
  }
}

function validateSource(
  entity: EntityOf<"source">,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  reportInvalid(
    errors,
    Boolean(entity.workId && entityById.get(entity.workId)?.kind !== "work"),
    `${entity.id}: unresolved Work ${entity.workId}`,
  );
  if (
    entity.identifiers?.doi &&
    !/^10\.\d{4,9}\/[\S]+$/i.test(entity.identifiers.doi)
  )
    errors.push(`${entity.id}: DOI must be a bare DOI identifier`);
  if (
    entity.identifiers?.isbn10 &&
    !/^[\dX]{10}$/i.test(entity.identifiers.isbn10.replaceAll("-", ""))
  )
    errors.push(`${entity.id}: invalid ISBN-10`);
  if (
    entity.identifiers?.isbn13 &&
    !/^\d{13}$/.test(entity.identifiers.isbn13.replaceAll("-", ""))
  )
    errors.push(`${entity.id}: invalid ISBN-13`);
  for (const [index, link] of (entity.resourceLinks ?? []).entries()) {
    if (!isHttpUrl(link.url))
      errors.push(
        `${entity.id}: resource link ${index} requires an HTTP(S) URL`,
      );
    reportInvalid(
      errors,
      !link.label.trim(),
      `${entity.id}: resource link ${index} requires a label`,
    );
    if (link.purpose === "purchase" && typeof link.affiliate !== "boolean")
      errors.push(
        `${entity.id}: purchase link ${index} must declare affiliate true or false`,
      );
  }
}

function validateDepiction(
  entity: EntityOf<"depiction">,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const work = entityById.get(entity.workId);
  if (work?.kind !== "work")
    errors.push(`${entity.id}: unresolved Work ${entity.workId}`);
  else if (work.workType !== "fiction")
    errors.push(`${entity.id}: Depiction requires a fictional Work`);
  if (!entity.scope.trim())
    errors.push(`${entity.id}: Depiction scope is empty`);
}

function validateChallenge(entity: EntityOf<"challenge">, errors: string[]) {
  if (!entity.question.trim())
    errors.push(`${entity.id}: Challenge question is empty`);
  if (!entity.rationale.trim())
    errors.push(`${entity.id}: Challenge rationale is empty`);
}

function validateCriterion(entity: EntityOf<"criterion">, errors: string[]) {
  if (!entity.definition.trim())
    errors.push(`${entity.id}: Criterion definition is empty`);
  if (!entity.evidenceRequirements.length)
    errors.push(`${entity.id}: Criterion requires evidence guidance`);
  if (!entity.normativeAssumptions.length)
    errors.push(
      `${entity.id}: Criterion requires disclosed normative assumptions`,
    );
}

function validateComparisonDimension(
  entity: EntityOf<"comparison-dimension">,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  reportInvalid(
    errors,
    !entity.definition.trim(),
    `${entity.id}: Comparison Dimension definition is empty`,
  );
  if (entity.values.length < 2)
    errors.push(
      `${entity.id}: Comparison Dimension requires at least two values`,
    );
  if (!entity.eligibleSubjectKinds.length)
    errors.push(
      `${entity.id}: Comparison Dimension requires eligible subject kinds`,
    );
  reportInvalid(
    errors,
    !entity.method.trim(),
    `${entity.id}: Comparison Dimension method is empty`,
  );
  if (!entity.normativeChoices.length)
    errors.push(
      `${entity.id}: Comparison Dimension requires disclosed analytical choices`,
    );
  if (!entity.limitations.length)
    errors.push(`${entity.id}: Comparison Dimension requires limitations`);
  if (!entity.statementIds.length)
    errors.push(
      `${entity.id}: Comparison Dimension requires supporting Statements`,
    );
  const valueIds = new Set<string>();
  const valueOrders = new Set<number>();
  for (const value of entity.values) {
    if (!stableId.test(value.id))
      errors.push(
        `${entity.id}: Dimension value ${value.id} is not stable kebab-case`,
      );
    if (!value.label.trim() || !value.description.trim())
      errors.push(
        `${entity.id}: Dimension value ${value.id} requires a label and description`,
      );
    if (valueIds.has(value.id))
      errors.push(`${entity.id}: duplicate Dimension value ${value.id}`);
    if (valueOrders.has(value.order))
      errors.push(
        `${entity.id}: duplicate Dimension value order ${value.order}`,
      );
    valueIds.add(value.id);
    valueOrders.add(value.order);
  }
  validateEntityRefs(
    entityById,
    entity.id,
    "statement",
    entity.statementIds,
    "Statement",
    errors,
  );
  validateEntityRefs(
    entityById,
    entity.id,
    "comparison-dimension",
    entity.knownCorrelationIds,
    "known correlated Comparison Dimension",
    errors,
  );
}

function validateCaseScope(
  entity: EntityOf<"case" | "case-episode">,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  validateHistoricalDate(entity.id, "startDate", entity.startDate, errors);
  if (entity.endDate)
    validateHistoricalDate(entity.id, "endDate", entity.endDate, errors);
  const start = comparableDate(entity.startDate, "start");
  const end = entity.endDate && comparableDate(entity.endDate, "end");
  if (start !== undefined && end !== undefined && start > end) {
    errors.push(`${entity.id}: startDate must not be after endDate`);
  }
  if (!entity.locationIds.length)
    errors.push(`${entity.id}: Case scope requires at least one Place`);
  if (!entity.scope.trim()) errors.push(`${entity.id}: Case scope is empty`);
  for (const placeId of entity.locationIds) {
    if (entityById.get(placeId)?.kind !== "place")
      errors.push(`${entity.id}: unresolved Place ${placeId}`);
  }
  for (const statementId of statementIdsForCase(entity)) {
    if (entityById.get(statementId)?.kind !== "statement")
      errors.push(`${entity.id}: unresolved Statement ${statementId}`);
  }
}

function validateCase(
  entity: EntityOf<"case">,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  reportInvalid(
    errors,
    !entity.selectionRationale.trim(),
    `${entity.id}: selection rationale is empty`,
  );
  if (!entity.endDate) {
    validateIsoDate(entity.id, "asOf", entity.asOf, errors);
    validateIsoDate(entity.id, "lastReviewedAt", entity.lastReviewedAt, errors);
    if (!entity.freshness)
      errors.push(`${entity.id}: ongoing Case requires freshness`);
  }
  for (const episodeId of entity.episodeIds) {
    const episode = entityById.get(episodeId);
    if (episode?.kind !== "case-episode" || episode.caseId !== entity.id)
      errors.push(
        `${entity.id}: unresolved or mismatched Case Episode ${episodeId}`,
      );
  }
}

function validateCaseEpisode(
  entity: EntityOf<"case-episode">,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const parent = entityById.get(entity.caseId);
  if (parent?.kind !== "case") {
    errors.push(`${entity.id}: unresolved parent Case ${entity.caseId}`);
  } else if (!parent.episodeIds.includes(entity.id)) {
    errors.push(
      `${entity.id}: parent Case ${entity.caseId} does not reference this episode`,
    );
  }
}

function validateEvent(
  entity: EntityOf<"event">,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  validateHistoricalDate(entity.id, "startDate", entity.startDate, errors);
  if (entity.endDate)
    validateHistoricalDate(entity.id, "endDate", entity.endDate, errors);
  const start = comparableDate(entity.startDate, "start");
  const end = entity.endDate && comparableDate(entity.endDate, "end");
  if (start !== undefined && end !== undefined && start > end)
    errors.push(`${entity.id}: startDate must not be after endDate`);
  if (!entity.placeIds.length)
    errors.push(`${entity.id}: Event requires at least one Place`);
  if (!entity.eventKindIds.length)
    errors.push(`${entity.id}: Event requires at least one event-kind Concept`);
  if (!entity.descriptionStatementIds.length)
    errors.push(
      `${entity.id}: Event requires at least one description Statement`,
    );
  validateEntityRefs(
    entityById,
    entity.id,
    "place",
    entity.placeIds,
    "Place",
    errors,
  );
  validateEntityRefs(
    entityById,
    entity.id,
    "concept",
    entity.eventKindIds,
    "event-kind Concept",
    errors,
  );
  validateEntityRefs(
    entityById,
    entity.id,
    "statement",
    entity.descriptionStatementIds,
    "Statement",
    errors,
  );
}

function validateTransition(
  entity: EntityOf<"transition">,
  entityById: Map<string, DomainEntity>,
  relationshipIds: Set<string>,
  errors: string[],
) {
  if (entityById.get(entity.caseId)?.kind !== "case")
    errors.push(`${entity.id}: unresolved Case ${entity.caseId}`);
  if (!entity.fromEpisodeIds.length || !entity.toEpisodeIds.length)
    errors.push(
      `${entity.id}: Transition requires before and after Case Episodes`,
    );
  if (!entity.eventIds.length)
    errors.push(`${entity.id}: Transition requires at least one Event`);
  if (!entity.changedRelationshipIds.length)
    errors.push(
      `${entity.id}: Transition requires at least one changed Relationship`,
    );
  validateEntityRefs(
    entityById,
    entity.id,
    "case-episode",
    entity.fromEpisodeIds,
    "from Case Episode",
    errors,
  );
  validateEntityRefs(
    entityById,
    entity.id,
    "case-episode",
    entity.toEpisodeIds,
    "to Case Episode",
    errors,
  );
  validateEntityRefs(
    entityById,
    entity.id,
    "event",
    entity.eventIds,
    "Event",
    errors,
  );
  validateEntityRefs(
    entityById,
    entity.id,
    "statement",
    entity.explanationStatementIds,
    "explanation Statement",
    errors,
  );
  validateEntityRefs(
    entityById,
    entity.id,
    "statement",
    entity.rivalInterpretationStatementIds,
    "rival interpretation Statement",
    errors,
  );
  for (const relationshipId of entity.changedRelationshipIds) {
    if (!relationshipIds.has(relationshipId))
      errors.push(
        `${entity.id}: unresolved changed Relationship ${relationshipId}`,
      );
  }
  for (const episodeId of [...entity.fromEpisodeIds, ...entity.toEpisodeIds]) {
    const episode = entityById.get(episodeId);
    if (episode?.kind === "case-episode" && episode.caseId !== entity.caseId)
      errors.push(
        `${entity.id}: Case Episode ${episodeId} belongs to another Case`,
      );
  }
}

function validateNarrativeSection(
  entity: EntityOf<"dossier">,
  section: EntityOf<"dossier">["sections"][number],
  index: number,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  reportInvalid(
    errors,
    !narrativeTraceStatuses.has(section.traceStatus),
    `${entity.id}: narrative section ${section.id} has an invalid trace status`,
  );
  if (!stableId.test(section.id))
    errors.push(
      `${entity.id}: narrative section ${index} ID is not stable kebab-case`,
    );
  if (!section.heading.trim() || !section.body.trim())
    errors.push(
      `${entity.id}: narrative section ${section.id} requires a heading and body`,
    );
  const isGap = section.traceStatus === "research-gap";
  if (!isGap && !section.statementIds.length)
    errors.push(
      `${entity.id}: narrative section ${section.id} requires supporting Statements`,
    );
  if (isGap && section.statementIds.length)
    errors.push(
      `${entity.id}: research-gap section ${section.id} must not claim supporting Statements`,
    );
  validateNarrativeTraceMaturity(entity, section, entityById, errors);
  validateEntityRefs(
    entityById,
    `${entity.id}:${section.id}`,
    "statement",
    section.statementIds,
    "Statement",
    errors,
  );
  reportInvalid(
    errors,
    new Set(section.statementIds).size !== section.statementIds.length,
    `${entity.id}: narrative section ${section.id} repeats a Statement`,
  );
  validateNarrativeRelatedEntities(entity, section, entityById, errors);
}

function validateNarrativeTraceMaturity(
  entity: EntityOf<"dossier">,
  section: EntityOf<"dossier">["sections"][number],
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  if (!["reviewed", "published"].includes(entity.publicationStatus)) return;
  for (const statementId of section.statementIds) {
    const statement = entityById.get(statementId);
    if (
      statement?.kind === "statement" &&
      !["reviewed", "published"].includes(statement.publicationStatus)
    )
      errors.push(
        `${entity.id}:${section.id}: live Dossier requires reviewed or published Statement ${statementId}`,
      );
  }
}

function validateNarrativeRelatedEntities(
  entity: EntityOf<"dossier">,
  section: EntityOf<"dossier">["sections"][number],
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const relatedKeys = (section.relatedEntityRefs ?? []).map(refKey);
  reportInvalid(
    errors,
    new Set(relatedKeys).size !== relatedKeys.length,
    `${entity.id}: narrative section ${section.id} repeats a related entity`,
  );
  for (const reference of section.relatedEntityRefs ?? []) {
    const related = entityById.get(reference.id);
    if (!related || related.kind !== reference.kind)
      errors.push(
        `${entity.id}:${section.id}: unresolved related entity ${refKey(reference)}`,
      );
  }
}

function validateDossier(
  entity: EntityOf<"dossier">,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  reportInvalid(
    errors,
    !dossierSubjectKinds.has(entity.subject.kind),
    `${entity.id}: invalid dossier subject kind ${entity.subject.kind}`,
  );
  const subject = entityById.get(entity.subject.id);
  if (!subject || subject.kind !== entity.subject.kind)
    errors.push(
      `${entity.id}: unresolved or mistyped dossier subject ${refKey(entity.subject)}`,
    );
  else if (
    ["reviewed", "published"].includes(entity.publicationStatus) &&
    !["reviewed", "published"].includes(subject.publicationStatus)
  )
    errors.push(
      `${entity.id}: live Dossier requires a reviewed or published subject`,
    );
  if (!entity.standfirst.trim())
    errors.push(`${entity.id}: dossier standfirst is empty`);
  validateIsoDate(entity.id, "reviewedAt", entity.reviewedAt, errors);
  if (!entity.sections.length)
    errors.push(
      `${entity.id}: dossier requires at least one narrative section`,
    );
  const sectionIds = new Set<string>();
  for (const [index, section] of entity.sections.entries()) {
    if (sectionIds.has(section.id))
      errors.push(`${entity.id}: duplicate narrative section ${section.id}`);
    sectionIds.add(section.id);
    validateNarrativeSection(entity, section, index, entityById, errors);
  }
}

function validateEntity(
  entity: DomainEntity,
  entityById: Map<string, DomainEntity>,
  relationshipIds: Set<string>,
  errors: string[],
) {
  validateSchemes(entity, entityById, errors);
  if (entity.kind === "source") validateSource(entity, entityById, errors);
  if (entity.kind === "depiction")
    validateDepiction(entity, entityById, errors);
  if (entity.kind === "challenge") validateChallenge(entity, errors);
  if (entity.kind === "criterion") validateCriterion(entity, errors);
  if (entity.kind === "comparison-dimension")
    validateComparisonDimension(entity, entityById, errors);
  if (entity.kind === "case" || entity.kind === "case-episode")
    validateCaseScope(entity, entityById, errors);
  if (entity.kind === "case") validateCase(entity, entityById, errors);
  if (entity.kind === "case-episode")
    validateCaseEpisode(entity, entityById, errors);
  if (entity.kind === "event") validateEvent(entity, entityById, errors);
  if (entity.kind === "transition")
    validateTransition(entity, entityById, relationshipIds, errors);
  if (entity.kind === "dossier") validateDossier(entity, entityById, errors);
}

function validateEntities(
  entities: DomainEntity[],
  entityById: Map<string, DomainEntity>,
  relationshipIds: Set<string>,
  errors: string[],
) {
  const dossierBySubject = new Map<string, string>();
  for (const entity of entities) {
    if (entity.kind !== "dossier" || entity.publicationStatus === "deprecated")
      continue;
    const subject = refKey(entity.subject);
    const existing = dossierBySubject.get(subject);
    if (existing)
      errors.push(
        `${entity.id}: dossier subject already belongs to ${existing}`,
      );
    else dossierBySubject.set(subject, entity.id);
  }
  for (const entity of entities)
    validateEntity(entity, entityById, relationshipIds, errors);
}

function validatePlacement(
  relationship: Extract<DomainRelationship, { predicate: "placed-on" }>,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const dimension = entityById.get(relationship.object.id);
  if (dimension?.kind !== "comparison-dimension") return;
  reportInvalid(
    errors,
    !dimension.eligibleSubjectKinds.includes(relationship.subject.kind),
    `${relationship.id}: subject kind ${relationship.subject.kind} is not eligible for ${dimension.id}`,
  );
  reportInvalid(
    errors,
    !relationship.uncertainty.trim(),
    `${relationship.id}: Placement uncertainty is empty`,
  );
  const scope = relationship.scope;
  if (!scope) {
    errors.push(`${relationship.id}: Placement requires an explicit scope`);
  } else {
    if (
      !scope.note?.trim() &&
      !scope.startDate &&
      !scope.endDate &&
      !scope.placeIds?.length
    ) {
      errors.push(`${relationship.id}: Placement requires an explicit scope`);
    }
    validateEntityRefs(
      entityById,
      relationship.id,
      "place",
      scope.placeIds ?? [],
      "scope Place",
      errors,
    );
  }
  const valueIds = new Set(dimension.values.map(({ id }) => id));
  const value = relationship.value;
  if (value.kind === "category") {
    if (!valueIds.has(value.categoryId))
      errors.push(
        `${relationship.id}: unknown Dimension value ${value.categoryId}`,
      );
  } else {
    const from = dimension.values.find(({ id }) => id === value.fromCategoryId);
    const to = dimension.values.find(({ id }) => id === value.toCategoryId);
    reportInvalid(
      errors,
      !from,
      `${relationship.id}: unknown Dimension range start ${value.fromCategoryId}`,
    );
    reportInvalid(
      errors,
      !to,
      `${relationship.id}: unknown Dimension range end ${value.toCategoryId}`,
    );
    reportInvalid(
      errors,
      Boolean(from && to && from.order > to.order),
      `${relationship.id}: Dimension range must run from lower to higher order`,
    );
  }
}

function validatePlacements(
  relationships: DomainRelationship[],
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  for (const relationship of relationships) {
    if (relationship.predicate === "placed-on")
      validatePlacement(relationship, entityById, errors);
  }
}

function validateStatementCitations(
  entities: DomainEntity[],
  relationships: DomainRelationship[],
  errors: string[],
) {
  const citedStatementIds = new Set(
    relationships
      .filter((relationship) => relationship.predicate === "cites")
      .map((relationship) => relationship.subject.id),
  );
  for (const entity of entities) {
    if (
      entity.kind === "statement" &&
      entity.publicationStatus !== "research-needed" &&
      !citedStatementIds.has(entity.id)
    ) {
      errors.push(
        `${entity.id}: Statement requires a citation to advance beyond research-needed`,
      );
    }
  }
}

type Citation = Extract<DomainRelationship, { predicate: "cites" }>;

function citedWork(citation: Citation, entityById: Map<string, DomainEntity>) {
  const source = entityById.get(citation.object.id);
  const work =
    source?.kind === "source" && source.workId
      ? entityById.get(source.workId)
      : undefined;
  return work?.kind === "work" ? work : undefined;
}

function validateEmpiricalStatement(
  statementId: string,
  citationsByStatement: Map<string, Citation[]>,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const statement = entityById.get(statementId);
  if (statement?.kind !== "statement") return;
  const citations = citationsByStatement.get(statementId) ?? [];
  for (const citation of citations) {
    if (
      ["supports", "challenges"].includes(citation.role) &&
      citedWork(citation, entityById)?.workType === "fiction"
    )
      errors.push(
        `${citation.id}: fictional Work Source cannot ${citation.role.slice(0, -1)} empirical Statement ${statementId}`,
      );
  }
  const hasNonfictionSupport = citations.some(
    (citation) =>
      citation.role === "supports" &&
      citedWork(citation, entityById)?.workType !== undefined &&
      citedWork(citation, entityById)?.workType !== "fiction",
  );
  if (
    statement.publicationStatus !== "research-needed" &&
    !hasNonfictionSupport
  )
    errors.push(
      `${statementId}: empirical outcome or assessment requires a non-fiction supporting Source`,
    );
}

function validateEmpiricalStatements(
  entities: DomainEntity[],
  relationships: DomainRelationship[],
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const empiricalStatementIds = new Set(
    entities
      .filter(
        (entity): entity is Extract<DomainEntity, { kind: "statement" }> =>
          entity.kind === "statement" && entity.statementKind === "observation",
      )
      .map(({ id }) => id),
  );
  for (const entity of entities)
    addEmpiricalEntityStatements(entity, empiricalStatementIds);
  for (const relationship of relationships) {
    if (relationship.predicate === "assessed-by")
      for (const id of relationship.statementIds) empiricalStatementIds.add(id);
  }
  const citationsByStatement = new Map<string, Citation[]>();
  for (const relationship of relationships) {
    if (relationship.predicate !== "cites") continue;
    addMapValue(citationsByStatement, relationship.subject.id, relationship);
  }
  for (const statementId of empiricalStatementIds)
    validateEmpiricalStatement(
      statementId,
      citationsByStatement,
      entityById,
      errors,
    );
}

function addEmpiricalEntityStatements(entity: DomainEntity, ids: Set<string>) {
  if (entity.kind === "case-episode")
    for (const id of entity.outcomeStatementIds) ids.add(id);
}

function validatePreferredLabels(entities: DomainEntity[], errors: string[]) {
  const preferredLabels = new Map<string, string>();
  for (const entity of entities) {
    if (entity.kind !== "concept") continue;
    for (const schemeId of entity.schemeIds) {
      const key = `${schemeId}:${entity.label.trim().toLocaleLowerCase("en")}`;
      const existing = preferredLabels.get(key);
      if (existing)
        errors.push(
          `${entity.id}: preferred label duplicates ${existing} in ${schemeId}`,
        );
      preferredLabels.set(key, entity.id);
    }
  }
}

export function validateAuthoringDocuments(
  documents: AuthoringDocument[],
): string[] {
  const errors: string[] = [];
  const { entities, relationships } = collectDocuments(documents, errors);
  const entityById = indexAndValidateEntities(entities, errors);
  validateRelationshipDocuments(documents, entityById, errors);
  const relationshipIds = validateRelationships(
    relationships,
    entityById,
    errors,
  );
  validateEntities(entities, entityById, relationshipIds, errors);
  validatePlacements(relationships, entityById, errors);
  validateStatementCitations(entities, relationships, errors);
  validateEmpiricalStatements(entities, relationships, entityById, errors);
  validatePreferredLabels(entities, errors);
  reportInvalid(
    errors,
    detectBroaderCycle(relationships),
    "Concept broader/narrower relationships contain a cycle",
  );
  return errors;
}

export function compileDomainGraph(
  documents: AuthoringDocument[],
): CompiledDomainGraph {
  const errors = validateAuthoringDocuments(documents);
  if (errors.length)
    throw new Error(`Domain graph validation failed:\n${errors.join("\n")}`);

  const entities = documents
    .flatMap((document) =>
      document.documentType === "entity" ? [document.entity] : [],
    )
    .sort(compareIds);
  const relationships = documents
    .flatMap((document) =>
      document.documentType === "relationships" ? document.relationships : [],
    )
    .sort(compareIds);
  const entitiesById = Object.fromEntries(
    entities.map((entity) => [entity.id, entity]),
  );
  const outgoingRelationshipIds: Record<string, string[]> = {};
  const incomingRelationshipIds: Record<string, string[]> = {};
  for (const relationship of relationships) {
    addIndex(outgoingRelationshipIds, relationship.subject.id, relationship.id);
    addIndex(incomingRelationshipIds, relationship.object.id, relationship.id);
  }

  for (const ids of Object.values(outgoingRelationshipIds)) ids.sort();
  for (const ids of Object.values(incomingRelationshipIds)) ids.sort();

  return {
    schemaVersion: "plural-graph-1",
    entities,
    relationships,
    indexes: { entitiesById, outgoingRelationshipIds, incomingRelationshipIds },
  };
}
