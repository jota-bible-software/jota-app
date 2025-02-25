import { ShallowRef } from 'vue'

export type BookNaming = { locale: LocaleSymbol, name: string, books: string[] }

export type CopyTemplateData = {
  name: string,
  formatTemplate: string,
  bookNaming: string
}

export type Edition = EditionMeta & {
  selected: Ref<boolean>,
  // stored: boolean,
  content: ShallowRef<EditionContent | undefined>
}

export type EditionContent = string[][][]

export type EditionKey = { locale: LocaleSymbol, symbol: string }

export type EditionMeta = EditionKey & { title: string, size: number, year?: string, bookNames?: string, bookOrder?: string }

export type Formatted = { reference: string, separator: string, content: string, referenceFirst: boolean }

export type FormatTemplateData = {
  name: string,
  referencePosition: 'before' | 'after',
  referenceLine: 'same line' | 'new line',
  editionAbbreviation: 'none' | 'lowercase' | 'uppercase'
  numbers: boolean,
  verseNewLine: boolean,
  separatorChar: string,
  rangeChar: string,
  referenceCharsBefore: string,
  referenceCharsAfter: string,
  quoteCharsBefore: string,
  quoteCharsAfter: string,
  verseNumberCharsBefore: string,
  verseNumberCharsAfter: string,
  editionAbbreviationCharsBefore: string,
  editionAbbreviationCharsAfter: string,
}

export type JotaTestSupport = {
  getSelectionRange: () => Range | undefined
}

export type LanguageSymbol = string
export type LocaleSymbol = 'en-US' | 'pl-PL'
// export type LocaleSymbol = 'en-GB' | 'en-US' | 'pl-PL' | 'es-ES' | 'pt-PT' | 'uk-UA'

export type Localized = {
  appBookNaming: string
  bookNamings: BookNaming[]
  copyTemplates: CopyTemplateData[]
  defaultCopyTemplate: string
  selectedEditions: string[]
  defaultEdition: string
}

export type Passage = [number, number, number?, number?]

export type PassageFormat = {
  bookNames: string[],
  referencePosition: 'before' | 'after',
  referenceNewLine: 'same line' | 'new line',
  separatorChar: string,
  quotes: boolean,
  numbers: boolean,
  verseNewLine: boolean,
  edition: 'none' | 'lowercase' | 'uppercase'
}

export type PassageListLayout = 'split' | 'formatted'

export type Progress = { step: (n: number) => void, regex?: RegExp }

export type ScreenMode = 'dark' | 'light' | 'auto'

export type SearchOptions = { apocrypha?: boolean, shouldSort?: boolean, words?: boolean }

export type SettingsPersistType = {
  [key: string]: unknown
  version: string
  appearance: {
    locale: LocaleSymbol
    fontSize: number
    screenMode: ScreenMode
    primaryColor: string
  }
  localized: Record<LocaleSymbol, Localized>
  formatTemplates: FormatTemplateData[]
  appFormatTemplateName: string
  defaultSearchResultLayout: PassageListLayout
  referencePickerOnStart: boolean
}
