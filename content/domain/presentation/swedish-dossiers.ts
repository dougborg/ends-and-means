import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = {
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-05",
};

export const dossierDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "swedish-wage-earner-fund-program-dossier",
      kind: "dossier",
      label: "Swedish wage-earner fund program dossier",
      description:
        "A narrative orientation to the program's purposes, institutional mechanism, enacted limits, and end.",
      subject: { kind: "approach", id: "swedish-wage-earner-fund-program" },
      standfirst:
        "Sweden's wage-earner fund program tried to turn a share of payroll and corporate profits into collectively held capital, joining practical investment policy to a contested ambition for broader ownership and wage-earner influence.",
      sections: [
        {
          id: "the-problem-it-addressed",
          heading: "The problem it tried to address",
          body: "The enacted proposal attributed several purposes to the funds: spreading wealth, giving wage earners influence through co-ownership, supplying investment capital, and supporting pensions.",
          traceStatus: "supported",
          statementIds: ["funds-declared-ends"],
          relatedEntityRefs: [
            { kind: "end", id: "wage-earner-influence" },
            { kind: "challenge", id: "distribution-of-gains-and-ownership" },
          ],
        },
        {
          id: "the-enacted-mechanism",
          heading: "The mechanism that was enacted",
          body: "The compromise created five government-appointed boards inside the public pension-fund system. The boards invested collectively financed capital under statutory ownership and voting caps.",
          traceStatus: "supported",
          statementIds: ["funds-statutory-design"],
          relatedEntityRefs: [
            { kind: "means", id: "regional-wage-earner-fund-boards" },
            { kind: "case", id: "swedish-wage-earner-funds" },
          ],
        },
        {
          id: "why-program-and-practice-differ",
          heading: "Why the ambition and the outcome differ",
          body: "The funds generally behaved as diversified long-term investors. Their holdings remained noncontrolling, so the enacted arrangement connected collective capital formation to economic democracy without achieving the stronger transfer of control associated with earlier proposals.",
          traceStatus: "qualified",
          statementIds: [
            "funds-practice",
            "funds-limited-control",
            "funds-partial-instantiation",
            "funds-related-ideas-classification",
          ],
          relatedEntityRefs: [
            { kind: "concept", id: "economic-democracy" },
            { kind: "concept", id: "collective-capital-formation" },
          ],
        },
        {
          id: "a-contested-and-reversible-institution",
          heading: "A contested and reversible institution",
          body: "The five boards operated through 1991. The incoming center-right government abolished them at the turn of 1991–1992, making political durability a qualified part of the program's practical record.",
          traceStatus: "qualified",
          statementIds: ["funds-abolished", "funds-accountability-assessment"],
          relatedEntityRefs: [
            { kind: "transition", id: "wage-earner-funds-to-liquidation" },
            { kind: "challenge", id: "authority-and-accountability" },
          ],
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "swedish-wage-earner-funds-case-dossier",
      kind: "dossier",
      label: "Swedish wage-earner funds case dossier",
      description:
        "A plain-language account of the bounded 1983–1992 wage-earner-fund case.",
      subject: { kind: "case", id: "swedish-wage-earner-funds" },
      standfirst:
        "From 1984 through 1991, five Swedish public pension-fund boards invested collectively financed capital under rules intended to widen ownership and wage-earner influence—but their holdings and authority remained deliberately limited.",
      sections: [
        {
          id: "what-the-funds-were",
          heading: "What the funds were",
          body: "A rough modern analogy is a public investment fund: collectively financed money was pooled and invested in financial assets. The five government-appointed boards operated inside the public pension-fund system and were tied to stated purposes including wider ownership and wage-earner influence.",
          traceStatus: "supported",
          statementIds: ["funds-statutory-design", "funds-declared-ends"],
          relatedEntityRefs: [
            { kind: "case-episode", id: "enacted-wage-earner-funds-1984-1991" },
          ],
        },
        {
          id: "what-they-were-meant-to-do",
          heading: "What they were meant to do",
          body: "The proposal presented collective shareholding as a way to distribute growing corporate wealth more evenly, strengthen wage-earner influence, provide risk capital, and reinforce the pension system.",
          traceStatus: "supported",
          statementIds: ["funds-declared-ends"],
          relatedEntityRefs: [
            { kind: "approach", id: "swedish-wage-earner-fund-program" },
          ],
        },
        {
          id: "what-they-did-in-practice",
          heading: "What they did in practice",
          body: "The boards generally invested as diversified long-term shareholders. By 1991 their combined holdings represented about 2.6 percent of exchange value, and they had not become controlling owners.",
          traceStatus: "supported",
          statementIds: ["funds-practice", "funds-limited-control"],
          relatedEntityRefs: [
            {
              kind: "comparison-dimension",
              id: "collective-wage-earner-shareholding-authority",
            },
          ],
        },
        {
          id: "why-the-case-matters",
          heading: "Why the case matters",
          body: "The episode shows why a stated purpose, an institutional design, and an observed result must be kept separate. It created collective capital holdings, but the evidence here does not establish controlling ownership, broad wealth redistribution, or settled accountability—and the boards were abolished after a change of government.",
          traceStatus: "qualified",
          statementIds: [
            "funds-distribution-assessment",
            "funds-accountability-assessment",
            "funds-abolished",
          ],
          relatedEntityRefs: [
            { kind: "criterion", id: "distribution" },
            { kind: "criterion", id: "accountability" },
          ],
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "swedish-rehn-meidner-model-dossier",
      kind: "dossier",
      label: "Swedish Rehn–Meidner model dossier",
      description:
        "A narrative orientation to the model's joint objectives, policy mechanisms, partial application, and empirical limits.",
      subject: { kind: "approach", id: "swedish-rehn-meidner-model" },
      standfirst:
        "The Rehn–Meidner model was a coordinated Swedish trade-union policy program: compress wages, help workers move toward more productive employment, and restrain inflation while pursuing full employment and growth.",
      sections: [
        {
          id: "several-goals-at-once",
          heading: "A model built around several goals at once",
          body: "Gösta Rehn and Rudolf Meidner sought to combine full employment and fairer wages with price stability and economic growth. The interest of the model lies in treating those aims as a joint institutional problem rather than choosing only one.",
          traceStatus: "supported",
          statementIds: ["rehn-meidner-declared-objectives"],
          relatedEntityRefs: [{ kind: "end", id: "equality-with-employment" }],
        },
        {
          id: "how-the-parts-were-meant-to-work",
          heading: "How the parts were meant to work together",
          body: "Solidaristic bargaining would narrow wage differences; active labor-market measures would support employment and movement toward expanding activities; restrictive general macroeconomic policy would limit inflationary excess demand. The model depended on the combination, not on wage bargaining alone.",
          traceStatus: "supported",
          statementIds: [
            "rehn-meidner-policy-combination",
            "active-labor-market-adjustment-design",
            "restrictive-macroeconomic-policy-design",
          ],
          relatedEntityRefs: [
            { kind: "means", id: "solidaristic-wage-bargaining" },
            { kind: "means", id: "active-labor-market-adjustment" },
            {
              kind: "means",
              id: "restrictive-macroeconomic-demand-management",
            },
          ],
        },
        {
          id: "a-model-not-a-name-for-sweden",
          heading: "A model, not a name for Sweden",
          body: "The program became influential in a social-democratic setting shaped by organized labor, but Sweden never applied the complete package consistently. Its strongest period of influence combined only some of the model's components.",
          traceStatus: "qualified",
          statementIds: [
            "rehn-meidner-social-democratic-context",
            "rehn-meidner-partial-swedish-application",
            "swedish-active-labor-market-policy-expansion",
          ],
          relatedEntityRefs: [
            { kind: "case", id: "swedish-solidaristic-bargaining" },
            { kind: "concept", id: "social-democracy" },
          ],
        },
        {
          id: "what-the-bounded-evidence-supports",
          heading: "What the bounded evidence supports",
          body: "Swedish wages compressed sharply from the late 1960s, especially during the 1970s. Research supports a productivity contribution from narrower interindustry wage gaps, but not from wage leveling within industries and workplaces; another study also cautions against attributing Sweden's earlier restructuring peak to the later wage compression.",
          traceStatus: "qualified",
          statementIds: [
            "solidaristic-wage-compression-timing",
            "wage-compression-restructuring-qualification",
            "interindustry-compression-productivity-result",
          ],
          relatedEntityRefs: [
            {
              kind: "case-episode",
              id: "centralized-solidaristic-bargaining-1956-1983",
            },
          ],
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "swedish-solidaristic-bargaining-case-dossier",
      kind: "dossier",
      label: "Swedish solidaristic bargaining case dossier",
      description:
        "A narrative account of Sweden's bounded 1956–1983 centralized bargaining episode.",
      subject: { kind: "case", id: "swedish-solidaristic-bargaining" },
      standfirst:
        "Between 1956 and 1983, Swedish peak labor and employer organizations negotiated central wage frameworks whose implementation and outcomes provide a bounded test of one part of the Rehn–Meidner model.",
      sections: [
        {
          id: "the-institutional-arrangement",
          heading: "The institutional arrangement",
          body: "Peak labor and employer organizations negotiated central wage frameworks, while industry and workplace bargaining implemented them. The result was coordinated bargaining, not one wage imposed uniformly from the center.",
          traceStatus: "supported",
          statementIds: ["centralized-solidaristic-bargaining-form"],
          relatedEntityRefs: [
            { kind: "means", id: "solidaristic-wage-bargaining" },
          ],
        },
        {
          id: "its-place-in-the-model",
          heading: "Its place in the model",
          body: "Solidaristic bargaining was one component of the Rehn–Meidner program. Sweden combined it with an expansion of active labor-market policy, but did not consistently apply the complete package.",
          traceStatus: "qualified",
          statementIds: [
            "rehn-meidner-policy-combination",
            "rehn-meidner-partial-swedish-application",
            "swedish-active-labor-market-policy-expansion",
          ],
          relatedEntityRefs: [
            { kind: "approach", id: "swedish-rehn-meidner-model" },
          ],
        },
        {
          id: "what-changed-and-when",
          heading: "What changed—and when",
          body: "Wage inequality remained comparatively stable until the late 1960s and then declined rapidly. The timing matters because the strongest compression came after some of the structural changes often attributed to the policy had already occurred.",
          traceStatus: "qualified",
          statementIds: [
            "solidaristic-wage-compression-timing",
            "wage-compression-restructuring-qualification",
          ],
        },
        {
          id: "a-differentiated-productivity-result",
          heading: "A differentiated productivity result",
          body: "Evidence links narrower wage gaps between industries to aggregate output and productivity growth, while finding no comparable productivity effect from leveling wages within industries or workplaces. The case therefore supports a bounded mechanism, not a blanket verdict on wage compression.",
          traceStatus: "qualified",
          statementIds: [
            "interindustry-compression-productivity-result",
            "rehn-meidner-distribution-assessment",
          ],
          relatedEntityRefs: [{ kind: "criterion", id: "distribution" }],
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "distribution-of-gains-and-ownership-dossier",
      kind: "dossier",
      label: "Distribution of gains and ownership dossier",
      description:
        "A narrative orientation to the distribution challenge across wages, wealth, ownership, and control.",
      subject: { kind: "challenge", id: "distribution-of-gains-and-ownership" },
      standfirst:
        "Productivity gains can appear as wages, profits, public revenue, investment, wealth, or control. This challenge asks who receives each kind of gain—and who bears the costs of producing it.",
      sections: [
        {
          id: "several-distributions-not-one",
          heading: "Several distributions, not one",
          body: "A narrower wage distribution does not by itself establish a narrower distribution of wealth or control. The current evidence therefore keeps wages, collective holdings, controlling ownership, benefits, and adjustment costs analytically separate.",
          traceStatus: "qualified",
          statementIds: [
            "rehn-meidner-distribution-assessment",
            "funds-distribution-assessment",
          ],
          relatedEntityRefs: [{ kind: "criterion", id: "distribution" }],
        },
        {
          id: "a-wage-policy-response",
          heading: "A response through wage policy",
          body: "The Rehn–Meidner program joined fairer wages to employment, price stability, and growth. In the bounded bargaining episode, wage gaps compressed—especially during the 1970s—but that result does not answer the wider questions of wealth, control, or who bore adjustment costs.",
          traceStatus: "qualified",
          statementIds: [
            "rehn-meidner-declared-objectives",
            "solidaristic-wage-compression-timing",
            "rehn-meidner-distribution-assessment",
          ],
          relatedEntityRefs: [
            { kind: "approach", id: "swedish-rehn-meidner-model" },
            { kind: "case", id: "swedish-solidaristic-bargaining" },
          ],
        },
        {
          id: "an-ownership-policy-response",
          heading: "A response through collective ownership",
          body: "The wage-earner fund program tried to redirect part of corporate gains into collectively held investments. It built collective capital, yet the holdings remained noncontrolling and the evidence here does not establish broad redistribution of private wealth.",
          traceStatus: "qualified",
          statementIds: [
            "funds-declared-ends",
            "funds-limited-control",
            "funds-distribution-assessment",
          ],
          relatedEntityRefs: [
            { kind: "approach", id: "swedish-wage-earner-fund-program" },
            { kind: "case", id: "swedish-wage-earner-funds" },
          ],
        },
        {
          id: "what-a-comparison-must-preserve",
          heading: "What a comparison must preserve",
          body: "The two responses operate through different institutions and produce evidence at different scales. Comparing them requires named measures and bounded Cases, not a single score that treats wages, wealth, ownership, and control as interchangeable.",
          traceStatus: "qualified",
          statementIds: [
            "rehn-meidner-distribution-assessment",
            "funds-distribution-assessment",
            "funds-related-ideas-classification",
          ],
        },
      ],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
