import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };
const workSource = (
  id: string,
  title: string,
  contributors: string[],
  publisher: string,
  type: "report" | "book" | "article" | "web-page",
  year: number,
  url: string,
  doi?: string,
  sourceYear = year,
): AuthoringDocument[] => [
  {
    documentType: "entity",
    entity: {
      id: `${id}-work`,
      kind: "work",
      label: title,
      description: `The non-fiction work underlying the consulted ${title} source.`,
      title,
      workType: type === "web-page" ? "other" : type,
      originalPublicationYear: year,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: `${id}-source`,
      kind: "source",
      label: `${title} (${sourceYear})`,
      description: `The consulted manifestation of ${title}.`,
      title,
      sourceType: type === "book" ? "edition" : type,
      workId: `${id}-work`,
      contributorDisplay: contributors,
      publicationYear: sourceYear,
      publisher,
      ...(doi ? { identifiers: { doi } } : {}),
      resourceLinks: [
        { purpose: "publisher", url, label: "Open the source record" },
      ],
      ...reviewed,
    },
  },
];
const statement = (
  id: string,
  label: string,
  text: string,
  statementKind:
    | "definition"
    | "observation"
    | "editorial-interpretation"
    | "causal-hypothesis" = "observation",
): AuthoringDocument => ({
  documentType: "entity",
  entity: {
    id,
    kind: "statement",
    label,
    description: label,
    statementKind,
    text,
    ...reviewed,
  },
});

