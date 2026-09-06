import type { AuthoringDocument, DomainEntity } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

const entities = [
  {
    id: "west-sumatra",
    kind: "place",
    label: "West Sumatra",
    description: "An Indonesian province on the island of Sumatra.",
    placeType: "region",
  },
  {
    id: "nagari-koto-tinggi-agam",
    kind: "place",
    label: "Nagari Koto Tinggi, Agam",
    description:
      "The nagari in Baso subdistrict, Agam Regency, examined during October 2016 fieldwork.",
    placeType: "institutional-jurisdiction",
  },
  {
    id: "nagari-bonjol-dharmasraya",
    kind: "place",
    label: "Nagari Bonjol, Dharmasraya",
    description:
      "The nagari in Koto Besar subdistrict, Dharmasraya Regency, examined during 2016 communal-forest fieldwork.",
    placeType: "institutional-jurisdiction",
  },
  {
    id: "nurdin-nagari-governance-work",
    kind: "work",
    label: "New Value Within Old Structure",
    description:
      "Ismail Nurdin’s public-administration case study of adat revival and local capacity in Koto Tinggi.",
    title:
      "New Value Within Old Structure: The Creation of Organizational Culture of Nagari in Indonesian Decentralization Era",
    workType: "article",
    originalPublicationYear: 2017,
  },
  {
    id: "nurdin-nagari-governance-source",
    kind: "source",
    label: "Koto Tinggi nagari governance study (2017)",
    description:
      "The open-access journal manifestation, whose PDF uses the English running title ‘Adat Revival and Local Capacity in Indonesia: The Case of Nagari.’",
    title:
      "New Value Within Old Structure: The Creation of Organizational Culture of Nagari in Indonesian Decentralization Era",
    sourceType: "article",
    workId: "nurdin-nagari-governance-work",
    contributorDisplay: ["Ismail Nurdin"],
    publicationYear: 2017,
    publisher: "Sosiohumaniora, Universitas Padjadjaran",
    identifiers: { doi: "10.24198/sosiohumaniora.v19i2.11398" },
    resourceLinks: [
      {
        purpose: "authorized-reading",
        url: "https://journals.unpad.ac.id/sosiohumaniora/article/view/11398",
        label: "Read the journal article",
      },
    ],
  },
  {
    id: "mutolib-bonjol-ulayat-work",
    kind: "work",
    label: "Gender Inequality in Nagari Bonjol Ulayat Management",
    description:
      "A field study of communal-forest management within the Melayu clan of Nagari Bonjol.",
    title:
      "Gender Inequality and the Oppression of Women within Minangkabau Matrilineal Society: A Case Study of the Management of Ulayat Forest Land in Nagari Bonjol, Dharmasraya District, West Sumatra Province, Indonesia",
    workType: "article",
    originalPublicationYear: 2016,
  },
  {
    id: "mutolib-bonjol-ulayat-source",
    kind: "source",
    label: "Nagari Bonjol ulayat forest study (2016)",
    description:
      "The open-access peer-reviewed article by researchers at Andalas University and the University of Lampung.",
    title:
      "Gender Inequality and the Oppression of Women within Minangkabau Matrilineal Society: A Case Study of the Management of Ulayat Forest Land in Nagari Bonjol, Dharmasraya District, West Sumatra Province, Indonesia",
    sourceType: "article",
    workId: "mutolib-bonjol-ulayat-work",
    contributorDisplay: ["Abdul Mutolib", "Yonariza", "Mahdi", "Hanung Ismono"],
    publicationYear: 2016,
    publisher: "Asian Women",
    identifiers: { doi: "10.14431/aw.2016.09.32.3.23" },
    resourceLinks: [
      {
        purpose: "authorized-reading",
        url: "https://e-asianwomen.org/search.php?where=aview&id=10.14431/aw.2016.09.32.3.23&code=0274AW&vmode=FULL",
        label: "Read the journal article",
      },
    ],
  },
  {
    id: "blackwood-webs-power-work",
    kind: "work",
    label: "Webs of Power",
    description:
      "Evelyn Blackwood’s ethnography of gender, kinship, and power in one rural Minangkabau village.",
    title: "Webs of Power: Women, Kin, and Community in a Sumatran Village",
    workType: "book",
    originalPublicationYear: 2000,
  },
  {
    id: "blackwood-webs-power-source",
    kind: "source",
    label: "Webs of Power (2000)",
    description:
      "The Rowman & Littlefield edition, checked through the publisher’s authorized preview.",
    title: "Webs of Power: Women, Kin, and Community in a Sumatran Village",
    sourceType: "edition",
    workId: "blackwood-webs-power-work",
    contributorDisplay: ["Evelyn Blackwood"],
    publicationYear: 2000,
    publisher: "Rowman & Littlefield",
    identifiers: { isbn10: "0847699110", isbn13: "9780847699117" },
    resourceLinks: [
      {
        purpose: "publisher",
        url: "https://www.bloomsbury.com/us/webs-of-power-9780847699117/",
        label: "View the publisher record",
      },
      {
        purpose: "authorized-reading",
        url: "https://books.google.com/books?id=Bs1t0QUOeKsC",
        label: "Inspect the 2000 edition preview",
      },
    ],
  },
  {
    id: "sanday-women-center-work",
    kind: "work",
    label: "Women at the Center",
    description:
      "Peggy Reeves Sanday’s ethnography and proposed redefinition of matriarchy in a Minangkabau setting.",
    title: "Women at the Center: Life in a Modern Matriarchy",
    workType: "book",
    originalPublicationYear: 2002,
  },
  {
    id: "sanday-women-center-excerpt-source",
    kind: "source",
    label: "Women at the Center author excerpt",
    description:
      "Sanday’s University of Pennsylvania author page presenting the book’s preface and interpretive framing.",
    title: "Women at the Center: Life in a Modern Matriarchy",
    sourceType: "web-page",
    workId: "sanday-women-center-work",
    contributorDisplay: ["Peggy Reeves Sanday"],
    publicationYear: 2002,
    publisher: "University of Pennsylvania",
    resourceLinks: [
      {
        purpose: "authorized-reading",
        url: "https://web.sas.upenn.edu/psanday/books/women-at-the-center-life-in-a-modern-matriarchy/",
        label: "Read the author’s excerpt",
      },
    ],
  },
  {
    id: "sebastian-matrilineal-muslims-work",
    kind: "work",
    label: "Matrilineal Practices among Muslims",
    description:
      "Aleena Sebastian’s ethnographic study of changing Minangkabau matrilineal practices.",
    title:
      "Matrilineal Practices among Muslims: An Ethnographic Study of the Minangkabau of West Sumatra",
    workType: "article",
    originalPublicationYear: 2022,
  },
  {
    id: "sebastian-matrilineal-muslims-source",
    kind: "source",
    label: "Matrilineal Practices among Muslims (2022)",
    description:
      "The SAGE article record and abstract for Sebastian’s historically situated ethnographic account.",
    title:
      "Matrilineal Practices among Muslims: An Ethnographic Study of the Minangkabau of West Sumatra",
    sourceType: "article",
    workId: "sebastian-matrilineal-muslims-work",
    contributorDisplay: ["Aleena Sebastian"],
    publicationYear: 2022,
    publisher: "Ethnography, SAGE Publications",
    identifiers: { doi: "10.1177/14661381221147137" },
    resourceLinks: [
      {
        purpose: "publisher",
        url: "https://journals.sagepub.com/doi/10.1177/14661381221147137",
        label: "View the journal article",
      },
    ],
  },
  {
    id: "mardoni-matrilineal-data-center-work",
    kind: "work",
    label: "Pusat Data Matrilineal",
    description:
      "An Indonesian-language account of the West Sumatra cultural-preservation office’s matrilineal data center.",
    title:
      "Pusat Data Matrilineal Sebagai Sumber Sejarah dan Budaya Minangkabau",
    workType: "other",
    originalPublicationYear: 2019,
  },
  {
    id: "mardoni-matrilineal-data-center-source",
    kind: "source",
    label: "Pusat Data Matrilineal (2019)",
    description:
      "Mardoni’s Indonesian-language article for the West Sumatra cultural-preservation office.",
    title:
      "Pusat Data Matrilineal Sebagai Sumber Sejarah dan Budaya Minangkabau",
    sourceType: "web-page",
    workId: "mardoni-matrilineal-data-center-work",
    contributorDisplay: ["Mardoni"],
    publicationYear: 2019,
    publisher: "Balai Pelestarian Nilai Budaya Sumatera Barat",
    resourceLinks: [
      {
        purpose: "publisher",
        url: "https://kebudayaan.kemdikbud.go.id/bpnbsumbar/pusat-data-matrilineal-sebagai-sumber-sejarah-dan-budaya-minangkabau/",
        label: "Read the Indonesian-language article",
      },
    ],
  },
  {
    id: "west-sumatra-nagari-law-2018-work",
    kind: "work",
    label: "West Sumatra Nagari Regulation (2018)",
    description:
      "The provincial regulation governing nagari as customary-law community government after the two case periods.",
    title:
      "Peraturan Daerah Provinsi Sumatera Barat Nomor 7 Tahun 2018 tentang Nagari",
    workType: "law",
    originalPublicationYear: 2018,
  },
  {
    id: "west-sumatra-nagari-law-2018-source",
    kind: "source",
    label: "West Sumatra Regulation No. 7 of 2018",
    description:
      "The official Indonesian legal record and text published through the national audit board’s legislation database.",
    title:
      "Peraturan Daerah Provinsi Sumatera Barat Nomor 7 Tahun 2018 tentang Nagari",
    sourceType: "legal-text",
    workId: "west-sumatra-nagari-law-2018-work",
    contributorDisplay: ["Pemerintah Provinsi Sumatera Barat"],
    publicationYear: 2018,
    publisher: "Database Peraturan BPK",
    resourceLinks: [
      {
        purpose: "publisher",
        url: "https://peraturan.bpk.go.id/Details/99639/perda-",
        label: "Read the official legal record",
      },
    ],
  },
  {
    id: "colombijn-padang-landownership-work",
    kind: "work",
    label: "Dynamics and Dynamite",
    description:
      "Freek Colombijn’s study of landownership and property categories in 1990s Padang.",
    title:
      "Dynamics and Dynamite: Minangkabau Urban Landownership in the 1990s",
    workType: "article",
    originalPublicationYear: 1992,
  },
  {
    id: "colombijn-padang-landownership-source",
    kind: "source",
    label: "Minangkabau urban landownership study (1992)",
    description:
      "The Bijdragen tot de Taal-, Land- en Volkenkunde article, checked against an author-uploaded full-text copy, on property categories and changing landownership in Padang.",
    title:
      "Dynamics and Dynamite: Minangkabau Urban Landownership in the 1990s",
    sourceType: "article",
    workId: "colombijn-padang-landownership-work",
    contributorDisplay: ["Freek Colombijn"],
    publicationYear: 1992,
    publisher: "Brill",
    identifiers: { doi: "10.1163/22134379-90003145" },
    resourceLinks: [
      {
        purpose: "publisher",
        url: "https://doi.org/10.1163/22134379-90003145",
        label: "View the journal article",
      },
      {
        purpose: "authorized-reading",
        url: "https://www.researchgate.net/publication/41017572_Dynamics_and_dynamite_Minangkabau_urban_landownership_in_the_1990s",
        label: "Read the author-uploaded article",
      },
    ],
  },
  {
    id: "matriliny-maternal-descent-definition",
    kind: "statement",
    label: "Matriliny traces descent through mothers",
    description: "A locally published definition of maternal-line descent.",
    statementKind: "definition",
    text: "Mardoni defines Minangkabau matriliny as a kinship system in which people trace descent through their mother and earlier women in that maternal line.",
  },
  {
    id: "matrilocality-residence-distinction",
    kind: "statement",
    label: "Matrilocality concerns residence after marriage",
    description:
      "A distinction between postmarital residence and maternal-line descent.",
    statementKind: "definition",
    text: "Sanday describes husbands moving into their wives’ households in the community she studied; that residence pattern is matrilocality and should not be inferred from matriliny alone.",
  },
  {
    id: "matriliny-does-not-fix-authority",
    kind: "statement",
    label: "Matriliny does not settle authority",
    description:
      "An analytical boundary between a descent principle and distributions of power.",
    statementKind: "editorial-interpretation",
    text: "Maternal-line descent does not by itself establish residence, control of property, political office, or equality; those arrangements must be observed separately in a specified place and period.",
  },
  {
    id: "matriarchy-rule-by-women-dispute",
    kind: "statement",
    label: "Matriarchy has disputed meanings",
    description:
      "A distinction between political domination and Sanday’s maternal-centered interpretation.",
    statementKind: "editorial-interpretation",
    text: "Sanday rejects ‘rule by women’ as the only meaning of matriarchy and instead interprets Minangkabau matriarchaat through maternal meanings, cooperation, and women’s centrality in family and property customs.",
  },
  {
    id: "minangkabau-power-varies-by-relation",
    kind: "statement",
    label: "Power varies across relationships",
    description:
      "Blackwood’s argument against reducing gendered power to formal office alone.",
    statementKind: "editorial-interpretation",
    text: "Blackwood argues from one late-twentieth-century village that women exercised power as heirs, household heads, land controllers, and participants in kin networks even while men claimed formal authority as maternal uncles or titled leaders.",
  },
  {
    id: "minangkabau-practices-historically-changing",
    kind: "statement",
    label: "Matrilineal practices change historically",
    description:
      "A historical limit on treating Minangkabau institutions as timeless.",
    statementKind: "observation",
    text: "Sebastian situates Minangkabau matrilineal practices amid colonial rule, markets, Islamic reform, legislation, and other social changes rather than treating custom and religion as fixed opposites.",
  },
  {
    id: "adat-translation-boundary",
    kind: "statement",
    label: "Adat is broader than a single rulebook",
    description: "A translation note for a retained local term.",
    statementKind: "definition",
    text: "In this guide, adat retains the local term for customs, beliefs, norms, and laws; translating it only as ‘customary law’ would narrow the practices examined by the sources.",
  },
  {
    id: "nagari-translation-boundary",
    kind: "statement",
    label: "Nagari joins community and government",
    description: "A translation note for a retained local institution name.",
    statementKind: "definition",
    text: "Nagari is retained for a West Sumatran community and territorial jurisdiction whose customary institutions interact with Indonesian village administration; it is not treated as interchangeable with village in every period.",
  },
  {
    id: "minangkabau-legal-orders-interact",
    kind: "statement",
    label: "Adat, Islamic, and state institutions interact",
    description:
      "A boundary against collapsing distinct legal and institutional orders.",
    statementKind: "observation",
    text: "Studies of Minangkabau institutions describe adat, Islamic reform and authority, and Indonesian law and administration as distinct but interacting orders whose relationship has changed over time.",
  },
  {
    id: "minangkabau-ancestral-acquired-property-distinction",
    kind: "statement",
    label: "Ancestral and acquired property are distinct categories",
    description:
      "A property-category distinction documented in urban Padang, outside the two cases.",
    statementKind: "observation",
    text: "In 1990s Padang, Colombijn distinguishes high ancestral property from harta pencaharian acquired through a person’s own efforts; that urban evidence clarifies the categories but does not establish the holdings or rules in Koto Tinggi or Bonjol.",
  },
  {
    id: "koto-tinggi-minangkabau-adat-context",
    kind: "statement",
    label: "Koto Tinggi’s institutions were presented in an adat context",
    description:
      "A narrow link between the named case and Minangkabau institutional context.",
    statementKind: "observation",
    text: "Nurdin presents Koto Tinggi as a Minangkabau nagari in which revived adat institutions interacted with post-decentralization public administration; the study does not separately document descent or postmarital residence there.",
  },
  {
    id: "koto-tinggi-fieldwork-scope",
    kind: "statement",
    label: "Koto Tinggi evidence has a narrow fieldwork base",
    description: "The reported method and its voice limitation.",
    statementKind: "observation",
    text: "Nurdin’s Koto Tinggi case rests on observation, interviews, a focus group, and document study conducted in October 2016, but the article does not report participant counts or identify whose testimony represented women’s experience.",
  },
  {
    id: "koto-tinggi-three-institutions",
    kind: "statement",
    label: "Koto Tinggi had three principal institutions",
    description: "The formal institutional arrangement reported for the case.",
    statementKind: "observation",
    text: "Under Agam Regulation 12 of 2007, Koto Tinggi’s nagari structure comprised an elected wali nagari and executive staff, a representative Nagari Council, and a Kerapatan Adat Nagari customary council drawn from kin groups.",
  },
  {
    id: "koto-tinggi-formal-participation-rules",
    kind: "statement",
    label: "Formal planning rules included women’s-group delegates",
    description: "The stated participation and decision rules.",
    statementKind: "observation",
    text: "Nurdin reports that the Nagari Council convened development meetings whose invited delegates included representatives of women’s groups.",
  },
  {
    id: "koto-tinggi-formal-decision-rule",
    kind: "statement",
    label: "Formal meetings required quorum and preferred consensus",
    description: "The stated quorum and decision rule.",
    statementKind: "observation",
    text: "The formal meeting procedure required a two-thirds quorum and preferred consensus after participants could speak, with majority voting available if consensus failed.",
  },
  {
    id: "koto-tinggi-customary-council-contestation",
    kind: "statement",
    label: "Customary leaders contested the dual-council design",
    description: "A locally reported institutional disagreement.",
    statementKind: "observation",
    text: "The Koto Tinggi customary-council head and another adat leader told Nurdin that the representative council displaced the customary council from legislative work, while the formal design kept both councils.",
  },
  {
    id: "koto-tinggi-budget-rules-in-use",
    kind: "statement",
    label: "The 2016 budget meeting exposed rules-in-use",
    description: "An observed interaction among executive and council actors.",
    statementKind: "observation",
    text: "In 2016 the wali nagari delivered a draft budget too late for review, and council members secured a one-week postponement.",
  },
  {
    id: "koto-tinggi-budget-consensus",
    kind: "statement",
    label: "The reconvened budget meeting reached consensus",
    description: "The reported decision after the postponement.",
    statementKind: "observation",
    text: "The reconvened 2016 meeting reached consensus on allocations for infrastructure, housing repairs, and scholarships.",
  },
  {
    id: "koto-tinggi-administrative-capacity-limit",
    kind: "statement",
    label: "Administrative capacity constrained implementation",
    description: "The study’s observed limit on local program management.",
    statementKind: "observation",
    text: "Nurdin reports incomplete planning documents, unspent funds, and difficulty meeting accounting requirements in Koto Tinggi.",
  },
  {
    id: "koto-tinggi-regulatory-preparation-limit",
    kind: "statement",
    label: "Council members reported inadequate regulatory preparation",
    description: "Attributed testimony about administrative preparation.",
    statementKind: "observation",
    text: "Council members told Nurdin that nagari personnel had not been adequately prepared for changing regulations.",
  },
  {
    id: "bonjol-study-method-and-voice",
    kind: "statement",
    label: "Bonjol evidence combines several limited methods",
    description: "The reported sample and its limits.",
    statementKind: "observation",
    text: "The Bonjol study collected data from January through April 2016 through four months of participant observation, 13 key-informant interviews, agency records, and a random household sample of 27 married women.",
  },
  {
    id: "bonjol-new-nagari-forest-transition",
    kind: "statement",
    label: "Administrative and forest transitions changed control",
    description: "The episode’s institutional starting conditions.",
    statementKind: "observation",
    text: "The Bonjol study reports that decentralization ended desa administration around 2000 and Bonjol became a separate nagari.",
  },
  {
    id: "bonjol-concession-end-transition",
    kind: "statement",
    label: "A concession ending changed forest access",
    description: "The reported 2002 forest transition.",
    statementKind: "observation",
    text: "When a forest concession ended in 2002, Melayu-clan leaders and state and company actors negotiated access to land claimed both as state forest and ulayat.",
  },
  {
    id: "bonjol-ulayat-formal-distinction",
    kind: "statement",
    label: "Ulayat joined collective claims and delegated management",
    description:
      "A distinction among collective title, access, and management.",
    statementKind: "observation",
    text: "The study describes Melayu-clan ulayat as collectively held land to which clan members could seek access.",
  },
  {
    id: "bonjol-ulayat-delegated-management",
    kind: "statement",
    label: "Named officeholders managed ulayat for the clan",
    description:
      "A distinction between delegated management and personal ownership.",
    statementKind: "observation",
    text: "A Datuak, or titled customary leader, and mamak kepala waris, maternal-kin property managers, managed the Melayu clan’s ulayat rather than owning it personally.",
  },
  {
    id: "bonjol-harta-pusaka-transition",
    kind: "statement",
    label: "Cleared land entered a different inheritance category",
    description: "A distinction between forest access and ancestral property.",
    statementKind: "observation",
    text: "The authors report that forest land opened for cultivation became harta pusaka—rendered harato pusako in their article—ancestral property transmitted through the female line, which did not give women the same authority as male officeholders to negotiate forest access.",
  },
  {
    id: "bonjol-bundo-kanduang-role",
    kind: "statement",
    label: "Bundo Kanduang was an advisory maternal role",
    description:
      "A distinction between a recognized maternal role and governing authority in Bonjol.",
    statementKind: "observation",
    text: "The Bonjol authors describe Bundo Kanduang as a respected senior maternal figure who could advise customary leaders; the title did not give every woman control of ulayat decisions.",
  },
  {
    id: "bonjol-ulayat-sales-rules-in-use",
    kind: "statement",
    label: "Leaders sold access contrary to stated custom",
    description: "The study’s observed divergence from customary rules.",
    statementKind: "observation",
    text: "Key informants reported that male customary officeholders facilitated transactions giving officials and other outsiders access to large areas of Melayu-clan ulayat, contrary to the customary rule described by the authors.",
  },
  {
    id: "bonjol-neshp-formal-promise",
    kind: "statement",
    label: "The oil-palm agreement promised household plots",
    description: "The stated distribution rule for smallholdings.",
    statementKind: "observation",
    text: "An agreement negotiated by male clan representatives called for 1,000 hectares of oil-palm smallholdings to be divided into two-hectare plots for 500 Bonjol households as compensation for transferred land.",
  },
  {
    id: "bonjol-neshp-distribution-practice",
    kind: "statement",
    label: "Observed plot distribution departed from the promise",
    description: "The reported distribution outcome.",
    statementKind: "observation",
    text: "The study reports that male signatories controlled the recipient list for the promised smallholdings.",
  },
  {
    id: "bonjol-neshp-exclusion-outcome",
    kind: "statement",
    label: "The reported distribution favored associates and excluded members",
    description: "The reported distributional result.",
    statementKind: "observation",
    text: "The authors report that the recipient list favored signatories’ relatives and associates and excluded many Melayu-clan members.",
  },
  {
    id: "bonjol-women-testimony-limit",
    kind: "statement",
    label: "Women’s testimony showed anger and constrained voice",
    description:
      "An observation about both testimony and the conditions of speaking.",
    statementKind: "observation",
    text: "Researchers report that many women declined to discuss the contested land practices.",
  },
  {
    id: "bonjol-five-women-testimony",
    kind: "statement",
    label: "Five women described losses and weak influence",
    description:
      "Attributed testimony from a small group, not a population estimate.",
    statementKind: "observation",
    text: "A group of five Melayu women described anger, lost income, and an inability to influence male kin who represented the clan publicly.",
  },
  {
    id: "bonjol-authors-causal-interpretation",
    kind: "statement",
    label: "The authors proposed several causes of unequal control",
    description: "An attributed interpretation rather than an observed fact.",
    statementKind: "causal-hypothesis",
    text: "Mutolib and colleagues attribute women’s weak influence partly to education, early marriage, gender norms, lack of a forum, and dependence on male customary representatives, but their small cross-sectional study cannot isolate those causes.",
  },
  {
    id: "bonjol-no-minangkabau-generalization",
    kind: "statement",
    label: "The Bonjol findings are not society-wide",
    description: "The case study’s explicit transfer limit.",
    statementKind: "observation",
    text: "The authors explicitly caution that findings about Melayu-clan forest management in Bonjol should not be generalized to ulayat practice or women’s position across Minangkabau communities.",
  },
  {
    id: "nagari-law-changed-after-cases",
    kind: "statement",
    label: "The provincial nagari framework changed after both studies",
    description:
      "A temporal boundary against presenting the case rules as current law.",
    statementKind: "observation",
    text: "West Sumatra Regulation 7 of 2018 later established a provincial framework for nagari as customary-law community government, so the formal rules documented in the 2016 case studies should not be presented as the current provincial design.",
  },
].map((entity) => ({
  documentType: "entity" as const,
  entity: { ...entity, ...reviewed } as DomainEntity,
}));

