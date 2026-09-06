import type { EntityRef } from "./domain";
import { entityById } from "./domain/canonical";

export function hrefForEntity(ref: EntityRef): string | undefined {
  if (ref.kind === "approach") return `/explore/${ref.id}/`;
  if (ref.kind === "case") return `/cases/${ref.id}/`;
  if (ref.kind === "concept") return `/concepts/${ref.id}/`;
  if (ref.kind === "challenge") return `/challenges/${ref.id}/`;
  if (ref.kind === "source") return `/sources/${ref.id}/`;
  if (ref.kind === "case-episode") {
    const episode = entityById(ref.id);
    return episode?.kind === "case-episode"
      ? `/cases/${episode.caseId}/#${episode.id}`
      : undefined;
  }
  return undefined;
}
