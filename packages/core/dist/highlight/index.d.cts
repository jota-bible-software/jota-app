import { P as PassageHighlight } from '../highlight-BO7FLPJ2.cjs';

/**
 * Stateless, referentially-transparent highlighter utilities.
 * All functions accept the current highlights array and return a new array
 * (or a derived value) without mutating the input.
 * Framework-agnostic - no Vue/Quasar dependencies.
 */

/**
 * Complete passage tuple type
 */
type PassageTuple = [number, number, number, number];
/**
 * Get all highlights that overlap with the given passage
 */
declare function getOverlappingHighlights(highlights: PassageHighlight[], passage: PassageTuple): PassageHighlight[];
/**
 * Get the highlight that exactly matches the given passage
 */
declare function getExactPassageHighlight(highlights: PassageHighlight[], passage: PassageTuple): PassageHighlight | undefined;
/**
 * Get the highlight that contains the given verse
 */
declare function getHighlightForVerse(highlights: PassageHighlight[], book: number, chapter: number, verse: number): PassageHighlight | undefined;
/**
 * Get all highlights (identity function for API consistency)
 */
declare function getHighlights(highlights: PassageHighlight[]): PassageHighlight[];
/**
 * Remove highlight at exact passage
 */
declare function removeHighlight(highlights: PassageHighlight[], passage: PassageTuple): PassageHighlight[];
/**
 * Add a highlight - does not mutate input
 */
declare function addHighlight(highlights: PassageHighlight[], passage: PassageTuple, colorId: string): PassageHighlight[];
/**
 * Toggle highlight on a passage
 */
declare function toggleHighlight(highlights: PassageHighlight[], passage: PassageTuple, activeColorId: string): PassageHighlight[];
/**
 * Clear all highlights
 */
declare function clearAllHighlights(_highlights: PassageHighlight[]): PassageHighlight[];
/**
 * Clear highlights of a specific color
 */
declare function clearColorHighlights(highlights: PassageHighlight[], colorId: string): PassageHighlight[];
/**
 * Backwards-compatible wrapper class.
 * Keeps state at the instance level and delegates to pure functions.
 */
declare class Highlighter {
    private highlights;
    constructor(initialHighlights?: PassageHighlight[]);
    addHighlight(passage: PassageTuple, colorId: string): void;
    removeHighlight(passage: PassageTuple): void;
    toggleHighlight(passage: PassageTuple, activeColorId: string): void;
    getHighlightForVerse(book: number, chapter: number, verse: number): PassageHighlight | undefined;
    getExactPassageHighlight(passage: PassageTuple): PassageHighlight | undefined;
    getOverlappingHighlights(passage: PassageTuple): PassageHighlight[];
    getHighlights(): PassageHighlight[];
    clearColorHighlights(colorId: string): void;
    clearAllHighlights(): void;
}

export { Highlighter, type PassageTuple, addHighlight, clearAllHighlights, clearColorHighlights, getExactPassageHighlight, getHighlightForVerse, getHighlights, getOverlappingHighlights, removeHighlight, toggleHighlight };
