/**
 * Utility functions to access Bible translation data regardless of format (3D array or map)
 * Framework-agnostic - no Vue/Quasar dependencies
 */

import type {
  TranslationContent,
  TranslationContentArray,
  TranslationContentMap,
} from '../types'

/**
 * Check if content is in array format
 */
export function isArrayFormat(content: TranslationContent): content is TranslationContentArray {
  return Array.isArray(content)
}

/**
 * Check if content is in map format
 */
export function isMapFormat(content: TranslationContent): content is TranslationContentMap {
  return !Array.isArray(content) && typeof content === 'object' && content !== null
}

/**
 * Get a single verse from the translation content
 * @param content - Translation content in either format
 * @param bookIndex - 0-based book index
 * @param chapterIndex - 0-based chapter index
 * @param verseIndex - 0-based verse index
 * @returns The verse text or undefined if not found
 */
export function getVerse(
  content: TranslationContent,
  bookIndex: number,
  chapterIndex: number,
  verseIndex: number
): string | undefined {
  if (isArrayFormat(content)) {
    // 3D array format (0-indexed)
    return content[bookIndex]?.[chapterIndex]?.[verseIndex]
  } else if (isMapFormat(content)) {
    // Map format (1-indexed)
    const bookNumber = bookIndex + 1
    const chapterNumber = chapterIndex + 1
    const verseNumber = verseIndex + 1
    return content[bookNumber]?.[chapterNumber]?.[verseNumber]
  }
  return undefined
}

/**
 * Get all verses from a chapter
 * @param content - Translation content in either format
 * @param bookIndex - 0-based book index
 * @param chapterIndex - 0-based chapter index
 * @returns Array of verse strings or undefined if chapter not found
 */
export function getChapter(
  content: TranslationContent,
  bookIndex: number,
  chapterIndex: number
): string[] | undefined {
  if (isArrayFormat(content)) {
    return content[bookIndex]?.[chapterIndex]
  } else if (isMapFormat(content)) {
    const bookNumber = bookIndex + 1
    const chapterNumber = chapterIndex + 1
    const chapter = content[bookNumber]?.[chapterNumber]
    if (!chapter) return undefined

    // Convert map to array, maintaining verse order
    const verses: string[] = []
    const verseNumbers = Object.keys(chapter).map(Number).sort((a, b) => a - b)
    for (const verseNum of verseNumbers) {
      verses[verseNum - 1] = chapter[verseNum]
    }
    return verses
  }
  return undefined
}

/**
 * Get all chapters from a book
 * @param content - Translation content in either format
 * @param bookIndex - 0-based book index
 * @returns 2D array of chapters and verses or undefined if book not found
 */
export function getBook(
  content: TranslationContent,
  bookIndex: number
): string[][] | undefined {
  if (isArrayFormat(content)) {
    return content[bookIndex]
  } else if (isMapFormat(content)) {
    const bookNumber = bookIndex + 1
    const book = content[bookNumber]
    if (!book) return undefined

    // Convert map to 2D array
    const chapters: string[][] = []
    const chapterNumbers = Object.keys(book).map(Number).sort((a, b) => a - b)

    for (const chapterNum of chapterNumbers) {
      const chapter = book[chapterNum]
      const verses: string[] = []
      const verseNumbers = Object.keys(chapter).map(Number).sort((a, b) => a - b)

      for (const verseNum of verseNumbers) {
        verses[verseNum - 1] = chapter[verseNum]
      }
      chapters[chapterNum - 1] = verses
    }
    return chapters
  }
  return undefined
}

/**
 * Get the number of books in the translation
 */
export function getBookCount(content: TranslationContent): number {
  if (isArrayFormat(content)) {
    return content.length
  } else if (isMapFormat(content)) {
    return Object.keys(content).length
  }
  return 0
}

/**
 * Get the number of chapters in a book
 */
export function getChapterCount(content: TranslationContent, bookIndex: number): number {
  if (isArrayFormat(content)) {
    return content[bookIndex]?.length || 0
  } else if (isMapFormat(content)) {
    const bookNumber = bookIndex + 1
    const book = content[bookNumber]
    return book ? Object.keys(book).length : 0
  }
  return 0
}

/**
 * Get the number of verses in a chapter
 */
export function getVerseCount(
  content: TranslationContent,
  bookIndex: number,
  chapterIndex: number
): number {
  if (isArrayFormat(content)) {
    return content[bookIndex]?.[chapterIndex]?.length || 0
  } else if (isMapFormat(content)) {
    const bookNumber = bookIndex + 1
    const chapterNumber = chapterIndex + 1
    const chapter = content[bookNumber]?.[chapterNumber]
    return chapter ? Object.keys(chapter).length : 0
  }
  return 0
}

/**
 * Convert any translation content to 3D array format for backward compatibility
 */
export function toArrayFormat(content: TranslationContent): TranslationContentArray {
  if (isArrayFormat(content)) {
    return content
  }

  if (isMapFormat(content)) {
    const result: TranslationContentArray = []
    const bookNumbers = Object.keys(content).map(Number).sort((a, b) => a - b)

    for (const bookNum of bookNumbers) {
      const book = content[bookNum]
      const chapters: string[][] = []
      const chapterNumbers = Object.keys(book).map(Number).sort((a, b) => a - b)

      for (const chapterNum of chapterNumbers) {
        const chapter = book[chapterNum]
        const verses: string[] = []
        const verseNumbers = Object.keys(chapter).map(Number).sort((a, b) => a - b)

        for (const verseNum of verseNumbers) {
          verses[verseNum - 1] = chapter[verseNum]
        }
        chapters[chapterNum - 1] = verses
      }
      result[bookNum - 1] = chapters
    }
    return result
  }

  return []
}

/**
 * Convert any translation content to map format
 */
export function toMapFormat(content: TranslationContent): TranslationContentMap {
  if (isMapFormat(content)) {
    return content
  }

  const result: TranslationContentMap = {}

  if (isArrayFormat(content)) {
    const arrayContent = content as TranslationContentArray

    for (let bookIndex = 0; bookIndex < arrayContent.length; bookIndex++) {
      const book = arrayContent[bookIndex]
      const bookNumber = bookIndex + 1
      result[bookNumber] = {}

      for (let chapterIndex = 0; chapterIndex < book.length; chapterIndex++) {
        const chapter = book[chapterIndex]
        const chapterNumber = chapterIndex + 1
        result[bookNumber][chapterNumber] = {}

        for (let verseIndex = 0; verseIndex < chapter.length; verseIndex++) {
          const verse = chapter[verseIndex]
          const verseNumber = verseIndex + 1
          result[bookNumber][chapterNumber][verseNumber] = verse
        }
      }
    }
  }

  return result
}
