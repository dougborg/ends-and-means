import type { EntityBase, EntityRef, PublicationStatus } from "./common";
import type { DomainRelationship } from "./relationships";

export interface NarrativeSection {
  id: string;
  heading: string;
  body: string;
  traceStatus: "supported" | "qualified" | "research-gap";
  statementIds: string[];
  relatedEntityRefs?: EntityRef[];
}

export type DossierSubjectKind =
  | "concept"
  | "collection"
  | "approach"
  | "end"
  | "means"
  | "challenge"
  | "criterion"
  | "place"
  | "case"
  | "case-episode"
  | "event"
  | "transition"
  | "comparison-dimension"
  | "person"
  | "organization"
  | "depiction";

export interface Dossier extends EntityBase {
  kind: "dossier";
  subject: EntityRef & { kind: DossierSubjectKind };
  standfirst: string;
  standfirstStatementIds: string[];
  sections: NarrativeSection[];
  reviewedAt: string;
}

export type PresentationEntity = Dossier;

export type SubjectGuideSectionRole =
  | "short-answer"
  | "meanings-and-boundaries"
  | "purposes-and-diagnoses"
  | "institutions-and-mechanisms"
  | "bounded-practice"
  | "variants-and-disputes"
  | "comparisons-and-next-steps"
  | "depictions"
  | "open-questions";

export type SubjectGuideSubjectKind = DossierSubjectKind;

/**
 * Selects narrative already owned and traced by a Dossier.
 * Omitting sectionId selects the Dossier standfirst.
 */
export interface DossierNarrativeRef {
  dossierId: string;
  sectionId?: string;
}

export interface SubjectGuideSearchQuery {
  query: string;
  /** Required on every owner when the normalized query belongs to several guides. */
  disambiguation?: string;
  /** Marks an entry phrase whose nearest reviewed guide does not fully answer it. */
  resultStatus?: "guide" | "research-gap";
}

export interface SubjectGuideRedirect {
  from: string;
  reviewedAt: string;
}

export interface SubjectGuideSection {
  id: string;
  role: SubjectGuideSectionRole;
  heading: string;
  narrativeRefs?: DossierNarrativeRef[];
  statementIds?: string[];
  entityRefs?: EntityRef[];
  relationshipIds?: string[];
  researchObligationIds?: string[];
}

/**
 * A learner-facing composition over the canonical graph.
 *
 * SubjectGuide deliberately does not extend EntityBase and has no `kind`.
 * Its references select independently owned material; they do not assert
 * identity, classification, inheritance, or graph relationships.
 */
export interface SubjectGuide {
  id: string;
  /** Stable public path segment, distinct from canonical entity identity. */
  slug: string;
  label: string;
  description: string;
  publicationStatus: PublicationStatus;
  primarySubject: EntityRef & { kind: SubjectGuideSubjectKind };
  searchQueries: SubjectGuideSearchQuery[];
  redirects?: SubjectGuideRedirect[];
  sections: SubjectGuideSection[];
  reviewedAt: string;
}

export type RelationshipPerspective = "subject" | "object";

const publicRelationshipLabels = {
  "broader-than": { subject: "Broader than", object: "Narrower than" },
  "narrower-than": { subject: "Narrower than", object: "Broader than" },
  "related-to": { subject: "Related to", object: "Related to" },
  "commonly-confused-with": {
    subject: "Often confused with",
    object: "Often confused with",
  },
  "member-of": { subject: "Included in", object: "Includes" },
  depicts: { subject: "Depicts", object: "Depicted by" },
  "addresses-domain": { subject: "Addresses", object: "Addressed by" },
  "interprets-concept": { subject: "Interprets", object: "Interpreted by" },
  "advances-end": { subject: "Advances", object: "Advanced by" },
  "rejects-end": { subject: "Rejects", object: "Rejected by" },
  "internally-contests-end": {
    subject: "Disagrees about",
    object: "Internally disputed by",
  },
  "advocates-means": { subject: "Proposes", object: "Proposed by" },
  "permits-means": { subject: "Allows", object: "Allowed by" },
  "rejects-means": { subject: "Rejects", object: "Rejected by" },
  "internally-contests-means": {
    subject: "Disagrees about",
    object: "Internally disputed by",
  },
  "specified-by": { subject: "Specified by", object: "Specifies" },
  "applies-to-case": {
    subject: "Applies this idea",
    object: "Applied in this case",
  },
  "contested-in-case": {
    subject: "Contests this idea",
    object: "Contested in this case",
  },
  "self-identified-with": {
    subject: "Self-identifies with",
    object: "Claimed as a self-description by",
  },
  "influenced-by": { subject: "Influenced by", object: "Influenced" },
  "partially-instantiated": {
    subject: "Partly puts into practice",
    object: "Partly put into practice by",
  },
  "hybridized-with": { subject: "Combines with", object: "Combined into" },
  "departed-from": { subject: "Departs from", object: "Departed from by" },
  "used-means": { subject: "Uses", object: "Used by" },
  "responds-to": { subject: "Responds to", object: "Addressed by" },
  "evaluates-response-to": {
    subject: "Evaluates responses to",
    object: "Evaluated with",
  },
  "assessed-by": { subject: "Assessed with", object: "Used to assess" },
  "placed-on": { subject: "Compared on", object: "Includes placement for" },
  cites: { subject: "Cites", object: "Cited by" },
} satisfies Record<
  DomainRelationship["predicate"],
  Record<RelationshipPerspective, string>
>;

const citationLabels = {
  supports: { subject: "Cites as support", object: "Supports" },
  challenges: { subject: "Cites as a challenge", object: "Challenges" },
  qualifies: { subject: "Cites as a qualification", object: "Qualifies" },
  context: { subject: "Cites for context", object: "Provides context for" },
} as const;

export function publicRelationshipLabel(
  relationship: DomainRelationship,
  perspective: RelationshipPerspective,
) {
  return relationship.predicate === "cites"
    ? citationLabels[relationship.role][perspective]
    : publicRelationshipLabels[relationship.predicate][perspective];
}
