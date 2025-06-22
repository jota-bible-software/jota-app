# Bible Translation File Formats

This document describes the multiple file formats supported for Bible translation files in the Jota app.

## Supported Formats

### 1. Legacy Format (3D Array)

The original format using a three-dimensional array structure:

```json
[
  [
    [
      "In the beginning God created the heaven and the earth.",
      "And the earth was without form, and void..."
    ],
    [
      "Thus the heavens and the earth were finished..."
    ]
  ]
]
```

**Structure:**
- `data[bookIndex][chapterIndex][verseIndex] = "verse text"`
- All indices are 0-based
- Simple JSON array structure

### 2. Enhanced Format (with Metadata)

The new format includes metadata and supports both array and map data structures:

```json
{
  "meta": {
    "name": "King James Version",
    "abbreviation": "KJV",
    "locale": "en-US",
    "year": "1611",
    "bookNames": ["Genesis", "Exodus", ...],
    "dataFormat": "map",
    "created": "2025-06-21T00:00:00Z",
    "modified": "2025-06-21T00:00:00Z"
  },
  "data": {
    "1": {
      "1": {
        "1": "In the beginning God created the heaven and the earth.",
        "2": "And the earth was without form, and void..."
      }
    }
  }
}
```

**Metadata Fields:**
- `name`: Full name of the translation
- `abbreviation`: Short abbreviation (e.g., "KJV", "NIV")
- `locale`: Language/region code (e.g., "en-US", "pl-PL")
- `year`: Publication year (optional)
- `bookNames`: Array of book names for this translation (optional)
- `dataFormat`: Either "3d-array" or "map"
- `created`: ISO timestamp of creation (optional)
- `modified`: ISO timestamp of last modification (optional)

**Data Formats:**

#### Map Format (`dataFormat: "map"`)
```json
"data": {
  "1": {           // Book number (1-based)
    "1": {         // Chapter number (1-based)
      "1": "verse text",  // Verse number (1-based)
      "2": "verse text"
    }
  }
}
```

#### Array Format (`dataFormat: "3d-array"`)
```json
"data": [
  [              // Book index (0-based)
    [            // Chapter index (0-based)
      "verse text",  // Verse index (0-based)
      "verse text"
    ]
  ]
]
```

## Migration and Compatibility

### Backward Compatibility
- Existing 3D array files continue to work without any changes
- The system automatically detects the file format
- No migration is required for existing files

### Format Detection
The system detects the format as follows:

1. **New Format**: Files with `meta` and `data` properties
2. **Legacy Format**: Files that are direct JSON arrays

### API Usage

The translation utilities provide format-agnostic access:

```typescript
import { getVerse, getChapter, getBook } from 'src/logic/translation-utils'

// Works with both formats
const verse = getVerse(content, bookIndex, chapterIndex, verseIndex)
const chapter = getChapter(content, bookIndex, chapterIndex)
const book = getBook(content, bookIndex)
```

## Benefits of the Enhanced Format

1. **Rich Metadata**: Store translation information, publication dates, book names
2. **Flexible Data Structure**: Support both array and map-based storage
3. **Extensibility**: Easy to add new metadata fields in the future
4. **Validation**: Clear format specification for data validation
5. **Tooling**: Better support for translation management tools

## Examples

See the example files in `/public/data/examples/`:
- `kjv-legacy-format.json` - Legacy 3D array format
- `kjv-new-format.json` - Enhanced format with metadata and map structure

## Implementation Details

### Type Definitions
```typescript
export type TranslationDataFormat = '3d-array' | 'map'

export type TranslationContentArray = string[][][]

export type TranslationContentMap = {
  [bookNumber: number]: {
    [chapterNumber: number]: {
      [verseNumber: number]: string
    }
  }
}

export type TranslationFileMeta = {
  name: string
  abbreviation: string
  locale: LocaleSymbol
  year?: string
  bookNames?: string[]
  bookOrder?: string
  dataFormat: TranslationDataFormat
  created?: string
  modified?: string
}

export type TranslationFile = {
  meta: TranslationFileMeta
  data: TranslationContentArray | TranslationContentMap
}
```

### Utility Functions
The `translation-utils.ts` file provides format-agnostic functions:
- `getVerse()` - Get a single verse
- `getChapter()` - Get all verses in a chapter
- `getBook()` - Get all chapters in a book
- `getBookCount()` - Get number of books
- `getChapterCount()` - Get number of chapters in a book
- `getVerseCount()` - Get number of verses in a chapter
- `toArrayFormat()` - Convert any format to 3D array
- `toMapFormat()` - Convert any format to map

## Best Practices

1. **Use Enhanced Format for New Translations**: Include comprehensive metadata
2. **Preserve Legacy Files**: Don't modify existing 3D array files unless necessary
3. **Validate Data**: Ensure data structure matches the declared `dataFormat`
4. **Include Metadata**: Provide as much translation information as possible
5. **Use Utility Functions**: Always use the provided utilities for data access

