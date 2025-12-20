import type { PassageHighlight } from 'src/types'

// Stateless, referentially-transparent highlighter utilities.
// All functions accept the current highlights array and return a new array
// (or a derived value) without mutating the input.

function getPassageKey(passage: [number, number, number, number]): string {
  return `${passage[0]}-${passage[1]}-${passage[2]}-${passage[3]}`
}

export function getOverlappingHighlights(
  highlights: PassageHighlight[],
  passage: [number, number, number, number]
): PassageHighlight[] {
  const [book, chapter, start, end] = passage
  return highlights.filter(h => {
    const [hBook, hChapter, hStart, hEnd] = h.passage
    if (hBook !== book || hChapter !== chapter) return false
    return !(hEnd < start || hStart > end)
  })
}

export function getExactPassageHighlight(
  highlights: PassageHighlight[],
  passage: [number, number, number, number]
): PassageHighlight | undefined {
  const [book, chapter, start, end] = passage
  return highlights.find(h => {
    const [b, c, hStart, hEnd] = h.passage
    return b === book && c === chapter && hStart === start && hEnd === end
  })
}

export function getHighlightForVerse(
  highlights: PassageHighlight[],
  book: number,
  chapter: number,
  verse: number
): PassageHighlight | undefined {
  return highlights.find(h => {
    const [b, c, start, end] = h.passage
    return b === book && c === chapter && verse >= start && verse <= end
  })
}

export function getHighlights(highlights: PassageHighlight[]): PassageHighlight[] {
  return highlights
}

export function removeHighlight(
  highlights: PassageHighlight[],
  passage: [number, number, number, number]
): PassageHighlight[] {
  const key = getPassageKey(passage)
  return highlights.filter(h => getPassageKey(h.passage) !== key)
}

/**
 * Add a highlight in a pure way - does not mutate input.
 */
export function addHighlight(
  highlights: PassageHighlight[],
  passage: [number, number, number, number],
  colorId: string
): PassageHighlight[] {
  const [book, chapter, start, end] = passage

  const overlapping = getOverlappingHighlights(highlights, passage)

  // remove overlapping
  const result = highlights.filter(h => !overlapping.some(o => getPassageKey(o.passage) === getPassageKey(h.passage)))

  // merge same-color overlapping ranges
  const sameColorOverlapping = overlapping.filter(h => h.highlightColorId === colorId)
  let mergedStart = start
  let mergedEnd = end
  if (sameColorOverlapping.length > 0) {
    sameColorOverlapping.forEach(h => {
      const [, , hStart, hEnd] = h.passage
      mergedStart = Math.min(mergedStart, hStart)
      mergedEnd = Math.max(mergedEnd, hEnd)
    })
  }

  const newHighlight: PassageHighlight = {
    passage: [book, chapter, mergedStart, mergedEnd],
    highlightColorId: colorId
  }

  return [...result, newHighlight]
}

/**
 * Remove overlapping highlights of the same color and create remainders.
 */
function removeOverlappingAndCreateRemainders(
  highlights: PassageHighlight[],
  passage: [number, number, number, number],
  activeColorId: string
): PassageHighlight[] {
  const [, , start, end] = passage
  const overlapping = getOverlappingHighlights(highlights, passage)

  // Start with highlights that are not overlapping
  let result = highlights.filter(h => !overlapping.some(o => getPassageKey(o.passage) === getPassageKey(h.passage)))

  overlapping.filter(h => h.highlightColorId === activeColorId).forEach(highlight => {
    const [hBook, hChapter, hStart, hEnd] = highlight.passage

    // Create highlight for verses before the removed range
    if (hStart < start) {
      result = addHighlight(result, [hBook, hChapter, hStart, start - 1], highlight.highlightColorId)
    }

    // Create highlight for verses after the removed range
    if (hEnd > end) {
      result = addHighlight(result, [hBook, hChapter, end + 1, hEnd], highlight.highlightColorId)
    }
  })

  return result
}

