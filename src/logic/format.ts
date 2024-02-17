import { FormatTemplateData, Passage, TranslationContent } from 'src/types'
// import { FormatTemplateData } from 'src/types'

export function format2(template: FormatTemplateData, fragment: Passage, bible: TranslationContent, bookNames: string[], translationAbbreviation: string): Formatted | undefined {
  // All the variables used in the template must declared as loca variables here
  const t = template
  const [bi, ci, si, ei] = fragment
  const book = bookNames[bi]
  const chapter = ci + 1
  const chapterContent = bible[bi][ci]

  const bookName = bookNames[bi]
  const start = si === undefined ? 1 : si + 1
  const end = ei === undefined ? si === undefined ? (chapterContent?.length || 1) : si + 1 : ei + 1
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

  const numberedVerse = (i: number, s: string) => `${t.verseNumberCharsBefore}${start + i}${t.verseNumberCharsAfter} ${s}`
  if (includesNumbers && includesNewLines) {
    text = oneVerse ? verses.join(' ') : '\n' + (verses.map((v, i) => numberedVerse(i, v)).join('\n'))
  } else if (includesNewLines) {
    text = oneVerse ? verses.join(' ') : '\n' + verses.join('\n')
  } else if (includesNumbers) {
    text = oneVerse ? verses.join(' ') : verses.map((v, i) => numberedVerse(i, v)).join(' ')
  } else {
    text = verses.join(' ')
  }

  const content = `${t.quoteCharsBefore}${text}${t.quoteCharsAfter}`
  const separator = t.referenceLine === 'new line' ? '\n' : ' '
  return t.referencePosition === 'after' ? [content, separator, reference] : [reference, separator, content]
  // return t.referencePosition === 'after' ? `${content}${separator}${reference}` : `${reference}${separator}${content}`
}

