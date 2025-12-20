/**
 * Search-related types - framework-agnostic
 */
/**
 * Search configuration options
 */
type SearchOptions = {
    /** Include apocryphal books in search */
    apocrypha?: boolean;
    /** Sort results by relevance */
    shouldSort?: boolean;
    /** Match whole words only */
    words?: boolean;
};
/**
 * Progress reporting interface for long operations
 */
type Progress = {
    /** Report progress step */
    step: (n: number) => void;
    /** Optional regex for highlighting matches */
    regex?: RegExp;
};
/**
 * Search result item
 */
type SearchResult = {
    /** Passage reference */
    passage: [number, number, number, number];
    /** Matched verse text */
    text: string;
    /** Book index */
    bookIndex: number;
    /** Chapter index */
    chapterIndex: number;
    /** Verse index */
    verseIndex: number;
};

export type { Progress as P, SearchOptions as S, SearchResult as a };
