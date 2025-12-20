import { useFetch } from '@vueuse/core'
import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'
import { translationsData } from 'src/logic/data'
import { LocaleSymbol, Translation, TranslationKey, TranslationFile, TranslationContent } from 'src/types'
import { getDefaultLocale } from 'src/util'
import { computed, ComputedRef, ref, Ref, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from './settings-store'

type LocaleGroup = {
  defaultTranslation: ComputedRef<TranslationKey>
  translations: Translation[]
  translationCount: number
  locale: LocaleSymbol
  selectedStatus: boolean | null
  selectedCount: number
  toggleSelected: () => void
}

export const useTranslationStore = defineStore('translation', () => {

  const settings = useSettingsStore()
  const q = useQuasar()
  const { t } = useI18n()

  function isSelected(locale: LocaleSymbol, translation: string) {
    return settings.persist.localeData[locale as keyof typeof settings.persist.localeData]?.translations?.selected?.includes(translation) || false
  }

  function isHighlightsEnabled(locale: LocaleSymbol, translation: string) {
    const highlightsEnabled = settings.persist.localeData[locale as keyof typeof settings.persist.localeData]?.translations?.highlightsEnabled
    return highlightsEnabled?.[translation] ?? false // Default to false, migration will enable for default translations
  }

  function setHighlightsEnabled(locale: LocaleSymbol, translation: string, value: boolean) {
    const localeData = settings.persist.localeData[locale as keyof typeof settings.persist.localeData]
    if (!localeData) return

    if (!localeData.translations.highlightsEnabled) {
      localeData.translations.highlightsEnabled = {}
    }
    localeData.translations.highlightsEnabled[translation] = value
  }

  function setTranslationSelection(locale: LocaleSymbol, translation: string, value: boolean) {
    const localeData = settings.persist.localeData[locale as keyof typeof settings.persist.localeData]
    if (!localeData) return

    const localeTranslations = localeData.translations
    // Unselect translation
    const selected = localeTranslations.selected.includes(translation)
    if (selected && !value) {
      const areOtherSelected = localeTranslations.selected.length < allSelectedCount.value

      if (areOtherSelected || localeTranslations.selected.length > 1) {
        // Remove this translation from selected translations
        const index = localeTranslations.selected.indexOf(translation)
        localeTranslations.selected.splice(index, 1)

        // If no translations are selected for this locale, set to empty
        if (localeTranslations.selected.length === 0) {
          localeTranslations.default = ''
        }
        // If current default was removed, set first selected translation as default
        else if (localeTranslations.default === translation) {
          localeTranslations.default = localeTranslations.selected[0]
        }
      } else {
        q.notify({
          message: t('translationStore.cannotUnselectAllTranslations'),
          type: 'negative'
        })
      }
    }
    // Select translation
    else if (!selected && value) {
      if (translation !== '') {
        localeTranslations.selected.push(translation)
      }

      // If there was no previous default, replace it with this translation
      if (localeTranslations.default === '') {
        localeTranslations.default = translation
      }
    }
  }

  function setDefaultTranslation(locale: LocaleSymbol, translation: string) {
    const localeData = settings.persist.localeData[locale as keyof typeof settings.persist.localeData]
    if (!localeData) return

    const localeTranslations = localeData.translations

    // If translation is empty, clear the default
    if (translation === '') {
      localeTranslations.default = ''
      return
    }

    localeTranslations.default = translation
    if (!localeTranslations.selected.includes(translation)) {
      localeTranslations.selected.push(translation)
    }

    if (settings.currentLocale === locale) {
      currentKey.value = { locale, symbol: localeTranslations.default }
    }
  }

  watch(() => settings.currentLocale, (newLocale) => {
    if (newLocale && settings.persist.localeData?.[newLocale as LocaleSymbol]?.translations) {
      const defaultTranslation = settings.persist.localeData[newLocale as LocaleSymbol]?.translations?.default
      currentKey.value = { locale: newLocale, symbol: defaultTranslation }
    }
  })

  const translations = translationsData.map(ed => ({
    ...ed,
    content: shallowRef(undefined),
    selected: computed({
      get() {
        return isSelected(ed.locale, ed.symbol)
      },
      set(selected: boolean) {
        setTranslationSelection(ed.locale, ed.symbol, selected)
        if (selected) {
          fetchTranslationContent({
            ...ed,
            selected: ref(true),
            content: shallowRef(undefined),
            highlightsEnabled: computed(() => isHighlightsEnabled(ed.locale, ed.symbol))
          })
        }
      }
    }),
    highlightsEnabled: computed({
      get() {
        return isHighlightsEnabled(ed.locale, ed.symbol)
      },
      set(enabled: boolean) {
        setHighlightsEnabled(ed.locale, ed.symbol, enabled)
      }
    })
  } as Translation))

  const groups = computed(() => {
    if (!settings.locales || !settings.persist.localeData) return []

    return settings.locales.map((locale: LocaleSymbol) => {
      if (!settings.persist.localeData?.[locale as keyof typeof settings.persist.localeData]) return null

      const localeData = settings.persist.localeData[locale as keyof typeof settings.persist.localeData]
      const localeTranslations = localeData.translations
      const groupTranslations: Translation[] = translations.filter(it => it.locale === locale)
      const defaultTranslation = computed({
        get(): TranslationKey {
          // If defaultTranslation is empty, return ''
          return {
            locale,
            symbol: localeTranslations?.default === '' ? '' : (localeTranslations?.default || '')
          }
        },
        set(translationKey: TranslationKey) {
          setDefaultTranslation(locale, translationKey.symbol)
        }
      })
      const translationCount = groupTranslations.length
      const selectedCount = localeTranslations?.selected?.length || 0
      const selectedStatus = translationCount === selectedCount ? true : selectedCount === 0 ? false : null
      function toggleSelected() {
        const newSelected = selectedStatus === true ? false : true
        groupTranslations.forEach(translation => translation.selected.value = newSelected)
      }

      return { defaultTranslation, translations: groupTranslations, translationCount, locale, selectedStatus, selectedCount, toggleSelected }
    }).filter(Boolean) as LocaleGroup[]
  })

  const allSelectedCount = computed(() => groups.value.reduce((sum, group) => sum + group.selectedCount, 0))


  // Region: Support for current translation

  const defaultLocale = settings.currentLocale
  const defaultSymbol = defaultLocale && settings.persist.localeData?.[defaultLocale as LocaleSymbol]?.translations?.default || ''

  const currentKey: Ref<TranslationKey> = ref({
    locale: defaultLocale || getDefaultLocale(),
    symbol: defaultSymbol
  })
  const currentTranslation = computed(() => getTranslation(currentKey.value))
  const currentContent = computed(() => currentTranslation.value?.content?.value)
  const selectedTranslations = computed(() => translations.filter(it => it.selected.value))
  const translationsGrouped = computed(() => {
    let previous = ''
    return selectedTranslations.value.map(it => {
      const isFirstInGroup = previous !== it.locale
      previous = it.locale
      return { ...it, isFirstInGroup }
    })
  })


  function getTranslation(key: TranslationKey): Translation {
    return translations.find(it => it.locale === key.locale && it.symbol === key.symbol) || selectedTranslations.value[0] || translations[0]
  }

  async function fetchTranslationContent(translation: Translation): Promise<Translation['content']> {
    const publicPath = process.env.VUE_ROUTER_BASE || (process.env.NODE_ENV === 'test' ? ' / ' : '/jota/')
    const url = `${publicPath}data/${translation.locale}/${translation.symbol.toLowerCase()}.json`

    const { data, error, statusCode } = await useFetch(url).get().json()
    // Mock long loading time
    // await new Promise(resolve => setTimeout(resolve, 10_000))

    if (error.value) {
      if (statusCode.value === 404) {
        throw new Error(t('translationStore.translationNotFound', { symbol: translation.symbol, locale: translation.locale }))
      } else {
        throw new Error(t('translationStore.translationFetchError', { symbol: translation.symbol, locale: translation.locale }))
      }
    }

    if (data.value) {
      const parsedData = data.value
      
      // Detect format: if it has 'meta' and 'data' properties, it's new format
      if (parsedData.meta && parsedData.data) {
        // New format with metadata
        const translationFile = parsedData as TranslationFile
        translation.content.value = translationFile.data
        translation.fileMeta = translationFile.meta
      } else if (Array.isArray(parsedData)) {
        // Legacy 3D array format
        translation.content.value = parsedData as TranslationContent
      } else {
        throw new Error(t('translationStore.invalidFileFormat', { symbol: translation.symbol, locale: translation.locale }))
      }
      
      return translation.content
    } else {
      throw new Error(t('translationStore.noDataReceived'))
    }
  }

  /** Fetch content for selected translations, starting from the default translation */
  const startPromise = currentTranslation.value ? fetchTranslationContent(currentTranslation.value) : Promise.resolve()
  startPromise.then(() => {
    translations.forEach(translation => {
      if (translation.selected && !translation.content.value) {
        fetchTranslationContent(translation)
      }
    })
  }).catch(error => {
    q.notify({
      message: error.message,
      type: 'negative'
    })
  })

  return {
    allSelectedCount,
    currentContent,
    currentTranslation,
    currentKey,
    translations,
    translationsGrouped,
    groups,
    startPromise
  }
})
