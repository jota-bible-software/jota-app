/**
 * Reference resolver - converts OSIS strings to passages
 * Framework-agnostic
 */

import type { Passage, TranslationContent } from '../types'
import { getChapterCount, getVerseCount } from '../bible/translation-utils'
import { osisToPassage } from './parser'

/**
 * Get list of passages from OSIS string
 *
 * @param translationContent - Translation content
 * @param osis - Comma-separated list of OSIS codes like "Deut.25.13-14"
 * @param shouldSort - Whether to sort results
 * @returns Array of passages
 */
export function resolveOsisToPassages(
  translationContent: TranslationContent,
  osis: string,
  shouldSort = false
): Passage[] {
  if (!osis) return []

  const fragments: Passage[] = []

  osis.split(',').forEach((it: string) => {
    const [it1, it2] = it.split('-')
    const from = it1
    let to: string | true = it2

    const a = osisToPassage(from)

    // Handle case of entire book, e.g., osis = "Col"
    if (isNaN(a[1])) {
      a[1] = 0
      to = to || true
    }

    if (to) {
      const b = to === true
        ? [a[0], getChapterCount(translationContent, a[0]) - 1]
        : osisToPassage(to as string)

      // Only scopes within the same chapter are allowed
      if (a[0] !== b[0] || a[1] !== b[1]) {
        a[2] = a[2] || 0
        if (a[2] === 0) {
          a.splice(2, 1)
          fragments.push(a as Passage)
        } else {
          push(a, getVerseCount(translationContent, a[0], a[1]) - 1)
        }

        if (a[0] < b[0]) {
          // Add the rest of chapters from the starting book
          addChapters(a[0], a[1] + 1, getChapterCount(translationContent, a[0]))
        } else {
          // Add all the chapters in between if start and end are in the same book
          addChapters(a[0], a[1] + 1, b[1])
        }

        if (a[0] + 1 < b[0]) {
          // Add books in between
          for (let bi = a[0] + 1; bi < b[0]; bi++) {
            addChapters(bi, 0, getChapterCount(translationContent, bi))
          }
        }

        if (a[0] < b[0]) {
          // Add the starting chapters from the ending book
          addChapters(b[0], 0, isNaN(b[1]) ? getChapterCount(translationContent, b[0]) : b[1])
        }

        if (!isNaN(b[1])) {
          if (isNaN(b[2]) || b[2] === getVerseCount(translationContent, b[0], b[1]) - 1) {
            fragments.push([b[0], b[1]])
          } else {
            fragments.push([b[0], b[1], 0, b[2]])
          }
        }
      } else {
        push(a, b[2])
      }
    } else {
      push(a, a[2])
    }
  })

  return shouldSort ? sortPassages(fragments) : fragments

  function addChapters(bi: number, ci: number, len: number) {
    for (; ci < len; ci++) {
      fragments.push([bi, ci])
    }
  }

  function push(tokens: number[], end: number) {
    tokens.push(end)
    fragments.push(tokens as Passage)
  }
}

/**
 * Sort passages by book, chapter, verse
 */
function sortPassages(fragments: Passage[]): Passage[] {
  fragments.sort((a, b) =>
    a[0] > b[0] ? 1 : a[0] < b[0] ? -1 :
      a[1] > b[1] ? 1 : a[1] < b[1] ? -1 :
        a[2] != null && b[2] != null ? (a[2] > b[2] ? 1 : a[2] < b[2] ? -1 : 0) : 0
  )
  return fragments
}
