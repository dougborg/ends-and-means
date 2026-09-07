import { describe, expect, it } from "vitest";
import {
  homeRoute,
  isCurrentPublicRoute,
  primaryRoutes,
  publicRoutes,
} from "../../src/lib/public-navigation";
import { editorialGovernanceContract } from "../../src/lib/editorial-governance";

describe("public navigation", () => {
  it("publishes the agreed vocabulary, order, and destinations", () => {
    expect(publicRoutes.map(({ label, href }) => ({ label, href }))).toEqual([
      { label: "Explore", href: "/explore/" },
      { label: "Cases", href: "/cases/" },
      { label: "Compare", href: "/compare/" },
      { label: "Questions", href: "/challenges/" },
      { label: "Sources", href: "/reading/" },
      { label: "Method", href: "/framework/" },
      { label: "Principles", href: "/principles/" },
      { label: "Governance", href: "/governance/" },
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
    expect(currentLabel("/governance/")).toBe("Governance");
    expect(currentLabel("/principles/")).toBe("Principles");
    expect(currentLabel("/research/")).toBe("Questions");
  });

  it("marks Home only at the site root", () => {
    expect(isCurrentPublicRoute("/", homeRoute)).toBe(true);
    expect(isCurrentPublicRoute("/explore/", homeRoute)).toBe(false);
  });
});

describe("editorial governance semantics", () => {
  it("keeps machine-checkable boundaries distinct", () => {
    expect(editorialGovernanceContract).toEqual({
      editorialIntake: "public-only",
      conflictedDecision: "independent-binding",
      recordBoundary: "site-github-uncontrolled-copies",
    });
  });
});
