import { describe, expect, it } from "vitest";
import { githubComparePath } from "../../scripts/delivery-state.ts";

describe("GitHub compare API paths", () => {
  it("encodes slash-containing refs as individual path components", () => {
    expect(githubComparePath("release/next", "feature/delivery-audit")).toBe(
      "repos/dougborg/ends-and-means/compare/release%2Fnext...feature%2Fdelivery-audit",
    );
  });

  it("encodes reserved characters without encoding the compare delimiter", () => {
    expect(githubComparePath("main?#%", "feature/a b?#%")).toBe(
      "repos/dougborg/ends-and-means/compare/main%3F%23%25...feature%2Fa%20b%3F%23%25",
    );
  });

  it("encodes dots inside each ref while preserving only the constructed delimiter", () => {
    expect(githubComparePath("release..next", "feature/.../audit.v2")).toBe(
      "repos/dougborg/ends-and-means/compare/release%2E%2Enext...feature%2F%2E%2E%2E%2Faudit%2Ev2",
    );
  });
});
