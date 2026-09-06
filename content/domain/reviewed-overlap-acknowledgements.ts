import type { ReviewedOverlapAcknowledgement } from "../../src/lib/domain/reviewed-overlaps";

// Intentionally empty. Existing signals stay open until a reviewer inspects
// the actual cited pages and records a narrowly scoped acknowledgement.
export const reviewedOverlapAcknowledgements =
  [] satisfies ReviewedOverlapAcknowledgement[];