export function toggleHighlight(
  highlights: PassageHighlight[],
  passage: [number, number, number, number],
  activeColorId: string
): PassageHighlight[] {
  const [book, chapter, start, end] = passage
  // Empty selection check - verses are 0-indexed, so we check for null/undefined
  if (start == null || end == null) return highlights

  const overlapping = getOverlappingHighlights(highlights, passage)
  const sameColorHighlights = overlapping.filter(h => h.highlightColorId === activeColorId)
  const differentColorHighlights = overlapping.filter(h => h.highlightColorId !== activeColorId)

  let hasExactMatch = false
  for (const highlight of sameColorHighlights) {
    const [, , hStart, hEnd] = highlight.passage
    if (hStart === start && hEnd === end) {
      hasExactMatch = true
      break
    }
  }

  // Case 1: No overlapping highlights - add new highlight
  if (overlapping.length === 0) {
    return addHighlight(highlights, passage, activeColorId)
  }

  // Case 2: Exact match with same color - remove it and create remainders
  if (hasExactMatch) {
    return removeOverlappingAndCreateRemainders(highlights, passage, activeColorId)
  }

  // Case 3: Single verse toggle or overlapping with any highlights
  if (start === end || overlapping.length > 0) {
    let shouldAddHighlight = true

    // Start by removing all overlapping highlights from result
    let result = highlights.filter(h => !overlapping.some(o => getPassageKey(o.passage) === getPassageKey(h.passage)))

    // Handle overlapping same color highlights
    sameColorHighlights.forEach(h => {
      const [hBook, hChapter, hStart, hEnd] = h.passage

      // Create non-overlapping highlight sections
      if (hStart < start) {
        result = addHighlight(result, [hBook, hChapter, hStart, start - 1], activeColorId)
      }
      if (hEnd > end) {
        result = addHighlight(result, [hBook, hChapter, end + 1, hEnd], activeColorId)
      }

      // Don't add a new highlight if we're toggling a single verse that was highlighted
      if (start === end && hStart <= start && hEnd >= end) {
        shouldAddHighlight = false
      }
    })

    // Handle different color highlights
    differentColorHighlights.forEach(h => {
      const [hBook, hChapter, hStart, hEnd] = h.passage
      // Preserve highlights outside the selected range
      if (hStart < start) {
        result = addHighlight(result, [hBook, hChapter, hStart, start - 1], h.highlightColorId)
      }
      if (hEnd > end) {
        result = addHighlight(result, [hBook, hChapter, end + 1, hEnd], h.highlightColorId)
      }
    })

    if (shouldAddHighlight) {
      result = addHighlight(result, passage, activeColorId)
    }

    return result
  }

  // Case 4: Extending/merging same color highlights
  if (sameColorHighlights.length > 0) {
    let mergedStart = start
    let mergedEnd = end
    sameColorHighlights.forEach(h => {
      const [, , hStart, hEnd] = h.passage
      mergedStart = Math.min(mergedStart, hStart)
      mergedEnd = Math.max(mergedEnd, hEnd)
    })

    // Remove all overlapping and add merged
    let result = highlights.filter(h => !overlapping.some(o => getPassageKey(o.passage) === getPassageKey(h.passage)))
    result = addHighlight(result, [book, chapter, mergedStart, mergedEnd], activeColorId)
    return result
  }

  // Default: add new highlight
  return addHighlight(highlights, passage, activeColorId)
}

export function clearAllHighlights(highlights: PassageHighlight[]): PassageHighlight[] {
  // reference the parameter to satisfy lint rules (function is intentionally
  // stateless and returns an empty array)
  void highlights
  return []
}

export function clearColorHighlights(
  highlights: PassageHighlight[],
  colorId: string
): PassageHighlight[] {
  return highlights.filter(h => h.highlightColorId !== colorId)
}

// Backwards-compatible wrapper class. This keeps state only at the instance level
// and delegates implementation to the pure functions above. The module itself
// remains stateless.
export class Highlighter {
  private highlights: PassageHighlight[]

  constructor(initialHighlights: PassageHighlight[] = []) {
    this.highlights = [...initialHighlights]
  }

  addHighlight(passage: [number, number, number, number], colorId: string) {
    this.highlights = addHighlight(this.highlights, passage, colorId)
  }

  removeHighlight(passage: [number, number, number, number]) {
    this.highlights = removeHighlight(this.highlights, passage)
  }

  toggleHighlight(passage: [number, number, number, number], activeColorId: string) {
    this.highlights = toggleHighlight(this.highlights, passage, activeColorId)
  }

  getHighlightForVerse(book: number, chapter: number, verse: number) {
    return getHighlightForVerse(this.highlights, book, chapter, verse)
  }

  getExactPassageHighlight(passage: [number, number, number, number]) {
    return getExactPassageHighlight(this.highlights, passage)
  }

  getOverlappingHighlights(passage: [number, number, number, number]) {
    return getOverlappingHighlights(this.highlights, passage)
  }

  getHighlights() {
    return this.highlights
  }

  clearColorHighlights(colorId: string) {
    this.highlights = clearColorHighlights(this.highlights, colorId)
  }

  clearAllHighlights() {
    this.highlights = clearAllHighlights(this.highlights)
  }
}

