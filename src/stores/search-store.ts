import { defineStore } from 'pinia'
import { CopyTemplateData, Passage, PassageListLayout, Progress, SearchOptions, EditionContent } from 'src/types'
import { jota } from 'src/logic/jota'
import { format, formatSample } from 'src/logic/format'
import { useSettingsStore } from './settings-store'
import { useEditionStore } from './edition-store'
import { decodeHtml, Direction, errorMessage } from 'src/util'
import { useI18n } from 'vue-i18n'

export const useSearchStore = defineStore('search', () => {
  const settings = useSettingsStore()
  const editions = useEditionStore()
  const { t } = useI18n()

  const audioOn = ref(false)
  const chapterFragment: Ref<Passage | undefined> = ref()
  const editionContent = computed(() => editions.currentContent)
  const error = ref('')
  const fragments: Ref<readonly Passage[]> = ref([])
  const fragmentIndex = ref(-1)
  const input = ref('')
  const layout: Ref<PassageListLayout> = ref('split')
  const progress = ref(0.0)
  const scrollToIndex = ref(0)
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
  const chapterCaption = computed(() => chapterFragment.value ? jota.chapterCaption(chapterFragment.value, books.value) : '')
  const chapterVerses = computed(() => editionContent.value && chapterFragment.value ? jota.chapterVerses(editionContent.value, chapterFragment.value) : [])
  const found = computed(() => !!fragments.value.length)
  const hasSelection = computed(() => chapterFragment.value && chapterFragment.value[2] != null)
  const loading = computed(() => !editions.currentContent)
  const passages = computed(() =>
    fragments.value.map((osisRef) => jota.formatReference(osisRef, books.value, separator.value)))

  // const shouldSortTooltip = computed(() => (shouldSort.value ? 'Wy' : 'W') + 'łącz sortowanie i usuwanie duplikatów wśród wyszukanych fragmentów')
  const shouldSortTooltip = computed(() => t('searchStore.sortTooltip'))

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

  function setChapterFragment(newFragment: Passage, keepTextSelection = false, scroll = true) {
    chapterFragment.value = newFragment
    updateSelectionClasses()
    if (!keepTextSelection) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
      }
    }
    if (scroll) {
      const [, , start, end] = newFragment
      const s = start ?? 0
      const e = end ?? start ?? 0
      scrollToIndex.value = s + Math.floor((e - s) / 2)
    }
  }

  function updateSelectionClasses() {
    if (!chapterFragment.value) return
    const [, , start, end2] = chapterFragment.value
    const len = chapterVerses.value.length
    if (start == null) {
      selectionClasses.value = new Array(len).fill('')
    } else {
      const end = end2 ?? start
      for (let i = 0; i < len; i++) {
        selectionClasses.value[i] =
          i === start && i === end ? 'selection-single' :
            i === start && i !== end ? 'selection-start' :
              i === end && i !== start ? 'selection-end' :
                start < i && i < end ? 'selection-middle' : ''
      }
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
    if (!editionContent.value || !chapterFragment.value) return
    const [bible, chapter, start, end] = chapterFragment.value
    const s = direction === Direction.Prev ? Math.max(0, (start ?? 0) - 1) :
      direction === Direction.Next ? Math.min(chapterVerses.value.length - 1, (end ?? 0) + 1) : start
    setChapterFragment([bible, chapter, s, s])
  }

  async function goToAdjacentChapter(direction: Direction) {
    if (!editionContent.value || !chapterFragment.value) return
    const adjacent = jota.adjacentChapter(editionContent.value, chapterFragment.value, direction) as Passage | undefined
    if (adjacent) {
      const [b, c] = adjacent
      setChapterFragment([b, c])
    }
  }

  async function goToAdjacentPage(direction: Direction) {
    if (!editionContent.value || !chapterFragment.value) return
    const adjacent = jota.adjacentChapter(editionContent.value, chapterFragment.value, direction) as Passage | undefined
    if (adjacent) {
      const [b, c] = adjacent
      setChapterFragment([b, c, 0, 0])
    }
  }

  function clearSearch() {
    // input.value = ''
    searchTerm.value = ''
    fragments.value = []
    fragmentIndex.value = -1
    chapterFragment.value = undefined
    // setChapterFragment()
  }

  async function findByInput(input: string, options: SearchOptions) {
    if (!editionContent.value) return
    const t0 = Date.now()
    const bible = editionContent.value
    const editionSymbol = editions.currentEdition?.symbol
    const text = input.replace(/\n/g, '#')
    clearSearch()
    if (!text) return

    searchTerm.value = input

    const beforeFragmentCount = fragments.value.length
    const progressRunner: Progress = {
      step: (value) => {
        progress.value = value / (editionContent.value?.length || 1)
      }
    }
    Object.assign(options, { words: words.value, shouldSort: shouldSort.value, editionSymbol })
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
      error.value = errorMessage(t('searchStore.errorPrefix'), ex)
      console.error(ex)
    } finally {
      progress.value = 0
    }
  }

  function highlightSearchTerm(s: string) {
    const text = decodeHtml(s)
    return searchTermHighlightRegex.value && searchTermHighlightReplacement.value
      ? text.replace(searchTermHighlightRegex.value, searchTermHighlightReplacement.value)
      : text
  }

  function formatFound(copyTemplate?: CopyTemplateData): string | Error {
    const tpl = copyTemplate ?? settings.localized.copyTemplates.find(it => it.name === settings.localized.defaultCopyTemplate)

    if (!tpl) return new Error(t('searchStore.noTemplateFound'))
    if (!editionContent.value) return new Error(t('searchStore.editionContentNotLoaded'))
    if (fragments.value.length === 0) return new Error(t('searchStore.noFragmentsFound'))

    try {
      return fragments.value
      .map((it) => formatPassage(it, tpl, editionContent.value as EditionContent))
      .join('\n\n')
    } catch (error) {
      return new Error(errorMessage(t('searchStore.formattingError'), error))
    }
  }

  function formatSelectedPassage(copyTemplate?: CopyTemplateData): string | Error {
    const tpl = copyTemplate ?? settings.localized.copyTemplates.find(it => it.name === settings.localized.defaultCopyTemplate)
    if (!tpl) return new Error(t('searchStore.noTemplateFound'))
    if (!chapterFragment.value) return new Error(t('searchStore.noPassageSelected'))
    if (!editionContent.value) return new Error(t('searchStore.editionContentNotLoaded'))
    return formatPassage(chapterFragment.value, tpl, editionContent.value)
  }

  function formatPassage(passage: Passage, tpl: CopyTemplateData, content: EditionContent) {
    const locale = editions.currentEdition.locale
    const formatTemplate = settings.persist.formatTemplates.find(it => it.name === tpl.formatTemplate)
    const bookNaming = settings.persist.localized[locale].bookNamings.find(it => it.name === tpl.bookNaming)?.books
    const abbreviation = editions.currentEdition.symbol
    if (!formatTemplate || !bookNaming) return ''
    return format(formatTemplate, passage, content, bookNaming, abbreviation)
  }

  function formattedSample(tpl: CopyTemplateData) {
    const lang = editions.currentEdition.locale
    const formatTemplate = settings.persist.formatTemplates.find(it => it.name === tpl.formatTemplate)
    const bookNaming = settings.persist.localized[lang].bookNamings.find(it => it.name === tpl.bookNaming)?.books
    const abbreviation = editions.currentEdition.symbol
    if (!formatTemplate || !bookNaming) return ''
    return formatSample(formatTemplate, bookNaming, abbreviation)
  }

  function formattedSearchResults() {
    const formatted: Array<{ bibleReference: string, symbol: string, text: string }> = []
    fragments.value.forEach(fragment => {
      if (!editionContent.value) return ''
      const verses = jota.verses(editionContent.value, fragment)
      if (!verses.length) {
        console.warn(t('searchStore.warningCouldNotFormat'), JSON.stringify(fragment))
        return
      }
      const bibleReference = jota.formatReference(fragment, books.value, separator.value)
      const symbol = editions.currentEdition.symbol.toUpperCase() || ''
      const text = '"' + highlightSearchTerm(verses.join('\n')) + '"'
      formatted.push({ bibleReference, symbol, text })
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
    copyTemplates: settings.localized.copyTemplates,
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
    scrollToIndex,
    selectInChapter,
    selectionEnd,
    selectionStart,
    selectionClasses,
    searchTermHighlightRegex,
    searchTerm,
    searchTermHighlightReplacement,
    separator,
    setFragmentIndex,
    shouldSort,
    shouldSortTooltip,
    words,
    showPicker,
    sortAndDeduplicate,
    setLayout,
    clearFragments,
    updateSelectionClasses,
    setChapterFragment,
  }
})
