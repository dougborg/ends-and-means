import type { AuthoringDocument } from "../../../src/lib/domain";

const concept = { kind: "concept" as const, id: "social-ownership" };

const citations = [
  ["social-ownership-four-questions", "schlager-ostrom-property-rights-source", "pp. 250–256", "supports", "four-questions-rights"],
  ["social-ownership-four-questions", "hmrc-beneficial-ownership-source", "paragraphs 1–3", "supports", "four-questions-benefit"],
  ["social-ownership-title-benefit-boundary", "hmrc-beneficial-ownership-source", "paragraphs 1–3", "supports", "title-benefit"],
  ["social-ownership-rights-are-divisible", "schlager-ostrom-property-rights-source", "pp. 250–254, especially table 1", "supports", "divisible-rights"],
  ["social-ownership-control-boundary", "schlager-ostrom-property-rights-source", "pp. 250–254", "supports", "control-rights"],
  ["social-ownership-control-boundary", "herzog-economic-democracy-source", "section 4.1, employee ownership and codetermination subsections", "qualifies", "control-practice"],
  ["social-ownership-returns-boundary", "schlager-ostrom-property-rights-source", "pp. 249–252 and 256", "supports", "returns-rights"],
  ["social-ownership-public-title-boundary", "gilabert-oneill-socialism-source", "section 1, paragraphs 18–19", "supports", "public-title"],
  ["social-ownership-market-socialism-relationship", "gilabert-oneill-socialism-source", "section 1, paragraphs 14–16; section 4.2", "supports", "market-socialism"],
  ["social-ownership-economic-democracy-relationship", "herzog-economic-democracy-source", "section 1.2, paragraphs 1–10", "supports", "economic-democracy"],
  ["rehn-meidner-social-ownership-boundary", "erixon-rehn-meidner-model-source", "abstract and pp. 677–684", "supports", "rehn-meidner-boundary"],
] as const;

export const socialOwnershipRelationshipDocuments = [
  {
    documentType: "relationships",
    subject: concept,
    relationships: [
      {
        id: "social-ownership-related-to-economic-democracy",
        predicate: "related-to",
        subject: concept,
        object: { kind: "concept", id: "economic-democracy" },
        status: "qualified",
        statementIds: ["social-ownership-economic-democracy-relationship"],
      },
      {
        id: "social-ownership-related-to-market-socialism",
        predicate: "related-to",
        subject: concept,
        object: { kind: "concept", id: "market-socialism" },
        status: "qualified",
        statementIds: ["social-ownership-market-socialism-relationship"],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: { kind: "approach", id: "swedish-rehn-meidner-model" },
    relationships: [
      {
        id: "rehn-meidner-contested-social-ownership",
        predicate: "interprets-concept",
        subject: { kind: "approach", id: "swedish-rehn-meidner-model" },
        object: concept,
        role: "peripheral",
        interpretation:
          "The model addresses distribution and economic adjustment, but its documented core policy package does not specify social ownership as a defining mechanism.",
        status: "qualified",
        statementIds: ["rehn-meidner-social-ownership-boundary"],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: { kind: "case", id: "swedish-solidaristic-bargaining" },
    relationships: [
      {
        id: "solidaristic-bargaining-contested-social-ownership",
        predicate: "contested-in-case",
        subject: { kind: "case", id: "swedish-solidaristic-bargaining" },
        object: concept,
        status: "qualified",
        statementIds: ["rehn-meidner-social-ownership-boundary"],
      },
    ],
  },
  {
    documentType: "relationships",
    subject: { kind: "case", id: "swedish-wage-earner-funds" },
    relationships: [
      {
        id: "wage-earner-funds-contested-social-ownership",
        predicate: "contested-in-case",
        subject: { kind: "case", id: "swedish-wage-earner-funds" },
        object: concept,
        status: "qualified",
        statementIds: ["funds-related-ideas-classification", "funds-limited-control"],
      },
    ],
  },
  ...citations.map(([statementId, sourceId, locator, role, id]) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [
      {
        id: `social-ownership-${id}-citation`,
        predicate: "cites" as const,
        subject: { kind: "statement" as const, id: statementId },
        object: { kind: "source" as const, id: sourceId },
        role,
        locator,
      },
    ],
  })),
] satisfies AuthoringDocument[];
