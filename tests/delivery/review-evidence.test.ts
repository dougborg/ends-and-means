import { describe, expect, it } from "vitest";
import { reviewEvidenceForHead } from "../../scripts/delivery-state.ts";

const head = "a".repeat(40);
const stale = "b".repeat(40);
const trusted = (body: string, authorAssociation = "OWNER") => ({
  body,
  authorAssociation,
});

describe("privacy-safe exact-head review evidence", () => {
  it.each(["OWNER", "MEMBER", "COLLABORATOR"])(
    "accepts an adversarial attestation from a GitHub %s",
    (authorAssociation) => {
      expect(
        reviewEvidenceForHead(
          head,
          [],
          [
            trusted(
              `Independent adversarial review: APPROVED\nHead: ${head}`,
              authorAssociation,
            ),
          ],
        ),
      ).toEqual({ copilot: "missing", adversarial: true });
    },
  );

  it("accepts an explicit exact-head Copilot-unavailable attestation", () => {
    expect(
      reviewEvidenceForHead(
        head,
        [],
        [trusted(`Copilot review: UNAVAILABLE\nHead: ${head}`)],
      ),
    ).toEqual({ copilot: "unavailable", adversarial: false });
  });

  it("gives an actual exact-head Copilot review precedence over an unavailable marker", () => {
    expect(
      reviewEvidenceForHead(
        head,
        [
          {
            author: { login: "copilot-pull-request-reviewer" },
            commit: { oid: head },
          },
        ],
        [trusted(`Copilot review: UNAVAILABLE\nHead: ${head}`)],
      ).copilot,
    ).toBe("reviewed");
  });
});

describe("trusted Copilot review identity", () => {
  it.each([
    "copilot",
    "copilot-reviewer",
    "trusted-copilot-pull-request-reviewer",
    "copilot-pull-request-reviewer-spoof",
    "Copilot-Pull-Request-Reviewer",
  ])("rejects untrusted Copilot-like login %s", (login) => {
    expect(
      reviewEvidenceForHead(
        head,
        [{ author: { login }, commit: { oid: head } }],
        [],
      ).copilot,
    ).toBe("missing");
  });

  it("accepts GitHub's bot-suffixed normalization of the trusted reviewer", () => {
    expect(
      reviewEvidenceForHead(
        head,
        [
          {
            author: { login: "copilot-pull-request-reviewer[bot]" },
            commit: { oid: head },
          },
        ],
        [],
      ).copilot,
    ).toBe("reviewed");
  });
});

describe("rejected review evidence", () => {
  it.each(["NONE", "CONTRIBUTOR", "FIRST_TIMER", "FIRST_TIME_CONTRIBUTOR"])(
    "rejects markers from GitHub association %s",
    (authorAssociation) => {
      expect(
        reviewEvidenceForHead(
          head,
          [],
          [
            trusted(
              `Independent adversarial review: APPROVED\nHead: ${head}`,
              authorAssociation,
            ),
            trusted(
              `Copilot review: UNAVAILABLE\nHead: ${head}`,
              authorAssociation,
            ),
          ],
        ),
      ).toEqual({ copilot: "missing", adversarial: false });
    },
  );

  it.each([
    `Independent adversarial review: APPROVED\nHead: ${stale}`,
    "Independent adversarial review: APPROVED\nHead: short",
    `Independent adversarial review: APPROVED\nHead: ${head}\nExtra`,
    `Independent adversarial review: APPROVED\nReviewer: internal-identity\nHead: ${head}`,
  ])("rejects malformed or stale adversarial marker %s", (body) => {
    expect(reviewEvidenceForHead(head, [], [trusted(body)]).adversarial).toBe(
      false,
    );
  });

  it.each([
    `Copilot review: UNAVAILABLE\nHead: ${stale}`,
    "Copilot review: UNAVAILABLE\nHead: short",
    `Copilot review: UNAVAILABLE\nHead: ${head}\nOperational detail`,
    `Copilot review: unavailable\nHead: ${head}`,
  ])("rejects malformed or stale unavailable marker %s", (body) => {
    expect(reviewEvidenceForHead(head, [], [trusted(body)]).copilot).toBe(
      "missing",
    );
  });

  it("invalidates a Copilot review after the head changes", () => {
    expect(
      reviewEvidenceForHead(
        head,
        [
          {
            author: { login: "copilot-pull-request-reviewer" },
            commit: { oid: stale },
          },
        ],
        [],
      ).copilot,
    ).toBe("missing");
  });
});
