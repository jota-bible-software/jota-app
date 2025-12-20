/**
 * Template engine for format patterns
 * Framework-agnostic template processing
 */

import type { Passage, TranslationContent } from '../types'
import { getChapter } from '../bible/translation-utils'

/**
 * Pattern configuration for template generation
 */
export interface FormatPattern {
  referencePosition?: 'before' | 'after'
  referenceNewLine?: 'same line' | 'new line'
  separatorChar?: string
  quotes?: boolean
  verseNewLine?: boolean
  numbers?: boolean
}

/**
 * Convert a pattern object to a template string
 *
 * @param pattern - Format pattern configuration
 * @returns Template string with placeholders
 */
export function patternToTemplate(pattern: FormatPattern): string {
  const { referencePosition, referenceNewLine, separatorChar, quotes, verseNewLine, numbers } = pattern
  const ref = `\${book} \${chapter}${separatorChar}\${start}-\${end}`
  let s = `\${text${numbers ? 'Numbers' : ''}${verseNewLine ? 'NewLines' : ''}}`

  if (quotes) s = `"${s}"`

  if (referencePosition === 'before') {
    s = `${ref}${referenceNewLine === 'new line' ? '\n' : ' '}${s}`
  } else {
    s = `${s}${referenceNewLine === 'new line' ? '\n' : ' '}${ref}`
  }

  return s
}

/**
 * Format a passage using a template string
 * WARNING: This uses eval() - only use with trusted templates
 *
 * @param translationContent - Bible translation content
 * @param passage - Passage reference
 * @param template - Template string with ${} placeholders
 * @param bookNames - Array of book names
 * @param separator - Chapter-verse separator
 * @param translation - Translation name
 * @returns Formatted string
 */
export function formatWithTemplate(
  translationContent: TranslationContent,
  passage: Passage,
  template: string,
  bookNames: string[],
  separator: string,
  translation: string
): string {
  const [bi, ci, si, ei] = passage
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const book = bookNames[bi]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const chapter = ci + 1
  const content = getChapter(translationContent, bi, ci)
  if (!content) return ''

  const start = si == null ? 1 : si + 1
  const end = ei == null ? (si == null ? content.length : si + 1) : ei + 1
  const verses = content.slice(start - 1, end)
  if (start === end) template = template.replace('-${end}', '')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const verse = start
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const translationUpperCase = translation ? translation.toUpperCase() : ''
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let text: string, textNumbers: string, textNewLines: string, textNumbersNewLines: string

  const includesNumbers = template.includes('Numbers')
  const includesNewLines = template.includes('NewLines')
  const oneVerse = start === end

  if (includesNumbers && includesNewLines) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    textNumbersNewLines = oneVerse
      ? verses.join(' ')
      : '\n' + verses.map((v, i) => `(${start + i}) ${v}`).join('\n')
  } else if (includesNewLines) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    textNewLines = oneVerse ? verses.join(' ') : '\n' + verses.join('\n')
  } else if (includesNumbers) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    textNumbers = oneVerse
      ? verses.join(' ')
      : verses.map((v, i) => `(${start + i}) ${v}`).join(' ')
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text = verses.join(' ')
  }

  // Note: eval is used for template string evaluation
  // This should only be used with trusted templates
  // eslint-disable-next-line no-eval
  return eval('`' + template + '`')
}
