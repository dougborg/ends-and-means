export interface PublicRoute {
  readonly href: string;
  readonly label: string;
  readonly matchingPrefixes: readonly string[];
  readonly level: "primary" | "trust";
}

export const publicRoutes = [
  {
    href: "/explore/",
    label: "Explore",
    matchingPrefixes: ["/explore/", "/guides/", "/concepts/"],
    level: "primary",
  },
  { href: "/cases/", label: "Cases", matchingPrefixes: ["/cases/"], level: "primary" },
  { href: "/compare/", label: "Compare", matchingPrefixes: ["/compare/"], level: "primary" },
  {
    href: "/challenges/",
    label: "Questions",
    matchingPrefixes: ["/challenges/", "/research/"],
    level: "primary",
  },
  {
    href: "/reading/",
    label: "Sources",
    matchingPrefixes: ["/reading/", "/sources/"],
    level: "trust",
  },
  { href: "/framework/", label: "Method", matchingPrefixes: ["/framework/"], level: "trust" },
  {
    href: "/principles/",
    label: "Principles",
    matchingPrefixes: ["/principles/"],
    level: "trust",
  },
  {
    href: "/governance/",
    label: "Governance",
    matchingPrefixes: ["/governance/"],
    level: "trust",
  },
] as const satisfies readonly PublicRoute[];

export const primaryRoutes = publicRoutes.filter(({ level }) => level === "primary");

export const homeRoute = {
  href: "/",
  label: "Home",
  matchingPrefixes: ["/"],
  level: "primary",
} as const satisfies PublicRoute;

export function isCurrentPublicRoute(
  currentPath: string,
  route: PublicRoute,
): boolean {
  if (route.href === "/") return currentPath === "/";
  return route.matchingPrefixes.some((prefix) =>
    currentPath.startsWith(prefix),
  );
}
