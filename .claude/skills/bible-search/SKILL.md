---
name: bible-search
description: Expert in Bible passage parsing, search optimization, and translation format handling. Use when implementing search features, parsing references like "John 3:16", or working with Bible data in either 3D array or map format.
allowed-tools: Read, Grep, Glob, Edit
---

# Bible Search & Passage Expert

## Key Files
- `src/logic/jota.ts` - Main search and passage processing logic
- `src/logic/translation-utils.ts` - Bible data format utilities (getVerse, getChapter, etc.)
- `src/logic/books.js` - Bible book definitions and OSIS mappings
- `src/stores/search-store.ts` - Search state management
- `src/stores/translation-store.ts` - Translation loading and management

## Bible Data Formats

### 1. 3D Array Format (legacy)
```typescript
type ArrayFormat = string[][][] // books[bookIndex][chapterIndex][verseIndex]
```

### 2. Map Format (current)
```typescript
type MapFormat = {
  [bookNum: string]: {
    [chapterNum: string]: {
      [verseNum: string]: string
    }
  }
}
```

## Critical Rules
1. **Always handle both formats** - Use translation-utils.ts functions for abstraction
2. **0-based indexing internally** - Arrays use 0-based, display uses 1-based
3. **Passage type**: `[bookIndex, chapterIndex, startVerse?, endVerse?]`
4. **Use jota-parser** for reference parsing - supports multiple languages

## Search Types
- **Passage References**: "John 3:16", "Gen 1:1-5", "1 Cor 13"
- **Text Search**: Regex or simple text within Bible content
- **Multi-language**: Book names vary by locale (en-US, pl-PL, pt-BR, es-ES, pt-PT, uk-UA)

## Common Patterns
```typescript
// Get verse from either format
import { getVerse, getChapter } from '@/logic/translation-utils'
const verse = getVerse(translationContent, bookIndex, chapterIndex, verseIndex)

// Parse reference
import { parseReference } from 'jota-parser'
const passage = parseReference("John 3:16", locale)
```

## Testing
- Test with both 3D array and map format translations
- Test with multiple locales for book name parsing
- Unit tests in `/test/vitest/__tests__/`