const cases = [
  {
    id: "koto-tinggi-post-decentralization-governance",
    kind: "case",
    label: "Koto Tinggi nagari governance observed in October 2016",
    description:
      "A bounded October 2016 study of formal institutions and development-planning practice in Koto Tinggi.",
    locationIds: ["nagari-koto-tinggi-agam", "west-sumatra"],
    startDate: {
      year: 2016,
      month: 10,
      certainty: "exact",
    },
    endDate: { year: 2016, month: 10, certainty: "exact" },
    scope:
      "Nagari government, representative and customary councils, and development planning observed in Koto Tinggi during October 2016; decentralization from 2001 is background, and the cited formal design dates to Agam Regulation 12 of 2007.",
    conditionStatementIds: ["koto-tinggi-fieldwork-scope"],
    selectionRationale:
      "Selected to separate maternal-line social organization from the public offices, representative bodies, customary council, and rules-in-use of one named nagari.",
    episodeIds: ["koto-tinggi-governance-october-2016"],
  },
  {
    id: "koto-tinggi-governance-october-2016",
    kind: "case-episode",
    caseId: "koto-tinggi-post-decentralization-governance",
    label: "Koto Tinggi governance observed in October 2016",
    description:
      "The post-decentralization institutional arrangement observed in October 2016.",
    locationIds: ["nagari-koto-tinggi-agam", "west-sumatra"],
    startDate: {
      year: 2016,
      month: 10,
      certainty: "exact",
    },
    endDate: { year: 2016, month: 10, certainty: "exact" },
    scope:
      "The institutions and development-planning interactions described for Koto Tinggi, not all Agam or Minangkabau nagari.",
    conditionStatementIds: ["koto-tinggi-fieldwork-scope"],
    formalRuleStatementIds: [
      "koto-tinggi-three-institutions",
      "koto-tinggi-formal-participation-rules",
      "koto-tinggi-formal-decision-rule",
    ],
    ruleInUseStatementIds: [],
    interactionStatementIds: [
      "koto-tinggi-budget-rules-in-use",
      "koto-tinggi-budget-consensus",
    ],
    outcomeStatementIds: [
      "koto-tinggi-administrative-capacity-limit",
      "koto-tinggi-regulatory-preparation-limit",
    ],
  },
  {
    id: "bonjol-melayu-ulayat-governance",
    kind: "case",
    label: "Melayu-clan ulayat governance in Nagari Bonjol",
    description:
      "A bounded study of communal-forest access, management, and oil-palm plot distribution in Nagari Bonjol.",
    locationIds: ["nagari-bonjol-dharmasraya", "west-sumatra"],
    startDate: {
      year: 2000,
      certainty: "approximate",
      note: "The authors date the new nagari and management transition to the period beginning around 2000, with the concession ending in 2002.",
    },
    endDate: { year: 2016, month: 4, certainty: "exact" },
    scope:
      "Melayu-clan ulayat forest governance in Nagari Bonjol from the administrative and concession transition around 2000–2002 through fieldwork ending in April 2016.",
    conditionStatementIds: [
      "bonjol-study-method-and-voice",
      "bonjol-new-nagari-forest-transition",
      "bonjol-no-minangkabau-generalization",
    ],
    selectionRationale:
      "Selected because the study distinguishes collective and inherited claims from practical management, negotiation, voice, and receipt of benefits in one named clan and nagari.",
    episodeIds: ["bonjol-ulayat-governance-2000-2016"],
  },
  {
    id: "bonjol-ulayat-governance-2000-2016",
    kind: "case-episode",
    caseId: "bonjol-melayu-ulayat-governance",
    label: "Bonjol ulayat governance, 2000–2016",
    description:
      "The Melayu-clan forest-management period examined by the 2016 field study.",
    locationIds: ["nagari-bonjol-dharmasraya", "west-sumatra"],
    startDate: {
      year: 2000,
      certainty: "approximate",
      note: "The authors date the new nagari and management transition to the period beginning around 2000, with the concession ending in 2002.",
    },
    endDate: { year: 2016, month: 4, certainty: "exact" },
    scope:
      "Observed Melayu-clan rules and practices concerning the claimed ulayat forest and smallholder plots; excludes other Bonjol clans and other Minangkabau communities.",
    conditionStatementIds: [
      "bonjol-study-method-and-voice",
      "bonjol-new-nagari-forest-transition",
      "bonjol-concession-end-transition",
      "bonjol-ulayat-formal-distinction",
      "bonjol-ulayat-delegated-management",
      "bonjol-harta-pusaka-transition",
      "bonjol-no-minangkabau-generalization",
    ],
    formalRuleStatementIds: ["bonjol-neshp-formal-promise"],
    ruleInUseStatementIds: ["bonjol-ulayat-sales-rules-in-use"],
    interactionStatementIds: ["bonjol-neshp-distribution-practice"],
    outcomeStatementIds: ["bonjol-neshp-exclusion-outcome"],
  },
].map((entity) => ({
  documentType: "entity" as const,
  entity: { ...entity, ...reviewed } as DomainEntity,
}));

export const minangkabauEvidenceDocuments = [
  ...entities,
  ...cases,
] satisfies AuthoringDocument[];
