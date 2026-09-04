import type { AuthoringDocument } from "../../src/lib/domain";
import { analysisDocuments } from "./analysis/swedish-wage-earner-funds";
import { approachDocuments } from "./approaches/swedish-wage-earner-funds";
import { evidenceDocuments } from "./evidence/swedish-wage-earner-funds";
import { relationshipDocuments } from "./relationships/swedish-wage-earner-funds";
import { vocabularyDocuments } from "./vocabulary/swedish-wage-earner-funds";

export const canonicalDocuments: AuthoringDocument[] = [
  ...vocabularyDocuments,
  ...approachDocuments,
  ...evidenceDocuments,
  ...analysisDocuments,
  ...relationshipDocuments,
];
