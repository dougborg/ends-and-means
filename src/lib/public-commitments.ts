export type PublicationCheck =
  | "validate"
  | "audit:content-preflight"
  | "audit:content-integrity"
  | "test:routes";

export type HumanReviewOwner =
  | "author"
  | "independent reviewer"
  | "project editor";

export interface PublicCommitment {
  id: string;
  heading: string;
  summary: string;
  verification: {
    automated: { script: PublicationCheck; rejects: string }[];
    human: { owner: HumanReviewOwner; decides: string }[];
  };
}

export const publicCommitments = [
  {
    id: "traceable-evidence",
    heading: "Keep claims close to their evidence",
    summary:
      "Substantial factual claims remain individually addressable and connect to the particular source consulted, an exact passage or table, and the source’s role in the claim.",
    verification: {
      automated: [
        {
          script: "validate",
          rejects: "Unresolved Sources, missing locators, and invalid citation roles.",
        },
        {
          script: "test:routes",
          rejects: "Published claims without durable links in rendered pages.",
        },
      ],
      human: [
        {
          owner: "independent reviewer",
          decides: "Whether the cited passage actually has the role assigned to it.",
        },
      ],
    },
  },
  {
    id: "bounded-synthesis",
    heading: "Preserve differences and limits",
    summary:
      "Ideas, traditions, institutions, movements, labels, and bounded cases can overlap without becoming interchangeable. Place, period, actors, disagreement, and missing evidence limit each conclusion.",
    verification: {
      automated: [
        {
          script: "audit:content-preflight",
          rejects: "Invalid record boundaries, relationships, case bounds, and open-question targets.",
        },
      ],
      human: [
        {
          owner: "author",
          decides: "How evidence supports the proposed classification and scope.",
        },
        {
          owner: "independent reviewer",
          decides: "Whether counterevidence, self-description, and transfer limits are represented fairly.",
        },
      ],
    },
  },
  {
    id: "accountable-assistance",
    heading: "Use tools without surrendering judgment",
    summary:
      "AI may assist discovery, synthesis, drafting, and consistency checks. It is never a source or authority. People remain responsible for source fitness, framing, interpretation, wording, and publication.",
    verification: {
      automated: [],
      human: [
        {
          owner: "author",
          decides: "Which sources, framing, interpretation, and wording to propose.",
        },
        {
          owner: "project editor",
          decides: "Whether the reviewed proposal is accepted for publication.",
        },
      ],
    },
  },
] satisfies PublicCommitment[];

export const publicProtocolLinks = [
  {
    label: "Research and content protocol",
    href: "https://github.com/dougborg/ends-and-means/blob/main/.agents/skills/research-content-changes/SKILL.md",
  },
  {
    label: "Review and delivery protocol",
    href: "https://github.com/dougborg/ends-and-means/blob/main/.agents/skills/coordinate-project-delivery/SKILL.md",
  },
] as const;

export const homepageTrace = {
  subject: { kind: "concept", id: "capitalism" },
  sectionId: "what-defines-capitalism",
  proseSelection: "Karl Marx",
  statementId: "capitalism-marx-definition",
  obligationId: "capitalism-coerced-labor-boundary",
} as const;

export const homepageStarts = {
  subjects: [
    { label: "Democracy", href: "/guides/democracy/" },
    { label: "Capitalism", href: "/guides/capitalism/" },
    { label: "Kahnawà:ke community lawmaking", href: "/guides/kahnawake-community-lawmaking/" },
  ],
  cases: [
    { label: "Kahnawà:ke community lawmaking", href: "/cases/kahnawake-community-lawmaking/" },
    { label: "Swedish wage-earner funds", href: "/cases/swedish-wage-earner-funds/" },
  ],
  questions: [
    { label: "Who gains, who owns, and who bears the cost?", href: "/challenges/distribution-of-gains-and-ownership/" },
    { label: "When do voting rights fail to produce equal influence?", href: "/research/#democracy-inclusion-measurement-boundary" },
  ],
} as const;
