/**
 * Highlighting types - framework-agnostic
 */

/**
 * A highlighted passage with its color
 */
export type PassageHighlight = {
  passage: [number, number, number, number]
  highlightColorId: string
}

/**
 * Highlight color definition
 */
export type HighlightColor = {
  id: string
  name: string
  hex: string
  order: number
}

/**
 * Highlight configuration
 */
export type HighlightConfig = {
  colors: HighlightColor[]
  active: string
}

/**
 * Complete highlights state
 */
export type Highlights = {
  /** Map of translation key (locale:symbol) to highlights for that translation */
  byTranslation: Record<string, PassageHighlight[]>
  config: HighlightConfig
}

/**
 * Legacy highlight format for migration
 */
export type HighlightsLegacy = {
  translation: {
    locale: string
    symbol: string
  }
  passageHighlights: PassageHighlight[]
  config: HighlightConfig
}
