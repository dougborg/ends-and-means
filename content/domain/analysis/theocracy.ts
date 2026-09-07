import type { AuthoringDocument } from "../../../src/lib/domain";

export const theocracyAnalysisDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "religiously-grounded-governing-authority",
      kind: "comparison-dimension",
      label: "Religiously grounded governing authority",
      description:
        "A categorical description of which state powers a religious office or authoritative religious-law institution holds within a bounded design or episode.",
      definition:
        "Classifies the highest evidenced allocation of formal state authority to a religious office or authoritative religious-law institution, while keeping influence, legal recognition, review, and plenary authority distinct.",
      valueType: "ordinal",
      values: [
        {
          id: "influence-or-recognition",
          label: "Influence or recognition",
          description:
            "Religion is publicly influential or officially recognized without evidenced governing power assigned to a religious office or authoritative religious-law institution.",
          order: 0,
        },
        {
          id: "bounded-legal-review",
          label: "Bounded legal review",
          description:
            "A religious office or religious-law institution exercises binding review in a specified domain without plenary state authority.",
          order: 1,
        },
        {
          id: "cross-branch-supervision",
          label: "Cross-branch supervision",
          description:
            "Religiously qualified offices exercise binding powers across multiple state branches while other constitutional institutions retain assigned authority.",
          order: 2,
        },
        {
          id: "plenary-religious-office",
          label: "Plenary religious office",
          description:
            "A religious officeholder holds ultimate legislative, executive, and judicial state authority, whether or not ordinary functions are delegated.",
          order: 3,
        },
      ],
      eligibleSubjectKinds: ["case-episode"],
      method:
        "Use constitutional text and institution-specific evidence to identify formal legal authority. Place only a bounded episode, distinguish delegated exercise from ultimate authority, and separately describe rules in use.",
      normativeChoices: [
        "The dimension describes institutional authority and does not judge a religion, its truth claims, or its adherents.",
        "The categories privilege legally consequential authority over demographics, symbolism, advocacy, or polemical labels.",
      ],
      knownCorrelationIds: [],
      limitations: [
        "Formal authority may diverge from practice, coercive capacity, electoral competition, or judicial independence.",
        "Categories may not travel cleanly across theological and legal vocabularies; translation and local institutional history remain necessary.",
      ],
      statementIds: [
        "theocracy-state-religion-boundary",
        "theocracy-religious-law-boundary",
        "iran-classification-qualified",
        "vatican-classification-qualified",
      ],
      publicationStatus: "reviewed",
    },
  },
] satisfies AuthoringDocument[];
