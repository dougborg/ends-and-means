import type { AuthoringDocument } from "../../../src/lib/domain";

type Citation = readonly [string, string, string, "supports" | "context", string];

const citations: Citation[] = [
  ["ruwalla-name-boundary", "stocker-borders-in-motion-source", "repository abstract, paragraphs 3–4", "supports", "stocker-name"],
  ["ruwalla-anaza-affiliation", "cicek-tribal-agency-source", "pp. 602–603 and 607–608", "supports", "cicek-anaza"],
  ["ruwalla-mobility-corridor", "cicek-tribal-agency-source", "pp. 602–603 and 607–609", "supports", "cicek-corridor"],
  ["ruwalla-mashyakha", "stocker-borders-in-motion-source", "repository abstract, paragraphs 5–6", "supports", "stocker-mashyakha"],
  ["ruwalla-shaykh-consent-limit", "cicek-tribal-agency-source", "pp. 603–604", "supports", "cicek-consent"],
  ["ruwalla-dira-not-sovereignty", "stocker-borders-in-motion-source", "repository abstract, paragraphs 7–8", "supports", "stocker-dira"],
  ["ruwalla-border-bargaining", "cicek-tribal-agency-source", "pp. 607–609, section ‘Bedouins, Wahhabism and borders’", "supports", "cicek-bargaining"],
  ["ruwalla-border-concessions", "cicek-tribal-agency-source", "pp. 602–605 and 613–614", "supports", "cicek-concessions"],
  ["ruwalla-archive-mediation", "cicek-tribal-agency-source", "p. 601, introduction and source note", "supports", "cicek-method"],
  ["ruwalla-archive-mediation", "stocker-borders-in-motion-source", "repository abstract, paragraphs 8–10", "supports", "stocker-method"],
  ["ruwalla-case-transfer-limit", "cicek-tribal-agency-source", "pp. 601–614", "context", "cicek-transfer"],
  ["ruwalla-case-transfer-limit", "stocker-borders-in-motion-source", "repository abstract, paragraphs 3–12", "context", "stocker-transfer"],
  ["jinst-fieldwork-provenance", "fernandez-gimenez-pastoral-tenure-source", "pp. 53–55, ‘Case study sites and methods’", "supports", "jinst-method"],
  ["jinst-administrative-boundary", "fernandez-gimenez-pastoral-tenure-source", "pp. 56–57 and 63–65", "supports", "jinst-administration"],
  ["jinst-postcollective-change", "fernandez-gimenez-pastoral-tenure-source", "pp. 56–59", "supports", "jinst-transition"],
  ["jinst-seasonal-norms", "fernandez-gimenez-pastoral-tenure-source", "p. 56", "supports", "jinst-norms"],
  ["jinst-khot-ail", "fernandez-gimenez-pastoral-tenure-source", "pp. 61–62, including note 4", "supports", "jinst-khot-ail"],
  ["jinst-campsite-rights", "fernandez-gimenez-pastoral-tenure-source", "pp. 60–62", "supports", "jinst-campsites"],
  ["jinst-neg-nutgiinkhan-boundary", "fernandez-gimenez-pastoral-tenure-source", "p. 62, including note 5", "supports", "jinst-neg-nutgiinkhan"],
  ["jinst-pasture-overlap", "fernandez-gimenez-pastoral-tenure-source", "pp. 62–64", "supports", "jinst-pasture"],
  ["jinst-resource-rights-differed", "fernandez-gimenez-pastoral-tenure-source", "pp. 60–64", "supports", "jinst-resource-rights"],
  ["jinst-inequality", "fernandez-gimenez-pastoral-tenure-source", "pp. 58–59 and 62", "supports", "jinst-inequality"],
  ["jinst-mobility-coordination", "fernandez-gimenez-pastoral-tenure-source", "pp. 58–60", "supports", "jinst-coordination"],
  ["jinst-tenure-proposal-limit", "fernandez-gimenez-pastoral-tenure-source", "pp. 65–74", "supports", "jinst-proposal"],
  ["mongolia-later-study-transfer", "allington-context-matters-source", "abstract; methods summary; conclusions", "supports", "mongolia-later"],
  ["jinst-case-transfer-limit", "fernandez-gimenez-pastoral-tenure-source", "pp. 53–74", "context", "jinst-transfer"],
  ["ruwalla-jinst-non-equivalence", "cicek-tribal-agency-source", "pp. 601–614", "context", "comparison-ruwalla"],
  ["ruwalla-jinst-non-equivalence", "fernandez-gimenez-pastoral-tenure-source", "pp. 53–74", "context", "comparison-jinst"],
];

export const nomadicConfederatedOrganizationRelationshipDocuments = citations.map(
  ([statementId, sourceId, locator, role, suffix]): AuthoringDocument => ({
    documentType: "relationships",
    subject: { kind: "statement", id: statementId },
    relationships: [{
      id: `${statementId}-cites-${suffix}`,
      predicate: "cites",
      subject: { kind: "statement", id: statementId },
      object: { kind: "source", id: sourceId },
      role,
      locator,
    }],
  }),
);
