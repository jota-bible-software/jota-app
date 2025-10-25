import { useStorage } from '@vueuse/core'
import { nanoid } from 'nanoid'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { Notify } from 'quasar'
import {
  addHighlight as hlAddHighlight,
  clearAllHighlights as hlClearAllHighlights,
  clearColorHighlights as hlClearColorHighlights,
  getExactPassageHighlight as hlGetExactPassageHighlight,
  getHighlightForVerse as hlGetHighlightForVerse,
  removeHighlight as hlRemoveHighlight,
  toggleHighlight as hlToggleHighlight
} from 'src/logic/highlighter'
import { HighlightColor, Highlights, PassageHighlight } from 'src/types'
import { getLocalStorageSize, getLocalStorageUsagePercent, isQuotaExceededError, LOCAL_STORAGE_KEY } from 'src/util'
import { useSearchStore } from './search-store'
import { useSettingsStore } from './settings-store'
import { useTranslationStore } from './translation-store'

const defaultHighlightColors: HighlightColor[] = [
  { id: 'hl-yellow', name: 'Study', hex: '#ffeb3b', order: 0 },
  { id: 'hl-green', name: 'Promises', hex: '#4caf50', order: 1 },
  { id: 'hl-blue', name: 'Commands', hex: '#2196f3', order: 2 },
  { id: 'hl-orange', name: 'Prayer', hex: '#ff9800', order: 3 },
  { id: 'hl-pink', name: 'Important', hex: '#e91e63', order: 4 },
  { id: 'hl-purple', name: 'Prophecy', hex: '#9c27b0', order: 5 },
  { id: 'hl-red', name: 'Warnings', hex: '#f44336', order: 6 },
  { id: 'hl-gray', name: 'Notes', hex: '#9e9e9e', order: 7 }
]

