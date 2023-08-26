import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'
import { LOCAL_STORAGE_KEY } from 'src/logic/util'
import { Ref, computed, ref, watch } from 'vue'
import { appBookAbbreviations, bookNamings, getBookNames, translations } from 'src/logic/data'
import { Lang, PassageFormat, PassageListLayout, ScreenMode } from 'src/types'
import { useTheme } from 'src/composables/useTheme'

export const useSettingsStore = defineStore('settings', () => {
  const persist = useStorage(LOCAL_STORAGE_KEY + '.settings', {
    version: '1',
    defaultLang: navigator.language as Lang,
    screenMode: 'light' as ScreenMode,
    languages: {
      en: {
        bookNamings: bookNamings.filter(it => it.lang === 'en'),
        appBookNaming: 'EIB skrócone'
      },
      pl: {
        bookNamings: bookNamings.filter(it => it.lang === 'pl'),
        appBookNaming: 'EIB skrócone'
      },
    },
    formatTemplates: [
      {
        name: 'English presentation',
        rules: {
          bookNamesStandard: 'en - SBL abbreviations',
          referencePosition: 'after',
          referenceNewLine: 'new line',
          separatorChar: ':',
          quotes: false,
          numbers: false,
          verseNewLine: false,
          translation: 'uppercase'
        }
      },
      {
        name: 'Polska prezentacja',
        rules: {
          bookNamesStandard: 'pl - BT skróty',
          referencePosition: 'after',
          referenceNewLine: 'new line',
          separatorChar: ',',
          quotes: false,
          numbers: false,
          verseNewLine: false,
          translation: 'uppercase'
        }
      },
    ],
    langDefaults: {
      en: {
        appBookNames: getBookNames('en', appBookAbbreviations.en),
        bookNamings: bookNamings.filter(it => it.lang === 'en'),
        passageFormat: {
          bookNames: getBookNames('en', appBookAbbreviations.en),
          referencePosition: 'after',
          referenceNewLine: 'new line',
          separatorChar: ':',
          quotes: false,
          numbers: false,
          verseNewLine: false,
          translation: 'uppercase'
        },
        selectedTranslations: ['NIV', 'NLT'],
        translation: 'NLT',
      },
      pl: {
        appBookNames: getBookNames('pl', appBookAbbreviations.pl),
        bookNamings: bookNamings.filter(it => it.lang === 'pl'),
        passageFormat: {
          bookNames: getBookNames('en', appBookAbbreviations.pl),
          referencePosition: 'after',
          referenceNewLine: 'new line',
          separatorChar: ',',
          quotes: false,
          numbers: false,
          verseNewLine: false,
          translation: 'uppercase'
        },
        selectedTranslations: ['EIB', 'BT5', 'BW', 'UBG'],
        translation: 'UBG',
      }
    } as Record<string, { translation: string, appBookNames: string[], selectedTranslations: string[], passageFormat: PassageFormat }>,
    cachedTranslations: ['en / NLT', 'pl / UBG'],

    defaultPassageFormat: { en: 'English presentation', pl: 'Polska prezentacja' },
    defaultSearchResultLayout: 'split' as PassageListLayout,
  })

  const lang: Ref<Lang> = ref(persist.value.defaultLang)
  const passageFormatEditor: PassageFormat = {
    bookNames: getBookNames('en', appBookAbbreviations.pl),
    referencePosition: 'after',
    referenceNewLine: 'new line',
    separatorChar: ',',
    quotes: false,
    numbers: false,
    verseNewLine: false,
    translation: 'uppercase'
  }

  // Computed

  /** List of book namings for the currently selected lang in langDefaults */
  const bookNamingList = computed(() => bookNamings
    .filter(_ => _.lang === lang.value)
    .map(_ => ({ ..._, booksText: _.books.join(', ') }))
    .sort((a, b) => a.name.localeCompare(b.name)))

  const defaultTranslation = computed({
    get() {
      return { lang: lang.value, symbol: persist.value.langDefaults[lang.value].translation }
    },
    set(value: { lang: Lang, symbol: string }) {
      persist.value.langDefaults[lang.value].translation = value.symbol
    },
  })

  const appBookNames = persist.value.langDefaults[lang.value].appBookNames

  // const defaultAppBookNamesStore = useBookNamesStore('app', persist.value.langDefaults[lang.value].appBookNames)

  // const defaultFormatEditorBookNames = computed({
  //   get(): string[] {
  //     return passageFormatEditor.bookNames
  //   },
  //   set(value: string[]) {
  //     passageFormatEditor.bookNames = value
  //   },
  // })

  const screenMode = useTheme()
  watch(() => persist.value.screenMode, value => screenMode.set(value))
  screenMode.set(persist.value.screenMode)

  const localeTranslations = computed(() => translations.filter(it => it.lang === lang.value).map(it => it.symbol).sort())

  return { appBookNames, bookNamingList, defaultTranslation, lang, localeTranslations, passageFormatEditor, persist }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}


