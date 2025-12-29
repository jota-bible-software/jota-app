---
paths: "**/*.ts"
---

# TypeScript Rules

## Strict Typing
- **Never use `any`** without explicit justification
- Use `unknown` for truly unknown types, then narrow with type guards
- Prefer interfaces for object shapes, types for unions/intersections

## Key Types in This Project

### Passage Type
```typescript
type Passage = [bookIndex: number, chapterIndex: number, startVerse?: number, endVerse?: number]
```
- All indices are 0-based internally
- Display to users as 1-based (add 1)

### Translation Types
```typescript
// 3D Array format (legacy)
type ArrayFormat = string[][][]

// Map format (current)
type MapFormat = Record<string, Record<string, Record<string, string>>>

// Union type
type TranslationContent = ArrayFormat | MapFormat
```

## Import Patterns
```typescript
// Use path aliases
import { useSettingsStore } from '@/stores/settings-store'
import { getVerse } from '@/logic/translation-utils'

// Type-only imports when possible
import type { Passage, SearchOptions } from '@/types'
```

## Function Typing
```typescript
// Explicit return types for public functions
function parseReference(input: string, locale: string): Passage | null {
  // ...
}

// Use generics appropriately
function getItem<T>(key: string, defaultValue: T): T {
  // ...
}
```

## Avoid
- `any` type (use `unknown` and narrow)
- Type assertions (`as`) without validation
- Non-null assertions (`!`) without certainty
- Implicit `any` from missing types
