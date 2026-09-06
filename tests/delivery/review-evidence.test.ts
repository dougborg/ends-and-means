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
