import type { ExternalReference } from "./common";
import { reviewedOrientationLabels } from "./orientation-labels";
import {
  orientationOnlyReason,
  reviewedOrientationOnlyGuideSubjects,
  reviewedOrientationOnlyMappings,
} from "./orientation-only-mappings";
import { reviewedRejectedOrientationCandidates } from "./orientation-rejected-candidates";
export type ReviewedOrientationDecision = {
  targetType: "entity" | "subject-guide";
  id: string;
  disposition: "mapped" | "intentionally-unmatched";
  reason?: string;
  references: ExternalReference[];
  resolution?:
    | "direct-canonical-target"
    | {
        canonicalArticleTitle: string;
        canonicalArticleUrl: string;
        pageKind: "article";
        checkedAt: string;
        wikidataId?: string;
      };
  consideredCandidates?: Array<{
    title: string;
    url: string;
    boundary: string;
    resolution: {
      canonicalArticleTitle: string;
      canonicalArticleUrl: string;
      pageKind: "article";
      checkedAt: string;
      wikidataId?: string;
    };
  }>;
};
const baseReviewedOrientationLedger: ReviewedOrientationDecision[] = [
  {
    targetType: "entity",
    id: "accountability",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined evaluative criterion; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "active-labor-market-adjustment",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this specified institutional arrangement closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "anarchism",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Anarchism",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q6199",
        url: "https://www.wikidata.org/wiki/Q6199",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "anarchist-traditions",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined non-inheriting collection; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "anarcho-syndicalism",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this concept's authored boundary closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "anarcho-syndicalist-organizing",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this scoped project approach closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "andes-tawantinsuyu",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this authored place boundary closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "authority-and-accountability",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined analytical question; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "central-planning-arrangements",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined non-inheriting collection; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "centralized-solidaristic-bargaining-1956-1983",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this bounded episode closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "cmp-claimant-agencies",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this scoped organization closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "cmp-controlled-material-producers",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this scoped organization closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "cmp-operation-1943-1945",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this bounded episode closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "cmp-prime-contractors",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this scoped organization closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "collective-capital-formation",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this concept's authored boundary closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "collective-wage-earner-shareholding-authority",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined comparison lens; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "communism",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Communism",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q6186",
        url: "https://www.wikidata.org/wiki/Q6186",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "controlled-materials-allocation",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this specified institutional arrangement closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "democracy",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Democracy",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q7174",
        url: "https://www.wikidata.org/wiki/Q7174",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "democratic-selection-means",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined non-inheriting collection; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "democratic-traditions",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined non-inheriting collection; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "distribution",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined evaluative criterion; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "distribution-of-gains-and-ownership",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined analytical question; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "economic-democracy",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Economic_democracy",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-04",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "economic-planning",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this concept's authored boundary closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "electoral-representation",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this specified institutional arrangement closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "enacted-wage-earner-funds-1984-1991",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this bounded episode closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "equal-political-standing",
    disposition: "intentionally-unmatched",
    reason: "Attributed project record; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "equality-with-employment",
    disposition: "intentionally-unmatched",
    reason: "Attributed project record; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "freedom-as-nondomination",
    disposition: "intentionally-unmatched",
    reason: "Attributed project record; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "freedom-from-domination",
    disposition: "intentionally-unmatched",
    reason: "Attributed project record; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "institutional-abolition",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this concept's authored boundary closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "kahnawake",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Kahnawake",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q1014394",
        url: "https://www.wikidata.org/wiki/Q1014394",
        purpose: "identity",
        match: "close",
        checkedAt: "2026-09-06",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "kahnawake-cdmrp-2005-present",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this bounded episode closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "kahnawake-community-lawmaking",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this bounded case and period closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "liquidation-board-period-1992",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this bounded episode closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "market-coordination",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this concept's authored boundary closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "market-socialism",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Market_socialism",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-04",
      },
      {
        system: "wikidata",
        id: "Q268919",
        url: "https://www.wikidata.org/wiki/Q268919",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-04",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "neo-republican-nondomination",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this scoped project approach closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "planning-correctability",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined evaluative criterion; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "planning-information-and-coordination",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined analytical question; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "regional-wage-earner-fund-boards",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this specified institutional arrangement closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "representative-democratic-government",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this scoped project approach closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "republic",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Republic",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q7270",
        url: "https://www.wikidata.org/wiki/Q7270",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "republican-traditions",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined non-inheriting collection; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "restrictive-macroeconomic-demand-management",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this specified institutional arrangement closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "social-class",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this concept's authored boundary closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "social-democracy",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Social_democracy",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-04",
      },
      {
        system: "wikidata",
        id: "Q130471",
        url: "https://www.wikidata.org/wiki/Q130471",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-04",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "social-ownership",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Social_ownership",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-04",
      },
      {
        system: "wikidata",
        id: "Q1190277",
        url: "https://www.wikidata.org/wiki/Q1190277",
        purpose: "identity",
        match: "close",
        checkedAt: "2026-09-04",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "socialism",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Socialism",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q7272",
        url: "https://www.wikidata.org/wiki/Q7272",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "solidaristic-wage-bargaining",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this specified institutional arrangement closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "sortition-deliberative-minipublic",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this specified institutional arrangement closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "spain",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this authored place boundary closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "spanish-anarchist-initiatives-1936-1939",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this bounded case and period closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "spanish-anarchist-initiatives-war-episode",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this bounded episode closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "statelessness",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this concept's authored boundary closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "sweden",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Sweden",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-04",
      },
      {
        system: "wikidata",
        id: "Q34",
        url: "https://www.wikidata.org/wiki/Q34",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-04",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "swedish-rehn-meidner-model",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this scoped project approach closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "swedish-solidaristic-bargaining",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this bounded case and period closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "swedish-wage-earner-fund-program",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Employee_funds",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-04",
      },
      {
        system: "wikidata",
        id: "Q5374285",
        url: "https://www.wikidata.org/wiki/Q5374285",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-04",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "swedish-wage-earner-funds",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Employee_funds",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-04",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "tawantinsuyu-expansion-consolidation",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this bounded episode closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "tawantinsuyu-imperial-organization",
    disposition: "mapped",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Inca_Empire",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q28573",
        url: "https://www.wikidata.org/wiki/Q28573",
        purpose: "identity",
        match: "close",
        checkedAt: "2026-09-06",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "tawantinsuyu-succession-invasion",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this bounded episode closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "united-states",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this authored place boundary closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "us-controlled-materials-plan",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this bounded case and period closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "us-wartime-production-mobilization",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this scoped project approach closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "wage-earner-fund-board-abolition",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this bounded event closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "wage-earner-funds-to-liquidation",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined before/change/after sequence; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "wage-earner-influence",
    disposition: "intentionally-unmatched",
    reason: "Attributed project record; no external identity is asserted.",
    references: [],
  },
  {
    targetType: "entity",
    id: "war-production-board",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this scoped organization closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "worker-union-federation",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this specified institutional arrangement closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "wpb-requirements-committee",
    disposition: "intentionally-unmatched",
    reason:
      "No reviewed external page matches this scoped organization closely enough.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-anarchism",
    disposition: "mapped",
    reason: "Uses the reviewed mapping owned by anarchism.",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Anarchism",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q6199",
        url: "https://www.wikidata.org/wiki/Q6199",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "subject-guide",
    id: "guide-central-planning",
    disposition: "intentionally-unmatched",
    reason:
      "Its primary subject us-controlled-materials-plan has no defensible reviewed mapping.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-communism",
    disposition: "mapped",
    reason: "Uses the reviewed mapping owned by communism.",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Communism",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q6186",
        url: "https://www.wikidata.org/wiki/Q6186",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "subject-guide",
    id: "guide-democracy",
    disposition: "mapped",
    reason: "Uses the reviewed mapping owned by democracy.",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Democracy",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q7174",
        url: "https://www.wikidata.org/wiki/Q7174",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "subject-guide",
    id: "guide-economic-democracy",
    disposition: "mapped",
    reason: "Uses the reviewed mapping owned by economic-democracy.",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Economic_democracy",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-04",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "subject-guide",
    id: "guide-kahnawake-community-lawmaking",
    disposition: "intentionally-unmatched",
    reason:
      "Its primary subject kahnawake-community-lawmaking has no defensible reviewed mapping.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-republic",
    disposition: "mapped",
    reason: "Uses the reviewed mapping owned by republic.",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Republic",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q7270",
        url: "https://www.wikidata.org/wiki/Q7270",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "subject-guide",
    id: "guide-socialism",
    disposition: "mapped",
    reason: "Uses the reviewed mapping owned by socialism.",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Socialism",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q7272",
        url: "https://www.wikidata.org/wiki/Q7272",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "subject-guide",
    id: "guide-tawantinsuyu-imperial-organization",
    disposition: "mapped",
    reason:
      "Uses the reviewed mapping owned by tawantinsuyu-imperial-organization.",
    references: [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Inca_Empire",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q28573",
        url: "https://www.wikidata.org/wiki/Q28573",
        purpose: "identity",
        match: "close",
        checkedAt: "2026-09-06",
      },
    ],
    resolution: "direct-canonical-target",
  },
  {
    targetType: "entity",
    id: "affected-community-accountability",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined evaluative criterion “Affected-community accountability”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "agrarian-england",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “England”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "ahmedabad",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “Ahmedabad”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "authoritarianism",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Authoritarianism”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "autocracy",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Autocracy”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "bonjol-melayu-ulayat-governance",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Melayu-clan ulayat governance in Nagari Bonjol”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "bonjol-ulayat-governance-2000-2016",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Bonjol ulayat governance, 2000–2016”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "boston",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “Boston”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "business-firm",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Business firm”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "capitalism",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Capitalism”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "chiapas-zapatista-regions",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “Zapatista regions of Chiapas”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "china-dual-track-market-reforms",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “China’s economic reforms, 1978–1993”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "china-plan-market-coexistence-1978-1993",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Enterprise reform and non-state growth, 1978–1993”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "colonial-gold-coast-cocoa-region",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “Gold Coast cocoa-growing regions”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "combahee-organizing-episode",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Combahee organizing, 1974–1980”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "combahee-river-collective-1974-1980",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Combahee River Collective, Boston, 1974–1980”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "commodity-production",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Commodity production”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "conservatism",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Conservatism”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "dictatorship",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Dictatorship”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "england-and-wales",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “England and Wales”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "english-agrarian-market-dependence",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Agrarian change in England, c. 1450–1750”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "english-agrarian-transformation-1450-1750",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “English agrarian change, c. 1450–1750”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "fascism",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Fascism”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "fascist-movements",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined non-inheriting collection “Fascist movements”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "feminism",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Feminism”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "feminist-traditions",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined non-inheriting collection “Feminist traditions”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "finance",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Finance”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "germany",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “Germany”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "gold-coast-cocoa-expansion",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Gold Coast cocoa expansion, c. 1890–1936”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "gold-coast-cocoa-takeoff-1890-1936",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Gold Coast cocoa take-off, c. 1890–1936”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "historical-italian-fascism",
    disposition: "intentionally-unmatched",
    reason:
      "Scoped project approach “Historical Italian Fascism”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "iceland-modern-state",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “Iceland”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "iceland-parental-leave-2000-2018",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Iceland paid parental leave evidence, 2000–2018”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "iceland-parental-leave-outcomes-episode",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Iceland leave design and early outcomes”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "india",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “India”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "india-constitutional-rights-episode",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Indian constitutional-rights drafting and commencement”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "india-constitutional-rights-settlement-1946-1950",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “India's constitutional-rights settlement, 1946–1950”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "indigenous-autonomy",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Indigenous autonomy”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "institutional-formation",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Institutional formation”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "institutional-reorganization",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Institutional reorganization”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "italian-fascist-consolidated-rule",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Consolidated Fascist rule, 1925–1943”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "italian-fascist-dictatorship-1925-1943",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Italian Fascist dictatorship, 1925–1943”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "italy",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “Italy”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "japan",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “Japan”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "japan-constitutional-rights-episode",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Japanese constitutional-rights adoption and commencement”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "japan-constitutional-rights-settlement-1946-1947",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Japan's constitutional-rights settlement, 1946–1947”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "jinst-postcollective-pastoral-governance",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Jinst post-collective pastoral governance”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "jinst-sum",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “Jinst sum”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "jinst-transition-1990-1999",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Jinst transition after collective dissolution, 1990–1999”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "koto-tinggi-governance-2016",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Koto Tinggi governance documented in 2016”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "koto-tinggi-post-decentralization-governance",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Koto Tinggi nagari governance documented in 2016”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "legal-order",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Legal order”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "liberal-feminism",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Liberal feminism”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "liberalism",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Liberalism”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "linz-regime-analysis",
    disposition: "intentionally-unmatched",
    reason:
      "Scoped project approach “Linz's regime analysis”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "market-economy",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Market economy”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "marxist-feminism",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Marxist feminism”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "matriarchy",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Matriarchy”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "matriliny",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Matriliny”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "member-owned-cooperative-finance",
    disposition: "intentionally-unmatched",
    reason:
      "Specified institutional mechanism “Member-owned cooperative finance”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "mixed-economy",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Mixed economy”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "nagari-bonjol-dharmasraya",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “Nagari Bonjol, Dharmasraya”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "nagari-koto-tinggi-agam",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “Nagari Koto Tinggi, Agam”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "nazi-consolidation-1933",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Nazi consolidation in Germany, 1933”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "nazi-party-state-consolidation-1933",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Nazi party-state consolidation, 1933”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "nontransferable-parental-leave",
    disposition: "intentionally-unmatched",
    reason:
      "Specified institutional mechanism “Non-transferable paid parental leave”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "private-property",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Private property”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "radical-feminism",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Radical feminism”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "reform-era-china",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “People’s Republic of China”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "right-to-buy-england-wales-1980-1998",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Right to Buy in England and Wales, 1980–1998”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "right-to-buy-initial-operation",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Right to Buy evidence review”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "rotating-municipal-delegation",
    disposition: "intentionally-unmatched",
    reason:
      "Specified institutional mechanism “Rotating municipal delegation”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "ruwalla-borderland-1918-1936",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Ruwalla borderland bargaining, 1918–1936”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "ruwalla-borderland-organization",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Ruwalla organization across post-Ottoman borders”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "self-employed-worker-unionism",
    disposition: "intentionally-unmatched",
    reason:
      "Specified institutional mechanism “Self-employed worker unionism”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "sewa-ahmedabad-1972-1977",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “SEWA institutions in Ahmedabad, 1972–1977”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "sewa-ahmedabad-institutions-episode",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “SEWA union and cooperative formation”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "socialist-feminism",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Socialist feminism”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "southwestern-syrian-desert-wadi-sirhan",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “Southwestern Syrian Desert and Wadi Sirhan”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "swatantra-early-opposition-episode",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Swatantra's early opposition activity”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "swatantra-opposition-organization-1959-1967",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Swatantra's opposition organization, 1959–1967”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "totalitarianism",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Totalitarianism”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "totalitarianism-analyses",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined non-inheriting collection “Totalitarianism analyses”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "wage-labor",
    disposition: "intentionally-unmatched",
    reason:
      "Contested authored concept boundary “Wage labor”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "west-sumatra",
    disposition: "intentionally-unmatched",
    reason:
      "Authored geographic boundary “West Sumatra”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "zapatista-army-national-liberation",
    disposition: "intentionally-unmatched",
    reason:
      "Source-bounded organization record “Zapatista Army of National Liberation (EZLN)”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "zapatista-autonomy-chiapas-1994-present",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project case “Zapatista autonomy in Chiapas, 1994–present”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "zapatista-autonomy-reorganization-2023",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project event “Zapatista autonomy structure reorganized”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "zapatista-caracol-jbg-episode-2003-2023",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Caracol and Good Government Council episode, 2003–2023”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "zapatista-caracoles",
    disposition: "intentionally-unmatched",
    reason:
      "Source-bounded organization record “Zapatista caracoles”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "zapatista-caracoles-jbg-formation-announced-2003",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project event “Caracol and Good Government Council formation announced”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "zapatista-gal-successor-episode-2023-present",
    disposition: "intentionally-unmatched",
    reason:
      "Bounded project episode “Declared GAL successor structure, 2023–present”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "zapatista-good-government-councils",
    disposition: "intentionally-unmatched",
    reason:
      "Source-bounded organization record “Zapatista Good Government Councils”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "zapatista-jbg-to-gal-transition-2023",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined transition “From regional Good Government Councils to the declared GAL structure”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "zapatista-local-autonomous-governments",
    disposition: "intentionally-unmatched",
    reason:
      "Source-bounded organization record “Zapatista Local Autonomous Governments”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "zapatista-participation-and-inclusion",
    disposition: "intentionally-unmatched",
    reason:
      "Project-defined analytical challenge “Participation and inclusion”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "entity",
    id: "zapatista-support-base-communities",
    disposition: "intentionally-unmatched",
    reason:
      "Source-bounded organization record “Zapatista support-base communities”; no reviewed external page matches this exact target closely enough.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-authoritarianism",
    disposition: "intentionally-unmatched",
    reason:
      "The Authoritarianism guide remains unmatched because its primary subject has no independently reviewed direct canonical external target.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-capitalism",
    disposition: "intentionally-unmatched",
    reason:
      "The Capitalism guide remains unmatched because its primary subject has no independently reviewed direct canonical external target.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-conservatism",
    disposition: "intentionally-unmatched",
    reason:
      "The Conservatism guide remains unmatched because its primary subject has no independently reviewed direct canonical external target.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-fascism",
    disposition: "intentionally-unmatched",
    reason:
      "The Fascism guide remains unmatched because its primary subject has no independently reviewed direct canonical external target.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-feminism",
    disposition: "intentionally-unmatched",
    reason:
      "The Feminism guide remains unmatched because its primary subject has no independently reviewed direct canonical external target.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-jinst-postcollective-pastoral-governance",
    disposition: "intentionally-unmatched",
    reason:
      "The Jinst post-collective pastoral governance guide remains unmatched because its primary subject has no independently reviewed direct canonical external target.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-liberalism",
    disposition: "intentionally-unmatched",
    reason:
      "The Liberalism guide remains unmatched because its primary subject has no independently reviewed direct canonical external target.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-market-economy",
    disposition: "intentionally-unmatched",
    reason:
      "The Market Economy guide remains unmatched because its primary subject has no independently reviewed direct canonical external target.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-matriliny-property-authority",
    disposition: "intentionally-unmatched",
    reason:
      "The Does matriliny mean women rule? guide remains unmatched because its primary subject has no independently reviewed direct canonical external target.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-ruwalla-borderland-organization",
    disposition: "intentionally-unmatched",
    reason:
      "The Ruwalla organization across post-Ottoman borders guide remains unmatched because its primary subject has no independently reviewed direct canonical external target.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-totalitarianism",
    disposition: "intentionally-unmatched",
    reason:
      "The Totalitarianism guide remains unmatched because its primary subject has no independently reviewed direct canonical external target.",
    references: [],
  },
  ...[
    "constitutional-parliamentary-monarchy",
    "executive-authority",
    "japan-symbolic-emperorship-1947-2004",
    "japan-symbolic-emperorship-episode",
    "legislative-accountability",
    "monarchic-succession",
    "monarchism",
    "monarchy",
    "saudi-arabia",
    "saudi-basic-law-monarchy-1992-2022",
    "saudi-basic-law-monarchy-episode",
    "theocracy",
    "tonga",
    "tonga-constitutional-settlement-2010-2013",
    "tonga-post-reform-monarchy-episode",
  ].map((id) => ({
    targetType: "entity" as const,
    id,
    disposition: "intentionally-unmatched" as const,
    reason: `Reviewed orientation reconciliation for ${id}.`,
    references: [],
  })),
  {
    targetType: "entity",
    id: "executive-dynastic-monarchy",
    disposition: "intentionally-unmatched",
    reason:
      "The reviewed Absolute monarchy candidate does not directly match Herb's bounded analytical configuration because it would conflate ruling-family participation with legally unlimited power.",
    references: [],
  },
  {
    targetType: "subject-guide",
    id: "guide-monarchy",
    disposition: "intentionally-unmatched",
    reason: "The guide reuses the reviewed identity of its Monarchy subject.",
    references: [],
  },
];

