'use strict';

// src/highlight/highlighter.ts
function getPassageKey(passage) {
  return `${passage[0]}-${passage[1]}-${passage[2]}-${passage[3]}`;
}
function getOverlappingHighlights(highlights, passage) {
  const [book, chapter, start, end] = passage;
  return highlights.filter((h) => {
    const [hBook, hChapter, hStart, hEnd] = h.passage;
    if (hBook !== book || hChapter !== chapter) return false;
    return !(hEnd < start || hStart > end);
  });
}
function getExactPassageHighlight(highlights, passage) {
  const [book, chapter, start, end] = passage;
  return highlights.find((h) => {
    const [b, c, hStart, hEnd] = h.passage;
    return b === book && c === chapter && hStart === start && hEnd === end;
  });
}
function getHighlightForVerse(highlights, book, chapter, verse) {
  return highlights.find((h) => {
    const [b, c, start, end] = h.passage;
    return b === book && c === chapter && verse >= start && verse <= end;
  });
}
function getHighlights(highlights) {
  return highlights;
}
function removeHighlight(highlights, passage) {
  const key = getPassageKey(passage);
  return highlights.filter((h) => getPassageKey(h.passage) !== key);
}
function addHighlight(highlights, passage, colorId) {
  const [book, chapter, start, end] = passage;
  const overlapping = getOverlappingHighlights(highlights, passage);
  const result = highlights.filter(
    (h) => !overlapping.some((o) => getPassageKey(o.passage) === getPassageKey(h.passage))
  );
  const sameColorOverlapping = overlapping.filter((h) => h.highlightColorId === colorId);
  let mergedStart = start;
  let mergedEnd = end;
  if (sameColorOverlapping.length > 0) {
    sameColorOverlapping.forEach((h) => {
      const [, , hStart, hEnd] = h.passage;
      mergedStart = Math.min(mergedStart, hStart);
      mergedEnd = Math.max(mergedEnd, hEnd);
    });
  }
  const newHighlight = {
    passage: [book, chapter, mergedStart, mergedEnd],
    highlightColorId: colorId
  };
  return [...result, newHighlight];
}
function removeOverlappingAndCreateRemainders(highlights, passage, activeColorId) {
  const [, , start, end] = passage;
  const overlapping = getOverlappingHighlights(highlights, passage);
  let result = highlights.filter(
    (h) => !overlapping.some((o) => getPassageKey(o.passage) === getPassageKey(h.passage))
  );
  overlapping.filter((h) => h.highlightColorId === activeColorId).forEach((highlight) => {
    const [hBook, hChapter, hStart, hEnd] = highlight.passage;
    if (hStart < start) {
      result = addHighlight(result, [hBook, hChapter, hStart, start - 1], highlight.highlightColorId);
    }
    if (hEnd > end) {
      result = addHighlight(result, [hBook, hChapter, end + 1, hEnd], highlight.highlightColorId);
    }
  });
  return result;
}
function toggleHighlight(highlights, passage, activeColorId) {
  const [book, chapter, start, end] = passage;
  if (start == null || end == null) return highlights;
  const overlapping = getOverlappingHighlights(highlights, passage);
  const sameColorHighlights = overlapping.filter((h) => h.highlightColorId === activeColorId);
  const differentColorHighlights = overlapping.filter((h) => h.highlightColorId !== activeColorId);
  let hasExactMatch = false;
  for (const highlight of sameColorHighlights) {
    const [, , hStart, hEnd] = highlight.passage;
    if (hStart === start && hEnd === end) {
      hasExactMatch = true;
      break;
    }
  }
  if (overlapping.length === 0) {
    return addHighlight(highlights, passage, activeColorId);
  }
  if (hasExactMatch) {
    return removeOverlappingAndCreateRemainders(highlights, passage, activeColorId);
  }
  if (start === end || overlapping.length > 0) {
    let shouldAddHighlight = true;
    let result = highlights.filter(
      (h) => !overlapping.some((o) => getPassageKey(o.passage) === getPassageKey(h.passage))
    );
    sameColorHighlights.forEach((h) => {
      const [hBook, hChapter, hStart, hEnd] = h.passage;
      if (hStart < start) {
        result = addHighlight(result, [hBook, hChapter, hStart, start - 1], activeColorId);
      }
      if (hEnd > end) {
        result = addHighlight(result, [hBook, hChapter, end + 1, hEnd], activeColorId);
      }
      if (start === end && hStart <= start && hEnd >= end) {
        shouldAddHighlight = false;
      }
    });
    differentColorHighlights.forEach((h) => {
      const [hBook, hChapter, hStart, hEnd] = h.passage;
      if (hStart < start) {
        result = addHighlight(result, [hBook, hChapter, hStart, start - 1], h.highlightColorId);
      }
      if (hEnd > end) {
        result = addHighlight(result, [hBook, hChapter, end + 1, hEnd], h.highlightColorId);
      }
    });
    if (shouldAddHighlight) {
      result = addHighlight(result, passage, activeColorId);
    }
    return result;
  }
  if (sameColorHighlights.length > 0) {
    let mergedStart = start;
    let mergedEnd = end;
    sameColorHighlights.forEach((h) => {
      const [, , hStart, hEnd] = h.passage;
      mergedStart = Math.min(mergedStart, hStart);
      mergedEnd = Math.max(mergedEnd, hEnd);
    });
    let result = highlights.filter(
      (h) => !overlapping.some((o) => getPassageKey(o.passage) === getPassageKey(h.passage))
    );
    result = addHighlight(result, [book, chapter, mergedStart, mergedEnd], activeColorId);
    return result;
  }
  return addHighlight(highlights, passage, activeColorId);
}
function clearAllHighlights(_highlights) {
  return [];
}
function clearColorHighlights(highlights, colorId) {
  return highlights.filter((h) => h.highlightColorId !== colorId);
}
var Highlighter = class {
  constructor(initialHighlights = []) {
    this.highlights = [...initialHighlights];
  }
  addHighlight(passage, colorId) {
    this.highlights = addHighlight(this.highlights, passage, colorId);
  }
  removeHighlight(passage) {
    this.highlights = removeHighlight(this.highlights, passage);
  }
  toggleHighlight(passage, activeColorId) {
    this.highlights = toggleHighlight(this.highlights, passage, activeColorId);
  }
  getHighlightForVerse(book, chapter, verse) {
    return getHighlightForVerse(this.highlights, book, chapter, verse);
  }
  getExactPassageHighlight(passage) {
    return getExactPassageHighlight(this.highlights, passage);
  }
  getOverlappingHighlights(passage) {
    return getOverlappingHighlights(this.highlights, passage);
  }
  getHighlights() {
    return this.highlights;
  }
  clearColorHighlights(colorId) {
    this.highlights = clearColorHighlights(this.highlights, colorId);
  }
  clearAllHighlights() {
    this.highlights = clearAllHighlights(this.highlights);
  }
};

exports.Highlighter = Highlighter;
exports.addHighlight = addHighlight;
exports.clearAllHighlights = clearAllHighlights;
exports.clearColorHighlights = clearColorHighlights;
exports.getExactPassageHighlight = getExactPassageHighlight;
exports.getHighlightForVerse = getHighlightForVerse;
exports.getHighlights = getHighlights;
exports.getOverlappingHighlights = getOverlappingHighlights;
exports.removeHighlight = removeHighlight;
exports.toggleHighlight = toggleHighlight;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map