import type { SubjectGuide, SubjectGuideSection } from "./domain";

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
