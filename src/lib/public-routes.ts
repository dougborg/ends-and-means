import type { EntityRef } from "./domain";
import { canonicalGraph } from "./domain/canonical";
import type { CompiledDomainGraph } from "./domain/graph";

function isLive(publicationStatus: string) {
  return ["reviewed", "published"].includes(publicationStatus);
}

export function hrefForEntity(
  ref: EntityRef,
  graph: CompiledDomainGraph = canonicalGraph,
): string | undefined {
  const entity = graph.indexes.entitiesById[ref.id];
  if (!entity || entity.kind !== ref.kind || !isLive(entity.publicationStatus))
    return undefined;
  if (ref.kind === "approach") return `/explore/${ref.id}/`;
  if (ref.kind === "case") return `/cases/${ref.id}/`;
  if (ref.kind === "concept") return `/concepts/${ref.id}/`;
  if (ref.kind === "challenge") return `/challenges/${ref.id}/`;
  if (ref.kind === "source") return `/sources/${ref.id}/`;
  if (ref.kind === "case-episode") {
    if (entity.kind !== "case-episode") return undefined;
    const parent = graph.indexes.entitiesById[entity.caseId];
    return parent?.kind === "case" && isLive(parent.publicationStatus)
      ? `/cases/${parent.id}/#${entity.id}`
      : undefined;
  }
  return undefined;
}
