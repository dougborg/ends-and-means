import { describe, expect, it } from "vitest";
import {
  homeRoute,
  isCurrentPublicRoute,
  primaryRoutes,
  publicRoutes,
} from "../../src/lib/public-navigation";

describe("public navigation", () => {
  it("publishes the agreed vocabulary, order, and destinations", () => {
    expect(publicRoutes.map(({ label, href }) => ({ label, href }))).toEqual([
      { label: "Explore", href: "/explore/" },
      { label: "Cases", href: "/cases/" },
      { label: "Compare", href: "/compare/" },
      { label: "Questions", href: "/challenges/" },
      { label: "Sources", href: "/reading/" },
      { label: "Method", href: "/framework/" },
    ]);
    expect(new Set(publicRoutes.map(({ href }) => href)).size).toBe(
      publicRoutes.length,
    );
    expect(primaryRoutes.map(({ label }) => label)).toEqual([
      "Explore",
      "Cases",
      "Compare",
      "Questions",
    ]);
  });

  it("maps directories and descendant records to their public section", () => {
    const currentLabel = (pathname: string) =>
      publicRoutes.find((route) => isCurrentPublicRoute(pathname, route))
        ?.label;

    expect(currentLabel("/explore/")).toBe("Explore");
    expect(currentLabel("/explore/swedish-rehn-meidner-model/")).toBe(
      "Explore",
    );
    expect(currentLabel("/guides/economic-democracy/")).toBe("Explore");
    expect(currentLabel("/concepts/economic-democracy/")).toBe("Explore");
    expect(currentLabel("/sources/erixon-rehn-meidner-model-source/")).toBe(
      "Sources",
    );
    expect(currentLabel("/reading/")).toBe("Sources");
    expect(currentLabel("/research/")).toBeUndefined();
  });

  it("marks Home only at the site root", () => {
    expect(isCurrentPublicRoute("/", homeRoute)).toBe(true);
    expect(isCurrentPublicRoute("/explore/", homeRoute)).toBe(false);
  });
});
