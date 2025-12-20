/**
 * useHighlights composable
 * Vue-reactive wrapper around HighlightService
 */

import { ref, computed, readonly, type Ref, type ComputedRef } from 'vue'
import { getAppService } from '../services/app-service'
import type { PassageHighlight, HighlightColor, TranslationKey } from '@jota/core'

export interface UseHighlightsReturn {
  // State
  colors: ComputedRef<HighlightColor[]>
  activeColorId: ComputedRef<string>
  activeColor: ComputedRef<HighlightColor | undefined>
  paletteVisible: Ref<boolean>
  filterColorId: Ref<string | null>

  // Actions
  toggle: (passage: [number, number, number, number], colorId?: string) => void
  add: (passage: [number, number, number, number], colorId?: string) => void
  remove: (passage: [number, number, number, number]) => void
  getForVerse: (book: number, chapter: number, verse: number) => PassageHighlight | undefined
  getChapterHighlights: (book: number, chapter: number) => PassageHighlight[]
  getExactPassageHighlight: (passage: [number, number, number, number]) => PassageHighlight | undefined
  getHighlightColor: (colorId: string) => HighlightColor | undefined
  setActiveColor: (colorId: string) => void
  setCurrentTranslation: (key: TranslationKey | null) => void
  togglePalette: () => void
  clearColorHighlights: (colorId: string) => void

  // Service access
  service: ReturnType<typeof getAppService>['highlights']
}

export function useHighlights(): UseHighlightsReturn {
  const appService = getAppService()
  const service = appService.highlights

  // UI state (not persisted in service)
  const paletteVisible = ref(false)
  const filterColorId: Ref<string | null> = ref(null)

  const colors = computed(() => service.colors)
  const activeColorId = computed(() => service.activeColorId)
  const activeColor = computed(() => service.activeColor)

  const toggle = (
    passage: [number, number, number, number],
    colorId?: string
  ): void => {
    service.toggle(passage, colorId)
  }

  const add = (
    passage: [number, number, number, number],
    colorId?: string
  ): void => {
    service.add(passage, colorId)
  }

  const remove = (passage: [number, number, number, number]): void => {
    service.remove(passage)
  }

  const getForVerse = (
    book: number,
    chapter: number,
    verse: number
  ): PassageHighlight | undefined => {
    return service.getForVerse(book, chapter, verse)
  }

  const getChapterHighlights = (
    book: number,
    chapter: number
  ): PassageHighlight[] => {
    return service.getChapterHighlights(book, chapter)
  }

  const getExactPassageHighlight = (
    passage: [number, number, number, number]
  ): PassageHighlight | undefined => {
    return service.getExactPassageHighlight(passage)
  }

  const getHighlightColor = (colorId: string): HighlightColor | undefined => {
    return service.getHighlightColor(colorId)
  }

  const setActiveColor = (colorId: string): void => {
    service.setActiveColor(colorId)
  }

  const setCurrentTranslation = (key: TranslationKey | null): void => {
    service.currentTranslationKey = key
  }

  const togglePalette = (): void => {
    paletteVisible.value = !paletteVisible.value
  }

  const clearColorHighlights = (colorId: string): void => {
    service.clearColorHighlights(colorId)
  }

  return {
    // State
    colors,
    activeColorId,
    activeColor,
    paletteVisible,
    filterColorId,

    // Actions
    toggle,
    add,
    remove,
    getForVerse,
    getChapterHighlights,
    getExactPassageHighlight,
    getHighlightColor,
    setActiveColor,
    setCurrentTranslation,
    togglePalette,
    clearColorHighlights,

    // Service access
    service,
  }
}
