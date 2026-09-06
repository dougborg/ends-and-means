import type { AuthoringDocument } from "../../src/lib/domain";
import { analysisDocuments } from "./analysis/swedish-wage-earner-funds";
import { rehnMeidnerApproachDocuments } from "./approaches/rehn-meidner-model";
import { approachDocuments } from "./approaches/swedish-wage-earner-funds";
import { economicDemocracyEvidenceDocuments } from "./evidence/economic-democracy";
import { collectiveCapitalFormationEvidenceDocuments } from "./evidence/collective-capital-formation";
import { kahnawakeCommunityDecisionMakingEvidenceDocuments } from "./evidence/kahnawake-community-decision-making";
import { rehnMeidnerEvidenceDocuments } from "./evidence/rehn-meidner-model";
import { socialDemocracyEvidenceDocuments } from "./evidence/social-democracy";
import { socialOwnershipEvidenceDocuments } from "./evidence/social-ownership";
import { socialismCommunismEvidenceDocuments } from "./evidence/socialism-communism";
import { evidenceDocuments } from "./evidence/swedish-wage-earner-funds";
import { foundationalConceptDossierDocuments } from "./presentation/foundational-concept-dossiers";
import { collectiveCapitalFormationDossierDocuments } from "./presentation/collective-capital-formation-dossier";
import { kahnawakeCommunityDecisionMakingGuideDocuments } from "./presentation/kahnawake-community-decision-making-guide";
import { kahnawakeCommunityDecisionMakingDossierDocuments } from "./presentation/kahnawake-community-decision-making-dossier";
import { socialismCommunismDossierDocuments } from "./presentation/socialism-communism-dossiers";
import { subjectGuideDocuments } from "./presentation/subject-guides";
import { dossierDocuments } from "./presentation/swedish-dossiers";
import { economicDemocracyRelationshipDocuments } from "./relationships/economic-democracy";
import { collectiveCapitalFormationRelationshipDocuments } from "./relationships/collective-capital-formation";
import { kahnawakeCommunityDecisionMakingRelationshipDocuments } from "./relationships/kahnawake-community-decision-making";
import { rehnMeidnerRelationshipDocuments } from "./relationships/rehn-meidner-model";
import { socialDemocracyRelationshipDocuments } from "./relationships/social-democracy";
import { socialOwnershipRelationshipDocuments } from "./relationships/social-ownership";
import { socialismCommunismRelationshipDocuments } from "./relationships/socialism-communism";
import { relationshipDocuments } from "./relationships/swedish-wage-earner-funds";
import { openResearchObligationDocuments } from "./research/open-obligations";
import { collectiveCapitalFormationResearchDocuments } from "./research/collective-capital-formation";
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
  ...kahnawakeCommunityDecisionMakingEvidenceDocuments,
  ...dossierDocuments,
  ...foundationalConceptDossierDocuments,
  ...collectiveCapitalFormationDossierDocuments,
  ...socialismCommunismDossierDocuments,
  ...subjectGuideDocuments,
  ...kahnawakeCommunityDecisionMakingGuideDocuments,
  ...kahnawakeCommunityDecisionMakingDossierDocuments,
  ...openResearchObligationDocuments,
  ...collectiveCapitalFormationResearchDocuments,
  ...analysisDocuments,
  ...relationshipDocuments,
  ...rehnMeidnerRelationshipDocuments,
  ...economicDemocracyRelationshipDocuments,
  ...collectiveCapitalFormationRelationshipDocuments,
  ...socialDemocracyRelationshipDocuments,
  ...socialOwnershipRelationshipDocuments,
  ...socialismCommunismRelationshipDocuments,
  ...kahnawakeCommunityDecisionMakingRelationshipDocuments,
];