const mapped = (
  article: string,
  id: string | undefined,
  match: "exact" | "close" = "exact",
  reason?: string,
): Omit<ReviewedOrientationDecision, "targetType" | "id"> => ({
  disposition: "mapped",
  ...(reason ? { reason } : {}),
  references: [
    {
      system: "wikipedia",
      url: `https://en.wikipedia.org/wiki/${article.replaceAll(" ", "_")}`,
      purpose: "orientation",
      language: "en",
      checkedAt: "2026-09-06",
    },
    ...(id
      ? [
          {
            system: "wikidata",
            id,
            url: `https://www.wikidata.org/wiki/${id}`,
            purpose: "identity",
            match,
            checkedAt: "2026-09-06",
          } as const,
        ]
      : []),
  ],
  resolution: {
    canonicalArticleTitle: article,
    canonicalArticleUrl: `https://en.wikipedia.org/wiki/${article.replaceAll(" ", "_")}`,
    pageKind: "article",
    checkedAt: "2026-09-06",
    ...(id ? { wikidataId: id } : {}),
  },
});

const reviewedMappingOverrides: Record<
  string,
  Omit<ReviewedOrientationDecision, "targetType" | "id">
> = {
  "entity:monarchy": mapped("Monarchy", "Q7269"),
  "entity:monarchism": mapped("Monarchism", "Q216669"),
  "entity:saudi-arabia": mapped("Saudi Arabia", "Q851"),
  "entity:theocracy": mapped("Theocracy", "Q44405"),
  "entity:tonga": mapped("Tonga", "Q678"),
  "subject-guide:guide-monarchy": mapped(
    "Monarchy",
    "Q7269",
    "exact",
    "Uses the reviewed mapping owned by monarchy.",
  ),
  "entity:accountability": mapped("Accountability", "Q2798912", "close"),
  "entity:authoritarianism": mapped("Authoritarianism", "Q6229"),
  "entity:anarcho-syndicalism": mapped("Anarcho-syndicalism", "Q188993"),
  "entity:anarcho-syndicalist-organizing": mapped(
    "Anarcho-syndicalism",
    undefined,
    "close",
    "The article directly situates this organizing approach within the broader ideology and movement; the project record keeps the approach boundary.",
  ),
  "entity:autocracy": mapped("Autocracy", "Q173424"),
  "entity:capitalism": mapped("Capitalism", "Q6206"),
  "entity:business-firm": mapped("Business", "Q4830453", "close"),
  "entity:conservatism": mapped("Conservatism", "Q7169"),
  "entity:dictatorship": mapped("Dictatorship", "Q317"),
  "entity:economic-planning": mapped("Economic planning", "Q3391448"),
  "entity:fascism": mapped("Fascism", "Q6223"),
  "entity:feminism": mapped("Feminism", "Q7252"),
  "entity:finance": mapped("Finance", "Q43015"),
  "entity:liberalism": mapped("Liberalism", "Q6216"),
  "entity:legal-order": mapped("Legal system", "Q858700", "close"),
  "entity:liberal-feminism": mapped("Liberal feminism", "Q1987244"),
  "entity:socialist-feminism": mapped("Socialist feminism", "Q2225347"),
  "entity:market-economy": mapped("Market economy", "Q179522"),
  "entity:totalitarianism": mapped("Totalitarianism", "Q128135"),
  "entity:matriliny": mapped("Matrilineality", "Q1136773"),
  "entity:matriarchy": mapped(
    "Matriarchy",
    "Q185681",
    "exact",
    "The canonical topic is the same disputed concept; the project scope preserves rival definitions and keeps it distinct from matriliny.",
  ),
  "entity:marxist-feminism": mapped("Marxist feminism", "Q1321958"),
  "entity:mixed-economy": mapped("Mixed economy", "Q191675"),
  "entity:private-property": mapped("Private property", "Q555911"),
  "entity:radical-feminism": mapped("Radical feminism", "Q2914207"),
  "entity:social-class": mapped("Social class", "Q187588"),
  "entity:sortition-deliberative-minipublic": mapped("Sortition", "Q70196"),
  "entity:wage-labor": mapped("Wage labour", "Q949973"),
  "entity:war-production-board": mapped("War Production Board", "Q1536750"),
  "entity:zapatista-army-national-liberation": mapped(
    "Zapatista Army of National Liberation",
    "Q188590",
  ),
  "entity:agrarian-england": mapped("England", "Q21"),
  "entity:ahmedabad": mapped("Ahmedabad", "Q1070"),
  "entity:boston": mapped("Boston", "Q100"),
  "entity:germany": mapped("Germany", "Q183"),
  "entity:iceland-modern-state": mapped("Iceland", "Q189"),
  "entity:india": mapped("India", "Q668"),
  "entity:italy": mapped("Italy", "Q38"),
  "entity:japan": mapped("Japan", "Q17"),
  "entity:reform-era-china": mapped("China", "Q148"),
  "entity:spain": mapped("Spain", "Q29"),
  "entity:united-states": mapped("United States", "Q30"),
  "entity:west-sumatra": mapped("West Sumatra", "Q2772"),
  "entity:england-and-wales": mapped("England and Wales", "Q1156248"),
  "entity:swedish-rehn-meidner-model": mapped(
    "Rehn–Meidner model",
    undefined,
    "close",
    "The article directly situates the Swedish policy package; the project Approach preserves its specified institutional scope.",
  ),
  "entity:jinst-sum": mapped(
    "Jinst",
    undefined,
    "close",
    "The article directly defines the same customary district institution; the project record preserves its situated historical scope.",
  ),
  "entity:active-labor-market-adjustment": mapped(
    "Active labour market policies",
    undefined,
    "close",
    "The article directly situates this adjustment instrument within a broader policy family; the project Means is the Swedish model's mobility-and-employment component.",
  ),
  "entity:market-coordination": mapped(
    "Market economy",
    undefined,
    "close",
    "The article directly explains market coordination, while the project keeps that coordination idea distinct from an entire economic system.",
  ),
  "entity:statelessness": mapped(
    "Stateless society",
    undefined,
    "close",
    "The article directly explains social organization without a state; the project record also preserves the distinction between an ideal and an observed condition.",
  ),
  "entity:central-planning-arrangements": mapped(
    "Economic planning",
    undefined,
    "close",
    "The article directly situates central planning, while the project record is a non-inheriting family of specified institutional Means.",
  ),
  "entity:andes-tawantinsuyu": mapped(
    "Inca Empire",
    undefined,
    "close",
    "The article directly situates Tawantinsuyu under its conventional English name; the project Place retains its bounded period and Indigenous name.",
  ),
  "entity:fascist-movements": mapped(
    "Fascism",
    undefined,
    "close",
    "The article directly situates the movements grouped here, while the project Collection remains non-inheriting and evidence-qualified.",
  ),
  "entity:totalitarianism-analyses": mapped(
    "Totalitarianism",
    undefined,
    "close",
    "The article directly situates the disputed analytic subject; the project Collection preserves distinct scholarly approaches.",
  ),
  "entity:historical-italian-fascism": mapped(
    "Fascism",
    undefined,
    "close",
    "The article directly situates Italian Fascism, while the project Approach is limited to its documented interwar doctrine and program.",
  ),
  "entity:republican-traditions": mapped(
    "Republicanism",
    undefined,
    "close",
    "The article directly situates the traditions grouped here, while the project Collection transmits no inherited commitments.",
  ),
  "entity:feminist-traditions": mapped(
    "Feminism",
    undefined,
    "close",
    "The article directly situates the traditions grouped here, while the project Collection preserves their conflicts and non-inheritance.",
  ),
  "entity:nontransferable-parental-leave": mapped(
    "Parental leave",
    undefined,
    "close",
    "The article directly explains the policy family, while the project Means isolates paid, individually reserved entitlement design.",
  ),
};

