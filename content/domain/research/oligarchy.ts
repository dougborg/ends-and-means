import type { AuthoringDocument } from "../../../src/lib/domain";

const common = {
  publicationStatus: "reviewed" as const,
  obligationStatus: "open" as const,
  statementIds: [],
  reviewedAt: "2026-09-06",
};

export const oligarchyResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "oligarchy-minority-delegation-boundary",
      kind: "research-obligation",
      label: "Minority power, delegation, and expertise",
      description:
        "A focused boundary between domination and authorized specialist decision-making.",
      obligationType: "research-gap",
      question:
        "When does durable minority control become domination rather than revocable delegation, representation, or specialist authority?",
      target: { kind: "concept", id: "oligarchy" },
      addressedStatementIds: [
        "oligarchy-elite-theory-distinction",
        "oligarchy-officeholding-boundary",
      ],
      currentLimitation:
        "The reviewed definitions distinguish material oligarchy from broader elite theory but do not supply a cross-institutional threshold for authorization, contestability, or revocation.",
      evidenceNeeded:
        "Comparative studies that measure mandate, transparency, removal, agenda control, expertise, and affected-party contestation in named institutions.",
      scope:
        "Specified governing and organizational institutions; no assumption that every small decision-making body is oligarchic.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "oligarchy-wealth-political-conversion",
      kind: "research-obligation",
      label: "Conversion of wealth into political power",
      description:
        "A causal question about mechanisms connecting resources to decisions.",
      obligationType: "counterfactual",
      question:
        "Through which mechanisms does concentrated wealth change political outcomes compared with otherwise similar decisions lacking that intervention?",
      target: { kind: "concept", id: "oligarchy" },
      addressedStatementIds: [
        "oligarchy-winters-wealth-defense",
        "oligarchy-inequality-boundary",
        "indonesia-winters-material-power",
        "us-gilens-page-elite-effect",
      ],
      currentLimitation:
        "Resource concentration and preference–outcome associations do not independently identify lobbying, ownership, agenda control, candidate selection, coercion, or another causal channel.",
      evidenceNeeded:
        "Mechanism-specific designs using interventions, process tracing, disclosure records, institutional discontinuities, or credible counterfactual comparisons.",
      scope:
        "Named policy domains, actors, places, and periods rather than a universal wealth-to-power coefficient.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "oligarchy-wealth-defense-travel",
      kind: "research-obligation",
      label: "Travel of wealth-defense theory",
      description:
        "A focused test of whether one material theory transfers across political settings.",
      obligationType: "counterargument",
      question:
        "Which legal, organizational, coercive, and economic conditions must hold before wealth-defense theory can travel beyond the settings from which it was developed?",
      target: { kind: "concept", id: "oligarchy" },
      targetSectionId: "indonesia",
      addressedStatementIds: [
        "indonesia-winters-wealth-defense",
        "indonesia-hadiz-robison-rival",
        "indonesia-beyond-oligarchy-critique",
        "indonesia-debate-reply",
      ],
      currentLimitation:
        "The Indonesia exchange identifies rival resources and institutions but does not establish a general domain of applicability for the material account.",
      evidenceNeeded:
        "Comparable within- and cross-case studies that observe wealth-defense behavior, organization, legal constraint, coercive capacity, and rival power resources.",
      scope:
        "Bounded comparisons that preserve each setting's institutions and period; no country-level essence.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "oligarchy-ancient-translation-reception",
      kind: "research-obligation",
      label: "Translation and reception of oligarchia",
      description:
        "A philological and reception-history question about an ancient term's changing use.",
      obligationType: "research-gap",
      question:
        "How did ancient uses of oligarchia vary across authors and poleis, and how have translators and later political writers changed its apparent boundaries?",
      target: { kind: "concept", id: "oligarchy" },
      addressedStatementIds: [
        "oligarchy-aristotle-few-common-interest",
        "oligarchy-aristotle-wealth-distinction",
        "athens-411-source-boundary",
      ],
      currentLimitation:
        "Two English translations and one modern history cannot establish the range, self-description, hostile usage, and reception of oligarchia across ancient evidence.",
      evidenceNeeded:
        "Greek texts with named editions and translators, inscriptions where available, source-critical histories, and reception studies with precise lexical locators.",
      scope:
        "Named ancient texts, poleis, and later receptions; no direct equivalence between an ancient constitutional term and modern regime labels.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "oligarchy-us-policy-model-robustness",
      kind: "research-obligation",
      label: "Robustness of United States policy-influence models",
      description:
        "A focused methodological question prompted by a published critique and reply.",
      obligationType: "counterevidence",
      question:
        "Do alternative measurements, specifications, time periods, and policy samples reproduce the unequal-responsiveness pattern in the 1981–2002 federal proposal dataset?",
      target: { kind: "concept", id: "oligarchy" },
      targetSectionId: "united-states",
      addressedStatementIds: [
        "us-gilens-page-elite-effect",
        "us-gilens-page-average-effect",
        "us-bashir-model-critique",
        "us-gilens-simulation-reply",
        "us-study-bounded-conclusion",
      ],
      currentLimitation:
        "The critique and reply dispute a simulation and model behavior without settling external validity across other samples, measures, periods, or decision venues.",
      evidenceNeeded:
        "Replications using preregistered specifications, alternative outcome definitions, later periods, subnational decisions, agenda non-decisions, and direct mechanism evidence.",
      scope:
        "United States policy responsiveness in defined datasets and periods; not a national regime classification.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "oligarchy-regime-label-threshold",
      kind: "research-obligation",
      label: "Bounded mechanism versus regime label",
      description:
        "A focused question about escalation from a demonstrated mechanism to a whole-order classification.",
      obligationType: "counterargument",
      question:
        "What additional evidence would justify moving from a bounded finding of minority influence to an oligarchy classification for a political order?",
      target: { kind: "concept", id: "oligarchy" },
      addressedStatementIds: [
        "oligarchy-regime-boundary",
        "indonesia-case-boundary",
        "us-gilens-page-not-oligarchy-test",
        "us-study-bounded-conclusion",
      ],
      currentLimitation:
        "The reviewed materials use different units and thresholds and do not supply one validated rule for regime-wide classification.",
      evidenceNeeded:
        "Explicit classification rules tested against multiple decision domains, institutions, periods, rival explanations, and cases of both presence and absence.",
      scope:
        "Analytical classifications under named definitions; no universal score or automatic inference from a single outcome.",
      ...common,
    },
  },
] satisfies AuthoringDocument[];
