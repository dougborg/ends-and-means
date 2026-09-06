import type { EntityRef, PublicationStatus } from "./common";
import type { DomainEntity } from "./entities";
import type {
  SubjectGuide,
  SubjectGuideSection,
  SubjectGuideSectionRole,
} from "./presentation";
import { workflowReferencesIn } from "./public-text";
import type { DomainRelationship } from "./relationships";

const stableId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const liveStatuses = new Set<PublicationStatus>(["reviewed", "published"]);
const publicationStatuses = new Set<PublicationStatus>([
  "research-needed",
  "in-review",
  "reviewed",
  "published",
  "deprecated",
]);
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
const subjectGuideSectionRoles = new Set<SubjectGuideSectionRole>([
  "short-answer",
  "meanings-and-boundaries",
  "purposes-and-diagnoses",
  "institutions-and-mechanisms",
  "bounded-practice",
  "variants-and-disputes",
  "comparisons-and-next-steps",
  "depictions",
  "open-questions",
]);
const requiredSubjectGuideRoles = [
  "short-answer",
  "meanings-and-boundaries",
  "comparisons-and-next-steps",
] satisfies SubjectGuideSectionRole[];

function refKey(ref: EntityRef) {
  return `${ref.kind}:${ref.id}`;
}

function reportInvalid(errors: string[], invalid: boolean, message: string) {
  if (invalid) errors.push(message);
}

function addMapValue<T>(map: Map<string, T[]>, key: string, value: T) {
  const values = map.get(key);
  if (values) values.push(value);
  else map.set(key, [value]);
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
  )
    errors.push(`${ownerId}: ${field} requires an ISO calendar date`);
}

function live(
  status: DomainEntity["publicationStatus"] | SubjectGuide["publicationStatus"],
) {
  return liveStatuses.has(status);
}

function normalizedEntryPhrase(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("en");
}

function guideLookupNamespaceKey(value: string) {
  return normalizedEntryPhrase(value).replace(/[-\s]+/g, " ");
}

function validateGuideNarrativeRef(
  guide: SubjectGuide,
  section: SubjectGuideSection,
  reference: NonNullable<SubjectGuideSection["narrativeRefs"]>[number],
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const dossier = entityById.get(reference.dossierId);
  if (dossier?.kind !== "dossier") {
    errors.push(
      `${guide.id}:${section.id}: unresolved Dossier ${reference.dossierId}`,
    );
    return;
  }
  if (live(guide.publicationStatus) && !live(dossier.publicationStatus))
    errors.push(
      `${guide.id}:${section.id}: live SubjectGuide requires reviewed or published Dossier ${dossier.id}`,
    );
  if (
    reference.sectionId &&
    !dossier.sections.some(({ id }) => id === reference.sectionId)
  )
    errors.push(
      `${guide.id}:${section.id}: unresolved Dossier section ${dossier.id}#${reference.sectionId}`,
    );
}

function selectedDossier(
  reference: NonNullable<SubjectGuideSection["narrativeRefs"]>[number],
  entityById: Map<string, DomainEntity>,
) {
  const dossier = entityById.get(reference.dossierId);
  return dossier?.kind === "dossier" ? dossier : undefined;
}

function validateGuideSection(
  guide: SubjectGuide,
  section: SubjectGuideSection,
  index: number,
  entityById: Map<string, DomainEntity>,
  relationshipById: Map<string, DomainRelationship>,
  errors: string[],
) {
  const owner = `${guide.id}:${section.id}`;
  reportInvalid(
    errors,
    !subjectGuideSectionRoles.has(section.role),
    `${owner}: invalid SubjectGuide section role ${section.role}`,
  );
  reportInvalid(
    errors,
    !stableId.test(section.id),
    `${guide.id}: SubjectGuide section ${index} ID ${JSON.stringify(section.id)} is not stable kebab-case`,
  );
  reportInvalid(errors, !section.heading.trim(), `${owner}: heading is empty`);
  reportInvalid(
    errors,
    live(guide.publicationStatus) &&
      workflowReferencesIn(section.heading).length > 0,
    `${owner}: heading contains an internal workflow reference`,
  );
  validateGuideSelectionPresence(owner, section, errors);
  validateGuideNarrativeSelections(guide, section, entityById, errors);
  validateGuideStatementSelections(guide, section, entityById, errors);
  validateGuideEntitySelections(guide, section, entityById, errors);
  validateGuideRelationshipSelections(
    guide,
    section,
    relationshipById,
    entityById,
    errors,
  );
  validateGuideObligationSelections(guide, section, entityById, errors);
  validateGuideRoleBoundary(guide, section, entityById, errors);
}

