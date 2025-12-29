---
name: e2e-testing
description: Expert in Cypress E2E testing for Jota Bible App. Use when writing new E2E tests, debugging test failures, or working with CypressHelper utilities.
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

# E2E Testing Expert

## Key Files
- Test files: `/test/cypress/e2e/`
- Helper: `/test/cypress/e2e/CypressHelper.ts`
- Tags: `src/tags.ts`
- Config: `cypress.config.ts`

## CypressHelper Functions

### Navigation
```typescript
navigate('/')
navigate('/settings')
navigate('/?q=John%203:16')
```

### Element Selection
```typescript
const myButton = tag(tags.myButton)  // '[data-tag=myButton]'
find(myButton)    // Get element
first(myButton)   // First matching
nth(myButton, 2)  // 2nd element (1-based)
last(myButton)    // Last matching
```

### Interactions
```typescript
click(myButton)
click(myButton, 'topLeft')
type(searchInput, 'John 3:16')
type(searchInput, 'New text', true)  // Replace existing
select(dropdown, 'KJV')              // Quasar q-select
```

### Assertions
```typescript
assertShowing(myElement)
assertNotShowing(hiddenElement)
assertText(title, 'Expected Title')
assertTextContains(paragraph, 'some text')
assertCount(listItems, 5)
assertEnabled(submitButton)
assertDisabled(disabledButton)
```

### i18n Support
```typescript
const yesText = t('settingsFormatTemplates.yes')
cy.get('.q-dialog').should('contain', t('highlights.removeTitle'))
```

## Test Structure Pattern

```typescript
import { assertShowing, click, navigate, tag } from './CypressHelper'
import * as tags from 'src/tags'

describe('Feature Name', () => {
  // Define selectors at top (ALWAYS)
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

## Common Patterns

### Quasar Dialogs
```typescript
click(deleteButton)
cy.get('.q-dialog').should('be.visible')
cy.get('.q-dialog').should('contain', 'Are you sure?')
cy.get('.q-dialog button').contains('Yes').click()
cy.get('.q-dialog').should('not.exist')
```

### Quasar Dropdowns (q-select)
```typescript
click(translationSelector)
cy.get('.q-menu').should('be.visible')
cy.get('.q-item').contains('KJV').click()
// Or by index:
cy.get('.q-item').eq(1).click()
```

### Conditional Setup
```typescript
cy.get('body').then($body => {
  if ($body.find(highlightsItem).length === 0) {
    // Add item first
    click(addButton)
    cy.wait(500)
  }
})
```

### Testing Lists
```typescript
cy.get(listItem).each(($item) => {
  cy.wrap($item).find('.symbol').should('be.visible')
  cy.wrap($item).find('.title').should('be.visible')
})
```

## Adding Data Tags

1. Define in `src/tags.ts`:
```typescript
export const myNewButton = 'my-new-button'
```

2. Add to component:
```vue
<q-btn :data-tag="tags.myNewButton" />
```

3. Use in test:
```typescript
import * as tags from 'src/tags'
const myNewButton = tag(tags.myNewButton)
```

## Best Practices

1. **Use data-tag, not CSS classes** - Stable selectors
2. **Import tags module** - `import * as tags from 'src/tags'`
3. **Define selectors at top** - Constants in describe block
4. **Use CypressHelper functions** - Not raw Cypress calls
5. **Wait for async operations** - `cy.wait(500)` or `{ timeout: 10000 }`
6. **Test user flows** - Not implementation details
7. **Clear test names** - Describe what is tested

## Commands
```bash
pnpm run test:e2e            # Interactive
pnpm run test:e2e:ci         # Headless CI
pnpm cypress open            # Cypress UI
pnpm cypress run --spec "test/cypress/e2e/highlights.test.ts"
```
