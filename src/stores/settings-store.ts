import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'
import { getDefaultLocale, getLang, LOCAL_STORAGE_KEY } from 'src/util'
import { Ref, computed, ref, watch } from 'vue'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { bookNamings, formatTemplates, copyTemplates } from 'src/logic/data'
import { PassageListLayout, ScreenMode, SettingsPersistType, Localized, LocaleSymbol, BookNaming } from 'src/types'


// Create a local i18n instance to use in Store
const i18n = createI18n({
  locale: getDefaultLocale(),
  legacy: false,
  messages,
})

const locale = getDefaultLocale()

/** this value is persisted in the LocalStorage */
const initialPersistValue: SettingsPersistType = {
  version: '2',
  appearance: {
    locale,
    fontSize: 16,
    screenMode: 'dark' as ScreenMode,
    primaryColor: '', // Default depends on screen mode
  },
  localized: {
    'ar-SA': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'), // Fallback to English book names
      copyTemplates: copyTemplates['en-US']!, // Fallback to English templates
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['AVD'],
      defaultEdition: 'AVD',
    },
    'cs-CZ': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['B21', 'BKR'],
      defaultEdition: 'B21',
    },
    'da-DK': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['D92', 'D31'],
      defaultEdition: 'D92',
    },
    'de-DE': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['ELB', 'SCH', 'L45'],
      defaultEdition: 'ELB',
    },
    'el-GR': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['LXT', 'GNT-BIZ'],
      defaultEdition: 'LXT',
    },
    'en-US': {
      appBookNaming: 'SBL abbreviations',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['KJV', 'NLT'],
      defaultEdition: 'KJV',
    },
    'eo': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['ESP'],
      defaultEdition: 'ESP',
    },
    'es-ES': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['R60', 'LBA', 'RVG'],
      defaultEdition: 'R60',
    },
    'fi-FI': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['FIN'],
      defaultEdition: 'FIN',
    },
    'fr-FR': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['LSG', 'FBJ', 'BFC'],
      defaultEdition: 'LSG',
    },
    'he-IL': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['BHS', 'WLC'],
      defaultEdition: 'WLC',
    },
    'hr-HR': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['CRO'],
      defaultEdition: 'CRO',
    },
    'hu-HU': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['HUN'],
      defaultEdition: 'HUN',
    },
    'it-IT': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['NRV', 'LND', 'IEP'],
      defaultEdition: 'NRV',
    },
    'la': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['VUC', 'NOV'],
      defaultEdition: 'NOV',
    },
    'lt-LT': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['LTB'],
      defaultEdition: 'LTB',
    },
    'nl-NL': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['NBG', 'SVV'],
      defaultEdition: 'NBG',
    },
    'pl-PL': {
      appBookNaming: 'Moje pl',
      bookNamings: getBookNamings('pl'),
      copyTemplates: copyTemplates['pl-PL']!,
      defaultCopyTemplate: 'Prezentacja',
      selectedEditions: ['EIB', 'BT5', 'UBG'],
      defaultEdition: 'UBG',
    },
    'pt-BR': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['ARA', 'ACF', 'SBP'],
      defaultEdition: 'ARA',
    },
    'ru-RU': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['RST', 'CRV'],
      defaultEdition: 'RST',
    },
    'sk-SK': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['SSV'],
      defaultEdition: 'SSV',
    },
    'sv-SE': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['S00', 'SFB', 'S17'],
      defaultEdition: 'S00',
    },
    'uk-UA': {
      appBookNaming: 'Standard',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['UKR'],
      defaultEdition: 'UKR',
    }
  },
  formatTemplates,
  appFormatTemplateName: 'App format',
  defaultCopyTemplate: 'Studium',
  defaultSearchResultLayout: 'split' as PassageListLayout,
  referencePickerOnStart: true,
}

function getBookNamings(localeOrLang: string): BookNaming[] {
  const localLang = getLang(localeOrLang)
  return bookNamings
    .filter(_ => getLang(_.locale) === localLang)
    .map(_ => ({ ..._, booksText: _.books.join(', ') }))
    .sort((a, b) => a.name.localeCompare(b.name, localLang, { sensitivity: 'base', ignorePunctuation: true }))
}

