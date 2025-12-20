/**
 * Highlight Service
 * Handles passage highlighting functionality
 */

import type { IStorageAdapter } from '@jota/adapters'
import type {
  PassageHighlight,
  HighlightColor,
  HighlightConfig,
  Highlights,
  TranslationKey,
} from '@jota/core'

const STORAGE_KEY = 'highlights'

const defaultColors: HighlightColor[] = [
  { id: 'hl-yellow', name: 'Study', hex: '#ffeb3b', order: 0 },
  { id: 'hl-green', name: 'Promises', hex: '#4caf50', order: 1 },
  { id: 'hl-blue', name: 'Commands', hex: '#2196f3', order: 2 },
  { id: 'hl-red', name: 'Warnings', hex: '#f44336', order: 3 },
  { id: 'hl-purple', name: 'Prophecy', hex: '#9c27b0', order: 4 },
  { id: 'hl-orange', name: 'Prayer', hex: '#ff9800', order: 5 },
]

const defaultConfig: HighlightConfig = {
  colors: defaultColors,
  active: 'hl-yellow',
}

export class HighlightService {
  private _highlights: Highlights = {
    byTranslation: {},
    config: { ...defaultConfig },
  }

  private _currentTranslationKey: TranslationKey | null = null
  private _loaded = false

  constructor(private storage: IStorageAdapter) {}

  get config(): HighlightConfig {
    return this._highlights.config
  }

  get colors(): HighlightColor[] {
    return this._highlights.config.colors
  }

  get activeColorId(): string {
    return this._highlights.config.active
  }

  get activeColor(): HighlightColor | undefined {
    return this.colors.find((c) => c.id === this.activeColorId)
  }

  get currentTranslationKey(): TranslationKey | null {
    return this._currentTranslationKey
  }

  set currentTranslationKey(key: TranslationKey | null) {
    this._currentTranslationKey = key
  }

  async load(): Promise<void> {
    if (this._loaded) return

    try {
      const stored = await this.storage.get<Highlights>(STORAGE_KEY)
      if (stored) {
        this._highlights = {
          byTranslation: stored.byTranslation || {},
          config: stored.config || { ...defaultConfig },
        }
      }
      this._loaded = true
    } catch (error) {
      console.error('Failed to load highlights:', error)
    }
  }

  private async save(): Promise<void> {
    try {
      await this.storage.set(STORAGE_KEY, this._highlights)
    } catch (error) {
      console.error('Failed to save highlights:', error)
    }
  }

  private getTranslationKeyString(): string | null {
    if (!this._currentTranslationKey) return null
    return `${this._currentTranslationKey.locale}:${this._currentTranslationKey.symbol}`
  }

  private getCurrentHighlights(): PassageHighlight[] {
    const key = this.getTranslationKeyString()
    if (!key) return []
    return this._highlights.byTranslation[key] || []
  }

  private setCurrentHighlights(highlights: PassageHighlight[]): void {
    const key = this.getTranslationKeyString()
    if (!key) return
    this._highlights.byTranslation[key] = highlights
    this.save()
  }

  add(passage: [number, number, number, number], colorId?: string): void {
    const highlights = this.getCurrentHighlights()
    const useColor = colorId || this.activeColorId

    // Check if exact passage already exists
    const existingIndex = highlights.findIndex(
      (h) =>
        h.passage[0] === passage[0] &&
        h.passage[1] === passage[1] &&
        h.passage[2] === passage[2] &&
        h.passage[3] === passage[3]
    )

    if (existingIndex >= 0) {
      // Update color
      highlights[existingIndex].highlightColorId = useColor
    } else {
      // Add new
      highlights.push({
        passage,
        highlightColorId: useColor,
      })
    }

    this.setCurrentHighlights(highlights)
  }

  remove(passage: [number, number, number, number]): void {
    const highlights = this.getCurrentHighlights()
    const filtered = highlights.filter(
      (h) =>
        !(
          h.passage[0] === passage[0] &&
          h.passage[1] === passage[1] &&
          h.passage[2] === passage[2] &&
          h.passage[3] === passage[3]
        )
    )
    this.setCurrentHighlights(filtered)
  }

  toggle(passage: [number, number, number, number], colorId?: string): void {
    const existing = this.getExactPassageHighlight(passage)
    const useColor = colorId || this.activeColorId

    if (existing) {
      if (existing.highlightColorId === useColor) {
        this.remove(passage)
      } else {
        this.add(passage, useColor)
      }
    } else {
      this.add(passage, useColor)
    }
  }

  getForVerse(
    book: number,
    chapter: number,
    verse: number
  ): PassageHighlight | undefined {
    const highlights = this.getCurrentHighlights()
    return highlights.find(
      (h) =>
        h.passage[0] === book &&
        h.passage[1] === chapter &&
        h.passage[2] <= verse &&
        h.passage[3] >= verse
    )
  }

  getExactPassageHighlight(
    passage: [number, number, number, number]
  ): PassageHighlight | undefined {
    const highlights = this.getCurrentHighlights()
    return highlights.find(
      (h) =>
        h.passage[0] === passage[0] &&
        h.passage[1] === passage[1] &&
        h.passage[2] === passage[2] &&
        h.passage[3] === passage[3]
    )
  }

  getChapterHighlights(book: number, chapter: number): PassageHighlight[] {
    const highlights = this.getCurrentHighlights()
    return highlights.filter(
      (h) => h.passage[0] === book && h.passage[1] === chapter
    )
  }

  getHighlightColor(colorId: string): HighlightColor | undefined {
    return this.colors.find((c) => c.id === colorId)
  }

  setActiveColor(colorId: string): void {
    if (this.colors.some((c) => c.id === colorId)) {
      this._highlights.config.active = colorId
      this.save()
    }
  }

  addColor(color: Omit<HighlightColor, 'order'>): void {
    const order = this.colors.length
    this._highlights.config.colors.push({ ...color, order })
    this.save()
  }

  updateColor(colorId: string, updates: Partial<Omit<HighlightColor, 'id'>>): void {
    const color = this.colors.find((c) => c.id === colorId)
    if (color) {
      Object.assign(color, updates)
      this.save()
    }
  }

  removeColor(colorId: string): void {
    const index = this.colors.findIndex((c) => c.id === colorId)
    if (index >= 0) {
      this._highlights.config.colors.splice(index, 1)
      // Update active if deleted
      if (this.activeColorId === colorId && this.colors.length > 0) {
        this._highlights.config.active = this.colors[0].id
      }
      this.save()
    }
  }

  clearColorHighlights(colorId: string): void {
    const key = this.getTranslationKeyString()
    if (!key) return

    const highlights = this.getCurrentHighlights()
    const filtered = highlights.filter((h) => h.highlightColorId !== colorId)
    this.setCurrentHighlights(filtered)
  }

  exportHighlights(): Highlights {
    return JSON.parse(JSON.stringify(this._highlights))
  }

  async importHighlights(data: Highlights): Promise<void> {
    this._highlights = {
      byTranslation: data.byTranslation || {},
      config: data.config || { ...defaultConfig },
    }
    await this.save()
  }
}
