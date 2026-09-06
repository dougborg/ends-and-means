export type CommitmentAccountability =
  | { kind: "check"; owner: string; evidence: string }
  | { kind: "human-review"; owner: string; evidence: string };

export interface PublicCommitment {
  id: string;
  heading: string;
  summary: string;
  accountability: CommitmentAccountability[];
}

export const publicCommitments = [
  {
    id: "traceable-evidence",
    heading: "Keep claims close to their evidence",
    summary:
      "Substantial factual claims remain individually addressable and connect to the particular source consulted, an exact passage or table, and the source’s role in the claim.",
    accountability: [
      {
        kind: "check",
        owner: "content validation",
        evidence:
          "Live claims require resolved sources, precise locators, permitted citation roles, and durable public routes.",
      },
      {
        kind: "human-review",
        owner: "research editor",
        evidence:
          "A person judges whether the cited passage supports, challenges, qualifies, or only contextualizes the claim.",
      },
    ],
  },
  {
    id: "bounded-synthesis",
    heading: "Preserve differences and limits",
    summary:
      "Ideas, traditions, institutions, movements, labels, and bounded cases can overlap without becoming interchangeable. Place, period, actors, disagreement, and missing evidence limit each conclusion.",
    accountability: [
      {
        kind: "check",
        owner: "content validation",
        evidence:
          "Typed records, explicit relationships, bounded cases, and open-question targets are validated before publication.",
      },
      {
        kind: "human-review",
        owner: "research editor",
        evidence:
          "A person reviews classification, scope, counterevidence, community self-description, and transfer limits.",
      },
    ],
  },
  {
    id: "accountable-assistance",
    heading: "Use tools without surrendering judgment",
    summary:
      "AI may assist discovery, synthesis, drafting, and consistency checks. It is never a source or authority. People remain responsible for source fitness, framing, interpretation, wording, and publication.",
    accountability: [
      {
        kind: "check",
        owner: "publication boundary",
        evidence:
          "Published claims must cite eligible source records; generated text cannot satisfy an evidence relationship.",
      },
      {
        kind: "human-review",
        owner: "research editor and publisher",
        evidence:
          "People inspect the cited material and accept responsibility for every editorial judgment before publication.",
      },
    ],
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
