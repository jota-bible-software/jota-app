/**
 * useSearch composable
 * Vue-reactive wrapper around SearchService
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { getAppService } from '../services/app-service'
import type { SearchOptions } from '@jota/core'
import type { Passage } from 'src/types'

export interface UseSearchReturn {
  // State
  query: Ref<string>
  results: Ref<Passage[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  progress: Ref<number>
  fragmentIndex: Ref<number>
  currentFragment: ComputedRef<Passage | null>
  highlightRegex: Ref<RegExp | null>
  found: ComputedRef<boolean>

  // Actions
  search: (input: string, options?: SearchOptions) => Promise<void>
  selectFragment: (index: number) => void
  moveFragmentIndex: (delta: number) => void
  clear: () => void
  highlightSearchTerm: (text: string) => string
  sortAndDeduplicate: () => void

  // Service access
  service: ReturnType<typeof getAppService>['search']
}

export function useSearch(): UseSearchReturn {
  const appService = getAppService()
  const service = appService.search

  // Reactive state
  const query = ref('')
  const results: Ref<Passage[]> = ref([])
  const isLoading = ref(false)
  const error: Ref<string | null> = ref(null)
  const progress = ref(0)
  const fragmentIndex = ref(-1)
  const highlightRegex: Ref<RegExp | null> = ref(null)

  const currentFragment = computed((): Passage | null =>
    results.value[fragmentIndex.value] || null
  )

  const found = computed(() => results.value.length > 0)

  const search = async (
    input: string,
    options: SearchOptions = {}
  ): Promise<void> => {
    query.value = input

    if (!input.trim()) {
      clear()
      return
    }

    isLoading.value = true
    error.value = null
    progress.value = 0

    try {
      const found = await service.search(input, options)
      results.value = [...found] as Passage[]
      highlightRegex.value = service.highlightRegex
      fragmentIndex.value = found.length > 0 ? 0 : -1
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
      results.value = []
      fragmentIndex.value = -1
      appService.notifications.error('Search failed', error.value)
    } finally {
      isLoading.value = false
      progress.value = 0
    }
  }

  const selectFragment = (index: number): void => {
    if (index >= 0 && index < results.value.length) {
      fragmentIndex.value = index
    }
  }

  const moveFragmentIndex = (delta: number): void => {
    const newIndex = fragmentIndex.value + delta
    if (newIndex >= 0 && newIndex < results.value.length) {
      fragmentIndex.value = newIndex
    }
  }

  const clear = (): void => {
    service.clear()
    query.value = ''
    results.value = []
    fragmentIndex.value = -1
    highlightRegex.value = null
    error.value = null
    progress.value = 0
  }

  const highlightSearchTerm = (text: string): string => {
    return service.highlightSearchTerm(text)
  }

  const sortAndDeduplicate = (): void => {
    results.value = [...service.sortAndDeduplicate()] as Passage[]
  }

  return {
    // State
    query,
    results,
    isLoading,
    error,
    progress,
    fragmentIndex,
    currentFragment,
    highlightRegex,
    found,

    // Actions
    search,
    selectFragment,
    moveFragmentIndex,
    clear,
    highlightSearchTerm,
    sortAndDeduplicate,

    // Service access
    service,
  }
}
