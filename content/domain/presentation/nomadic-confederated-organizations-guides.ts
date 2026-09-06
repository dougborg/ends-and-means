import type { AuthoringDocument } from "../../../src/lib/domain";

export const nomadicConfederatedOrganizationGuideDocuments = [
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-ruwalla-borderland-organization",
      slug: "ruwalla-borderland-organization",
      label: "Ruwalla organization across post-Ottoman borders",
      description: "A bounded guide to Ruwalla mobility, Al Shaʿlan representation, resource access, and border negotiation from 1918 to 1936.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "case", id: "ruwalla-borderland-organization" },
      searchQueries: [
        { query: "Ruwalla" }, { query: "Rwala" },
        { query: "Bedouin confederation", disambiguation: "A bounded Ruwalla case, not a universal Bedouin or confederated political type." },
        { query: "Arabian tribal organization", disambiguation: "One Ruwalla borderland episode with society-specific terms and institutions." },
        { query: "nomadic government", disambiguation: "A case about mobile pastoral organization that does not treat mobility as a type of government." },
      ],
      sections: [
        { id: "short-answer", role: "short-answer", heading: "How were Ruwalla groups organized across new borders?", narrativeRefs: [{ dossierId: "ruwalla-borderland-organization-dossier" }] },
        { id: "meanings-and-boundaries", role: "meanings-and-boundaries", heading: "Whose names and classifications are these?", narrativeRefs: [{ dossierId: "ruwalla-borderland-organization-dossier", sectionId: "whose-terms-describe-the-formation" }], statementIds: ["ruwalla-name-boundary", "ruwalla-anaza-affiliation"] },
        { id: "institutions-and-mechanisms", role: "institutions-and-mechanisms", heading: "How did leadership, mobility, and resource access connect?", narrativeRefs: [{ dossierId: "ruwalla-borderland-organization-dossier", sectionId: "how-did-leadership-work" }, { dossierId: "ruwalla-borderland-organization-dossier", sectionId: "why-did-mobility-and-territory-matter" }] },
        { id: "bounded-practice", role: "bounded-practice", heading: "What happened during the post-Ottoman border settlement?", narrativeRefs: [{ dossierId: "ruwalla-borderland-organization-dossier", sectionId: "how-did-new-states-change-the-relationship" }], entityRefs: [{ kind: "case", id: "ruwalla-borderland-organization" }, { kind: "case-episode", id: "ruwalla-borderland-1918-1936" }] },
        { id: "variants-disputes-and-limits", role: "variants-and-disputes", heading: "Whose voices do the sources preserve?", narrativeRefs: [{ dossierId: "ruwalla-borderland-organization-dossier", sectionId: "what-can-the-sources-establish" }], statementIds: ["ruwalla-archive-mediation"] },
        { id: "comparisons-and-next-steps", role: "comparisons-and-next-steps", heading: "What makes comparison responsible?", narrativeRefs: [{ dossierId: "ruwalla-borderland-organization-dossier", sectionId: "how-should-this-case-be-compared" }], statementIds: ["ruwalla-jinst-non-equivalence"] },
        { id: "open-questions", role: "open-questions", heading: "What remains unresolved?", researchObligationIds: ["ruwalla-nonelite-oral-perspectives", "ruwalla-shaykh-authority-variation", "ruwalla-border-distribution"] },
      ], reviewedAt: "2026-09-07",
    },
  },
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-jinst-postcollective-pastoral-governance",
      slug: "jinst-postcollective-pastoral-governance",
      label: "Jinst post-collective pastoral governance",
      description: "A bounded guide to household camps, reciprocal access, seasonal mobility, and state administration in Jinst sum during 1990–1997.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "case", id: "jinst-postcollective-pastoral-governance" },
      searchQueries: [
        { query: "Jinst herders" }, { query: "Mongolian pastoral governance" },
        { query: "pastoral government", disambiguation: "A bounded Jinst case, not a universal political type derived from livelihood." },
        { query: "nomadic government", disambiguation: "A case about resource coordination and mobility, not a definition of government by mobility." },
        { query: "Mongolian pasture commons", disambiguation: "Jinst institutions during a specific post-collective transition." },
      ],
      sections: [
        { id: "short-answer", role: "short-answer", heading: "How did Jinst herders coordinate pasture after the collectives?", narrativeRefs: [{ dossierId: "jinst-postcollective-pastoral-governance-dossier" }] },
        { id: "meanings-and-boundaries", role: "meanings-and-boundaries", heading: "Which groups and boundaries did the evidence identify?", narrativeRefs: [{ dossierId: "jinst-postcollective-pastoral-governance-dossier", sectionId: "whose-terms-and-boundaries-apply" }], statementIds: ["jinst-neg-nutgiinkhan-boundary"] },
        { id: "institutions-and-mechanisms", role: "institutions-and-mechanisms", heading: "How did households coordinate different resources?", narrativeRefs: [{ dossierId: "jinst-postcollective-pastoral-governance-dossier", sectionId: "how-were-resources-coordinated" }, { dossierId: "jinst-postcollective-pastoral-governance-dossier", sectionId: "why-were-boundaries-permeable" }] },
        { id: "bounded-practice", role: "bounded-practice", heading: "What changed between 1990 and 1997?", narrativeRefs: [{ dossierId: "jinst-postcollective-pastoral-governance-dossier", sectionId: "what-changed-after-the-collectives" }], entityRefs: [{ kind: "case", id: "jinst-postcollective-pastoral-governance" }, { kind: "case-episode", id: "jinst-transition-1990-1997" }] },
        { id: "variants-disputes-and-limits", role: "variants-and-disputes", heading: "Whose access was secure, and what does the study not show?", narrativeRefs: [{ dossierId: "jinst-postcollective-pastoral-governance-dossier", sectionId: "whose-access-was-secure" }, { dossierId: "jinst-postcollective-pastoral-governance-dossier", sectionId: "what-does-the-evidence-not-show" }] },
        { id: "comparisons-and-next-steps", role: "comparisons-and-next-steps", heading: "What makes comparison responsible?", narrativeRefs: [{ dossierId: "jinst-postcollective-pastoral-governance-dossier", sectionId: "how-should-this-case-be-compared" }], statementIds: ["ruwalla-jinst-non-equivalence"] },
        { id: "open-questions", role: "open-questions", heading: "What remains unresolved?", researchObligationIds: ["jinst-translation-oral-provenance", "jinst-access-inequality", "jinst-post-1997-continuity"] },
      ], reviewedAt: "2026-09-07",
    },
  },
] satisfies AuthoringDocument[];
