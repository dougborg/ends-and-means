import type { AuthoringDocument } from "../../src/lib/domain";
import { analysisDocuments } from "./analysis/swedish-wage-earner-funds";
import { centralPlanningAnalysisDocuments } from "./analysis/central-planning";
import { centralPlanningApproachDocuments } from "./approaches/central-planning";
import { rehnMeidnerApproachDocuments } from "./approaches/rehn-meidner-model";
import { approachDocuments } from "./approaches/swedish-wage-earner-funds";
import { anarchismEvidenceDocuments } from "./evidence/anarchism";
import { collectiveCapitalFormationEvidenceDocuments } from "./evidence/collective-capital-formation";
import { centralPlanningEvidenceDocuments } from "./evidence/central-planning";
import { democracyRepublicEvidenceDocuments } from "./evidence/democracy-republic";
import { authoritarianismFascismTotalitarianismEvidenceDocuments } from "./evidence/authoritarianism-fascism-totalitarianism";
import { economicDemocracyEvidenceDocuments } from "./evidence/economic-democracy";
import { kahnawakeCommunityDecisionMakingEvidenceDocuments } from "./evidence/kahnawake-community-decision-making";
import { rehnMeidnerEvidenceDocuments } from "./evidence/rehn-meidner-model";
import { socialDemocracyEvidenceDocuments } from "./evidence/social-democracy";
import { socialOwnershipEvidenceDocuments } from "./evidence/social-ownership";
import { socialismCommunismEvidenceDocuments } from "./evidence/socialism-communism";
import { evidenceDocuments } from "./evidence/swedish-wage-earner-funds";
import { tawantinsuyuEvidenceDocuments } from "./evidence/tawantinsuyu";
import { zapatistaCaracolesEvidenceDocuments } from "./evidence/zapatista-caracoles";
import { anarchismGuideDocuments } from "./presentation/anarchism-guide";
import { collectiveCapitalFormationDossierDocuments } from "./presentation/collective-capital-formation-dossier";
import { centralPlanningGuideDocuments } from "./presentation/central-planning-guide";
import { democracyRepublicGuideDocuments } from "./presentation/democracy-republic-guides";
import { authoritarianismFascismTotalitarianismGuideDocuments } from "./presentation/authoritarianism-fascism-totalitarianism-guides";
import { foundationalConceptDossierDocuments } from "./presentation/foundational-concept-dossiers";
import { kahnawakeCommunityDecisionMakingDossierDocuments } from "./presentation/kahnawake-community-decision-making-dossier";
import { kahnawakeCommunityDecisionMakingGuideDocuments } from "./presentation/kahnawake-community-decision-making-guide";
import { socialismCommunismDossierDocuments } from "./presentation/socialism-communism-dossiers";
import { subjectGuideDocuments } from "./presentation/subject-guides";
import { dossierDocuments } from "./presentation/swedish-dossiers";
import { tawantinsuyuDossierDocuments } from "./presentation/tawantinsuyu-dossier";
import { tawantinsuyuGuideDocuments } from "./presentation/tawantinsuyu-guide";
import { zapatistaCaracolesDossierDocuments } from "./presentation/zapatista-caracoles-dossier";
import { anarchismRelationshipDocuments } from "./relationships/anarchism";
import { collectiveCapitalFormationRelationshipDocuments } from "./relationships/collective-capital-formation";
import { centralPlanningRelationshipDocuments } from "./relationships/central-planning";
import { democracyRepublicRelationshipDocuments } from "./relationships/democracy-republic";
import { authoritarianismFascismTotalitarianismRelationshipDocuments } from "./relationships/authoritarianism-fascism-totalitarianism";
import { economicDemocracyRelationshipDocuments } from "./relationships/economic-democracy";
import { kahnawakeCommunityDecisionMakingRelationshipDocuments } from "./relationships/kahnawake-community-decision-making";
import { rehnMeidnerRelationshipDocuments } from "./relationships/rehn-meidner-model";
import { socialDemocracyRelationshipDocuments } from "./relationships/social-democracy";
import { socialOwnershipRelationshipDocuments } from "./relationships/social-ownership";
import { socialismCommunismRelationshipDocuments } from "./relationships/socialism-communism";
import { relationshipDocuments } from "./relationships/swedish-wage-earner-funds";
import { tawantinsuyuRelationshipDocuments } from "./relationships/tawantinsuyu";
import { zapatistaCaracolesRelationshipDocuments } from "./relationships/zapatista-caracoles";
import { anarchismResearchDocuments } from "./research/anarchism";
import { collectiveCapitalFormationResearchDocuments } from "./research/collective-capital-formation";
import { centralPlanningResearchDocuments } from "./research/central-planning";
import { democracyRepublicResearchDocuments } from "./research/democracy-republic";
import { authoritarianismFascismTotalitarianismResearchDocuments } from "./research/authoritarianism-fascism-totalitarianism";
import { openResearchObligationDocuments } from "./research/open-obligations";
import { tawantinsuyuResearchDocuments } from "./research/tawantinsuyu";
import { zapatistaCaracolesResearchDocuments } from "./research/zapatista-caracoles";
import { socialismCommunismVocabularyDocuments } from "./vocabulary/socialism-communism";
import { vocabularyDocuments } from "./vocabulary/swedish-wage-earner-funds";

