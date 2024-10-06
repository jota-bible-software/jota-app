import { FormatTemplateData, Formatted, Passage, EditionContent } from 'src/types'

/**
 * Returns a structure that holds the reference separately from the verses content.
 */
export function formatComposable(template: FormatTemplateData, passage: Passage, editionContent: EditionContent, bookNames: string[], editionAbbreviation: string): Formatted | undefined {
  // All the variables used in the template must declared as loca variables here
  const t = template
  const [bi, ci, si, ei] = passage
  const chapter = ci + 1
  const chapterContent = editionContent[bi][ci]

  const bookName = bookNames[bi]
  const start = si === undefined ? 1 : si + 1
  const end = ei === undefined ? si === undefined ? (chapterContent?.length || 1) : si + 1 : ei + 1
  const ending = start === end ? '' : t.rangeChar + end
  const ta = t.editionAbbreviation
  const ab = ta === 'none' ? '' : ta === 'lowercase' ? editionAbbreviation.toLowerCase() : editionAbbreviation.toUpperCase()
  const abb = ab ? ` ${t.editionAbbreviationCharsBefore}${ab}${t.editionAbbreviationCharsAfter}` : ''

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
  const referenceFirst = t.referencePosition === 'before'
  return { reference, separator, content, referenceFirst }
}

export function format(template: FormatTemplateData, passage: Passage, editionContent: EditionContent, bookNames: string[], editionAbbreviation: string): string {
  const format2Result = formatComposable(template, passage, editionContent, bookNames, editionAbbreviation)
  if (!format2Result) return ''
  const { reference, separator, content, referenceFirst } = format2Result
  return referenceFirst ? reference + separator + content : content + separator + reference
}

export function formatSample(template: FormatTemplateData, bookNames: string[] = ['Book'], abbreviation = 'ABR') {
  /* cspell:disable-next-line */
  const bible = [[['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ultricies mi quis hendrerit dolor magna eget est lorem.']]]
  const format2Result = formatComposable(template, [0, 0, 0, 1], bible, bookNames, abbreviation)
  if (!format2Result) return
  const { reference, separator, content, referenceFirst } = format2Result
  const colorizedReference = colorize(reference)
  return (referenceFirst ? colorizedReference + separator + content : content + separator + colorizedReference).replace(/\n/g, '<br/>')

  function colorize(s: string) {
    return `<span style="color: var(--q-primary)">${s.replace(/ /g, '&nbsp;')}</span>`
  }
}
