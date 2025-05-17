import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'
import { getDefaultLocale, getLang, LOCAL_STORAGE_KEY } from 'src/util'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { bookNamings, formatTemplates, copyTemplates } from 'src/logic/data'
import { PassageListLayout, ScreenMode, SettingsPersistType, LocaleSymbol, BookNaming, FormatTemplateData, Localized } from 'src/types'


// Create a local i18n instance to use in Store
const i18n = createI18n({
  locale: getDefaultLocale(),
  legacy: false,
  messages,
})

const locale = getDefaultLocale()

/** this value is persisted in the LocalStorage */
const initialPersistValue: SettingsPersistType = {
  version: '3',
  app: {
    defaultLocale: locale,
    fontSize: 16,
    screenMode: 'dark' as ScreenMode,
    primaryColor: '', // Default depends on screen mode
    appFormatTemplateName: 'App format',
    defaultSearchResultLayout: 'split' as PassageListLayout,
    referencePickerOnStart: true,
  },
  locales: ['en-US', 'pl-PL'],
  localeData: {
    'en-US': {
      naming: {
        available: getBookNamings('en'),
        default: 'SBL abbreviations'
      },
      editions: {
        available: ['KJV', 'NLT'],
        selected: ['KJV', 'NLT'],
        default: 'KJV'
      },
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
    },
    'pl-PL': {
      naming: {
        available: getBookNamings('pl'),
        default: 'Moje pl'
      },
      editions: {
        available: ['EIB', 'BT5', 'UBG'],
        selected: ['EIB', 'BT5', 'UBG'],
        default: 'UBG'
      },
      copyTemplates: copyTemplates['pl-PL']!,
      defaultCopyTemplate: 'Prezentacja',
    }
  },
  formatTemplates,
}

function getBookNamings(localeOrLang: string): BookNaming[] {
  const localLang = getLang(localeOrLang)
  return bookNamings
    .filter(_ => getLang(_.locale) === localLang)
    .map(_ => ({ ..._, booksText: _.books.join(', ') }))
    .sort((a, b) => a.name.localeCompare(b.name, localLang, { sensitivity: 'base', ignorePunctuation: true }))
}

