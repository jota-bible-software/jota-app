import messages from 'src/i18n'
import { BookNamingV2, FormatTemplateData, HighlightsLegacy, LocaleDataV2, LocaleSymbol, LocaleTranslations, PassageListLayout, SettingsPersist, SettingsPersistV2 } from 'src/types'
import { createI18n } from 'vue-i18n'
import { LOCAL_STORAGE_KEY } from 'src/util'

// Create a local i18n instance for migration
const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages,
})

const REFERENCE_ONLY = 'Reference only'

export function migrateSettings(persist: Record<string, unknown> & { version: string }, currentLocale: Ref<LocaleSymbol>) {

  if (persist.version === '1') {
    console.log('Migrating settings from v1 to v2')
    migrateV1ToV2(persist as SettingsPersistV2)
    persist.version = '2'
  }

  if (persist.version === '2') {
    console.log('Migrating settings from v2 to v3')
    const oldSettings = JSON.parse(JSON.stringify(persist))
    const newSettings = migrateV2ToV3(oldSettings)
    Object.keys(newSettings).forEach(key => {
      persist[key] = newSettings[key]
    })
    persist.version = '3'
  }

  if (persist.version === '3') {
    console.log('Migrating settings from v3 to v4')
    migrateV3ToV4(persist as SettingsPersist)
    persist.version = '4'
  }

  if (persist.version === '4') {
    console.log('Migrating settings from v4 to v5')
    migrateV4ToV5(persist as SettingsPersist)
    persist.version = '5'
  }

  if (persist.version === '5') {
    console.log('Migrating settings from v5 to v6')
    migrateV5ToV6(persist as SettingsPersist)
    persist.version = '6'
  }

<<<<<<< HEAD
=======
  if (persist.version === '6') {
    console.log('Migrating settings from v6 to v7')
    migrateV6ToV7(persist as SettingsPersist)
    persist.version = '7'
  }

  if (persist.version === '7') {
    console.log('Migrating settings from v7 to v8')
    migrateV7ToV8()
    persist.version = '8'
  }

>>>>>>> b80772d (Highlighting)
  // Post-migration validation to ensure data integrity
  console.log('Validating post-migration settings')
  validatePostMigration(persist as SettingsPersist, currentLocale)
}

export function migrateV1ToV2(persist: SettingsPersistV2) {
  // Add referenceWithoutContent property to all templates
  for (const template of persist.formatTemplates) {
    if (template.referenceWithoutContent === undefined) {
      template.referenceWithoutContent = false
    }
  }

  // Add "Reference only" if it does not exist
  createReferenceOnlyTemplates(persist)

  // Add a copy template with the Reference only format template for each locale

  for (const locale of Object.keys(persist.localized) as LocaleSymbol[]) {
    const translatedName = i18n.global.t('settingsFormatTemplates.referenceOnly', {}, { locale })
    const localized = persist.localized[locale]

    if (localized && localized.copyTemplates) {
      const exists = localized.copyTemplates.some((t) => t.formatTemplate === translatedName)
      if (!exists && localized.bookNamings) {
        const defaultBookNaming = localized.appBookNaming || localized.bookNamings[0]?.name
        if (!defaultBookNaming) {
          localized.copyTemplates.push({
            name: translatedName,
            formatTemplate: REFERENCE_ONLY,
            bookNaming: defaultBookNaming
          })
        }
      }
    }

  }
}