export const useHighlightStore = defineStore('highlight', () => {
  const translationStore = useTranslationStore()
  const settingsStore = useSettingsStore()

  // Persistent state with error handling
  const highlights = useStorage<Highlights>(
    LOCAL_STORAGE_KEY + '.highlights',
    {
      translation: { locale: 'en-US', symbol: '' },
      passageHighlights: [],
      config: {
        colors: defaultHighlightColors,
        active: 'hl-yellow'
      }
    },
    localStorage,
    {
      deep: true,
      // Handle storage errors (quota exceeded, etc.)
      onError: (error: unknown) => {
        if (isQuotaExceededError(error)) {
          const size = getLocalStorageSize()
          const sizeInMB = (size / (1024 * 1024)).toFixed(2)
          const percent = getLocalStorageUsagePercent().toFixed(1)

          Notify.create({
            type: 'negative',
            message: 'Storage Quota Exceeded',
            caption: `Your highlights could not be saved. Storage usage: ${sizeInMB}MB (${percent}%). Please remove some highlights or other data.`,
            timeout: 10000,
            actions: [{ label: 'Dismiss', color: 'white' }]
          })

          console.error('localStorage quota exceeded:', {
            size,
            sizeInMB,
            percent,
            highlightCount: highlights.value.passageHighlights.length
          })
        } else {
          // Log other storage errors
          console.error('localStorage error:', error)
        }
      }
    }
  )

  // Transient state
  const paletteVisible = ref(false)
  const filterColorId = ref<string | null>(null)

  // Computed
  const highlightingEnabled = computed(() => settingsStore.persist.app.highlightingEnabled)

  const config = computed(() => highlights.value.config)

  const activeColor = computed(() =>
    config.value.colors.find((c: HighlightColor) => c.id === config.value.active)
  )

  const sortedColors = computed(() =>
    [...config.value.colors].sort((a, b) => a.order - b.order)
  )

  // Only show highlights for currently selected translation
  const currentTranslationHighlights = computed(() => {
    if (!highlightingEnabled.value) return []

    const currentSymbol = translationStore.currentTranslation?.symbol
    if (!currentSymbol) return []
    if (highlights.value.translation.symbol !== currentSymbol) return []

    return highlights.value.passageHighlights
  })

  const highlightMap = computed(() => {
    const map = new Map<string, PassageHighlight>()
    currentTranslationHighlights.value.forEach(h => {
      const key = getPassageKey(h.passage)
      map.set(key, h)
    })
    return map
  })

  const filteredHighlights = computed(() => {
    if (!filterColorId.value) return currentTranslationHighlights.value

    return currentTranslationHighlights.value.filter(
      (h: { highlightColorId: string | null }) => h.highlightColorId === filterColorId.value
    )
  })

  const highlightStats = computed(() => {
    const stats = new Map<string, number>()
    currentTranslationHighlights.value.forEach(h => {
      const count = stats.get(h.highlightColorId) || 0
      stats.set(h.highlightColorId, count + 1)
    })
    return stats
  })

  const currentChapterHighlights = computed(() => {
    const searchStore = useSearchStore()
    if (!searchStore.chapterFragment) return []

    const [book, chapter] = searchStore.chapterFragment

    return currentTranslationHighlights.value.filter(h => {
      const [hBook, hChapter] = h.passage
      return hBook === book && hChapter === chapter
    })
  })

  const hasTranslationMismatch = computed(() => {
    if (!highlightingEnabled.value) return false
    const currentSymbol = translationStore.currentTranslation?.symbol
    return !!highlights.value.translation.symbol &&
      highlights.value.translation.symbol !== currentSymbol
  })

  // Helper functions
  function getPassageKey(passage: [number, number, number, number]): string {
    return `${passage[0]}-${passage[1]}-${passage[2]}-${passage[3]}`
  }

  // Utility to run pure operations over the highlights array and persist results
  function withHighlighter(fn: (hs: PassageHighlight[]) => PassageHighlight[]) {
    const current = [...highlights.value.passageHighlights]
    const next = fn(current)
    highlights.value.passageHighlights = next
  }

  // Actions (delegate complex range logic to Highlighter)
  function addHighlight(
    passage: [number, number, number, number],
    colorId?: string
  ): void {
    if (!highlightingEnabled.value) return

    const currentTranslation = translationStore.currentTranslation
    if (!currentTranslation) return

    const useColorId = colorId || config.value.active

    withHighlighter(hs => hlAddHighlight(hs, passage, useColorId, Date.now()))

    // Update translation context if first highlight or missing
    if (highlights.value.passageHighlights.length === 1 || !highlights.value.translation.symbol) {
      highlights.value.translation = {
        locale: currentTranslation.locale,
        symbol: currentTranslation.symbol
      }
    }
  }

  function removeHighlight(passage: [number, number, number, number]): void {
    withHighlighter(hs => hlRemoveHighlight(hs, passage))
  }

  function toggleHighlight(passage: [number, number, number, number], colorId?: string): void {
    if (!highlightingEnabled.value) return
    const active = colorId || config.value.active
    withHighlighter(hs => hlToggleHighlight(hs, passage, active, Date.now()))
  }

  function getHighlight(
    book: number,
    chapter: number,
    verse: number
  ): PassageHighlight | undefined {
    if (!highlightingEnabled.value) return undefined
    return hlGetHighlightForVerse(highlights.value.passageHighlights, book, chapter, verse)
  }

  function getExactPassageHighlight(
    passage: [number, number, number, number]
  ): PassageHighlight | undefined {
    if (!highlightingEnabled.value) return undefined
    return hlGetExactPassageHighlight(highlights.value.passageHighlights, passage)
  }

  function togglePalette(): void {
    paletteVisible.value = !paletteVisible.value
  }

  function setActiveColor(colorId: string): void {
    if (config.value.colors.some(c => c.id === colorId)) {
      highlights.value.config.active = colorId
    }
  }

  function setFilterColor(colorId: string | null): void {
    filterColorId.value = colorId
  }

  // Color management
  function addColor(name: string, hex: string): void {
    const maxOrder = Math.max(...config.value.colors.map(c => c.order), -1)
    const newColor: HighlightColor = {
      id: nanoid(10),
      name,
      hex,
      order: maxOrder + 1
    }
    highlights.value.config.colors.push(newColor)
  }

  function removeColor(colorId: string): boolean {
    // Don't allow removing the last color
    if (config.value.colors.length <= 1) return false

    const index = config.value.colors.findIndex(c => c.id === colorId)
    if (index === -1) return false

    // Remove the color
    highlights.value.config.colors.splice(index, 1)

    // Remove all highlights using this color
    highlights.value.passageHighlights = highlights.value.passageHighlights.filter(
      h => h.highlightColorId !== colorId
    )

    // If active color was removed, set new active
    if (config.value.active === colorId) {
      highlights.value.config.active = config.value.colors[0].id
    }

    return true
  }

  function updateColor(colorId: string, updates: Partial<HighlightColor>): void {
    const color = config.value.colors.find(c => c.id === colorId)
    if (color) {
      Object.assign(color, updates)
    }
  }

  function reorderColors(newOrder: HighlightColor[]): void {
    newOrder.forEach((color, index) => {
      const existing = config.value.colors.find(c => c.id === color.id)
      if (existing) {
        existing.order = index
      }
    })
    highlights.value.config.colors.sort((a, b) => a.order - b.order)
  }

  function clearAllHighlights(): void {
    highlights.value.passageHighlights = hlClearAllHighlights(highlights.value.passageHighlights)
  }

  function clearColorHighlights(colorId: string): void {
    highlights.value.passageHighlights = hlClearColorHighlights(highlights.value.passageHighlights, colorId)
  }

  function resetToDefaults(): void {
    // Clear existing colors
    highlights.value.config.colors.splice(0, highlights.value.config.colors.length)
    // Add default colors one by one to ensure reactivity
    defaultHighlightColors.forEach(color => {
      highlights.value.config.colors.push({ ...color })
    })
    // Reset active color
    highlights.value.config.active = defaultHighlightColors[0].id
    // Clear all passages
    highlights.value.passageHighlights = hlClearAllHighlights(highlights.value.passageHighlights)
  }

  // Export/Import
  function exportHighlights(): string {
    return JSON.stringify({
      version: '1.0',
      exportDate: new Date().toISOString(),
      highlights: highlights.value
    }, null, 2)
  }

  function importHighlights(data: string): void {
    try {
      const imported = JSON.parse(data)

      // Validate structure
      if (!imported.highlights) {
        throw new Error('Invalid highlight data structure')
      }

      // Put current highlights on top of imported ones
      highlights.value.passageHighlights = [
        ...highlights.value.passageHighlights,
        ...imported.highlights.passageHighlights
      ]

      // Merge colors, keeping existing ones and adding new ones
      const existingColorIds = new Set(config.value.colors.map(c => c.id))
      const newColors = imported.highlights.config.colors.filter(
        (c: HighlightColor) => !existingColorIds.has(c.id)
      )
      highlights.value.config.colors = [
        ...highlights.value.config.colors,
        ...newColors
      ]

    } catch (error) {
      console.error('Failed to import highlights:', error)
      throw error
    }
  }

  function getStorageInfo() {
    const totalSize = getLocalStorageSize()
    const percent = getLocalStorageUsagePercent()
    const highlightData = localStorage.getItem(LOCAL_STORAGE_KEY + '.highlights')
    const highlightSize = highlightData ? highlightData.length : 0

    return {
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      usagePercent: percent.toFixed(1),
      highlightCount: highlights.value.passageHighlights.length,
      highlightSize,
      highlightSizeKB: (highlightSize / 1024).toFixed(2),
    }
  }

  return {
    // State
    highlights,
    paletteVisible,
    filterColorId,

    // Computed
    highlightingEnabled,
    config,
    activeColor,
    sortedColors,
    highlightMap,
    currentTranslationHighlights,
    filteredHighlights,
    highlightStats,
    currentChapterHighlights,
    hasTranslationMismatch,

    // Actions
    addHighlight,
    removeHighlight,
    toggleHighlight,
    getHighlight,
    getExactPassageHighlight,
    togglePalette,
    setActiveColor,
    setFilterColor,
    addColor,
    removeColor,
    updateColor,
    reorderColors,
    clearAllHighlights,
    clearColorHighlights,
    resetToDefaults,
    exportHighlights,
    importHighlights,
    getStorageInfo
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHighlightStore, import.meta.hot))
}
