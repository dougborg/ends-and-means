import type { AuthoringDocument } from "../../src/lib/domain";
import { reviewedOrientationOnlyMappings } from "../../src/lib/domain/orientation-only-mappings";
import { centralPlanningAnalysisDocuments } from "./analysis/central-planning";
import { analysisDocuments } from "./analysis/swedish-wage-earner-funds";
import { centralPlanningApproachDocuments } from "./approaches/central-planning";
import { rehnMeidnerApproachDocuments } from "./approaches/rehn-meidner-model";
import { approachDocuments } from "./approaches/swedish-wage-earner-funds";
import { anarchismEvidenceDocuments } from "./evidence/anarchism";
import { capitalismMarketEvidenceDocuments } from "./evidence/capitalism-market-economy";
import { centralPlanningEvidenceDocuments } from "./evidence/central-planning";
import { collectiveCapitalFormationEvidenceDocuments } from "./evidence/collective-capital-formation";
import { democracyRepublicEvidenceDocuments } from "./evidence/democracy-republic";
import { authoritarianismFascismTotalitarianismEvidenceDocuments } from "./evidence/authoritarianism-fascism-totalitarianism";
import { economicDemocracyEvidenceDocuments } from "./evidence/economic-democracy";
import { feminismEvidenceDocuments } from "./evidence/feminism";
import { kahnawakeCommunityDecisionMakingEvidenceDocuments } from "./evidence/kahnawake-community-decision-making";
import { liberalismConservatismEvidenceDocuments } from "./evidence/liberalism-conservatism";
import { minangkabauEvidenceDocuments } from "./evidence/minangkabau";
import { monarchyEvidenceDocuments } from "./evidence/monarchy";
import { nomadicConfederatedOrganizationEvidenceDocuments } from "./evidence/nomadic-confederated-organizations";
import { rehnMeidnerEvidenceDocuments } from "./evidence/rehn-meidner-model";
import { socialDemocracyEvidenceDocuments } from "./evidence/social-democracy";
import { socialOwnershipEvidenceDocuments } from "./evidence/social-ownership";
import { socialismCommunismEvidenceDocuments } from "./evidence/socialism-communism";
import { evidenceDocuments } from "./evidence/swedish-wage-earner-funds";
import { tawantinsuyuEvidenceDocuments } from "./evidence/tawantinsuyu";
import { zapatistaCaracolesEvidenceDocuments } from "./evidence/zapatista-caracoles";
import { anarchismGuideDocuments } from "./presentation/anarchism-guide";
import { capitalismMarketGuideDocuments } from "./presentation/capitalism-market-economy-guides";
import { centralPlanningGuideDocuments } from "./presentation/central-planning-guide";
import { collectiveCapitalFormationDossierDocuments } from "./presentation/collective-capital-formation-dossier";
import { democracyRepublicGuideDocuments } from "./presentation/democracy-republic-guides";
import { authoritarianismFascismTotalitarianismGuideDocuments } from "./presentation/authoritarianism-fascism-totalitarianism-guides";
import { foundationalConceptDossierDocuments } from "./presentation/foundational-concept-dossiers";
import { feminismGuideDocuments } from "./presentation/feminism-guide";
import { kahnawakeCommunityDecisionMakingDossierDocuments } from "./presentation/kahnawake-community-decision-making-dossier";
import { kahnawakeCommunityDecisionMakingGuideDocuments } from "./presentation/kahnawake-community-decision-making-guide";
import { liberalismConservatismGuideDocuments } from "./presentation/liberalism-conservatism-guides";
import { minangkabauDossierDocuments } from "./presentation/minangkabau-dossier";
import { minangkabauGuideDocuments } from "./presentation/minangkabau-guide";
import { monarchyGuideDocuments } from "./presentation/monarchy-guide";
import { nomadicConfederatedOrganizationDossierDocuments } from "./presentation/nomadic-confederated-organizations-dossiers";
import { nomadicConfederatedOrganizationGuideDocuments } from "./presentation/nomadic-confederated-organizations-guides";
import { socialismCommunismDossierDocuments } from "./presentation/socialism-communism-dossiers";
import { subjectGuideDocuments } from "./presentation/subject-guides";
import { dossierDocuments } from "./presentation/swedish-dossiers";
import { tawantinsuyuDossierDocuments } from "./presentation/tawantinsuyu-dossier";
import { tawantinsuyuGuideDocuments } from "./presentation/tawantinsuyu-guide";
import { zapatistaCaracolesDossierDocuments } from "./presentation/zapatista-caracoles-dossier";
import { anarchismRelationshipDocuments } from "./relationships/anarchism";
import { capitalismMarketRelationshipDocuments } from "./relationships/capitalism-market-economy";
import { centralPlanningRelationshipDocuments } from "./relationships/central-planning";
import { collectiveCapitalFormationRelationshipDocuments } from "./relationships/collective-capital-formation";
import { democracyRepublicRelationshipDocuments } from "./relationships/democracy-republic";
import { authoritarianismFascismTotalitarianismRelationshipDocuments } from "./relationships/authoritarianism-fascism-totalitarianism";
import { economicDemocracyRelationshipDocuments } from "./relationships/economic-democracy";
import { feminismRelationshipDocuments } from "./relationships/feminism";
import { kahnawakeCommunityDecisionMakingRelationshipDocuments } from "./relationships/kahnawake-community-decision-making";
import { liberalismConservatismRelationshipDocuments } from "./relationships/liberalism-conservatism";
import { minangkabauRelationshipDocuments } from "./relationships/minangkabau";
import { monarchyRelationshipDocuments } from "./relationships/monarchy";
import { nomadicConfederatedOrganizationRelationshipDocuments } from "./relationships/nomadic-confederated-organizations";
import { rehnMeidnerRelationshipDocuments } from "./relationships/rehn-meidner-model";
import { socialDemocracyRelationshipDocuments } from "./relationships/social-democracy";
import { socialOwnershipRelationshipDocuments } from "./relationships/social-ownership";
import { socialismCommunismRelationshipDocuments } from "./relationships/socialism-communism";
import { relationshipDocuments } from "./relationships/swedish-wage-earner-funds";
import { tawantinsuyuRelationshipDocuments } from "./relationships/tawantinsuyu";
import { zapatistaCaracolesRelationshipDocuments } from "./relationships/zapatista-caracoles";
import { anarchismResearchDocuments } from "./research/anarchism";
import { capitalismMarketResearchDocuments } from "./research/capitalism-market-economy";
import { centralPlanningResearchDocuments } from "./research/central-planning";
import { collectiveCapitalFormationResearchDocuments } from "./research/collective-capital-formation";
import { democracyRepublicResearchDocuments } from "./research/democracy-republic";
import { authoritarianismFascismTotalitarianismResearchDocuments } from "./research/authoritarianism-fascism-totalitarianism";
import { liberalismConservatismResearchDocuments } from "./research/liberalism-conservatism";
import { feminismResearchDocuments } from "./research/feminism";
import { minangkabauResearchDocuments } from "./research/minangkabau";
import { monarchyResearchDocuments } from "./research/monarchy";
import { openResearchObligationDocuments } from "./research/open-obligations";
import { tawantinsuyuResearchDocuments } from "./research/tawantinsuyu";
import { zapatistaCaracolesResearchDocuments } from "./research/zapatista-caracoles";
import { nomadicConfederatedOrganizationResearchDocuments } from "./research/nomadic-confederated-organizations";
import { socialismCommunismVocabularyDocuments } from "./vocabulary/socialism-communism";
import { minangkabauVocabularyDocuments } from "./vocabulary/minangkabau";
import { vocabularyDocuments } from "./vocabulary/swedish-wage-earner-funds";

