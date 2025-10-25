import { useStorage } from '@vueuse/core'
import { nanoid } from 'nanoid'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { Notify } from 'quasar'
import {
  addHighlight as hlAddHighlight,
  clearColorHighlights as hlClearColorHighlights,
  getExactPassageHighlight as hlGetExactPassageHighlight,
  getHighlightForVerse as hlGetHighlightForVerse,
  removeHighlight as hlRemoveHighlight,
  toggleHighlight as hlToggleHighlight
} from 'src/logic/highlighter'
import { HighlightColor, Highlights, HighlightsLegacy, PassageHighlight } from 'src/types'
import { getLocalStorageSize, getLocalStorageUsagePercent, isQuotaExceededError, LOCAL_STORAGE_KEY } from 'src/util'
import { useSearchStore } from './search-store'
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

  // Persistent state with error handling
  const highlights = useStorage<Highlights>(
    LOCAL_STORAGE_KEY + '.highlights',
    {
      byTranslation: {},
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

          const totalHighlights = Object.values(highlights.value.byTranslation).reduce((sum, arr) => sum + arr.length, 0)
          console.error('localStorage quota exceeded:', {
            size,
            sizeInMB,
            percent,
            highlightCount: totalHighlights
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

  // Helper function to get translation key
  function getTranslationKey(locale: string, symbol: string): string {
    return `${locale}:${symbol}`
  }

  // Computed
  const highlightingEnabled = computed(() => {
    const currentTranslation = translationStore.currentTranslation
    return currentTranslation?.highlightsEnabled?.value ?? false
  })

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

    const currentTranslation = translationStore.currentTranslation
    if (!currentTranslation) return []

    const translationKey = getTranslationKey(currentTranslation.locale, currentTranslation.symbol)
    return highlights.value.byTranslation[translationKey] || []
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

  // With multi-translation support, there's no concept of "mismatch" anymore
  // Each translation has its own highlights
  const hasTranslationMismatch = computed(() => false)

  // Helper functions
  function getPassageKey(passage: [number, number, number, number]): string {
    return `${passage[0]}-${passage[1]}-${passage[2]}-${passage[3]}`
  }

  // Utility to run pure operations over the highlights array for current translation
  function withHighlighter(fn: (hs: PassageHighlight[]) => PassageHighlight[]) {
    const currentTranslation = translationStore.currentTranslation
    if (!currentTranslation) return

    const translationKey = getTranslationKey(currentTranslation.locale, currentTranslation.symbol)
    const current = [...(highlights.value.byTranslation[translationKey] || [])]
    const next = fn(current)
    highlights.value.byTranslation[translationKey] = next
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
    return hlGetHighlightForVerse(currentTranslationHighlights.value, book, chapter, verse)
  }

  function getExactPassageHighlight(
    passage: [number, number, number, number]
  ): PassageHighlight | undefined {
    if (!highlightingEnabled.value) return undefined
    return hlGetExactPassageHighlight(currentTranslationHighlights.value, passage)
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

    // Remove all highlights using this color across all translations
    Object.keys(highlights.value.byTranslation).forEach(translationKey => {
      highlights.value.byTranslation[translationKey] = highlights.value.byTranslation[translationKey].filter(
        h => h.highlightColorId !== colorId
      )
    })

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
    // Clear highlights for current translation only
    const currentTranslation = translationStore.currentTranslation
    if (!currentTranslation) return

    const translationKey = getTranslationKey(currentTranslation.locale, currentTranslation.symbol)
    highlights.value.byTranslation[translationKey] = []
  }

  function clearColorHighlights(colorId: string): void {
    // Clear color highlights for current translation only
    const currentTranslation = translationStore.currentTranslation
    if (!currentTranslation) return

    const translationKey = getTranslationKey(currentTranslation.locale, currentTranslation.symbol)
    const current = highlights.value.byTranslation[translationKey] || []
    highlights.value.byTranslation[translationKey] = hlClearColorHighlights(current, colorId)
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
    // Clear all passages across all translations
    highlights.value.byTranslation = {}
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

      const importedHighlights = imported.highlights as Highlights | HighlightsLegacy

      // Handle legacy format (single translation with passageHighlights)
      if ('passageHighlights' in importedHighlights && 'translation' in importedHighlights) {
        const legacy = importedHighlights as HighlightsLegacy
        const translationKey = getTranslationKey(legacy.translation.locale, legacy.translation.symbol)

        // Merge with existing highlights for this translation
        const existing = highlights.value.byTranslation[translationKey] || []
        highlights.value.byTranslation[translationKey] = [
          ...existing,
          ...legacy.passageHighlights
        ]
      }
      // Handle new format (byTranslation)
      else if ('byTranslation' in importedHighlights) {
        const newFormat = importedHighlights as Highlights

        // Merge highlights for each translation
        Object.keys(newFormat.byTranslation).forEach(translationKey => {
          const existing = highlights.value.byTranslation[translationKey] || []
          highlights.value.byTranslation[translationKey] = [
            ...existing,
            ...newFormat.byTranslation[translationKey]
          ]
        })
      }

      // Merge colors, keeping existing ones and adding new ones
      const existingColorIds = new Set(config.value.colors.map(c => c.id))
      const newColors = importedHighlights.config.colors.filter(
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

    // Count all highlights across all translations
    const totalHighlights = Object.values(highlights.value.byTranslation).reduce((sum, arr) => sum + arr.length, 0)

    return {
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      usagePercent: percent.toFixed(1),
      highlightCount: totalHighlights,
      highlightSize,
      highlightSizeKB: (highlightSize / 1024).toFixed(2),
    }
  }

  function getHighlightCountForTranslation(locale: string, symbol: string): number {
    const translationKey = getTranslationKey(locale, symbol)
    return highlights.value.byTranslation[translationKey]?.length || 0
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
    getStorageInfo,
    getHighlightCountForTranslation
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHighlightStore, import.meta.hot))
}