for (const [id, article] of Object.entries(reviewedOrientationOnlyMappings)) {
  const key = `entity:${id}`;
  if (reviewedMappingOverrides[key]) continue;
  const label =
    reviewedOrientationLabels[key as keyof typeof reviewedOrientationLabels];
  if (!label) continue;
  reviewedMappingOverrides[key] = mapped(
    article,
    undefined,
    "close",
    orientationOnlyReason(label, article),
  );
}

for (const [guideId, subjectId] of Object.entries(
  reviewedOrientationOnlyGuideSubjects,
)) {
  const subject = reviewedMappingOverrides[`entity:${subjectId}`];
  if (subject)
    reviewedMappingOverrides[`subject-guide:${guideId}`] = {
      ...subject,
      reason: `Uses the reviewed orientation-only mapping owned by ${subjectId}.`,
    };
}

const reviewedUnmatched = (
  decision: ReviewedOrientationDecision,
): ReviewedOrientationDecision => {
  if (decision.disposition !== "intentionally-unmatched") return decision;
  const key = `${decision.targetType}:${decision.id}`;
  const candidate =
    reviewedRejectedOrientationCandidates[
      key as keyof typeof reviewedRejectedOrientationCandidates
    ];
  if (!candidate) return decision;
  return {
    ...decision,
    reason: `Candidate reviewed: ${candidate.title}; rejected because ${candidate.boundary}`,
    consideredCandidates: [
      {
        ...candidate,
        resolution: {
          canonicalArticleTitle: candidate.title,
          canonicalArticleUrl: candidate.url,
          pageKind: "article",
          checkedAt: "2026-09-06",
        },
      },
    ],
  };
};

