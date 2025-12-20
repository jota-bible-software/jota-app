import { Passage, PassageFormat, TranslationContent, TranslationContentArray } from 'src/types'

type Settings = {
  defaultPassageFormatName: unknown
  passageFormats: { name: string, rules: PassageFormat }[]
}

/**
 * Helper to get chapter content as array regardless of format
 */
function getChapterAsArray(content: TranslationContent, bookIndex: number, chapterIndex: number): string[] {
  const book = content[bookIndex]
  if (!book) return []
  const chapter = book[chapterIndex]
  if (!chapter) return []

  // If it's an array, return it directly
  if (Array.isArray(chapter)) {
    return chapter
  }

  // If it's a map format, convert to array
  const verseMap = chapter as { [verseNumber: number]: string }
  const verses: string[] = []
  const keys = Object.keys(verseMap).map(Number).sort((a, b) => a - b)
  for (const key of keys) {
    verses[key - 1] = verseMap[key] || ''
  }
  return verses
}

export const defaultSettings: Settings = {
  defaultPassageFormatName: { en: 'English presentation', pl: 'Polska prezentacja' },
  passageFormats: [
    {
      name: 'English presentation',
      rules: {
        bookNames: [], // 'en - SBL abbreviations',
        referencePosition: 'after',
        referenceNewLine: 'new line',
        separatorChar: ':',
        quotes: false,
        numbers: false,
        verseNewLine: false,
        translation: 'uppercase'
      }
    },
    {
      name: 'Polska prezentacja',
      rules: {
        bookNames: [], // 'pl - BT skróty',
        referencePosition: 'after',
        referenceNewLine: 'new line',
        separatorChar: ',',
        quotes: false,
        numbers: false,
        verseNewLine: false,
        translation: 'uppercase'
      }
    },
  ],
}

class Formatter {
  private rules: PassageFormat

  constructor(rules: PassageFormat) {
    this.rules = rules
  }

  formatContent(passage: Passage, translationContent: TranslationContent) {
    const { quotes, verseNewLine, numbers } = this.rules
    const [bi, ci, si, ei] = passage
    const chapterContent = getChapterAsArray(translationContent, bi, ci)
    const start = si === undefined ? 1 : si + 1
    const end = ei === undefined ? si === undefined ? chapterContent.length : si + 1 : ei + 1
    const verses = chapterContent.slice(start - 1, end)
    const oneVerse = start === end

    let s = ''
    if (oneVerse) {
      s = verses[0]
    } else {
      let vs: string[] = verses
      if (numbers) vs = verses.map((v: string, i: number) => `(${start + i}) ${v}`)
      if (verseNewLine) s = '\n' + vs.join('\n')
      else s = vs.join(' ')
    }
    if (quotes) s = `"${s}"`

    return s
  }

  formatReference(passage: Passage, translationContent: TranslationContent) {
    const { bookNames, separatorChar } = this.rules
    const [bi, ci, si, ei] = passage
    const chapterContent = getChapterAsArray(translationContent, bi, ci)
    const book = bookNames[bi]
    const chapter = ci + 1
    const start = si === undefined ? 1 : si + 1
    const end = ei === undefined ? si === undefined ? chapterContent.length : si + 1 : ei + 1
    const oneVerse = start === end
    const verseRange = oneVerse ? start : `${start}-${end}`
    return `${book} ${chapter}${separatorChar}${verseRange}`
  }

  /** Formats a reference to a one chapter passage */
  format(passage: Passage, translationContent: TranslationContent) {
    // ${book} ${chapter}${separator}${start}-${end} "${textWithNumbers}"
    const { bookNames, referencePosition, referenceNewLine, separatorChar, quotes, verseNewLine, numbers } = this.rules
    const [bi, ci, si, ei] = passage
    const chapterContent = getChapterAsArray(translationContent, bi, ci)
    const book = bookNames[bi]
    const chapter = ci + 1
    const start = si === undefined ? 1 : si + 1
    const end = ei === undefined ? si === undefined ? chapterContent.length : si + 1 : ei + 1
    const verses = chapterContent.slice(start - 1, end)
    const oneVerse = start === end
    const verseRange = oneVerse ? start : `${start}-${end}`
    const ref = `${book} ${chapter}${separatorChar}${verseRange}`
    const refSeparator = referenceNewLine === 'new line' ? '\n' : ' '

    let s = ''
    if (oneVerse) {
      s = verses[0]
    } else {
      let vs: string[] = verses
      if (numbers) vs = verses.map((v: string, i: number) => `(${start + i}) ${v}`)
      if (verseNewLine) s = '\n' + vs.join('\n')
      else s = vs.join(' ')
    }

    if (quotes) s = `"${s}"`
    if (referencePosition === 'before') {
      s = `${ref}${refSeparator}${s}`
    } else {
      s = `${s}${refSeparator}${ref}`
    }

    return s
  }
}

export function usePassageFormat(rules: PassageFormat) {
  return new Formatter(rules)
}

