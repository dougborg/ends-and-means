import type { EntityRef } from "./domain";
import { canonicalGraph } from "./domain/canonical";
import type { CompiledDomainGraph } from "./domain/graph";

export function hrefForEntity(
  ref: EntityRef,
  graph: CompiledDomainGraph = canonicalGraph,
): string | undefined {
  const entity = graph.indexes.entitiesById[ref.id];
  if (
    !entity ||
    entity.kind !== ref.kind ||
    !["reviewed", "published"].includes(entity.publicationStatus)
  )
    return undefined;
  if (ref.kind === "approach") return `/explore/${ref.id}/`;
  if (ref.kind === "case") return `/cases/${ref.id}/`;
  if (ref.kind === "concept") return `/concepts/${ref.id}/`;
  if (ref.kind === "challenge") return `/challenges/${ref.id}/`;
  if (ref.kind === "source") return `/sources/${ref.id}/`;
  if (ref.kind === "case-episode") {
    return entity.kind === "case-episode"
      ? `/cases/${entity.caseId}/#${entity.id}`
      : undefined;
  }
  return undefined;
}
