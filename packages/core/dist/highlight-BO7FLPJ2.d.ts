/**
 * Highlighting types - framework-agnostic
 */
/**
 * A highlighted passage with its color
 */
type PassageHighlight = {
    passage: [number, number, number, number];
    highlightColorId: string;
};
/**
 * Highlight color definition
 */
type HighlightColor = {
    id: string;
    name: string;
    hex: string;
    order: number;
};
/**
 * Highlight configuration
 */
type HighlightConfig = {
    colors: HighlightColor[];
    active: string;
};
/**
 * Complete highlights state
 */
type Highlights = {
    /** Map of translation key (locale:symbol) to highlights for that translation */
    byTranslation: Record<string, PassageHighlight[]>;
    config: HighlightConfig;
};
/**
 * Legacy highlight format for migration
 */
type HighlightsLegacy = {
    translation: {
        locale: string;
        symbol: string;
    };
    passageHighlights: PassageHighlight[];
    config: HighlightConfig;
};

export type { HighlightColor as H, PassageHighlight as P, HighlightConfig as a, Highlights as b, HighlightsLegacy as c };