export const useSettingsStore = defineStore('settings', () => {
  // Ensure initialPersistValue has valid default structure
  const persist = useStorage(LOCAL_STORAGE_KEY + '.settings', initialPersistValue, localStorage, { deep: true })

  // Initialize app structure if it doesn't exist
  if (!persist.value.app) {
    persist.value.app = initialPersistValue.app
  }

  // Initialize locales and localeData if they don't exist
  if (!persist.value.locales || !Array.isArray(persist.value.locales) || persist.value.locales.length === 0) {
    persist.value.locales = initialPersistValue.locales
  }

  if (!persist.value.localeData) {
    persist.value.localeData = initialPersistValue.localeData
  }

  // Migration function to handle version upgrades
  function migrateSettings() {
    // Migrate from version 1 to version 2
    if (persist.value.version === '1') {
      console.log('Migrating settings from v1 to v2')

      // Add referenceWithoutContent property to all templates
      for (const template of persist.value.formatTemplates) {
        if (template.referenceWithoutContent === undefined) {
          template.referenceWithoutContent = false
        }
      }

      // Create or update the "Reference only" template with the correct translation
      // We'll use the shared function to ensure consistency
      updateReferenceOnlyTemplateName()

      // Add a copy template with the Reference only format template for each locale
      if (persist.value.localeData) {
        for (const locale of Object.keys(persist.value.localeData) as LocaleSymbol[]) {
          const translatedName = i18n.global.t('settingsFormatTemplates.referenceOnly')
          const localeData = persist.value.localeData[locale]

          if (localeData && localeData.copyTemplates) {
            // Check if a template already exists with this format template
            const exists = localeData.copyTemplates.some(t => t.formatTemplate === translatedName)

            if (!exists && localeData.naming && localeData.naming.available) {
              // Get the default book naming for this locale
              const defaultBookNaming = localeData.naming.available[0]?.name || ''

              // Add a new copy template using the Reference only format template
              localeData.copyTemplates.push({
                'name': translatedName,
                'formatTemplate': translatedName,
                'bookNaming': defaultBookNaming
              })
            }
          }
        }
      }

      // Update version
      persist.value.version = '2'
    }

    // Migrate from version 2 to version 3
    if (persist.value.version === '2') {
      console.log('Migrating settings from v2 to v3')

      // Create a new version 3 structure from the old version 2 format
      const oldSettings = JSON.parse(JSON.stringify(persist.value))
      const newSettings = migrateV2ToV3(oldSettings)

      // Replace the current settings with the new structure
      Object.keys(newSettings).forEach(key => {
        persist.value[key] = newSettings[key]
      })

      // Update version
      persist.value.version = '3'
    }
  }

  // Function to migrate from version 2 to version 3
  function migrateV2ToV3(oldSettings: Partial<SettingsPersistType> & { appearance?: { locale?: string, fontSize?: number, screenMode?: ScreenMode, primaryColor?: string }, localized?: Record<string, Partial<Localized>> }): SettingsPersistType {
    // Start with a fresh version 3 structure 
    const newSettings: SettingsPersistType = {
      version: '3',
      app: {
        defaultLocale: oldSettings.appearance?.locale || 'en-US',
        fontSize: oldSettings.appearance?.fontSize || 16,
        screenMode: oldSettings.appearance?.screenMode || 'dark',
        primaryColor: oldSettings.appearance?.primaryColor || '',
        appFormatTemplateName: oldSettings.appFormatTemplateName || 'App format',
        defaultSearchResultLayout: oldSettings.defaultSearchResultLayout || 'split',
        referencePickerOnStart: oldSettings.referencePickerOnStart !== undefined ? oldSettings.referencePickerOnStart : true,
      },
      locales: [],
      localeData: {} as Record<LocaleSymbol, LocaleData>,
      formatTemplates: oldSettings.formatTemplates || []
    }

    // Extract locale keys from the old settings
    const localeKeys = Object.keys(oldSettings.localized || {}) as LocaleSymbol[]
    newSettings.locales = localeKeys

    // Migrate locale-specific settings
    localeKeys.forEach(localeKey => {
      const oldLocale = oldSettings.localized[localeKey]

      // Create locale data structure
      newSettings.localeData[localeKey] = {
        naming: {
          available: oldLocale.bookNamings || [],
          default: oldLocale.appBookNaming || (oldLocale.bookNamings?.[0]?.name || '')
        },
        editions: {
          available: oldLocale.selectedEditions || [],
          selected: oldLocale.selectedEditions || [],
          default: oldLocale.defaultEdition || (oldLocale.selectedEditions?.[0] || '')
        },
        copyTemplates: oldLocale.copyTemplates || [],
        defaultCopyTemplate: oldLocale.defaultCopyTemplate || 'Presentation'
      }

      // Ensure all naming objects have a booksText property
      if (newSettings.localeData[localeKey].naming.available) {
        newSettings.localeData[localeKey].naming.available.forEach(naming => {
          if (!naming.booksText && naming.books) {
            naming.booksText = naming.books.join(', ')
          }
        })
      }
    })

    return newSettings
  }

  // Run migrations if needed
  migrateSettings()

  // Ensure 'Reference only' template has the correct name for the current locale
  updateReferenceOnlyTemplateName()

  /** Current locale symbol */
  const currentLocale = computed(() => persist.value.app?.defaultLocale || locale)

  /** Current locale data */
  const currentLocaleData = computed(() => {
    const localeKey = currentLocale.value
    return persist.value.localeData?.[localeKey] || initialPersistValue.localeData[localeKey]
  })

  /** Book naming for current locale */
  const currentBookNaming = computed(() => {
    if (!currentLocaleData.value?.naming) return undefined
    const namingId = currentLocaleData.value.naming.default
    return currentLocaleData.value.naming.available.find(n => n.name === namingId)
  })

  /** Books in current locale's selected naming scheme */
  const appBookNames = computed(() => currentBookNaming.value?.books || [])

  /** Current format template */
  const appFormatTemplate = computed(() => {
    const templateName = persist.value.app?.appFormatTemplateName
    return templateName ? persist.value.formatTemplates?.find(it => it.name === templateName) : undefined
  })

  /** Language currently focused in the settings to store the accordion state for edition or filter items in namings*/
  const focusedLocale = ref<LocaleSymbol>(persist.value.app?.defaultLocale || locale)
  const focusedLocalized = computed(() => {
    return persist.value.localeData?.[focusedLocale.value] || initialPersistValue.localeData[focusedLocale.value]
  })

  const locales = computed(() => (persist.value.locales || initialPersistValue.locales) as LocaleSymbol[])

  // Update the name of the "Reference only" template with the correct translation
  function updateReferenceOnlyTemplateName() {
    // Get the translated name for the Reference only template
    const translatedName = i18n.global.t('settingsFormatTemplates.referenceOnly')

    // Find any existing Reference only template (either with the English name or a translation)
    const referenceOnlyTemplate = persist.value.formatTemplates.find(t =>
      t.name === 'Reference only' || // English name
      t.referenceWithoutContent === true // Identifying feature of this template
    )

    // Store the old name before updating it
    const oldName = referenceOnlyTemplate?.name || 'Reference only'

    if (referenceOnlyTemplate) {
      // Update the name of the existing template
      referenceOnlyTemplate.name = translatedName
    } else {
      // If no template exists, create a new one
      persist.value.formatTemplates.push({
        'name': translatedName,
        'referencePosition': 'before',
        'referenceLine': 'same line',
        'editionAbbreviation': 'uppercase',
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
        'editionAbbreviationCharsBefore': '',
        'editionAbbreviationCharsAfter': ''
      })
    }

    // Update any copy templates that use this format template
    if (persist.value.localeData) {
      for (const locale of Object.keys(persist.value.localeData) as LocaleSymbol[]) {
        const localeData = persist.value.localeData[locale]
        if (localeData && localeData.copyTemplates) {
          for (const copyTemplate of localeData.copyTemplates) {
            // Update both the format template reference and the name if it matches
            if (copyTemplate.formatTemplate === oldName) {
              copyTemplate.formatTemplate = translatedName
            }

            // If the copy template name is the same as the old format template name,
            // update the copy template name too
            if (copyTemplate.name === oldName) {
              copyTemplate.name = translatedName
            }
          }
        }
      }
    }
  }

  // Watch for locale changes to ensure the Reference only template exists with the correct translation
  watch(() => persist.value.app?.defaultLocale, (newLocale) => {
    if (newLocale) {
      // Update the i18n locale
      i18n.global.locale.value = newLocale

      // Update the Reference only template name
      updateReferenceOnlyTemplateName()
    }
  })

  const currentTab = ref('general')

  function reset() {
    for (const key in initialPersistValue) {
      persist.value[key] = initialPersistValue[key]
    }
  }

  // Helper functions
  function getBookNamingForLocale(locale: LocaleSymbol, namingId?: string): BookNaming | undefined {
    const localeData = persist.value.localeData?.[locale] || initialPersistValue.localeData[locale]
    if (!localeData?.naming?.available) return undefined

    const namingToUse = namingId || localeData.naming.default
    return localeData.naming.available.find(n => n.name === namingToUse)
  }

  function getFormatTemplate(templateId: string): FormatTemplateData | undefined {
    if (!templateId || !persist.value.formatTemplates) return undefined
    return persist.value.formatTemplates.find(t => t.name === templateId)
  }

  return {
    appBookNames,
    appFormatTemplate,
    currentLocale,
    currentLocaleData,
    currentBookNaming,
    currentTab,
    getBookNamings,
    getBookNamingForLocale,
    getFormatTemplate,
    focusedLocale,
    focusedLocalized,
    locales,
    persist,
    reset
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
