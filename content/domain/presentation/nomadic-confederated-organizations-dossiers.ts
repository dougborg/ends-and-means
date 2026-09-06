import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const reviewed = { publicationStatus: "reviewed" as const, reviewedAt: "2026-09-07" };

const ruwalla = attachNarrative("ruwalla-borderland-organization.md", {
  id: "ruwalla-borderland-organization-dossier", kind: "dossier" as const,
  label: "Ruwalla borderland organization dossier",
  description: "A bounded account of Ruwalla mobility, leadership, territorial access, and state negotiation from 1918 to 1936.",
  subject: { kind: "case" as const, id: "ruwalla-borderland-organization" },
  standfirst: "", standfirstStatementIds: ["ruwalla-mobility-corridor", "ruwalla-case-transfer-limit"],
  sections: [
    { id: "whose-terms-describe-the-formation", heading: "Whose terms describe this formation?", body: "", traceStatus: "qualified" as const, statementIds: ["ruwalla-name-boundary", "ruwalla-anaza-affiliation"] },
    { id: "how-did-leadership-work", heading: "How did leadership work?", body: "", traceStatus: "qualified" as const, statementIds: ["ruwalla-mashyakha", "ruwalla-shaykh-consent-limit"] },
    { id: "why-did-mobility-and-territory-matter", heading: "Why did mobility and territory matter?", body: "", traceStatus: "supported" as const, statementIds: ["ruwalla-mobility-corridor", "ruwalla-dira-not-sovereignty"] },
    { id: "how-did-new-states-change-the-relationship", heading: "How did new states change the relationship?", body: "", traceStatus: "qualified" as const, statementIds: ["ruwalla-border-bargaining", "ruwalla-border-concessions"] },
    { id: "what-can-the-sources-establish", heading: "What can the sources establish?", body: "", traceStatus: "qualified" as const, statementIds: ["ruwalla-archive-mediation"] },
    { id: "how-should-this-case-be-compared", heading: "How should this case be compared?", body: "", traceStatus: "qualified" as const, statementIds: ["ruwalla-case-transfer-limit", "ruwalla-jinst-non-equivalence"] },
  ], ...reviewed,
});

const jinst = attachNarrative("jinst-postcollective-pastoral-governance.md", {
  id: "jinst-postcollective-pastoral-governance-dossier", kind: "dossier" as const,
  label: "Jinst post-collective pastoral governance dossier",
  description: "A bounded account of household camps, pasture access, mobility, and administration in Jinst during 1990–1997.",
  subject: { kind: "case" as const, id: "jinst-postcollective-pastoral-governance" },
  standfirst: "", standfirstStatementIds: ["jinst-postcollective-change", "jinst-case-transfer-limit"],
  sections: [
    { id: "whose-terms-and-boundaries-apply", heading: "Whose terms and boundaries apply?", body: "", traceStatus: "qualified" as const, statementIds: ["jinst-administrative-boundary", "jinst-khot-ail", "jinst-neg-nutgiinkhan-boundary"] },
    { id: "what-changed-after-the-collectives", heading: "What changed after the collectives?", body: "", traceStatus: "supported" as const, statementIds: ["jinst-postcollective-change", "jinst-mobility-coordination"] },
    { id: "how-were-resources-coordinated", heading: "How were resources coordinated?", body: "", traceStatus: "supported" as const, statementIds: ["jinst-khot-ail", "jinst-campsite-rights", "jinst-resource-rights-differed"] },
    { id: "why-were-boundaries-permeable", heading: "Why were boundaries permeable?", body: "", traceStatus: "supported" as const, statementIds: ["jinst-pasture-overlap", "jinst-seasonal-norms"] },
    { id: "whose-access-was-secure", heading: "Whose access was secure?", body: "", traceStatus: "qualified" as const, statementIds: ["jinst-inequality", "jinst-tenure-proposal-limit"] },
    { id: "what-does-the-evidence-not-show", heading: "What does the evidence not show?", body: "", traceStatus: "qualified" as const, statementIds: ["jinst-fieldwork-provenance", "jinst-tenure-proposal-limit", "mongolia-later-study-transfer"] },
    { id: "how-should-this-case-be-compared", heading: "How should this case be compared?", body: "", traceStatus: "qualified" as const, statementIds: ["jinst-case-transfer-limit", "ruwalla-jinst-non-equivalence"] },
  ], ...reviewed,
});

export const nomadicConfederatedOrganizationDossierDocuments = [
  { documentType: "entity", entity: ruwalla },
  { documentType: "entity", entity: jinst },
] satisfies AuthoringDocument[];