function validateGuideSelectionPresence(
  owner: string,
  section: SubjectGuideSection,
  errors: string[],
) {
  const count =
    (section.narrativeRefs?.length ?? 0) +
    (section.statementIds?.length ?? 0) +
    (section.entityRefs?.length ?? 0) +
    (section.relationshipIds?.length ?? 0) +
    (section.researchObligationIds?.length ?? 0);
  if (count === 0)
    errors.push(`${owner}: section does not select canonical material`);
}

function validateGuideNarrativeSelections(
  guide: SubjectGuide,
  section: SubjectGuideSection,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const references = section.narrativeRefs ?? [];
  const keys = references.map(
    ({ dossierId, sectionId }) => `${dossierId}#${sectionId ?? "standfirst"}`,
  );
  reportInvalid(
    errors,
    new Set(keys).size !== keys.length,
    `${guide.id}:${section.id}: repeats a Dossier narrative selection`,
  );
  for (const reference of references)
    validateGuideNarrativeRef(guide, section, reference, entityById, errors);
}

function validateGuideStatementSelections(
  guide: SubjectGuide,
  section: SubjectGuideSection,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const ids = section.statementIds ?? [];
  reportInvalid(
    errors,
    new Set(ids).size !== ids.length,
    `${guide.id}:${section.id}: repeats a Statement`,
  );
  for (const id of ids) {
    const statement = entityById.get(id);
    if (statement?.kind !== "statement")
      errors.push(`${guide.id}:${section.id}: unresolved Statement ${id}`);
    else if (
      live(guide.publicationStatus) &&
      !live(statement.publicationStatus)
    )
      errors.push(
        `${guide.id}:${section.id}: live SubjectGuide requires reviewed or published Statement ${id}`,
      );
  }
}

function validateGuideEntitySelections(
  guide: SubjectGuide,
  section: SubjectGuideSection,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const references = section.entityRefs ?? [];
  const entityKeys = references.map(refKey);
  reportInvalid(
    errors,
    new Set(entityKeys).size !== entityKeys.length,
    `${guide.id}:${section.id}: repeats a canonical entity`,
  );
  for (const reference of references) {
    const entity = entityById.get(reference.id);
    if (!entity || entity.kind !== reference.kind)
      errors.push(
        `${guide.id}:${section.id}: unresolved canonical entity ${refKey(reference)}`,
      );
    else if (live(guide.publicationStatus) && !live(entity.publicationStatus))
      errors.push(
        `${guide.id}:${section.id}: live SubjectGuide requires reviewed or published entity ${refKey(reference)}`,
      );
  }
}

function validateGuideRelationshipSelections(
  guide: SubjectGuide,
  section: SubjectGuideSection,
  relationshipById: Map<string, DomainRelationship>,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const relationshipIds = section.relationshipIds ?? [];
  reportInvalid(
    errors,
    new Set(relationshipIds).size !== relationshipIds.length,
    `${guide.id}:${section.id}: repeats a Relationship`,
  );
  for (const id of relationshipIds) {
    const relationship = relationshipById.get(id);
    if (!relationship)
      errors.push(`${guide.id}:${section.id}: unresolved Relationship ${id}`);
    else if (
      live(guide.publicationStatus) &&
      "status" in relationship &&
      relationship.status === "research-needed"
    )
      errors.push(
        `${guide.id}:${section.id}: live SubjectGuide cannot select research-needed Relationship ${id}`,
      );
    if (relationship && live(guide.publicationStatus))
      validateLiveSelectedRelationship(
        guide,
        section,
        relationship,
        entityById,
        errors,
      );
  }
}

function validateLiveSelectedRelationship(
  guide: SubjectGuide,
  section: SubjectGuideSection,
  relationship: DomainRelationship,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const owner = `${guide.id}:${section.id}`;
  for (const reference of [relationship.subject, relationship.object]) {
    const entity = entityById.get(reference.id);
    if (entity && !live(entity.publicationStatus))
      errors.push(
        `${owner}: live SubjectGuide Relationship ${relationship.id} has an unpublished endpoint ${refKey(reference)}`,
      );
  }
  if (relationship.predicate === "cites") {
    reportInvalid(
      errors,
      !relationship.locator.trim(),
      `${owner}: live SubjectGuide citation ${relationship.id} requires a locator`,
    );
    return;
  }
  reportInvalid(
    errors,
    relationship.statementIds.length === 0,
    `${owner}: live SubjectGuide Relationship ${relationship.id} requires supporting Statements`,
  );
  for (const statementId of relationship.statementIds) {
    const statement = entityById.get(statementId);
    if (statement?.kind === "statement" && !live(statement.publicationStatus))
      errors.push(
        `${owner}: live SubjectGuide Relationship ${relationship.id} has unpublished supporting Statement ${statementId}`,
      );
  }
}

