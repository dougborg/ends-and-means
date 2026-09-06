import type { AuthoringDocument } from "../../../src/lib/domain";

type Citation = readonly [string, string, string, "supports" | "context", string];

const citations: Citation[] = [
  ["ruwalla-scholarly-classification", "stocker-borders-in-motion-source", "repository abstract, paragraphs 3–4", "supports", "stocker-name"],
  ["ruwalla-classification-limit", "stocker-borders-in-motion-source", "repository abstract, paragraphs 3–4", "context", "stocker-classification-limit"],
  ["ruwalla-anaza-affiliation", "cicek-tribal-agency-source", "pp. 602–603 and 607–608", "supports", "cicek-anaza"],
  ["ruwalla-mobility-corridor", "cicek-tribal-agency-source", "pp. 602–603 and 607–609", "supports", "cicek-corridor"],
  ["ruwalla-mashyakha", "stocker-borders-in-motion-source", "repository abstract, paragraphs 5–6", "supports", "stocker-mashyakha"],
  ["regional-bedouin-shaykh-persuasion", "cicek-tribal-agency-source", "pp. 603–604", "supports", "cicek-consent"],
  ["ruwalla-dira-not-sovereignty", "stocker-borders-in-motion-source", "repository abstract, paragraphs 7–8", "supports", "stocker-dira"],
  ["ruwalla-border-bargaining", "cicek-tribal-agency-source", "pp. 607–609, section ‘Bedouins, Wahhabism and borders’", "supports", "cicek-bargaining"],
  ["ruwalla-border-concessions", "cicek-tribal-agency-source", "pp. 602–605 and 613–614", "supports", "cicek-concessions"],
  ["ruwalla-archive-source-base", "cicek-tribal-agency-source", "p. 601, introduction and source note", "supports", "cicek-method"],
  ["ruwalla-archive-source-base", "stocker-borders-in-motion-source", "repository abstract, paragraphs 8–10", "supports", "stocker-method"],
  ["ruwalla-archive-voice-limit", "cicek-tribal-agency-source", "p. 601, introduction and source note", "context", "cicek-voice-limit"],
  ["ruwalla-archive-voice-limit", "stocker-borders-in-motion-source", "repository abstract, paragraphs 8–10", "context", "stocker-voice-limit"],
  ["ruwalla-case-transfer-limit", "cicek-tribal-agency-source", "pp. 601–614", "context", "cicek-transfer"],
  ["ruwalla-case-transfer-limit", "stocker-borders-in-motion-source", "repository abstract, paragraphs 3–12", "context", "stocker-transfer"],
  ["jinst-fieldwork-provenance", "fernandez-gimenez-pastoral-tenure-source", "pp. 53–55, ‘Case study sites and methods’", "supports", "jinst-method"],
  ["mongolia-administrative-boundary", "fernandez-gimenez-pastoral-tenure-source", "pp. 56–57 and 63–65", "supports", "jinst-administration"],
  ["mongolia-postcollective-change", "fernandez-gimenez-pastoral-tenure-source", "pp. 56–59", "supports", "jinst-transition"],
  ["mongolia-seasonal-norms", "fernandez-gimenez-pastoral-tenure-source", "p. 56", "supports", "jinst-norms"],
  ["study-sites-khot-ail", "fernandez-gimenez-pastoral-tenure-source", "pp. 61–62, including note 4", "supports", "jinst-khot-ail"],
  ["study-sites-campsite-rights", "fernandez-gimenez-pastoral-tenure-source", "pp. 60–62", "supports", "jinst-campsites"],
  ["study-sites-neg-nutgiinkhan-boundary", "fernandez-gimenez-pastoral-tenure-source", "p. 62, including note 5", "supports", "jinst-neg-nutgiinkhan"],
  ["study-sites-pasture-overlap", "fernandez-gimenez-pastoral-tenure-source", "pp. 62–64", "supports", "jinst-pasture"],
  ["study-sites-resource-rights-differed", "fernandez-gimenez-pastoral-tenure-source", "pp. 60–64", "supports", "jinst-resource-rights"],
  ["study-sites-inequality", "fernandez-gimenez-pastoral-tenure-source", "pp. 58–59 and 62", "supports", "jinst-inequality"],
  ["study-sites-mobility-coordination", "fernandez-gimenez-pastoral-tenure-source", "pp. 58–60", "supports", "jinst-coordination"],
  ["study-sites-1998-campsite-certificates", "fernandez-gimenez-pastoral-tenure-source", "p. 61", "supports", "study-sites-certificates"],
  ["fernandez-gimenez-seasonal-regulation-proposal", "fernandez-gimenez-pastoral-tenure-source", "pp. 65–74", "supports", "jinst-proposal"],
  ["jinst-formalization-caution", "fernandez-gimenez-pastoral-tenure-source", "pp. 62 and 65–74", "context", "jinst-formalization-caution"],
  ["jinst-bag-leader-election", "fernandez-gimenez-pastoral-tenure-source", "p. 68, note 7", "supports", "jinst-election"],
  ["jinst-1995-campsite-use", "fernandez-gimenez-pastoral-tenure-source", "p. 58, Table I", "supports", "jinst-campsite-use"],
  ["jinst-1995-winter-pasture-incursion", "fernandez-gimenez-pastoral-tenure-source", "p. 58, Table I", "supports", "jinst-winter-incursion"],
  ["mongolia-later-study-transfer", "allington-context-matters-source", "abstract; methods summary; conclusions", "supports", "mongolia-later"],
  ["jinst-case-transfer-limit", "fernandez-gimenez-pastoral-tenure-source", "pp. 53–74", "context", "jinst-transfer"],
  ["ruwalla-jinst-non-equivalence", "cicek-tribal-agency-source", "pp. 601–614", "context", "comparison-ruwalla"],
  ["ruwalla-jinst-non-equivalence", "fernandez-gimenez-pastoral-tenure-source", "pp. 53–74", "context", "comparison-jinst"],
];

export const nomadicConfederatedOrganizationRelationshipDocuments = citations.map(
  ([statementId, sourceId, locator, role, suffix]): AuthoringDocument => ({
    documentType: "relationships",
    subject: { kind: "statement", id: statementId },
    relationships: [
      {
        id: `${statementId}-cites-${suffix}`,
        predicate: "cites",
        subject: { kind: "statement", id: statementId },
        object: { kind: "source", id: sourceId },
        role,
        locator,
      },
    ],
  }),
);