export const canonicalDocuments: AuthoringDocument[] = [
  ...vocabularyDocuments,
  ...socialismCommunismVocabularyDocuments,
  ...approachDocuments,
  ...rehnMeidnerApproachDocuments,
  ...centralPlanningApproachDocuments,
  ...evidenceDocuments,
  ...rehnMeidnerEvidenceDocuments,
  ...economicDemocracyEvidenceDocuments,
  ...collectiveCapitalFormationEvidenceDocuments,
  ...centralPlanningEvidenceDocuments,
  ...democracyRepublicEvidenceDocuments,
  ...authoritarianismFascismTotalitarianismEvidenceDocuments,
  ...socialOwnershipEvidenceDocuments,
  ...socialDemocracyEvidenceDocuments,
  ...socialismCommunismEvidenceDocuments,
  ...tawantinsuyuEvidenceDocuments,
  ...anarchismEvidenceDocuments,
  ...kahnawakeCommunityDecisionMakingEvidenceDocuments,
  ...zapatistaCaracolesEvidenceDocuments,
  ...dossierDocuments,
  ...foundationalConceptDossierDocuments,
  ...collectiveCapitalFormationDossierDocuments,
  ...centralPlanningGuideDocuments,
  ...democracyRepublicGuideDocuments,
  ...authoritarianismFascismTotalitarianismGuideDocuments,
  ...socialismCommunismDossierDocuments,
  ...tawantinsuyuDossierDocuments,
  ...tawantinsuyuGuideDocuments,
  ...subjectGuideDocuments,
  ...anarchismGuideDocuments,
  ...kahnawakeCommunityDecisionMakingGuideDocuments,
  ...kahnawakeCommunityDecisionMakingDossierDocuments,
  ...zapatistaCaracolesDossierDocuments,
  ...openResearchObligationDocuments,
  ...collectiveCapitalFormationResearchDocuments,
  ...centralPlanningResearchDocuments,
  ...democracyRepublicResearchDocuments,
  ...authoritarianismFascismTotalitarianismResearchDocuments,
  ...tawantinsuyuResearchDocuments,
  ...anarchismResearchDocuments,
  ...zapatistaCaracolesResearchDocuments,
  ...analysisDocuments,
  ...centralPlanningAnalysisDocuments,
  ...relationshipDocuments,
  ...rehnMeidnerRelationshipDocuments,
  ...economicDemocracyRelationshipDocuments,
  ...collectiveCapitalFormationRelationshipDocuments,
  ...centralPlanningRelationshipDocuments,
  ...democracyRepublicRelationshipDocuments,
  ...authoritarianismFascismTotalitarianismRelationshipDocuments,
  ...socialDemocracyRelationshipDocuments,
  ...socialOwnershipRelationshipDocuments,
  ...socialismCommunismRelationshipDocuments,
  ...tawantinsuyuRelationshipDocuments,
  ...anarchismRelationshipDocuments,
  ...kahnawakeCommunityDecisionMakingRelationshipDocuments,
  ...zapatistaCaracolesRelationshipDocuments,
];
