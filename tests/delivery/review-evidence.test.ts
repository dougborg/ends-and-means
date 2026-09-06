import { describe, expect, it } from "vitest";
import { reviewEvidenceForHead } from "../../scripts/delivery-state.ts";

const head = "a".repeat(40);
const stale = "b".repeat(40);

describe("review evidence", () => {
  it("requires Copilot and an independently attributable adversarial approval on the exact head", () => {
    expect(
      reviewEvidenceForHead(
        head,
        "/root/implementation_133",
        [
          {
            author: { login: "copilot-pull-request-reviewer" },
            commit: { oid: head },
          },
        ],
        [
          {
            body: `Independent adversarial review: APPROVED\nReviewer: /root/adversarial_133\nHead: ${head}`,
          },
        ],
      ),
    ).toEqual({ copilot: true, adversarial: true });
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
        "/root/implementation_133",
        [{ author: { login }, commit: { oid: head } }],
        [],
      ).copilot,
    ).toBe(false);
  });

  it("accepts GitHub's bot-suffixed normalization of the trusted reviewer", () => {
    expect(
      reviewEvidenceForHead(
        head,
        "/root/implementation_133",
        [
          {
            author: { login: "copilot-pull-request-reviewer[bot]" },
            commit: { oid: head },
          },
        ],
        [],
      ).copilot,
    ).toBe(true);
  });
});

describe("rejected review evidence", () => {
  it("rejects stale reviews, a template checkbox, and self-attributed evidence", () => {
    expect(
      reviewEvidenceForHead(
        head,
        "/root/adversarial_133",
        [
          {
            author: { login: "copilot-pull-request-reviewer" },
            commit: { oid: stale },
          },
        ],
        [
          {
            body: "- [x] An independent adversarial review covered the material risks.",
          },
          {
            body: `Independent adversarial review: APPROVED\nReviewer: /root/adversarial_133\nHead: ${head}`,
          },
          {
            body: `Independent adversarial review: APPROVED\nReviewer: /root/adversarial_133\nHead: ${stale}`,
          },
          {
            body: `Independent adversarial review: APPROVED\nReviewer: /root/other_reviewer\nHead: ${head}\nAdditional unstructured text.`,
          },
        ],
      ),
    ).toEqual({ copilot: false, adversarial: false });
  });

  it("rejects review evidence when implementation ownership is missing", () => {
    expect(
      reviewEvidenceForHead(
        head,
        undefined,
        [
          {
            author: { login: "copilot-pull-request-reviewer" },
            commit: { oid: head },
          },
        ],
        [
          {
            body: `Independent adversarial review: APPROVED\nReviewer: /root/adversarial_133\nHead: ${head}`,
          },
        ],
      ).adversarial,
    ).toBe(false);
  });

  it("rejects review evidence when implementation ownership is not a documented agent path", () => {
    expect(
      reviewEvidenceForHead(
        head,
        "implementation_133",
        [
          {
            author: { login: "copilot-pull-request-reviewer" },
            commit: { oid: head },
          },
        ],
        [
          {
            body: `Independent adversarial review: APPROVED\nReviewer: /root/adversarial_133\nHead: ${head}`,
          },
        ],
      ).adversarial,
    ).toBe(false);
  });
});

describe("canonical review agent paths", () => {
  it.each([
    "/root//",
    "/root/agent/",
    "/root/agent//reviewer",
    "/root/agent-name",
    "/root/-",
    "/root/Agent",
  ])("rejects noncanonical implementation owner %s", (owner) => {
    expect(
      reviewEvidenceForHead(
        head,
        owner,
        [],
        [
          {
            body: `Independent adversarial review: APPROVED\nReviewer: /root/adversarial_133\nHead: ${head}`,
          },
        ],
      ).adversarial,
    ).toBe(false);
  });

  it.each([
    "/root//",
    "/root/agent/",
    "/root/agent//reviewer",
    "/root/agent-name",
    "/root/-",
    "/root/Agent",
  ])("rejects noncanonical reviewer %s", (reviewer) => {
    expect(
      reviewEvidenceForHead(
        head,
        "/root/agent",
        [],
        [
          {
            body: `Independent adversarial review: APPROVED\nReviewer: ${reviewer}\nHead: ${head}`,
          },
        ],
      ).adversarial,
    ).toBe(false);
  });

  it("does not permit case variation to evade same-owner rejection", () => {
    expect(
      reviewEvidenceForHead(
        head,
        "/root/agent",
        [],
        [
          {
            body: `Independent adversarial review: APPROVED\nReviewer: /root/Agent\nHead: ${head}`,
          },
        ],
      ).adversarial,
    ).toBe(false);
  });
});
