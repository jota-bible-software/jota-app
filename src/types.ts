import { ShallowRef } from 'vue'

export type AppSettings = {
  defaultLocale: LocaleSymbol
  fontSize: number
  screenMode: ScreenMode
  appFormatTemplateName: string
  defaultSearchResultLayout: PassageListLayout
  referencePickerOnStart: boolean
}

export type BookNamingV2 = { locale: LocaleSymbol, name: string, books: string[], booksText?: string }
export type BookNaming = { name: string, books: string[], booksText?: string }

export type CopyTemplateData = {
  name: string,
  formatTemplate: string,
  bookNaming: string
}

export type Edition = EditionMeta & {
  content: ShallowRef<EditionContent | undefined>
  selected: Ref<boolean>
}

export type EditionContent = string[][][]

export type EditionKey = { locale: LocaleSymbol, symbol: string }

export type EditionMeta = EditionKey & { title: string, size: number, year?: string, bookNames?: string, bookOrder?: string }

export type FormatTemplateData = {
  name: string,
  referenceWithoutContent: boolean,
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

export type Formatted = { reference: string, separator: string, content: string, referenceFirst: boolean }

export type JotaTestSupport = {
  getSelectionRange: () => Range | undefined
}

export type LanguageSymbol = string

export type LocaleDataV2 = {
  naming: LocaleNaming
  editions: LocaleEditions
  copyTemplates: CopyTemplateData[]
  defaultCopyTemplate: string
}

export interface LocaleData {
  naming: {
    available: BookNaming[]
    default: string
  }
  editions: {
    available: string[]
    selected: string[]
    default: string
  }
  copyTemplates: CopyTemplateData[]
  defaultCopyTemplate: string
}

export type LocaleEditions = {
  available: string[]
  selected: string[]
  default: string
}

export type LocaleNaming = {
  available: BookNamingV2[]
  default: string
}

export type Localized = {
  appBookNaming: string
  bookNamings: BookNamingV2[]
  copyTemplates: CopyTemplateData[]
  defaultCopyTemplate: string
  selectedEditions: string[]
  defaultEdition: string
}

export type LocaleSymbol = 'en-US' | 'pl-PL'

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

export type SettingsPersist = {
  [key: string]: unknown
  version: string
  app: AppSettings
  locales: LocaleSymbol[]
  localeData: Record<LocaleSymbol, LocaleDataV2>
  formatTemplates: FormatTemplateData[]
}

export type SettingsPersistV2 = Partial<SettingsPersist> & {
  appearance?: {
    locale?: string
    fontSize?: number
    screenMode?: ScreenMode
    primaryColor?: string
  }
  localized: Record<LocaleSymbol, Partial<Localized>>
  formatTemplates: Array<Partial<FormatTemplateData>>
  appFormatTemplateName?: string
  defaultSearchResultLayout?: string
  referencePickerOnStart?: boolean
}
