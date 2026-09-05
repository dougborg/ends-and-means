import type { AuthoringDocument } from "../../../src/lib/domain";
import { loadNarrative } from "./load-narrative";

const reviewed = {
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-05",
};

const fundProgram = loadNarrative("swedish-wage-earner-fund-program.md", ["the-problem-it-addressed", "the-enacted-mechanism", "why-program-and-practice-differ", "a-contested-and-reversible-institution"]);
const fundCase = loadNarrative("swedish-wage-earner-funds-case.md", ["what-the-funds-were", "what-they-were-meant-to-do", "what-they-did-in-practice", "why-the-case-matters"]);
const rehnMeidner = loadNarrative("swedish-rehn-meidner-model.md", ["several-goals-at-once", "how-the-parts-were-meant-to-work", "a-model-not-a-name-for-sweden", "what-the-bounded-evidence-supports"]);
const bargainingCase = loadNarrative("swedish-solidaristic-bargaining-case.md", ["the-institutional-arrangement", "its-place-in-the-model", "what-changed-and-when", "a-differentiated-productivity-result"]);
const distributionChallenge = loadNarrative("distribution-of-gains-and-ownership.md", ["several-distributions-not-one", "a-wage-policy-response", "an-ownership-policy-response", "what-a-comparison-must-preserve"]);

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
      standfirst: fundProgram.standfirst,
      sections: [
        {
          id: "the-problem-it-addressed",
          heading: "The problem it tried to address",
          body: fundProgram.sections["the-problem-it-addressed"] ?? "",
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
          body: fundProgram.sections["the-enacted-mechanism"] ?? "",
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
          body: fundProgram.sections["why-program-and-practice-differ"] ?? "",
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
          body: fundProgram.sections["a-contested-and-reversible-institution"] ?? "",
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
      standfirst: fundCase.standfirst,
      sections: [
        {
          id: "what-the-funds-were",
          heading: "What the funds were",
          body: fundCase.sections["what-the-funds-were"] ?? "",
          traceStatus: "supported",
          statementIds: ["funds-statutory-design", "funds-declared-ends"],
          relatedEntityRefs: [
            { kind: "case-episode", id: "enacted-wage-earner-funds-1984-1991" },
          ],
        },
        {
          id: "what-they-were-meant-to-do",
          heading: "What they were meant to do",
          body: fundCase.sections["what-they-were-meant-to-do"] ?? "",
          traceStatus: "supported",
          statementIds: ["funds-declared-ends"],
          relatedEntityRefs: [
            { kind: "approach", id: "swedish-wage-earner-fund-program" },
          ],
        },
        {
          id: "what-they-did-in-practice",
          heading: "What they did in practice",
          body: fundCase.sections["what-they-did-in-practice"] ?? "",
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
          body: fundCase.sections["why-the-case-matters"] ?? "",
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
      standfirst: rehnMeidner.standfirst,
      sections: [
        {
          id: "several-goals-at-once",
          heading: "A model built around several goals at once",
          body: rehnMeidner.sections["several-goals-at-once"] ?? "",
          traceStatus: "supported",
          statementIds: ["rehn-meidner-declared-objectives"],
          relatedEntityRefs: [{ kind: "end", id: "equality-with-employment" }],
        },
        {
          id: "how-the-parts-were-meant-to-work",
          heading: "How the parts were meant to work together",
          body: rehnMeidner.sections["how-the-parts-were-meant-to-work"] ?? "",
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
          body: rehnMeidner.sections["a-model-not-a-name-for-sweden"] ?? "",
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
          body: rehnMeidner.sections["what-the-bounded-evidence-supports"] ?? "",
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
      standfirst: bargainingCase.standfirst,
      sections: [
        {
          id: "the-institutional-arrangement",
          heading: "The institutional arrangement",
          body: bargainingCase.sections["the-institutional-arrangement"] ?? "",
          traceStatus: "supported",
          statementIds: ["centralized-solidaristic-bargaining-form"],
          relatedEntityRefs: [
            { kind: "means", id: "solidaristic-wage-bargaining" },
          ],
        },
        {
          id: "its-place-in-the-model",
          heading: "Its place in the model",
          body: bargainingCase.sections["its-place-in-the-model"] ?? "",
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
          body: bargainingCase.sections["what-changed-and-when"] ?? "",
          traceStatus: "qualified",
          statementIds: [
            "solidaristic-wage-compression-timing",
            "wage-compression-restructuring-qualification",
          ],
        },
        {
          id: "a-differentiated-productivity-result",
          heading: "A differentiated productivity result",
          body: bargainingCase.sections["a-differentiated-productivity-result"] ?? "",
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
      standfirst: distributionChallenge.standfirst,
      sections: [
        {
          id: "several-distributions-not-one",
          heading: "Several distributions, not one",
          body: distributionChallenge.sections["several-distributions-not-one"] ?? "",
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
          body: distributionChallenge.sections["a-wage-policy-response"] ?? "",
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
          body: distributionChallenge.sections["an-ownership-policy-response"] ?? "",
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
          body: distributionChallenge.sections["what-a-comparison-must-preserve"] ?? "",
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
