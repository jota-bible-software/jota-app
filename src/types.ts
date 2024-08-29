export type BookNamesStandardData = { lang: string, name: string, books: string[] }

export type CopyTemplateData = {
  name: string,
  lang: CopyTemplateLangData
}

export type CopyTemplateLangData = Record<LanguageSymbol, { formatTemplate: string, bookNaming: string }>

export type Formatted = { reference: string, separator: string, content: string, referenceFirst: boolean }

export type FormatTemplateData = {
  name: string,
  referencePosition: 'before' | 'after',
  referenceLine: 'same line' | 'new line',
  translationAbbreviation: 'none' | 'lowercase' | 'uppercase'
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
  translationAbbreviationCharsBefore: string,
  translationAbbreviationCharsAfter: string,
}

export type LanguageSymbol = 'en' | 'pl'

export type Passage = [number, number, number?, number?]

export type PassageFormat = {
  bookNames: string[],
  referencePosition: 'before' | 'after',
  referenceNewLine: 'same line' | 'new line',
  separatorChar: string,
  quotes: boolean,
  numbers: boolean,
  verseNewLine: boolean,
  translation: 'none' | 'lowercase' | 'uppercase'
}

export type PassageListLayout = 'split' | 'formatted'

export type Progress = { step: (n: number) => void, regex?: RegExp }

export type ScreenMode = 'dark' | 'light' | 'auto'

export type SearchOptions = { apocrypha?: boolean, shouldSort?: boolean, words?: boolean }

export type SettingsPersistType = {
  [key: string]: unknown;
  version: string;
  appearance: {
    defaultLang: LanguageSymbol;
    fontSize: number;
    screenMode: ScreenMode;
    primaryColor: string;
  };
  languages: {
    en: {
      appBookNaming: string;
      bookNamings: { lang: string; name: string; books: string[] }[];
      selectedTranslations: string[];
    };
    pl: {
      appBookNaming: string;
      bookNamings: { lang: string; name: string; books: string[] }[];
      selectedTranslations: string[];
    };
  };
  formatTemplates: FormatTemplateData[];
  copyTemplates: CopyTemplateData[];
  appFormatTemplate: string;
  defaultCopyTemplate: string;
  defaultSearchResultLayout: PassageListLayout;
  defaultTranslation: TranslationKey;
}

export type Translation = TranslationMeta & { selected: boolean, stored: boolean, content?: TranslationContent }

export type TranslationContent = string[][][]

export type TranslationKey = { lang: LanguageSymbol, symbol: string }

export type TranslationMeta = TranslationKey & { title: string, size: number, year?: string, bookNames?: string, bookOrder?: string }

// ... other existing types ...
