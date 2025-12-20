/**
 * Passage formatting utilities
 * Framework-agnostic text formatting for Bible passages
 */

import type { FormatTemplateData, Formatted, Passage, TranslationContent } from '../types'
import { getChapter } from '../bible/translation-utils'

/**
 * Replace enter character placeholder with newline
 */
function replaceEnterChar(str: string): string {
  return str.replace(/⏎/g, '\n')
}

/**
 * Format a passage with template, returning structured output
 *
 * @param template - Format template configuration
 * @param passage - Passage reference
 * @param translationContent - Bible translation content
 * @param bookNames - Array of book names
 * @param translationAbbreviation - Translation abbreviation
 * @returns Formatted output structure or undefined if chapter not found
 */
export function formatPassageComposable(
  template: FormatTemplateData,
  passage: Passage,
  translationContent: TranslationContent,
  bookNames: string[],
  translationAbbreviation: string
): Formatted | undefined {
  const t = {
    ...template,
    referenceCharsBefore: replaceEnterChar(template.referenceCharsBefore),
    referenceCharsAfter: replaceEnterChar(template.referenceCharsAfter),
    translationAbbreviationCharsBefore: replaceEnterChar(template.translationAbbreviationCharsBefore),
    translationAbbreviationCharsAfter: replaceEnterChar(template.translationAbbreviationCharsAfter),
    quoteCharsBefore: replaceEnterChar(template.quoteCharsBefore),
    quoteCharsAfter: replaceEnterChar(template.quoteCharsAfter),
    verseNumberCharsBefore: replaceEnterChar(template.verseNumberCharsBefore),
    verseNumberCharsAfter: replaceEnterChar(template.verseNumberCharsAfter),
  }

  const [bi, ci, si, ei] = passage
  const chapter = ci + 1
  const chapterContent = getChapter(translationContent, bi, ci)

  if (!chapterContent) return undefined

  const bookName = bookNames[bi]
  const start = si === undefined ? 1 : si + 1
  const end = ei === undefined ? (si === undefined ? chapterContent.length : si + 1) : ei + 1
  const ending = start === end ? '' : t.rangeChar + end
  const ta = t.translationAbbreviation
  const ab = ta === 'none' ? '' : ta === 'lowercase' ? translationAbbreviation.toLowerCase() : translationAbbreviation.toUpperCase()
  const abb = ab ? ` ${t.translationAbbreviationCharsBefore}${ab}${t.translationAbbreviationCharsAfter}` : ''

  // Format Reference
  const reference = `${t.referenceCharsBefore}${bookName} ${chapter}${t.separatorChar}${start}${ending}${abb}${t.referenceCharsAfter}`

  let text = ''
  const includesNumbers = t.numbers
  const includesNewLines = t.verseNewLine
  const oneVerse = start === end
  const verses = chapterContent.slice(start - 1, end)

  const numberedVerse = (i: number, s: string) =>
    `${t.verseNumberCharsBefore}${start + i}${t.verseNumberCharsAfter} ${s}`

  if (includesNumbers && includesNewLines) {
    text = oneVerse ? verses.join(' ') : verses.map((v, i) => numberedVerse(i, v)).join('\n')
  } else if (includesNewLines) {
    text = oneVerse ? verses.join(' ') : verses.join('\n')
  } else if (includesNumbers) {
    text = oneVerse ? verses.join(' ') : verses.map((v, i) => numberedVerse(i, v)).join(' ')
  } else {
    text = verses.join(' ')
  }

  const content = `${t.quoteCharsBefore}${text}${t.quoteCharsAfter}`
  const separator = t.referenceLine === 'new line' ? '\n' : ' '
  const referenceFirst = t.referencePosition === 'before'

  return { reference, separator, content, referenceFirst }
}

/**
 * Format a passage as a string
 *
 * @param template - Format template configuration
 * @param passage - Passage reference
 * @param translationContent - Bible translation content
 * @param bookNames - Array of book names
 * @param translationAbbreviation - Translation abbreviation
 * @returns Formatted string
 */
export function formatPassage(
  template: FormatTemplateData,
  passage: Passage,
  translationContent: TranslationContent,
  bookNames: string[],
  translationAbbreviation: string
): string {
  const result = formatPassageComposable(template, passage, translationContent, bookNames, translationAbbreviation)
  if (!result) return ''

  const { reference, separator, content, referenceFirst } = result

  // If referenceWithoutContent is true, return only the reference
  if (template.referenceWithoutContent) {
    return reference
  }

  return referenceFirst ? reference + separator + content : content + separator + reference
}

/**
 * Format a passage reference (without content)
 *
 * @param passage - Passage reference
 * @param bookNames - Array of book names
 * @param separator - Chapter-verse separator character
 * @returns Formatted reference string
 */
export function formatReference(
  passage: Passage,
  bookNames: string[],
  separator: string
): string {
  const [bookIndex, chapter, start, end] = passage
  const book = bookNames[bookIndex]

  if (start == null) {
    return `${book} ${chapter + 1}`
  } else if (end == null || start === end) {
    return `${book} ${chapter + 1}${separator}${start + 1}`
  } else {
    return `${book} ${chapter + 1}${separator}${start + 1}-${end + 1}`
  }
}

/**
 * Format chapter caption
 *
 * @param passage - Passage reference
 * @param bookNames - Array of book names
 * @returns Chapter title string
 */
export function formatChapterCaption(passage: Passage | null, bookNames: string[]): string {
  if (!passage) return ''
  const [bookIndex, chapter] = passage
  const book = bookNames[bookIndex]
  return `${book} ${chapter + 1}`
}

/**
 * Get verses from a passage
 *
 * @param bible - Translation content
 * @param passage - Passage reference
 * @returns Array of verse strings
 */
export function getPassageVerses(bible: TranslationContent, passage: Passage): string[] {
  const [bi, ci, si, ei] = passage
  const content = getChapter(bible, bi, ci)
  if (!content) return []

  const start = si == null ? 1 : si + 1
  const end = ei == null ? (si == null ? content.length : si + 1) : ei + 1
  return content.slice(start - 1, end)
}

/**
 * Get all verses for a chapter containing the passage
 *
 * @param bible - Translation content
 * @param passage - Passage reference
 * @returns Array of all verses in the chapter
 */
export function getChapterVerses(bible: TranslationContent, passage: Passage | null): string[] {
  if (!passage) return []
  const [book, chapter] = passage
  const content = getChapter(bible, book, chapter)
  return content || []
}
