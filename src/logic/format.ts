import { FormatTemplateData, Formatted, Passage, TranslationContent } from 'src/types'
import { getChapter } from './translation-utils'

/**
 * Returns a structure that holds the reference separately from the verses content.
 */
function replaceEnterChar(str: string): string {
  return str.replace(/⏎/g, '\n')
}

export function formatComposable(template: FormatTemplateData, passage: Passage, translationContent: TranslationContent, bookNames: string[], translationAbbreviation: string): Formatted | undefined {
  // All the variables used in the template must declared as local variables here
  const t = {
    ...template,
    referenceCharsBefore: replaceEnterChar(template.referenceCharsBefore),
    referenceCharsAfter: replaceEnterChar(template.referenceCharsAfter),
    translationAbbreviationCharsBefore: replaceEnterChar(template.translationAbbreviationCharsBefore),
    translationAbbreviationCharsAfter: replaceEnterChar(template.translationAbbreviationCharsAfter),
    quoteCharsBefore: replaceEnterChar(template.quoteCharsBefore),
    quoteCharsAfter: replaceEnterChar(template.quoteCharsAfter),
    verseNumberCharsBefore: replaceEnterChar(template.verseNumberCharsBefore),
    verseNumberCharsAfter: replaceEnterChar(template.verseNumberCharsAfter)
  }
  const [bi, ci, si, ei] = passage
  const chapter = ci + 1
  const chapterContent = getChapter(translationContent, bi, ci)

  if (!chapterContent) return undefined

  const bookName = bookNames[bi]
  const start = si === undefined ? 1 : si + 1
  const end = ei === undefined ? si === undefined ? chapterContent.length : si + 1 : ei + 1
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

export function format(template: FormatTemplateData, passage: Passage, translationContent: TranslationContent, bookNames: string[], translationAbbreviation: string): string {
  const format2Result = formatComposable(template, passage, translationContent, bookNames, translationAbbreviation)
  if (!format2Result) return ''
  const { reference, separator, content, referenceFirst } = format2Result

  // If referenceWithoutContent is true, return only the reference
  if (template.referenceWithoutContent) {
    return reference
  }

  return referenceFirst ? reference + separator + content : content + separator + reference
}

export function formatSample(template: FormatTemplateData, bookNames: string[] = ['Book'], abbreviation = 'ABR') {
  /* cspell:disable-next-line */
  const bible = [[['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ultricies mi quis hendrerit dolor magna eget est lorem.']]]
  const format2Result = formatComposable(template, [0, 0, 0, 1], bible, bookNames, abbreviation)
  if (!format2Result) return
  const { reference, separator, content, referenceFirst } = format2Result
  const colorizedReference = colorize(reference)

  // If referenceWithoutContent is true, return only the reference
  if (template.referenceWithoutContent) {
    return colorizedReference.replace(/\n/g, '<br/>')
  }

  return (referenceFirst ? colorizedReference + separator + content : content + separator + colorizedReference).replace(/\n/g, '<br/>')

  function colorize(s: string) {
    return `<span style="color: var(--q-primary)">${s.replace(/ /g, '&nbsp;')}</span>`
  }
}
