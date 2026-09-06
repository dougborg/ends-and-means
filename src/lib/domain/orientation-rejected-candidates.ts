import {
  reviewedOrientationOnlyGuideSubjects,
  reviewedOrientationOnlyMappings,
} from "./orientation-only-mappings";

const allReviewedRejectedOrientationCandidates = {
  "entity:executive-dynastic-monarchy": {
    title: "Absolute monarchy",
    url: "https://en.wikipedia.org/wiki/Absolute_monarchy",
    boundary:
      "Absolute monarchy was the real canonical candidate inspected, but it does not identify Executive dynastic monarchy: Herb's bounded analytical configuration of ruling-family participation, which does not itself assert legally unlimited power.",
  },
  "entity:affected-community-accountability": {
    title: "Accountability",
    url: "https://en.wikipedia.org/wiki/Accountability",
    boundary:
      "Accountability is broader than Affected-community accountability, which is specifically an evaluative lens for delegated civilian authority.",
  },
  "entity:anarchist-traditions": {
    title: "Anarchism",
    url: "https://en.wikipedia.org/wiki/Anarchism",
    boundary:
      "Anarchism was the nearest canonical candidate opened, but it is not the same identity as Anarchist traditions: A non-inheriting collection of historically related but internally disputed anarchist traditions.",
  },
  "entity:authority-and-accountability": {
    title: "Accountability",
    url: "https://en.wikipedia.org/wiki/Accountability",
    boundary:
      "Accountability is one component of Authority and accountability, which is a project Question about delegated investment authority and coordination.",
  },
  "entity:bonjol-melayu-ulayat-governance": {
    title: "Minangkabau people",
    url: "https://en.wikipedia.org/wiki/Minangkabau_people",
    boundary:
      "Minangkabau people was the nearest canonical candidate opened, but it is not the same identity as Melayu-clan ulayat governance in Nagari Bonjol: Melayu-clan ulayat forest governance in Nagari Bonjol from the administrative and concession transition around 2000–2002 through fieldwork ending in April 2016.",
  },
  "entity:bonjol-ulayat-governance-2000-2016": {
    title: "Minangkabau people",
    url: "https://en.wikipedia.org/wiki/Minangkabau_people",
    boundary:
      "Minangkabau people was the nearest canonical candidate opened, but it is not the same identity as Bonjol ulayat governance, 2000–2016: Observed Melayu-clan rules and practices concerning the claimed ulayat forest and smallholder plots; excludes other Bonjol clans and other Minangkabau communities.",
  },
  "entity:centralized-solidaristic-bargaining-1956-1983": {
    title: "Rehn–Meidner model",
    url: "https://en.wikipedia.org/wiki/Rehn%E2%80%93Meidner_model",
    boundary:
      "Rehn–Meidner model was the nearest canonical candidate opened, but it is not the same identity as Centralized solidaristic bargaining, 1956–1983: The coordinated wage-bargaining institution and its distributional record; other components of Swedish economic policy enter only where the cited evidence supports their relationship.",
  },
  "entity:chiapas-zapatista-regions": {
    title: "Zapatista Army of National Liberation",
    url: "https://en.wikipedia.org/wiki/Zapatista_Army_of_National_Liberation",
    boundary:
      "Zapatista Army of National Liberation was the nearest canonical candidate opened, but it is not the same identity as Zapatista regions of Chiapas: The discontinuous communities and regional institutions in Chiapas identified in Zapatista sources; not a continuous sovereign territory.",
  },
  "entity:china-dual-track-market-reforms": {
    title: "Reform and opening up",
    url: "https://en.wikipedia.org/wiki/Reform_and_opening_up",
    boundary:
      "Reform and opening up was the nearest canonical candidate opened, but it is not the same identity as China’s economic reforms, 1978–1993: Economic reforms in the People’s Republic of China from 1978 through 1993; not a classification of China before or after those dates.",
  },
  "entity:china-plan-market-coexistence-1978-1993": {
    title: "Reform and opening up",
    url: "https://en.wikipedia.org/wiki/Reform_and_opening_up",
    boundary:
      "Reform and opening up was the nearest canonical candidate opened, but it is not the same identity as Enterprise reform and non-state growth, 1978–1993: The reform sequence analyzed by Naughton, ending before later ownership and corporate reforms.",
  },
  "entity:cmp-claimant-agencies": {
    title: "Economic planning",
    url: "https://en.wikipedia.org/wiki/Economic_planning",
    boundary:
      "Economic planning was the nearest canonical candidate opened, but it is not the same identity as Controlled Materials Plan claimant agencies: The officially designated CMP claimant agencies, treated collectively only for their shared allotment role.",
  },
  "entity:cmp-controlled-material-producers": {
    title: "Economic planning",
    url: "https://en.wikipedia.org/wiki/Economic_planning",
    boundary:
      "Economic planning was the nearest canonical candidate opened, but it is not the same identity as Controlled-material producers: Producers and distributors of CMP-controlled steel, copper, and aluminum during the bounded episode; not all United States industry.",
  },
  "entity:cmp-operation-1943-1945": {
    title: "Economic planning",
    url: "https://en.wikipedia.org/wiki/Economic_planning",
    boundary:
      "Economic planning was the nearest canonical candidate opened, but it is not the same identity as Controlled Materials Plan operation, April 1943–September 1945: Quarterly controlled-material allocation and production authorization, not price controls, labor allocation, military procurement as a whole, or a permanent peacetime system.",
  },
  "entity:cmp-prime-contractors": {
    title: "Economic planning",
    url: "https://en.wikipedia.org/wiki/Economic_planning",
    boundary:
      "Economic planning was the nearest canonical candidate opened, but it is not the same identity as Controlled Materials Plan prime contractors: Prime contractors only in their documented role within CMP allotment chains; not one corporate body or every wartime contractor.",
  },
  "entity:collective-capital-formation": {
    title: "Capital formation",
    url: "https://en.wikipedia.org/wiki/Capital_formation",
    boundary:
      "Capital formation was the nearest canonical candidate opened, but it is not the same identity as Collective capital formation: Arrangements that direct recurring contributions or asset transfers into capital held through collectively governed institutions.",
  },
  "entity:collective-wage-earner-shareholding-authority": {
    title: "Accountability",
    url: "https://en.wikipedia.org/wiki/Accountability",
    boundary:
      "Accountability is a broader governance concept, while Collective wage-earner shareholding authority is a specific comparison dimension for corporate voting authority.",
  },
  "entity:colonial-gold-coast-cocoa-region": {
    title: "Cocoa production in Ghana",
    url: "https://en.wikipedia.org/wiki/Cocoa_production_in_Ghana",
    boundary:
      "Cocoa production in Ghana was the nearest canonical candidate opened, but it is not the same identity as Gold Coast cocoa-growing regions: Cocoa-growing regions of Asante and the colonial Gold Coast, within present-day Ghana.",
  },
  "entity:combahee-organizing-episode": {
    title: "Combahee River Collective",
    url: "https://en.wikipedia.org/wiki/Combahee_River_Collective",
    boundary:
      "Combahee River Collective was the nearest canonical candidate opened, but it is not the same identity as Combahee organizing, 1974–1980: Selected organizing documented in the collective statement and members' oral histories.",
  },
  "entity:combahee-river-collective-1974-1980": {
    title: "Combahee River Collective",
    url: "https://en.wikipedia.org/wiki/Combahee_River_Collective",
    boundary:
      "Combahee River Collective was the nearest canonical candidate opened, but it is not the same identity as Combahee River Collective, Boston, 1974–1980: The collective's Boston-area organization and selected campaigns from 1974 to 1980; not all Black feminism, identity politics, or intersectionality.",
  },
  "entity:commodity-production": {
    title: "Simple commodity production",
    url: "https://en.wikipedia.org/wiki/Simple_commodity_production",
    boundary:
      "Simple commodity production is a narrower form centered on independent producers owning their means of production; Commodity production here covers production for exchange without asserting that ownership or labor form.",
  },
  "entity:controlled-materials-allocation": {
    title: "Economic planning",
    url: "https://en.wikipedia.org/wiki/Economic_planning",
    boundary:
      "Economic planning was the nearest canonical candidate opened, but it is not the same identity as Controlled materials allocation: A mechanism that reconciles program requirements with scarce-material supply and passes authorized allotments through agencies and production chains.",
  },
  "entity:democratic-selection-means": {
    title: "Democracy",
    url: "https://en.wikipedia.org/wiki/Democracy",
    boundary:
      "Democracy was the nearest canonical candidate opened, but it is not the same identity as Democratic selection means: An editorial grouping of distinct procedures used to select public decision-makers.",
  },
  "entity:democratic-traditions": {
    title: "Democracy",
    url: "https://en.wikipedia.org/wiki/Democracy",
    boundary:
      "Democracy was the nearest canonical candidate opened, but it is not the same identity as Democratic traditions: An editorial grouping of approaches that explicitly interpret democracy.",
  },
  "entity:distribution": {
    title: "Distribution of wealth",
    url: "https://en.wikipedia.org/wiki/Distribution_of_wealth",
    boundary:
      "Distribution of wealth was the nearest canonical candidate opened, but it is not the same identity as Distribution: An evaluative lens for the allocation of income, wealth, control, benefits, and costs.",
  },
  "entity:distribution-of-gains-and-ownership": {
    title: "Distribution of wealth",
    url: "https://en.wikipedia.org/wiki/Distribution_of_wealth",
    boundary:
      "Distribution of wealth was the nearest canonical candidate opened, but it is not the same identity as Distribution of gains and ownership: How productivity gains, income, wealth, ownership, and control are distributed.",
  },
  "entity:electoral-representation": {
    title: "Democracy",
    url: "https://en.wikipedia.org/wiki/Democracy",
    boundary:
      "Democracy was the nearest canonical candidate opened, but it is not the same identity as Electoral representation: A procedure in which voters choose people to exercise specified public authority.",
  },
  "entity:enacted-wage-earner-funds-1984-1991": {
    title: "Rehn–Meidner model",
    url: "https://en.wikipedia.org/wiki/Rehn%E2%80%93Meidner_model",
    boundary:
      "Rehn–Meidner model was the nearest canonical candidate opened, but it is not the same identity as Enacted fund-board period, 1984–1991: Revenue collection and investment by the five statutory boards through the abolition decision.",
  },
  "entity:english-agrarian-market-dependence": {
    title: "British Agricultural Revolution",
    url: "https://en.wikipedia.org/wiki/British_Agricultural_Revolution",
    boundary:
      "British Agricultural Revolution was the nearest canonical candidate opened, but it is not the same identity as Agrarian change in England, c. 1450–1750: Agrarian England from approximately 1450 to 1750; not Britain’s whole economy, a single-origin account, or a universal transition sequence.",
  },
  "entity:english-agrarian-transformation-1450-1750": {
    title: "British Agricultural Revolution",
    url: "https://en.wikipedia.org/wiki/British_Agricultural_Revolution",
    boundary:
      "British Agricultural Revolution was the nearest canonical candidate opened, but it is not the same identity as English agrarian change, c. 1450–1750: Agrarian institutions in England, with regional and chronological variation retained.",
  },
  "entity:equal-political-standing": {
    title: "Social equality",
    url: "https://en.wikipedia.org/wiki/Social_equality",
    boundary:
      "Social equality is broader than Equal political standing, an attributed democratic aim rather than an automatically observed outcome.",
  },
  "entity:equality-with-employment": {
    title: "Social equality",
    url: "https://en.wikipedia.org/wiki/Social_equality",
    boundary:
      "Social equality is broader than Equality with employment, the joint policy aim attributed here to the Rehn–Meidner program.",
  },
  "entity:freedom-as-nondomination": {
    title: "Republicanism",
    url: "https://en.wikipedia.org/wiki/Republicanism",
    boundary:
      "Republicanism was the nearest canonical candidate opened, but it is not the same identity as Freedom as non-domination: A prominent neo-republican account of freedom, not the sole historical meaning of republic or liberty.",
  },
  "entity:freedom-from-domination": {
    title: "Republicanism",
    url: "https://en.wikipedia.org/wiki/Republicanism",
    boundary:
      "Republicanism was the nearest canonical candidate opened, but it is not the same identity as Freedom from domination: An attributed anarchist aim whose institutional meaning varies across traditions.",
  },
  "entity:gold-coast-cocoa-expansion": {
    title: "Cocoa production in Ghana",
    url: "https://en.wikipedia.org/wiki/Cocoa_production_in_Ghana",
    boundary:
      "Cocoa production in Ghana was the nearest canonical candidate opened, but it is not the same identity as Gold Coast cocoa expansion, c. 1890–1936: Cocoa-growing regions of Asante and the Gold Coast from about 1890 to 1936; not all households, crops, or colonial Africa.",
  },
  "entity:gold-coast-cocoa-takeoff-1890-1936": {
    title: "Cocoa production in Ghana",
    url: "https://en.wikipedia.org/wiki/Cocoa_production_in_Ghana",
    boundary:
      "Cocoa production in Ghana was the nearest canonical candidate opened, but it is not the same identity as Gold Coast cocoa take-off, c. 1890–1936: The supply-side transformation studied by Austin, not a complete welfare or political history.",
  },
  "entity:iceland-parental-leave-2000-2018": {
    title: "Parental leave",
    url: "https://en.wikipedia.org/wiki/Parental_leave",
    boundary:
      "Parental leave was the nearest canonical candidate opened, but it is not the same identity as Iceland paid parental leave evidence, 2000–2018: The law enacted in 2000 and observations collected through 2018, including a 2014 birth cohort; not current Icelandic law or proof that one policy caused every observed gender change.",
  },
  "entity:iceland-parental-leave-outcomes-episode": {
    title: "Parental leave",
    url: "https://en.wikipedia.org/wiki/Parental_leave",
    boundary:
      "Parental leave was the nearest canonical candidate opened, but it is not the same identity as Iceland leave design and early outcomes: Formal rules, uptake, and observations collected through 2018, with causal limits kept explicit.",
  },
  "entity:india-constitutional-rights-episode": {
    title: "Constitution of India",
    url: "https://en.wikipedia.org/wiki/Constitution_of_India",
    boundary:
      "Constitution of India was the nearest canonical candidate opened, but it is not the same identity as Indian constitutional-rights drafting and commencement: Articles 14 and 15 in their constitutional settlement context; not their full later judicial or practical history.",
  },
  "entity:india-constitutional-rights-settlement-1946-1950": {
    title: "Constitution of India",
    url: "https://en.wikipedia.org/wiki/Constitution_of_India",
    boundary:
      "Constitution of India was the nearest canonical candidate opened, but it is not the same identity as India's constitutional-rights settlement, 1946–1950: Constitutional drafting, adoption, and commencement from 1946 through 1950; not a claim that formal rights eliminated social or colonial inequalities.",
  },
  "entity:indigenous-autonomy": {
    title: "Indigenous self-determination",
    url: "https://en.wikipedia.org/wiki/Self-determination",
    boundary:
      "Indigenous self-determination was the nearest canonical candidate opened, but it is not the same identity as Indigenous autonomy: Collective self-government by Indigenous peoples under their own institutions and historical conditions.",
  },
  "entity:institutional-abolition": {
    title: "Abolitionism",
    url: "https://en.wikipedia.org/wiki/Abolitionism",
    boundary:
      "Abolitionism was the nearest canonical candidate opened, but it is not the same identity as Institutional abolition: The legal termination of an institution or governing body.",
  },
  "entity:institutional-formation": {
    title: "Institutional theory",
    url: "https://en.wikipedia.org/wiki/Institutional_theory",
    boundary:
      "Institutional theory was the nearest canonical candidate opened, but it is not the same identity as Institutional formation: The sourced establishment of a named institution.",
  },
  "entity:institutional-reorganization": {
    title: "Restructuring",
    url: "https://en.wikipedia.org/wiki/Restructuring",
    boundary:
      "Restructuring was the nearest canonical candidate opened, but it is not the same identity as Institutional reorganization: A sourced change in the structure of named institutions.",
  },
  "entity:italian-fascist-consolidated-rule": {
    title: "Fascism",
    url: "https://en.wikipedia.org/wiki/Fascism",
    boundary:
      "Fascism was the nearest canonical candidate opened, but it is not the same identity as Consolidated Fascist rule, 1925–1943: The national regime and its party relationship; not every local practice or social outcome.",
  },
  "entity:italian-fascist-dictatorship-1925-1943": {
    title: "Fascism",
    url: "https://en.wikipedia.org/wiki/Fascism",
    boundary:
      "Fascism was the nearest canonical candidate opened, but it is not the same identity as Italian Fascist dictatorship, 1925–1943: From the 1925 destruction of parliamentary responsibility to Mussolini's dismissal in July 1943; the earlier movement, 1922 coalition government, German occupation, and Italian Social Republic are context rather than the same episode.",
  },
  "entity:japan-constitutional-rights-episode": {
    title: "Constitution of Japan",
    url: "https://en.wikipedia.org/wiki/Constitution_of_Japan",
    boundary:
      "Constitution of Japan was the nearest canonical candidate opened, but it is not the same identity as Japanese constitutional-rights adoption and commencement: Articles 14 and 24 and their drafting context; not their full implementation history.",
  },
  "entity:japan-constitutional-rights-settlement-1946-1947": {
    title: "Constitution of Japan",
    url: "https://en.wikipedia.org/wiki/Constitution_of_Japan",
    boundary:
      "Constitution of Japan was the nearest canonical candidate opened, but it is not the same identity as Japan's constitutional-rights settlement, 1946–1947: The constitutional drafting, promulgation, and commencement interval; not a complete account of Japanese liberal traditions or equality in practice.",
  },
  "entity:jinst-postcollective-pastoral-governance": {
    title: "Mongolia",
    url: "https://en.wikipedia.org/wiki/Mongolia",
    boundary:
      "Mongolia was the nearest canonical candidate opened, but it is not the same identity as Jinst post-collective pastoral governance: Jinst-specific observations from 1995 and the 1999 follow-up boundary, with article-general and pooled Jinst–Bayan-Ovoo findings labeled separately; excludes later formal herder associations.",
  },
  "entity:jinst-transition-1990-1999": {
    title: "Mongolia",
    url: "https://en.wikipedia.org/wiki/Mongolia",
    boundary:
      "Mongolia was the nearest canonical candidate opened, but it is not the same identity as Jinst transition after collective dissolution, 1990–1999: Only Jinst-specific observations are assigned to practice or outcome fields; pooled and article-general findings remain conditions, with no projection into later formal herder associations.",
  },
  "entity:kahnawake-cdmrp-2005-present": {
    title: "Kahnawake",
    url: "https://en.wikipedia.org/wiki/Kahnawake",
    boundary:
      "Kahnawake was the nearest canonical candidate opened, but it is not the same identity as Community decision-making process, 2005–present: The design, use, and reported participation limits of the Community Decision Making and Review Process; other Kahnawà:ke political, legal, spiritual, and social institutions enter only where they condition this process.",
  },
  "entity:kahnawake-community-lawmaking": {
    title: "Kahnawake",
    url: "https://en.wikipedia.org/wiki/Kahnawake",
    boundary:
      "Kahnawake was the nearest canonical candidate opened, but it is not the same identity as Kahnawà:ke community law-making: The Community Decision Making and Review Process approved in 2005 and its use in Kahnawà:ke law-making through the review date; excludes a general history of Kanien’kehá:ka or Haudenosaunee government and does not classify Indigenous societies as one political type.",
  },
  "entity:koto-tinggi-governance-2016": {
    title: "Minangkabau people",
    url: "https://en.wikipedia.org/wiki/Minangkabau_people",
    boundary:
      "Minangkabau people was the nearest canonical candidate opened, but it is not the same identity as Koto Tinggi governance documented in 2016: The institutions and development-planning interactions described for Koto Tinggi in 2016, not all Agam or Minangkabau nagari; October dates the fieldwork, not every reported interaction.",
  },
  "entity:koto-tinggi-post-decentralization-governance": {
    title: "Minangkabau people",
    url: "https://en.wikipedia.org/wiki/Minangkabau_people",
    boundary:
      "Minangkabau people was the nearest canonical candidate opened, but it is not the same identity as Koto Tinggi nagari governance documented in 2016: Nagari government, representative and customary councils, and development planning documented for Koto Tinggi in 2016; the study’s fieldwork occurred in October, while the cited budget meeting is dated only to 2016. Decentralization from 2001 is background, and the cited formal design dates to Agam Regulation 12 of 2007.",
  },
  "entity:linz-regime-analysis": {
    title: "Juan José Linz",
    url: "https://en.wikipedia.org/wiki/Juan_Linz",
    boundary:
      "Juan José Linz is the author, not the same identity as Linz's regime analysis: Linz's ideal-typical analysis, not an uncontested classification of all nondemocratic regimes.",
  },
  "entity:liquidation-board-period-1992": {
    title: "Rehn–Meidner model",
    url: "https://en.wikipedia.org/wiki/Rehn%E2%80%93Meidner_model",
    boundary:
      "Rehn–Meidner model was the nearest canonical candidate opened, but it is not the same identity as Liquidation-board period, 1992: The immediate institutional configuration after the five boards ended; excludes the later distribution and institutional histories of all successor assets.",
  },
  "entity:member-owned-cooperative-finance": {
    title: "Market economy",
    url: "https://en.wikipedia.org/wiki/Market_economy",
    boundary:
      "Market economy was the nearest canonical candidate opened, but it is not the same identity as Member-owned cooperative finance: Members capitalize and govern a cooperative financial institution designed around their work and credit needs.",
  },
  "entity:nagari-bonjol-dharmasraya": {
    title: "Minangkabau people",
    url: "https://en.wikipedia.org/wiki/Minangkabau_people",
    boundary:
      "Minangkabau people was the nearest canonical candidate opened, but it is not the same identity as Nagari Bonjol, Dharmasraya: The nagari in Koto Besar subdistrict, Dharmasraya Regency, examined during 2016 communal-forest fieldwork.",
  },
  "entity:nagari-koto-tinggi-agam": {
    title: "Minangkabau people",
    url: "https://en.wikipedia.org/wiki/Minangkabau_people",
    boundary:
      "Minangkabau people was the nearest canonical candidate opened, but it is not the same identity as Nagari Koto Tinggi, Agam: The nagari in Baso subdistrict, Agam Regency, examined during October 2016 fieldwork.",
  },
  "entity:nazi-consolidation-1933": {
    title: "Adolf Hitler's rise to power",
    url: "https://en.wikipedia.org/wiki/Adolf_Hitler%27s_rise_to_power",
    boundary:
      "Adolf Hitler's rise to power was the nearest canonical candidate opened, but it is not the same identity as Nazi consolidation in Germany, 1933: The January–December 1933 consolidation sequence; later war, genocide, occupation, and the regime's full institutional history require their own evidence boundaries.",
  },
  "entity:nazi-party-state-consolidation-1933": {
    title: "Adolf Hitler's rise to power",
    url: "https://en.wikipedia.org/wiki/Adolf_Hitler%27s_rise_to_power",
    boundary:
      "Adolf Hitler's rise to power was the nearest canonical candidate opened, but it is not the same identity as Nazi party-state consolidation, 1933: National party and state institutions during 1933; does not claim complete control over German society.",
  },
  "entity:neo-republican-nondomination": {
    title: "Republicanism",
    url: "https://en.wikipedia.org/wiki/Republicanism",
    boundary:
      "Republicanism was the nearest canonical candidate opened, but it is not the same identity as Neo-republican non-domination: The contemporary non-domination approach synthesized by Lovett; not every historical republican argument or republic.",
  },
  "entity:planning-correctability": {
    title: "Economic planning",
    url: "https://en.wikipedia.org/wiki/Economic_planning",
    boundary:
      "Economic planning was the nearest canonical candidate opened, but it is not the same identity as Planning correctability: An evaluative lens for detecting and revising material planning errors without hiding their costs.",
  },
  "entity:planning-information-and-coordination": {
    title: "Economic planning",
    url: "https://en.wikipedia.org/wiki/Economic_planning",
    boundary:
      "Economic planning was the nearest canonical candidate opened, but it is not the same identity as Planning information and coordination: How a planning process obtains, reconciles, and updates dispersed requirements and supply information.",
  },
  "entity:regional-wage-earner-fund-boards": {
    title: "Rehn–Meidner model",
    url: "https://en.wikipedia.org/wiki/Rehn%E2%80%93Meidner_model",
    boundary:
      "Rehn–Meidner model was the nearest canonical candidate opened, but it is not the same identity as Regional wage-earner fund boards: Collectively financed investment funds governed by appointed regional boards and constrained by statutory ownership and voting limits.",
  },
  "entity:representative-democratic-government": {
    title: "Democracy",
    url: "https://en.wikipedia.org/wiki/Democracy",
    boundary:
      "Democracy was the nearest canonical candidate opened, but it is not the same identity as Representative democratic government: Representative electoral arrangements; not a synonym for democracy, accountability, or every elected government.",
  },
  "entity:restrictive-macroeconomic-demand-management": {
    title: "Demand management",
    url: "https://en.wikipedia.org/wiki/Demand_management",
    boundary:
      "Demand management was the nearest canonical candidate opened, but it is not the same identity as Restrictive macroeconomic demand management: Fiscal and monetary restraint intended to limit inflationary excess demand while selective measures sustain employment and adjustment.",
  },
  "entity:right-to-buy-england-wales-1980-1998": {
    title: "Right to Buy",
    url: "https://en.wikipedia.org/wiki/Right_to_Buy",
    boundary:
      "Right to Buy was the nearest canonical candidate opened, but it is not the same identity as Right to Buy in England and Wales, 1980–1998: The statutory scheme in England and Wales from commencement through the latest sales and stock figures reviewed in the 1999 Commons Library paper; Scotland had separate legislation, and later policy is excluded.",
  },
  "entity:right-to-buy-initial-operation": {
    title: "Right to Buy",
    url: "https://en.wikipedia.org/wiki/Right_to_Buy",
    boundary:
      "Right to Buy was the nearest canonical candidate opened, but it is not the same identity as Right to Buy evidence review: The formal-rule fields record the enacted 1980 scheme, not unchanged rules through 1998; later amendments remain contextual evidence rather than a Case-slot claim, and no causal estimate separates Right to Buy from falling social-housing investment.",
  },
  "entity:rotating-municipal-delegation": {
    title: "Delegate model of representation",
    url: "https://en.wikipedia.org/wiki/Delegate_model_of_representation",
    boundary:
      "Delegate model of representation was the nearest canonical candidate opened, but it is not the same identity as Rotating municipal delegation: Autonomous municipalities sent rotating delegates to regional civilian councils.",
  },
  "entity:ruwalla-borderland-1918-1936": {
    title: "Ruwallah",
    url: "https://en.wikipedia.org/wiki/Ruwallah",
    boundary:
      "Ruwallah was the nearest canonical candidate opened, but it is not the same identity as Ruwalla borderland bargaining, 1918–1936: The post-Ottoman remaking of Ruwalla mobility, dīra access, shaykhly representation, and state relations; later ethnography is not evidence for unchanged continuity.",
  },
  "entity:ruwalla-borderland-organization": {
    title: "Ruwallah",
    url: "https://en.wikipedia.org/wiki/Ruwallah",
    boundary:
      "Ruwallah was the nearest canonical candidate opened, but it is not the same identity as Ruwalla organization across post-Ottoman borders: Ruwalla mobility, resource access, Al Shaʿlan representation, and relations with mandate and emerging national authorities from the Ottoman collapse through the mid-1930s; excludes a timeless account of Ruwalla life or a general model of Bedouin organization.",
  },
  "entity:self-employed-worker-unionism": {
    title: "Trade union",
    url: "https://en.wikipedia.org/wiki/Trade_union",
    boundary:
      "Trade union was the nearest canonical candidate opened, but it is not the same identity as Self-employed worker unionism: Workers outside a conventional employer-employee relation organize a membership union for collective recognition and bargaining.",
  },
  "entity:sewa-ahmedabad-1972-1977": {
    title: "Trade union",
    url: "https://en.wikipedia.org/wiki/Trade_union",
    boundary:
      "Trade union was the nearest canonical candidate opened, but it is not the same identity as SEWA institutions in Ahmedabad, 1972–1977: Selected Ahmedabad union and cooperative institutions formed from 1972 through 1977; not later SEWA affiliates or informal workers generally.",
  },
  "entity:sewa-ahmedabad-institutions-episode": {
    title: "Trade union",
    url: "https://en.wikipedia.org/wiki/Trade_union",
    boundary:
      "Trade union was the nearest canonical candidate opened, but it is not the same identity as SEWA union and cooperative formation: Documented Ahmedabad institutions, without generalizing later national membership or outcomes backward.",
  },
  "entity:solidaristic-wage-bargaining": {
    title: "Rehn–Meidner model",
    url: "https://en.wikipedia.org/wiki/Rehn%E2%80%93Meidner_model",
    boundary:
      "Rehn–Meidner model was the nearest canonical candidate opened, but it is not the same identity as Solidaristic wage bargaining: Coordinated collective bargaining that compresses wage differences by pursuing equal pay principles and prioritizing lower-paid groups.",
  },
  "entity:southwestern-syrian-desert-wadi-sirhan": {
    title: "Syrian desert",
    url: "https://en.wikipedia.org/wiki/Syrian_Desert",
    boundary:
      "Syrian Desert was the nearest canonical candidate opened, but it is not the same identity as Southwestern Syrian Desert and Wadi Sirhan: The steppe and desert corridor connecting southern Syria and Transjordan with Wadi Sirhan and al-Jawf in northern Arabia.",
  },
  "entity:spanish-anarchist-initiatives-1936-1939": {
    title: "Anarchism",
    url: "https://en.wikipedia.org/wiki/Anarchism",
    boundary:
      "Anarchism was the nearest canonical candidate opened, but it is not the same identity as Anarchist initiatives in Republican Spain, 1936–1939: Selected anarchist-led initiatives in Republican-held Spain from July 1936 through defeat in 1939; not Spain as an anarchist society or a complete history of the war.",
  },
  "entity:spanish-anarchist-initiatives-war-episode": {
    title: "Anarchism",
    url: "https://en.wikipedia.org/wiki/Anarchism",
    boundary:
      "Anarchism was the nearest canonical candidate opened, but it is not the same identity as Anarchist initiatives during the Spanish Civil War: Selected institutions from July 1936 through 1939, with political plurality and uneven geography kept explicit.",
  },
  "entity:swatantra-early-opposition-episode": {
    title: "Swatantra Party",
    url: "https://en.wikipedia.org/wiki/Swatantra_Party",
    boundary:
      "Swatantra Party was the nearest canonical candidate opened, but it is not the same identity as Swatantra's early opposition activity: Organizational aims and practices documented in the publisher-authorized introduction; later decline and the full record of parliamentary action remain outside this episode.",
  },
  "entity:swatantra-opposition-organization-1959-1967": {
    title: "Swatantra Party",
    url: "https://en.wikipedia.org/wiki/Swatantra_Party",
    boundary:
      "Swatantra Party was the nearest canonical candidate opened, but it is not the same identity as Swatantra's opposition organization, 1959–1967: Swatantra's formation and early opposition activity through the 1967 general election; not every member, later party history, or a universal Indian conservatism.",
  },
  "entity:swedish-solidaristic-bargaining": {
    title: "Rehn–Meidner model",
    url: "https://en.wikipedia.org/wiki/Rehn%E2%80%93Meidner_model",
    boundary:
      "Rehn–Meidner model was the nearest canonical candidate opened, but it is not the same identity as Swedish solidaristic wage bargaining: Centralized solidaristic bargaining between the 1956 introduction of peak bargaining and its 1983 breakdown; excludes treating every Swedish macroeconomic or labor-market policy in the period as part of one coherent package.",
  },
  "entity:tawantinsuyu-expansion-consolidation": {
    title: "Inca Empire",
    url: "https://en.wikipedia.org/wiki/Inca_Empire",
    boundary:
      "Inca Empire was the nearest canonical candidate opened, but it is not the same identity as Expansion and consolidation, c. 1438–1527: The expansionary imperial order before Huayna Capac’s death; dates are conventional and locally variable.",
  },
  "entity:tawantinsuyu-succession-invasion": {
    title: "Inca Empire",
    url: "https://en.wikipedia.org/wiki/Inca_Empire",
    boundary:
      "Inca Empire was the nearest canonical candidate opened, but it is not the same identity as Succession war and invasion, c. 1527–1533: The crisis following Huayna Capac’s death through the seizure of Cusco, not the end of Inka political action or Andean history.",
  },
  "entity:us-controlled-materials-plan": {
    title: "Economic planning",
    url: "https://en.wikipedia.org/wiki/Economic_planning",
    boundary:
      "Economic planning was the nearest canonical candidate opened, but it is not the same identity as United States Controlled Materials Plan: CMP allocation of steel, copper, and aluminum from partial operation in April 1943 until expiration at midnight on September 30, 1945; excludes treating the entire US economy or every wartime control as centrally planned.",
  },
  "entity:us-wartime-production-mobilization": {
    title: "Economic planning",
    url: "https://en.wikipedia.org/wiki/Economic_planning",
    boundary:
      "Economic planning was the nearest canonical candidate opened, but it is not the same identity as United States controlled-materials allocation: The Controlled Materials Plan from partial operation in April 1943 until expiration on September 30, 1945; not military procurement, labor or price controls, the whole economy, or every wartime production policy.",
  },
  "entity:wage-earner-fund-board-abolition": {
    title: "Rehn–Meidner model",
    url: "https://en.wikipedia.org/wiki/Rehn%E2%80%93Meidner_model",
    boundary:
      "Rehn–Meidner model was the nearest canonical candidate opened, but it is not the same identity as Wage-earner fund boards abolished: The statutory end of the five wage-earner fund boards at the 1991–1992 year boundary.",
  },
  "entity:wage-earner-funds-to-liquidation": {
    title: "Rehn–Meidner model",
    url: "https://en.wikipedia.org/wiki/Rehn%E2%80%93Meidner_model",
    boundary:
      "Rehn–Meidner model was the nearest canonical candidate opened, but it is not the same identity as From wage-earner fund boards to liquidation administration: A sourced institutional boundary; its political causes and longer-run significance remain contestable interpretations.",
  },
  "entity:wage-earner-influence": {
    title: "Rehn–Meidner model",
    url: "https://en.wikipedia.org/wiki/Rehn%E2%80%93Meidner_model",
    boundary:
      "Rehn–Meidner model was the nearest canonical candidate opened, but it is not the same identity as Wage-earner influence: An attributed End whose meaning varies between income distribution, ownership, voting power, and direct control.",
  },
  "entity:worker-union-federation": {
    title: "Trade union",
    url: "https://en.wikipedia.org/wiki/Trade_union",
    boundary:
      "Trade union was the nearest canonical candidate opened, but it is not the same identity as Worker-union federation: Worker unions coordinate production and collective action through federated organization.",
  },
  "entity:wpb-requirements-committee": {
    title: "War Production Board",
    url: "https://en.wikipedia.org/wiki/War_Production_Board",
    boundary:
      "War Production Board was the nearest canonical candidate opened, but it is not the same identity as War Production Board Requirements Committee: Controlled Materials Plan supply estimates and claimant-agency allotments during the plan's operation.",
  },
  "entity:zapatista-autonomy-chiapas-1994-present": {
    title: "Zapatista Army of National Liberation",
    url: "https://en.wikipedia.org/wiki/Zapatista_Army_of_National_Liberation",
    boundary:
      "Zapatista Army of National Liberation was the nearest canonical candidate opened, but it is not the same identity as Zapatista autonomy in Chiapas, 1994–present: Civilian autonomous institutions among Zapatista support-base communities in discontinuous parts of Chiapas from 1994 through the review date; excludes treating the EZLN, all Indigenous communities, or a continuous territory as one government.",
  },
  "entity:zapatista-autonomy-reorganization-2023": {
    title: "Zapatista Army of National Liberation",
    url: "https://en.wikipedia.org/wiki/Zapatista_Army_of_National_Liberation",
    boundary:
      "Zapatista Army of National Liberation was the nearest canonical candidate opened, but it is not the same identity as Zapatista autonomy structure reorganized: The November 2023 declaration of a successor structure, recorded without assigning causal or turning-point significance.",
  },
  "entity:zapatista-caracol-jbg-episode-2003-2023": {
    title: "Zapatista Army of National Liberation",
    url: "https://en.wikipedia.org/wiki/Zapatista_Army_of_National_Liberation",
    boundary:
      "Zapatista Army of National Liberation was the nearest canonical candidate opened, but it is not the same identity as Caracol and Good Government Council episode, 2003–2023: The five original caracol/JBG zones and later expansions insofar as the cited evidence addresses council design and practice; excludes post-2023 successor practice and claims of uniform participation or territorial control.",
  },
  "entity:zapatista-caracoles": {
    title: "Zapatista Army of National Liberation",
    url: "https://en.wikipedia.org/wiki/Zapatista_Army_of_National_Liberation",
    boundary:
      "Zapatista Army of National Liberation was the nearest canonical candidate opened, but it is not the same identity as Zapatista caracoles: The caracol centers created in 2003; physical and coordinating sites rather than a synonym for the councils, communities, or EZLN.",
  },
  "entity:zapatista-caracoles-jbg-formation-announced-2003": {
    title: "Zapatista Army of National Liberation",
    url: "https://en.wikipedia.org/wiki/Zapatista_Army_of_National_Liberation",
    boundary:
      "Zapatista Army of National Liberation was the nearest canonical candidate opened, but it is not the same identity as Caracol and Good Government Council formation announced: The July 2003 announcement scheduling council constitution for August 9, recorded without presuming a uniform operational start or causal importance.",
  },
  "entity:zapatista-gal-successor-episode-2023-present": {
    title: "Zapatista Army of National Liberation",
    url: "https://en.wikipedia.org/wiki/Zapatista_Army_of_National_Liberation",
    boundary:
      "Zapatista Army of National Liberation was the nearest canonical candidate opened, but it is not the same identity as Declared GAL successor structure, 2023–present: The GAL, CGAZ, and ACGAZ structure declared in November 2023 through the review date; evidence here establishes declared design, not comprehensive implementation or outcomes.",
  },
  "entity:zapatista-good-government-councils": {
    title: "Zapatista Army of National Liberation",
    url: "https://en.wikipedia.org/wiki/Zapatista_Army_of_National_Liberation",
    boundary:
      "Zapatista Army of National Liberation was the nearest canonical candidate opened, but it is not the same identity as Zapatista Good Government Councils: The Juntas de Buen Gobierno in the caracol structure during the bounded episode; not the EZLN command or the post-2023 GAL/CGAZ/ACGAZ structure.",
  },
  "entity:zapatista-jbg-to-gal-transition-2023": {
    title: "Zapatista Army of National Liberation",
    url: "https://en.wikipedia.org/wiki/Zapatista_Army_of_National_Liberation",
    boundary:
      "Zapatista Army of National Liberation was the nearest canonical candidate opened, but it is not the same identity as From regional Good Government Councils to the declared GAL structure: A declared institutional boundary that does not itself assert why the change occurred or what effects it produced.",
  },
  "entity:zapatista-local-autonomous-governments": {
    title: "Zapatista Army of National Liberation",
    url: "https://en.wikipedia.org/wiki/Zapatista_Army_of_National_Liberation",
    boundary:
      "Zapatista Army of National Liberation was the nearest canonical candidate opened, but it is not the same identity as Zapatista Local Autonomous Governments: The post-2023 GAL layer described by Zapatista sources; rules in use and reach remain under review.",
  },
  "entity:zapatista-participation-and-inclusion": {
    title: "Zapatista Army of National Liberation",
    url: "https://en.wikipedia.org/wiki/Zapatista_Army_of_National_Liberation",
    boundary:
      "Zapatista Army of National Liberation was the nearest canonical candidate opened, but it is not the same identity as Participation and inclusion: How rotating civilian institutions distribute opportunities to serve and exercise authority.",
  },
  "entity:zapatista-support-base-communities": {
    title: "Zapatista Army of National Liberation",
    url: "https://en.wikipedia.org/wiki/Zapatista_Army_of_National_Liberation",
    boundary:
      "Zapatista Army of National Liberation was the nearest canonical candidate opened, but it is not the same identity as Zapatista support-base communities: Communities participating as Zapatista support bases; neither all Indigenous communities in Chiapas nor the EZLN military structure.",
  },
  "subject-guide:guide-central-planning": {
    title: "Economic planning",
    url: "https://en.wikipedia.org/wiki/Economic_planning",
    boundary:
      "Economic planning was the nearest canonical candidate opened, but it does not identify the Central planning guide composition; that guide keeps identity with its primary subject us-controlled-materials-plan.",
  },
  "subject-guide:guide-jinst-postcollective-pastoral-governance": {
    title: "Mongolia",
    url: "https://en.wikipedia.org/wiki/Mongolia",
    boundary:
      "Mongolia was the nearest canonical candidate opened, but it does not identify the Jinst post-collective pastoral governance guide composition; that guide keeps identity with its primary subject jinst-postcollective-pastoral-governance.",
  },
  "subject-guide:guide-kahnawake-community-lawmaking": {
    title: "Kahnawake",
    url: "https://en.wikipedia.org/wiki/Kahnawake",
    boundary:
      "Kahnawake was the nearest canonical candidate opened, but it does not identify the Kahnawà:ke community law-making guide composition; that guide keeps identity with its primary subject kahnawake-community-lawmaking.",
  },
  "subject-guide:guide-ruwalla-borderland-organization": {
    title: "Ruwallah",
    url: "https://en.wikipedia.org/wiki/Ruwallah",
    boundary:
      "Ruwallah was the nearest canonical candidate opened, but it does not identify the Ruwalla organization across post-Ottoman borders guide composition; that guide keeps identity with its primary subject ruwalla-borderland-organization.",
  },
} as const;

export const reviewedRejectedOrientationCandidates = Object.fromEntries(
  Object.entries(allReviewedRejectedOrientationCandidates).filter(([key]) => {
    if (key.startsWith("entity:"))
      return !(key.slice("entity:".length) in reviewedOrientationOnlyMappings);
    if (key.startsWith("subject-guide:"))
      return !(
        key.slice("subject-guide:".length) in
        reviewedOrientationOnlyGuideSubjects
      );
    return true;
  }),
) as Record<
  string,
  { readonly title: string; readonly url: string; readonly boundary: string }
>;