function validateGuideObligationSelections(
  guide: SubjectGuide,
  section: SubjectGuideSection,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const owner = `${guide.id}:${section.id}`;
  const researchObligationIds = section.researchObligationIds ?? [];
  reportInvalid(
    errors,
    new Set(researchObligationIds).size !== researchObligationIds.length,
    `${owner}: repeats a Research Obligation`,
  );
  for (const id of researchObligationIds) {
    const obligation = entityById.get(id);
    if (obligation?.kind !== "research-obligation")
      errors.push(`${owner}: unresolved Research Obligation ${id}`);
    else if (
      live(guide.publicationStatus) &&
      !live(obligation.publicationStatus)
    )
      errors.push(
        `${owner}: live SubjectGuide requires reviewed or published Research Obligation ${id}`,
      );
  }
}

function validateGuideRoleBoundary(
  guide: SubjectGuide,
  section: SubjectGuideSection,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  validateGuideRequiredRoleBoundary(guide, section, entityById, errors);
  validateGuideConditionalRoleBoundary(guide, section, entityById, errors);
}

function validateGuideRequiredRoleBoundary(
  guide: SubjectGuide,
  section: SubjectGuideSection,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const owner = `${guide.id}:${section.id}`;
  const narrativeRefs = section.narrativeRefs ?? [];
  if (
    section.role === "short-answer" &&
    (narrativeRefs.length !== 1 || narrativeRefs[0]?.sectionId !== undefined)
  )
    errors.push(
      `${owner}: short answer must select exactly one Dossier standfirst`,
    );
  if (section.role === "short-answer" && narrativeRefs.length === 1) {
    const reference = narrativeRefs[0];
    const dossier = reference
      ? selectedDossier(reference, entityById)
      : undefined;
    if (dossier && refKey(dossier.subject) !== refKey(guide.primarySubject))
      errors.push(
        `${owner}: short-answer Dossier subject must equal the SubjectGuide primary subject`,
      );
  }
  if (
    section.role === "meanings-and-boundaries" &&
    narrativeRefs.length + (section.statementIds?.length ?? 0) === 0
  )
    errors.push(
      `${owner}: meanings and boundaries require traced narrative or a Statement`,
    );
}

function validateGuideConditionalRoleBoundary(
  guide: SubjectGuide,
  section: SubjectGuideSection,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  const owner = `${guide.id}:${section.id}`;
  const narrativeRefs = section.narrativeRefs ?? [];
  const entityRefs = section.entityRefs ?? [];
  if (
    section.role === "open-questions" &&
    !section.researchObligationIds?.length
  )
    errors.push(`${owner}: open questions require a Research Obligation`);
  if (
    section.role === "depictions" &&
    !entityRefs.some(({ kind }) => kind === "depiction")
  )
    errors.push(`${owner}: depictions must select a Depiction`);
  if (section.role === "bounded-practice") {
    const hasBoundedCase =
      entityRefs.some(
        ({ kind }) => kind === "case" || kind === "case-episode",
      ) ||
      narrativeRefs.some((reference) => {
        const dossier = selectedDossier(reference, entityById);
        return (
          dossier?.subject.kind === "case" ||
          dossier?.subject.kind === "case-episode"
        );
      });
    if (!hasBoundedCase)
      errors.push(
        `${owner}: bounded practice must select a Case or Case Episode`,
      );
  }
}

type GuideQueryOwner = { guide: SubjectGuide; disambiguation?: string };

interface SubjectGuideRegistries {
  guideIds: Set<string>;
  guideSlugs: Map<string, string>;
  liveGuideSlugs: Map<string, string>;
  redirectOwners: Map<string, string>;
  queryOwners: Map<string, GuideQueryOwner[]>;
}

