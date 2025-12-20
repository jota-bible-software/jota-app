/**
 * @jota/core type definitions
 * All types are framework-agnostic
 */

// Bible types
export type {
  Passage,
  PassageComplete,
  TranslationDataFormat,
  TranslationContentArray,
  TranslationContentMap,
  TranslationContent,
  TranslationFileMeta,
  TranslationFile,
  TranslationKey,
  TranslationMeta,
  BookNaming,
  BookNamingV2,
} from './bible'

// Search types
export type {
  SearchOptions,
  Progress,
  SearchResult,
} from './search'

// Format types
export type {
  FormatTemplateData,
  Formatted,
  PassageFormat,
  CopyTemplateData,
} from './format'

// Highlight types
export type {
  PassageHighlight,
  HighlightColor,
  HighlightConfig,
  Highlights,
  HighlightsLegacy,
} from './highlight'

// Settings types
export type {
  LocaleSymbol,
  LanguageSymbol,
  ScreenMode,
  PassageListLayout,
  AppSettings,
  LocaleNaming,
  LocaleTranslations,
  LocaleDataV2,
  LocaleData,
  Localized,
  SettingsPersist,
  SettingsPersistV2,
} from './settings'
