/**
 * Bible book metadata - names, abbreviations, and chapter counts
 * Framework-agnostic - no browser/Vue dependencies
 */

/**
 * OSIS book codes (standard identifiers)
 */
export const osisBooks = [
  'Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth',
  '1Sam', '2Sam', '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh',
  'Esth', 'Job', 'Ps', 'Prov', 'Eccl', 'Song', 'Isa', 'Jer',
  'Lam', 'Ezek', 'Dan', 'Hos', 'Joel', 'Amos', 'Obad', 'Jonah',
  'Mic', 'Nah', 'Hab', 'Zeph', 'Hag', 'Zech', 'Mal', 'Matt',
  'Mark', 'Luke', 'John', 'Acts', 'Rom', '1Cor', '2Cor', 'Gal',
  'Eph', 'Phil', 'Col', '1Thess', '2Thess', '1Tim', '2Tim', 'Titus',
  'Phlm', 'Heb', 'Jas', '1Pet', '2Pet', '1John', '2John', '3John',
  'Jude', 'Rev',
  // Apocrypha
  'Jdt', 'Tob', '1Macc', '2Macc', 'Wis', 'Sir', 'Bar'
] as const

/**
 * Full English book names
 */
export const fullEnglishBooks = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew',
  'Mark', 'Luke', 'John', 'Acts', 'Romans',
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians',
  'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
  'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter',
  '2 Peter', '1 John', '2 John', '3 John', 'Jude',
  'Revelation',
  // Apocrypha
  'Judith', 'Tobith', '1 Maccabees', '2 Maccabees', 'Wisdom', 'Sirah', 'Baruch'
] as const

/**
 * Full Polish book names
 */
export const fullPolishBooks = [
  'Rodzaju', 'Wyjścia', 'Kapłańska', 'Liczb', 'Powtórzonego Prawa',
  'Jozuego', 'Sędziów', 'Rut', '1 Samuela', '2 Samuela',
  '1 Królewska', '2 Królewska', '1 Kronik', '2 Kronik', 'Ezdrasza',
  'Nehemiasza', 'Estery', 'Hioba', 'Psalmy', 'Przypowieści',
  'Pieśń nad Pieśniami', 'Kaznodziei', 'Izajasza', 'Jeremiasza', 'Lamentacje',
  'Ezechiela', 'Daniela', 'Ozeasza', 'Joela', 'Amosa',
  'Abdiasza', 'Jonasza', 'Micheasza', 'Nahuma', 'Habakuka',
  'Sofoniasza', 'Aggeusza', 'Zachariasza', 'Malachiasza', 'Mateusza',
  'Marka', 'Łukasza', 'Jana', 'Dzieje Apostolskie', 'List do Rzymian',
  '1 List do Koryntian', '2 List do Koryntian', 'List do Galatów', 'List do Efezjan', 'List do Filipian',
  'List do Kolosan', '1 List do Tesaloniczan', '2 List do Tesaloniczan', '1 List do Tymoteusza', '2 List do Tymoteusza',
  'List do Tytusa', 'List do Filemona', 'List do Hebrajczyków', 'List Jakuba', '1 List Piotra',
  '2 List Piotra', '1 List Jana', '2 List Jana', '3 List Jana', 'List Judy',
  'Objawienie Jana'
] as const

/**
 * Book abbreviations by language
 */
export const bookAbbreviations = {
  pl: [
    '1 Moj', '2 Moj', '3 Moj', '4 Moj', '5 Moj', 'Joz', 'Sdz', 'Rut',
    '1 Sam', '2 Sam', '1 Krl', '2 Krl', '1 Krn', '2 Krn', 'Ezd', 'Ne',
    'Est', 'Job', 'Ps', 'Prz', 'Kz', 'Pnp', 'Iz', 'Jr',
    'Tr', 'Ez', 'Dn', 'Oz', 'Jl', 'Am', 'Ab', 'Jon',
    'Mi', 'Na', 'Ha', 'So', 'Ag', 'Za', 'Ml', 'Mt',
    'Mr', 'Łk', 'Jn', 'Dz', 'Rz', '1 Kor', '2 Kor', 'Ga',
    'Ef', 'Flp', 'Kol', '1 Tes', '2 Tes', '1 Tm', '2 Tm', 'Tt',
    'Flm', 'Hbr', 'Jk', '1 Pt', '2 Pt', '1 Jn', '2 Jn', '3 Jn',
    'Jud', 'Obj',
    // Apocrypha
    'Jdt', 'Tob', '1Ma', '2Ma', 'Mdr', 'Syr', 'Bar'
  ],
  en: [
    'Gen', 'Exo', 'Lev', 'Num', 'Deu', 'Jos', 'Jdg', 'Rth',
    '1Sa', '2Sa', '1Ki', '2Ki', '1Ch', '2Ch', 'Ezr', 'Neh',
    'Est', 'Job', 'Psa', 'Pro', 'Ecc', 'Son', 'Isa', 'Jer',
    'Lam', 'Eze', 'Dan', 'Hos', 'Joe', 'Amo', 'Oba', 'Jon',
    'Mic', 'Nah', 'Hab', 'Zep', 'Hag', 'Zec', 'Mal', 'Mat',
    'Mar', 'Luk', 'Joh', 'Act', 'Rom', '1Co', '2Co', 'Gal',
    'Eph', 'Phi', 'Col', '1Th', '2Th', '1Ti', '2Ti', 'Tit',
    'Phm', 'Heb', 'Jas', '1Pe', '2Pe', '1Jo', '2Jo', '3Jo',
    'Jud', 'Rev'
  ]
} as const

/**
 * Number of chapters per book (canonical books only)
 */
export const chapterCounts = [
  50, 40, 27, 36, 34, 24, 21, 4, 31, 24,
  22, 25, 29, 36, 10, 13, 10, 42, 150, 31,
  12, 8, 66, 52, 5, 48, 12, 14, 3, 9,
  1, 4, 7, 3, 3, 3, 2, 14, 3, 28,
  16, 24, 21, 28, 16, 16, 13, 6, 6, 4,
  4, 5, 3, 6, 4, 3, 1, 13, 5, 5,
  3, 5, 1, 1, 1, 22
] as const

/**
 * Total number of canonical books (excluding Apocrypha)
 */
export const CANONICAL_BOOK_COUNT = 66

/**
 * Total number of books including Apocrypha
 */
export const TOTAL_BOOK_COUNT = osisBooks.length

/**
 * Get the OSIS code for a book by index
 */
export function getOsisCode(bookIndex: number): string | undefined {
  return osisBooks[bookIndex]
}

/**
 * Get the book index from an OSIS code
 */
export function getBookIndexFromOsis(osisCode: string): number {
  return osisBooks.indexOf(osisCode as typeof osisBooks[number])
}

/**
 * Get the chapter count for a book
 */
export function getChapterCountForBook(bookIndex: number): number {
  return chapterCounts[bookIndex] || 0
}

/**
 * Check if a book is apocryphal
 */
export function isApocryphal(bookIndex: number): boolean {
  return bookIndex >= CANONICAL_BOOK_COUNT
}

/**
 * Combined books data object for backward compatibility
 */
export const books = {
  osis: osisBooks,
  fullEnglish: fullEnglishBooks,
  fullPolish: fullPolishBooks,
  bookAbbreviations,
  chapterCount: chapterCounts,
}

export default books
