import type { SubjectGuide, SubjectGuideSearchQuery } from "./domain";

export interface ExploreAlias extends SubjectGuideSearchQuery {
  guideId: string;
}

export interface ExploreGuideEntry {
  guide: SubjectGuide;
  aliases: ExploreAlias[];
  searchText: string;
}

export type ExploreSearchEntry = Pick<ExploreGuideEntry, "aliases" | "searchText"> & {
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
    const existing = owners.get(query);
    if (existing) existing.push(alias);
    else owners.set(query, [alias]);
  }

  for (const [query, entries] of owners) {
    const distinctOwners = new Set(entries.map(({ guideId }) => guideId));
    if (distinctOwners.size < 2) continue;
    for (const entry of entries) {
      if (!entry.disambiguation?.trim()) {
        findings.push(`${entry.guideId}: colliding discovery alias ${JSON.stringify(query)} requires disambiguation`);
      }
    }
  }

  return findings.sort();
}

function auditAliasOwner(alias: ExploreAlias, guide: SubjectGuide | undefined) {
  if (!guide) {
    return [`${alias.guideId}: discovery alias ${JSON.stringify(alias.query)} has no Subject Guide owner`];
  }
  if (!liveStatuses.has(guide.publicationStatus)) {
    return [`${alias.guideId}: discovery alias ${JSON.stringify(alias.query)} targets a non-public Subject Guide`];
  }
  return [];
}

export function buildExploreDirectory(
  guides: readonly SubjectGuide[],
  aliases?: readonly ExploreAlias[],
) {
  const liveGuides = guides.filter(({ publicationStatus }) =>
    liveStatuses.has(publicationStatus),
  );
  const discoveryAliases = aliases ?? ownedExploreAliases(liveGuides);
  const findings = auditExploreAliases(guides, discoveryAliases);
  if (findings.length > 0) {
    throw new Error(`Invalid Explore discovery aliases:\n${findings.join("\n")}`);
  }

  return liveGuides
    .map((guide): ExploreGuideEntry => {
      const ownedAliases = discoveryAliases.filter(({ guideId }) => guideId === guide.id);
      return {
        guide,
        aliases: ownedAliases,
        searchText: normalizeExploreQuery([
          guide.label,
          guide.description,
          ...ownedAliases.map(({ query }) => query),
        ].join(" ")),
      };
    })
    .sort((left, right) => left.guide.label.localeCompare(right.guide.label));
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
  return directory.filter(({ searchText }) =>
    words.every((word) => searchText.includes(word)),
  );
}
