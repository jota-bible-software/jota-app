import { defineStore } from 'pinia'
import jota from 'src/logic/jota'
import { useSettingsStore } from './settings-store'
import { useTranslationStore } from './translation-store'
import { usePassageFormat } from 'src/composables/usePassageFormat'
import { Ref, computed, ref, watch } from 'vue'
import { Passage, PassageListLayout, Progress } from 'src/types'

export const useSearchStore = defineStore('search', () => {
  const settings = useSettingsStore()
  const translations = useTranslationStore()
  // const translation = usetranslationtore()

  const audioOn = ref(false)
  const chapter: Ref<string[]> = ref([])
  const chapterFragment: Ref<Passage | undefined> = ref(undefined)
  const currentTranslation = ref(settings.persist.defaultTranslation)
  const error = ref('')
  const fragments: Ref<Passage[]> = ref([])
  const fragmentIndex = ref(-1)
  const input = ref('')
  const layout: Ref<PassageListLayout> = ref('split')
  const progress = ref(0.0)
  const scrollToSelection = ref(false)
  const selectionEnd = ref(-1)
  const selectionStart = ref(-1)
  const selectionClasses: Ref<string[]> = ref([])
  const searchTermHighlightRegex = ref('')
  const searchTerm = ref('')
  const searchTermHighlightReplacement = ref('$1<span class="bold">$2</span>$3')
  const separator = ref(':')
  const shouldSort = ref(false)
  const showPicker = ref(true)
  const words = ref(true)


  // Computed
  const books = computed(() => settings.appBookNames)
  const translation = computed(() => translations.getTranslation(currentTranslation.value))
  const chapterCaption = computed(() => jota.chapterCaption(chapterFragment.value, books.value))
  const chapterVerses = computed(() =>
    translation.value?.content ? jota.chapterVerses(translation.value?.content, chapterFragment.value) : [])
  const formattedSelected = computed(() => {
    // const formatter = usePassageFormat()
    // formatter
    // rootGetters['settings/formatted'](state.chapterFragment, state.separator)
    return ''
  })
  const found = computed(() => !!fragments.value.length)
  const highlightSearchTerm = computed(() => (s: string) =>
    searchTermHighlightRegex.value ? s.replace(searchTermHighlightRegex.value, searchTermHighlightReplacement.value) : s
  )
  const loading = computed(() => !translation.value?.content)
  const passages = computed(() =>
    fragments.value.map((osisRef) => jota.formatReference(osisRef, books.value, separator.value)))

  watch(chapterFragment, () => {
    if (!chapterFragment.value) return
    const [, , start, end2] = chapterFragment.value
    if (start == null) return
    const end = end2 ?? start
    const a = selectionClasses.value
    for (let i = 0; i < chapterVerses.value.length; i++) {
      a[i] =
        i === start && i === end ? 'selection-single' :
          i === start && i !== end ? 'selection-start' :
            i === end && i !== start ? 'selection-end' :
              start < i && i < end ? 'selection-middle' : ''
    }
  })

  watch(fragmentIndex, value => {
    chapterFragment.value = fragments.value[value]
  })

  // Mutations

  function setFragments(payload: Passage[]) {
    fragments.value = payload
    setFragmentIndex(fragments.value.length ? 0 : -1)
  }

  function setFragmentIndex(index: number) {
    fragmentIndex.value = index
    chapterFragment.value = fragments.value[fragmentIndex.value]
  }

  function readInContext(index: number) {
    fragmentIndex.value = index
    chapterFragment.value = fragments.value[fragmentIndex.value]
    layout.value = 'split'
  }

  // actions

  async function adjacentChapter(direction: number) {
    const adjacent = jota.adjacentChapter(translation.value?.content, chapterFragment.value, direction) as Passage | undefined
    if (adjacent) {
      chapterFragment.value = adjacent
      chapter.value = jota.chapterVerses(translation.value?.content, adjacent)
    }
  }

  function clearSearch() {
    input.value = ''
    searchTerm.value = ''
    fragments.value = []
    fragmentIndex.value = -1
    chapter.value = []
    chapterFragment.value = undefined
  }

  async function findByInput({ input, options }) {
    await jota.bibleLoadingPromise
    const t0 = Date.now()
    const bible = translation.value?.content
    const translationSymbol = translation.value?.symbol
    const text = input.replace(/\n/g, '#')
    if (!text) {
      clearSearch()
      return
    }
    searchTerm.value = input

    const beforeFragmentCount = fragments.value.length
    const progressor: Progress = {
      step: (value) => {
        // instant-feedback win the widget does not work
        progress.value = value / (translation.value?.content?.length || 1)
      }
    }
    Object.assign(options, { words, shouldSort, translationSymbol })
    progress.value = 0.1
    error.value = ''
    try {
      const fragments = Object.freeze(await jota.search(bible, text, options, progressor))

      const newLayout =
        fragments.length < 2
          ? 'split'
          : beforeFragmentCount < 2
            ? settings.persist.defaultSearchResultLayout || layout.value
            : layout.value

      layout.value = newLayout
      const searchReplacement = words.value && !text.startsWith('/') ? '$1<span class="bold">$2</span>$3' : '<span class="bold">$1</span>'
      searchTermHighlightReplacement.value = searchReplacement
      searchTermHighlightRegex.value = jota.highlightRegex(progressor.regex)
      setFragments(fragments)
      console.log(`Search took ${Date.now() - t0} ms`)
    } catch (ex: unknown) {
      setFragments([])
      error.value = 'Błąd: ' + ex
      console.error(ex)
    } finally {
      progress.value = 0
    }
  }

  function formattedSearchResults() {
    const formatted: Array<{ bref: string, symbol: string, content: string }> = []
    fragments.value.forEach(fragment => {
      const verses = jota.verses(translation.value?.content, fragment)
      if (!verses.length) {
        console.warn(`Could not format ${JSON.stringify(fragment)}`)
        return
      }
      const bref = jota.formatReference(fragment, books.value, separator.value)
      const symbol = translation.value?.symbol.toUpperCase() || ''
      const content = '"' + highlightSearchTerm.value(verses.join('\n')) + '"'
      formatted.push({ bref, symbol, content })
    })
    return formatted
  }

  function moveFragmentIndex(delta: number) {
    const index = fragmentIndex.value
    const shouldChange = delta > 0 ? index < fragments.value.length - delta : index >= -delta
    if (shouldChange) {
      setFragmentIndex(index + delta)
    }
  }

  function selectInChapter(start: number, end?: number): void {
    if (!chapterFragment.value) return
    const [book, chapter] = chapterFragment.value
    chapterFragment.value = [book, chapter, start, end ?? start]
  }

  async function sortAndDeduplicate() {
    shouldSort.value = !shouldSort.value
    if (shouldSort.value) {
      const newFragments = await jota.sortAndDeduplicate(fragments.value.slice())
      fragments.value = Object.freeze(newFragments)
    }
  }

  return {
    audioOn,
    adjacentChapter,
    chapter,
    chapterCaption,
    chapterVerses,
    chapterFragment,
    currentTranslation,
    error,
    findByInput,
    formattedSelected,
    found,
    formattedSearchResults,
    fragments,
    fragmentIndex,
    highlightSearchTerm,
    input,
    layout,
    loading,
    moveFragmentIndex,
    passages,
    progress,
    readInContext,
    scrollToSelection,
    selectInChapter,
    selectionEnd,
    selectionStart,
    selectionClasses,
    searchTermHighlightRegex,
    searchTerm,
    searchTermHighlightReplacement,
    separator,
    shouldSort,
    translation,
    words,
    showPicker,
    sortAndDeduplicate,
  }
})