export function migrateV2ToV3(oldSettings: SettingsPersistV2): SettingsPersist {
  const newSettings: SettingsPersist = {
    version: '3',
    app: {
      defaultLocale: oldSettings.appearance?.locale as LocaleSymbol || 'en-US',
      fontSize: oldSettings.appearance?.fontSize || 16,
      screenMode: oldSettings.appearance?.screenMode || 'dark',
      appFormatTemplateName: oldSettings.appFormatTemplateName || 'App format',
      defaultSearchResultLayout: (oldSettings.defaultSearchResultLayout as PassageListLayout) || 'split',
      referencePickerOnStart: oldSettings.referencePickerOnStart !== undefined ? oldSettings.referencePickerOnStart : true,
      inlineVerseNumbers: false,
      superscriptVerseNumbers: false,
      underlineVerseHighlight: false,
      continuousVerses: false,
      highlightingEnabled: true,
    },
    locales: [],
    localeData: {} as Record<LocaleSymbol, LocaleDataV2>,
    formatTemplates: oldSettings.formatTemplates || []
  }

  const localeKeys = Object.keys(oldSettings.localized || {}) as LocaleSymbol[]
  newSettings.locales = localeKeys

  localeKeys.forEach((localeKey: LocaleSymbol) => {
    const oldLocale = oldSettings.localized![localeKey]
    newSettings.localeData[localeKey] = {
      naming: {
        available: oldLocale.bookNamings || [],
        default: oldLocale.appBookNaming || (oldLocale.bookNamings?.[0]?.name || '')
      },
      translations: {
        available: oldLocale.selectedTranslations || [],
        selected: oldLocale.selectedTranslations || [],
        default: oldLocale.defaultTranslation || (oldLocale.selectedTranslations?.[0] || '')
      },
      copyTemplates: oldLocale.copyTemplates || [],
      defaultCopyTemplate: oldLocale.defaultCopyTemplate || 'Presentation'
    }

    if (newSettings.localeData[localeKey].naming.available) {
      newSettings.localeData[localeKey].naming.available.forEach((naming: BookNamingV2) => {
        if (!naming.booksText && naming.books) {
          naming.booksText = naming.books.join(', ')
        }
      })
    }
  })

  return newSettings
}

export function migrateV3ToV4(persist: SettingsPersist) {
  // Migrate from editionAbbreviation to translationAbbreviation in format templates
  if (persist.formatTemplates) {
    for (const template of persist.formatTemplates) {
      // Type assertion to access the old properties
      const templateWithOldProps = template as FormatTemplateData & {
        editionAbbreviationCharsBefore?: string
        editionAbbreviationCharsAfter?: string
      }

      // Migrate editionAbbreviationCharsBefore to translationAbbreviationCharsBefore
      if ('editionAbbreviationCharsBefore' in templateWithOldProps && templateWithOldProps.editionAbbreviationCharsBefore !== undefined) {
        template.translationAbbreviationCharsBefore = templateWithOldProps.editionAbbreviationCharsBefore
        delete templateWithOldProps.editionAbbreviationCharsBefore
      }

      // Migrate editionAbbreviationCharsAfter to translationAbbreviationCharsAfter
      if ('editionAbbreviationCharsAfter' in templateWithOldProps && templateWithOldProps.editionAbbreviationCharsAfter !== undefined) {
        template.translationAbbreviationCharsAfter = templateWithOldProps.editionAbbreviationCharsAfter
        delete templateWithOldProps.editionAbbreviationCharsAfter
      }
    }
  }

}

export function migrateV4ToV5(persist: SettingsPersist) {
  // Migrate from persist.localeData.<locale>.editions to translations
  if (persist.localeData) {
    for (const localeKey of Object.keys(persist.localeData) as LocaleSymbol[]) {
      const localeData = persist.localeData[localeKey] as LocaleDataV2 & {
        editions?: LocaleTranslations
      }

      // If editions exists and translations doesn't, migrate editions to translations
      if ('editions' in localeData && localeData.editions && !localeData.translations) {
        localeData.translations = localeData.editions
        delete localeData.editions
      }
    }
  }

}

export function migrateV5ToV6(persist: SettingsPersist) {
  // Add highlightingEnabled to app settings
  if (persist.app && persist.app.highlightingEnabled === undefined) {
    persist.app.highlightingEnabled = true
  }

  // Initialize highlights structure if not present
  if (!persist.highlights) {
    persist.highlights = {
      translation: { locale: persist.app.defaultLocale, symbol: '' },
      passageHighlights: [],
      config: {
        colors: [
          { id: 'hl-yellow', name: 'Study', hex: '#ffeb3b', order: 0 },
          { id: 'hl-green', name: 'Promises', hex: '#4caf50', order: 1 },
          { id: 'hl-blue', name: 'Commands', hex: '#2196f3', order: 2 },
          { id: 'hl-orange', name: 'Prayer', hex: '#ff9800', order: 3 },
          { id: 'hl-pink', name: 'Important', hex: '#e91e63', order: 4 },
          { id: 'hl-purple', name: 'Prophecy', hex: '#9c27b0', order: 5 },
          { id: 'hl-red', name: 'Warnings', hex: '#f44336', order: 6 },
          { id: 'hl-gray', name: 'Notes', hex: '#9e9e9e', order: 7 }
        ],
        active: 'hl-yellow'
      }
    }
  }
}

