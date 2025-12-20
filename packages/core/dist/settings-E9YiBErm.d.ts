import { C as CopyTemplateData, F as FormatTemplateData } from './format-CbHAj5C_.js';
import { b as Highlights } from './highlight-BO7FLPJ2.js';
import { i as BookNamingV2, B as BookNaming } from './bible-DkEBp6kG.js';

/**
 * Settings types - framework-agnostic
 */

/**
 * Supported locale symbols
 */
type LocaleSymbol = 'en-US' | 'pl-PL' | 'pt-BR' | 'pt-PT' | 'es-ES' | 'uk-UA';
/**
 * Language symbol (more permissive)
 */
type LanguageSymbol = string;
/**
 * Screen display mode
 */
type ScreenMode = 'dark' | 'light' | 'auto';
/**
 * Passage list layout mode
 */
type PassageListLayout = 'split' | 'formatted';
/**
 * Application settings
 */
type AppSettings = {
    defaultLocale: LocaleSymbol;
    fontSize: number;
    screenMode: ScreenMode;
    appFormatTemplateName: string;
    defaultSearchResultLayout: PassageListLayout;
    referencePickerOnStart: boolean;
    inlineVerseNumbers: boolean;
    superscriptVerseNumbers: boolean;
    underlineVerseHighlight: boolean;
    continuousVerses: boolean;
};
/**
 * Locale-specific naming configuration
 */
type LocaleNaming = {
    available: BookNamingV2[];
    default: string;
};
/**
 * Locale-specific translation configuration
 */
type LocaleTranslations = {
    available: string[];
    selected: string[];
    default: string;
    highlightsEnabled?: Record<string, boolean>;
};
/**
 * Locale data (v2 format)
 */
type LocaleDataV2 = {
    naming: LocaleNaming;
    translations: LocaleTranslations;
    copyTemplates: CopyTemplateData[];
    defaultCopyTemplate: string;
};
/**
 * Legacy locale data format
 */
interface LocaleData {
    naming: {
        available: BookNaming[];
        default: string;
    };
    translations: {
        available: string[];
        selected: string[];
        default: string;
    };
    copyTemplates: CopyTemplateData[];
    defaultCopyTemplate: string;
}
/**
 * Localized settings data
 */
type Localized = {
    appBookNaming: string;
    bookNamings: BookNamingV2[];
    copyTemplates: CopyTemplateData[];
    defaultCopyTemplate: string;
    selectedTranslations: string[];
    defaultTranslation: string;
};
/**
 * Complete persisted settings (current version)
 */
type SettingsPersist = {
    [key: string]: unknown;
    version: string;
    app: AppSettings;
    locales: LocaleSymbol[];
    localeData: Record<LocaleSymbol, LocaleDataV2>;
    formatTemplates: FormatTemplateData[];
    highlights?: Highlights;
};
/**
 * Legacy persisted settings (v2)
 */
type SettingsPersistV2 = Partial<SettingsPersist> & {
    appearance?: {
        locale?: string;
        fontSize?: number;
        screenMode?: ScreenMode;
        primaryColor?: string;
    };
    localized: Record<LocaleSymbol, Partial<Localized>>;
    formatTemplates: Array<Partial<FormatTemplateData>>;
    appFormatTemplateName?: string;
    defaultSearchResultLayout?: string;
    referencePickerOnStart?: boolean;
};

export type { AppSettings as A, LocaleSymbol as L, PassageListLayout as P, ScreenMode as S, LanguageSymbol as a, LocaleNaming as b, LocaleTranslations as c, LocaleDataV2 as d, LocaleData as e, Localized as f, SettingsPersist as g, SettingsPersistV2 as h };
