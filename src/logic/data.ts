import { CopyTemplateData, FormatTemplateData, LanguageSymbol, LocaleSymbol, TranslationContent, TranslationMeta } from 'src/types'

export const languageData: Array<{ symbol: LanguageSymbol, name: string }> = [
  {
    symbol: 'en',
    name: 'English'
  },
  {
    symbol: 'pl',
    name: 'Polski'
  },
]

export const localeData: Array<{ symbol: LocaleSymbol, langName: string, regionName: string }> = [
  {
    symbol: 'en-US',
    langName: 'English',
    regionName: 'United States'
  },
  {
    symbol: 'es-ES',
    langName: 'Español',
    regionName: 'España'
  },
  {
    symbol: 'pl-PL',
    langName: 'Polski',
    regionName: 'Polska'
  },
  {
    symbol: 'pt-PT',
    langName: 'Português',
    regionName: 'Portugal'
  },
  {
    symbol: 'uk-UA',
    langName: 'Українська',
    regionName: 'Україна'
  }
]

export const bookNamings = [
  {
    lang: 'en',
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
      'Wisdom of Solomon',
      'Sirach (Ecclesiasticus)',
      'Baruch',
      '1 Maccabees',
      '2 Maccabees',
      'Additions to Esther',
      'Additions to Daniel'
    ]
  },
  {
    // Source: https://guide.unwsp.edu/c.php?g=1321431&p=9721749
    lang: 'en',
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
    lang: 'en',
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
    lang: 'pl',
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
    lang: 'pl',
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
    lang: 'pl',
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
    lang: 'pl',
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
    lang: 'pl',
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
    lang: 'pl',
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
    lang: 'pl',
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
    lang: 'pl',
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
    lang: 'pl',
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
]

export const defaultBookNames = {
  en: 'Standard',
  pl: 'EIB skrócone',
}

export const appBookAbbreviations = {
  en: 'SBL abbreviations',
  pl: 'BT skróty',
}

export const copyTemplates: CopyTemplateData[] = [
  {
    name: 'Prezentacja',
    lang: {
      en: {
        formatTemplate: 'English presentation',
        bookNaming: 'Standard'
      },
      pl: {
        formatTemplate: 'Polska prezentacja',
        bookNaming: 'EIB skrócone'
      }
    }
  },
  {
    name: 'Studium',
    lang: {
      en: {
        formatTemplate: 'Studium',
        bookNaming: 'SBL abbreviations'
      },
      pl: {
        formatTemplate: 'Studium',
        bookNaming: 'Moje pl'
      }
    }
  }
]

export const formatTemplates: FormatTemplateData[] = [
  {
    name: 'App format',
    referencePosition: 'before',
    referenceLine: 'same line',
    translationAbbreviation: 'none',
    numbers: false,
    verseNewLine: false,
    separatorChar: ':',
    rangeChar: '-',
    referenceCharsBefore: '',
    referenceCharsAfter: '',
    quoteCharsBefore: '',
    quoteCharsAfter: '',
    verseNumberCharsBefore: '',
    verseNumberCharsAfter: '',
    translationAbbreviationCharsBefore: '',
    translationAbbreviationCharsAfter: '',
  },
  {
    name: 'English presentation',
    referencePosition: 'after',
    referenceLine: 'new line',
    translationAbbreviation: 'uppercase',
    numbers: false,
    verseNewLine: false,
    separatorChar: ':',
    rangeChar: '-',
    referenceCharsBefore: '',
    referenceCharsAfter: '',
    quoteCharsBefore: '',
    quoteCharsAfter: '',
    verseNumberCharsBefore: '',
    verseNumberCharsAfter: '',
    translationAbbreviationCharsBefore: '',
    translationAbbreviationCharsAfter: '',
  },
  {
    name: 'Polska prezentacja',
    referencePosition: 'after',
    referenceLine: 'new line',
    translationAbbreviation: 'uppercase',
    numbers: false,
    verseNewLine: false,
    separatorChar: ',',
    rangeChar: '-',
    referenceCharsBefore: '',
    referenceCharsAfter: '',
    quoteCharsBefore: '',
    quoteCharsAfter: '',
    verseNumberCharsBefore: '',
    verseNumberCharsAfter: '',
    translationAbbreviationCharsBefore: '',
    translationAbbreviationCharsAfter: '',
  },
  {
    name: 'Studium',
    referencePosition: 'before',
    referenceLine: 'new line',
    translationAbbreviation: 'uppercase',
    numbers: true,
    verseNewLine: false,
    separatorChar: ':',
    rangeChar: '-',
    referenceCharsBefore: '– ',
    referenceCharsAfter: '',
    quoteCharsBefore: '',
    quoteCharsAfter: '',
    verseNumberCharsBefore: '(',
    verseNumberCharsAfter: ')',
    translationAbbreviationCharsBefore: '',
    translationAbbreviationCharsAfter: ''
  },
]

export function getBookNames(lang: LanguageSymbol, name: string): string[] {
  const found = bookNamings.find(it => it.lang === lang && it.name === name)
  return found && found.books || []
}

export const bookOrder = {
  pl: {
    bt5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 66, 67, 16, 68, 69, 17, 18, 19, 20, 21, 70, 71, 22, 23, 24, 72, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65]
  }
}

const enTranslationContent: TranslationContent = []
enTranslationContent[42] = [[
  'In the beginning the Word already existed. The Word was with God, and the Word was God.',
  'He existed in the beginning with God.',
  'God created everything through him, and nothing was created except through him.']]

const plTranslationContent: TranslationContent = []
plTranslationContent[42] = [[
  'Na początku było Słowo, a Słowo było u Boga i Bogiem było Słowo.',
  'Ono było na początku u Boga.',
  'Wszystko przez nie się stało, a bez niego nic się nie stało, co się stało.'
]]

export const translationSamples = {
  en: enTranslationContent,
  pl: plTranslationContent
}

/*
The format of translations:
{
  title: '',
  symbol: '',
  bookNames: 'katolicki',
}
If 'bookNames' is not specified, then it will be taken from bookNames[lang].default
*/

export const translations: TranslationMeta[] = [
  {
    lang: 'en',
    title: 'King James Version',
    symbol: 'KJV',
    size: 4_472_372,
  },
  {
    lang: 'en',
    title: 'New International Version',
    symbol: 'NIV',
    size: 3_902_640,
  },
  {
    title: 'New Living Translation',
    lang: 'en',
    symbol: 'NLT',
    size: 4_097_509,
  },

  {
    title: 'Biblia Ewangeliczna',
    symbol: 'EIB',
    lang: 'pl',
    size: 4_104_753,
    year: '2016',
    bookNames: 'protestancki',
  },
  {
    title: 'Biblia Tysiąclecia V',
    symbol: 'BT5',
    lang: 'pl',
    size: 4_552_494,
    year: '2000',
    bookOrder: 'bt5',
  },
  {
    title: 'Biblia Warszawska (brytyjka)',
    symbol: 'BW',
    lang: 'pl',
    size: 4_024_215,
    year: '1975',
    bookNames: 'bw pełne',
  },
  {
    title: 'Uwspółcześniona Biblia Gdańska',
    symbol: 'UBG',
    lang: 'pl',
    size: 3_962_719,
    year: '2017',
    bookNames: 'protestancki',
  },
]

export const translationMeta = translations

export const supportedLanguageSymbols: LanguageSymbol[] = ['en', 'pl']


// Check the uniqueness of symbols and names