function validateGuideShape(guide: SubjectGuide, errors: string[]) {
  const unsafe = guide as SubjectGuide & {
    kind?: string;
    alternateLabels?: string[];
    body?: string;
  };
  for (const [present, message] of [
    ["kind" in unsafe, "must not declare an EntityKind"],
    ["alternateLabels" in unsafe, "uses searchQueries, not alternateLabels"],
    ["body" in unsafe, "selects Dossier narrative instead of owning a body"],
  ] as const)
    reportInvalid(errors, present, `${guide.id}: SubjectGuide ${message}`);
  reportInvalid(
    errors,
    !stableId.test(guide.id),
    `${guide.id}: SubjectGuide ID is not stable kebab-case`,
  );
  reportInvalid(
    errors,
    !stableId.test(guide.slug),
    `${guide.id}: SubjectGuide slug is not stable kebab-case`,
  );
  reportInvalid(errors, !guide.label.trim(), `${guide.id}: label is empty`);
  reportInvalid(
    errors,
    !publicationStatuses.has(guide.publicationStatus),
    `${guide.id}: invalid publication status ${guide.publicationStatus}`,
  );
  reportInvalid(
    errors,
    !guide.description.trim(),
    `${guide.id}: description is empty`,
  );
  reportInvalid(
    errors,
    live(guide.publicationStatus) &&
      workflowReferencesIn(`${guide.label} ${guide.description}`).length > 0,
    `${guide.id}: reader-facing guide identity contains an internal workflow reference`,
  );
  validateIsoDate(guide.id, "reviewedAt", guide.reviewedAt, errors);
}

function registerGuideIdentity(
  guide: SubjectGuide,
  entityById: Map<string, DomainEntity>,
  registries: SubjectGuideRegistries,
  errors: string[],
) {
  reportInvalid(
    errors,
    registries.guideIds.has(guide.id),
    `${guide.id}: duplicate SubjectGuide ID`,
  );
  registries.guideIds.add(guide.id);
  reportInvalid(
    errors,
    entityById.has(guide.id),
    `${guide.id}: SubjectGuide ID collides with an entity ID`,
  );
  const slugOwner = registries.guideSlugs.get(guide.slug);
  reportInvalid(
    errors,
    Boolean(slugOwner),
    `${guide.id}: SubjectGuide slug already belongs to ${slugOwner}`,
  );
  if (!slugOwner) registries.guideSlugs.set(guide.slug, guide.id);
  const namespaceKey = guideLookupNamespaceKey(guide.slug);
  if (
    live(guide.publicationStatus) &&
    !registries.liveGuideSlugs.has(namespaceKey)
  )
    registries.liveGuideSlugs.set(namespaceKey, guide.id);
}

function validateGuidePrimarySubject(
  guide: SubjectGuide,
  entityById: Map<string, DomainEntity>,
  errors: string[],
) {
  reportInvalid(
    errors,
    !dossierSubjectKinds.has(guide.primarySubject.kind),
    `${guide.id}: invalid primary subject kind ${guide.primarySubject.kind}`,
  );
  const primary = entityById.get(guide.primarySubject.id);
  if (!primary || primary.kind !== guide.primarySubject.kind)
    errors.push(
      `${guide.id}: unresolved or mistyped primary subject ${refKey(guide.primarySubject)}`,
    );
  else if (live(guide.publicationStatus) && !live(primary.publicationStatus))
    errors.push(
      `${guide.id}: live SubjectGuide requires a reviewed or published primary subject`,
    );
}

function registerGuideQueries(
  guide: SubjectGuide,
  queryOwners: Map<string, GuideQueryOwner[]>,
  errors: string[],
) {
  if (!guide.searchQueries.length)
    errors.push(`${guide.id}: SubjectGuide requires at least one search query`);
  const localQueries = new Set<string>();
  for (const entry of guide.searchQueries) {
    const query = guideLookupNamespaceKey(entry.query);
    reportInvalid(
      errors,
      !query,
      `${guide.id}: SubjectGuide search query is empty`,
    );
    if (!query) continue;
    reportInvalid(
      errors,
      localQueries.has(query),
      `${guide.id}: repeats search query ${JSON.stringify(query)}`,
    );
    reportInvalid(
      errors,
      Boolean(
        live(guide.publicationStatus) &&
          entry.disambiguation &&
          workflowReferencesIn(entry.disambiguation).length > 0,
      ),
      `${guide.id}: search-query disambiguation contains an internal workflow reference`,
    );
    reportInvalid(
      errors,
      entry.resultStatus !== undefined &&
        !["guide", "research-gap"].includes(entry.resultStatus),
      `${guide.id}: search query ${JSON.stringify(query)} has an invalid result status`,
    );
    reportInvalid(
      errors,
      entry.resultStatus === "research-gap" && !entry.disambiguation?.trim(),
      `${guide.id}: research-gap search query ${JSON.stringify(query)} requires a reader-facing explanation`,
    );
    localQueries.add(query);
    addMapValue(queryOwners, query, {
      guide,
      ...(entry.disambiguation ? { disambiguation: entry.disambiguation } : {}),
    });
  }
}

