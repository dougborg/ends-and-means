import { dossierForSubject } from "./domain/canonical";
import type { CompiledDomainGraph } from "./domain/graph";
import { hrefForEntity } from "./public-routes";

export interface ExploreApproachEntry {
  approach: Extract<
    CompiledDomainGraph["entities"][number],
    { kind: "approach" }
  >;
  href: string;
  standfirst: string;
}

export function buildExploreApproaches(
  graph: CompiledDomainGraph,
): ExploreApproachEntry[] {
  return graph.entities.flatMap((entity) => {
    if (
      entity.kind !== "approach" ||
      !["reviewed", "published"].includes(entity.publicationStatus)
    )
      return [];
    const dossier = dossierForSubject("approach", entity.id, graph);
    const href = hrefForEntity({ kind: "approach", id: entity.id }, graph);
    if (!dossier || !href) return [];
    return [{ approach: entity, href, standfirst: dossier.standfirst }];
  });
}
