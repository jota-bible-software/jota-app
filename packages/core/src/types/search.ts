/**
 * Search-related types - framework-agnostic
 */

/**
 * Search configuration options
 */
export type SearchOptions = {
  /** Include apocryphal books in search */
  apocrypha?: boolean
  /** Sort results by relevance */
  shouldSort?: boolean
  /** Match whole words only */
  words?: boolean
}

/**
 * Progress reporting interface for long operations
 */
export type Progress = {
  /** Report progress step */
  step: (n: number) => void
  /** Optional regex for highlighting matches */
  regex?: RegExp
}

/**
 * Search result item
 */
export type SearchResult = {
  /** Passage reference */
  passage: [number, number, number, number]
  /** Matched verse text */
  text: string
  /** Book index */
  bookIndex: number
  /** Chapter index */
  chapterIndex: number
  /** Verse index */
  verseIndex: number
}
