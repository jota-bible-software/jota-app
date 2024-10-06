import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { editionsData } from 'src/logic/data'
import { useSettingsStore } from './settings-store'
import type { Edition as Edition, LanguageSymbol, EditionKey as EditionKey, LanguageSettings } from 'src/types'

export const useEditionStore = defineStore('edition', () => {

  // Region: Support for SettingsEditions.vue

  const settings = useSettingsStore()

  function isSelected(lang: LanguageSymbol, edition: string) {
    return languageSettings[lang].selectedEditions.includes(edition)
  }

  function setEditionSelection(lang: LanguageSymbol, edition: string, value: boolean) {
    const ls = languageSettings[lang]
    // Unselect edition
    const selected = ls.selectedEditions.includes(edition)
    if (selected && !value) {
      // Ensure at least one edition is selected
      if (ls.selectedEditions.length > 1) {
        const index = ls.selectedEditions.indexOf(edition)
        ls.selectedEditions.splice(index, 1)
        ls.defaultEdition = ls.selectedEditions[0]
      }
    }
    // Select edition
    else if (!selected && value) {
      ls.selectedEditions.push(edition)
    }
  }

  function setDefaultEdition(lang: LanguageSymbol, edition: string) {
    const ls = languageSettings[lang]
    ls.defaultEdition = edition
    if (!ls.selectedEditions.includes(edition)) {
      ls.selectedEditions.push(edition)
    }
  }

  const languageSettings: Record<LanguageSymbol, LanguageSettings> = settings.persist.languageSettings

  const editions = editionsData.map(ed => ({
    ...ed,
    content: shallowRef(undefined),
    selected: computed({
      get() {
        return isSelected(ed.lang, ed.symbol)
      },
      set(selected: boolean) {
        setEditionSelection(ed.lang, ed.symbol, selected)
        if (selected) {
          fetchEditionContent(ed as Edition)
        }
      }
    })
  } as Edition))
  /** Languages for which there are some editions */
  const languages = computed(() => [...editions.reduce((set, it) => { set.add(it.lang); return set }, new Set<string>())].sort())
  /** Language currently focused in the editions settings to store the accordion state */
  const focusLang = ref<LanguageSymbol>(settings.lang)

  const groups = computed(() => languages.value.map((lang) => {
    const groupEditions: Edition[] = editions.filter(it => it.lang === lang)
    const defaultEdition = computed({
      get(): EditionKey {
        return { lang, symbol: languageSettings[lang].defaultEdition }
      },
      set(editionKey: EditionKey) {
        setDefaultEdition(lang, editionKey.symbol)
      }
    })
    const editionCount = groupEditions.length
    const selectedCount = languageSettings[lang].selectedEditions.length
    const selectedStatus = editionCount === selectedCount ? true : selectedCount === 0 ? false : null
    function toggleSelected() {
      const newSelected = selectedStatus === true ? false : true
      groupEditions.forEach(edition => edition.selected.value = newSelected)
    }

    return { defaultEdition, editions: groupEditions, editionCount, lang, selectedStatus, selectedCount, toggleSelected }
  }))

  const allSelectedCount = computed(() => groups.value.reduce((sum, group) => sum + group.selectedCount, 0))


  // Region: Support for current edition

  const currentKey: Ref<EditionKey> = ref({ lang: settings.lang, symbol: settings.languageSettings.defaultEdition })
  const currentEdition = computed(() => getEdition(currentKey.value))
  const currentContent = computed(() => currentEdition.value?.content?.value)
  const editionsGrouped = computed(() => {
    let previous = ''
    return editions.filter(it => it.selected).map(it => {
      const isFirstInGroup = previous !== it.lang
      previous = it.lang
      return { ...it, isFirstInGroup }
    })
  })


  function getEdition(key: EditionKey): Edition {
    return editions.find(it => it.lang === key.lang && it.symbol === key.symbol) || editions[0]
  }

  function fetchEditionContent(edition: Edition): Promise<Edition['content']> {
    return new Promise((resolve, reject) => {
      const filePath = `src/assets/data/${edition.lang}/${edition.symbol}.json`
      fetch(filePath)
        .then((response) => response.json())
        .then((data) => {
          // Assign the fetched JSON data to the jsonData ref
          edition.content.value = data
          resolve(edition.content)
        })
        .catch(error => {
          // Handle any errors during fetching
          console.error('Error fetching JSON:', error)
          reject(error)
        })
    })
  }

  /** Fetch content for selected editions, starting from the default edition */
  const startPromise = currentEdition.value ? fetchEditionContent(currentEdition.value) : Promise.resolve()
  startPromise.then(() => {
    editions.forEach(edition => {
      if (edition.selected && !edition.content.value) {
        fetchEditionContent(edition)
      }
    })
  })

  return {
    allSelectedCount,
    currentContent,
    currentEdition,
    currentKey,
    editions,
    editionsGrouped,
    languages,
    languageSettings,
    focusLang,
    groups
  }
})
