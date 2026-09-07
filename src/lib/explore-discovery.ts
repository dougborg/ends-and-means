import type {
  SubjectGuide,
  SubjectGuideSearchQuery,
  SubjectGuideSubjectKind,
} from "./domain";
import {
  glyphForEntityKind,
  type GlyphName,
} from "./presentation-glyphs";

export interface ExploreSubjectMarker {
  label: string;
  glyph?: GlyphName;
}

const subjectMarkerLabels = {
  concept: "Idea or tradition",
  collection: "Subject collection",
  approach: "Institutional approach",
  end: "Proposed aim",
  means: "Method or instrument",
  challenge: "Problem or tension",
  criterion: "Evaluation criterion",
  place: "Place",
  case: "Bounded case",
  "case-episode": "Bounded case episode",
  event: "Historical event",
  transition: "Historical transition",
  "comparison-dimension": "Comparison dimension",
  person: "Person",
  organization: "Organization",
  depiction: "Depiction",
} as const satisfies Record<SubjectGuideSubjectKind, string>;

export function markerForExploreSubject(
  kind: SubjectGuideSubjectKind,
): ExploreSubjectMarker {
  const glyph = glyphForEntityKind(kind);
  return glyph
    ? { label: subjectMarkerLabels[kind], glyph }
    : { label: subjectMarkerLabels[kind] };
}

export interface ExploreAlias extends SubjectGuideSearchQuery {
  guideId: string;
}

export interface ExploreGuideEntry {
  guide: SubjectGuide;
  aliases: ExploreAlias[];
  searchText: string;
  marker: ExploreSubjectMarker;
}

export type ExploreSearchEntry = Pick<
  ExploreGuideEntry,
  "aliases" | "searchText"
> & {
  guide: Pick<SubjectGuide, "id">;
};

const liveStatuses = new Set(["reviewed", "published"]);

export function normalizeExploreQuery(value: string) {
  return value
    .normalize("NFKD")
    .replaceAll(/\p{M}/gu, "")
    .toLocaleLowerCase("en")
    .replaceAll(/[^a-z0-9]+/g, " ")
    .trim()
    .replaceAll(/\s+/g, " ");
}

export function ownedExploreAliases(guides: readonly SubjectGuide[]) {
  return guides.flatMap((guide) =>
    guide.searchQueries.map((entry) => ({ ...entry, guideId: guide.id })),
  );
}

export function auditExploreAliases(
  guideRecords: readonly SubjectGuide[],
  aliases: readonly ExploreAlias[],
) {
  const findings: string[] = [];
  const guides = new Map(guideRecords.map((guide) => [guide.id, guide]));
  const owners = new Map<string, ExploreAlias[]>();

  for (const alias of aliases) {
    const query = normalizeExploreQuery(alias.query);
    const guide = guides.get(alias.guideId);
    findings.push(...auditAliasOwner(alias, guide));
    if (!guide) continue;
    const owned = guide.searchQueries.find(
      (entry) => normalizeExploreQuery(entry.query) === query,
    );
    if (!aliasMatchesOwnedEntry(alias, owned)) {
      findings.push(
        `${alias.guideId}: discovery alias ${JSON.stringify(alias.query)} does not exactly match its Subject Guide entry`,
      );
    }
    const existing = owners.get(query);
    if (existing) existing.push(alias);
    else owners.set(query, [alias]);
  }

  findings.push(...auditAliasCollisions(owners));

  return findings.sort();
}

function auditAliasCollisions(owners: ReadonlyMap<string, ExploreAlias[]>) {
  const findings: string[] = [];
  for (const [query, entries] of owners) {
    const distinctOwners = new Set(entries.map(({ guideId }) => guideId));
    if (distinctOwners.size < 2) continue;
    for (const entry of entries) {
      if (!entry.disambiguation?.trim()) {
        findings.push(
          `${entry.guideId}: colliding discovery alias ${JSON.stringify(query)} requires disambiguation`,
        );
      }
    }
  }
  return findings;
}

function aliasMatchesOwnedEntry(
  alias: ExploreAlias,
  owned: SubjectGuideSearchQuery | undefined,
) {
  return (
    owned !== undefined &&
    owned.query === alias.query &&
    owned.disambiguation === alias.disambiguation &&
    owned.resultStatus === alias.resultStatus
  );
}

function auditAliasOwner(alias: ExploreAlias, guide: SubjectGuide | undefined) {
  if (!guide) {
    return [
      `${alias.guideId}: discovery alias ${JSON.stringify(alias.query)} has no Subject Guide owner`,
    ];
  }
  if (!liveStatuses.has(guide.publicationStatus)) {
    return [
      `${alias.guideId}: discovery alias ${JSON.stringify(alias.query)} targets a non-public Subject Guide`,
    ];
  }
  return [];
}

export function buildExploreDirectory(guides: readonly SubjectGuide[]) {
  const liveGuides = guides.filter(({ publicationStatus }) =>
    liveStatuses.has(publicationStatus),
  );
  const discoveryAliases = ownedExploreAliases(liveGuides);
  const findings = auditExploreAliases(guides, discoveryAliases);
  if (findings.length > 0) {
    throw new Error(
      `Invalid Explore discovery aliases:\n${findings.join("\n")}`,
    );
  }

  return liveGuides
    .map((guide): ExploreGuideEntry => {
      const ownedAliases = discoveryAliases.filter(
        ({ guideId }) => guideId === guide.id,
      );
      return {
        guide,
        aliases: ownedAliases,
        marker: markerForExploreSubject(guide.primarySubject.kind),
        searchText: normalizeExploreQuery(
          [
            guide.label,
            guide.description,
            ...ownedAliases.map(({ query }) => query),
          ].join(" "),
        ),
      };
    })
    .sort((left, right) => compareGuideEntries(left, right));
}

function compareCodeUnits(left: string, right: string) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function compareGuideEntries(
  left: ExploreGuideEntry,
  right: ExploreGuideEntry,
) {
  return (
    compareCodeUnits(
      normalizeExploreQuery(left.guide.label),
      normalizeExploreQuery(right.guide.label),
    ) || compareCodeUnits(left.guide.id, right.guide.id)
  );
}

export function matchExploreDirectory(
  directory: readonly ExploreSearchEntry[],
  value: string,
) {
  const query = normalizeExploreQuery(value);
  if (!query) return [...directory];
  const exact = directory.filter(({ aliases }) =>
    aliases.some((alias) => normalizeExploreQuery(alias.query) === query),
  );
  if (exact.length > 0) return exact;
  const words = query.split(" ");
  return directory.filter(({ searchText }) => {
    const indexedWords = new Set(searchText.split(" "));
    return words.every((word) => indexedWords.has(word));
  });
}
