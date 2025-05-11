import { LocaleSymbol, EditionMeta, CopyTemplateData, FormatTemplateData, LanguageSymbol, BookNaming } from 'src/types'


export const localeData: Array<{ symbol: LocaleSymbol, langName: string, regionName: string }> = [
  // {
  //   symbol: 'en-GB',
  //   langName: 'English',
  //   regionName: 'Great Britain'
  // },
  {
    symbol: 'en-US',
    langName: 'English',
    regionName: 'United States'
  },
  // {
  //   symbol: 'es-ES',
  //   langName: 'Español',
  //   regionName: 'España'
  // },
  {
    symbol: 'pl-PL',
    langName: 'Polski',
    regionName: 'Polska'
  },
  // {
  //   symbol: 'pt-PT',
  //   langName: 'Português',
  //   regionName: 'Portugal'
  // },
  // {
  //   symbol: 'uk-UA',
  //   langName: 'Українська',
  //   regionName: 'Україна'
  // }
]

export const bookNamings = [
  {
    locale: 'en',
    name: 'Standard',
    books: [
      'Genesis',
      'Exodus',
      'Leviticus',
      'Numbers',
      'Deuteronomy',
      'Joshua',
      'Judges',
      'Ruth',
      '1 Samuel',
      '2 Samuel',
      '1 Kings',
      '2 Kings',
      '1 Chronicles',
      '2 Chronicles',
      'Ezra',
      'Nehemiah',
      'Esther',
      'Job',
      'Psalms',
      'Proverbs',
      'Ecclesiastes',
      'Song of Solomon',
      'Isaiah',
      'Jeremiah',
      'Lamentations',
      'Ezekiel',
      'Daniel',
      'Hosea',
      'Joel',
      'Amos',
      'Obadiah',
      'Jonah',
      'Micah',
      'Nahum',
      'Habakkuk',
      'Zephaniah',
      'Haggai',
      'Zechariah',
      'Malachi',
      'Matthew',
      'Mark',
      'Luke',
      'John',
      'Acts',
      'Romans',
      '1 Corinthians',
      '2 Corinthians',
      'Galatians',
      'Ephesians',
      'Philippians',
      'Colossians',
      '1 Thessalonians',
      '2 Thessalonians',
      '1 Timothy',
      '2 Timothy',
      'Titus',
      'Philemon',
      'Hebrews',
      'James',
      '1 Peter',
      '2 Peter',
      '1 John',
      '2 John',
      '3 John',
      'Jude',
      'Revelation',
      'Tobit',
      'Judith',
      '1 Maccabees',
      '2 Maccabees',
      'Wisdom of Solomon',
      'Sirach (Ecclesiasticus)',
      'Baruch',
    ]
  },
  {
    // Source: https://guide.unwsp.edu/c.php?g=1321431&p=9721749
    locale: 'en',
    name: 'SBL abbreviations',
    books: [
      'Gen',
      'Exod',
      'Lev',
      'Num',
      'Deut',
      'Josh',
      'Judg',
      'Ruth',
      '1 Sam',
      '2 Sam',
      '1 Kgs',
      '2 Kgs',
      '1 Chr',
      '2 Chr',
      'Ezra',
      'Neh',
      'Esth',
      'Job',
      'Ps',
      'Prov',
      'Eccl',
      'Song',
      'Isa',
      'Jer',
      'Lam',
      'Ezek',
      'Dan',
      'Hos',
      'Joel',
      'Amos',
      'Obad',
      'Jonah',
      'Mic',
      'Nah',
      'Hab',
      'Zeph',
      'Hag',
      'Zech',
      'Mal',
      'Matt',
      'Mark',
      'Luke',
      'John',
      'Acts',
      'Rom',
      '1 Cor',
      '2 Cor',
      'Gal',
      'Eph',
      'Phil',
      'Col',
      '1 Thess',
      '2 Thess',
      '1 Tim',
      '2 Tim',
      'Titus',
      'Phlm',
      'Heb',
      'Jas',
      '1 Pet',
      '2 Pet',
      '1 John',
      '2 John',
      '3 John',
      'Jude',
      'Rev',
      'Tob',
      'Jdt',
      '1Macc',
      '2Macc',
      'Wis',
      'Sir',
      'Bar',
    ]
  },
  {
    // Source: https://wiki.crosswire.org/OSIS_Book_Abbreviations
    locale: 'en',
    name: 'OSIS abbreviations',
    books: [
      'Gen',
      'Exod',
      'Lev',
      'Num',
      'Deut',
      'Josh',
      'Judg',
      'Ruth',
      '1Sam',
      '2Sam',
      '1Kgs',
      '2Kgs',
      '1Chr',
      '2Chr',
      'Ezra',
      'Neh',
      'Esth',
      'Job',
      'Ps',
      'Prov',
      'Eccl',
      'Song',
      'Isa',
      'Jer',
      'Lam',
      'Ezek',
      'Dan',
      'Hos',
      'Joel',
      'Amos',
      'Obad',
      'Jonah',
      'Mic',
      'Nah',
      'Hab',
      'Zeph',
      'Hag',
      'Zech',
      'Mal',
      'Matt',
      'Mark',
      'Luke',
      'John',
      'Acts',
      'Rom',
      '1Cor',
      '2Cor',
      'Gal',
      'Eph',
      'Phil',
      'Col',
      '1Thess',
      '2Thess',
      '1Tim',
      '2Tim',
      'Titus',
      'Phlm',
      'Heb',
      'Jas',
      '1Pet',
      '2Pet',
      '1John',
      '2John',
      '3John',
      'Jude',
      'Rev',
      'Tob',
      'Jdt',
      '1Macc',
      '2Macc',
      'Wis',
      'Sir',
      'Bar'
    ]
  },
  {
    locale: 'pl',
    name: 'EIB skrócone',
    books: [
      'Rodzaju',
      'Wyjścia',
      'Kapłańska',
      'Liczb',
      'Powtórzonego Prawa',
      'Jozuego',
      'Sędziów',
      'Rut',
      '1 Samuela',
      '2 Samuela',
      '1 Królewska',
      '2 Królewska',
      '1 Kronik',
      '2 Kronik',
      'Ezdrasza',
      'Nehemiasza',
      'Estery',
      'Hioba',
      'Psalmów',
      'Przysłów',
      'Kaznodziei',
      'Pieśń nad pieśniami',
      'Izajasza',
      'Jeremiasza',
      'Treny',
      'Ezechiela',
      'Daniela',
      'Ozeasza',
      'Joela',
      'Amosa',
      'Abdiasza',
      'Jonasza',
      'Micheasza',
      'Nahuma',
      'Habakuka',
      'Sofoniasza',
      'Aggeusza',
      'Zachariasza',
      'Malachiasza',
      'Mateusza',
      'Marka',
      'Łukasza',
      'Jana',
      'Dzieje Apostolskie',
      'Rzymian',
      '1 Koryntian',
      '2 Koryntian',
      'Galatów',
      'Efezjan',
      'Filipian',
      'Kolosan',
      '1 Tesaloniczan',
      '2 Tesaloniczan',
      '1 Tymoteusza',
      '2 Tymoteusza',
      'Tytusa',
      'Filemona',
      'Hebrajczyków',
      'Jakuba',
      '1 Piotra',
      '2 Piotra',
      '1 Jana',
      '2 Jana',
      '3 Jana',
      'Judy',
      'Apokalipsa św. Jana',
      'Tobiasza',
      'Judyty',
      '1 Machabejska',
      '2 Machabejska',
      'Mądrości',
      'Mądrość Syracha',
      'Barucha',
    ]
  },
  {
    locale: 'pl',
    name: 'EIB pełne',
    books: [
      'Księga Rodzaju',
      'Księga Wyjścia',
      'Księga Kapłańska',
      'Księga Liczb',
      'Księga Powtórzonego Prawa',
      'Księga Jozuego',
      'Księga Sędziów',
      'Księga Rut',
      'Pierwsza Księga Samuela',
      'Druga Księga Samuela',
      'Pierwsza Księga Królewska',
      'Druga Księga Królewska',
      'Pierwsza Księga Kronik',
      'Druga Księga Kronik',
      'Księga Ezdrasza',
      'Księga Nehemiasza',
      'Księga Estery',
      'Księga Hioba',
      'Księga Psalmów',
      'Księga Przysłów',
      'Księga Kaznodziei',
      'Pieśń nad pieśniami',
      'Księga Izajasza',
      'Księga Jeremiasza',
      'Treny',
      'Księga Ezechiela',
      'Księga Daniela',
      'Księga Ozeasza',
      'Księga Joela',
      'Księga Amosa',
      'Księga Abdiasza',
      'Księga Jonasza',
      'Księga Micheasza',
      'Księga Nahuma',
      'Księga Habakuka',
      'Księga Sofoniasza',
      'Księga Aggeusza',
      'Księga Zachariasza',
      'Księga Malachiasza',
      'Ewangelia według św. Mateusza',
      'Ewangelia według św. Marka',
      'Ewangelia według św. Łukasza',
      'Ewangelia według św. Jana',
      'Dzieje Apostolskie',
      'List św. Pawła do Rzymian',
      'Pierwszy List św. Pawła do Koryntian',
      'Drugi List św. Pawła do Koryntian',
      'List św. Pawła do Galatów',
      'List św. Pawła do Efezjan',
      'List św. Pawła do Filipian',
      'List św. Pawła do Kolosan',
      'Pierwszy List św. Pawła do Tesaloniczan',
      'Drugi List św. Pawła do Tesaloniczan',
      'Pierwszy List św. Pawła do Tymoteusza',
      'Drugi List św. Pawła do Tymoteusza',
      'List św. Pawła do Tytusa',
      'List św. Pawła do Filemona',
      'List do Hebrajczyków',
      'List św. Jakuba',
      'Pierwszy List św. Piotra',
      'Drugi List św. Piotra',
      'Pierwszy List św. Jana',
      'Drugi List św. Jana',
      'Trzeci List św. Jana',
      'List św. Judy',
      'Apokalipsa św. Jana',
      'Księga Tobiasza',
      'Księga Judyty',
      'Pierwszy Księga Machabejska',
      'Drugi Księga Machabejska',
      'Księga Mądrości',
      'Mądrość Syracha',
      'Księga Barucha',
    ]
  },
  {
    // Source: https://pl.wikipedia.org/wiki/Biblia_Tysi%C4%85clecia
    locale: 'pl',
    name: 'BT5 pełne',
    books: [
      'Księga Rodzaju',
      'Księga Wyjścia',
      'Księga Kapłańska',
      'Księga Liczb',
      'Księga Powtórzonego Prawa',
      'Księga Jozuego',
      'Księga Sędziów',
      'Księga Rut',
      '1 Księga Samuela',
      '2 Księga Samuela',
      '1 Księga Królewska',
      '2 Księga Królewska',
      '1 Księga Kronik',
      '2 Księga Kronik',
      'Księga Ezdrasza',
      'Księga Nehemiasza',
      'Księga Estery',
      'Księga Hioba',
      'Księga Psalmów',
      'Księga Przysłów',
      'Księga Koheleta',
      'Pieśń nad pieśniami',
      'Księga Izajasza',
      'Księga Jeremiasza',
      'Lamentacje Jeremiasza',
      'Księga Ezechiela',
      'Księga Daniela',
      'Księga Ozeasza',
      'Księga Joela',
      'Księga Amosa',
      'Księga Abdiasza',
      'Księga Jonasza',
      'Księga Micheasza',
      'Księga Nahuma',
      'Księga Habakuka',
      'Księga Sofoniasza',
      'Księga Aggeusza',
      'Księga Zachariasza',
      'Księga Malachiasza',
      'Ewangelia wg św. Mateusza',
      'Ewangelia wg św. Marka',
      'Ewangelia wg św. Łukasza',
      'Ewangelia wg św. Jana',
      'Dzieje Apostolskie',
      'List do Rzymian',
      '1 List do Koryntian',
      '2 List do Koryntian',
      'List do Galatów',
      'List do Efezjan',
      'List do Filipian',
      'List do Kolosan',
      '1 List do Tesaloniczan',
      '2 List do Tesaloniczan',
      '1 List do Tymoteusza',
      '2 List do Tymoteusza',
      'List do Tytusa',
      'List do Filemona',
      'List do Hebrajczyków',
      'List św. Jakuba',
      '1 List św. Piotra',
      '2 List św. Piotra',
      '1 List św. Jana',
      '2 List św. Jana',
      '3 List św. Jana',
      'List św. Judy',
      'Apokalipsa św. Jana',
      'Księga Tobiasza',
      'Księga Judyty',
      '1 Księga Machabejska',
      '2 Księga Machabejska',
      'Księga Mądrości',
      'Mądrość Syracha',
      'Księga Barucha',
    ]
  },
  {
    // Source: https://biblia.deon.pl/menu.php?st_id=4
    locale: 'pl',
    name: 'BT5 średnie',
    books: [
      'Ks. Rodzaju',
      'Ks. Wyjścia',
      'Ks. Kapłańska',
      'Ks. Liczb',
      'Ks. Powtórzonego Prawa',
      'Ks. Jozuego',
      'Ks. Sędziów',
      'Ks. Rut',
      '1 Ks. Samuela',
      '2 Ks. Samuela',
      '1 Ks. Królewska',
      '2 Ks. Królewska',
      '1 Ks. Kronik',
      '2 Ks. Kronik',
      'Ks. Ezdrasza',
      'Ks. Nehemiasza',
      'Ks. Estery',
      'Ks. Hioba',
      'Ks. Psalmów',
      'Ks. Przysłów',
      'Ks. Koheleta',
      'Pieśń nad Pieśniami',
      'Ks. Izajasza',
      'Ks. Jeremiasza',
      'Lamentacje',
      'Ks. Ezechiela',
      'Ks. Daniela',
      'Ks. Ozeasza',
      'Ks. Joela',
      'Ks. Amosa',
      'Ks. Abdiasza',
      'Ks. Jonasza',
      'Ks. Micheasza',
      'Ks. Nahuma',
      'Ks. Habakuka',
      'Ks. Sofoniasza',
      'Ks. Aggeusza',
      'Ks. Zachariasza',
      'Ks. Malachiasza',
      'Ew. wg św. Mateusza',
      'Ew. wg św. Marka',
      'Ew. wg św. Łukasza',
      'Ew. wg św. Jana',
      'Dzieje Apostolskie',
      'List do Rzymian',
      '1 List do Koryntian',
      '2 List do Koryntian',
      'List do Galatów',
      'List do Efezjan',
      'List do Filipian',
      'List do Kolosan',
      '1 List do Tesaloniczan',
      '1 List do Tymoteusza',
      '2 List do Tymoteusza',
      'List do Tytusa',
      'List do Filemona',
      'List do Hebrajczyków',
      'List św. Jakuba',
      '1 List św. Piotra',
      '2 List św. Piotra',
      '1 List św. Jana',
      '2 List św. Jana',
      '3 List św. Jana',
      'List św. Judy',
      'Apokalipsa św. Jana',
      'Ks. Tobiasza',
      'Ks. Judyty',
      '1 Ks. Machabejska',
      '2 Ks. Machabejska',
      'Ks. Mądrości',
      'Mądrość Syracha',
      'Ks. Barucha',
    ]
  },
  {
    // Source https://pl.wikipedia.org/wiki/Biblia_warszawska
    locale: 'pl',
    name: 'BW pełne',
    books: [
      'Pierwsza Księga Mojżeszowa',
      'Druga Księga Mojżeszowa',
      'Trzecia Księga Mojżeszowa',
      'Czwarta Księga Mojżeszowa',
      'Piąta Księga Mojżeszowa',
      'Księga Jozuego',
      'Księga Sędziów',
      'Księga Rut',
      'Pierwsza Księga Samuela',
      'Druga Księga Samuela',
      'Pierwsza Księga Królewska',
      'Druga Księga Królewska',
      'Pierwsza Księga Kronik',
      'Druga Księga Kronik',
      'Księga Ezdrasza',
      'Księga Nehemiasza',
      'Księga Estery',
      'Księga Joba',
      'Księga Psalmów',
      'Przypowieści Salomona',
      'Księga Kaznodziei Salomona',
      'Pieśń nad Pieśniami',
      'Księga Izajasza',
      'Księga Jeremiasza',
      'Treny',
      'Księga Ezechiela',
      'Księga Daniela',
      'Księga Ozeasza',
      'Księga Joela',
      'Księga Amosa',
      'Księga Abdiasza',
      'Księga Jonasza',
      'Księga Micheasza',
      'Księga Nahuma',
      'Księga Habakuka',
      'Księga Sofoniasza',
      'Księga Aggeusza',
      'Księga Zachariasza',
      'Ewangelia św. Mateusza',
      'Ewangelia św. Marka',
      'Ewangelia św. Łukasza',
      'Ewangelia św. Jana',
      'Dzieje Apostolskie',
      'List św. Pawła do Rzymian',
      'Pierwszy list św. Pawła do Koryntian',
      'Drugi list św. Pawła do Koryntian',
      'List św. Pawła do Galacjan',
      'List św. Pawła do Efezjan',
      'List św. Pawła do Filipian',
      'List św. Pawła do Kolosan',
      'Pierwszy list św. Pawła do Tesaloniczan',
      'Drugi list św. Pawła do Tesaloniczan',
      'Pierwszy list św. Pawła do Tymoteusza',
      'Drugi list św. Pawła do Tymoteusza',
      'List św. Pawła do Tytusa',
      'List św. Pawła do Filemona',
      'List do Hebrajczyków',
      'List św. Jakuba',
      'Pierwszy list św. Piotra',
      'Drugi list św. Piotra',
      'Pierwszy list św. Jana',
      'Drugi list św. Jana',
      'Trzeci list św. Jana',
      'List św. Judy',
      'Objawienie św. Jana',
      'Księga Tobiasza',
      'Księga Judyty',
      '1 Księga Machabejska',
      '2 Księga Machabejska',
      'Księga Mądrości',
      'Mądrość Syracha',
      'Księga Barucha',
    ]
  },
  {
    // Short names
    locale: 'pl',
    name: 'BW średnie',
    books: [
      '1 Mojżoszowa',
      '2 Mojżoszowa',
      '3 Mojżoszowa',
      '4 Mojżoszowa',
      '5 Mojżoszowa',
      'Jozuego',
      'Sędziów',
      'Rut',
      '1 Samuela',
      '2 Samuela',
      '1 Królewska',
      '2 Królewska',
      '1 Kronik',
      '2 Kronik',
      'Ezdrasza',
      'Nehemiasza',
      'Estery',
      'Hioba',
      'Psalmów',
      'Przysłów',
      'Koheleta',
      'Pieśń nad Pieśniami',
      'Izajasza',
      'Jeremiasza',
      'Lamentacje',
      'Ezechiela',
      'Daniela',
      'Ozeasza',
      'Joela',
      'Amosa',
      'Abdiasza',
      'Jonasza',
      'Micheasza',
      'Nahuma',
      'Habakuka',
      'Sofoniasza',
      'Aggeusza',
      'Zachariasza',
      'Malachiasza',
      'Ewangelia Mateusza',
      'Ewangelia Marka',
      'Ewangelia Łukasza',
      'Ewangelia Jana',
      'Dzieje Apostolskie',
      'Rzymian',
      '1 Koryntian',
      '2 Koryntian',
      'Galatów',
      'Efezjan',
      'Filipian',
      'Kolosan',
      '1 Tesaloniczan',
      '2 Tesaloniczan',
      '1 Tymoteusza',
      '2 Tymoteusza',
      'Tytusa',
      'Filemona',
      'Hebrajczyków',
      'Jakuba',
      '1 Piotra',
      '2 Piotra',
      '1 Jana',
      '2 Jana',
      '3 Jana',
      'Judy',
      'Apokalipsa'
    ]
  },
  {
    // Source: https://pl.wikipedia.org/wiki/Biblia_Tysi%C4%85clecia
    locale: 'pl',
    name: 'BT skróty',
    books: [
      'Rdz',
      'Wj',
      'Kpł',
      'Lb',
      'Pwt',
      'Joz',
      'Sdz',
      'Rt',
      '1 Sm',
      '2 Sm',
      '1 Krl',
      '2 Krl',
      '1 Krn',
      '2 Krn',
      'Ezd',
      'Ne',
      'Est',
      'Hi',
      'Ps',
      'Prz',
      'Koh',
      'PnP',
      'Iz',
      'Jr',
      'Lm',
      'Ez',
      'Dn',
      'Oz',
      'Jl',
      'Am',
      'Ab',
      'Jon',
      'Mi',
      'Na',
      'Ha',
      'So',
      'Ag',
      'Za',
      'Ml',
      'Mt',
      'Mk',
      'Łk',
      'J',
      'Dz',
      'Rz',
      '1 Kor',
      '2 Kor',
      'Ga',
      'Ef',
      'Flp',
      'Kol',
      '1 Tes',
      '2 Tes',
      '1 Tm',
      '2 Tm',
      'Tt',
      'Flm',
      'Hbr',
      'Jk',
      '1 P',
      '2 P',
      '1 J',
      '2 J',
      '3 J',
      'Jud',
      'Ap',
      'Tb',
      'Jdt',
      '1 Mch',
      '2 Mch',
      'Mdr',
      'Syr',
      'Ba',
    ]
  },
  {
    // Source https://pl.wikipedia.org/wiki/Biblia_warszawska
    locale: 'pl',
    name: 'BW skróty',
    books: [
      'I Mojż.',
      'II Mojż.',
      'III Mojż.',
      'IV Mojż.',
      'V Mojż.',
      'Joz.',
      'Sędz.',
      'Rut',
      'I Sam.',
      'II Sam.',
      'I Król.',
      'II Król.',
      'I Kron.',
      'II Kron.',
      'Ezdr.',
      'Neh.',
      'Est.',
      'Job',
      'Ps.',
      'Przyp.',
      'Kazn.',
      'P.n.P.',
      'Izaj.',
      'Jer.',
      'Treny',
      'Ez.',
      'Dan.',
      'Oz.',
      'Joel',
      'Am.',
      'Abd.',
      'Jon.',
      'Mich.',
      'Nah.',
      'Hab.',
      'Sof.',
      'Ag.',
      'Zach.',
      'Mat.',
      'Mar.',
      'Łuk.',
      'Jan',
      'Dz.',
      'Rzym.',
      '1 Kor.',
      '2 Kor.',
      'Gal.',
      'Efez.',
      'Fil.',
      'Kol.',
      'I Tes.',
      'II Tes.',
      'I Tym.',
      'II Tym.',
      'Tyt.',
      'Filem.',
      'Hebr.',
      'Jak.',
      'I Piotr',
      'II Piotr',
      'I Jan',
      'II Jan',
      'III Jan',
      'Judy',
      'Obj.',
    ]
  },
  {
    locale: 'pl' as LocaleSymbol,
    name: 'Moje pl',
    books: [
      'Rdz',
      'Wyj',
      'Kpł',
      'Lb',
      'Pwt',
      'Joz',
      'Sdz',
      'Rt',
      '1 Sm',
      '2 Sam',
      '1 Krl',
      '2 Krl',
      '1 Krn',
      '2 Krn',
      'Ezd',
      'Neh',
      'Est',
      'Hi',
      'Ps',
      'Prz',
      'Koh',
      'PnP',
      'Iz',
      'Jer',
      'Lam',
      'Ez',
      'Dn',
      'Oz',
      'Jl',
      'Amo',
      'Abd',
      'Jon',
      'Mi',
      'Nah',
      'Hab',
      'Sof',
      'Ag',
      'Za',
      'Mal',
      'Mt',
      'Mk',
      'Łk',
      'J',
      'Dz',
      'Rz',
      '1 Kor',
      '2 Kor',
      'Gal',
      'Ef',
      'Flp',
      'Kol',
      '1 Tes',
      '2 Tes',
      '1 Tm',
      '2 Tm',
      'Tt',
      'Flm',
      'Hbr',
      'Jk',
      '1 Pt',
      '2 Pt',
      '1 J',
      '2 J',
      '3 J',
      'Jud',
      'Ap',
      'Tob',
      'Jdt',
      '1 Mch',
      '2 Mch',
      'Mdr',
      'Syr',
      'Ba'
    ]
  }
  // {
  //   lang: 'pl',
  //   name: '',
  //   books: []
  // },
] as BookNaming[]

