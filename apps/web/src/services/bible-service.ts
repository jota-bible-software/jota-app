/**
 * Bible Service
 * Handles Bible translation loading and data access
 */

import type { INetworkAdapter, IStorageAdapter } from '@jota/adapters'
import {
  getBookCount,
  getChapterCount,
  getVerseCount,
  getChapter,
  getVerse,
} from '@jota/core'
import type {
  TranslationContent,
  TranslationKey,
  TranslationFileMeta,
  Passage,
} from '@jota/core'

export interface TranslationState {
  key: TranslationKey
  content: TranslationContent | null
  loading: boolean
  error: string | null
  meta?: TranslationFileMeta
}

interface TranslationFile {
  meta: TranslationFileMeta
  data: TranslationContent
}

export class BibleService {
  private _translations: Map<string, TranslationState> = new Map()
  private _currentKey: TranslationKey | null = null
  private _loadPromises: Map<string, Promise<TranslationContent>> = new Map()

  constructor(
    private network: INetworkAdapter,
    private storage: IStorageAdapter
  ) {}

  get currentKey(): TranslationKey | null {
    return this._currentKey
  }

  get currentTranslation(): TranslationState | null {
    if (!this._currentKey) return null
    return this._translations.get(this.keyToString(this._currentKey)) || null
  }

  get currentContent(): TranslationContent | null {
    return this.currentTranslation?.content || null
  }

  private keyToString(key: TranslationKey): string {
    return `${key.locale}:${key.symbol}`
  }

  async loadTranslation(key: TranslationKey): Promise<TranslationContent> {
    const keyStr = this.keyToString(key)

    // Return existing if loaded
    const existing = this._translations.get(keyStr)
    if (existing?.content) {
      return existing.content
    }

    // Return pending promise if loading
    const pending = this._loadPromises.get(keyStr)
    if (pending) {
      return pending
    }

    // Start loading
    const state: TranslationState = {
      key,
      content: null,
      loading: true,
      error: null,
    }
    this._translations.set(keyStr, state)

    const loadPromise = this.fetchTranslation(key)
    this._loadPromises.set(keyStr, loadPromise)

    try {
      const content = await loadPromise
      state.content = content
      state.loading = false
      return content
    } catch (error) {
      state.error = error instanceof Error ? error.message : String(error)
      state.loading = false
      throw error
    } finally {
      this._loadPromises.delete(keyStr)
    }
  }

  private async fetchTranslation(key: TranslationKey): Promise<TranslationContent> {
    const baseUrl = process.env.VUE_ROUTER_BASE || (process.env.NODE_ENV === 'test' ? '/' : '/jota/')
    const url = `${baseUrl}data/${key.locale}/${key.symbol.toLowerCase()}.json`

    const response = await this.network.get<TranslationFile | TranslationContent>(url)

    // Detect format: if it has 'meta' and 'data' properties, it's new format
    if (response.data && 'meta' in response.data && 'data' in response.data) {
      const file = response.data as TranslationFile
      const state = this._translations.get(this.keyToString(key))
      if (state) state.meta = file.meta
      return file.data
    }

    // Legacy array format
    return response.data as TranslationContent
  }

  setCurrentTranslation(key: TranslationKey): void {
    this._currentKey = key
  }

  getTranslationState(key: TranslationKey): TranslationState | null {
    return this._translations.get(this.keyToString(key)) || null
  }

  isLoaded(key: TranslationKey): boolean {
    const state = this.getTranslationState(key)
    return state?.content != null
  }

  // Delegate to @jota/core functions
  getChapter(book: number, chapter: number): string[] | undefined {
    if (!this.currentContent) return undefined
    return getChapter(this.currentContent, book, chapter)
  }

  getVerse(book: number, chapter: number, verse: number): string | undefined {
    if (!this.currentContent) return undefined
    return getVerse(this.currentContent, book, chapter, verse)
  }

  getBookCount(): number {
    if (!this.currentContent) return 0
    return getBookCount(this.currentContent)
  }

  getChapterCount(book: number): number {
    if (!this.currentContent) return 0
    return getChapterCount(this.currentContent, book)
  }

  getVerseCount(book: number, chapter: number): number {
    if (!this.currentContent) return 0
    return getVerseCount(this.currentContent, book, chapter)
  }

  getAdjacentChapter(passage: Passage, direction: 1 | -1): Passage | null {
    if (!this.currentContent) return null
    const [bi, ci] = passage
    const bookCount = this.getBookCount()
    const currentBookChapterCount = this.getChapterCount(bi)

    if (direction === -1) {
      if (ci === 0) {
        if (bi === 0) return null
        return [bi - 1, this.getChapterCount(bi - 1) - 1]
      }
      return [bi, ci - 1]
    } else {
      if (ci === currentBookChapterCount - 1) {
        if (bi === bookCount - 1) return null
        return [bi + 1, 0]
      }
      return [bi, ci + 1]
    }
  }

  getChapterCaption(passage: Passage, bookNames: string[]): string {
    if (!passage) return ''
    const [bookIndex, chapter] = passage
    const book = bookNames[bookIndex]
    return `${book} ${chapter + 1}`
  }

  getChapterVerses(passage: Passage): string[] {
    if (!this.currentContent || !passage) return []
    const [book, chapter] = passage
    return getChapter(this.currentContent, book, chapter) || []
  }

  getVerses(passage: Passage): string[] {
    if (!this.currentContent) return []
    const [bi, ci, si, ei] = passage
    const content = getChapter(this.currentContent, bi, ci)
    if (!content) return []

    const start = si == null ? 0 : si
    const end = ei == null ? (si == null ? content.length - 1 : si) : ei
    return content.slice(start, end + 1)
  }

  formatReference(fragment: Passage, bookNames: string[], separator: string): string {
    const [bookIndex, chapter, start, end] = fragment
    const book = bookNames[bookIndex]
    if (start == null) {
      return `${book} ${chapter + 1}`
    } else if (end == null || start === end) {
      return `${book} ${chapter + 1}${separator}${start + 1}`
    } else {
      return `${book} ${chapter + 1}${separator}${start + 1}-${end + 1}`
    }
  }
}
