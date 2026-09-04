import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

export const analysisDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "collective-wage-earner-shareholding-authority",
      kind: "comparison-dimension",
      label: "Collective wage-earner shareholding authority",
      description: "An ordinal description of the corporate voting authority held through a collective wage-earner shareholding institution within a bounded design or episode.",
      definition: "The legally permitted and practically exercised capacity of a collective wage-earner shareholding institution to vote corporate shares, distinguished by whether that authority is absent, capped below control, uncapped but noncontrolling, or capable of control.",
      valueType: "ordinal",
      values: [
        { id: "absent", label: "Absent", description: "No collective wage-earner shareholding institution holds corporate voting authority in the stated scope.", order: 0 },
        { id: "capped-minority", label: "Capped minority", description: "The institution may vote shares, but a binding cap prevents a controlling stake in any covered firm.", order: 1 },
        { id: "uncapped-minority", label: "Uncapped minority", description: "The institution holds a noncontrolling stake without a binding rule that fixes it below control.", order: 2 },
        { id: "potential-control", label: "Potential control", description: "The institutional design permits collective voting holdings to reach control of a covered firm.", order: 3 },
      ],
      eligibleSubjectKinds: ["approach", "means", "case-episode"],
      method: "Classify a bounded subject from its formal voting-rights design, then qualify that placement with observed holdings and practice. Do not infer effective workplace control from share ownership alone.",
      normativeChoices: [
        "The scale describes corporate voting authority rather than judging whether collective ownership is desirable.",
        "A legal cap and practical exercise are considered together, while board appointment, workplace participation, and economy-wide ownership concentration remain separate questions.",
      ],
      knownCorrelationIds: [],
      limitations: [
        "The dimension does not measure direct worker participation, government appointment power, investment performance, or the distribution of beneficial ownership.",
        "Categories are specific to collective shareholding institutions and should not be generalized to an economy or political system.",
      ],
      statementIds: ["funds-statutory-design", "funds-practice", "funds-limited-control", "funds-abolished"],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
