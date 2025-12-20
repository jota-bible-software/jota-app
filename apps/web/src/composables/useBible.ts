/**
 * useBible composable
 * Vue-reactive wrapper around BibleService
 */

import { ref, computed, readonly, shallowRef, type Ref, type ComputedRef, type ShallowRef } from 'vue'
import { getAppService } from '../services/app-service'
import type { TranslationKey, TranslationContent } from '@jota/core'
import type { Passage } from 'src/types'

export interface UseBibleReturn {
  // State
  currentKey: Ref<TranslationKey | null>
  currentContent: ShallowRef<TranslationContent | null>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  currentPassage: Ref<Passage | undefined>
  chapterVerses: ComputedRef<string[]>
  chapterCaption: ComputedRef<string>

  // Actions
  loadTranslation: (key: TranslationKey) => Promise<void>
  setPassage: (passage: Passage) => void
  goToAdjacentChapter: (direction: 1 | -1) => void
  getVerses: (passage: Passage) => string[]
  formatReference: (fragment: Passage, bookNames: string[], separator: string) => string

  // Service access
  service: ReturnType<typeof getAppService>['bible']
}

export function useBible(bookNames?: Ref<string[]>): UseBibleReturn {
  const appService = getAppService()
  const service = appService.bible

  // Reactive state
  const currentKey: Ref<TranslationKey | null> = ref(service.currentKey)
  const currentContent = shallowRef<TranslationContent | null>(service.currentContent)
  const isLoading = ref(false)
  const error: Ref<string | null> = ref(null)
  const currentPassage: Ref<Passage | undefined> = ref()

  const loadTranslation = async (key: TranslationKey): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      const content = await service.loadTranslation(key)
      service.setCurrentTranslation(key)
      currentKey.value = key
      currentContent.value = content
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
      appService.notifications.error('Failed to load translation', error.value)
    } finally {
      isLoading.value = false
    }
  }

  const setPassage = (passage: Passage): void => {
    currentPassage.value = passage
  }

  const chapterVerses = computed(() => {
    if (!currentContent.value || !currentPassage.value) return []
    const [book, chapter] = currentPassage.value
    return service.getChapter(book, chapter) || []
  })

  const chapterCaption = computed(() => {
    if (!currentPassage.value) return ''
    const names = bookNames?.value || []
    return service.getChapterCaption(currentPassage.value, names)
  })

  const goToAdjacentChapter = (direction: 1 | -1): void => {
    if (!currentContent.value || !currentPassage.value) return
    const adjacent = service.getAdjacentChapter(currentPassage.value, direction)
    if (adjacent) {
      currentPassage.value = adjacent
    }
  }

  const getVerses = (passage: Passage): string[] => {
    return service.getVerses(passage)
  }

  const formatReference = (
    fragment: Passage,
    names: string[],
    separator: string
  ): string => {
    return service.formatReference(fragment, names, separator)
  }

  return {
    // State
    currentKey,
    currentContent,
    isLoading,
    error,
    currentPassage,
    chapterVerses,
    chapterCaption,

    // Actions
    loadTranslation,
    setPassage,
    goToAdjacentChapter,
    getVerses,
    formatReference,

    // Service access for advanced use
    service,
  }
}