for (const [guideId, subjectId] of [
  ["guide-authoritarianism", "authoritarianism"],
  ["guide-capitalism", "capitalism"],
  ["guide-conservatism", "conservatism"],
  ["guide-fascism", "fascism"],
  ["guide-feminism", "feminism"],
  ["guide-liberalism", "liberalism"],
  ["guide-market-economy", "market-economy"],
  ["guide-matriliny-property-authority", "matriliny"],
  ["guide-totalitarianism", "totalitarianism"],
] as const) {
  const subject = reviewedMappingOverrides[`entity:${subjectId}`];
  if (subject)
    reviewedMappingOverrides[`subject-guide:${guideId}`] = {
      ...subject,
      reason: `Uses the reviewed mapping owned by ${subjectId}.`,
    };
}

export const reviewedOrientationLedger: ReviewedOrientationDecision[] =
  baseReviewedOrientationLedger.map((decision) => {
    const override =
      reviewedMappingOverrides[`${decision.targetType}:${decision.id}`];
    const reviewed = reviewedUnmatched(
      override
        ? { targetType: decision.targetType, id: decision.id, ...override }
        : decision,
    );
    if (
      reviewed.disposition !== "mapped" ||
      typeof reviewed.resolution !== "string"
    )
      return reviewed;
    const wikipedia = reviewed.references.find(
      ({ system }) => system === "wikipedia",
    );
    const wikidata = reviewed.references.find(
      ({ system }) => system === "wikidata",
    );
    if (!wikipedia) return reviewed;
    return {
      ...reviewed,
      resolution: {
        canonicalArticleTitle: decodeURIComponent(
          wikipedia.url.split("/wiki/")[1] ?? "",
        ).replaceAll("_", " "),
        canonicalArticleUrl: wikipedia.url,
        pageKind: "article",
        checkedAt: "2026-09-06",
        ...(wikidata?.id ? { wikidataId: wikidata.id } : {}),
      },
    };
  });
