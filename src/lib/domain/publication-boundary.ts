const forbiddenPublicationReferences = [
  /^(?:research|(?:\.\.\/)+research)(?:\/|$)/iu,
  /archive\/legacy-research(?:\/|$)/iu,
  /content\/framework(?:\/|$)/iu,
  /(?:lib|routes?)\/(?:framework|prototype|content)(?:\/|$)/iu,
] as const;

const discoveryOnlyPath = /(?:^|\/)(?:archive|legacy|drafts?)(?:\/|$)/iu;

export function findForbiddenPublicationReference(value: string) {
  for (const pattern of forbiddenPublicationReferences) {
    const match = value.match(pattern);
    if (match) return match[0];
  }
  return undefined;
}

export function hasDiscoveryOnlyPath(value: string) {
  return discoveryOnlyPath.test(value);
}
