import type { AuthoringDocument } from "../../../src/lib/domain";

export const kahnawakeCommunityDecisionMakingGuideDocuments = [
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-kahnawake-community-lawmaking",
      slug: "kahnawake-community-lawmaking",
      label: "Kahnawà:ke community law-making",
      description:
        "Kahnawà:ke’s Community Decision Making and Review Process combines hearings and consensus with an elected council and legislative commission. It is an evolving arrangement shaped by Kanien’kehá:ka commitments and Canadian colonial law, not evidence for a universal Indigenous or ‘tribal’ system.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "case", id: "kahnawake-community-lawmaking" },
      searchQueries: [
        { query: "Kahnawà:ke community law-making" },
        { query: "Kahnawà:ke decision making" },
        {
          query: "tribal organization",
          disambiguation:
            "A bounded Kahnawà:ke case that explains why tribe is not a universal political category.",
        },
        {
          query: "tribal government",
          disambiguation:
            "A bounded Kahnawà:ke case, not a definition of Indigenous governments in general.",
        },
        { query: "Indigenous consensus government" },
      ],
      sections: [
        {
          id: "short-answer",
          role: "short-answer",
          heading:
            "What is the Kahnawà:ke Community Decision Making and Review Process?",
          narrativeRefs: [{ dossierId: "kahnawake-community-lawmaking-dossier" }],
        },
        {
          id: "meanings-and-boundaries",
          role: "meanings-and-boundaries",
          heading: "Whose terms describe this community and process?",
          narrativeRefs: [
            {
              dossierId: "kahnawake-community-lawmaking-dossier",
              sectionId: "whose-terms-describe-the-community",
            },
            {
              dossierId: "kahnawake-community-lawmaking-dossier",
              sectionId: "is-this-simply-traditional-government",
            },
          ],
          statementIds: [
            "tribe-not-universal-political-form",
            "tribe-colonial-evolutionary-history",
            "indian-act-band-administrative-definition",
            "kahnawake-community-self-description",
            "kahnawake-case-not-tribal-embodiment",
          ],
        },
        {
          id: "institutions-and-mechanisms",
          role: "institutions-and-mechanisms",
          heading: "How does the process work?",
          narrativeRefs: [
            {
              dossierId: "kahnawake-community-lawmaking-dossier",
              sectionId: "how-does-the-process-work",
            },
          ],
          statementIds: [
            "kahnawake-consensus-process-definition",
            "kahnawake-cdmrp-type-one-design",
            "kahnawake-cdmrp-2024-hearing-rule-change",
            "kahnawake-cdmrp-2024-revised-hearing-rule",
            "kahnawake-cdmrp-type-two-design",
          ],
        },
        {
          id: "bounded-practice",
          role: "bounded-practice",
          heading: "What does evidence about participation show?",
          narrativeRefs: [
            {
              dossierId: "kahnawake-community-lawmaking-dossier",
              sectionId: "what-do-we-know-about-practice",
            },
          ],
          entityRefs: [
            { kind: "case", id: "kahnawake-community-lawmaking" },
            { kind: "case-episode", id: "kahnawake-cdmrp-2005-present" },
          ],
        },
        {
          id: "variants-disputes-and-limits",
          role: "variants-and-disputes",
          heading: "What does this case not establish?",
          narrativeRefs: [
            {
              dossierId: "kahnawake-community-lawmaking-dossier",
              sectionId: "what-does-this-case-establish",
            },
          ],
          statementIds: [
            "kahnawake-cdmrp-trust-contestation",
            "kahnawake-cdmrp-survey-sampling-limit",
          ],
        },
        {
          id: "comparisons-and-next-steps",
          role: "comparisons-and-next-steps",
          heading: "Which distinction should guide further comparison?",
          statementIds: ["indian-act-band-council-definition"],
        },
        {
          id: "open-questions",
          role: "open-questions",
          heading: "What remains unresolved?",
          researchObligationIds: [
            "kahnawake-cdmrp-current-hearing-rules",
            "kahnawake-cdmrp-participation-representativeness",
            "kahnawake-governing-authority-legitimacy",
            "kahnawake-cdmrp-jurisdiction-enforcement",
          ],
        },
      ],
      reviewedAt: "2026-09-05",
    },
  },
] satisfies AuthoringDocument[];
