import type { AuthoringDocument } from "../../src/lib/domain";
import { analysisDocuments } from "./analysis/swedish-wage-earner-funds";
import { rehnMeidnerApproachDocuments } from "./approaches/rehn-meidner-model";
import { approachDocuments } from "./approaches/swedish-wage-earner-funds";
import { collectiveCapitalFormationEvidenceDocuments } from "./evidence/collective-capital-formation";
import { economicDemocracyEvidenceDocuments } from "./evidence/economic-democracy";
import { kahnawakeCommunityDecisionMakingEvidenceDocuments } from "./evidence/kahnawake-community-decision-making";
import { rehnMeidnerEvidenceDocuments } from "./evidence/rehn-meidner-model";
import { socialDemocracyEvidenceDocuments } from "./evidence/social-democracy";
import { socialOwnershipEvidenceDocuments } from "./evidence/social-ownership";
import { socialismCommunismEvidenceDocuments } from "./evidence/socialism-communism";
import { evidenceDocuments } from "./evidence/swedish-wage-earner-funds";
import { tawantinsuyuEvidenceDocuments } from "./evidence/tawantinsuyu";
import { collectiveCapitalFormationDossierDocuments } from "./presentation/collective-capital-formation-dossier";
import { foundationalConceptDossierDocuments } from "./presentation/foundational-concept-dossiers";
import { kahnawakeCommunityDecisionMakingDossierDocuments } from "./presentation/kahnawake-community-decision-making-dossier";
import { kahnawakeCommunityDecisionMakingGuideDocuments } from "./presentation/kahnawake-community-decision-making-guide";
import { socialismCommunismDossierDocuments } from "./presentation/socialism-communism-dossiers";
import { subjectGuideDocuments } from "./presentation/subject-guides";
import { dossierDocuments } from "./presentation/swedish-dossiers";
import { tawantinsuyuDossierDocuments } from "./presentation/tawantinsuyu-dossier";
import { tawantinsuyuGuideDocuments } from "./presentation/tawantinsuyu-guide";
import { collectiveCapitalFormationRelationshipDocuments } from "./relationships/collective-capital-formation";
import { economicDemocracyRelationshipDocuments } from "./relationships/economic-democracy";
import { kahnawakeCommunityDecisionMakingRelationshipDocuments } from "./relationships/kahnawake-community-decision-making";
import { rehnMeidnerRelationshipDocuments } from "./relationships/rehn-meidner-model";
import { socialDemocracyRelationshipDocuments } from "./relationships/social-democracy";
import { socialOwnershipRelationshipDocuments } from "./relationships/social-ownership";
import { socialismCommunismRelationshipDocuments } from "./relationships/socialism-communism";
import { relationshipDocuments } from "./relationships/swedish-wage-earner-funds";
import { tawantinsuyuRelationshipDocuments } from "./relationships/tawantinsuyu";
import { collectiveCapitalFormationResearchDocuments } from "./research/collective-capital-formation";
import { openResearchObligationDocuments } from "./research/open-obligations";
import { tawantinsuyuResearchDocuments } from "./research/tawantinsuyu";
import { socialismCommunismVocabularyDocuments } from "./vocabulary/socialism-communism";
import { vocabularyDocuments } from "./vocabulary/swedish-wage-earner-funds";

export const canonicalDocuments: AuthoringDocument[] = [
  ...vocabularyDocuments,
  ...socialismCommunismVocabularyDocuments,
  ...approachDocuments,
  ...rehnMeidnerApproachDocuments,
  ...evidenceDocuments,
  ...rehnMeidnerEvidenceDocuments,
  ...economicDemocracyEvidenceDocuments,
  ...collectiveCapitalFormationEvidenceDocuments,
  ...socialOwnershipEvidenceDocuments,
  ...socialDemocracyEvidenceDocuments,
  ...socialismCommunismEvidenceDocuments,
  ...tawantinsuyuEvidenceDocuments,
  ...kahnawakeCommunityDecisionMakingEvidenceDocuments,
  ...dossierDocuments,
  ...foundationalConceptDossierDocuments,
  ...collectiveCapitalFormationDossierDocuments,
  ...socialismCommunismDossierDocuments,
  ...tawantinsuyuDossierDocuments,
  ...tawantinsuyuGuideDocuments,
  ...subjectGuideDocuments,
  ...kahnawakeCommunityDecisionMakingGuideDocuments,
  ...kahnawakeCommunityDecisionMakingDossierDocuments,
  ...openResearchObligationDocuments,
  ...collectiveCapitalFormationResearchDocuments,
  ...tawantinsuyuResearchDocuments,
  ...analysisDocuments,
  ...relationshipDocuments,
  ...rehnMeidnerRelationshipDocuments,
  ...economicDemocracyRelationshipDocuments,
  ...collectiveCapitalFormationRelationshipDocuments,
  ...socialDemocracyRelationshipDocuments,
  ...socialOwnershipRelationshipDocuments,
  ...socialismCommunismRelationshipDocuments,
  ...tawantinsuyuRelationshipDocuments,
  ...kahnawakeCommunityDecisionMakingRelationshipDocuments,
];
