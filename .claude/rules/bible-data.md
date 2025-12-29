---
paths: "src/logic/**"
---

# Bible Data Handling Rules

## Two Data Formats

### 1. 3D Array Format (Legacy)
```typescript
type ArrayFormat = string[][][]
// Access: content[bookIndex][chapterIndex][verseIndex]
```

```json
[
  [
    ["In the beginning God created...", "And the earth was without form..."],
    ["Thus the heavens and the earth were finished..."]
  ]
]
```

### 2. Map Format (Current)
```typescript
type MapFormat = {
  [bookNum: string]: {
    [chapterNum: string]: {
      [verseNum: string]: string
    }
  }
}
// Access: content[bookNum][chapterNum][verseNum]
```

```json
{
  "1": {
    "1": {
      "1": "In the beginning God created...",
      "2": "And the earth was without form..."
    }
  }
}
```

## Enhanced Format with Metadata

New translation files include metadata:

```typescript
type TranslationFileMeta = {
  name: string              // "King James Version"
  abbreviation: string      // "KJV"
  locale: LocaleSymbol      // "en-US"
  year?: string            // "1611"
  bookNames?: string[]     // ["Genesis", "Exodus", ...]
  bookOrder?: string
  dataFormat: '3d-array' | 'map'
  created?: string         // ISO timestamp
  modified?: string        // ISO timestamp
}

type TranslationFile = {
  meta: TranslationFileMeta
  data: TranslationContentArray | TranslationContentMap
}
```

## ALWAYS Use translation-utils.ts

Never access Bible data directly. Use helper functions:

```typescript
import {
  getVerse,
  getChapter,
  getBook,
  getBookCount,
  getChapterCount,
  getVerseCount,
  isArrayFormat,
  isMapFormat,
  toArrayFormat,
  toMapFormat
} from '@/logic/translation-utils'

// Correct - handles both formats
const verse = getVerse(content, bookIndex, chapterIndex, verseIndex)
const chapter = getChapter(content, bookIndex, chapterIndex)
const book = getBook(content, bookIndex)

// Wrong - only works for array format
const verse = content[bookIndex][chapterIndex][verseIndex]
```

## Indexing Rules

| Context | Indexing | Example |
|---------|----------|---------|
| Internal (arrays, Passage type) | 0-based | Genesis = 0, John = 42 |
| Display to users | 1-based | Genesis = 1, John = 43 |
| Map format keys | 1-based strings | "1", "43" |

### Conversion
```typescript
// Display to user (0-based to 1-based)
const displayBook = bookIndex + 1
const displayChapter = chapterIndex + 1
const displayVerse = verseIndex + 1

// Map format access (0-based to 1-based string)
const mapKey = String(index + 1)
```

## Passage Type
```typescript
type Passage = [
  bookIndex: number,    // 0-based
  chapterIndex: number, // 0-based
  startVerse?: number,  // 0-based, optional
  endVerse?: number     // 0-based, optional
]
```

## Format Detection

The system auto-detects format:
1. **New Format**: Files with `meta` and `data` properties
2. **Legacy Format**: Files that are direct JSON arrays

## Book Definitions
- Book definitions in `src/logic/books.js`
- OSIS standard IDs (Gen, Exod, John, etc.)
- 66 books: index 0-65

## Best Practices

1. **Use Enhanced Format for New Translations** - Include comprehensive metadata
2. **Preserve Legacy Files** - Don't modify existing 3D array files unless necessary
3. **Validate Data** - Ensure data structure matches the declared `dataFormat`
4. **Use Utility Functions** - Always use translation-utils.ts for data access
5. **Test with BOTH formats** - Verify changes work with array and map formats
6. **Handle missing verses** - Some translations omit verses (graceful handling)
