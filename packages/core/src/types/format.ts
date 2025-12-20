/**
 * Formatting types - framework-agnostic
 */

/**
 * Template configuration for formatting passages
 */
export type FormatTemplateData = {
  name: string
  referenceWithoutContent: boolean
  referencePosition: 'before' | 'after'
  referenceLine: 'same line' | 'new line'
  translationAbbreviation: 'none' | 'lowercase' | 'uppercase'
  numbers: boolean
  verseNewLine: boolean
  separatorChar: string
  rangeChar: string
  referenceCharsBefore: string
  referenceCharsAfter: string
  quoteCharsBefore: string
  quoteCharsAfter: string
  verseNumberCharsBefore: string
  verseNumberCharsAfter: string
  translationAbbreviationCharsBefore: string
  translationAbbreviationCharsAfter: string
}

/**
 * Formatted passage output
 */
export type Formatted = {
  reference: string
  separator: string
  content: string
  referenceFirst: boolean
}

/**
 * Passage formatting configuration
 */
export type PassageFormat = {
  bookNames: string[]
  referencePosition: 'before' | 'after'
  referenceNewLine: 'same line' | 'new line'
  separatorChar: string
  quotes: boolean
  numbers: boolean
  verseNewLine: boolean
  translation: 'none' | 'lowercase' | 'uppercase'
}

/**
 * Copy template configuration
 */
export type CopyTemplateData = {
  name: string
  formatTemplate: string
  bookNaming: string
}
