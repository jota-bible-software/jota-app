import { FormatTemplateData, LanguageSymbol, LocaleSymbol, TranslationMeta } from 'src/types'


export const localeData: Array<{ symbol: LocaleSymbol, langName: string, regionName: string }> = [
  // {
  //   symbol: 'en-GB',
  //   langName: 'English',
  //   regionName: 'Great Britain'
  // },
  {
    symbol: 'en-US',
    langName: 'English',
    regionName: 'United States'
  },
  // {
  //   symbol: 'es-ES',
  //   langName: 'Español',
  //   regionName: 'España'
  // },
  {
    symbol: 'pl-PL',
    langName: 'Polski',
    regionName: 'Polska'
  },
  // {
  //   symbol: 'pt-PT',
  //   langName: 'Português',
  //   regionName: 'Portugal'
  // },
  // {
  //   symbol: 'uk-UA',
  //   langName: 'Українська',
  //   regionName: 'Україна'
  // }
]


export const formatTemplates: FormatTemplateData[] =
  [
    {
      'name': 'App format',
      'referencePosition': 'before',
      'referenceLine': 'same line',
      'translationAbbreviation': 'none',
      'numbers': false,
      'verseNewLine': false,
      'referenceWithoutContent': false,
      'separatorChar': ':',
      'rangeChar': '-',
      'referenceCharsBefore': '',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '',
      'quoteCharsAfter': '',
      'verseNumberCharsBefore': '',
      'verseNumberCharsAfter': '',
      'translationAbbreviationCharsBefore': '',
      'translationAbbreviationCharsAfter': ''
    },
    {
      'name': 'English presentation',
      'referencePosition': 'after',
      'referenceLine': 'new line',
      'translationAbbreviation': 'uppercase',
      'numbers': false,
      'verseNewLine': false,
      'referenceWithoutContent': false,
      'separatorChar': ':',
      'rangeChar': '-',
      'referenceCharsBefore': '',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '',
      'quoteCharsAfter': '',
      'verseNumberCharsBefore': '',
      'verseNumberCharsAfter': '',
      'translationAbbreviationCharsBefore': '',
      'translationAbbreviationCharsAfter': ''
    },
    {
      'name': 'PL – oficjalny w cudzysłowiu',
      'referencePosition': 'after',
      'referenceLine': 'new line',
      'translationAbbreviation': 'none',
      'numbers': false,
      'verseNewLine': false,
      'referenceWithoutContent': false,
      'separatorChar': ',',
      'rangeChar': '-',
      'referenceCharsBefore': '',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '"',
      'quoteCharsAfter': '"',
      'verseNumberCharsBefore': '',
      'verseNumberCharsAfter': '',
      'translationAbbreviationCharsBefore': '',
      'translationAbbreviationCharsAfter': ''
    },
    {
      'name': 'PL – prezentacja',
      'referencePosition': 'after',
      'referenceLine': 'new line',
      'translationAbbreviation': 'uppercase',
      'numbers': false,
      'verseNewLine': false,
      'referenceWithoutContent': false,
      'separatorChar': ',',
      'rangeChar': '-',
      'referenceCharsBefore': '',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '',
      'quoteCharsAfter': '',
      'verseNumberCharsBefore': '',
      'verseNumberCharsAfter': '',
      'translationAbbreviationCharsBefore': '',
      'translationAbbreviationCharsAfter': ''
    },
    {
      'name': 'Separate lines',
      'referencePosition': 'before',
      'referenceLine': 'same line',
      'translationAbbreviation': 'uppercase',
      'numbers': true,
      'verseNewLine': true,
      'referenceWithoutContent': false,
      'separatorChar': ':',
      'rangeChar': '-',
      'referenceCharsBefore': '',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '',
      'quoteCharsAfter': '',
      'verseNumberCharsBefore': '(',
      'verseNumberCharsAfter': ')',
      'translationAbbreviationCharsBefore': '',
      'translationAbbreviationCharsAfter': ''
    },
    {
      'name': 'Studium',
      'referencePosition': 'before',
      'referenceLine': 'new line',
      'translationAbbreviation': 'uppercase',
      'numbers': true,
      'verseNewLine': false,
      'referenceWithoutContent': false,
      'separatorChar': ':',
      'rangeChar': '-',
      'referenceCharsBefore': '– ',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '',
      'quoteCharsAfter': '',
      'verseNumberCharsBefore': '(',
      'verseNumberCharsAfter': ')',
      'translationAbbreviationCharsBefore': '',
      'translationAbbreviationCharsAfter': ''
    },
    // The name for this template will be replaced by the translated value from i18n
    // in settings-store.ts when locale changes
    {
      'name': 'Reference only',
      'referencePosition': 'before',
      'referenceLine': 'same line',
      'translationAbbreviation': 'uppercase',
      'numbers': false,
      'verseNewLine': false,
      'referenceWithoutContent': true,
      'separatorChar': ':',
      'rangeChar': '-',
      'referenceCharsBefore': '',
      'referenceCharsAfter': '',
      'quoteCharsBefore': '',
      'quoteCharsAfter': '',
      'verseNumberCharsBefore': '',
      'verseNumberCharsAfter': '',
      'translationAbbreviationCharsBefore': '',
      'translationAbbreviationCharsAfter': ''
    }

  ]

export const bookOrder = {
  pl: {
    bt5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 66, 67, 16, 68, 69, 17, 18, 19, 20, 21, 70, 71, 22, 23, 24, 72, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65]
  }
}


/*
The format of translations:
{
  title: '',
  symbol: '',
  bookNames: 'katolicki',
}
If 'bookNames' is not specified, then it will be taken from bookNames[lang].default
*/

export const translationsData: TranslationMeta[] = [
  {
    locale: 'en-US',
    title: 'King James Version',
    symbol: 'KJV',
    size: 4_472_372,
  },
  {
    locale: 'en-US',
    title: 'New International Version',
    symbol: 'NIV',
    size: 3_902_640,
  },
  {
    title: 'New Living Translation',
    locale: 'en-US',
    symbol: 'NLT',
    size: 4_097_509,
  },
  {
    title: 'Biblia Ewangeliczna',
    symbol: 'EIB',
    locale: 'pl-PL',
    size: 4_104_753,
    year: '2016',
    bookNames: 'protestancki',
  },
  {
    title: 'Biblia Tysiąclecia V',
    symbol: 'BT5',
    locale: 'pl-PL',
    size: 4_552_494,
    year: '2000',
    bookOrder: 'bt5',
  },
  {
    title: 'Biblia Warszawska (brytyjka)',
    symbol: 'BW',
    locale: 'pl-PL',
    size: 4_024_215,
    year: '1975',
    bookNames: 'bw pełne',
  },
  {
    title: 'Uwspółcześniona Biblia Gdańska',
    symbol: 'UBG',
    locale: 'pl-PL',
    size: 3_962_719,
    year: '2017',
    bookNames: 'protestancki',
  },
]

export const supportedLanguageSymbols: LanguageSymbol[] = ['en', 'pl']

// Check the uniqueness of symbols and names
