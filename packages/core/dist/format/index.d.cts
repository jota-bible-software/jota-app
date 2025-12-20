import { P as Passage, d as TranslationContent } from '../bible-DkEBp6kG.cjs';
import { F as FormatTemplateData, a as Formatted } from '../format-CbHAj5C_.cjs';

/**
 * Passage formatting utilities
 * Framework-agnostic text formatting for Bible passages
 */

/**
 * Format a passage with template, returning structured output
 *
 * @param template - Format template configuration
 * @param passage - Passage reference
 * @param translationContent - Bible translation content
 * @param bookNames - Array of book names
 * @param translationAbbreviation - Translation abbreviation
 * @returns Formatted output structure or undefined if chapter not found
 */
declare function formatPassageComposable(template: FormatTemplateData, passage: Passage, translationContent: TranslationContent, bookNames: string[], translationAbbreviation: string): Formatted | undefined;
/**
 * Format a passage as a string
 *
 * @param template - Format template configuration
 * @param passage - Passage reference
 * @param translationContent - Bible translation content
 * @param bookNames - Array of book names
 * @param translationAbbreviation - Translation abbreviation
 * @returns Formatted string
 */
declare function formatPassage(template: FormatTemplateData, passage: Passage, translationContent: TranslationContent, bookNames: string[], translationAbbreviation: string): string;
/**
 * Format a passage reference (without content)
 *
 * @param passage - Passage reference
 * @param bookNames - Array of book names
 * @param separator - Chapter-verse separator character
 * @returns Formatted reference string
 */
declare function formatReference(passage: Passage, bookNames: string[], separator: string): string;
/**
 * Format chapter caption
 *
 * @param passage - Passage reference
 * @param bookNames - Array of book names
 * @returns Chapter title string
 */
declare function formatChapterCaption(passage: Passage | null, bookNames: string[]): string;
/**
 * Get verses from a passage
 *
 * @param bible - Translation content
 * @param passage - Passage reference
 * @returns Array of verse strings
 */
declare function getPassageVerses(bible: TranslationContent, passage: Passage): string[];
/**
 * Get all verses for a chapter containing the passage
 *
 * @param bible - Translation content
 * @param passage - Passage reference
 * @returns Array of all verses in the chapter
 */
declare function getChapterVerses(bible: TranslationContent, passage: Passage | null): string[];

/**
 * Template engine for format patterns
 * Framework-agnostic template processing
 */

/**
 * Pattern configuration for template generation
 */
interface FormatPattern {
    referencePosition?: 'before' | 'after';
    referenceNewLine?: 'same line' | 'new line';
    separatorChar?: string;
    quotes?: boolean;
    verseNewLine?: boolean;
    numbers?: boolean;
}
/**
 * Convert a pattern object to a template string
 *
 * @param pattern - Format pattern configuration
 * @returns Template string with placeholders
 */
declare function patternToTemplate(pattern: FormatPattern): string;
/**
 * Format a passage using a template string
 * WARNING: This uses eval() - only use with trusted templates
 *
 * @param translationContent - Bible translation content
 * @param passage - Passage reference
 * @param template - Template string with ${} placeholders
 * @param bookNames - Array of book names
 * @param separator - Chapter-verse separator
 * @param translation - Translation name
 * @returns Formatted string
 */
declare function formatWithTemplate(translationContent: TranslationContent, passage: Passage, template: string, bookNames: string[], separator: string, translation: string): string;

export { type FormatPattern, formatChapterCaption, formatPassage, formatPassageComposable, formatReference, formatWithTemplate, getChapterVerses, getPassageVerses, patternToTemplate };