<<<<<<< HEAD
=======
export function migrateV6ToV7(persist: SettingsPersist) {
  // Migrate from global highlightingEnabled to per-translation highlightsEnabled
  // Enable highlights only for default translations in each locale
  if (persist.localeData) {
    for (const localeKey of Object.keys(persist.localeData) as LocaleSymbol[]) {
      const localeData = persist.localeData[localeKey]
      if (localeData?.translations) {
        // Initialize highlightsEnabled object if not present
        if (!localeData.translations.highlightsEnabled) {
          localeData.translations.highlightsEnabled = {}
        }

        // Enable highlights for the default translation
        const defaultTranslation = localeData.translations.default
        if (defaultTranslation) {
          localeData.translations.highlightsEnabled[defaultTranslation] = true
        }

        // All other translations default to false (handled by the getter)
      }
    }
  }
}

export function migrateV7ToV8() {
  // Migrate highlights from single-translation format to multi-translation format
  // This migration reads directly from localStorage since the structure has changed
  try {
    const highlightsKey = LOCAL_STORAGE_KEY + '.highlights'
    const storedData = localStorage.getItem(highlightsKey)

    if (!storedData) return

    const oldHighlights = JSON.parse(storedData) as HighlightsLegacy

    // Check if it's already in new format
    if ('byTranslation' in oldHighlights) {
      console.log('Highlights already in new format, skipping migration')
      return
    }

    // Check if it's in legacy format with translation and passageHighlights
    if ('translation' in oldHighlights && 'passageHighlights' in oldHighlights) {
      const translationKey = `${oldHighlights.translation.locale}:${oldHighlights.translation.symbol}`

      // Convert to new format
      const newHighlights = {
        byTranslation: {
          [translationKey]: oldHighlights.passageHighlights
        },
        config: oldHighlights.config
      }

      // Save in new format
      localStorage.setItem(highlightsKey, JSON.stringify(newHighlights))
      console.log(`Migrated ${oldHighlights.passageHighlights.length} highlights for ${translationKey}`)
    }
  } catch (error) {
    console.error('Error migrating highlights from v7 to v8:', error)
    // Don't throw - we don't want to break the app if highlights migration fails
  }
}

>>>>>>> b80772d (Highlighting)
export function validatePostMigration(persist: SettingsPersist, currentLocale: Ref<LocaleSymbol>) {
  // Ensure at least one translation is selected for each locale
  if (persist.localeData) {
    for (const localeKey of Object.keys(persist.localeData) as LocaleSymbol[]) {
      const localeData = persist.localeData[localeKey]
      if (localeData?.translations) {
        const { available, selected, default: defaultTranslation } = localeData.translations

        if (localeKey === 'en-US') {
          localeData.translations.available = ['KJV', 'NIV', 'NLT']
        } else if (localeKey === 'pl-PL') {
          localeData.translations.available = ['BT5', 'BW', 'EIB', 'UBG']
        }

        // If default translation is not valid, set it to empty
        if (!defaultTranslation || !available.includes(defaultTranslation)) {
          if (selected.length > 0 && available.includes(selected[0])) {
            if (localeKey === currentLocale.value) {
              localeData.translations.default = selected[0]
            }
            localeData.translations.default = ''
          }
        }
      }
    }
  }
}

export function createReferenceOnlyTemplates(persist: SettingsPersistV2) {
  // Don't do anything if the template already exists
  if (!persist.formatTemplates.some((t) => t.referenceWithoutContent === true)) return

  // Create the reference only template
  persist.formatTemplates.push({
    name: REFERENCE_ONLY,
    referencePosition: 'before',
    referenceLine: 'same line',
    translationAbbreviation: 'none',
    numbers: false,
    verseNewLine: false,
    referenceWithoutContent: true,
    separatorChar: ':',
    rangeChar: '-',
    referenceCharsBefore: '',
    referenceCharsAfter: '',
    quoteCharsBefore: '',
    quoteCharsAfter: '',
    verseNumberCharsBefore: '',
    verseNumberCharsAfter: '',
    translationAbbreviationCharsBefore: '',
    translationAbbreviationCharsAfter: ''
  })
}
