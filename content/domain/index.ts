import type { AuthoringDocument } from "../../src/lib/domain";
import { analysisDocuments } from "./analysis/swedish-wage-earner-funds";
import { rehnMeidnerApproachDocuments } from "./approaches/rehn-meidner-model";
import { approachDocuments } from "./approaches/swedish-wage-earner-funds";
import { rehnMeidnerEvidenceDocuments } from "./evidence/rehn-meidner-model";
import { socialDemocracyEvidenceDocuments } from "./evidence/social-democracy";
import { evidenceDocuments } from "./evidence/swedish-wage-earner-funds";
import { foundationalConceptDossierDocuments } from "./presentation/foundational-concept-dossiers";
import { dossierDocuments } from "./presentation/swedish-dossiers";
import { rehnMeidnerRelationshipDocuments } from "./relationships/rehn-meidner-model";
import { socialDemocracyRelationshipDocuments } from "./relationships/social-democracy";
import { relationshipDocuments } from "./relationships/swedish-wage-earner-funds";
import { vocabularyDocuments } from "./vocabulary/swedish-wage-earner-funds";

export const canonicalDocuments: AuthoringDocument[] = [
  ...vocabularyDocuments,
  ...approachDocuments,
  ...rehnMeidnerApproachDocuments,
  ...evidenceDocuments,
  ...rehnMeidnerEvidenceDocuments,
  ...socialDemocracyEvidenceDocuments,
  ...dossierDocuments,
  ...foundationalConceptDossierDocuments,
  ...analysisDocuments,
  ...relationshipDocuments,
  ...rehnMeidnerRelationshipDocuments,
  ...socialDemocracyRelationshipDocuments,
];
