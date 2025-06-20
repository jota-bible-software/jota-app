import messages from 'src/i18n'
import { BookNamingV2, LocaleDataV2, LocaleSymbol, PassageListLayout, SettingsPersist, SettingsPersistV2 } from 'src/types'
import { createI18n } from 'vue-i18n'

// Create a local i18n instance for migration
const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages,
})

const REFERENCE_ONLY = 'Reference only'

export function migrateSettings(persist: Record<string, unknown> & { version: string }) {

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
