import type {
  DomainRelationship,
  PlacementValue,
  RelationshipScope,
  SubjectGuide,
  SubjectGuideSection,
} from "./domain";

export interface SubjectGuideRelationshipDetail {
  label: string;
  value: string;
}

interface RelationshipDetailOptions {
  entityLabel?: (id: string) => string | undefined;
  placementValueLabel?: (value: PlacementValue) => string | undefined;
}

function words(value: string) {
  return value.replaceAll("-", " ");
}

function scopeDetails(
  scope: RelationshipScope | undefined,
  entityLabel: RelationshipDetailOptions["entityLabel"],
) {
  if (!scope) return [];
  const details: SubjectGuideRelationshipDetail[] = [];
  if (scope.startDate || scope.endDate) {
    const dates =
      scope.startDate === scope.endDate
        ? scope.startDate
        : [scope.startDate, scope.endDate].filter(Boolean).join("–");
    if (dates) details.push({ label: "When", value: dates });
  }
  if (scope.placeIds?.length) {
    details.push({
      label: "Where",
      value: scope.placeIds
        .map((id) => entityLabel?.(id) ?? words(id))
        .join(", "),
    });
  }
  if (scope.note) details.push({ label: "Scope", value: scope.note });
  return details;
}

/** Reader-facing qualifications retained from a canonical relationship. */
export function subjectGuideRelationshipDetails(
  relationship: DomainRelationship,
  options: RelationshipDetailOptions = {},
) {
  if (relationship.predicate === "cites") {
    return [
      { label: "Source role", value: words(relationship.role) },
      { label: "Location in source", value: relationship.locator },
      ...(relationship.note
        ? [{ label: "Source note", value: relationship.note }]
        : []),
    ];
  }

  const details: SubjectGuideRelationshipDetail[] = [
    { label: "Evidence status", value: words(relationship.status) },
    ...scopeDetails(relationship.scope, options.entityLabel),
  ];

  switch (relationship.predicate) {
    case "member-of":
      details.push({
        label: "Membership",
        value: words(relationship.membership),
      });
      break;
    case "addresses-domain":
      details.push({
        label: "Importance",
        value: words(relationship.centrality),
      });
      break;
    case "interprets-concept":
      details.push(
        { label: "Role", value: words(relationship.role) },
        { label: "Interpretation", value: relationship.interpretation },
      );
      break;
    case "specified-by":
      details.push({ label: "Design facet", value: words(relationship.facet) });
      break;
    case "used-means":
      details.push({
        label: "Implementation",
        value: words(relationship.implementation),
      });
      break;
    case "assessed-by":
      details.push({
        label: "Conclusion",
        value: words(relationship.conclusion),
      });
      break;
    case "depicts":
      details.push({
        label: "Interpretation",
        value: relationship.interpretation,
      });
      break;
    case "placed-on":
      details.push(
        {
          label: "Placement",
          value:
            options.placementValueLabel?.(relationship.value) ??
            (relationship.value.kind === "category"
              ? words(relationship.value.categoryId)
              : `${words(relationship.value.fromCategoryId)} to ${words(relationship.value.toCategoryId)}`),
        },
        { label: "Basis", value: words(relationship.basis) },
        { label: "Uncertainty", value: relationship.uncertainty },
      );
      break;
  }

  return details;
}

export function subjectGuideSectionHasContent(section: SubjectGuideSection) {
  return [
    section.narrativeRefs,
    section.statementIds,
    section.entityRefs,
    section.relationshipIds,
    section.researchObligationIds,
  ].some((selection) => (selection?.length ?? 0) > 0);
}

export function visibleSubjectGuideSections(guide: SubjectGuide) {
  return guide.sections.filter(subjectGuideSectionHasContent);
}

export function directSubjectGuideEvidence(section: SubjectGuideSection) {
  return section.statementIds ?? [];
}

export function hasSubjectGuideDirectory(guides: readonly SubjectGuide[]) {
  return guides.length > 0;
}
