import { describe, expect, it } from "vitest";
import {
  citationsFor,
  dossierForSubject,
  entityById,
  relationshipsFrom,
  researchObligationsForTarget,
} from "../../src/lib/domain/canonical";

const statementIds = [
  "collective-capital-formation-working-definition",
  "collective-capital-formation-national-accounts-boundary",
  "collective-capital-formation-statistical-governance-boundary",
  "collective-capital-formation-individual-saving-boundary",
  "swedish-1981-funds-cash-financing",
  "collective-capital-formation-financing-governance-boundary",
  "collective-capital-formation-governing-constituency",
  "meidner-profit-share-contribution-proposal",
  "meidner-profit-share-rate-suggestion",
  "meidner-central-fund-destination-proposal",
  "meidner-share-payment-instrument-proposal",
  "meidner-union-board-election-proposal",
  "meidner-shareholder-vote-allocation-proposal",
  "collective-capital-formation-rights-boundary",
  "collective-capital-formation-swedish-case-classification",
  "collective-capital-formation-supporter-distance",
  "collective-capital-formation-unclear-benefits-objection",
  "collective-capital-formation-purpose-objection",
];

describe("collective capital formation dossier", () => {
  it("publishes a scoped Concept with an answer-first traced dossier", () => {
    expect(entityById("collective-capital-formation")).toMatchObject({
      kind: "concept",
      scopeNote: expect.stringContaining("not the national-accounts measure"),
    });
    const dossier = dossierForSubject(
      "concept",
      "collective-capital-formation",
    );
    expect(dossier?.standfirstStatementIds).toEqual([
      "collective-capital-formation-working-definition",
      "collective-capital-formation-national-accounts-boundary",
      "collective-capital-formation-statistical-governance-boundary",
      "collective-capital-formation-rights-boundary",
    ]);
    expect(dossier?.sections.map(({ id }) => id)).toEqual([
      "what-does-collective-mean-here",
      "how-is-this-different-from-investment-statistics",
      "what-design-choices-matter",
      "what-does-the-swedish-case-show",
      "why-can-collective-funds-lose-support",
    ]);
    expect(dossier?.sections[0]?.statementIds).toEqual([
      "collective-capital-formation-working-definition",
      "collective-capital-formation-individual-saving-boundary",
      "collective-capital-formation-governing-constituency",
      "collective-capital-formation-rights-boundary",
    ]);
    expect(dossier?.sections.map(({ statementIds }) => statementIds)).toEqual([
      [
        "collective-capital-formation-working-definition",
        "collective-capital-formation-individual-saving-boundary",
        "collective-capital-formation-governing-constituency",
        "collective-capital-formation-rights-boundary",
      ],
      [
        "collective-capital-formation-national-accounts-boundary",
        "collective-capital-formation-statistical-governance-boundary",
        "collective-capital-formation-working-definition",
      ],
      [
        "meidner-profit-share-contribution-proposal",
        "meidner-profit-share-rate-suggestion",
        "meidner-central-fund-destination-proposal",
        "meidner-share-payment-instrument-proposal",
        "meidner-union-board-election-proposal",
        "meidner-shareholder-vote-allocation-proposal",
        "swedish-1981-funds-cash-financing",
        "collective-capital-formation-financing-governance-boundary",
        "collective-capital-formation-governing-constituency",
        "collective-capital-formation-individual-saving-boundary",
        "collective-capital-formation-rights-boundary",
      ],
      [
        "funds-statutory-design",
        "funds-abolished",
        "collective-capital-formation-swedish-case-classification",
      ],
      [
        "collective-capital-formation-supporter-distance",
        "collective-capital-formation-unclear-benefits-objection",
        "collective-capital-formation-purpose-objection",
        "collective-capital-formation-individual-saving-boundary",
      ],
    ]);
  });
});

describe("collective capital formation narrative trace", () => {
  it("renders proposal governance once and keeps the enacted case bounded", () => {
    const dossier = dossierForSubject(
      "concept",
      "collective-capital-formation",
    );
    expect(dossier?.sections[1]?.body).not.toContain("machinery");
    expect(dossier?.sections[1]?.body).toContain(
      "additions to long-lived productive assets after disposals",
    );
    expect(dossier?.sections[3]?.body).not.toContain(
      "operated from 1984 through 1991",
    );
    expect(dossier?.sections[3]?.body).not.toContain("20 percent");
    expect(dossier?.sections[3]?.body).not.toContain("wage-earner shares");
    expect(dossier?.sections[2]?.body).toContain("20 percent");
    expect(dossier?.sections[2]?.body).toContain("wage-earner shares");
    expect(dossier?.sections[2]?.body).toContain(
      "Unions would elect the central fund's board",
    );
    expect(dossier?.sections[2]?.body).toContain(
      "local union branches and industry-wide funds",
    );
    expect(dossier?.sections[3]?.body).not.toContain(
      "central fund's board",
    );
    expect(dossier?.sections[3]?.body).not.toContain(
      "industry-wide funds",
    );
    expect(dossier?.sections[3]?.body).toContain(
      "ended the boards across the 1991–1992 year boundary",
    );
  });
});

