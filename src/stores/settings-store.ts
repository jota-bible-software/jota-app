import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'
import { getLanguageFromNavigator, LOCAL_STORAGE_KEY } from 'src/util'
import { Ref, computed, ref } from 'vue'
import { bookNamings, translations, formatTemplates, copyTemplates } from 'src/logic/data'
import { LanguageSymbol, PassageListLayout, ScreenMode, TranslationKey, SettingsPersistType } from 'src/types'

function getDefaultTranslation(): TranslationKey {
  const isPolish = navigator.language.toLowerCase().startsWith('pl')
  return isPolish ? { lang: 'pl', symbol: 'UBG' } : { lang: 'en', symbol: 'KJV' }
}

const initialPersistValue: SettingsPersistType = {
  version: '1',
  appearance: {
    defaultLang: getLanguageFromNavigator(),
    fontSize: 16,
    screenMode: 'dark' as ScreenMode,
    primaryColor: '', // Default depends on screen mode
  },
  languageSettings: {
    en: {
      appBookNaming: 'SBL abbreviations',
      bookNamings: bookNamings.filter(it => it.lang === 'en'),
      selectedTranslations: ['KJV', 'NIV', 'NLT'],
    },
    pl: {
      appBookNaming: 'Moje pl',
      bookNamings: bookNamings.filter(it => it.lang === 'pl'),
      selectedTranslations: ['UBG', 'EIB', 'BT5', 'BW'],
    },
  },
  formatTemplates,
  copyTemplates,
  appFormatTemplate: 'App format',
  defaultCopyTemplate: 'Studium',
  defaultSearchResultLayout: 'split' as PassageListLayout,
  defaultTranslation: getDefaultTranslation(),
  referencePickerOnStart: true,
}

export const useSettingsStore = defineStore('settings', () => {
  const persist = useStorage(LOCAL_STORAGE_KEY + '.settings', initialPersistValue)

  const lang: Ref<LanguageSymbol> = ref(persist.value.appearance.defaultLang)
  const language = computed(() => persist.value.languageSettings[lang.value])
  const appBookNames = computed(() => language.value.bookNamings.find(it => it.name === language.value.appBookNaming)?.books || [])
  const appFormatTemplate = computed(() => persist.value.formatTemplates.find(it => it.name === persist.value.appFormatTemplate))

  // Computed

  /** List of book namings for the currently selected lang in langDefaults */
  const bookNamingList = computed(() => bookNamings
    .filter(_ => _.lang === lang.value)
    .map(_ => ({ ..._, booksText: _.books.join(', ') }))
    .sort((a, b) => a.name.localeCompare(b.name, lang.value, { sensitivity: 'base', ignorePunctuation: true })))


  const localeTranslations = computed(() => translations.filter(it => it.lang === lang.value).map(it => it.symbol).sort())

  function nameSorter(a: { name: string }, b: { name: string }) {
    return a.name.localeCompare(b.name, lang.value, { sensitivity: 'base', ignorePunctuation: true })
  }

  function reset() {
    for (const key in initialPersistValue) {
      persist.value[key] = initialPersistValue[key]
    }
  }

  return { appBookNames, appFormatTemplate, bookNamingList, lang, localeTranslations, nameSorter, persist, reset }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