export const copyTemplates: Record<LocaleSymbol, CopyTemplateData[]> = {
  'ar-SA': [
    {
      'name': 'عرض',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'خطوط منفصلة',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'دراسة',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'cs-CZ': [
    {
      'name': 'Prezentace',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Samostatné řádky',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Studium',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'da-DK': [
    {
      'name': 'Præsentation',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Separate linjer',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Studie',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'de-DE': [
    {
      'name': 'Präsentation',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Getrennte Zeilen',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Studium',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'el-GR': [
    {
      'name': 'Παρουσίαση',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Ξεχωριστές γραμμές',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Μελέτη',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'en-US': [
    {
      'name': 'Presentation',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Separate lines',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Study',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'eo': [
    {
      'name': 'Prezentado',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Apartaj linioj',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Studo',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'es-ES': [
    {
      'name': 'Presentación',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Líneas separadas',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Estudio',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'fi-FI': [
    {
      'name': 'Esitys',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Erotetut rivit',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Tutkimus',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'fr-FR': [
    {
      'name': 'Présentation',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Lignes séparées',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Étude',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'he-IL': [
    {
      'name': 'מצגת',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'שורות נפרדות',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'לימוד',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'hr-HR': [
    {
      'name': 'Prezentacija',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Odvojene linije',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Studija',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'hu-HU': [
    {
      'name': 'Bemutatás',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Külön sorok',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Tanulmány',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'it-IT': [
    {
      'name': 'Presentazione',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Righe separate',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Studio',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'la': [
    {
      'name': 'Praesentatio',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Lineae separatae',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Studium',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'lt-LT': [
    {
      'name': 'Pristatymas',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Atskirtos eilutės',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Studija',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'nl-NL': [
    {
      'name': 'Presentatie',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Gescheiden regels',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Studie',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'pl-PL': [
    {
      'name': 'Oficjalny',
      'formatTemplate': 'PL – oficjalny w cudzysłowiu',
      'bookNaming': 'EIB pełne'
    },
    {
      'name': 'Prezentacja',
      'formatTemplate': 'PL – prezentacja',
      'bookNaming': 'EIB skrócone'
    },
    {
      'name': 'Studium',
      'formatTemplate': 'Studium',
      'bookNaming': 'Moje pl'
    }
  ],
  'pt-BR': [
    {
      'name': 'Apresentação',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Linhas separadas',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Estudo',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'ru-RU': [
    {
      'name': 'Презентация',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Отдельные строки',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Исследование',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'sk-SK': [
    {
      'name': 'Prezentácia',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Samostatné riadky',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Štúdium',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'sv-SE': [
    {
      'name': 'Presentation',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Separata rader',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Studium',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ],
  'uk-UA': [
    {
      'name': 'Презентація',
      'formatTemplate': 'English presentation',
      'bookNaming': 'Standard'
    },
    {
      'name': 'Окремі рядки',
      'formatTemplate': 'Separate lines',
      'bookNaming': 'OSIS abbreviations'
    },
    {
      'name': 'Дослідження',
      'formatTemplate': 'Studium',
      'bookNaming': 'SBL abbreviations'
    }
  ]
}

export const formatTemplates: FormatTemplateData[] =
  [
    {
      'name': 'App format',
      'referencePosition': 'before',
      'referenceLine': 'same line',
      'editionAbbreviation': 'none',
      'numbers': false,
      'verseNewLine': false,
      'referenceWithoutContent': false,
      'separatorChar': ':',
      'rangeChar': '-',
      'referenceCharsBefore': '',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '',
      'quoteCharsAfter': '',
      'verseNumberCharsBefore': '',
      'verseNumberCharsAfter': '',
      'editionAbbreviationCharsBefore': '',
      'editionAbbreviationCharsAfter': ''
    },
    {
      'name': 'English presentation',
      'referencePosition': 'after',
      'referenceLine': 'new line',
      'editionAbbreviation': 'uppercase',
      'numbers': false,
      'verseNewLine': false,
      'referenceWithoutContent': false,
      'separatorChar': ':',
      'rangeChar': '-',
      'referenceCharsBefore': '',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '',
      'quoteCharsAfter': '',
      'verseNumberCharsBefore': '',
      'verseNumberCharsAfter': '',
      'editionAbbreviationCharsBefore': '',
      'editionAbbreviationCharsAfter': ''
    },
    {
      'name': 'PL – oficjalny w cudzysłowiu',
      'referencePosition': 'after',
      'referenceLine': 'new line',
      'editionAbbreviation': 'none',
      'numbers': false,
      'verseNewLine': false,
      'referenceWithoutContent': false,
      'separatorChar': ',',
      'rangeChar': '-',
      'referenceCharsBefore': '',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '"',
      'quoteCharsAfter': '"',
      'verseNumberCharsBefore': '',
      'verseNumberCharsAfter': '',
      'editionAbbreviationCharsBefore': '',
      'editionAbbreviationCharsAfter': ''
    },
    {
      'name': 'PL – prezentacja',
      'referencePosition': 'after',
      'referenceLine': 'new line',
      'editionAbbreviation': 'uppercase',
      'numbers': false,
      'verseNewLine': false,
      'referenceWithoutContent': false,
      'separatorChar': ',',
      'rangeChar': '-',
      'referenceCharsBefore': '',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '',
      'quoteCharsAfter': '',
      'verseNumberCharsBefore': '',
      'verseNumberCharsAfter': '',
      'editionAbbreviationCharsBefore': '',
      'editionAbbreviationCharsAfter': ''
    },
    {
      'name': 'Separate lines',
      'referencePosition': 'before',
      'referenceLine': 'same line',
      'editionAbbreviation': 'uppercase',
      'numbers': true,
      'verseNewLine': true,
      'referenceWithoutContent': false,
      'separatorChar': ':',
      'rangeChar': '-',
      'referenceCharsBefore': '',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '',
      'quoteCharsAfter': '',
      'verseNumberCharsBefore': '(',
      'verseNumberCharsAfter': ')',
      'editionAbbreviationCharsBefore': '',
      'editionAbbreviationCharsAfter': ''
    },
    {
      'name': 'Studium',
      'referencePosition': 'before',
      'referenceLine': 'new line',
      'editionAbbreviation': 'uppercase',
      'numbers': true,
      'verseNewLine': false,
      'referenceWithoutContent': false,
      'separatorChar': ':',
      'rangeChar': '-',
      'referenceCharsBefore': '– ',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '',
      'quoteCharsAfter': '',
      'verseNumberCharsBefore': '(',
      'verseNumberCharsAfter': ')',
      'editionAbbreviationCharsBefore': '',
      'editionAbbreviationCharsAfter': ''
    },
    // The name for this template will be replaced by the translated value from i18n
    // in settings-store.ts when locale changes
    {
      'name': 'Reference only',
      'referencePosition': 'before',
      'referenceLine': 'same line',
      'editionAbbreviation': 'uppercase',
      'numbers': false,
      'verseNewLine': false,
      'referenceWithoutContent': true,
      'separatorChar': ':',
      'rangeChar': '-',
      'referenceCharsBefore': '',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '',
      'quoteCharsAfter': '',
      'verseNumberCharsBefore': '',
      'verseNumberCharsAfter': '',
      'editionAbbreviationCharsBefore': '',
      'editionAbbreviationCharsAfter': ''
    }

  ]

export const bookOrder = {
  pl: {
    bt5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 66, 67, 16, 68, 69, 17, 18, 19, 20, 21, 70, 71, 22, 23, 24, 72, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65]
  }
}


/*
The format of editions:
{
  title: '',
  symbol: '',
  bookNames: 'katolicki',
}
If 'bookNames' is not specified, then it will be taken from bookNames[lang].default
*/

// export const editionsData: EditionMeta[] = [
//   {
//     locale: 'en-US',
//     title: 'King James Version',
//     symbol: 'KJV',
//     size: 4_472_372,
//   },
//   {
//     locale: 'en-US',
//     title: 'New International Version',
//     symbol: 'NIV',
//     size: 3_902_640,
//   },
//   {
//     title: 'New Living Translation',
//     locale: 'en-US',
//     symbol: 'NLT',
//     size: 4_097_509,
//   },
//   {
//     title: 'Biblia Ewangeliczna',
//     symbol: 'EIB',
//     locale: 'pl-PL',
//     size: 4_104_753,
//     year: '2016',
//     bookNames: 'protestancki',
//   },
//   {
//     title: 'Biblia Tysiąclecia V',
//     symbol: 'BT5',
//     locale: 'pl-PL',
//     size: 4_552_494,
//     year: '2000',
//     bookOrder: 'bt5',
//   },
//   {
//     title: 'Biblia Warszawska (brytyjka)',
//     symbol: 'BW',
//     locale: 'pl-PL',
//     size: 4_024_215,
//     year: '1975',
//     bookNames: 'bw pełne',
//   },
//   {
//     title: 'Uwspółcześniona Biblia Gdańska',
//     symbol: 'UBG',
//     locale: 'pl-PL',
//     size: 3_962_719,
//     year: '2017',
//     bookNames: 'protestancki',
//   },
// ]

export const editionsData: EditionMeta[] = [
  {
    locale: 'ar-SA',
    title: 'Arabic Bible (Smith and Van Dyke)',
    symbol: 'AVD',
    comments: false,
    strong: false,
    year: '1865',
    size: 10955855
  },
  {
    locale: 'cs-CZ',
    title: 'Překlad 21. století',
    symbol: 'B21',
    comments: false,
    strong: false,
    year: '2009',
    size: 3911963
  },
  {
    locale: 'cs-CZ',
    title: 'Bible kralická',
    symbol: 'BKR',
    comments: false,
    strong: false,
    year: '1613',
    size: 4185808
  },
  {
    locale: 'da-DK',
    title: 'Dansk',
    symbol: 'D31',
    comments: false,
    strong: false,
    year: '1931',
    size: 3958626
  },
  {
    locale: 'da-DK',
    title: 'Danish Bibelen',
    symbol: 'D92',
    comments: false,
    strong: false,
    year: '1992',
    size: 4572839
  },
  {
    locale: 'de-DE',
    title: 'Buber-Rosenzweig [OT]',
    symbol: 'BRU',
    comments: false,
    strong: false,
    year: '1929',
    size: 3328441
  },
  {
    locale: 'de-DE',
    title: 'Einheitsübersetzung',
    symbol: 'EIN',
    comments: false,
    strong: false,
    year: '1980',
    size: 5128453
  },
  {
    locale: 'de-DE',
    title: 'Revidierte Elberfelder',
    symbol: 'ELB',
    comments: false,
    strong: false,
    year: '1993',
    size: 4652290
  },
  {
    locale: 'de-DE',
    title: 'Unrevidierte Elberfelder',
    symbol: 'ELO',
    comments: false,
    strong: false,
    year: '1905',
    size: 4627731
  },
  {
    locale: 'de-DE',
    title: 'Herder',
    symbol: 'HRD',
    comments: false,
    strong: false,
    year: '2005',
    size: 5144484
  },
  {
    locale: 'de-DE',
    title: 'Luther',
    symbol: 'L45',
    comments: false,
    strong: false,
    year: '1545',
    size: 4390521
  },
  {
    locale: 'de-DE',
    title: 'Schlachter',
    symbol: 'SCH',
    comments: false,
    strong: false,
    year: '1951',
    size: 4541157
  },
  {
    locale: 'de-DE',
    title: 'Zürcher Bibel',
    symbol: 'ZUR',
    comments: false,
    strong: false,
    year: '2007/2008',
    size: 4593825
  },
  {
    locale: 'el-GR',
    title: 'Byzantine/Majority Text',
    symbol: 'GNT-BIZ',
    comments: false,
    strong: true,
    year: '2000',
    size: 3401225
  },
  {
    locale: 'el-GR',
    title: 'Tischendorf 8th Ed.',
    symbol: 'GNT-TIS',
    comments: false,
    strong: false,
    year: '1869-1872',
    size: 1771919
  },
  {
    locale: 'el-GR',
    title: 'Textus Receptus',
    symbol: 'GNT-TR',
    comments: false,
    strong: true,
    year: '1550/1894',
    size: 3319431
  },
  {
    locale: 'el-GR',
    title: 'LXX Septuaginta (Alfred Rahlfs)',
    symbol: 'LXT',
    comments: false,
    strong: false,
    year: '1935',
    size: 7825872
  },
  {
    locale: 'en-US',
    title: 'Apostolic Bible Polyglot',
    symbol: 'ABP',
    comments: false,
    strong: true,
    year: '1996,2013',
    size: 12587919
  },
  {
    locale: 'en-US',
    title: 'American Standard Version',
    symbol: 'ASV',
    comments: false,
    strong: false,
    year: '1901',
    size: 4446300
  },
  {
    locale: 'en-US',
    title: 'The Bible in Basic Lang',
    symbol: 'BBE',
    comments: false,
    strong: false,
    year: '1949/64',
    size: 4471145
  },
  {
    locale: 'en-US',
    title: 'The Complete Jewish Bible',
    symbol: 'CJB',
    comments: false,
    strong: false,
    year: '1998',
    size: 4294653
  },
  {
    locale: 'en-US',
    title: 'Holman Christian Standard Bible',
    symbol: 'CSB',
    comments: false,
    strong: true,
    year: '2004',
    size: 9345767
  },
  {
    locale: 'en-US',
    title: 'The Darby Bible',
    symbol: 'DBY',
    comments: false,
    strong: false,
    year: '1884/90',
    size: 4404349
  },
  {
    locale: 'en-US',
    title: 'Emphatic Diaglott [NT]',
    symbol: 'DIAGLOTT',
    comments: false,
    strong: false,
    year: '1864',
    size: 1061042
  },
  {
    locale: 'en-US',
    title: 'The Douay-Rheims American Edition',
    symbol: 'DRA',
    comments: false,
    strong: false,
    year: '1899',
    size: 4984794
  },
  {
    locale: 'en-US',
    title: 'English Revised Version',
    symbol: 'ERV',
    comments: false,
    strong: false,
    year: '1885',
    size: 4455043
  },
  {
    locale: 'en-US',
    title: 'English Standard Version',
    symbol: 'ESV',
    comments: false,
    strong: false,
    year: '2016',
    size: 4246152
  },
  {
    locale: 'en-US',
    title: 'Geneva Bible',
    symbol: 'GNV',
    comments: false,
    strong: false,
    year: '1599',
    size: 4479950
  },
  {
    locale: 'en-US',
    title: 'God\'s Word Translation',
    symbol: 'GWN',
    comments: false,
    strong: false,
    year: '1995',
    size: 4225336
  },
  {
    locale: 'en-US',
    title: 'Jewish Publication Society [OT]',
    symbol: 'JPS',
    comments: false,
    strong: false,
    year: '1917',
    size: 3446369
  },
  {
    locale: 'en-US',
    title: 'King James Version',
    symbol: 'KJV',
    comments: false,
    strong: true,
    year: '1611/1769',
    size: 9574539
  },
  {
    locale: 'en-US',
    title: 'Lexham English Bible',
    symbol: 'LEB',
    comments: false,
    strong: false,
    year: '2012',
    size: 4431646
  },
  {
    locale: 'en-US',
    title: 'Brenton LXX with Apocrypha',
    symbol: 'LXA',
    comments: false,
    strong: false,
    year: '1851',
    size: 4203540
  },
  {
    locale: 'en-US',
    title: 'The New American Bible',
    symbol: 'NAB',
    comments: false,
    strong: false,
    year: '2011',
    size: 4715629
  },
  {
    locale: 'en-US',
    title: 'New American Standard Bible',
    symbol: 'NAU',
    comments: false,
    strong: true,
    year: '1995',
    size: 8978964
  },
  {
    locale: 'en-US',
    title: 'New English Translation',
    symbol: 'NET',
    comments: false,
    strong: false,
    year: '2005',
    size: 4322996
  },
  {
    locale: 'en-US',
    title: 'New International Reader\'s Version',
    symbol: 'NIRV',
    comments: false,
    strong: false,
    year: '1996',
    size: 4726176
  },
  {
    locale: 'en-US',
    title: 'New International Version (US)',
    symbol: 'NIV',
    comments: false,
    strong: false,
    year: '2011',
    size: 4156515
  },
  {
    locale: 'en-US',
    title: 'New International Version',
    symbol: 'NIVO',
    comments: false,
    strong: false,
    year: '1984',
    size: 4134022
  },
  {
    locale: 'en-US',
    title: 'New Jerusalem Bible',
    symbol: 'NJB',
    comments: false,
    strong: false,
    year: '1985',
    size: 4805988
  },
  {
    locale: 'en-US',
    title: 'New King James Version',
    symbol: 'NKJ',
    comments: false,
    strong: true,
    year: '1982',
    size: 8842479
  },
  {
    locale: 'en-US',
    title: 'New Living Translation',
    symbol: 'NLT',
    comments: false,
    strong: false,
    year: '1996',
    size: 4327639
  },
  {
    locale: 'en-US',
    title: 'New Revised Standard Version',
    symbol: 'NRS',
    comments: false,
    strong: false,
    year: '1989',
    size: 5160803
  },
  {
    locale: 'en-US',
    title: 'New World Translation',
    symbol: 'NWT',
    comments: false,
    strong: false,
    year: '1961',
    size: 4935336
  },
  {
    locale: 'en-US',
    title: 'Revised Standard Version',
    symbol: 'RSV',
    comments: false,
    strong: false,
    year: '1952',
    size: 5119230
  },
  {
    locale: 'en-US',
    title: 'Today\'s New International Version',
    symbol: 'TNIV',
    comments: false,
    strong: false,
    year: '2005',
    size: 4156745
  },
  {
    locale: 'en-US',
    title: 'Young\'s Literal Translation',
    symbol: 'YLT',
    comments: false,
    strong: false,
    year: '1862/98',
    size: 4454632
  },
  {
    locale: 'eo',
    title: 'Esperanto Bible',
    symbol: 'ESP',
    comments: false,
    strong: false,
    year: '',
    size: 4157137
  },
  {
    locale: 'es-ES',
    title: 'La Biblia de Nuestro Pueblo (Alonso translation)',
    symbol: 'BNP',
    comments: false,
    strong: false,
    year: '',
    size: 4459963
  },
  {
    locale: 'es-ES',
    title: 'Castilian Bible Version',
    symbol: 'CAB',
    comments: false,
    strong: false,
    year: '2003',
    size: 4841464
  },
  {
    locale: 'es-ES',
    title: 'La Biblia de Las Americas',
    symbol: 'LBA',
    comments: false,
    strong: false,
    year: '1986',
    size: 4352836
  },
  {
    locale: 'es-ES',
    title: 'Nueva Biblia de Los Hispanos',
    symbol: 'NBH',
    comments: false,
    strong: false,
    year: '',
    size: 4371463
  },
  {
    locale: 'es-ES',
    title: 'La Nueva Versión Internacional',
    symbol: 'NVI',
    comments: false,
    strong: false,
    year: '1979',
    size: 4327098
  },
  {
    locale: 'es-ES',
    title: 'Reina-Valera Revised',
    symbol: 'R60',
    comments: false,
    strong: false,
    year: '1960',
    size: 4225423
  },
  {
    locale: 'es-ES',
    title: 'Reina-Valera Update',
    symbol: 'R95',
    comments: false,
    strong: false,
    year: '1995',
    size: 4250479
  },
  {
    locale: 'es-ES',
    title: 'Reina-Valera Actualizada',
    symbol: 'RVA',
    comments: false,
    strong: false,
    year: '1989',
    size: 4344622
  },
  {
    locale: 'es-ES',
    title: 'Reina Valera Gomez Spanish Translation',
    symbol: 'RVG',
    comments: false,
    strong: false,
    year: '',
    size: 4253210
  },
  {
    locale: 'es-ES',
    title: 'Reina-Valera',
    symbol: 'SRV',
    comments: false,
    strong: false,
    year: '1909',
    size: 4235449
  },
  {
    locale: 'fi-FI',
    title: 'Raamattu käännös',
    symbol: 'FIN',
    comments: false,
    strong: false,
    year: '1933/1938',
    size: 4536407
  },
  {
    locale: 'fr-FR',
    title: 'French Bible en français courant',
    symbol: 'BFC',
    comments: false,
    strong: false,
    year: '1997',
    size: 5542552
  },
  {
    locale: 'fr-FR',
    title: 'French Version Darby',
    symbol: 'DRB',
    comments: false,
    strong: false,
    year: '1885',
    size: 4620552
  },
  {
    locale: 'fr-FR',
    title: 'French Bible Jerusalem',
    symbol: 'FBJ',
    comments: false,
    strong: false,
    year: '',
    size: 5017114
  },
  {
    locale: 'fr-FR',
    title: 'French Louis Segond',
    symbol: 'LSG',
    comments: false,
    strong: false,
    year: '1910',
    size: 4525370
  },
  {
    locale: 'fr-FR',
    title: 'Nouvelle Edition Geneve with Codes',
    symbol: 'NEG',
    comments: false,
    strong: false,
    year: '1979',
    size: 4528310
  },
  {
    locale: 'fr-FR',
    title: 'French Traduction Oecuménique de la Bible',
    symbol: 'TOB',
    comments: false,
    strong: false,
    year: '1988',
    size: 5173036
  },
  {
    locale: 'he-IL',
    title: 'Biblia Hebraica Stuttgartensia',
    symbol: 'BHS',
    comments: false,
    strong: true,
    year: '',
    size: 6911307
  },
  {
    locale: 'he-IL',
    title: 'Westminster Leningrad Codex',
    symbol: 'WLC',
    comments: false,
    strong: false,
    year: '',
    size: 5070665
  },
  {
    locale: 'hr-HR',
    title: 'Croatian Bible',
    symbol: 'CRO',
    comments: false,
    strong: false,
    year: '',
    size: 4269234
  },
  {
    locale: 'hu-HU',
    title: 'Károli',
    symbol: 'HUN',
    comments: false,
    strong: false,
    year: '1993',
    size: 4489950
  },
  {
    locale: 'it-IT',
    title: 'San Paolo Edizione NVB',
    symbol: 'IEP',
    comments: false,
    strong: false,
    year: '1995',
    size: 4801943
  },
  {
    locale: 'it-IT',
    title: 'Nuova Diodati',
    symbol: 'LND',
    comments: false,
    strong: false,
    year: '1991',
    size: 4403282
  },
  {
    locale: 'it-IT',
    title: 'Nuova Riveduta',
    symbol: 'NRV',
    comments: false,
    strong: false,
    year: '1994',
    size: 4364811
  },
  {
    locale: 'la',
    title: 'Nova Vulgata',
    symbol: 'NOV',
    comments: false,
    strong: false,
    year: '1986',
    size: 4399116
  },
  {
    locale: 'la',
    title: 'Vulgata Clementina',
    symbol: 'VUC',
    comments: false,
    strong: false,
    year: '1598',
    size: 4384354
  },
  {
    locale: 'lt-LT',
    title: 'Lithuanian Version',
    symbol: 'LTB',
    comments: false,
    strong: false,
    year: '1994',
    size: 3755166
  },
  {
    locale: 'nl-NL',
    title: 'Leidse Vertaling',
    symbol: 'LEI',
    comments: false,
    strong: false,
    year: '1912/94',
    size: 4297778
  },
  {
    locale: 'nl-NL',
    title: 'Lutherse Vertaling',
    symbol: 'LUV',
    comments: false,
    strong: false,
    year: '1750/1933/1994',
    size: 4379106
  },
  {
    locale: 'nl-NL',
    title: 'The Netherlands Bible Society',
    symbol: 'NBG',
    comments: false,
    strong: false,
    year: '1951',
    size: 4438895
  },
  {
    locale: 'nl-NL',
    title: 'Statenvertaling with Codes [Strong]',
    symbol: 'SVV',
    comments: false,
    strong: true,
    year: '1637',
    size: 9622215
  },
  {
    locale: 'pl-PL',
    title: 'Biblia Brzeska',
    symbol: 'BB',
    comments: false,
    strong: false,
    year: '1563',
    size: 1014150
  },
  {
    locale: 'pl-PL',
    title: 'Biblia Gdańska',
    symbol: 'BG',
    comments: false,
    strong: false,
    year: '1632',
    size: 4300222
  },
  {
    locale: 'pl-PL',
    title: 'Nowa Biblia Gdańska',
    symbol: 'BGN',
    comments: false,
    strong: false,
    year: '1632/2012',
    size: 4321950
  },
  {
    locale: 'pl-PL',
    title: 'Biblia Poznańska',
    symbol: 'BP',
    comments: false,
    strong: false,
    year: '1975',
    size: 4887545
  },
  {
    locale: 'pl-PL',
    title: 'Biblia Warszawsko-Praska',
    symbol: 'BR',
    comments: false,
    strong: false,
    year: '1975/1997',
    size: 5343211
  },
  {
    locale: 'pl-PL',
    title: 'Biblia Tysiąclecia II',
    symbol: 'BT2',
    comments: false,
    strong: false,
    year: '1971',
    size: 4201648
  },
  {
    locale: 'pl-PL',
    title: 'Biblia Tysiąclecia IV',
    symbol: 'BT4',
    comments: false,
    strong: false,
    year: '1983',
    size: 4812323
  },
  {
    locale: 'pl-PL',
    title: 'Biblia Tysiąclecia V',
    symbol: 'BT5',
    comments: true,
    strong: false,
    year: '1999',
    size: 5019010
  },
  {
    locale: 'pl-PL',
    title: 'Biblia Warszawska',
    symbol: 'BW',
    comments: false,
    strong: false,
    year: '1975',
    size: 4252099
  },
  {
    locale: 'pl-PL',
    title: 'Biblia Bydgoska - Przekład Filologiczny',
    symbol: 'BYD',
    comments: false,
    strong: false,
    year: '2024',
    size: 3155127
  },
  {
    locale: 'pl-PL',
    title: 'Przekłady Izaaka Cylkowa',
    symbol: 'CYL',
    comments: false,
    strong: false,
    year: '1883-1914',
    size: 1043788
  },
  {
    locale: 'pl-PL',
    title: 'Dąbrowski [NT]',
    symbol: 'DAB',
    comments: false,
    strong: false,
    year: '1949',
    size: 986988
  },
  {
    locale: 'pl-PL',
    title: 'Biblia Ekumeniczna',
    symbol: 'EKU',
    comments: false,
    strong: false,
    year: '2018',
    size: 4628063
  },
  {
    locale: 'pl-PL',
    title: 'Ekumeniczny Przekład Przyjaciół',
    symbol: 'EPP',
    comments: false,
    strong: false,
    year: '2016',
    size: 979814
  },
  {
    locale: 'pl-PL',
    title: 'Kowalski [NT]',
    symbol: 'KOW',
    comments: false,
    strong: false,
    year: '1956',
    size: 1061997
  },
  {
    locale: 'pl-PL',
    title: 'Biblia Lubelska',
    symbol: 'LUB',
    comments: false,
    strong: false,
    year: '1998-2010',
    size: 3802169
  },
  {
    locale: 'pl-PL',
    title: 'Pięcioksiąg Mojżesza - J. Mieses',
    symbol: 'MIESES',
    comments: false,
    strong: false,
    year: '1931',
    size: 912369
  },
  {
    locale: 'pl-PL',
    title: 'Nowy Przekład Dynamiczny NT',
    symbol: 'NPD',
    comments: true,
    strong: false,
    year: '2021-2023',
    size: 1488742
  },
  {
    locale: 'pl-PL',
    title: 'Przekład Nowego Świata',
    symbol: 'NWT-PL',
    comments: false,
    strong: false,
    year: '1994',
    size: 4637304
  },
  {
    locale: 'pl-PL',
    title: 'Biblia Paulistów',
    symbol: 'PAU',
    comments: false,
    strong: false,
    year: '2016',
    size: 4806627
  },
  {
    locale: 'pl-PL',
    title: 'Hebrajska Tora (rabin Seacha Pecaric)',
    symbol: 'PEC',
    comments: false,
    strong: false,
    year: '2001/2006',
    size: 907950
  },
  {
    locale: 'pl-PL',
    title: 'Popowski [NT]',
    symbol: 'POP',
    comments: false,
    strong: false,
    year: '2000',
    size: 906983
  },
  {
    locale: 'pl-PL',
    title: 'Słowo Życia',
    symbol: 'PSZ',
    comments: false,
    strong: false,
    year: '1989',
    size: 1016400
  },
  {
    locale: 'pl-PL',
    title: 'NT Rakowski',
    symbol: 'RAK',
    comments: false,
    strong: false,
    year: '1606',
    size: 993856
  },
  {
    locale: 'pl-PL',
    title: 'EIB Przekład Literacki',
    symbol: 'SNP',
    comments: true,
    strong: false,
    year: '2018',
    size: 4436300
  },
  {
    locale: 'pl-PL',
    title: 'EIB Przekład Dosłowny',
    symbol: 'SNPD',
    comments: false,
    strong: false,
    year: '2021',
    size: 4302990
  },
  {
    locale: 'pl-PL',
    title: 'EIB Przekład Dosłowny',
    symbol: 'SNPD4',
    comments: true,
    strong: false,
    year: '2024',
    size: 4825111
  },
  {
    locale: 'pl-PL',
    title: 'Przekład Żydowski (David H. Stern) [NT]',
    symbol: 'STERN',
    comments: false,
    strong: false,
    year: '',
    size: 1071401
  },
  {
    locale: 'pl-PL',
    title: 'Przekład Toruński',
    symbol: 'TNP',
    comments: true,
    strong: false,
    year: '2023',
    size: 2199112
  },
  {
    locale: 'pl-PL',
    title: 'Textus Receptus Oblubienicy',
    symbol: 'TRO',
    comments: false,
    strong: true,
    year: '',
    size: 5931594
  },
  {
    locale: 'pl-PL',
    title: 'Uspółcześniona Biblia Gdańska',
    symbol: 'UBG',
    comments: false,
    strong: false,
    year: '2017',
    size: 4265578
  },
  {
    locale: 'pl-PL',
    title: 'Współczesny Przekład',
    symbol: 'WSP',
    comments: false,
    strong: false,
    year: '1991',
    size: 1025161
  },
  {
    locale: 'pl-PL',
    title: 'Biblia Wujka',
    symbol: 'WUJ',
    comments: false,
    strong: false,
    year: '1599',
    size: 4054920
  },
  {
    locale: 'pt-BR',
    title: 'Portuguese Corrigida Fiel',
    symbol: 'ACF',
    comments: false,
    strong: false,
    year: '1753/1995',
    size: 4220406
  },
  {
    locale: 'pt-BR',
    title: 'Portuguese Almeida Revista e Atualizada',
    symbol: 'ARA',
    comments: false,
    strong: false,
    year: '1993',
    size: 4189745
  },
  {
    locale: 'pt-BR',
    title: 'Portuguese Almeida Biblia',
    symbol: 'BRP',
    comments: false,
    strong: false,
    year: '1994',
    size: 4225051
  },
  {
    locale: 'pt-BR',
    title: 'Portuguese Modern Lang Translation',
    symbol: 'SBP',
    comments: false,
    strong: false,
    year: '2005',
    size: 4333578
  },
  {
    locale: 'ru-RU',
    title: 'Contemporary Russian Version',
    symbol: 'CRV',
    comments: false,
    strong: false,
    year: '2011',
    size: 4051973
  },
  {
    locale: 'ru-RU',
    title: 'New World Translation (Russian)',
    symbol: 'NWT-RU',
    comments: false,
    strong: false,
    year: '',
    size: 1598644
  },
  {
    locale: 'ru-RU',
    title: 'Russion Synodal Orthodox Version',
    symbol: 'RST',
    comments: false,
    strong: true,
    year: '',
    size: 10885026
  },
  {
    locale: 'sk-SK',
    title: 'Sväté Písmo (Slovak)',
    symbol: 'SSV',
    comments: false,
    strong: false,
    year: '1995',
    size: 4473348
  },
  {
    locale: 'sv-SE',
    title: 'Swedish Bibel',
    symbol: 'S00',
    comments: false,
    strong: false,
    year: '2000',
    size: 4653708
  },
  {
    locale: 'sv-SE',
    title: 'Swedish',
    symbol: 'S17',
    comments: false,
    strong: false,
    year: '1917',
    size: 4560078
  },
  {
    locale: 'sv-SE',
    title: 'Swedish Bibel 82',
    symbol: 'S82',
    comments: false,
    strong: false,
    year: '',
    size: 4411435
  },
  {
    locale: 'sv-SE',
    title: 'Svenska Folkbibeln 98',
    symbol: 'SFB',
    comments: false,
    strong: false,
    year: '',
    size: 4237245
  },
  {
    locale: 'uk-UA',
    title: 'Ukrainian',
    symbol: 'UKR',
    comments: false,
    strong: false,
    year: '',
    size: 6419529
  }
]

export const supportedLanguageSymbols: LanguageSymbol[] = ['en', 'pl']

// Check the uniqueness of symbols and names
