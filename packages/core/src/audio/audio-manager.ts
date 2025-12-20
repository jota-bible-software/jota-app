/**
 * Audio manager - Bible audio source handling
 * Framework-agnostic audio utilities
 */

import type { Passage } from '../types'
import { chapterCounts } from '../bible/books'

/**
 * Audio provider configuration
 */
export interface AudioProvider {
  name: string
  baseUrl: string
  getFileName: (chapterIndex: number) => string
}

/**
 * Get the global chapter index from a passage
 * @param passage - Passage reference [bookIndex, chapterIndex, ...]
 * @returns Global chapter index (0-based)
 */
export function getGlobalChapterIndex(passage: Passage): number {
  const [bookIndex, chapterIndex] = passage
  const previousChapters = chapterCounts.slice(0, bookIndex).reduce((acc, cur) => acc + cur, 0)
  return previousChapters + chapterIndex
}

/**
 * Get total chapter count in the Bible
 */
export function getTotalChapterCount(): number {
  return chapterCounts.reduce((acc, cur) => acc + cur, 0)
}

/**
 * Abstract audio source resolver
 * Override this with platform-specific implementations
 */
export function getAudioSource(
  passage: Passage | undefined,
  provider: AudioProvider
): string {
  if (!passage) return ''
  const chapterIndex = getGlobalChapterIndex(passage)
  return provider.baseUrl + provider.getFileName(chapterIndex)
}
