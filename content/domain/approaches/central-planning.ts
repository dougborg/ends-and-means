import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

export const centralPlanningApproachDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "central-planning-arrangements",
      kind: "collection",
      label: "Central planning",
      description:
        "A Means family in which authorized bodies coordinate a substantial scope of production, investment, or allocation through plans.",
      inclusionRule:
        "Include only concrete Means whose binding or directive plans specify authority, scope, information, targets, revision, enforcement, and ownership context.",
      editorialPurpose:
        "Keep central planning searchable without treating it as an ideology, ownership form, or one uniform institution.",
      externalRefs: [{ system: "wikipedia", url: "https://en.wikipedia.org/wiki/Economic_planning", purpose: "orientation", language: "en", checkedAt: "2026-09-06" }],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "controlled-materials-allocation",
      kind: "means",
      label: "Controlled materials allocation",
      description:
        "A mechanism that reconciles program requirements with scarce-material supply and passes authorized allotments through agencies and production chains.",
      institutionalForm:
        "A central board estimates available materials, approves quarterly claimant allotments, and conditions producers' orders on authorized schedules while agencies and firms subdivide allotments down supply chains.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "us-wartime-production-mobilization",
      kind: "approach",
      label: "United States controlled-materials allocation",
      description:
        "The federal approach that reconciled selected program requirements with supplies of steel, copper, and aluminum through quarterly allotments.",
      scope:
        "The Controlled Materials Plan from partial operation in April 1943 until expiration on September 30, 1945; not military procurement, labor or price controls, the whole economy, or every wartime production policy.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "war-production-board",
      kind: "organization",
      label: "War Production Board",
      description:
        "The federal civilian agency directing wartime production priorities and materials allocation.",
      scope:
        "United States federal production coordination from January 1942 until its termination in November 1945.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/War_Production_Board",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q1536750",
          url: "https://www.wikidata.org/wiki/Q1536750",
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
      id: "wpb-requirements-committee",
      kind: "organization",
      label: "War Production Board Requirements Committee",
      description:
        "The WPB body that estimated controlled-material supplies and made initial allotments among claimant agencies.",
      scope:
        "Controlled Materials Plan supply estimates and claimant-agency allotments during the plan's operation.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "cmp-claimant-agencies",
      kind: "organization",
      label: "Controlled Materials Plan claimant agencies",
      description:
        "The military and civilian agencies receiving and subdividing controlled-material allotments.",
      scope:
        "The officially designated CMP claimant agencies, treated collectively only for their shared allotment role.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "cmp-prime-contractors",
      kind: "organization",
      label: "Controlled Materials Plan prime contractors",
      description:
        "The producers that received schedules and allotments from claimant agencies and passed appropriate quantities to their production chains.",
      scope:
        "Prime contractors only in their documented role within CMP allotment chains; not one corporate body or every wartime contractor.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "cmp-controlled-material-producers",
      kind: "organization",
      label: "Controlled-material producers",
      description:
        "The mills and warehouses whose deliveries of steel, copper, and aluminum were constrained by authorized CMP orders.",
      scope:
        "Producers and distributors of CMP-controlled steel, copper, and aluminum during the bounded episode; not all United States industry.",
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
