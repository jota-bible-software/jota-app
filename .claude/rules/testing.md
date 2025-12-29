---
paths: "test/**"
---

# Testing Rules

## Test Requirements

1. **New features must have tests** - At minimum, unit tests for core logic
2. **Bug fixes should have regression tests** - Prevent the bug from recurring
3. **Don't weaken tests** - Fix code, not tests (unless test is wrong)

## Unit Tests (Vitest)

### Location
- Test files: `/test/vitest/__tests__/`
- Setup: `/test/vitest/setup-file.ts`
- Config: `vitest.config.ts`

### Naming Convention
```
feature.test.ts
component.test.ts
```

### Structure
```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('featureName', () => {
  beforeEach(() => {
    // Setup
  })

  it('should do expected behavior', () => {
    // Arrange
    const input = 'John 3:16'

    // Act
    const result = parseReference(input)

    // Assert
    expect(result).toEqual([42, 2, 15])
  })
})
```

### Bible Data Testing
```typescript
// Test with both formats
describe('getVerse', () => {
  it('should work with array format', () => {
    const arrayContent: string[][][] = [[['verse']]]
    expect(getVerse(arrayContent, 0, 0, 0)).toBe('verse')
  })

  it('should work with map format', () => {
    const mapContent = { '1': { '1': { '1': 'verse' } } }
    expect(getVerse(mapContent, 0, 0, 0)).toBe('verse')
  })
})
```

## E2E Tests (Cypress)

### Location
- Test files: `/test/cypress/e2e/`
- Helper: `/test/cypress/e2e/CypressHelper.ts`
- Config: `cypress.config.ts`

### Use Data Tags (NOT classes)

**Step 1: Define tag in `src/tags.ts`**
```typescript
export const settingsHighlightsAddButton = 'settings-highlights-add-button'
```

**Step 2: Add to component**
```vue
<q-btn :data-tag="tags.settingsHighlightsAddButton" />
```

**Step 3: Use in test**
```typescript
import * as tags from 'src/tags'
import { tag, click } from './CypressHelper'

const addButton = tag(tags.settingsHighlightsAddButton)
click(addButton)
```

### CypressHelper Functions

```typescript
import {
  navigate,           // navigate('/settings')
  tag,               // tag(tags.myButton) → '[data-tag=myButton]'
  click,             // click(selector)
  type,              // type(input, 'text')
  find, first, nth, last,
  assertShowing, assertNotShowing,
  assertText, assertTextContains,
  assertCount, assertEnabled, assertDisabled,
  t                  // i18n: t('key.path')
} from './CypressHelper'
```

### Test Structure Pattern
```typescript
describe('Feature Name', () => {
  // Define selectors at top
  const myButton = tag(tags.myButton)
  const myList = tag(tags.myList)

  beforeEach(() => {
    navigate('/')
  })

  it('should perform action', () => {
    click(myButton)
    assertShowing(myList)
  })
})
```

## Commands
```bash
pnpm run test:unit           # Interactive
pnpm run test:unit:ci        # CI mode
pnpm run test:e2e            # Cypress interactive
pnpm run test:e2e:ci         # Cypress headless
```

## What to Test

| Area | Priority | Test Type |
|------|----------|-----------|
| Passage parsing | High | Unit |
| Search functionality | High | Unit + E2E |
| Translation loading | High | Unit |
| Component rendering | Medium | Unit |
| User workflows | Medium | E2E |
| Edge cases | Medium | Unit |
