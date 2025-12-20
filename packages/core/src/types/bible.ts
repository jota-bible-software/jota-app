/**
 * Bible data types - framework-agnostic
 */

/**
 * A passage reference as a tuple: [bookIndex, chapterIndex, startVerse?, endVerse?]
 * All indices are 0-based internally
 */
export type Passage = [number, number, number?, number?]

/**
 * A passage with all verse indices defined (for highlights)
 */
export type PassageComplete = [number, number, number, number]

/**
 * Bible translation data format identifier
 */
export type TranslationDataFormat = '3d-array' | 'map'

/**
 * Legacy 3D array format: books > chapters > verses
 */
export type TranslationContentArray = string[][][]

/**
 * Map format with numbered keys for books/chapters/verses
 */
export type TranslationContentMap = {
  [bookNumber: number]: {
    [chapterNumber: number]: {
      [verseNumber: number]: string
    }
  }
}

/**
 * Union type for Bible translation content
 */
export type TranslationContent = TranslationContentArray | TranslationContentMap

/**
 * Metadata included in translation files
 */
export type TranslationFileMeta = {
  name: string
  abbreviation: string
  locale: string
  year?: string
  bookNames?: string[]
  bookOrder?: string
  dataFormat: TranslationDataFormat
  created?: string
  modified?: string
}

/**
 * Complete translation file structure
 */
export type TranslationFile = {
  meta: TranslationFileMeta
  data: TranslationContent
}

/**
 * Translation identifier
 */
export type TranslationKey = {
  locale: string
  symbol: string
}

/**
 * Translation metadata for display
 */
export type TranslationMeta = TranslationKey & {
  title: string
  size: number
  year?: string
  bookNames?: string
  bookOrder?: string
}

/**
 * Book naming configuration
 */
export type BookNaming = {
  name: string
  books: string[]
  booksText?: string
}

/**
 * Book naming with locale
 */
export type BookNamingV2 = BookNaming & {
  locale: string
}
