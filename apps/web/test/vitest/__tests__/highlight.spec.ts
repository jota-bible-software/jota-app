import { Highlighter } from 'src/logic/highlighter'
import { beforeEach, describe, expect, it } from 'vitest'

describe('HighlightManager', () => {
  const COLOR_1 = 'hl-yellow'
  const COLOR_2 = 'hl-green'

  let highlightManager: Highlighter

  beforeEach(() => {
    highlightManager = new Highlighter()
  })

  describe('Same Color Highlighting', () => {
    it('should remove highlight when toggling full range with same color', () => {
      // Given: Verses 1-3 highlighted with COLOR_1
      highlightManager.addHighlight([0, 0, 1, 3], COLOR_1)

      // When: Select verses 1-3 and toggle highlight with COLOR_1
      highlightManager.toggleHighlight([0, 0, 1, 3], COLOR_1)

      // Then: All highlights should be removed from verses 1-3
      for (let verse = 1; verse <= 3; verse++) {
        expect(highlightManager.getHighlightForVerse(0, 0, verse)).toBeUndefined()
      }
    })

    it('should highlight full range when some verses are highlighted', () => {
      // Given: Only verses 1 and 3 highlighted with COLOR_1
      highlightManager.addHighlight([0, 0, 1, 1], COLOR_1)
      highlightManager.addHighlight([0, 0, 3, 3], COLOR_1)

      // When: Select verses 1-3 and toggle highlight with COLOR_1
      highlightManager.toggleHighlight([0, 0, 1, 3], COLOR_1)

      // Then: Verses 1-3 should all be highlighted with COLOR_1
      for (let verse = 1; verse <= 3; verse++) {
        const highlight = highlightManager.getHighlightForVerse(0, 0, verse)
        expect(highlight?.highlightColorId).toBe(COLOR_1)
      }
    })

    describe('Single Verse Removal', () => {
      it('should remove first verse highlight while keeping others', () => {
        // Given: Verses 1-3 highlighted with COLOR_1
        highlightManager.addHighlight([0, 0, 1, 3], COLOR_1)

        // When: Select verse 1 and toggle highlight with COLOR_1
        highlightManager.toggleHighlight([0, 0, 1, 1], COLOR_1)

        // Then: Verse 1 should have no highlight, verses 2-3 should remain highlighted
        expect(highlightManager.getHighlightForVerse(0, 0, 1)).toBeUndefined()
        expect(highlightManager.getHighlightForVerse(0, 0, 2)?.highlightColorId).toBe(COLOR_1)
        expect(highlightManager.getHighlightForVerse(0, 0, 3)?.highlightColorId).toBe(COLOR_1)
      })

      it('should remove middle verse highlight while keeping others', () => {
        // Given: Verses 1-3 highlighted with COLOR_1
        highlightManager.addHighlight([0, 0, 1, 3], COLOR_1)

        // When: Select verse 2 and toggle highlight with COLOR_1
        highlightManager.toggleHighlight([0, 0, 2, 2], COLOR_1)

        // Then: Verse 2 should have no highlight, verses 1 and 3 should remain highlighted
        expect(highlightManager.getHighlightForVerse(0, 0, 1)?.highlightColorId).toBe(COLOR_1)
        expect(highlightManager.getHighlightForVerse(0, 0, 2)).toBeUndefined()
        expect(highlightManager.getHighlightForVerse(0, 0, 3)?.highlightColorId).toBe(COLOR_1)
      })

      it('should remove last verse highlight while keeping others', () => {
        // Given: Verses 1-3 highlighted with COLOR_1
        highlightManager.addHighlight([0, 0, 1, 3], COLOR_1)

        // When: Select verse 3 and toggle highlight with COLOR_1
        highlightManager.toggleHighlight([0, 0, 3, 3], COLOR_1)

        // Then: Verse 3 should have no highlight, verses 1-2 should remain highlighted
        expect(highlightManager.getHighlightForVerse(0, 0, 1)?.highlightColorId).toBe(COLOR_1)
        expect(highlightManager.getHighlightForVerse(0, 0, 2)?.highlightColorId).toBe(COLOR_1)
        expect(highlightManager.getHighlightForVerse(0, 0, 3)).toBeUndefined()
      })
    })

    describe('Extending Highlights', () => {
      it('should extend highlight to adjacent verses', () => {
        // Given: Verses 1-2 highlighted with COLOR_1
        highlightManager.addHighlight([0, 0, 1, 2], COLOR_1)

        // When: Select verses 2-3 and toggle highlight with COLOR_1
        highlightManager.toggleHighlight([0, 0, 2, 3], COLOR_1)

        // Then: Verses 1-3 should all be highlighted with COLOR_1
        for (let verse = 1; verse <= 3; verse++) {
          expect(highlightManager.getHighlightForVerse(0, 0, verse)?.highlightColorId).toBe(COLOR_1)
        }
      })

      it('should extend highlight across gap', () => {
        // Given: Verses 1-2 highlighted with COLOR_1
        highlightManager.addHighlight([0, 0, 1, 2], COLOR_1)

        // When: Select verses 3-4 and toggle highlight with COLOR_1
        highlightManager.toggleHighlight([0, 0, 3, 4], COLOR_1)

        // Then: Verses 1-4 should all be highlighted with COLOR_1
        for (let verse = 1; verse <= 4; verse++) {
          expect(highlightManager.getHighlightForVerse(0, 0, verse)?.highlightColorId).toBe(COLOR_1)
        }
      })
    })
  })

  describe('Different Color Highlighting', () => {
    it('should override full range with different color', () => {
      // Given: Verses 1-3 highlighted with COLOR_1
      highlightManager.addHighlight([0, 0, 1, 3], COLOR_1)

      // When: Select verses 1-3 and toggle highlight with COLOR_2
      highlightManager.toggleHighlight([0, 0, 1, 3], COLOR_2)

      // Then: Verses 1-3 should all be highlighted with COLOR_2
      for (let verse = 1; verse <= 3; verse++) {
        expect(highlightManager.getHighlightForVerse(0, 0, verse)?.highlightColorId).toBe(COLOR_2)
      }
    })

    it('should override single verse with different color', () => {
      // Given: Verses 1-3 highlighted with COLOR_1
      highlightManager.addHighlight([0, 0, 1, 3], COLOR_1)

      // When: Select verse 2 and toggle highlight with COLOR_2
      highlightManager.toggleHighlight([0, 0, 2, 2], COLOR_2)

      // Then: Verse 2 should be highlighted with COLOR_2, verses 1 and 3 should remain COLOR_1
      expect(highlightManager.getHighlightForVerse(0, 0, 1)?.highlightColorId).toBe(COLOR_1)
      expect(highlightManager.getHighlightForVerse(0, 0, 2)?.highlightColorId).toBe(COLOR_2)
      expect(highlightManager.getHighlightForVerse(0, 0, 3)?.highlightColorId).toBe(COLOR_1)
    })

    it('should override extended range with different color', () => {
      // Given: Verses 1-2 highlighted with COLOR_1
      highlightManager.addHighlight([0, 0, 1, 2], COLOR_1)

      // When: Select verses 1-3 and toggle highlight with COLOR_2
      highlightManager.toggleHighlight([0, 0, 1, 3], COLOR_2)

      // Then: Verses 1-3 should all be highlighted with COLOR_2
      for (let verse = 1; verse <= 3; verse++) {
        expect(highlightManager.getHighlightForVerse(0, 0, verse)?.highlightColorId).toBe(COLOR_2)
      }
    })

    it('should split highlight when overlapping with different color', () => {
      // Given: Verses 1-3 highlighted with COLOR_1
      highlightManager.addHighlight([0, 0, 1, 3], COLOR_1)

      // When: Highlight verses 3-4 with COLOR_2
      highlightManager.toggleHighlight([0, 0, 3, 4], COLOR_2)

      // Then: Verses 1-2 should be highlighted with COLOR_1 and verses 3-4 should be highlighted with COLOR_2
      expect(highlightManager.getHighlightForVerse(0, 0, 1)?.highlightColorId).toBe(COLOR_1)
      expect(highlightManager.getHighlightForVerse(0, 0, 2)?.highlightColorId).toBe(COLOR_1)
      expect(highlightManager.getHighlightForVerse(0, 0, 3)?.highlightColorId).toBe(COLOR_2)
      expect(highlightManager.getHighlightForVerse(0, 0, 4)?.highlightColorId).toBe(COLOR_2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle adjacent highlights with different colors', () => {
      // Given: Verses 1-2 highlighted with COLOR_1 and verses 3-4 with COLOR_2
      highlightManager.addHighlight([0, 0, 1, 2], COLOR_1)
      highlightManager.addHighlight([0, 0, 3, 4], COLOR_2)

      // When: Select verses 2-3 and toggle highlight with COLOR_1
      highlightManager.toggleHighlight([0, 0, 2, 3], COLOR_1)

      // Then: Verses 1-3 should be highlighted with COLOR_1, verse 4 should remain COLOR_2
      expect(highlightManager.getHighlightForVerse(0, 0, 1)?.highlightColorId).toBe(COLOR_1)
      expect(highlightManager.getHighlightForVerse(0, 0, 2)?.highlightColorId).toBe(COLOR_1)
      expect(highlightManager.getHighlightForVerse(0, 0, 3)?.highlightColorId).toBe(COLOR_1)
      expect(highlightManager.getHighlightForVerse(0, 0, 4)?.highlightColorId).toBe(COLOR_2)
    })

    it('should handle overlapping highlights with different colors', () => {
      // Given: Verses 1-3 highlighted with COLOR_1 and verses 2-4 with COLOR_2
      highlightManager.addHighlight([0, 0, 1, 3], COLOR_1)
      highlightManager.addHighlight([0, 0, 2, 4], COLOR_2)

      // When: Select verses 1-4 and toggle highlight with COLOR_1
      highlightManager.toggleHighlight([0, 0, 1, 4], COLOR_1)

      // Then: Verses 1-4 should all be highlighted with COLOR_1
      for (let verse = 1; verse <= 4; verse++) {
        expect(highlightManager.getHighlightForVerse(0, 0, verse)?.highlightColorId).toBe(COLOR_1)
      }
    })

    it('should handle verse 0 (first verse)', () => {
      // Given: Verses 0-2 highlighted with COLOR_1 (0-indexed)
      highlightManager.addHighlight([0, 0, 0, 2], COLOR_1)

      // When: Select verse 0 and toggle highlight with COLOR_1
      highlightManager.toggleHighlight([0, 0, 0, 0], COLOR_1)

      // Then: Verse 0 should be removed, verses 1-2 should remain
      expect(highlightManager.getHighlightForVerse(0, 0, 0)).toBeUndefined()
      expect(highlightManager.getHighlightForVerse(0, 0, 1)?.highlightColorId).toBe(COLOR_1)
      expect(highlightManager.getHighlightForVerse(0, 0, 2)?.highlightColorId).toBe(COLOR_1)
    })
  })
})
