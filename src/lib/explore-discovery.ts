import type {
  SubjectGuide,
  SubjectGuideSearchQuery,
  SubjectGuideSubjectKind,
} from "./domain";
import { type GlyphName, glyphForEntityKind } from "./presentation-glyphs";

export interface ExploreSubjectMarker {
  label: string;
  glyph?: GlyphName;
}

export type ExploreDirectoryPlacement =
  | "browse"
  | "case-directory"
  | "context-only";

export type ExploreDirectoryDecision =
  | { placement: "browse"; reason: string }
  | {
      placement: Exclude<ExploreDirectoryPlacement, "browse">;
      reason: string;
      incomingPath: `/${string}/`;
    };

export type ExploreDirectoryCuration = Readonly<
  Record<string, ExploreDirectoryDecision>
>;

/**
 * Presentation-only decisions for every live Subject Guide.
 *
 * This registry neither classifies canonical entities nor infers prominence
 * from an entity kind. A newly published guide must receive an explicit browse,
 * case-directory, or context-only decision before Explore can build.
 */
export const exploreDirectoryCuration: ExploreDirectoryCuration = {
  "guide-anarchism": { placement: "browse", reason: "High-level tradition" },
  "guide-authoritarianism": {
    placement: "browse",
    reason: "High-level form of rule",
  },
  "guide-capitalism": {
    placement: "browse",
    reason: "High-level economic system",
  },
  "guide-central-planning": {
    placement: "case-directory",
    reason: "Current guide is bounded to United States wartime planning",
    incomingPath: "/cases/",
  },
  "guide-colonialism": {
    placement: "browse",
    reason: "High-level system and historical process",
  },
  "guide-communism": { placement: "browse", reason: "High-level tradition" },
  "guide-conservatism": { placement: "browse", reason: "High-level tradition" },
  "guide-democracy": { placement: "browse", reason: "High-level form of rule" },
  "guide-economic-democracy": {
    placement: "browse",
    reason: "Reusable institutional idea with multiple implementations",
  },
  "guide-environmentalism": {
    placement: "browse",
    reason: "High-level family of movements and ideas",
  },
  "guide-fascism": {
    placement: "browse",
    reason: "High-level political tradition and form",
  },
  "guide-feminism": {
    placement: "browse",
    reason: "High-level family of movements and analyses",
  },
  "guide-imperialism": {
    placement: "browse",
    reason: "High-level system and historical process",
  },
  "guide-jinst-postcollective-pastoral-governance": {
    placement: "case-directory",
    reason: "Bounded community and period",
    incomingPath: "/cases/",
  },
  "guide-kahnawake-community-lawmaking": {
    placement: "case-directory",
    reason: "Bounded community and institutional process",
    incomingPath: "/cases/",
  },
  "guide-liberalism": { placement: "browse", reason: "High-level tradition" },
  "guide-market-economy": {
    placement: "browse",
    reason: "High-level economic system",
  },
  "guide-matriliny-property-authority": {
    placement: "context-only",
    reason: "Narrow question rather than a broad subject",
    incomingPath: "/concepts/matriliny/",
  },
  "guide-monarchy": { placement: "browse", reason: "High-level form of rule" },
  "guide-nationalism": {
    placement: "browse",
    reason: "High-level ideology and historical process",
  },
  "guide-oligarchy": {
    placement: "browse",
    reason: "High-level form of power",
  },
  "guide-republic": {
    placement: "browse",
    reason: "High-level constitutional form and tradition",
  },
  "guide-ruwalla-borderland-organization": {
    placement: "case-directory",
    reason: "Bounded organization, place, and period",
    incomingPath: "/cases/",
  },
  "guide-socialism": {
    placement: "browse",
    reason: "High-level family of traditions",
  },
  "guide-tawantinsuyu-imperial-organization": {
    placement: "case-directory",
    reason: "Bounded historical polity",
    incomingPath: "/cases/",
  },
  "guide-theocracy": {
    placement: "browse",
    reason: "High-level contested form of governing authority",
  },
  "guide-totalitarianism": {
    placement: "browse",
    reason: "High-level analytical concept and form of rule",
  },
};

export function auditExploreDirectoryCuration(
  guides: readonly SubjectGuide[],
  curation: ExploreDirectoryCuration = exploreDirectoryCuration,
) {
  const findings: string[] = [];
  const guidesById = new Map(guides.map((guide) => [guide.id, guide]));
  for (const guide of guides) {
    const decision = curation[guide.id];
    if (liveStatuses.has(guide.publicationStatus) && !decision) {
      findings.push(
        `${guide.id}: live Subject Guide has no Explore placement decision`,
      );
    }
    if (
      liveStatuses.has(guide.publicationStatus) &&
      decision?.placement !== "browse" &&
      (!decision?.incomingPath ||
        decision.incomingPath === `/guides/${guide.slug}/`)
    ) {
      findings.push(
        `${guide.id}: non-browse Subject Guide requires a distinct public incoming route`,
      );
    }
  }
  for (const guideId of Object.keys(curation)) {
    const guide = guidesById.get(guideId);
    if (!guide) {
      findings.push(
        `${guideId}: Explore placement decision has no Subject Guide`,
      );
    }
  }
  return findings;
}

export interface NonBrowseGuideDiscovery {
  guide: SubjectGuide;
  decision: Exclude<ExploreDirectoryDecision, { placement: "browse" }>;
}

export function nonBrowseGuidesDiscoveredAt(
  guides: readonly SubjectGuide[],
  incomingPath: string,
  curation: ExploreDirectoryCuration = exploreDirectoryCuration,
): NonBrowseGuideDiscovery[] {
  const findings = auditExploreDirectoryCuration(guides, curation);
  if (findings.length > 0) {
    throw new Error(
      `Invalid Explore directory curation:\n${findings.join("\n")}`,
    );
  }
  return guides
    .filter(({ publicationStatus }) => liveStatuses.has(publicationStatus))
    .flatMap((guide) => {
      const decision = curation[guide.id];
      return decision?.placement !== "browse" &&
        decision?.incomingPath === incomingPath
        ? [{ guide, decision }]
        : [];
    })
    .sort((left, right) =>
      compareCodeUnits(left.guide.label, right.guide.label),
    );
}

const subjectMarkerLabels = {
  concept: "Idea, system, or tradition",
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

export function buildExploreDirectory(
  guides: readonly SubjectGuide[],
  curation: ExploreDirectoryCuration = exploreDirectoryCuration,
) {
  const curationFindings = auditExploreDirectoryCuration(guides, curation);
  if (curationFindings.length > 0) {
    throw new Error(
      `Invalid Explore directory curation:\n${curationFindings.join("\n")}`,
    );
  }
  const liveGuides = guides
    .filter(({ publicationStatus }) => liveStatuses.has(publicationStatus))
    .filter(({ id }) => curation[id]?.placement === "browse");
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
