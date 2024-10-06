import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'
import { getDefaultLocale, LOCAL_STORAGE_KEY } from 'src/util'
import { Ref, computed } from 'vue'
import { bookNamings, editionsData, formatTemplates, copyTemplates } from 'src/logic/data'
import { LanguageSymbol, PassageListLayout, ScreenMode, SettingsPersistType, LanguageSettings } from 'src/types'


const locale = getDefaultLocale()

/** this value is persisted in the LocalStorage */
const initialPersistValue: SettingsPersistType = {
  version: '1',
  appearance: {
    locale,
    fontSize: 16,
    screenMode: 'dark' as ScreenMode,
    primaryColor: '', // Default depends on screen mode
  },
  languageSettings: {
    en: {
      appBookNaming: 'SBL abbreviations',
      bookNamings: bookNamings.filter(it => it.lang === 'en'),
      selectedEditions: ['KJV', 'NIV', 'NLT'],
      defaultEdition: 'KJV',
    },
    pl: {
      appBookNaming: 'Moje pl',
      bookNamings: bookNamings.filter(it => it.lang === 'pl'),
      selectedEditions: ['EIB', 'BW', 'UBG'],
      defaultEdition: 'UBG',
    }
  },
  formatTemplates,
  copyTemplates,
  appFormatTemplateName: 'App format',
  defaultCopyTemplate: 'Studium',
  defaultSearchResultLayout: 'split' as PassageListLayout,
  referencePickerOnStart: true,
}

export const useSettingsStore = defineStore('settings', () => {
  const persist = useStorage(LOCAL_STORAGE_KEY + '.settings', initialPersistValue, localStorage, { deep: true })

  const lang: Ref<LanguageSymbol> = computed(() => persist.value.appearance.locale.split('-')[0] as LanguageSymbol)
  const languageSettings: Ref<LanguageSettings> = computed(() => persist.value.languageSettings[lang.value])
  const appBookNames = computed(() => languageSettings.value.bookNamings.find(it => it.name === languageSettings.value.appBookNaming)?.books || [])
  const appFormatTemplate = computed(() => persist.value.formatTemplates.find(it => it.name === persist.value.appFormatTemplateName))

  // Computed

  /** List of book namings for the currently selected lang in langDefaults */
  const bookNamingList = computed(() => bookNamings
    .filter(_ => _.lang === lang.value)
    .map(_ => ({ ..._, booksText: _.books.join(', ') }))
    .sort((a, b) => a.name.localeCompare(b.name, lang.value, { sensitivity: 'base', ignorePunctuation: true })))


  const localeEditions = computed(() => editionsData.filter(it => it.lang === lang.value).map(it => it.symbol).sort())

  function nameSorter(a: { name: string }, b: { name: string }) {
    return a.name.localeCompare(b.name, lang.value, { sensitivity: 'base', ignorePunctuation: true })
  }

  function reset() {
    for (const key in initialPersistValue) {
      persist.value[key] = initialPersistValue[key]
    }
  }

  return {
    appBookNames, appFormatTemplate, bookNamingList, lang, localeEditions,
    /** Contains settings for the language in the currently selected locale (settings.persist.appearance.locale) */
    languageSettings,
    nameSorter, persist, reset
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