function registerGuideRedirects(
  guide: SubjectGuide,
  redirectOwners: Map<string, string>,
  errors: string[],
) {
  for (const redirect of guide.redirects ?? []) {
    reportInvalid(
      errors,
      !stableId.test(redirect.from),
      `${guide.id}: redirect ${JSON.stringify(redirect.from)} is not a stable guide path`,
    );
    validateIsoDate(
      guide.id,
      `redirect ${redirect.from} reviewedAt`,
      redirect.reviewedAt,
      errors,
    );
    reportInvalid(
      errors,
      !live(guide.publicationStatus),
      `${guide.id}: only a live SubjectGuide may own a redirect`,
    );
    const existing = redirectOwners.get(redirect.from);
    reportInvalid(
      errors,
      Boolean(existing),
      `${guide.id}: redirect ${redirect.from} already belongs to ${existing}`,
    );
    if (!existing) redirectOwners.set(redirect.from, guide.id);
  }
}

function validateGuideSections(
  guide: SubjectGuide,
  entityById: Map<string, DomainEntity>,
  relationshipById: Map<string, DomainRelationship>,
  errors: string[],
) {
  if (!guide.sections.length)
    errors.push(`${guide.id}: SubjectGuide requires learner-journey sections`);
  const sectionIds = new Set<string>();
  const sectionRoles = new Set<SubjectGuideSectionRole>();
  for (const [index, section] of guide.sections.entries()) {
    reportInvalid(
      errors,
      sectionIds.has(section.id),
      `${guide.id}: duplicate SubjectGuide section ${section.id}`,
    );
    sectionIds.add(section.id);
    reportInvalid(
      errors,
      sectionRoles.has(section.role),
      `${guide.id}: duplicate SubjectGuide role ${section.role}`,
    );
    sectionRoles.add(section.role);
    validateGuideSection(
      guide,
      section,
      index,
      entityById,
      relationshipById,
      errors,
    );
  }
  for (const role of requiredSubjectGuideRoles)
    reportInvalid(
      errors,
      !sectionRoles.has(role),
      `${guide.id}: missing required SubjectGuide role ${role}`,
    );
}

function validateGuideRegistryCollisions(
  registries: SubjectGuideRegistries,
  errors: string[],
) {
  for (const [query, owners] of registries.queryOwners) {
    if (owners.length > 1)
      for (const owner of owners)
        reportInvalid(
          errors,
          !owner.disambiguation?.trim(),
          `${owner.guide.id}: colliding search query ${JSON.stringify(query)} requires disambiguation`,
        );
    const slugOwner = registries.liveGuideSlugs.get(query);
    for (const owner of owners)
      reportInvalid(
        errors,
        Boolean(
          slugOwner &&
            slugOwner !== owner.guide.id &&
            !owner.disambiguation?.trim(),
        ),
        `${owner.guide.id}: search query ${JSON.stringify(query)} collides with active SubjectGuide slug owned by ${slugOwner} and requires disambiguation`,
      );
  }
  for (const [from, owner] of registries.redirectOwners) {
    const namespaceKey = guideLookupNamespaceKey(from);
    reportInvalid(
      errors,
      registries.liveGuideSlugs.has(namespaceKey),
      `${owner}: redirect ${from} collides with an active SubjectGuide slug`,
    );
    reportInvalid(
      errors,
      registries.queryOwners.has(namespaceKey),
      `${owner}: redirect ${from} collides with a SubjectGuide search query`,
    );
  }
}

export function validateSubjectGuides(
  guides: SubjectGuide[],
  entityById: Map<string, DomainEntity>,
  relationships: DomainRelationship[],
  errors: string[],
) {
  const relationshipById = new Map(
    relationships.map((relationship) => [relationship.id, relationship]),
  );
  const registries: SubjectGuideRegistries = {
    guideIds: new Set(),
    guideSlugs: new Map(),
    liveGuideSlugs: new Map(),
    redirectOwners: new Map(),
    queryOwners: new Map(),
  };
  for (const guide of guides) {
    validateGuideShape(guide, errors);
    registerGuideIdentity(guide, entityById, registries, errors);
    validateGuidePrimarySubject(guide, entityById, errors);
    registerGuideQueries(guide, registries.queryOwners, errors);
    registerGuideRedirects(guide, registries.redirectOwners, errors);
    validateGuideSections(guide, entityById, relationshipById, errors);
  }
  validateGuideRegistryCollisions(registries, errors);
}
