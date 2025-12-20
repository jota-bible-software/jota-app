/**
 * Bible module - data access and book metadata
 */

// Translation utilities
export {
  isArrayFormat,
  isMapFormat,
  getVerse,
  getChapter,
  getBook,
  getBookCount,
  getChapterCount,
  getVerseCount,
  toArrayFormat,
  toMapFormat,
} from './translation-utils'

// Book metadata
export {
  osisBooks,
  fullEnglishBooks,
  fullPolishBooks,
  bookAbbreviations,
  chapterCounts,
  CANONICAL_BOOK_COUNT,
  TOTAL_BOOK_COUNT,
  getOsisCode,
  getBookIndexFromOsis,
  getChapterCountForBook,
  isApocryphal,
  books,
} from './books'