export const centralPlanningEvidenceDocuments = [
  ...workSource(
    "wpb-controlled-materials-plan",
    "Controlled Materials Plan: November 2, 1942",
    ["War Production Board"],
    "U.S. Government Publishing Office",
    "report",
    1942,
    "https://www.govinfo.gov/app/details/GOVPUB-P32_4800-c534fb99ebb59f73ff22c929b145edfe",
  ),
  ...workSource(
    "wpb-war-production-1944",
    "War Production in 1944",
    ["War Production Board"],
    "U.S. Government Publishing Office",
    "report",
    1945,
    "https://www.govinfo.gov/app/details/GOVPUB-P32_4800-9e92e30522a253276362395c30ab5450",
  ),
  ...workSource(
    "bureau-budget-united-states-war",
    "The United States at War: Development and Administration of the War Program",
    ["War Records Section, U.S. Bureau of the Budget"],
    "U.S. Government Printing Office",
    "report",
    1946,
    "https://www.ibiblio.org/hyperwar/ATO/Admin/WarProgram/WarProgram-10.html",
  ),
  ...workSource(
    "wpb-products-priorities-september-1945",
    "Products and Priorities, September 1945",
    ["War Production Board"],
    "U.S. Government Printing Office",
    "report",
    1945,
    "https://www.govinfo.gov/content/pkg/GOVPUB-P32_4800-e44ee7e9bc9aa8ea930cd39fcd31faf9/pdf/GOVPUB-P32_4800-e44ee7e9bc9aa8ea930cd39fcd31faf9.pdf",
  ),
  ...workSource(
    "landon-lane-rockoff-cmp",
    "The Paradox of Planning: The Controlled Materials Plan of World War II",
    ["John Landon-Lane", "Hugh Rockoff"],
    "National Bureau of Economic Research",
    "article",
    1996,
    "https://doi.org/10.3386/h0083",
    "10.3386/h0083",
    2013,
  ),
  ...workSource(
    "kansas-press-koistinen-arsenal",
    "Arsenal of World War II: publisher description",
    ["University Press of Kansas"],
    "University Press of Kansas",
    "web-page",
    2004,
    "https://kansaspress.ku.edu/9780700613083/",
  ),
  statement(
    "central-planning-family-boundary",
    "This guide treats central planning as a Means family",
    "This guide uses central planning for a family of arrangements that coordinate a substantial scope through authorized plans; the label does not by itself specify ideology, ownership, or economy-wide control.",
    "definition",
  ),
  statement(
    "cmp-authority",
    "WPB and its Requirements Committee held allotment authority",
    "The Controlled Materials Plan assigned the War Production Board's Requirements Committee the initial division of controlled-material supply among designated claimant agencies.",
    "observation",
  ),
  statement(
    "cmp-scope",
    "CMP initially covered three critical metals",
    "The plan initially controlled steel, copper, and aluminum for military and essential civilian production rather than every good or economic decision.",
    "observation",
  ),
  statement(
    "cmp-information",
    "Requirements and supply estimates moved upward",
    "Claimant agencies submitted program requirements while the Requirements Committee estimated available controlled-material supply for the next quarterly allocation.",
    "observation",
  ),
  statement(
    "cmp-targets",
    "Allotments linked schedules to material quantities",
    "Approved production schedules generated material allotments that claimant agencies passed to prime contractors and through subcontracting supply chains.",
    "observation",
  ),
  statement(
    "cmp-revision",
    "CMP allocations were revised quarterly",
    "The plan used quarterly estimates and allotments, with continuing schedule adjustment as military requirements and available supply changed.",
    "observation",
  ),
  statement(
    "cmp-enforcement",
    "Authorized allotments constrained mill orders",
    "Once fully effective, controlled-material mills could fill orders only against plan allotments, backed by priority and allocation orders.",
    "observation",
  ),
  statement(
    "cmp-ownership",
    "Allocation did not prescribe an ownership transfer",
    "CMP rules assigned different roles to public claimant agencies, consumers, prime contractors, and controlled-material producers without prescribing a transfer of ownership among them.",
    "editorial-interpretation",
  ),
  statement(
    "cmp-operating-period",
    "CMP began in two stages",
    "The plan began partial operation on April 1, 1943, and became fully effective on July 1, 1943.",
    "observation",
  ),
  statement(
    "cmp-expiration",
    "CMP expired at the end of September 1945",
    "The plan and Authorized Controlled Material Orders expired at midnight on September 30, 1945.",
    "observation",
  ),
  statement(
    "cmp-distributed-administration",
    "Administration was centralized and distributed",
    "WPB set the material envelope, claimant agencies authorized schedules and subdivided allotments, and producers distributed authorized quantities down their supply chains.",
    "observation",
  ),
  statement(
    "cmp-official-performance-account",
    "The WPB reported smoother operation in 1944",
    "The War Production Board's retrospective reported that CMP operated smoothly in 1944 while requirements, supply, and program cutbacks continued to change.",
    "observation",
  ),
  statement(
    "cmp-performance-rival",
    "A later study disputes that CMP caused mobilization success",
    "Landon-Lane and Rockoff argue that CMP arrived too late to explain the mobilization turnaround and identify time-to-build and market coordination as rival explanations.",
    "causal-hypothesis",
  ),
  statement(
    "cmp-power-rival",
    "Koistinen argues that industry and military leaders gained influence",
    "The University Press of Kansas summarizes Koistinen's finding that industry and armed-service representatives expanded their ties and shaped wartime mobilization policy while federal agencies disputed control.",
    "observation",
  ),
  statement(
    "cmp-correctability-assessment",
    "CMP created recurring correction points",
    "Quarterly reconciliation and schedule revision made some supply-demand conflicts corrigible, but the available evidence does not establish whose needs were discounted or whether affected workers and civilians could contest priorities.",
    "editorial-interpretation",
  ),
  {
    documentType: "entity",
    entity: {
      id: "united-states",
      kind: "place",
      label: "United States",
      description:
        "The United States as a geographic and federal jurisdiction.",
      placeType: "country",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/United_States",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q30",
          url: "https://www.wikidata.org/wiki/Q30",
          purpose: "identity",
          match: "exact",
          checkedAt: "2026-09-06",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "us-controlled-materials-plan",
      kind: "case",
      label: "United States Controlled Materials Plan",
      description:
        "A bounded case of federal allocation of critical industrial materials during the Second World War.",
      locationIds: ["united-states"],
      startDate: { year: 1943, month: 4, day: 1, certainty: "exact" },
      endDate: { year: 1945, month: 9, day: 30, certainty: "exact" },
      scope:
        "CMP allocation of steel, copper, and aluminum from partial operation in April 1943 until expiration at midnight on September 30, 1945; excludes treating the entire US economy or every wartime control as centrally planned.",
      selectionRationale:
        "The episode has detailed primary operating rules, official administrative histories, and independent rival analysis while separating allocation authority from ownership.",
      conditionStatementIds: ["cmp-operating-period", "cmp-expiration"],
      episodeIds: ["cmp-operation-1943-1945"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "cmp-operation-1943-1945",
      kind: "case-episode",
      label: "Controlled Materials Plan operation, April 1943–September 1945",
      description:
        "The bounded period in which CMP allotments structured access to steel, copper, and aluminum.",
      caseId: "us-controlled-materials-plan",
      locationIds: ["united-states"],
      startDate: { year: 1943, month: 4, day: 1, certainty: "exact" },
      endDate: { year: 1945, month: 9, day: 30, certainty: "exact" },
      scope:
        "Quarterly controlled-material allocation and production authorization, not price controls, labor allocation, military procurement as a whole, or a permanent peacetime system.",
      conditionStatementIds: [
        "cmp-operating-period",
        "cmp-expiration",
        "cmp-ownership",
      ],
      formalRuleStatementIds: [
        "cmp-authority",
        "cmp-scope",
        "cmp-targets",
        "cmp-enforcement",
      ],
      ruleInUseStatementIds: [
        "cmp-information",
        "cmp-revision",
        "cmp-distributed-administration",
      ],
      interactionStatementIds: ["cmp-power-rival"],
      outcomeStatementIds: [
        "cmp-official-performance-account",
        "cmp-performance-rival",
        "cmp-correctability-assessment",
      ],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
