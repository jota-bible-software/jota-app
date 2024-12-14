import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'
import { getDefaultLocale, getLang, LOCAL_STORAGE_KEY } from 'src/util'
import { Ref, computed, ref } from 'vue'
import { bookNamings, formatTemplates, copyTemplates } from 'src/logic/data'
import { PassageListLayout, ScreenMode, SettingsPersistType, Localized, LocaleSymbol, BookNaming } from 'src/types'


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
  localized: {
    'en-US': {
      appBookNaming: 'SBL abbreviations',
      bookNamings: getBookNamings('en'),
      copyTemplates: copyTemplates['en-US']!,
      defaultCopyTemplate: 'Presentation',
      selectedEditions: ['KJV'],
      defaultEdition: 'KJV',
    },
    'pl-PL': {
      appBookNaming: 'Moje pl',
      bookNamings: getBookNamings('pl'),
      copyTemplates: copyTemplates['pl-PL']!,
      defaultCopyTemplate: 'Prezentacja',
      selectedEditions: ['EIB', 'BW', 'UBG'],
      defaultEdition: 'UBG',
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

  /** Language symbol of the currently selected locale for the application*/
  const localized: Ref<Localized> = computed(() => persist.value.localized[persist.value.appearance.locale])
  const appBookNames = computed(() => localized.value.bookNamings.find(it => it.name === localized.value.appBookNaming)?.books || [])
  const appFormatTemplate = computed(() => persist.value.formatTemplates.find(it => it.name === persist.value.appFormatTemplateName))

  /** Language currently focused in the settings to store the accordion state for edition or filter items in namings*/
  const focusedLocale = ref<LocaleSymbol>(persist.value.appearance.locale)
  const focusedLocalized = computed(() => persist.value.localized[focusedLocale.value])

  const locales = computed(() => Object.keys(persist.value.localized).sort() as LocaleSymbol[])

  const currentTab = ref('general')

  function reset() {
    for (const key in initialPersistValue) {
      persist.value[key] = initialPersistValue[key]
    }
  }

  return { appBookNames, appFormatTemplate, currentTab,getBookNamings, focusedLocale, focusedLocalized, locales, localized, persist, reset }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
