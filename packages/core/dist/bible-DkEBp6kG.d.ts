/**
 * Bible data types - framework-agnostic
 */
/**
 * A passage reference as a tuple: [bookIndex, chapterIndex, startVerse?, endVerse?]
 * All indices are 0-based internally
 */
type Passage = [number, number, number?, number?];
/**
 * A passage with all verse indices defined (for highlights)
 */
type PassageComplete = [number, number, number, number];
/**
 * Bible translation data format identifier
 */
type TranslationDataFormat = '3d-array' | 'map';
/**
 * Legacy 3D array format: books > chapters > verses
 */
type TranslationContentArray = string[][][];
/**
 * Map format with numbered keys for books/chapters/verses
 */
type TranslationContentMap = {
    [bookNumber: number]: {
        [chapterNumber: number]: {
            [verseNumber: number]: string;
        };
    };
};
/**
 * Union type for Bible translation content
 */
type TranslationContent = TranslationContentArray | TranslationContentMap;
/**
 * Metadata included in translation files
 */
type TranslationFileMeta = {
    name: string;
    abbreviation: string;
    locale: string;
    year?: string;
    bookNames?: string[];
    bookOrder?: string;
    dataFormat: TranslationDataFormat;
    created?: string;
    modified?: string;
};
/**
 * Complete translation file structure
 */
type TranslationFile = {
    meta: TranslationFileMeta;
    data: TranslationContent;
};
/**
 * Translation identifier
 */
type TranslationKey = {
    locale: string;
    symbol: string;
};
/**
 * Translation metadata for display
 */
type TranslationMeta = TranslationKey & {
    title: string;
    size: number;
    year?: string;
    bookNames?: string;
    bookOrder?: string;
};
/**
 * Book naming configuration
 */
type BookNaming = {
    name: string;
    books: string[];
    booksText?: string;
};
/**
 * Book naming with locale
 */
type BookNamingV2 = BookNaming & {
    locale: string;
};

export type { BookNaming as B, Passage as P, TranslationDataFormat as T, PassageComplete as a, TranslationContentArray as b, TranslationContentMap as c, TranslationContent as d, TranslationFileMeta as e, TranslationFile as f, TranslationKey as g, TranslationMeta as h, BookNamingV2 as i };
