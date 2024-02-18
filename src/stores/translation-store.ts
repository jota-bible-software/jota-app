import { defineStore } from 'pinia'
import { computed, reactive, ref, shallowRef } from 'vue'
import { LanguageSymbol, Translation, TranslationKey } from 'src/types'
import { translationMeta, languageData } from 'src/logic/data'
import { useSettingsStore } from './settings-store'

export const useTranslationStore = defineStore('translation', () => {
  const settings = useSettingsStore()
  const languages = ref(languageData)
  const lang = ref(settings.lang)

  const translations = reactive(translationMeta.map(it => {
    const selected = settings.persist.langDefaults[it.lang].selectedTranslations.includes(it.symbol)
    return { ...it, selected, stored: false, content: undefined } as Translation
  }))

  translations.forEach(it => {
    if (it.selected) {
      fetchTranslationContent(it)
    }
  })


  function getTranslations(lang: LanguageSymbol): Translation[] {
    return translations.filter(it => it.lang === lang)
  }

  function getTranslation(key: TranslationKey) {
    return translations.find(it => it.lang === key.lang && it.symbol === key.symbol)
  }

  function selectionStatus(lang: LanguageSymbol) {
    const items = translations.filter(it => it.lang === lang)
    const selected = items.filter(it => it.selected)
    return items.length === selected.length ? true : selected.length === 0 ? false : null
  }

  function selectLang(lang: LanguageSymbol, selected: boolean) {
    translations.forEach(it => {
      if (it.lang === lang) {
        it.selected = selected
        if (selected) fetchTranslationContent(it)
      }
    })
  }

  function selectedCount(lang: LanguageSymbol) {
    return translations.filter(it => it.lang === lang && it.selected).length
  }


  function selected(lang: LanguageSymbol) {
    return translations.filter(it => it.selected && it.lang === lang)
  }

  // const isDownloading2 = computed(() => (item: Translation) => {
  //   console.log('isDownloading', item)
  //   return item.selected && !item.content
  // })

  // function isDownloading(item: Translation) {
  //   console.log('isDownloading', item, item.selected, item.content)
  //   return computed(() => {
  //     return item.selected && !item.content
  //   })
  // }

  function select(item: Translation, selected: boolean) {
    console.log(item, selected)
    if (selected) {
      fetchTranslationContent(item)
    }
  }

  function fetchTranslationContent(item: Translation) {
    const filePath = `src/assets/data/${item.lang}/${item.symbol}.json`
    fetch(filePath)
      .then((response) => response.json())
      .then((data) => {
        // Assign the fetched JSON data to the jsonData ref
        item.content = shallowRef(data)
        // console.log('set content', item.symbol, item, item.content)
      })
      .catch((error) => {
        // Handle any errors during fetching
        console.error('Error fetching JSON:', error)
      })

  }

  function isOpen(aLang: LanguageSymbol) {
    // console.log(lang, store.lang)
    return aLang === lang.value
  }

  const MB = 1024 * 1024
  function formatMB(size: number) {
    return (size / MB).toFixed(1)
  }

  const selectedTranslations = computed(() => {
    return translations.filter(it => it.selected)
  })

  const selectedTranslationsGrouped = computed(() => {
    let previous = ''
    return translations.filter(it => it.selected).map(it => {
      const isFirstInGroup = previous !== it.lang
      previous = it.lang
      return { ...it, isFirstInGroup }
    })
  })

  return {
    formatMB, getTranslation, getTranslations, isOpen, lang, languages, selected, select,
    selectedCount, selectLang, selectedTranslations, selectedTranslationsGrouped, selectionStatus
  }
})
