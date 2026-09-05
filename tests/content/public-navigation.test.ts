import { describe, expect, it } from "vitest";
import {
  homeRoute,
  isCurrentPublicRoute,
  publicRoutes,
} from "../../src/lib/public-navigation";

describe("public navigation", () => {
  it("publishes the agreed vocabulary, order, and destinations", () => {
    expect(publicRoutes.map(({ label, href }) => ({ label, href }))).toEqual([
      { label: "Approaches", href: "/explore/" },
      { label: "Cases", href: "/cases/" },
      { label: "Questions", href: "/challenges/" },
      { label: "Compare", href: "/compare/" },
      { label: "Sources", href: "/reading/" },
      { label: "Method", href: "/framework/" },
    ]);
    expect(new Set(publicRoutes.map(({ href }) => href)).size).toBe(
      publicRoutes.length,
    );
  });

  it("maps directories and descendant records to their public section", () => {
    const currentLabel = (pathname: string) =>
      publicRoutes.find((route) => isCurrentPublicRoute(pathname, route))
        ?.label;

    expect(currentLabel("/explore/")).toBe("Approaches");
    expect(currentLabel("/explore/swedish-rehn-meidner-model/")).toBe(
      "Approaches",
    );
    expect(currentLabel("/concepts/economic-democracy/")).toBe("Approaches");
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
