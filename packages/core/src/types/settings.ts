/**
 * Settings types - framework-agnostic
 */

import type { FormatTemplateData, CopyTemplateData } from './format'
import type { Highlights } from './highlight'
import type { BookNaming, BookNamingV2 } from './bible'

/**
 * Supported locale symbols
 */
export type LocaleSymbol = 'en-US' | 'pl-PL' | 'pt-BR' | 'pt-PT' | 'es-ES' | 'uk-UA'

/**
 * Language symbol (more permissive)
 */
export type LanguageSymbol = string

/**
 * Screen display mode
 */
export type ScreenMode = 'dark' | 'light' | 'auto'

/**
 * Passage list layout mode
 */
export type PassageListLayout = 'split' | 'formatted'

/**
 * Application settings
 */
export type AppSettings = {
  defaultLocale: LocaleSymbol
  fontSize: number
  screenMode: ScreenMode
  appFormatTemplateName: string
  defaultSearchResultLayout: PassageListLayout
  referencePickerOnStart: boolean
  inlineVerseNumbers: boolean
  superscriptVerseNumbers: boolean
  underlineVerseHighlight: boolean
  continuousVerses: boolean
}

/**
 * Locale-specific naming configuration
 */
export type LocaleNaming = {
  available: BookNamingV2[]
  default: string
}

/**
 * Locale-specific translation configuration
 */
export type LocaleTranslations = {
  available: string[]
  selected: string[]
  default: string
  highlightsEnabled?: Record<string, boolean>
}

/**
 * Locale data (v2 format)
 */
export type LocaleDataV2 = {
  naming: LocaleNaming
  translations: LocaleTranslations
  copyTemplates: CopyTemplateData[]
  defaultCopyTemplate: string
}

/**
 * Legacy locale data format
 */
export interface LocaleData {
  naming: {
    available: BookNaming[]
    default: string
  }
  translations: {
    available: string[]
    selected: string[]
    default: string
  }
  copyTemplates: CopyTemplateData[]
  defaultCopyTemplate: string
}

/**
 * Localized settings data
 */
export type Localized = {
  appBookNaming: string
  bookNamings: BookNamingV2[]
  copyTemplates: CopyTemplateData[]
  defaultCopyTemplate: string
  selectedTranslations: string[]
  defaultTranslation: string
}

/**
 * Complete persisted settings (current version)
 */
export type SettingsPersist = {
  [key: string]: unknown
  version: string
  app: AppSettings
  locales: LocaleSymbol[]
  localeData: Record<LocaleSymbol, LocaleDataV2>
  formatTemplates: FormatTemplateData[]
  highlights?: Highlights
}

/**
 * Legacy persisted settings (v2)
 */
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
