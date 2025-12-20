import { Parser } from 'jota-parser';
export { Parser, enUS, plPL } from 'jota-parser';
import { P as Passage, d as TranslationContent } from '../bible-DkEBp6kG.cjs';
import { S as SearchOptions, P as Progress } from '../search-DwFGeCGZ.cjs';

/**
 * Bible reference parsing
 * Framework-agnostic wrapper for jota-parser
 */

/**
 * Parse Bible references from text input
 * @param input - Text containing Bible references
 * @param parser - Optional custom parser instance
 * @returns Array of passages
 */
declare function parseReferences(input: string, parser?: Parser): Passage[];
/**
 * Convert OSIS code to passage indices
 * @param osis - OSIS code like "Gen.1.1"
 * @returns Array of [bookIndex, chapterIndex, verseIndex]
 */
declare function osisToPassage(osis: string): number[];
/**
 * Create a new parser with custom locales
 */
declare function createParser(options: {
    locales: unknown[];
}): InstanceType<typeof Parser>;

/**
 * Bible content search engine
 * Framework-agnostic search implementation
 */

/**
 * Search result item
 */
interface SearchResultItem {
    passage: [number, number, number, number];
    bookIndex: number;
    chapterIndex: number;
    verseIndex: number;
}
/**
 * General search function
 * If text does not start with "/" then try to find passage references.
 * Otherwise search for the text in the Bible content.
 *
 * @param bible - Translation content
 * @param text - Search input
 * @param options - Search options
 * @param progress - Progress reporting callback
 * @returns Array of passages
 */
declare function search(bible: TranslationContent, text: string, options: SearchOptions, progress: Progress): Promise<Passage[]>;
/**
 * Search for regex pattern in Bible content
 *
 * @param regex - Regular expression to search for
 * @param bible - Translation content
 * @param progress - Progress reporting callback
 * @returns Array of matching passages
 */
declare function searchContent(regex: RegExp, bible: TranslationContent, progress: Progress): Promise<Passage[]>;
/**
 * Ensure regex flag includes "g" for global matching
 */
declare function ensureGlobalRegex(regex?: RegExp): RegExp | string;
/**
 * Sort passages and remove duplicates
 *
 * @param fragments - Array of passages to sort
 * @returns Sorted and deduplicated array
 */
declare function sortAndDeduplicate(fragments: Passage[]): Passage[];

/**
 * Reference resolver - converts OSIS strings to passages
 * Framework-agnostic
 */

/**
 * Get list of passages from OSIS string
 *
 * @param translationContent - Translation content
 * @param osis - Comma-separated list of OSIS codes like "Deut.25.13-14"
 * @param shouldSort - Whether to sort results
 * @returns Array of passages
 */
declare function resolveOsisToPassages(translationContent: TranslationContent, osis: string, shouldSort?: boolean): Passage[];

export { type SearchResultItem, createParser, ensureGlobalRegex, osisToPassage, parseReferences, resolveOsisToPassages, search, searchContent, sortAndDeduplicate };
