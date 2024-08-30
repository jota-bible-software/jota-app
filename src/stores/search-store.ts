import { defineStore } from 'pinia'
import { CopyTemplateData, Passage, PassageListLayout, Progress, SearchOptions, TranslationContent } from 'src/types'
import { jota } from 'src/logic/jota'
import { format, formatSample } from 'src/logic/format'
import { useSettingsStore } from './settings-store'
import { useTranslationStore } from './translation-store'
import { Direction, errorMessage } from 'src/util'

export const useSearchStore = defineStore('search', () => {
  const settings = useSettingsStore()
  const translations = useTranslationStore()

  const audioOn = ref(false)
  const chapterFragment: Ref<Passage> = ref([0, 0, 0, 0])
  const currentTranslation = ref(settings.persist.defaultTranslation)
  const error = ref('')
  const fragments: Ref<readonly Passage[]> = ref([])
  const fragmentIndex = ref(-1)
  const input = ref('')
  const layout: Ref<PassageListLayout> = ref('split')
  const progress = ref(0.0)
  const scrollToSelection = ref(false)
  const selectionEnd = ref(-1)
  const selectionStart = ref(-1)
  const selectionClasses: Ref<string[]> = ref([])
  const searchTermHighlightRegex: Ref<RegExp | ''> = ref('')
  const searchTerm = ref('')
  const searchTermHighlightReplacement = ref('$1<span class="bold">$2</span>$3')
  const separator = ref(':')
  const shouldSort = ref(false)
  const showPicker = ref(false)
  const words = ref(true)

  const books = computed(() => settings.appBookNames)
  const chapterCaption = computed(() => jota.chapterCaption(chapterFragment.value, books.value))
  const chapterVerses = computed(() =>
    translation.value?.content ? jota.chapterVerses(translation.value?.content, chapterFragment.value) : [])
  const found = computed(() => !!fragments.value.length)
  const hasSelection = computed(() => chapterFragment.value && chapterFragment.value[2] != null)
  const loading = computed(() => !translation.value?.content)
  const passages = computed(() =>
    fragments.value.map((osisRef) => jota.formatReference(osisRef, books.value, separator.value)))
  const translation = computed(() => translations.getTranslation(currentTranslation.value))
  const translationContent = computed(() => translations.getTranslation(currentTranslation.value)?.content)
  const shouldSortTooltip = computed(() => (shouldSort.value ? 'Wy' : 'W') + 'łącz sortowanie i usuwanie duplikatów wśród wyszukanych fragmentów')

  // Mutations

  function setFragments(payload: Passage[]) {
    fragments.value = payload
    setFragmentIndex(fragments.value.length ? 0 : -1)
  }

  function setFragmentIndex(index: number) {
    fragmentIndex.value = index
    if (fragments.value[fragmentIndex.value]) {
      setChapterFragment(fragments.value[fragmentIndex.value])
    }
  }

  function setChapterFragment(newFragment: Passage, keepTextSelection = false) {
    chapterFragment.value = newFragment
    updateSelectionClasses()
    if (!keepTextSelection) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
      }
    }
  }

  function updateSelectionClasses() {
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
  }

  function readInContext(index: number) {
    fragmentIndex.value = index
    if (fragments.value[fragmentIndex.value]) {
      setChapterFragment(fragments.value[fragmentIndex.value])
    }
    layout.value = 'split'
  }

  // actions

  async function goToAdjacentVerse(direction: Direction) {
    if (!translationContent.value) return
    const [bible, chapter, start, end] = chapterFragment.value
    const s = direction === Direction.Prev ? Math.max(0, (start ?? 0) - 1) :
      direction === Direction.Next ? Math.min(chapterVerses.value.length - 1, (end ?? 0) + 1) : start
    setChapterFragment([bible, chapter, s, s])
  }

  async function goToAdjacentChapter(direction: Direction) {
    if (!translationContent.value) return
    const adjacent = jota.adjacentChapter(translationContent.value, chapterFragment.value, direction) as Passage | undefined
    if (adjacent) {
      const [b, c] = adjacent
      setChapterFragment([b, c, 0, 0])
    }
  }

  async function goToAdjacentPage(direction: Direction) {
    if (!translationContent.value) return
    const adjacent = jota.adjacentChapter(translationContent.value, chapterFragment.value, direction) as Passage | undefined
    if (adjacent) {
      const [b, c] = adjacent
      setChapterFragment([b, c, 0, 0])
    }
  }

  function clearSearch() {
    input.value = ''
    searchTerm.value = ''
    fragments.value = []
    fragmentIndex.value = -1
    setChapterFragment([0, 0, 0, 0])
  }

  async function findByInput(input: string, options: SearchOptions) {
    if (!translationContent.value) return
    const t0 = Date.now()
    const bible = translationContent.value
    const translationSymbol = translation.value?.symbol
    const text = input.replace(/\n/g, '#')
    if (!text) {
      clearSearch()
      return
    }
    searchTerm.value = input
    scrollToSelection.value = true

    const beforeFragmentCount = fragments.value.length
    const progressRunner: Progress = {
      step: (value) => {
        progress.value = value / (translation.value?.content?.length || 1)
      }
    }
    Object.assign(options, { words: words.value, shouldSort: shouldSort.value, translationSymbol })
    progress.value = 0.1
    error.value = ''
    try {
      const fragments: Passage[] = await jota.search(bible, text, options, progressRunner)

      const newLayout =
        fragments.length < 2 ? 'split' :
          beforeFragmentCount > 1 ? layout.value :
            'formatted'

      layout.value = newLayout
      const searchReplacement = words.value && !text.startsWith('/') ? '$1<span class="bold">$2</span>$3' : '<span class="bold">$1</span>'
      searchTermHighlightReplacement.value = searchReplacement
      if (progressRunner.regex) {
        searchTermHighlightRegex.value = jota.highlightRegex(progressRunner.regex)
      }
      setFragments(fragments)
      console.log(`Search took ${Date.now() - t0} ms`)
    } catch (ex: unknown) {
      setFragments([])
      error.value = errorMessage('Błąd:', ex)
      console.error(ex)
    } finally {
      progress.value = 0
    }
  }

  function highlightSearchTerm(s: string) {
    return searchTermHighlightRegex.value && searchTermHighlightReplacement.value
      ? s.replace(searchTermHighlightRegex.value, searchTermHighlightReplacement.value)
      : s
  }

  function formatFound(copyTemplate?: CopyTemplateData): string | Error {
    const tpl = copyTemplate ?? settings.persist.copyTemplates.find(it => it.name === settings.persist.defaultCopyTemplate)
    const content = translation.value?.content
    if (!tpl) return new Error('Nie znaleziono żadnego szablonu kopiowania')
    if (!content) return new Error('Treść tłumaczenia nie została załadowana')
    if (fragments.value.length === 0) return new Error('Nie znaleziono żadnych fragmentów')

    try {
      return fragments.value.reduce((acc, cur) => {
        const formatted = formatPassage(cur, tpl, content)
        return formatted ? acc + '\n\n' + formatted : ''
      })
    } catch (error) {
      return new Error(errorMessage('Błąd podczas formatowania:', error))
    }
  }

  function formatSelectedPassage(copyTemplate?: CopyTemplateData): string | Error {
    const tpl = copyTemplate ?? settings.persist.copyTemplates.find(it => it.name === settings.persist.defaultCopyTemplate)
    if (!tpl) return new Error('Nie znaleziono żadnego szablonu kopiowania')
    if (!chapterFragment.value) return new Error('Nie zaznaczono fragmentu')
    if (!translation.value?.content) return new Error('Treść tłumaczenia nie została załadowana')
    return formatPassage(chapterFragment.value, tpl, translation.value.content)
  }

  function formatPassage(passage: Passage, tpl: CopyTemplateData, translationContent: TranslationContent) {
    const lang = currentTranslation.value.lang
    const formatTemplate = settings.persist.formatTemplates.find(it => it.name === tpl.lang[lang].formatTemplate)
    const bookNaming = settings.persist.languageSettings[lang].bookNamings.find(it => it.name === tpl.lang[lang].bookNaming)?.books
    const abbreviation = currentTranslation.value.symbol
    if (!formatTemplate || !bookNaming) return ''
    return format(formatTemplate, passage, translationContent, bookNaming, abbreviation)
  }

  function formattedSample(tpl: CopyTemplateData) {
    const lang = currentTranslation.value.lang
    const formatTemplate = settings.persist.formatTemplates.find(it => it.name === tpl.lang[lang].formatTemplate)
    const bookNaming = settings.persist.languageSettings[lang].bookNamings.find(it => it.name === tpl.lang[lang].bookNaming)?.books
    const abbreviation = currentTranslation.value.symbol
    if (!formatTemplate || !bookNaming) return ''
    return formatSample(formatTemplate, bookNaming, abbreviation)
  }

  function formattedSearchResults() {
    const formatted: Array<{ bibleReference: string, symbol: string, content: string }> = []
    fragments.value.forEach(fragment => {
      if (!translationContent.value) return ''
      const verses = jota.verses(translationContent.value, fragment)
      if (!verses.length) {
        console.warn(`Could not format ${JSON.stringify(fragment)}`)
        return
      }
      const bibleReference = jota.formatReference(fragment, books.value, separator.value)
      const symbol = translation.value?.symbol.toUpperCase() || ''
      const content = '"' + highlightSearchTerm(verses.join('\n')) + '"'
      formatted.push({ bibleReference, symbol, content })
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
    setChapterFragment([book, chapter, start, end ?? start])
  }

  async function sortAndDeduplicate() {
    shouldSort.value = !shouldSort.value
    if (shouldSort.value) {
      const newFragments = await jota.sortAndDeduplicate(fragments.value.slice())
      fragments.value = Object.freeze(newFragments)
    }
  }

  function setLayout(newLayout: PassageListLayout) {
    layout.value = newLayout
  }

  function clearFragments() {
    setFragments([])
    input.value = ''
    searchTerm.value = ''
    searchTermHighlightRegex.value = ''
    searchTermHighlightReplacement.value = ''
  }

  return {
    audioOn,
    goToAdjacentChapter,
    goToAdjacentVerse,
    goToAdjacentPage,
    chapterCaption,
    chapterFragment,
    chapterVerses,
    copyTemplates: settings.persist.copyTemplates,
    currentTranslation,
    error,
    findByInput,
    formatFound,
    formatSelected: formatSelectedPassage,
    formattedSample,
    formattedSearchResults,
    found,
    fragments,
    fragmentIndex,
    hasSelection,
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
    shouldSortTooltip,
    translation,
    words,
    showPicker,
    sortAndDeduplicate,
    setLayout,
    clearFragments,
    updateSelectionClasses,
    setChapterFragment,
  }
})
