import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'
import { LOCAL_STORAGE_KEY } from 'src/logic/util'
import { Ref, computed, ref, watch } from 'vue'
import { appBookAbbreviations, bookNamings, getBookNames, translations } from 'src/logic/data'
import { CopyTemplateData, FormatTemplateData, LanguageSymbol, PassageFormat, PassageListLayout, ScreenMode, TranslationKey } from 'src/types'
import { useTheme } from 'src/composables/useTheme'

export const useSettingsStore = defineStore('settings', () => {
  const persist = useStorage(LOCAL_STORAGE_KEY + '.settings', {
    version: '1',
    defaultLang: navigator.language as LanguageSymbol,
    screenMode: 'dark' as ScreenMode,
    languages: {
      en: {
        appBookNaming: 'SBL abbreviations',
        bookNamings: bookNamings.filter(it => it.lang === 'en'),
        selectedTranslations: ['NIV', 'NLT'],
      },
      pl: {
        appBookNaming: 'Moje pl',
        bookNamings: bookNamings.filter(it => it.lang === 'pl'),
        selectedTranslations: ['EIB', 'BT5', 'BW', 'UBG'],
      },
    },
    formatTemplates: [
      {
        name: 'App format',
        referencePosition: 'before',
        referenceLine: 'same line',
        translationAbbreviation: 'none',
        numbers: false,
        verseNewLine: false,
        separatorChar: ':',
        rangeChar: '-',
        referenceCharsBefore: '',
        referenceCharsAfter: '',
        quoteCharsBefore: '',
        quoteCharsAfter: '',
        verseNumberCharsBefore: '',
        verseNumberCharsAfter: '',
        translationAbbreviationCharsBefore: '',
        translationAbbreviationCharsAfter: '',
      } as FormatTemplateData,
      {
        name: 'English presentation',
        referencePosition: 'after',
        referenceLine: 'new line',
        translationAbbreviation: 'uppercase',
        numbers: false,
        verseNewLine: false,
        separatorChar: ':',
        rangeChar: '-',
        referenceCharsBefore: '',
        referenceCharsAfter: '',
        quoteCharsBefore: '',
        quoteCharsAfter: '',
        verseNumberCharsBefore: '',
        verseNumberCharsAfter: '',
        translationAbbreviationCharsBefore: '',
        translationAbbreviationCharsAfter: '',
      } as FormatTemplateData,
      {
        name: 'Polska prezentacja',
        referencePosition: 'after',
        referenceLine: 'new line',
        translationAbbreviation: 'uppercase',
        numbers: false,
        verseNewLine: false,
        separatorChar: ',',
        rangeChar: '-',
        referenceCharsBefore: '',
        referenceCharsAfter: '',
        quoteCharsBefore: '',
        quoteCharsAfter: '',
        verseNumberCharsBefore: '',
        verseNumberCharsAfter: '',
        translationAbbreviationCharsBefore: '',
        translationAbbreviationCharsAfter: '',
      } as FormatTemplateData,
    ],
    copyTemplates: [
      {
        name: 'Prezentacja',
        isDefault: false,
        lang: {
          en: {
            formatTemplate: '',
            bookNaming: '',
          },
          pl: {
            formatTemplate: '',
            bookNaming: '',
          }
        }
      }
    ] as CopyTemplateData[],
    appFormatTemplate: 'App format',
    defaultSearchResultLayout: 'split' as PassageListLayout,
    defaultTranslation: { lang: 'en', symbol: 'NIV' } as TranslationKey
  })

  const lang: Ref<LanguageSymbol> = ref(persist.value.defaultLang)
  const language = computed(() => persist.value.languages[lang.value])
  const appBookNames = computed(() => language.value.bookNamings.find(it => it.name === language.value.appBookNaming)?.books || [])
  const appFormatTemplate = computed(() => persist.value.formatTemplates.find(it => it.name === persist.value.appFormatTemplate))

  // Computed

  /** List of book namings for the currently selected lang in langDefaults */
  const bookNamingList = computed(() => bookNamings
    .filter(_ => _.lang === lang.value)
    .map(_ => ({ ..._, booksText: _.books.join(', ') }))
    .sort((a, b) => a.name.localeCompare(b.name)))

  const screenMode = useTheme()
  watch(() => persist.value.screenMode, value => screenMode.set(value))
  screenMode.set(persist.value.screenMode)

  const localeTranslations = computed(() => translations.filter(it => it.lang === lang.value).map(it => it.symbol).sort())


  function nameSorter(a: { name: string }, b: { name: string }) {
    return a.name.localeCompare(b.name, lang.value, { sensitivity: 'base', ignorePunctuation: true })
  }

  return { appBookNames, appFormatTemplate, bookNamingList, lang, localeTranslations, nameSorter, persist }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}


