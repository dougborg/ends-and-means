import type { HumanReviewOwner, PublicationCheck } from "./public-commitments";

export type PublicationEnforcement =
  | "canonical-schema-and-relationship-validity"
  | "citation-locator-and-role-validity"
  | "case-and-open-question-boundaries"
  | "malformed-or-stale-overlap-acknowledgements"
  | "narrative-line-violations"
  | "publication-boundary-violations"
  | "rendered-trust-route-availability";

export interface AutomatedEditorialCheck {
  script: PublicationCheck;
  enforces: readonly PublicationEnforcement[];
}

export interface EditorialPrinciple {
  id: string;
  heading: string;
  summary: string;
  verification: {
    automated: AutomatedEditorialCheck[];
    human: { owner: HumanReviewOwner; decides: string }[];
  };
}

export const editorialPrinciples = [
  {
    id: "visible-judgment",
    heading: "Make editorial judgment visible",
    summary:
      "Framing, inclusion, classification, source selection, synthesis, and evaluation all involve choices. The project explains consequential choices instead of presenting them as neutral or inevitable.",
    verification: {
      automated: [],
      human: [
        {
          owner: "author",
          decides:
            "Which choices need explanation and how the proposed framing limits the conclusion.",
        },
        {
          owner: "independent reviewer",
          decides:
            "Whether consequential framing and classification choices are represented candidly.",
        },
      ],
    },
  },
  {
    id: "separate-claim-types",
    heading: "Say what kind of claim is being made",
    summary:
      "A checkable fact, someone’s interpretation, an editorial inference, and a value judgment do different work. Attribution and visible reasoning keep one from quietly passing as another.",
    verification: {
      automated: [
        {
          script: "validate",
          enforces: [
            "canonical-schema-and-relationship-validity",
            "citation-locator-and-role-validity",
          ],
        },
      ],
      human: [
        {
          owner: "independent reviewer",
          decides:
            "Whether the prose distinguishes evidence, attribution, inference, and evaluation accurately.",
        },
      ],
    },
  },
  {
    id: "source-fitness",
    heading: "Match each source to the work it can do",
    summary:
      "Sources are judged for authority, relevance, context, and limits. Each substantial factual claim points to the copy consulted, a precise location, and whether the citation supports, challenges, qualifies, or contextualizes it.",
    verification: {
      automated: [
        {
          script: "audit:content-preflight",
          enforces: [
            "citation-locator-and-role-validity",
            "publication-boundary-violations",
          ],
        },
      ],
      human: [
        {
          owner: "author",
          decides:
            "Whether a source is authoritative and appropriate for the particular proposition.",
        },
        {
          owner: "independent reviewer",
          decides:
            "Whether the cited passage supports the role and scope assigned to it.",
        },
      ],
    },
  },
  {
    id: "fair-disagreement",
    heading: "Present serious disagreement at its strongest",
    summary:
      "Consequential rival interpretations and contrary evidence receive a fair account. Fairness does not manufacture a dispute or give weak and strong evidence equal weight.",
    verification: {
      automated: [],
      human: [
        {
          owner: "author",
          decides:
            "Which rival arguments and counterevidence are serious enough to affect the account.",
        },
        {
          owner: "independent reviewer",
          decides:
            "Whether opposing views are recognizable to informed advocates and weighted by their evidence.",
        },
      ],
    },
  },
  {
    id: "bounded-conclusions",
    heading: "Keep conclusions inside their evidence",
    summary:
      "Cases stay bounded by place, period, actors, and institutions. Missing evidence, transfer limits, unresolved counterfactuals, and community self-description remain visible where they change what can be concluded.",
    verification: {
      automated: [
        {
          script: "audit:content-preflight",
          enforces: [
            "canonical-schema-and-relationship-validity",
            "case-and-open-question-boundaries",
          ],
        },
      ],
      human: [
        {
          owner: "independent reviewer",
          decides:
            "Whether scope, counterevidence, community self-description, and transfer limits are treated fairly.",
        },
      ],
    },
  },
  {
    id: "independent-language",
    heading: "Synthesize without borrowing a source’s voice",
    summary:
      "Writers draft from checked claims and notes rather than rewriting a source sentence by sentence. Distinctive wording is quoted and precisely attributed; close phrasing is reviewed as a warning sign, not cleared by automation.",
    verification: {
      automated: [
        {
          script: "audit:content-integrity",
          enforces: [
            "malformed-or-stale-overlap-acknowledgements",
            "narrative-line-violations",
            "publication-boundary-violations",
          ],
        },
      ],
      human: [
        {
          owner: "author",
          decides:
            "Whether the draft is independently written and every necessary quotation is marked and attributed.",
        },
        {
          owner: "independent reviewer",
          decides:
            "Whether source similarity, attribution, and plagiarism risk were assessed against the actual passages.",
        },
      ],
    },
  },
  {
    id: "accountable-revision",
    heading: "Let better evidence change the work",
    summary:
      "Uncertainty narrows the language rather than disappearing into a vague disclaimer. Focused open questions record what could change a conclusion, and corrections or reconsideration can produce a visible revision.",
    verification: {
      automated: [
        {
          script: "test:routes",
          enforces: ["rendered-trust-route-availability"],
        },
      ],
      human: [
        {
          owner: "project editor",
          decides:
            "Whether reviewed evidence warrants correction, reconsideration, revision, or a stated unresolved limit.",
        },
      ],
    },
  },
] satisfies EditorialPrinciple[];
