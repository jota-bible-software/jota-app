export type BookNamesStandardData = { lang: string, name: string, books: string[] }
export type Lang = 'en' | 'pl'
export type LangSymbol = 'en' | 'pl'
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
export type Progress = { step: (n: number) => void, regex: RegExp }
export type ScreenMode = 'dark' | 'light' | 'auto'
export type Translation = TranslationMeta & { selected: boolean, stored: boolean, content?: TranslationContent }
export type TranslationContent = string[][][]
export type TranslationKey = { lang: Lang, symbol: string }
export type TranslationMeta = TranslationKey & { title: string, size: number, year?: string, bookNames?: string, bookOrder?: string }
