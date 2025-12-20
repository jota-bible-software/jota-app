/**
 * Bible content search engine
 * Framework-agnostic search implementation
 */

import type { Passage, Progress, SearchOptions, TranslationContent } from '../types'
import { getBookCount, getChapterCount, getVerseCount, getVerse } from '../bible/translation-utils'
import { parseReferences } from './parser'

/**
 * Search result item
 */
export interface SearchResultItem {
  passage: [number, number, number, number]
  bookIndex: number
  chapterIndex: number
  verseIndex: number
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
export async function search(
  bible: TranslationContent,
  text: string,
  options: SearchOptions,
  progress: Progress
): Promise<Passage[]> {
  // Clean up special characters that may come from mobile devices
  text = text.replace(/[\u202d\u202c]/gm, '')

  // If text is a regular expression (starts with /)
  if (text.startsWith('/')) {
    const end = text.lastIndexOf('/')
    // If there is no regex flags, add "gi" automatically
    const flags = end === text.length - 1 ? 'gi' : text.substring(end + 1, text.length)
    let regex: RegExp
    let error: unknown

    try {
      regex = new RegExp(`(${text.substring(1, end)})`, flags)
    } catch (ex) {
      error = ex
      throw Error(`Invalid regular expression RegExp(${text.substring(1, end)}, ${flags})${error ? ', ' + error : ''}`)
    }

    return searchContent(regex, bible, progress)
  }

  // Determine if apocrypha should be included
  options.apocrypha = options.apocrypha === undefined ? getBookCount(bible) > 66 : options.apocrypha

  // Try to find passage references
  const fragments = parseReferences(text)
  if (fragments.length) return fragments

  // If no references found, search in content
  let regex: RegExp
  if (options.words) {
    const notWord = '[^a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]' // cspell:disable-line
    regex = new RegExp(`(^|${notWord})(${text.trim()})($|${notWord})`, 'i')
  } else {
    regex = new RegExp(`(${text})`, 'i')
  }

  return searchContent(regex, bible, progress)
}

/**
 * Search for regex pattern in Bible content
 *
 * @param regex - Regular expression to search for
 * @param bible - Translation content
 * @param progress - Progress reporting callback
 * @returns Array of matching passages
 */
export async function searchContent(
  regex: RegExp,
  bible: TranslationContent,
  progress: Progress
): Promise<Passage[]> {
  const found: Passage[] = []
  const bookCount = getBookCount(bible)

  // Process books with setTimeout to allow UI updates
  await Promise.all(
    Array.from({ length: bookCount }, (_, bi) =>
      new Promise<void>(resolve =>
        setTimeout(() => {
          const chapterCount = getChapterCount(bible, bi)
          for (let ci = 0; ci < chapterCount; ci++) {
            const verseCount = getVerseCount(bible, bi, ci)
            for (let vi = 0; vi < verseCount; vi++) {
              const verse = getVerse(bible, bi, ci, vi)
              if (verse && regex.test(verse)) {
                const fragment: Passage = [bi, ci, vi, vi]
                Object.preventExtensions(fragment)
                Object.freeze(fragment)
                found.push(fragment)
              }
            }
          }
          progress.step(bi + 1)
          resolve()
        }, 100)
      )
    )
  )

  // Store regex for UI highlighting
  progress.regex = regex
  Object.preventExtensions(found)
  Object.freeze(found)
  return found
}

/**
 * Ensure regex flag includes "g" for global matching
 */
export function ensureGlobalRegex(regex?: RegExp): RegExp | string {
  return regex
    ? regex.flags.includes('g')
      ? regex
      : new RegExp(regex.source, regex.flags + 'g')
    : ''
}

/**
 * Sort passages and remove duplicates
 *
 * @param fragments - Array of passages to sort
 * @returns Sorted and deduplicated array
 */
export function sortAndDeduplicate(fragments: Passage[]): Passage[] {
  // Sort by book, chapter, verse
  fragments.sort((a, b) =>
    a[0] > b[0] ? 1 : a[0] < b[0] ? -1 :
      a[1] > b[1] ? 1 : a[1] < b[1] ? -1 :
        a[2] != null && b[2] != null ? (a[2] > b[2] ? 1 : a[2] < b[2] ? -1 : 0) : 0
  )

  if (fragments.length < 2) {
    return fragments
  }

  // Deduplicate
  let prev = fragments[0]
  const result = [prev]

  for (let i = 1; i < fragments.length; i++) {
    const curr = fragments[i]
    if (!(prev[0] === curr[0] && prev[1] === curr[1] && (prev[2] === curr[2] || (prev[2] == null && curr[2] == null)))) {
      result.push(curr)
    }
    prev = curr
  }

  return result
}