describe("collective capital formation evidence", () => {
  it("locates at least six atomic claims across four authoritative sources", () => {
    expect(
      entityById("furendal-oneill-collective-capital-source"),
    ).toMatchObject({
      contributorDisplay: ["Markus Furendal", "Martin O'Neill"],
    });
    expect(
      entityById("furendal-oneill-collective-capital-source"),
    ).not.toHaveProperty("reviewedAt");
    expect(statementIds.length).toBeGreaterThanOrEqual(6);
    expect(
      statementIds.every((id) => entityById(id)?.kind === "statement"),
    ).toBe(true);
    expect(statementIds.every((id) => citationsFor(id).length > 0)).toBe(true);
    expect(
      statementIds.every((id) =>
        citationsFor(id).every(({ locator }) => locator.trim().length > 0),
      ),
    ).toBe(true);
    expect(
      new Set(
        statementIds.flatMap((id) =>
          citationsFor(id).map(({ object }) => object.id),
        ),
      ).size,
    ).toBeGreaterThanOrEqual(4);
  });

  it("keeps the bounded Swedish case from embodying the Concept", () => {
    expect(
      entityById("collective-capital-formation-swedish-case-classification"),
    ).toMatchObject({
      statementKind: "classification",
      text: expect.stringContaining("not a definition or complete realization"),
    });
  });

  it("records independently closable research obligations", () => {
    expect(
      researchObligationsForTarget("concept", "collective-capital-formation"),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "collective-capital-formation-governance-exit-design",
          addressedStatementIds: expect.arrayContaining([
            "collective-capital-formation-individual-saving-boundary",
          ]),
        }),
        expect.objectContaining({
          id: "collective-capital-formation-benefit-allocation",
          addressedStatementIds: expect.arrayContaining([
            "collective-capital-formation-individual-saving-boundary",
          ]),
        }),
        expect.objectContaining({
          id: "collective-capital-formation-participant-understanding",
        }),
        expect.objectContaining({
          id: "collective-capital-formation-durable-support",
        }),
      ]),
    );
    expect(
      researchObligationsForTarget("concept", "collective-capital-formation"),
    ).toHaveLength(4);
  });
});

describe("collective capital formation locator precision", () => {
  it("uses the printed OECD definition page", () => {
    expect(
      citationsFor("collective-capital-formation-national-accounts-boundary"),
    ).toEqual([
      expect.objectContaining({
        locator: "chapter 5, p. 143, ‘Gross fixed capital formation’",
      }),
    ]);
    expect(
      citationsFor(
        "collective-capital-formation-statistical-governance-boundary",
      ),
    ).toEqual([
      expect.objectContaining({
        locator: "chapter 5, p. 143, ‘Gross fixed capital formation’",
        role: "qualifies",
      }),
    ]);
  });

  it("keeps each Meidner financing and governance rule atomic", () => {
    const page309Ids = [
      "meidner-profit-share-contribution-proposal",
      "meidner-profit-share-rate-suggestion",
      "meidner-central-fund-destination-proposal",
      "meidner-share-payment-instrument-proposal",
    ];
    const page310Ids = [
      "meidner-union-board-election-proposal",
      "meidner-shareholder-vote-allocation-proposal",
    ];
    for (const id of page309Ids) {
      expect(citationsFor(id)).toEqual([
        expect.objectContaining({
          locator:
            "section ‘The essential features of the LO proposal for wage-earner funds’, p. 309",
        }),
      ]);
    }
    for (const id of page310Ids) {
      expect(citationsFor(id)).toEqual([
        expect.objectContaining({
          locator:
            "section ‘The essential features of the LO proposal for wage-earner funds’, p. 310",
        }),
      ]);
    }
  });

  it("qualifies social ownership with both holding and control boundaries", () => {
    expect(
      relationshipsFrom("collective-capital-formation").find(
        ({ id }) =>
          id === "collective-capital-formation-related-to-social-ownership",
      ),
    ).toMatchObject({
      statementIds: [
        "collective-capital-formation-individual-saving-boundary",
        "collective-capital-formation-rights-boundary",
      ],
    });
    expect(
      entityById("collective-capital-formation-rights-boundary"),
    ).toMatchObject({
      label: "Accumulation does not establish democratic investment control",
      text: expect.stringContaining("democratic control"),
    });
  });

  it("keeps design and supporter objections tied to the exact supporting passages", () => {
    expect(
      citationsFor("collective-capital-formation-governing-constituency"),
    ).toEqual([expect.objectContaining({ locator: "section 5, pp. 319–320" })]);
    expect(
      citationsFor("collective-capital-formation-rights-boundary"),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ locator: "section 5, pp. 319–320" }),
      ]),
    );
    expect(
      citationsFor("collective-capital-formation-unclear-benefits-objection"),
    ).toEqual([
      expect.objectContaining({
        locator:
          "section ‘1978–1981: Muted support, vigorous opposition and the watering down of wage-earner funds’, pp. 513–514",
      }),
    ]);
  });
});
