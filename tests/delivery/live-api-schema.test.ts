import { describe, expect, it } from "vitest";
import {
  compareSchema,
  mainRefSchema,
} from "../../scripts/delivery-api-schema.ts";

describe("live branch evidence schemas", () => {
  it.each(["", "same-malformed-value", "a".repeat(39), "g".repeat(40)])(
    "rejects malformed compare and main-ref SHA %s",
    (sha) => {
      expect(
        compareSchema.safeParse({
          merge_base_commit: { sha },
          commits: [],
        }).success,
      ).toBe(false);
      expect(mainRefSchema.safeParse({ object: { sha } }).success).toBe(false);
    },
  );

  it("accepts 40-character lowercase hexadecimal SHAs", () => {
    const sha = "a".repeat(40);
    expect(
      compareSchema.safeParse({ merge_base_commit: { sha }, commits: [] })
        .success,
    ).toBe(true);
    expect(mainRefSchema.safeParse({ object: { sha } }).success).toBe(true);
  });
});
