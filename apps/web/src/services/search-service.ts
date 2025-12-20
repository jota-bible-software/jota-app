/**
 * Search Service
 * Handles Bible search functionality
 */

import {
  search,
  searchContent,
  sortAndDeduplicate,
  ensureGlobalRegex,
  parseReferences,
} from '@jota/core'
import type { Passage, Progress, SearchOptions, TranslationContent } from '@jota/core'
import type { BibleService } from './bible-service'

export interface SearchState {
  query: string
  results: readonly Passage[]
  loading: boolean
  error: string | null
  progress: number
  regex: RegExp | null
}

export class SearchService {
  private _state: SearchState = {
    query: '',
    results: [],
    loading: false,
    error: null,
    progress: 0,
    regex: null,
  }

  constructor(private bible: BibleService) {}

  get state(): Readonly<SearchState> {
    return this._state
  }

  get query(): string {
    return this._state.query
  }

  get results(): readonly Passage[] {
    return this._state.results
  }

  get isLoading(): boolean {
    return this._state.loading
  }

  get error(): string | null {
    return this._state.error
  }

  get progress(): number {
    return this._state.progress
  }

  get highlightRegex(): RegExp | null {
    return this._state.regex
  }

  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<readonly Passage[]> {
    const content = this.bible.currentContent
    if (!content) {
      throw new Error('No translation loaded')
    }

    this._state = {
      ...this._state,
      query,
      loading: true,
      error: null,
      progress: 0,
    }

    const progressCallback: Progress = {
      step: (value: number) => {
        this._state.progress = value / this.bible.getBookCount()
      },
    }

    try {
      const results = await search(content, query, options, progressCallback)

      this._state = {
        ...this._state,
        results: Object.freeze(results),
        loading: false,
        regex: ensureGlobalRegex(progressCallback.regex) as RegExp | null,
      }

      return this._state.results
    } catch (error) {
      this._state = {
        ...this._state,
        loading: false,
        error: error instanceof Error ? error.message : String(error),
        results: [],
      }
      throw error
    }
  }

  async searchReferences(input: string): Promise<Passage[]> {
    return parseReferences(input)
  }

  async searchContent(
    regex: RegExp,
    content: TranslationContent,
    progressCallback: Progress
  ): Promise<Passage[]> {
    return searchContent(regex, content, progressCallback)
  }

  sortAndDeduplicate(): readonly Passage[] {
    const sorted = sortAndDeduplicate([...this._state.results])
    this._state.results = Object.freeze(sorted)
    return this._state.results
  }

  clear(): void {
    this._state = {
      query: '',
      results: [],
      loading: false,
      error: null,
      progress: 0,
      regex: null,
    }
  }

  highlightSearchTerm(text: string): string {
    if (!this._state.regex) return text
    const words = this._state.query && !this._state.query.startsWith('/')
    const replacement = words
      ? '$1<span class="bold">$2</span>$3'
      : '<span class="bold">$1</span>'
    return text.replace(this._state.regex, replacement)
  }
}
