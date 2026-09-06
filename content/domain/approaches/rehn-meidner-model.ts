import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

export const rehnMeidnerApproachDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "swedish-rehn-meidner-model",
      kind: "approach",
      label: "Swedish Rehn–Meidner model",
      description:
        "A Swedish trade-union economic-policy program combining solidaristic wage policy, active labor-market policy, and macroeconomic restraint in pursuit of employment, equity, price stability, and growth.",
      scope:
        "The policy model associated with Gösta Rehn and Rudolf Meidner and presented to the Swedish Trade Union Confederation in 1951; distinct from Sweden's uneven and partial application of its component policies.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Rehn–Meidner_model",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "equality-with-employment",
      kind: "end",
      label: "Equality with employment",
      description:
        "The joint pursuit of fairer wages and full employment while maintaining price stability and economic growth.",
      scope:
        "An End attributed here to the Rehn–Meidner program rather than a universal definition of equality or social democracy.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "solidaristic-wage-bargaining",
      kind: "means",
      label: "Solidaristic wage bargaining",
      description:
        "Coordinated collective bargaining that compresses wage differences by pursuing equal pay principles and prioritizing lower-paid groups.",
      institutionalForm:
        "Central framework bargaining among peak labor and employer organizations, followed by industry and workplace negotiations implementing the negotiated wage structure.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "active-labor-market-adjustment",
      kind: "means",
      label: "Active labor-market adjustment",
      description:
        "Public employment measures intended to sustain employment while helping labor move toward expanding firms and sectors.",
      institutionalForm:
        "Selective employment support combined with mobility-enhancing labor-market measures administered through Swedish labor-market institutions.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Active_labour_market_policies",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "restrictive-macroeconomic-demand-management",
      kind: "means",
      label: "Restrictive macroeconomic demand management",
      description:
        "Fiscal and monetary restraint intended to limit inflationary excess demand while selective measures sustain employment and adjustment.",
      institutionalForm:
        "Restrictive general fiscal policy over the business cycle, paired with selective employment and labor-market measures rather than a general commitment to permanent demand expansion.",
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
