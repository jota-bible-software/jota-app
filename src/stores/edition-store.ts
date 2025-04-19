import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { editionsData } from 'src/logic/data'
import { useSettingsStore } from './settings-store'
import { Edition, LocaleSymbol, EditionKey, Localized } from 'src/types'
import { useFetch } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

export const useEditionStore = defineStore('edition', () => {

  const settings = useSettingsStore()
  const q = useQuasar()
  const { t } = useI18n()

  function isSelected(locale: LocaleSymbol, edition: string) {
    return localized[locale].selectedEditions.includes(edition)
  }

  function setEditionSelection(locale: LocaleSymbol, edition: string, value: boolean) {
    const ls = localized[locale]
    // Unselect edition
    const selected = ls.selectedEditions.includes(edition)
    if (selected && !value) {
      const areOtherSelected = ls.selectedEditions.length < allSelectedCount.value

      if (areOtherSelected || ls.selectedEditions.length > 1) {
        // Remove this edition from selected editions
        const index = ls.selectedEditions.indexOf(edition)
        ls.selectedEditions.splice(index, 1)

        // If no editions are selected for this locale, set to empty
        if (ls.selectedEditions.length === 0) {
          ls.defaultEdition = ''
        }
        // If current default was removed, set first selected edition as default
        else if (ls.defaultEdition === edition) {
          ls.defaultEdition = ls.selectedEditions[0]
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
        ls.selectedEditions.push(edition)
      }

      // If there was no previous default, replace it with this edition
      if (ls.defaultEdition === '') {
        ls.defaultEdition = edition
      }
    }
  }

  function setDefaultEdition(locale: LocaleSymbol, edition: string) {
    const ls = localized[locale]

    // If edition is empty, clear the default
    if (edition === '') {
      ls.defaultEdition = ''
      return
    }

    ls.defaultEdition = edition
    if (!ls.selectedEditions.includes(edition)) {
      ls.selectedEditions.push(edition)
    }

    if (settings.persist.appearance.locale === locale) {
      currentKey.value = { locale, symbol: ls.defaultEdition }
    }
  }

  watch(() => settings.persist.appearance.locale, locale => currentKey.value = { locale, symbol: localized[locale].defaultEdition })

  const localized: Record<LocaleSymbol, Localized> = settings.persist.localized

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

  const groups = computed(() => settings.locales.map((locale) => {
    const groupEditions: Edition[] = editions.filter(it => it.locale === locale)
    const defaultEdition = computed({
      get(): EditionKey {
        // If defaultEdition is empty, return ''
        return {
          locale,
          symbol: localized[locale].defaultEdition === '' ? '' : localized[locale].defaultEdition
        }
      },
      set(editionKey: EditionKey) {
        setDefaultEdition(locale, editionKey.symbol)
      }
    })
    const editionCount = groupEditions.length
    const selectedCount = localized[locale].selectedEditions.length
    const selectedStatus = editionCount === selectedCount ? true : selectedCount === 0 ? false : null
    function toggleSelected() {
      const newSelected = selectedStatus === true ? false : true
      groupEditions.forEach(edition => edition.selected.value = newSelected)
    }

    return { defaultEdition, editions: groupEditions, editionCount, locale, selectedStatus, selectedCount, toggleSelected }
  }))

  const allSelectedCount = computed(() => groups.value.reduce((sum, group) => sum + group.selectedCount, 0))


  // Region: Support for current edition

  const currentKey: Ref<EditionKey> = ref({ locale: settings.persist.appearance.locale, symbol: settings.localized.defaultEdition })
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
    localized,
    startPromise
  }
})
