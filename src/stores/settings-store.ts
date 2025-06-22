import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { localeData } from 'src/data'
import { formatTemplates } from 'src/logic/data'
import { migrateSettings } from 'src/stores/settings-migration'
import { BookNamingV2, FormatTemplateData, LocaleSymbol, PassageListLayout, ScreenMode, SettingsPersist } from 'src/types'
import { getDefaultLocale, LOCAL_STORAGE_KEY } from 'src/util'

const locale = getDefaultLocale()

/** this value is persisted in the LocalStorage */
const initialPersistValue: SettingsPersist = {
  version: '4',
  app: {
    defaultLocale: locale,
    fontSize: 16,
    screenMode: 'dark' as ScreenMode,
    appFormatTemplateName: 'App format',
    defaultSearchResultLayout: 'split' as PassageListLayout,
    referencePickerOnStart: true,
    inlineVerseNumbers: false,
    superscriptVerseNumbers: false,
    underlineVerseHighlight: false,
    continuousVerses: false,
  },
  locales: ['en-US', 'pl-PL'],
  localeData: localeData,
  formatTemplates,
}

// getBookNamings function has been moved to individual locale files

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

  /** Current locale symbol */
  const currentLocale = computed(() => persist.value.app?.defaultLocale as LocaleSymbol || locale)

  // Run migrations if needed
  migrateSettings(persist.value, currentLocale)

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
    return templateName ? persist.value.formatTemplates?.find((it: FormatTemplateData) => it.name === templateName) : undefined
  })

  /** Language currently focused in the settings to store the accordion state for translation or filter items in namings*/
  const focusedLocale = ref<LocaleSymbol>(persist.value.app?.defaultLocale || locale)
  const focusedLocalized = computed(() => {
    return persist.value.localeData?.[focusedLocale.value] || initialPersistValue.localeData[focusedLocale.value]
  })

  const locales = computed(() => (persist.value.locales || initialPersistValue.locales) as LocaleSymbol[])

  const currentTab = ref('general')

  function reset() {
    for (const key in initialPersistValue) {
      persist.value[key] = initialPersistValue[key]
    }
  }

  // Helper functions
  function getBookNamingForLocale(locale: LocaleSymbol, namingId?: string): BookNamingV2 | undefined {
    const localeData = persist.value.localeData?.[locale] || initialPersistValue.localeData[locale]
    if (!localeData?.naming?.available) return undefined

    const namingToUse = namingId || localeData.naming.default
    return localeData.naming.available.find(n => n.name === namingToUse)
  }

  function getFormatTemplate(templateId: string): FormatTemplateData | undefined {
    if (!templateId || !persist.value.formatTemplates) return undefined
    return persist.value.formatTemplates.find((t: FormatTemplateData) => t.name === templateId)
  }

  return {
    appBookNames,
    appFormatTemplate,
    currentLocale,
    currentLocaleData,
    currentBookNaming,
    currentTab,
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
