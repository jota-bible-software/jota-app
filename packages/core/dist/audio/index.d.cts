import { P as Passage } from '../bible-DkEBp6kG.cjs';

/**
 * Audio manager - Bible audio source handling
 * Framework-agnostic audio utilities
 */

/**
 * Audio provider configuration
 */
interface AudioProvider {
    name: string;
    baseUrl: string;
    getFileName: (chapterIndex: number) => string;
}
/**
 * Get the global chapter index from a passage
 * @param passage - Passage reference [bookIndex, chapterIndex, ...]
 * @returns Global chapter index (0-based)
 */
declare function getGlobalChapterIndex(passage: Passage): number;
/**
 * Get total chapter count in the Bible
 */
declare function getTotalChapterCount(): number;
/**
 * Abstract audio source resolver
 * Override this with platform-specific implementations
 */
declare function getAudioSource(passage: Passage | undefined, provider: AudioProvider): string;

export { type AudioProvider, getAudioSource, getGlobalChapterIndex, getTotalChapterCount };
