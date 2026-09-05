export interface PublicRoute {
  readonly href: string;
  readonly label: string;
  readonly matchingPrefixes: readonly string[];
}

export const publicRoutes = [
  {
    href: "/explore/",
    label: "Approaches",
    matchingPrefixes: ["/explore/", "/concepts/"],
  },
  { href: "/cases/", label: "Cases", matchingPrefixes: ["/cases/"] },
  {
    href: "/challenges/",
    label: "Questions",
    matchingPrefixes: ["/challenges/"],
  },
  { href: "/compare/", label: "Compare", matchingPrefixes: ["/compare/"] },
  {
    href: "/reading/",
    label: "Sources",
    matchingPrefixes: ["/reading/", "/sources/"],
  },
  { href: "/framework/", label: "Method", matchingPrefixes: ["/framework/"] },
] as const satisfies readonly PublicRoute[];

export const homeRoute = {
  href: "/",
  label: "Home",
  matchingPrefixes: ["/"],
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
