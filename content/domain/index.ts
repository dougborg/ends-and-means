import type { AuthoringDocument } from "../../src/lib/domain";
import { analysisDocuments } from "./analysis/swedish-wage-earner-funds";
import { rehnMeidnerApproachDocuments } from "./approaches/rehn-meidner-model";
import { approachDocuments } from "./approaches/swedish-wage-earner-funds";
import { rehnMeidnerEvidenceDocuments } from "./evidence/rehn-meidner-model";
import { evidenceDocuments } from "./evidence/swedish-wage-earner-funds";
import { rehnMeidnerRelationshipDocuments } from "./relationships/rehn-meidner-model";
import { relationshipDocuments } from "./relationships/swedish-wage-earner-funds";
import { vocabularyDocuments } from "./vocabulary/swedish-wage-earner-funds";

export const canonicalDocuments: AuthoringDocument[] = [
  ...vocabularyDocuments,
  ...approachDocuments,
  ...rehnMeidnerApproachDocuments,
  ...evidenceDocuments,
  ...rehnMeidnerEvidenceDocuments,
  ...analysisDocuments,
  ...relationshipDocuments,
  ...rehnMeidnerRelationshipDocuments,
];
