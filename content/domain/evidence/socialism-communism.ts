import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

export const socialismCommunismEvidenceDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "newman-socialism-vsi-work",
      kind: "work",
      label: "Socialism: A Very Short Introduction",
      description:
        "Michael Newman's historical introduction to socialist values, traditions, and their varied manifestations.",
      title: "Socialism: A Very Short Introduction",
      workType: "book",
      originalPublicationYear: 2005,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "newman-socialism-vsi-source",
      kind: "source",
      label: "Socialism: A Very Short Introduction (second edition)",
      description:
        "The 2020 Oxford University Press edition consulted for the breadth of socialist history and its relationships to communism and social democracy.",
      title: "Socialism: A Very Short Introduction",
      sourceType: "edition",
      workId: "newman-socialism-vsi-work",
      contributorDisplay: ["Michael Newman"],
      publicationYear: 2020,
      publisher: "Oxford University Press",
      identifiers: {
        doi: "10.1093/actrade/9780198836421.001.0001",
        isbn13: "9780198836421",
      },
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://academic.oup.com/book/32741",
          label: "Publisher record",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "communist-manifesto-work",
      kind: "work",
      label: "Manifesto of the Communist Party",
      description:
        "Marx and Engels's 1848 programmatic statement of communist aims, class analysis, and property claims.",
      title: "Manifesto of the Communist Party",
      workType: "book",
      originalPublicationYear: 1848,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "communist-manifesto-avalon-source",
      kind: "source",
      label: "Manifesto of the Communist Party, part II",
      description:
        "The Yale Law School Avalon Project transcription consulted for Marx and Engels's stated aims and property distinctions.",
      title:
        "Manifesto of the Communist Party: II. Proletarians and Communists",
      sourceType: "archival-record",
      workId: "communist-manifesto-work",
      contributorDisplay: ["Karl Marx", "Friedrich Engels"],
      publisher: "The Avalon Project, Yale Law School",
      resourceLinks: [
        {
          purpose: "archive",
          url: "https://avalon.law.yale.edu/19th_century/mantwo.asp",
          label: "Read the archival transcription",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "marx-gotha-critique-work",
      kind: "work",
      label: "Critique of the Gotha Programme",
      description:
        "Marx's 1875 critique distinguishing an initial communist society from a later higher phase.",
      title: "Critique of the Gotha Programme",
      workType: "other",
      originalPublicationYear: 1891,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "marx-gotha-critique-progress-source",
      kind: "source",
      label:
        "Critique of the Gotha Programme (Progress Publishers transcription)",
      description:
        "The Marxists Internet Archive transcription of the 1970 Progress Publishers English edition consulted for Marx's account of communist phases and distribution.",
      title: "Critique of the Gotha Programme",
      sourceType: "archival-record",
      workId: "marx-gotha-critique-work",
      contributorDisplay: ["Karl Marx"],
      publicationYear: 1970,
      publisher: "Progress Publishers",
      resourceLinks: [
        {
          purpose: "archive",
          url: "https://www.marxists.org/archive/marx/works/1875/gotha/index.htm",
          label: "Access the edition transcription",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "lenin-state-revolution-work",
      kind: "work",
      label: "The State and Revolution",
      description:
        "Lenin's 1917 argument for a revolutionary transition and the eventual disappearance of the state.",
      title: "The State and Revolution",
      workType: "book",
      originalPublicationYear: 1918,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "lenin-state-revolution-progress-source",
      kind: "source",
      label: "The State and Revolution (Collected Works transcription)",
      description:
        "The Lenin Internet Archive transcription of Collected Works volume 25 consulted for Lenin's proposed revolutionary state and higher communist phase.",
      title: "The State and Revolution",
      sourceType: "archival-record",
      workId: "lenin-state-revolution-work",
      contributorDisplay: ["Vladimir Ilyich Lenin"],
      publisher: "Progress Publishers",
      resourceLinks: [
        {
          purpose: "archive",
          url: "https://www.marxists.org/archive/lenin/works/1917/staterev/index.htm",
          label: "Access the Collected Works transcription",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kropotkin-conquest-bread-work",
      kind: "work",
      label: "The Conquest of Bread",
      description:
        "Kropotkin's anarchist-communist case for common possession, provision by need, and organization without parliamentary direction.",
      title: "The Conquest of Bread",
      workType: "book",
      originalPublicationYear: 1892,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kropotkin-conquest-bread-source",
      kind: "source",
      label: "The Conquest of Bread",
      description:
        "The Anarchist Library transcription consulted for Kropotkin's distinct anarchist-communist institutional and distributive claims.",
      title: "The Conquest of Bread",
      sourceType: "archival-record",
      workId: "kropotkin-conquest-bread-work",
      contributorDisplay: ["Pëtr Kropotkin"],
      publisher: "The Anarchist Library",
      resourceLinks: [
        {
          purpose: "archive",
          url: "https://theanarchistlibrary.org/library/petr-kropotkin-the-conquest-of-bread",
          label: "Read the archival transcription",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "eley-marxism-socialist-revolution-work",
      kind: "work",
      label: "Marxism and Socialist Revolution",
      description:
        "Geoff Eley's history of socialist organization and the globally varied formation of communist movements.",
      title: "Marxism and Socialist Revolution",
      workType: "article",
      originalPublicationYear: 2017,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "eley-marxism-socialist-revolution-source",
      kind: "source",
      label: "Marxism and Socialist Revolution (2017)",
      description:
        "The Cambridge History of Communism chapter consulted for competing socialist organizations and early communism's international variation.",
      title: "Marxism and Socialist Revolution",
      sourceType: "article",
      workId: "eley-marxism-socialist-revolution-work",
      contributorDisplay: ["Geoff Eley"],
      publicationYear: 2017,
      publisher: "Cambridge University Press",
      identifiers: { doi: "10.1017/9781316137024" },
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://www.cambridge.org/core/books/cambridge-history-of-communism/marxism-and-socialist-revolution/23198CE3741CE430152F5DFAE04BC0C5",
          label: "Read at Cambridge Core",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "socialism-contested-family",
      kind: "statement",
      label: "Socialism names a contested family",
      description:
        "A boundary separating socialism from a single doctrine, institution, or historical manifestation.",
      statementKind: "editorial-interpretation",
      text: "Socialism names a contested family of ideals, institutional proposals, and strategies for changing capitalist social relations rather than one settled blueprint.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "socialism-democratic-control-minimum",
      kind: "statement",
      label: "Social and democratic control is a minimum system boundary",
      description:
        "A scholarly definition centered on effective control of productive resources.",
      statementKind: "definition",
      text: "Gilabert and O'Neill define socialism's minimum economic contrast with capitalism as social and democratic control over the bulk of the means of production.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "socialism-not-statism",
      kind: "statement",
      label: "State control does not by itself establish socialism",
      description:
        "A definition that keeps state ownership distinct from democratically answerable social power.",
      statementKind: "definition",
      text: "On Gilabert and O'Neill's account, state control of an economy without democratic control by the people engaged in economic life is statism rather than socialism.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "socialism-market-boundary",
      kind: "statement",
      label: "Socialism does not determine one coordination mechanism",
      description:
        "A boundary preserving the dispute between market and non-market socialist designs.",
      statementKind: "classification",
      text: "Socialist proposals disagree over markets: some reject market allocation, while market-socialist designs retain extensive markets under changed ownership or control.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "socialism-three-distinct-questions",
      kind: "statement",
      label: "Socialist values, institutions, and transitions are distinct",
      description:
        "An analytical distinction among purposes, proposed arrangements, and paths of change.",
      statementKind: "definition",
      text: "A socialist view can specify values, institutions intended to realize them, and a path of transformation, and agreement at one of these levels does not establish agreement at the others.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "socialism-values-newman",
      kind: "statement",
      label: "Newman's account of recurring socialist values",
      description:
        "An attributed summary of values used to identify a diverse historical tradition.",
      statementKind: "attributed-value",
      text: "Newman identifies egalitarianism, solidarity, cooperation, and confidence in conscious human agency as recurring commitments across otherwise different socialisms.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "socialism-global-historical-variation",
      kind: "statement",
      label: "Socialism has varied across places and movements",
      description:
        "A historical boundary against reducing socialism to one national or European lineage.",
      statementKind: "classification",
      text: "Newman's history treats socialism as a changing global tradition whose relationships with communism, social democracy, gender, ethnicity, and environmental movements differ across places and periods.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "socialism-organizational-disagreement",
      kind: "statement",
      label: "Socialists disputed party, state, and local organization",
      description:
        "A historical disagreement among socialist movements over political organization and strategy.",
      statementKind: "classification",
      text: "Eley describes late-nineteenth-century socialist organization as a dispute among mass-party, parliamentary, anarchist, syndicalist, and other strategies rather than a single agreed route to change.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "socialism-communism-overlap-boundary",
      kind: "statement",
      label: "Socialism and communism overlap without being synonyms",
      description:
        "An editorial boundary based on their diverse ideals, organizations, and transition strategies.",
      statementKind: "editorial-interpretation",
      text: "Communist traditions arose within the wider history of socialism, but socialism also includes non-communist traditions and communism includes mutually opposed Leninist and anarchist accounts of political organization.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "communism-multiple-referents",
      kind: "statement",
      label: "Communism has several historical referents",
      description:
        "A boundary among social ideal, movement, political organization, and historical claim.",
      statementKind: "editorial-interpretation",
      text: "Communism can refer to a classless social ideal, a revolutionary tradition or movement, a party identity, or a label claimed for historical institutions, and those referents must be evaluated separately.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "manifesto-communist-immediate-aim",
      kind: "statement",
      label: "The Manifesto's immediate political aim",
      description:
        "An attributed programmatic aim for communists in the 1848 Manifesto.",
      statementKind: "attributed-proposal",
      text: "In the 1848 Manifesto, Marx and Engels call for workers to organize as a class, overthrow bourgeois political supremacy, and win political power.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "manifesto-bourgeois-property-boundary",
      kind: "statement",
      label: "The Manifesto distinguishes bourgeois and personal property",
      description:
        "A property boundary in Marx and Engels's programmatic text.",
      statementKind: "definition",
      text: "Marx and Engels distinguish abolishing bourgeois property used to command wage labor from abolishing personal appropriation for a person's own life.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "manifesto-common-property-class-character",
      kind: "statement",
      label: "The Manifesto changes capital's class character",
      description:
        "An attributed institutional proposal concerning productive property.",
      statementKind: "attributed-proposal",
      text: "The Manifesto proposes converting capital into common property so that productive property loses its class character rather than turning personal possessions into collective property.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "marx-lower-communist-phase",
      kind: "statement",
      label: "Marx's lower communist phase retains inherited limits",
      description:
        "An attributed distinction between an initial post-capitalist society and a later ideal.",
      statementKind: "definition",
      text: "Marx describes an initial communist society as emerging from capitalism with inherited economic and cultural limits, including distribution to producers in proportion to their contributed labor after common deductions.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "marx-higher-communist-phase",
      kind: "statement",
      label: "Marx's higher communist phase distributes by need",
      description:
        "An attributed account of a later communist phase after material and social transformation.",
      statementKind: "attributed-proposal",
      text: "Marx reserves distribution according to need for a higher communist phase in which productive capacity has expanded and subordination to the division of labor has ended.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "lenin-transitional-state-claim",
      kind: "statement",
      label: "Lenin argues for a coercive transitional state",
      description:
        "An attributed Leninist claim about political authority during a revolutionary transition.",
      statementKind: "attributed-proposal",
      text: "Lenin argues that a proletarian state must replace the bourgeois state during revolution and exercise coercive power against the former ruling class.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "lenin-state-withering-claim",
      kind: "statement",
      label: "Lenin expects the transitional state to wither away",
      description:
        "An attributed claim about the eventual disappearance of state coercion.",
      statementKind: "attributed-proposal",
      text: "Lenin argues that the proletarian state becomes unnecessary and withers away only after class domination no longer requires a coercive state apparatus.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kropotkin-anarchist-communist-route",
      kind: "statement",
      label: "Kropotkin proposes an anarchist communist route",
      description:
        "A rival communist distributive account based on common possession and provision by need.",
      statementKind: "attributed-proposal",
      text: "Kropotkin's anarchist communism proposes common possession of productive wealth and organizes provision around people's needs.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kropotkin-nonparliamentary-route",
      kind: "statement",
      label: "Kropotkin rejects a parliamentary route",
      description:
        "A rival communist transition proposal based on direct action and self-direction.",
      statementKind: "attributed-proposal",
      text: "Kropotkin proposes that people take possession of necessities and organize production directly rather than wait for parliamentary action.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "communism-early-global-variation",
      kind: "statement",
      label: "Early communist movements were globally varied",
      description:
        "A historical finding that resists treating one national path as the communist movement.",
      statementKind: "observation",
      text: "Eley traces early communist organizing through Europe, East and Central Asia, the Middle East, and Latin America, where anti-colonial priorities and local political traditions produced substantial disagreement with Comintern direction.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "communist-label-non-embodiment",
      kind: "statement",
      label: "A communist label does not prove institutional embodiment",
      description: "An analytical boundary for future bounded cases.",
      statementKind: "editorial-interpretation",
      text: "A party name or state self-description establishes an actor's claimed identity, not that its institutions realize any one communist account of property, class, distribution, authority, or the state.",
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