const rawCanonicalDocuments: AuthoringDocument[] = [
  ...vocabularyDocuments,
  ...socialismCommunismVocabularyDocuments,
  ...minangkabauVocabularyDocuments,
  ...approachDocuments,
  ...rehnMeidnerApproachDocuments,
  ...centralPlanningApproachDocuments,
  ...evidenceDocuments,
  ...rehnMeidnerEvidenceDocuments,
  ...economicDemocracyEvidenceDocuments,
  ...feminismEvidenceDocuments,
  ...collectiveCapitalFormationEvidenceDocuments,
  ...centralPlanningEvidenceDocuments,
  ...capitalismMarketEvidenceDocuments,
  ...democracyRepublicEvidenceDocuments,
  ...authoritarianismFascismTotalitarianismEvidenceDocuments,
  ...socialOwnershipEvidenceDocuments,
  ...socialDemocracyEvidenceDocuments,
  ...socialismCommunismEvidenceDocuments,
  ...tawantinsuyuEvidenceDocuments,
  ...anarchismEvidenceDocuments,
  ...kahnawakeCommunityDecisionMakingEvidenceDocuments,
  ...zapatistaCaracolesEvidenceDocuments,
  ...nomadicConfederatedOrganizationEvidenceDocuments,
  ...liberalismConservatismEvidenceDocuments,
  ...minangkabauEvidenceDocuments,
  ...monarchyEvidenceDocuments,
  ...dossierDocuments,
  ...foundationalConceptDossierDocuments,
  ...feminismGuideDocuments,
  ...collectiveCapitalFormationDossierDocuments,
  ...centralPlanningGuideDocuments,
  ...capitalismMarketGuideDocuments,
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
  ...nomadicConfederatedOrganizationDossierDocuments,
  ...nomadicConfederatedOrganizationGuideDocuments,
  ...liberalismConservatismGuideDocuments,
  ...minangkabauDossierDocuments,
  ...minangkabauGuideDocuments,
  ...monarchyGuideDocuments,
  ...openResearchObligationDocuments,
  ...feminismResearchDocuments,
  ...minangkabauResearchDocuments,
  ...monarchyResearchDocuments,
  ...collectiveCapitalFormationResearchDocuments,
  ...centralPlanningResearchDocuments,
  ...capitalismMarketResearchDocuments,
  ...democracyRepublicResearchDocuments,
  ...authoritarianismFascismTotalitarianismResearchDocuments,
  ...liberalismConservatismResearchDocuments,
  ...tawantinsuyuResearchDocuments,
  ...anarchismResearchDocuments,
  ...zapatistaCaracolesResearchDocuments,
  ...nomadicConfederatedOrganizationResearchDocuments,
  ...analysisDocuments,
  ...centralPlanningAnalysisDocuments,
  ...relationshipDocuments,
  ...rehnMeidnerRelationshipDocuments,
  ...economicDemocracyRelationshipDocuments,
  ...feminismRelationshipDocuments,
  ...collectiveCapitalFormationRelationshipDocuments,
  ...centralPlanningRelationshipDocuments,
  ...capitalismMarketRelationshipDocuments,
  ...democracyRepublicRelationshipDocuments,
  ...authoritarianismFascismTotalitarianismRelationshipDocuments,
  ...socialDemocracyRelationshipDocuments,
  ...socialOwnershipRelationshipDocuments,
  ...socialismCommunismRelationshipDocuments,
  ...tawantinsuyuRelationshipDocuments,
  ...anarchismRelationshipDocuments,
  ...kahnawakeCommunityDecisionMakingRelationshipDocuments,
  ...zapatistaCaracolesRelationshipDocuments,
  ...nomadicConfederatedOrganizationRelationshipDocuments,
  ...liberalismConservatismRelationshipDocuments,
  ...minangkabauRelationshipDocuments,
  ...monarchyRelationshipDocuments,
];

export const canonicalDocuments: AuthoringDocument[] =
  rawCanonicalDocuments.map((document) => {
    if (document.documentType !== "entity") return document;
    const article =
      reviewedOrientationOnlyMappings[
        document.entity.id as keyof typeof reviewedOrientationOnlyMappings
      ];
    if (!article || document.entity.externalRefs?.length) return document;
    return {
      ...document,
      entity: {
        ...document.entity,
        externalRefs: [
          {
            system: "wikipedia",
            url: `https://en.wikipedia.org/wiki/${article.replaceAll(" ", "_")}`,
            purpose: "orientation",
            language: "en",
            checkedAt: "2026-09-06",
          },
        ],
      },
    } as AuthoringDocument;
  });
