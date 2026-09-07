import { describe, expect, it } from "vitest";
import {
  assertManagedBrowserServer,
  browserTestPort,
} from "../../scripts/browser-test-harness";

describe("browser test server isolation", () => {
  it("gives separate worktrees separate default ports", () => {
    expect(browserTestPort("/tmp/ends-and-means-main")).not.toBe(
      browserTestPort("/tmp/ends-and-means-feature"),
    );
  });

  it("accepts a valid explicit hosted runner port", () => {
    expect(browserTestPort("/tmp/ignored", "4321")).toBe(4321);
  });

  it.each(["", "1023", "65536", "not-a-port"])(
    "rejects invalid explicit port %j",
    (port) => {
      expect(() => browserTestPort("/tmp/ignored", port)).toThrow(
        "PLAYWRIGHT_TEST_PORT",
      );
    },
  );

  it("rejects the contamination-prone server mutation", () => {
    expect(() =>
      assertManagedBrowserServer({ reuseExistingServer: true }),
    ).toThrow("another worktree's build");
  });
});
