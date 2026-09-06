import type { ExternalReference } from "./common";
export type ReviewedOrientationDecision = { targetType: "entity" | "subject-guide"; id: string; disposition: "mapped" | "intentionally-unmatched"; reason?: string; references: ExternalReference[]; resolution?: "direct-canonical-target"; };
export const reviewedOrientationLedger: ReviewedOrientationDecision[] = [
  {
    "targetType": "entity",
    "id": "accountability",
    "disposition": "intentionally-unmatched",
    "reason": "Project-defined evaluative criterion; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "active-labor-market-adjustment",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this specified institutional arrangement closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "anarchism",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Anarchism",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-06"
      },
      {
        "system": "wikidata",
        "id": "Q6199",
        "url": "https://www.wikidata.org/wiki/Q6199",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-06"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "anarchist-traditions",
    "disposition": "intentionally-unmatched",
    "reason": "Project-defined non-inheriting collection; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "anarcho-syndicalism",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this concept's authored boundary closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "anarcho-syndicalist-organizing",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this scoped project approach closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "andes-tawantinsuyu",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this authored place boundary closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "authority-and-accountability",
    "disposition": "intentionally-unmatched",
    "reason": "Project-defined analytical question; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "central-planning-arrangements",
    "disposition": "intentionally-unmatched",
    "reason": "Project-defined non-inheriting collection; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "centralized-solidaristic-bargaining-1956-1983",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this bounded episode closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "cmp-claimant-agencies",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this scoped organization closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "cmp-controlled-material-producers",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this scoped organization closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "cmp-operation-1943-1945",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this bounded episode closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "cmp-prime-contractors",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this scoped organization closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "collective-capital-formation",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this concept's authored boundary closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "collective-wage-earner-shareholding-authority",
    "disposition": "intentionally-unmatched",
    "reason": "Project-defined comparison lens; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "communism",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Communism",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-06"
      },
      {
        "system": "wikidata",
        "id": "Q6186",
        "url": "https://www.wikidata.org/wiki/Q6186",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-06"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "controlled-materials-allocation",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this specified institutional arrangement closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "democracy",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Democracy",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-06"
      },
      {
        "system": "wikidata",
        "id": "Q7174",
        "url": "https://www.wikidata.org/wiki/Q7174",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-06"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "democratic-selection-means",
    "disposition": "intentionally-unmatched",
    "reason": "Project-defined non-inheriting collection; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "democratic-traditions",
    "disposition": "intentionally-unmatched",
    "reason": "Project-defined non-inheriting collection; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "distribution",
    "disposition": "intentionally-unmatched",
    "reason": "Project-defined evaluative criterion; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "distribution-of-gains-and-ownership",
    "disposition": "intentionally-unmatched",
    "reason": "Project-defined analytical question; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "economic-democracy",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Economic_democracy",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-04"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "economic-planning",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this concept's authored boundary closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "electoral-representation",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this specified institutional arrangement closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "enacted-wage-earner-funds-1984-1991",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this bounded episode closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "equal-political-standing",
    "disposition": "intentionally-unmatched",
    "reason": "Attributed project record; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "equality-with-employment",
    "disposition": "intentionally-unmatched",
    "reason": "Attributed project record; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "freedom-as-nondomination",
    "disposition": "intentionally-unmatched",
    "reason": "Attributed project record; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "freedom-from-domination",
    "disposition": "intentionally-unmatched",
    "reason": "Attributed project record; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "institutional-abolition",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this concept's authored boundary closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "kahnawake",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Kahnawake",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-06"
      },
      {
        "system": "wikidata",
        "id": "Q1014394",
        "url": "https://www.wikidata.org/wiki/Q1014394",
        "purpose": "identity",
        "match": "close",
        "checkedAt": "2026-09-06"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "kahnawake-cdmrp-2005-present",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this bounded episode closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "kahnawake-community-lawmaking",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this bounded case and period closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "liquidation-board-period-1992",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this bounded episode closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "market-coordination",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this concept's authored boundary closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "market-socialism",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Market_socialism",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-04"
      },
      {
        "system": "wikidata",
        "id": "Q268919",
        "url": "https://www.wikidata.org/wiki/Q268919",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-04"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "neo-republican-nondomination",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this scoped project approach closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "planning-correctability",
    "disposition": "intentionally-unmatched",
    "reason": "Project-defined evaluative criterion; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "planning-information-and-coordination",
    "disposition": "intentionally-unmatched",
    "reason": "Project-defined analytical question; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "regional-wage-earner-fund-boards",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this specified institutional arrangement closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "representative-democratic-government",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this scoped project approach closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "republic",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Republic",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-06"
      },
      {
        "system": "wikidata",
        "id": "Q7270",
        "url": "https://www.wikidata.org/wiki/Q7270",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-06"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "republican-traditions",
    "disposition": "intentionally-unmatched",
    "reason": "Project-defined non-inheriting collection; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "restrictive-macroeconomic-demand-management",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this specified institutional arrangement closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "social-class",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this concept's authored boundary closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "social-democracy",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Social_democracy",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-04"
      },
      {
        "system": "wikidata",
        "id": "Q130471",
        "url": "https://www.wikidata.org/wiki/Q130471",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-04"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "social-ownership",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Social_ownership",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-04"
      },
      {
        "system": "wikidata",
        "id": "Q1190277",
        "url": "https://www.wikidata.org/wiki/Q1190277",
        "purpose": "identity",
        "match": "close",
        "checkedAt": "2026-09-04"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "socialism",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Socialism",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-06"
      },
      {
        "system": "wikidata",
        "id": "Q7272",
        "url": "https://www.wikidata.org/wiki/Q7272",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-06"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "solidaristic-wage-bargaining",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this specified institutional arrangement closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "sortition-deliberative-minipublic",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this specified institutional arrangement closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "spain",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this authored place boundary closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "spanish-anarchist-initiatives-1936-1939",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this bounded case and period closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "spanish-anarchist-initiatives-war-episode",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this bounded episode closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "statelessness",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this concept's authored boundary closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "sweden",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Sweden",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-04"
      },
      {
        "system": "wikidata",
        "id": "Q34",
        "url": "https://www.wikidata.org/wiki/Q34",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-04"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "swedish-rehn-meidner-model",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this scoped project approach closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "swedish-solidaristic-bargaining",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this bounded case and period closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "swedish-wage-earner-fund-program",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Employee_funds",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-04"
      },
      {
        "system": "wikidata",
        "id": "Q5374285",
        "url": "https://www.wikidata.org/wiki/Q5374285",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-04"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "swedish-wage-earner-funds",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Employee_funds",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-04"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "tawantinsuyu-expansion-consolidation",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this bounded episode closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "tawantinsuyu-imperial-organization",
    "disposition": "mapped",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Inca_Empire",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-06"
      },
      {
        "system": "wikidata",
        "id": "Q28573",
        "url": "https://www.wikidata.org/wiki/Q28573",
        "purpose": "identity",
        "match": "close",
        "checkedAt": "2026-09-06"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "entity",
    "id": "tawantinsuyu-succession-invasion",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this bounded episode closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "united-states",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this authored place boundary closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "us-controlled-materials-plan",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this bounded case and period closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "us-wartime-production-mobilization",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this scoped project approach closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "wage-earner-fund-board-abolition",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this bounded event closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "wage-earner-funds-to-liquidation",
    "disposition": "intentionally-unmatched",
    "reason": "Project-defined before/change/after sequence; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "wage-earner-influence",
    "disposition": "intentionally-unmatched",
    "reason": "Attributed project record; no external identity is asserted.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "war-production-board",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this scoped organization closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "worker-union-federation",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this specified institutional arrangement closely enough.",
    "references": []
  },
  {
    "targetType": "entity",
    "id": "wpb-requirements-committee",
    "disposition": "intentionally-unmatched",
    "reason": "No reviewed external page matches this scoped organization closely enough.",
    "references": []
  },
  {
    "targetType": "subject-guide",
    "id": "guide-anarchism",
    "disposition": "mapped",
    "reason": "Uses the reviewed mapping owned by anarchism.",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Anarchism",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-06"
      },
      {
        "system": "wikidata",
        "id": "Q6199",
        "url": "https://www.wikidata.org/wiki/Q6199",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-06"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "subject-guide",
    "id": "guide-central-planning",
    "disposition": "intentionally-unmatched",
    "reason": "Its primary subject us-controlled-materials-plan has no defensible reviewed mapping.",
    "references": []
  },
  {
    "targetType": "subject-guide",
    "id": "guide-communism",
    "disposition": "mapped",
    "reason": "Uses the reviewed mapping owned by communism.",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Communism",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-06"
      },
      {
        "system": "wikidata",
        "id": "Q6186",
        "url": "https://www.wikidata.org/wiki/Q6186",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-06"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "subject-guide",
    "id": "guide-democracy",
    "disposition": "mapped",
    "reason": "Uses the reviewed mapping owned by democracy.",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Democracy",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-06"
      },
      {
        "system": "wikidata",
        "id": "Q7174",
        "url": "https://www.wikidata.org/wiki/Q7174",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-06"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "subject-guide",
    "id": "guide-economic-democracy",
    "disposition": "mapped",
    "reason": "Uses the reviewed mapping owned by economic-democracy.",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Economic_democracy",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-04"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "subject-guide",
    "id": "guide-kahnawake-community-lawmaking",
    "disposition": "intentionally-unmatched",
    "reason": "Its primary subject kahnawake-community-lawmaking has no defensible reviewed mapping.",
    "references": []
  },
  {
    "targetType": "subject-guide",
    "id": "guide-republic",
    "disposition": "mapped",
    "reason": "Uses the reviewed mapping owned by republic.",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Republic",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-06"
      },
      {
        "system": "wikidata",
        "id": "Q7270",
        "url": "https://www.wikidata.org/wiki/Q7270",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-06"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "subject-guide",
    "id": "guide-socialism",
    "disposition": "mapped",
    "reason": "Uses the reviewed mapping owned by socialism.",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Socialism",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-06"
      },
      {
        "system": "wikidata",
        "id": "Q7272",
        "url": "https://www.wikidata.org/wiki/Q7272",
        "purpose": "identity",
        "match": "exact",
        "checkedAt": "2026-09-06"
      }
    ],
    "resolution": "direct-canonical-target"
  },
  {
    "targetType": "subject-guide",
    "id": "guide-tawantinsuyu-imperial-organization",
    "disposition": "mapped",
    "reason": "Uses the reviewed mapping owned by tawantinsuyu-imperial-organization.",
    "references": [
      {
        "system": "wikipedia",
        "url": "https://en.wikipedia.org/wiki/Inca_Empire",
        "purpose": "orientation",
        "language": "en",
        "checkedAt": "2026-09-06"
      },
      {
        "system": "wikidata",
        "id": "Q28573",
        "url": "https://www.wikidata.org/wiki/Q28573",
        "purpose": "identity",
        "match": "close",
        "checkedAt": "2026-09-06"
      }
    ],
    "resolution": "direct-canonical-target"
  }
];
