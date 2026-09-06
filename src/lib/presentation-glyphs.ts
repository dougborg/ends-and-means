import {
  ArrowRightLeft,
  BookOpenText,
  CircleQuestionMark,
  GitCompareArrows,
  Images,
  Library,
  MapPinned,
  Network,
  Split,
  Tags,
  Target,
} from "@lucide/astro";
import type { AstroComponent } from "@lucide/astro";
import type {
  EntityKind,
  SubjectGuideSectionRole,
} from "./domain";

export type ReaderGlyphRole =
  | "idea-definition"
  | "proposed-aim"
  | "institution-mechanism"
  | "bounded-practice"
  | "question-disagreement"
  | "evidence-source"
  | "change-over-time";

export interface GlyphDefinition {
  component: AstroComponent;
  /** Why this shape helps a reader scan; never a canonical classification. */
  purpose: string;
  /** Text that remains authoritative when the glyph is absent. */
  fallback: string;
}

export const readerGlyphs = {
  "idea-definition": {
    component: BookOpenText,
    purpose: "Marks a definition or a place to begin reading about an idea.",
    fallback: "Definition",
  },
  "proposed-aim": {
    component: Target,
    purpose: "Marks a stated aim or problem a proposal is meant to address.",
    fallback: "Aim",
  },
  "institution-mechanism": {
    component: Network,
    purpose: "Marks an institutional arrangement or mechanism connecting actors.",
    fallback: "Institution or mechanism",
  },
  "bounded-practice": {
    component: MapPinned,
    purpose: "Marks evidence bounded to a particular place and period.",
    fallback: "Bounded case",
  },
  "question-disagreement": {
    component: CircleQuestionMark,
    purpose: "Marks an unresolved question, disagreement, or evidentiary limit.",
    fallback: "Question or disagreement",
  },
  "evidence-source": {
    component: Library,
    purpose: "Marks inspectable claims, evidence, or source records.",
    fallback: "Evidence or source",
  },
  "change-over-time": {
    component: ArrowRightLeft,
    purpose: "Marks a material change between arrangements over time.",
    fallback: "Change over time",
  },
} as const satisfies Record<ReaderGlyphRole, GlyphDefinition>;

export type GlyphName = ReaderGlyphRole | "comparison" | "depiction" | "meaning" | "variant";

export const glyphs = {
  ...readerGlyphs,
  comparison: {
    component: GitCompareArrows,
    purpose: "Marks a comparison whose dimensions are explained in adjacent text.",
    fallback: "Comparison",
  },
  depiction: {
    component: Images,
    purpose: "Marks a depiction rather than evidence that its portrayal is accurate.",
    fallback: "Depiction",
  },
  meaning: {
    component: Tags,
    purpose: "Marks competing meanings or the boundary of a term.",
    fallback: "Meaning and boundary",
  },
  variant: {
    component: Split,
    purpose: "Marks variants or a point where interpretations divide.",
    fallback: "Variant or dispute",
  },
} as const satisfies Record<GlyphName, GlyphDefinition>;

const sectionGlyphs = {
  "short-answer": "idea-definition",
  "meanings-and-boundaries": "meaning",
  "purposes-and-diagnoses": "proposed-aim",
  "institutions-and-mechanisms": "institution-mechanism",
  "bounded-practice": "bounded-practice",
  "variants-and-disputes": "variant",
  "comparisons-and-next-steps": "comparison",
  depictions: "depiction",
  "open-questions": "question-disagreement",
} as const satisfies Record<SubjectGuideSectionRole, GlyphName>;

const entityKindGlyphs = {
  concept: "idea-definition",
  collection: "idea-definition",
  approach: "institution-mechanism",
  end: "proposed-aim",
  means: "institution-mechanism",
  challenge: "question-disagreement",
  criterion: "question-disagreement",
  case: "bounded-practice",
  "case-episode": "bounded-practice",
  event: "change-over-time",
  transition: "change-over-time",
  source: "evidence-source",
  work: "evidence-source",
  depiction: "depiction",
  "research-obligation": "question-disagreement",
  "comparison-dimension": "comparison",
} as const satisfies Partial<Record<EntityKind, GlyphName>>;

export function glyphForSubjectGuideSection(
  role: SubjectGuideSectionRole,
): GlyphName {
  return sectionGlyphs[role];
}

export function glyphForEntityKind(kind: EntityKind): GlyphName | undefined {
  return entityKindGlyphs[kind as keyof typeof entityKindGlyphs];
}

export function glyphFallback(glyph: GlyphName | undefined): string | undefined {
  return glyph ? glyphs[glyph].fallback : undefined;
}
