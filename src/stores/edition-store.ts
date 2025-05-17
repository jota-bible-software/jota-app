import { defineStore } from 'pinia'
import { ref, computed, watch, shallowRef, Ref, ComputedRef } from 'vue'
import { editionsData } from 'src/logic/data'
import { useSettingsStore } from './settings-store'
import { Edition, LocaleSymbol, EditionKey } from 'src/types'
import { useFetch } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { getDefaultLocale } from 'src/util'

type LocaleGroup = {
  defaultEdition: ComputedRef<EditionKey>;
  editions: Edition[];
  editionCount: number;
  locale: LocaleSymbol;
  selectedStatus: boolean | null;
  selectedCount: number;
  toggleSelected: () => void;
}

export const useEditionStore = defineStore('edition', () => {

  const settings = useSettingsStore()
  const q = useQuasar()
  const { t } = useI18n()

  function isSelected(locale: LocaleSymbol, edition: string) {
    return settings.persist.localeData[locale as keyof typeof settings.persist.localeData]?.editions.selected.includes(edition)
  }

  function setEditionSelection(locale: LocaleSymbol, edition: string, value: boolean) {
    const localeData = settings.persist.localeData[locale as keyof typeof settings.persist.localeData]
    if (!localeData) return
    
    const localeEditions = localeData.editions
    // Unselect edition
    const selected = localeEditions.selected.includes(edition)
    if (selected && !value) {
      const areOtherSelected = localeEditions.selected.length < allSelectedCount.value

      if (areOtherSelected || localeEditions.selected.length > 1) {
        // Remove this edition from selected editions
        const index = localeEditions.selected.indexOf(edition)
        localeEditions.selected.splice(index, 1)

        // If no editions are selected for this locale, set to empty
        if (localeEditions.selected.length === 0) {
          localeEditions.default = ''
        }
        // If current default was removed, set first selected edition as default
        else if (localeEditions.default === edition) {
          localeEditions.default = localeEditions.selected[0]
        }
      } else {
        q.notify({
          message: t('editionStore.cannotUnselectAllEditions'),
          type: 'negative'
        })
      }
    }
    // Select edition
    else if (!selected && value) {
      if (edition !== '') {
        localeEditions.selected.push(edition)
      }

      // If there was no previous default, replace it with this edition
      if (localeEditions.default === '') {
        localeEditions.default = edition
      }
    }
  }

  function setDefaultEdition(locale: LocaleSymbol, edition: string) {
    const localeData = settings.persist.localeData[locale as keyof typeof settings.persist.localeData]
    if (!localeData) return
    
    const localeEditions = localeData.editions

    // If edition is empty, clear the default
    if (edition === '') {
      localeEditions.default = ''
      return
    }

    localeEditions.default = edition
    if (!localeEditions.selected.includes(edition)) {
      localeEditions.selected.push(edition)
    }

    if (settings.currentLocale === locale) {
      currentKey.value = { locale, symbol: localeEditions.default }
    }
  }

  watch(() => settings.currentLocale, (newLocale) => {
    if (newLocale && settings.persist.localeData?.[newLocale as LocaleSymbol]?.editions) {
      const defaultEdition = settings.persist.localeData[newLocale as LocaleSymbol]?.editions?.default
      currentKey.value = { locale: newLocale, symbol: defaultEdition }
    }
  })

  const editions = editionsData.map(ed => ({
    ...ed,
    content: shallowRef(undefined),
    selected: computed({
      get() {
        return isSelected(ed.locale, ed.symbol)
      },
      set(selected: boolean) {
        setEditionSelection(ed.locale, ed.symbol, selected)
        if (selected) {
          fetchEditionContent({ ...ed, selected: ref(true), content: shallowRef(undefined) })
        }
      }
    })
  } as Edition))

  const groups = computed(() => {
    if (!settings.locales || !settings.persist.localeData) return []
    
    return settings.locales.map((locale: LocaleSymbol) => {
      if (!settings.persist.localeData?.[locale as keyof typeof settings.persist.localeData]) return null
      
      const localeData = settings.persist.localeData[locale as keyof typeof settings.persist.localeData]
      const localeEditions = localeData.editions
      const groupEditions: Edition[] = editions.filter(it => it.locale === locale)
      const defaultEdition = computed({
        get(): EditionKey {
          // If defaultEdition is empty, return ''
          return {
            locale,
            symbol: localeEditions?.default === '' ? '' : (localeEditions?.default || '')
          }
        },
        set(editionKey: EditionKey) {
          setDefaultEdition(locale, editionKey.symbol)
        }
      })
      const editionCount = groupEditions.length
      const selectedCount = localeEditions?.selected?.length || 0
      const selectedStatus = editionCount === selectedCount ? true : selectedCount === 0 ? false : null
      function toggleSelected() {
        const newSelected = selectedStatus === true ? false : true
        groupEditions.forEach(edition => edition.selected.value = newSelected)
      }

      return { defaultEdition, editions: groupEditions, editionCount, locale, selectedStatus, selectedCount, toggleSelected }
    }).filter(Boolean) as LocaleGroup[]
  })

  const allSelectedCount = computed(() => groups.value.reduce((sum, group) => sum + group.selectedCount, 0))


  // Region: Support for current edition

  const defaultLocale = settings.currentLocale
  const defaultSymbol = defaultLocale && settings.persist.localeData?.[defaultLocale as LocaleSymbol]?.editions?.default || ''
  
  const currentKey: Ref<EditionKey> = ref({ 
    locale: defaultLocale || getDefaultLocale(), 
    symbol: defaultSymbol 
  })
  const currentEdition = computed(() => getEdition(currentKey.value))
  const currentContent = computed(() => currentEdition.value?.content?.value)
  const selectedEditions = computed(() => editions.filter(it => it.selected.value))
  const editionsGrouped = computed(() => {
    let previous = ''
    return selectedEditions.value.map(it => {
      const isFirstInGroup = previous !== it.locale
      previous = it.locale
      return { ...it, isFirstInGroup }
    })
  })


  function getEdition(key: EditionKey): Edition {
    return editions.find(it => it.locale === key.locale && it.symbol === key.symbol) || selectedEditions.value[0] || editions[0]
  }

  async function fetchEditionContent(edition: Edition): Promise<Edition['content']> {
    const publicPath = process.env.VUE_ROUTER_BASE || (process.env.NODE_ENV === 'test' ? ' / ' : '/jota/')
    const url = `${publicPath}data/${edition.locale}/${edition.symbol.toLowerCase()}.json`

    const { data, error, statusCode } = await useFetch(url).get().json()
    // Mock long loading time
    // await new Promise(resolve => setTimeout(resolve, 10_000))

    if (error.value) {
      if (statusCode.value === 404) {
        throw new Error(t('editionStore.editionNotFound', { symbol: edition.symbol, locale: edition.locale }))
      } else {
        throw new Error(t('editionStore.editionFetchError', { symbol: edition.symbol, locale: edition.locale }))
      }
    }

    if (data.value) {
      edition.content.value = data.value
      return edition.content
    } else {
      throw new Error(t('editionStore.noDataReceived'))
    }
  }

  /** Fetch content for selected editions, starting from the default edition */
  const startPromise = currentEdition.value ? fetchEditionContent(currentEdition.value) : Promise.resolve()
  startPromise.then(() => {
    editions.forEach(edition => {
      if (edition.selected && !edition.content.value) {
        fetchEditionContent(edition)
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
    currentEdition,
    currentKey,
    editions,
    editionsGrouped,
    groups,
    startPromise
  }
})
