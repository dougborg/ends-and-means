import type { AuthoringDocument } from "../../src/lib/domain";
import { analysisDocuments } from "./analysis/swedish-wage-earner-funds";
import { rehnMeidnerApproachDocuments } from "./approaches/rehn-meidner-model";
import { approachDocuments } from "./approaches/swedish-wage-earner-funds";
import { anarchismEvidenceDocuments } from "./evidence/anarchism";
import { collectiveCapitalFormationEvidenceDocuments } from "./evidence/collective-capital-formation";
import { democracyRepublicEvidenceDocuments } from "./evidence/democracy-republic";
import { economicDemocracyEvidenceDocuments } from "./evidence/economic-democracy";
import { kahnawakeCommunityDecisionMakingEvidenceDocuments } from "./evidence/kahnawake-community-decision-making";
import { rehnMeidnerEvidenceDocuments } from "./evidence/rehn-meidner-model";
import { socialDemocracyEvidenceDocuments } from "./evidence/social-democracy";
import { socialOwnershipEvidenceDocuments } from "./evidence/social-ownership";
import { socialismCommunismEvidenceDocuments } from "./evidence/socialism-communism";
import { evidenceDocuments } from "./evidence/swedish-wage-earner-funds";
import { tawantinsuyuEvidenceDocuments } from "./evidence/tawantinsuyu";
import { anarchismGuideDocuments } from "./presentation/anarchism-guide";
import { collectiveCapitalFormationDossierDocuments } from "./presentation/collective-capital-formation-dossier";
import { democracyRepublicGuideDocuments } from "./presentation/democracy-republic-guides";
import { foundationalConceptDossierDocuments } from "./presentation/foundational-concept-dossiers";
import { kahnawakeCommunityDecisionMakingDossierDocuments } from "./presentation/kahnawake-community-decision-making-dossier";
import { kahnawakeCommunityDecisionMakingGuideDocuments } from "./presentation/kahnawake-community-decision-making-guide";
import { socialismCommunismDossierDocuments } from "./presentation/socialism-communism-dossiers";
import { subjectGuideDocuments } from "./presentation/subject-guides";
import { dossierDocuments } from "./presentation/swedish-dossiers";
import { tawantinsuyuDossierDocuments } from "./presentation/tawantinsuyu-dossier";
import { tawantinsuyuGuideDocuments } from "./presentation/tawantinsuyu-guide";
import { anarchismRelationshipDocuments } from "./relationships/anarchism";
import { collectiveCapitalFormationRelationshipDocuments } from "./relationships/collective-capital-formation";
import { democracyRepublicRelationshipDocuments } from "./relationships/democracy-republic";
import { economicDemocracyRelationshipDocuments } from "./relationships/economic-democracy";
import { kahnawakeCommunityDecisionMakingRelationshipDocuments } from "./relationships/kahnawake-community-decision-making";
import { rehnMeidnerRelationshipDocuments } from "./relationships/rehn-meidner-model";
import { socialDemocracyRelationshipDocuments } from "./relationships/social-democracy";
import { socialOwnershipRelationshipDocuments } from "./relationships/social-ownership";
import { socialismCommunismRelationshipDocuments } from "./relationships/socialism-communism";
import { relationshipDocuments } from "./relationships/swedish-wage-earner-funds";
import { tawantinsuyuRelationshipDocuments } from "./relationships/tawantinsuyu";
import { anarchismResearchDocuments } from "./research/anarchism";
import { collectiveCapitalFormationResearchDocuments } from "./research/collective-capital-formation";
import { democracyRepublicResearchDocuments } from "./research/democracy-republic";
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
  ...democracyRepublicEvidenceDocuments,
  ...socialOwnershipEvidenceDocuments,
  ...socialDemocracyEvidenceDocuments,
  ...socialismCommunismEvidenceDocuments,
  ...tawantinsuyuEvidenceDocuments,
  ...anarchismEvidenceDocuments,
  ...kahnawakeCommunityDecisionMakingEvidenceDocuments,
  ...dossierDocuments,
  ...foundationalConceptDossierDocuments,
  ...collectiveCapitalFormationDossierDocuments,
  ...democracyRepublicGuideDocuments,
  ...socialismCommunismDossierDocuments,
  ...tawantinsuyuDossierDocuments,
  ...tawantinsuyuGuideDocuments,
  ...subjectGuideDocuments,
  ...anarchismGuideDocuments,
  ...kahnawakeCommunityDecisionMakingGuideDocuments,
  ...kahnawakeCommunityDecisionMakingDossierDocuments,
  ...openResearchObligationDocuments,
  ...collectiveCapitalFormationResearchDocuments,
  ...democracyRepublicResearchDocuments,
  ...tawantinsuyuResearchDocuments,
  ...anarchismResearchDocuments,
  ...analysisDocuments,
  ...relationshipDocuments,
  ...rehnMeidnerRelationshipDocuments,
  ...economicDemocracyRelationshipDocuments,
  ...collectiveCapitalFormationRelationshipDocuments,
  ...democracyRepublicRelationshipDocuments,
  ...socialDemocracyRelationshipDocuments,
  ...socialOwnershipRelationshipDocuments,
  ...socialismCommunismRelationshipDocuments,
  ...tawantinsuyuRelationshipDocuments,
  ...anarchismRelationshipDocuments,
  ...kahnawakeCommunityDecisionMakingRelationshipDocuments,
];
