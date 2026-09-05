import {
  auditContent,
  formatContentAttentionReport,
} from "../src/lib/domain/audit";
import { canonicalGraph } from "../src/lib/domain/canonical";

console.log(formatContentAttentionReport(auditContent(canonicalGraph)));
