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
      id: "communist-manifesto-progress-source",
      kind: "source",
      label: "Manifesto of the Communist Party (1888 Moore translation)",
      description:
        "The Marxists Internet Archive transcription of the 1969 Progress Publishers edition, translated by Samuel Moore with Engels in 1888 and proofed against that authorized English edition.",
      title: "Manifesto of the Communist Party",
      sourceType: "archival-record",
      workId: "communist-manifesto-work",
      contributorDisplay: [
        "Karl Marx",
        "Friedrich Engels",
        "Samuel Moore (translator)",
      ],
      publicationYear: 1969,
      publisher: "Progress Publishers",
      resourceLinks: [
        {
          purpose: "archive",
          url: "https://www.marxists.org/archive/marx/works/1848/communist-manifesto/",
          label: "Access the edition transcription and provenance",
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
      id: "marx-gotha-critique-carver-source",
      kind: "source",
      label: "Critique of the Gotha Programme (Carver translation)",
      description:
        "Terrell Carver's translation in the 1996 Cambridge volume Marx: Later Political Writings, consulted for Marx's account of communist phases and distribution.",
      title: "Critique of the Gotha Programme",
      sourceType: "edition",
      workId: "marx-gotha-critique-work",
      contributorDisplay: ["Karl Marx", "Terrell Carver (translator/editor)"],
      publicationYear: 1996,
      publisher: "Cambridge University Press",
      identifiers: {
        doi: "10.1017/CBO9780511810695.011",
        isbn13: "9780521367394",
      },
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://www.cambridge.org/core/books/abs/marx-later-political-writings/critique-of-the-gotha-programme/532B2E4B120B43D349FB55424E5958CF",
          label: "Publisher chapter record and text",
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
      id: "lenin-state-revolution-service-source",
      kind: "source",
      label: "The State and Revolution (Service translation)",
      description:
        "Robert Service's translated and edited Penguin Classics edition consulted for Lenin's proposed revolutionary state and higher communist phase.",
      title: "The State and Revolution",
      sourceType: "edition",
      workId: "lenin-state-revolution-work",
      contributorDisplay: [
        "Vladimir Ilyich Lenin",
        "Robert Service (translator/editor)",
      ],
      publicationYear: 2009,
      publisher: "Penguin Classics",
      identifiers: { isbn13: "9780140184358" },
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://www.penguin.co.uk/books/17060/the-state-and-revolution-by-vilenintranslated-and-edited-with-an-introduction-and-glossary-by-robert-service/9780140184358",
          label: "Publisher edition record",
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
      id: "kropotkin-conquest-bread-chapman-hall-source",
      kind: "source",
      label: "The Conquest of Bread (Chapman and Hall translation)",
      description:
        "The Standard Ebooks edition of the historical English translation attributed to Chapman and Hall, consulted for Kropotkin's anarchist-communist proposals.",
      title: "The Conquest of Bread",
      sourceType: "edition",
      workId: "kropotkin-conquest-bread-work",
      contributorDisplay: [
        "Pëtr Kropotkin",
        "Chapman and Hall (translator)",
      ],
      publicationYear: 2026,
      publisher: "Standard Ebooks",
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://standardebooks.org/ebooks/peter-kropotkin/the-conquest-of-bread/chapman-and-hall",
          label: "Read the edition and translation provenance",
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
      workType: "other",
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
        "Chapter 1 of The Cambridge History of Communism, volume 1, consulted for competing socialist organizations and early communist networks.",
      title: "Marxism and Socialist Revolution",
      sourceType: "other",
      workId: "eley-marxism-socialist-revolution-work",
      contributorDisplay: ["Geoff Eley"],
      publicationYear: 2017,
      publisher: "Cambridge University Press",
      identifiers: { doi: "10.1017/9781316137024.004" },
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
      id: "modern-communist-traditions-within-socialist-debates",
      kind: "statement",
      label: "The represented modern communist traditions emerged within socialist debates",
      description:
        "A bounded genealogy restricted to the modern traditions represented by this source set.",
      statementKind: "classification",
      text: "The modern communist traditions represented in these sources formed within nineteenth- and early-twentieth-century socialist debates over class, property, political organization, and revolution.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "communist-organizational-rivalry",
      kind: "statement",
      label: "Lenin and Kropotkin propose rival communist political routes",
      description:
        "A bounded comparison of two opposed modern communist accounts of political organization.",
      statementKind: "editorial-interpretation",
      text: "Lenin and Kropotkin advance opposed communist accounts of revolutionary political organization: Lenin proposes a transitional proletarian state, while Kropotkin proposes stateless direct organization.",
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
      id: "marx-lower-phase-inherited-limits",
      kind: "statement",
      label: "Marx's lower communist phase retains inherited limits",
      description:
        "An attributed distinction between an initial post-capitalist society and a later ideal.",
      statementKind: "definition",
      text: "Marx describes an initial communist society as emerging from capitalism with inherited economic, moral, and intellectual limits.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "marx-lower-phase-labor-distribution",
      kind: "statement",
      label: "Marx's lower communist phase distributes consumption by labor",
      description:
        "An attributed distributive rule for the initial communist phase.",
      statementKind: "attributed-proposal",
      text: "Marx describes individual consumption in the initial communist phase as proportional to contributed labor after deductions for common funds.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "marx-higher-phase-conditions",
      kind: "statement",
      label: "Marx's higher communist phase distributes by need",
      description:
        "An attributed account of a later communist phase after material and social transformation.",
      statementKind: "attributed-proposal",
      text: "Marx conditions a higher communist phase on expanded productive capacity and the end of people's subordination to the division of labor.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "marx-higher-phase-needs-distribution",
      kind: "statement",
      label: "Marx's higher communist phase distributes by need",
      description:
        "An attributed distributive rule reserved for a later communist phase.",
      statementKind: "attributed-proposal",
      text: "Marx reserves distribution according to need for the higher communist phase.",
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
      id: "eley-early-communist-network-geography",
      kind: "statement",
      label: "Early communist movements were globally varied",
      description:
        "A historical finding that resists treating one national path as the communist movement.",
      statementKind: "observation",
      text: "Eley documents participants and organizations in early communist networks across Europe, East and Central Asia, the Middle East, and Latin America.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "eley-comintern-local-revision-interpretation",
      kind: "statement",
      label: "Eley interprets some organizers as revising Comintern strategy",
      description:
        "An attributed interpretation of selected organizers rather than a general regional causal claim.",
      statementKind: "observation",
      text: "Eley presents M. N. Roy and José Carlos Mariátegui as revising revolutionary programs while disputing aspects of Comintern direction.",
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
