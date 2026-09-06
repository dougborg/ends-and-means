import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };
type SourceType =
  | "web-page"
  | "article"
  | "edition"
  | "report"
  | "legal-text"
  | "archival-record";
type WorkType = "book" | "article" | "report" | "law" | "other";
const defaultLinkPurpose = (sourceType: SourceType) => {
  if (sourceType === "legal-text") return "authorized-reading" as const;
  if (sourceType === "archival-record") return "archive" as const;
  return "publisher" as const;
};
const source = (
  id: string,
  title: string,
  contributors: string[],
  workYear: number | undefined,
  sourceYear: number | undefined,
  publisher: string,
  url: string,
  workType: WorkType,
  sourceType: SourceType,
  doi?: string,
  isbn13?: string,
  linkPurpose?: "publisher" | "authorized-reading" | "archive",
): AuthoringDocument[] => [
  {
    documentType: "entity",
    entity: {
      id: `${id}-work`,
      kind: "work",
      label: title,
      description: `The non-fiction work used for evidence about feminism and its bounded institutional contexts: ${title}.`,
      title,
      workType,
      ...(workYear === undefined ? {} : { originalPublicationYear: workYear }),
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: `${id}-source`,
      kind: "source",
      label: title,
      description: `The consulted ${publisher} manifestation of ${title}.`,
      title,
      sourceType,
      workId: `${id}-work`,
      contributorDisplay: contributors,
      ...(sourceYear === undefined ? {} : { publicationYear: sourceYear }),
      publisher,
      ...(doi
        ? { identifiers: { doi } }
        : isbn13
          ? { identifiers: { isbn13 } }
          : {}),
      resourceLinks: [
        {
          purpose: linkPurpose ?? defaultLinkPurpose(sourceType),
          url,
          label: "Open the consulted source",
        },
      ],
      ...reviewed,
    },
  },
];
const claim = (
  id: string,
  label: string,
  text: string,
  statementKind:
    | "definition"
    | "observation"
    | "attributed-value"
    | "attributed-proposal"
    | "causal-hypothesis"
    | "classification"
    | "editorial-interpretation" = "observation",
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
const concept = (
  id: string,
  label: string,
  description: string,
  scopeNote: string,
  externalRefs?: NonNullable<
    Extract<
      AuthoringDocument,
      { documentType: "entity" }
    >["entity"]["externalRefs"]
  >,
): AuthoringDocument => ({
  documentType: "entity",
  entity: {
    id,
    kind: "concept",
    label,
    description,
    schemeIds: ["political-economic-ideas"],
    scopeNote,
    ...(externalRefs ? { externalRefs } : {}),
    ...reviewed,
  },
});

export const feminismEvidenceDocuments = [
  ...source(
    "sep-feminist-political-philosophy",
    "Feminist Political Philosophy",
    ["Noëlle McAfee", "Katie B. Howard"],
    2009,
    2023,
    "Stanford Encyclopedia of Philosophy",
    "https://plato.stanford.edu/entries/feminism-political/",
    "article",
    "web-page",
  ),
  ...source(
    "combahee-statement",
    "The Combahee River Collective Statement",
    ["Combahee River Collective"],
    1977,
    undefined,
    "LGBTQ History Digital Collaboratory",
    "https://www.lgbtqhistory.org/wp-content/uploads/2019/04/Combahee_River_Collective_Statement.pdf",
    "other",
    "edition",
    undefined,
    undefined,
    "archive",
  ),
  ...source(
    "taylor-combahee-reader",
    "How We Get Free: Black Feminism and the Combahee River Collective",
    [
      "Keeanga-Yamahtta Taylor",
      "Barbara Smith",
      "Beverly Smith",
      "Demita Frazier",
    ],
    2017,
    2017,
    "Haymarket Books",
    "https://www.haymarketbooks.org/books/1108-how-we-get-free",
    "book",
    "edition",
    undefined,
    "9781608468553",
  ),
  ...source(
    "crenshaw-demarginalizing",
    "Demarginalizing the Intersection of Race and Sex",
    ["Kimberlé W. Crenshaw"],
    1989,
    1989,
    "University of Chicago Legal Forum",
    "https://scholarship.law.columbia.edu/faculty_scholarship/3007/",
    "article",
    "article",
    undefined,
    undefined,
    "authorized-reading",
  ),
  ...source(
    "harris-kennedy-combahee",
    "From the Kennedy Commission to the Combahee Collective: Black Feminist Organizing, 1960–80",
    ["Duchess Harris"],
    2001,
    2001,
    "New York University Press",
    "https://www.degruyterbrill.com/document/doi/10.18574/nyu/9780814790380.003.0019/html?lang=en",
    "article",
    "article",
    "10.18574/nyu/9780814790380.003.0019",
  ),
  ...source(
    "mohanty-western-eyes-revisited",
    "Under Western Eyes Revisited: Feminist Solidarity through Anticapitalist Struggles",
    ["Chandra Talpade Mohanty"],
    2003,
    2003,
    "Signs",
    "https://www.jstor.org/stable/10.1086/342914",
    "article",
    "article",
    "10.1086/342914",
  ),
  ...source(
    "moreton-robinson-talkin-up",
    "Talkin’ Up to the White Woman: Indigenous Women and Feminism",
    ["Aileen Moreton-Robinson"],
    2000,
    2021,
    "University of Minnesota Press",
    "https://www.upress.umn.edu/9781452966892/talkin-up-to-the-white-woman/",
    "book",
    "edition",
    undefined,
    "9781452966892",
  ),
  ...source(
    "koyama-transfeminist-manifesto",
    "The Transfeminist Manifesto",
    ["Emi Koyama"],
    2001,
    2001,
    "eminism.org",
    "https://eminism.org/readings/pdf-rdg/tfmanifesto.pdf",
    "other",
    "edition",
    undefined,
    undefined,
    "authorized-reading",
  ),
  ...source(
    "fraser-capital-care",
    "Contradictions of Capital and Care",
    ["Nancy Fraser"],
    2016,
    2016,
    "New Left Review",
    "https://newleftreview.org/issues/ii100/articles/nancy-fraser-contradictions-of-capital-and-care",
    "article",
    "article",
    "10.64590/nt2",
  ),
  ...source(
    "sewa-history",
    "History of SEWA",
    ["Self Employed Women's Association"],
    undefined,
    undefined,
    "Self Employed Women's Association",
    "https://www.sewa.org/about-us/history/",
    "other",
    "web-page",
  ),
  ...source(
    "ilo-sewa-cooperatives",
    "Advancing cooperation among women workers in the informal economy: The SEWA way",
    ["Tara Sinha"],
    2018,
    2018,
    "International Labour Organization",
    "https://www.ilo.org/sites/default/files/wcmsp5/groups/public/%40ed_emp/%40emp_ent/%40coop/documents/publication/wcms_633752.pdf",
    "report",
    "report",
    undefined,
    "9789220309766",
  ),
  ...source(
    "iceland-parental-leave-law",
    "Lög um fæðingar- og foreldraorlof, nr. 95/2000",
    ["Alþingi"],
    2000,
    2000,
    "Alþingi",
    "https://www.althingi.is/lagas/125b/2000095.html",
    "law",
    "legal-text",
  ),
  ...source(
    "gislason-iceland-leave",
    "Paid Parental Leave in Iceland: Increasing Gender Equality at Home and on the Labour Market",
    ["Ásdís Aðalbjörg Arnalds", "Guðný Björk Eydal", "Ingólfur V. Gíslason"],
    2022,
    2022,
    "Oxford University Press",
    "https://academic.oup.com/book/44441/chapter/376663976",
    "other",
    "edition",
    "10.1093/oso/9780192856296.003.0018",
  ),
  ...source(
    "arnalds-eydal-gislason-leave",
    "Maternity, paternity, and parental leave: Origin, changes, and impact of a law that aims at encouraging leave use of both parents",
    ["Ásdís A. Arnalds", "Guðný Björk Eydal", "Ingólfur V. Gíslason"],
    2021,
    2021,
    "Icelandic Review of Politics & Administration",
    "https://irpa.is/index.php/irpa/article/view/a.2021.17.2.5",
    "article",
    "article",
    "10.13177/irpa.a.2021.17.2.5",
  ),

  concept(
    "feminism",
    "Feminism",
    "A contested family of analyses, movements, and political projects concerned with gendered power and sexist oppression.",
    "Keep beliefs, analyses, movements, organizations, programs, self-descriptions, and external labels distinct; the name does not supply one subject, doctrine, chronology, or policy package.",
    [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Feminism",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q7252",
        url: "https://www.wikidata.org/wiki/Q7252",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
  ),
  {
    documentType: "entity",
    entity: {
      id: "feminist-traditions",
      kind: "collection",
      label: "Feminist traditions",
      description:
        "A non-exhaustive, non-inheriting grouping of historically situated and internally disputed feminist traditions.",
      inclusionRule:
        "Include only through a qualified, sourced relationship; membership transmits no end, means, position, subject, or case classification.",
      editorialPurpose:
        "Keep related traditions navigable without turning them into branches of a universal doctrine.",
      externalRefs: [{ system: "wikipedia", url: "https://en.wikipedia.org/wiki/Feminism", purpose: "orientation", language: "en", checkedAt: "2026-09-06" }],
      ...reviewed,
    },
  },
  concept(
    "liberal-feminism",
    "Liberal feminism",
    "Feminist arguments that work with and revise liberal commitments such as equal personhood, liberty, and autonomy.",
    "Not every rights claim is liberal feminist, and liberal feminists disagree about formal equality, family, dependency, and material conditions.",
    [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Liberal_feminism",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q1987244",
        url: "https://www.wikidata.org/wiki/Q1987244",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
  ),
  concept(
    "socialist-feminism",
    "Socialist feminism",
    "Feminist analyses connecting gendered oppression with class, labor, ownership, care, and social reproduction.",
    "Do not collapse socialist, Marxist, and materialist feminisms or infer a shared program from the label.",
    [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Socialist_feminism",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q2225347",
        url: "https://www.wikidata.org/wiki/Q2225347",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
  ),
  concept(
    "marxist-feminism",
    "Marxist feminism",
    "Feminist analysis drawing on and revising Marxist accounts of production, labor, class, and social reproduction.",
    "Related to but not interchangeable with socialist feminism or every feminism critical of capitalism.",
    [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Marxist_feminism",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q1321958",
        url: "https://www.wikidata.org/wiki/Q1321958",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
  ),
  concept(
    "radical-feminism",
    "Radical feminism",
    "A disputed feminist tradition locating gender domination in basic social structures rather than only unequal legal treatment.",
    "Historical radical-feminist theories differ, including over sexuality, biology, race, class, and trans inclusion; the label supplies no inherited position.",
    [
      {
        system: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Radical_feminism",
        purpose: "orientation",
        language: "en",
        checkedAt: "2026-09-06",
      },
      {
        system: "wikidata",
        id: "Q2914207",
        url: "https://www.wikidata.org/wiki/Q2914207",
        purpose: "identity",
        match: "exact",
        checkedAt: "2026-09-06",
      },
    ],
  ),
  {
    documentType: "entity",
    entity: {
      id: "self-employed-worker-unionism",
      kind: "means",
      label: "Self-employed worker unionism",
      description:
        "Workers outside a conventional employer-employee relation organize a membership union for collective recognition and bargaining.",
      institutionalForm:
        "A registered membership union organizes self-employed workers across trades and presses institutions to recognize them as workers.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "member-owned-cooperative-finance",
      kind: "means",
      label: "Member-owned cooperative finance",
      description:
        "Members capitalize and govern a cooperative financial institution designed around their work and credit needs.",
      institutionalForm:
        "Members contribute share capital to a cooperative bank that provides small-scale savings and credit services.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "nontransferable-parental-leave",
      kind: "means",
      label: "Non-transferable paid parental leave",
      description:
        "Paid leave reserves an individual entitlement for each parent instead of making every leave period transferable within a household.",
      institutionalForm:
        "A public fund replaces earnings during individual reserved periods and a separately shareable period, subject to eligibility and payment rules.",
      externalRefs: [{ system: "wikipedia", url: "https://en.wikipedia.org/wiki/Parental_leave", purpose: "orientation", language: "en", checkedAt: "2026-09-06" }],
      ...reviewed,
    },
  },

  claim(
    "feminism-contested-family",
    "Feminism is a contested family",
    "Feminism names multiple, sometimes conflicting analyses and political projects rather than one doctrine or institutional program.",
    "definition",
  ),
  claim(
    "feminism-analysis-action-distinction",
    "Analysis and political project are distinct",
    "Feminist political philosophy both analyzes gendered power and proposes changes to collective institutions, but an analysis does not by itself identify a movement, organization, or program.",
    "editorial-interpretation",
  ),
  claim(
    "feminism-public-private-boundary",
    "Feminist analysis contests a narrow public-private boundary",
    "Feminist political thinkers have treated family, workplaces, reproduction, and civil society as sites of power rather than presuming that only state government is political.",
  ),
  claim(
    "feminism-traditions-nonexhaustive",
    "Tradition labels are non-exhaustive",
    "The selected tradition labels are a non-exhaustive navigation aid and transmit no shared doctrine, political subject, or institutional program.",
    "editorial-interpretation",
  ),
  claim(
    "liberal-feminism-tradition",
    "Liberal feminism is a named current",
    "The Stanford Encyclopedia identifies liberal feminism as a current in feminist political thought organized around disputed accounts of personal and political autonomy.",
  ),
  claim(
    "radical-feminism-tradition",
    "Radical feminism is a named current",
    "The Stanford Encyclopedia identifies radical feminism as a current that seeks structural change and disputes liberal emphasis on individual choice.",
  ),
  claim(
    "socialist-feminism-tradition",
    "Socialist feminism is a named current",
    "The Stanford Encyclopedia identifies socialist feminism as a current concerned with material conditions, class relations, labor, and social reproduction.",
  ),
  claim(
    "marxist-feminism-tradition",
    "Marxist feminism is a named current",
    "The Stanford Encyclopedia identifies Marxist feminism as a related but distinct current that analyzes gendered institutions through modes and relations of production and reproduction.",
  ),
  claim(
    "liberal-feminism-autonomy",
    "Liberal feminism emphasizes autonomy",
    "Liberal feminist arguments commonly seek to protect and expand personal and political autonomy while also disputing liberal accounts of family, privacy, and dependency.",
  ),
  claim(
    "radical-feminism-structural-boundary",
    "Radical feminism targets structural domination",
    "Radical feminist theories distinguish structural gender domination from unequal treatment that can be remedied only through individual choice or formal legal equality.",
  ),
  claim(
    "socialist-feminism-material-boundary",
    "Socialist feminism analyzes material relations",
    "Socialist feminist work connects gender hierarchy to class, labor, household relations, and social reproduction.",
  ),
  claim(
    "formal-substantive-equality-boundary",
    "Formal equality does not establish material equality",
    "Formal equality in law does not by itself establish substantive equality in material and social conditions.",
    "editorial-interpretation",
  ),
  claim(
    "crenshaw-single-axis-limit",
    "Crenshaw identifies a single-axis limit",
    "Crenshaw argues that treating race and gender as mutually exclusive categories marginalizes Black women's discrimination claims in law, feminist theory, and antiracist politics.",
  ),
  claim(
    "mohanty-western-universal-limit",
    "Mohanty rejects a universalized Western subject",
    "Mohanty argues that cross-border feminist solidarity must be built through historically specific analysis and common political struggle rather than an assumed homogeneous category of Third World women.",
  ),
  claim(
    "moreton-robinson-indigenous-boundary",
    "Moreton-Robinson centers an Indigenous standpoint",
    "Moreton-Robinson argues that white Australian feminists' social position affects their authority to represent Indigenous women.",
  ),
  claim(
    "koyama-transfeminist-self-description",
    "Koyama defines transfeminism through trans women's liberation",
    "Koyama describes transfeminism as a movement led principally by and for trans women whose liberation is linked with the liberation of other women and wider coalitions.",
    "definition",
  ),
  claim(
    "koyama-body-autonomy",
    "Koyama attributes bodily autonomy to transfeminism",
    "Koyama's manifesto claims individual authority over gender identity, expression, and bodily decisions against political, medical, or religious coercion.",
    "attributed-value",
  ),
  claim(
    "sex-gender-trans-boundary",
    "Sex, gender, and trans identity are not interchangeable",
    "Koyama distinguishes sex assignment at birth from gender identity and gender expression.",
    "definition",
  ),
  claim(
    "fraser-social-reproduction-definition",
    "Fraser defines social reproduction broadly",
    "Fraser uses social reproduction for material and affective work that sustains people, households, communities, and social bonds, much of it historically assigned to women and unpaid.",
    "definition",
  ),
  claim(
    "fraser-care-capitalism-claim",
    "Fraser attributes care pressures to capitalist organization",
    "Fraser argues that capitalist accumulation depends on social-reproductive activity while tending to destabilize it; this is a situated theoretical claim, not an observed effect of every market institution.",
    "causal-hypothesis",
  ),
  claim(
    "combahee-self-description",
    "Combahee articulated Black feminist coalition politics",
    "The Combahee River Collective described its politics as Black feminist and socialist.",
    "classification",
  ),
  claim(
    "combahee-opposed-interlocking-oppressions",
    "Combahee opposed multiple forms of oppression",
    "The Combahee River Collective stated a commitment to struggle against racial, sexual, heterosexual, and class oppression.",
    "attributed-value",
  ),
  claim(
    "combahee-organizing-practice",
    "Combahee combined reflection with organizing",
    "Between 1974 and 1980, the Boston collective used political education and coalition organizing.",
  ),
  claim(
    "combahee-selected-campaigns",
    "Combahee organized around selected campaigns",
    "The collective organized around reproductive freedom, health care, violence against women, and the 1979 murders of Black women in Boston.",
  ),
  claim(
    "combahee-case-boundary",
    "Combahee does not stand for all Black feminism",
    "The Combahee River Collective is one bounded Black feminist socialist organization; its statement and practices do not define all Black feminism or later intersectionality.",
    "editorial-interpretation",
  ),
  claim(
    "sewa-union-registration",
    "SEWA registered as a trade union",
    "SEWA registered as a trade union on 12 April 1972.",
  ),
  claim(
    "sewa-worker-definition-contest",
    "SEWA contested a conventional worker definition",
    "SEWA's organizers challenged the claim that workers required a conventional employer before they could register a union.",
  ),
  claim(
    "sewa-cooperative-bank",
    "SEWA members capitalized a cooperative bank",
    "In 1974, 4,000 SEWA members each contributed ten rupees in share capital to establish the SEWA Cooperative Bank.",
  ),
  claim(
    "sewa-quilt-cooperative",
    "Quilt workers formed a producer cooperative",
    "Ahmedabad quilt makers participating in SEWA formed a producer cooperative in 1977 to market their products.",
  ),
  claim(
    "sewa-case-boundary",
    "SEWA joined several movement traditions",
    "SEWA's selected Ahmedabad union and cooperative institutions do not represent all informal workers or establish a general model of feminism.",
    "editorial-interpretation",
  ),
  claim(
    "iceland-leave-enacted-design",
    "Iceland enacted individual paid leave entitlements",
    "Iceland's 2000 law established a phased design of three non-transferable paid months for each parent plus three months parents could divide, financed and administered through a public leave fund.",
  ),
  claim(
    "iceland-fathers-uptake",
    "Fathers' leave uptake rose after enactment",
    "Among eligible Icelandic fathers, leave uptake rose from roughly 0.2–0.3 percent before the reform to 82.4 percent in 2001 and 89.8 percent in 2004.",
  ),
  claim(
    "iceland-care-work-outcomes",
    "Later surveys found increased paternal care",
    "Surveys of Icelandic first-time parents found that fathers performed a larger share of care after the leave reform.",
  ),
  claim(
    "iceland-labor-force-participation-gap",
    "Later surveys found a narrower employment gap",
    "Across the surveyed cohorts, the difference between mothers' and fathers' employment rates three years after their first child's birth became smaller.",
  ),
  claim(
    "iceland-working-hours-gap",
    "Later surveys found a narrower working-hours gap",
    "Across the surveyed cohorts, mothers' average paid working hours increased while fathers' average paid working hours decreased.",
  ),
  claim(
    "iceland-causal-transfer-limit",
    "The Iceland evidence has causal and transfer limits",
    "The selected Iceland studies do not isolate the leave design from every concurrent social change.",
  ),
  claim(
    "iceland-payment-cuts-uptake",
    "Payment cuts changed fathers' leave use",
    "Payment cuts during Iceland's financial crisis were associated with reduced leave use by fathers, with the largest drop among fathers with high incomes.",
  ),

  {
    documentType: "entity",
    entity: {
      id: "boston",
      kind: "place",
      label: "Boston",
      description:
        "Boston, Massachusetts, the geographic boundary for the Combahee case.",
      placeType: "city",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Boston",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q100",
          url: "https://www.wikidata.org/wiki/Q100",
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
      id: "ahmedabad",
      kind: "place",
      label: "Ahmedabad",
      description:
        "Ahmedabad, Gujarat, the geographic boundary for the SEWA case.",
      placeType: "city",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Ahmedabad",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q1070",
          url: "https://www.wikidata.org/wiki/Q1070",
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
      id: "iceland-modern-state",
      kind: "place",
      label: "Iceland",
      description: "The state jurisdiction for the parental-leave case.",
      placeType: "country",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Iceland",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q189",
          url: "https://www.wikidata.org/wiki/Q189",
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
      id: "combahee-river-collective-1974-1980",
      kind: "case",
      label: "Combahee River Collective, Boston, 1974–1980",
      description:
        "A bounded study of one Black feminist socialist collective's self-description, political education, and coalition organizing.",
      locationIds: ["boston"],
      startDate: { year: 1974, certainty: "exact" },
      endDate: { year: 1980, certainty: "exact" },
      scope:
        "The collective's Boston-area organization and selected campaigns from 1974 to 1980; not all Black feminism, identity politics, or intersectionality.",
      selectionRationale:
        "The case tests coalition against a presumed universal womanhood through an organization's own account and independent oral history.",
      conditionStatementIds: [],
      episodeIds: ["combahee-organizing-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "combahee-organizing-episode",
      kind: "case-episode",
      label: "Combahee organizing, 1974–1980",
      description: "The collective's active Boston interval.",
      caseId: "combahee-river-collective-1974-1980",
      locationIds: ["boston"],
      startDate: { year: 1974, certainty: "exact" },
      endDate: { year: 1980, certainty: "exact" },
      scope:
        "Selected organizing documented in the collective statement and members' oral histories.",
      conditionStatementIds: [],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: ["combahee-organizing-practice"],
      interactionStatementIds: [],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "sewa-ahmedabad-1972-1977",
      kind: "case",
      label: "SEWA institutions in Ahmedabad, 1972–1977",
      description:
        "A bounded study of trade-union recognition and member-owned cooperative finance for self-employed women workers.",
      locationIds: ["ahmedabad"],
      startDate: { year: 1972, certainty: "exact" },
      endDate: { year: 1977, certainty: "exact" },
      scope:
        "Selected Ahmedabad union and cooperative institutions formed from 1972 through 1977; not later SEWA affiliates or informal workers generally.",
      selectionRationale:
        "The case connects labor, credit, and women's organizing while preserving organizational and geographic limits.",
      conditionStatementIds: [],
      episodeIds: ["sewa-ahmedabad-institutions-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "sewa-ahmedabad-institutions-episode",
      kind: "case-episode",
      label: "SEWA union and cooperative formation",
      description:
        "The 1972–1977 interval in which the union, cooperative bank, and selected producer cooperative formed.",
      caseId: "sewa-ahmedabad-1972-1977",
      locationIds: ["ahmedabad"],
      startDate: { year: 1972, certainty: "exact" },
      endDate: { year: 1977, certainty: "exact" },
      scope:
        "Documented Ahmedabad institutions, without generalizing later national membership or outcomes backward.",
      conditionStatementIds: [],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: [
        "sewa-cooperative-bank",
        "sewa-quilt-cooperative",
      ],
      interactionStatementIds: ["sewa-worker-definition-contest"],
      outcomeStatementIds: ["sewa-union-registration"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "iceland-parental-leave-2000-2018",
      kind: "case",
      label: "Iceland paid parental leave evidence, 2000–2018",
      description:
        "A bounded study of the 2000 leave design, phased implementation, take-up, care practices, and crisis-era payment changes.",
      locationIds: ["iceland-modern-state"],
      startDate: { year: 2000, certainty: "exact" },
      endDate: { year: 2018, certainty: "exact" },
      scope:
        "The law enacted in 2000 and observations collected through 2018, including a 2014 birth cohort; not current Icelandic law or proof that one policy caused every observed gender change.",
      selectionRationale:
        "The case distinguishes enacted entitlement, actual uptake, observed outcomes, and causal limits for a care-related institution.",
      conditionStatementIds: [],
      episodeIds: ["iceland-parental-leave-outcomes-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "iceland-parental-leave-outcomes-episode",
      kind: "case-episode",
      label: "Iceland leave design and early outcomes",
      description:
        "The enacted design and evidence window from 2000 through 2018.",
      caseId: "iceland-parental-leave-2000-2018",
      locationIds: ["iceland-modern-state"],
      startDate: { year: 2000, certainty: "exact" },
      endDate: { year: 2018, certainty: "exact" },
      scope:
        "Formal rules, uptake, and observations collected through 2018, with causal limits kept explicit.",
      conditionStatementIds: [],
      formalRuleStatementIds: ["iceland-leave-enacted-design"],
      ruleInUseStatementIds: [
        "iceland-fathers-uptake",
        "iceland-payment-cuts-uptake",
      ],
      interactionStatementIds: [],
      outcomeStatementIds: [
        "iceland-care-work-outcomes",
        "iceland-labor-force-participation-gap",
        "iceland-working-hours-gap",
      ],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