export const useSettingsStore = defineStore('settings', () => {
  const persist = useStorage(LOCAL_STORAGE_KEY + '.settings', initialPersistValue, localStorage, { deep: true })
  
  // Ensure all locales exist in the persisted data
  function ensureLocalesExist() {
    // These are all the locales defined in LocaleSymbol type
    const allExpectedLocales = [
      'ar-SA', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-US', 'eo', 'es-ES', 
      'fi-FI', 'fr-FR', 'he-IL', 'hr-HR', 'hu-HU', 'it-IT', 'la', 'lt-LT', 
      'nl-NL', 'pl-PL', 'pt-BR', 'ru-RU', 'sk-SK', 'sv-SE', 'uk-UA'
    ] as LocaleSymbol[]
    
    // Check if all locales exist in the persisted data
    allExpectedLocales.forEach(locale => {
      if (!persist.value.localized[locale]) {
        console.log(`Adding missing locale: ${locale}`)
        // Add the locale with default settings
        persist.value.localized[locale] = {
          appBookNaming: 'Standard',
          bookNamings: getBookNamings('en'), // Fallback to English
          copyTemplates: copyTemplates['en-US'] || [], // Fallback to English or empty array
          defaultCopyTemplate: 'Presentation',
          selectedEditions: [],
          defaultEdition: '' // Empty string indicates no default edition selected yet
        }
      }
    })
  }
  
  // Call this function to ensure all locales exist
  ensureLocalesExist()

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
      for (const locale of Object.keys(persist.value.localized) as LocaleSymbol[]) {
        const translatedName = i18n.global.t('settingsFormatTemplates.referenceOnly')
        const localized = persist.value.localized[locale]
        
        // Check if a template already exists with this format template
        const exists = localized.copyTemplates.some(t => t.formatTemplate === translatedName)
        
        if (!exists) {
          // Get the default book naming for this locale
          const defaultBookNaming = localized.bookNamings[0]?.name || ''
          
          // Add a new copy template using the Reference only format template
          localized.copyTemplates.push({
            'name': translatedName,
            'formatTemplate': translatedName,
            'bookNaming': defaultBookNaming
          })
        }
      }
      
      // Update version
      persist.value.version = '2'
    }
  }
  
  // Run migrations if needed
  migrateSettings()
  
  // Run ensureLocalesExist again after migrations
  ensureLocalesExist()
  
  // Ensure 'Reference only' template has the correct name for the current locale
  updateReferenceOnlyTemplateName()

  /** Language symbol of the currently selected locale for the application*/
  const localized: Ref<Localized> = computed(() => persist.value.localized[persist.value.appearance.locale])
  const appBookNames = computed(() => localized.value.bookNamings.find(it => it.name === localized.value.appBookNaming)?.books || [])
  const appFormatTemplate = computed(() => persist.value.formatTemplates.find(it => it.name === persist.value.appFormatTemplateName))

  /** Language currently focused in the settings to store the accordion state for edition or filter items in namings*/
  const focusedLocale = ref<LocaleSymbol>(persist.value.appearance.locale)
  const focusedLocalized = computed(() => persist.value.localized[focusedLocale.value])

  const locales = computed(() => Object.keys(persist.value.localized).sort() as LocaleSymbol[])

  // Update the name of the "Reference only" template with the correct translation
  function updateReferenceOnlyTemplateName() {
    // Make sure all expected locales exist before proceeding
    ensureLocalesExist()
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
    for (const locale of Object.keys(persist.value.localized) as LocaleSymbol[]) {
      for (const copyTemplate of persist.value.localized[locale].copyTemplates) {
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
  
  // Watch for locale changes to ensure the Reference only template exists with the correct translation
  watch(() => persist.value.appearance.locale, (newLocale) => {
    // Update the i18n locale
    i18n.global.locale.value = newLocale
    
    // Update the Reference only template name
    updateReferenceOnlyTemplateName()
  })

  const currentTab = ref('general')

  function reset() {
    for (const key in initialPersistValue) {
      persist.value[key] = initialPersistValue[key]
    }
  }

  return { appBookNames, appFormatTemplate, currentTab, getBookNamings, focusedLocale, focusedLocalized, locales, localized, persist, reset }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
