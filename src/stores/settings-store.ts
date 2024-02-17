import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'
import { LOCAL_STORAGE_KEY } from 'src/logic/util'
import { Ref, computed, ref, watch } from 'vue'
import { appBookAbbreviations, bookNamings, getBookNames, translations } from 'src/logic/data'
import { CopyTemplateData, FormatTemplateData, Lang, PassageFormat, PassageListLayout, ScreenMode } from 'src/types'
import { useTheme } from 'src/composables/useTheme'

export const useSettingsStore = defineStore('settings', () => {
  const persist = useStorage(LOCAL_STORAGE_KEY + '.settings', {
    version: '1',
    defaultLang: navigator.language as Lang,
    screenMode: 'dark' as ScreenMode,
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
        translationAbbreviationCharsBefore: '\u23B5',
        translationAbbreviationCharsAfter: 'b',
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

  function nameSorter(a: { name: string }, b: { name: string }) {
    return a.name.localeCompare(b.name, lang.value, { sensitivity: 'base', ignorePunctuation: true })
  }

  return { appBookNames, bookNamingList, defaultTranslation, lang, localeTranslations, nameSorter, persist }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}


