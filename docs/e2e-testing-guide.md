# E2E Testing Guide for Jota Bible App

This guide explains how to create end-to-end (e2e) tests for the Jota Bible App using Cypress.

## Table of Contents

1. [Overview](#overview)
2. [Test Structure](#test-structure)
3. [Using CypressHelper](#using-cypresshelper)
4. [Working with Data Tags](#working-with-data-tags)
5. [Test Patterns](#test-patterns)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

## Overview

The Jota Bible App uses Cypress for end-to-end testing. Tests are located in [`test/cypress/e2e/`](test/cypress/e2e/) and use a custom helper library ([CypressHelper.ts](test/cypress/e2e/CypressHelper.ts)) to simplify common testing operations.

### Key Technologies

- **Cypress**: E2E testing framework
- **TypeScript**: Type-safe test code
- **Quasar Framework**: UI component library
- **Vue 3**: Component framework
- **Data-tag selectors**: Stable element identification

## Test Structure

### File Organization

```
test/cypress/e2e/
├── CypressHelper.ts      # Helper functions and utilities
├── home.test.ts          # Home page tests
├── highlights.test.ts    # Highlighting feature tests
└── ...                   # Other feature tests
```

### Basic Test File Structure

```typescript
import { assertShowing, click, navigate, tag } from './CypressHelper'
import * as tags from 'src/tags'

describe('Feature Name', () => {
  // Define all tag selectors as constants at the top
  const myElement = tag(tags.myElement)
  const myButton = tag(tags.myButton)
  const myList = tag(tags.myList)

  beforeEach(() => {
    // Setup code that runs before each test
    cy.visit('/')
  })

  it('should perform some action', () => {
    // Test implementation
    click(myButton)
    cy.get(myElement).should('be.visible')
  })
})
```

## Using CypressHelper

The `CypressHelper.ts` module provides utility functions that simplify common Cypress operations.

### Navigation

```typescript
import { navigate } from './CypressHelper'

// Navigate to a route
navigate('/')
navigate('/settings')
navigate('/?q=John%203:16')
```

### Element Selection

```typescript
import { tag, find, first, nth, last } from './CypressHelper'

// Create a data-tag selector
const myButton = tag(tags.myButton)  // Returns '[data-tag=myButton]'

// Find elements
find(myButton)           // Get element by selector
first(myButton)          // Get first matching element
nth(myButton, 2)         // Get 2nd element (1-based index)
last(myButton)           // Get last matching element
```

### Interactions

```typescript
import { click, type, select } from './CypressHelper'

// Click an element
click(myButton)
click(myButton, 'topLeft')  // Click at specific position

// Type into input fields
type(searchInput, 'John 3:16')
type(searchInput, 'New text', true)  // Replace existing text

// Select from dropdowns (Quasar q-select)
select(translationSelector, 'KJV')
```

### Assertions

```typescript
import {
  assertShowing,
  assertNotShowing,
  assertText,
  assertTextContains,
  assertCount,
  assertEnabled,
  assertDisabled
} from './CypressHelper'

// Visibility assertions
assertShowing(myElement)
assertNotShowing(hiddenElement)

// Text assertions
assertText(title, 'Expected Title')
assertTextContains(paragraph, 'some text')

// Count assertions
assertCount(listItems, 5)

// State assertions
assertEnabled(submitButton)
assertDisabled(disabledButton)
```

### i18n Support

```typescript
import { t } from './CypressHelper'

// Get translated strings
const yesText = t('settingsFormatTemplates.yes')
const noText = t('settingsFormatTemplates.no')

// Use in assertions
cy.get('.q-dialog').should('contain', t('highlights.removeTitle'))
```

## Working with Data Tags

Data tags are the primary way to identify elements in tests. They provide stable selectors that don't break when CSS classes or structure changes.

### Adding Data Tags to Components

**Step 1: Define the tag in [`src/tags.ts`](src/tags.ts)**

```typescript
// Settings highlights
export const settingsHighlightsAddButton = 'settings-highlights-add-button'
export const settingsHighlightsTranslationsList = 'settings-highlights-translations-list'
```

**Step 2: Add the tag to your component**

```vue
<template>
  <q-btn
    color="primary"
    icon="add"
    @click="handleClick"
    :data-tag="tags.settingsHighlightsAddButton"
  >
    Add
  </q-btn>

  <q-list :data-tag="tags.settingsHighlightsTranslationsList">
    <!-- List content -->
  </q-list>
</template>

<script setup lang="ts">
import * as tags from 'src/tags'
</script>
```

**Step 3: Use the tag in tests**

```typescript
import * as tags from 'src/tags'
import { tag, click } from './CypressHelper'

const addButton = tag(tags.settingsHighlightsAddButton)
const translationsList = tag(tags.settingsHighlightsTranslationsList)

it('should add a translation', () => {
  click(addButton)
  cy.get(translationsList).should('be.visible')
})
```

### Dynamic Data Tags

For dynamic elements, you can use template strings:

```vue
<template>
  <q-tab-panel
    :name="props.name"
    :data-tag="`settingsPanel-${props.name}`"
  >
</template>
```

```typescript
// In tests
const highlightsPanel = '[data-tag="settingsPanel-highlights"]'
cy.get(highlightsPanel).should('be.visible')
```

## Test Patterns

### Pattern 1: Define Constants at the Top

**Always** define tag selectors as constants at the top of the `describe` block, following the pattern from [home.test.ts](test/cypress/e2e/home.test.ts:1-35).

```typescript
describe('My Feature', () => {
  // ✅ GOOD: Constants defined at top
  const myButton = tag(tags.myButton)
  const myList = tag(tags.myList)
  const myItem = tag(tags.myItem)

  it('should work', () => {
    click(myButton)
    cy.get(myList).should('be.visible')
  })
})
```

```typescript
describe('My Feature', () => {
  it('should work', () => {
    // ❌ BAD: Inline tag calls
    click(tag('myButton'))
    cy.get('[data-tag="myList"]').should('be.visible')
  })
})
```

### Pattern 2: Setup with beforeEach

Use `beforeEach` for common setup:

```typescript
describe('Settings Page', () => {
  const settingsTab = tag(tags.settingsPageHighlights)

  beforeEach(() => {
    navigate('/settings')
    click(settingsTab)
  })

  it('should display settings', () => {
    // Settings page is already loaded
    cy.get(settingsPanelTitle).should('contain', 'Highlights')
  })
})
```

### Pattern 3: Conditional Setup

Handle optional setup steps:

```typescript
it('should remove translation', () => {
  // Ensure at least one translation exists
  cy.get('body').then($body => {
    if ($body.find(highlightsTranslationItem).length === 0) {
      // Add a translation first
      click(translationSelector)
      cy.get('.q-menu').should('be.visible')
      cy.get('.q-item').eq(1).click()
      click(highlightsAddButton)
      cy.wait(500)
    }
  })

  // Now proceed with the actual test
  cy.get(highlightsTranslationItem).first().within(() => {
    click(highlightsTranslationDelete)
  })
})
```

### Pattern 4: Working with Quasar Dialogs

```typescript
it('should confirm deletion', () => {
  click(deleteButton)

  // Wait for dialog to appear
  cy.get('.q-dialog').should('be.visible')

  // Verify dialog content
  cy.get('.q-dialog').should('contain', 'Are you sure?')

  // Click Yes button
  cy.get('.q-dialog button').contains('Yes').click()

  // Verify dialog is closed
  cy.get('.q-dialog').should('not.exist')

  // Verify success notification
  cy.get('.q-notification').should('be.visible')
  cy.get('.q-notification').should('contain', 'deleted')
})
```

### Pattern 5: Working with Dropdowns (q-select)

```typescript
it('should select from dropdown', () => {
  // Open dropdown
  click(translationSelector)

  // Wait for menu to appear
  cy.get('.q-menu').should('be.visible')

  // Select specific item
  cy.get('.q-item').contains('KJV').click()

  // Or select by index
  cy.get('.q-item').eq(1).click()
})
```

### Pattern 6: Testing Lists and Iterations

```typescript
it('should display all items with badges', () => {
  // Verify each item has expected structure
  cy.get(highlightsTranslationItem).each(($item) => {
    cy.wrap($item).find('.translation-symbol').should('be.visible')
    cy.wrap($item).find('.translation-title').should('be.visible')
    cy.wrap($item).find(highlightsTranslationBadge).should('exist')
  })
})

it('should verify item content', () => {
  // Get specific item content
  cy.get(highlightsTranslationItem).first().within(() => {
    cy.get('.translation-symbol').should('contain', 'KJV')
    cy.get(highlightsTranslationBadge).invoke('text').should('match', /^\d+$/)
  })
})
```

## Best Practices

### 1. Use Data Tags for Stability

```typescript
// ✅ GOOD: Stable data-tag selector
const submitButton = tag(tags.submitButton)
click(submitButton)

// ❌ BAD: Fragile class-based selector
cy.get('.q-btn.primary-color.submit').click()
```

### 2. Import Tags Module

```typescript
// ✅ GOOD: Import tags module
import * as tags from 'src/tags'
const myButton = tag(tags.myButton)

// ❌ BAD: String literals
const myButton = tag('myButton')
```

### 3. Use Helper Functions

```typescript
// ✅ GOOD: Use CypressHelper functions
import { click, assertShowing } from './CypressHelper'
click(myButton)
assertShowing(myElement)

// ❌ BAD: Direct Cypress calls
cy.get('[data-tag=myButton]').click()
cy.get('[data-tag=myElement]').should('be.visible')
```

### 4. Wait for Async Operations

```typescript
// ✅ GOOD: Wait for operations to complete
click(saveButton)
cy.wait(500)
cy.get('.q-notification').should('contain', 'Saved')

// ✅ ALSO GOOD: Use timeout option
cy.get(loadingElement, { timeout: 10000 }).should('be.visible')

// ❌ BAD: No wait, test might be flaky
click(saveButton)
cy.get('.q-notification').should('contain', 'Saved')
```

### 5. Test User Flows, Not Implementation

```typescript
// ✅ GOOD: Test what user sees and does
it('should add a highlight to a verse', () => {
  navigate('/')
  type(searchInput, 'John 3:16')
  click(layoutToggle)
  click(firstVerse)
  click(highlightButton)
  cy.get(firstVerse).should('have.class', 'highlighted')
})

// ❌ BAD: Test implementation details
it('should update the store when highlight is added', () => {
  cy.window().its('app.$store.highlights').should('have.length', 1)
})
```

### 6. Clear and Descriptive Test Names

```typescript
// ✅ GOOD: Clear description of what is tested
it('should display error notification when adding duplicate translation')
it('should remove all highlights when translation is deleted')
it('should disable add button when no translation is selected')

// ❌ BAD: Vague or implementation-focused
it('should work correctly')
it('should call addTranslation()')
```

### 7. Group Related Tests

```typescript
describe('Highlights', () => {
  describe('Translation Management', () => {
    it('should add a translation for highlights')
    it('should remove a translation from highlights')
    it('should prevent adding duplicate translations')
  })

  describe('Verse Highlighting', () => {
    it('should toggle verse highlighting')
    it('should select different highlight colors')
  })
})
```

## Examples

### Example 1: Simple Navigation Test

```typescript
import { navigate, click, tag } from './CypressHelper'
import * as tags from 'src/tags'

describe('Settings Navigation', () => {
  const settingsHighlightsTab = tag(tags.settingsPageHighlights)
  const highlightsPanel = '[data-tag="settingsPanel-highlights"]'

  it('should navigate to highlights settings', () => {
    navigate('/settings')
    click(settingsHighlightsTab)
    cy.get(highlightsPanel).should('be.visible')
  })
})
```

### Example 2: Form Interaction Test

```typescript
import { navigate, click, type, tag, assertShowing } from './CypressHelper'
import * as tags from 'src/tags'

describe('Translation Selection', () => {
  const translationSelector = tag(tags.translationSelector)
  const addButton = tag(tags.settingsHighlightsAddButton)
  const translationsList = tag(tags.settingsHighlightsTranslationsList)

  beforeEach(() => {
    navigate('/settings')
    click(tag(tags.settingsPageHighlights))
  })

  it('should add a translation for highlights', () => {
    // Open selector
    click(translationSelector)
    cy.get('.q-menu').should('be.visible')

    // Select first translation
    cy.get('.q-item').eq(1).click()

    // Click add button
    click(addButton)

    // Verify success
    cy.get('.q-notification').should('contain', 'added')
    assertShowing(translationsList)
  })
})
```

### Example 3: Complex User Flow

```typescript
import { navigate, click, type, tag, assertShowing } from './CypressHelper'
import * as tags from 'src/tags'

describe('Verse Highlighting', () => {
  const searchInput = tag(tags.searchInput)
  const foundPassages = tag(tags.foundPassages)
  const layoutToggle = tag(tags.layoutToggle)

  beforeEach(() => {
    // Ensure highlighting is enabled
    navigate('/settings')
    click(tag(tags.settingsPageHighlights))

    cy.get('body').then($body => {
      if ($body.find(tag(tags.settingsHighlightsTranslationItem)).length === 0) {
        click(tag(tags.translationSelector))
        cy.get('.q-menu').should('be.visible')
        cy.get('.q-item').eq(1).click()
        click(tag(tags.settingsHighlightsAddButton))
        cy.wait(500)
      }
    })

    navigate('/')
  })

  it('should toggle verse highlighting', () => {
    // Search for verse
    type(searchInput, 'John 3:16')

    // Switch to split layout
    assertShowing(foundPassages)
    click(layoutToggle)

    // Select verse
    cy.get('.verse').first().click()

    // Apply highlight
    cy.get('.q-btn-dropdown').should('be.visible')
    cy.get('.q-btn-dropdown').click()
    cy.wait(300)

    // Verify highlighted
    cy.get('.verse.highlighted').should('exist')

    // Remove highlight
    cy.get('.q-btn-dropdown').click()
    cy.wait(300)

    // Verify not highlighted
    cy.get('.verse').first().should('not.have.class', 'highlighted')
  })
})
```

### Example 4: Conditional Test Logic

```typescript
it('should handle existing data', () => {
  navigate('/settings')
  click(settingsHighlightsTab)

  // Check current state and act accordingly
  cy.get('body').then($body => {
    const itemCount = $body.find(highlightsTranslationItem).length

    if (itemCount === 0) {
      cy.log('No translations - adding one first')
      click(translationSelector)
      cy.get('.q-menu').should('be.visible')
      cy.get('.q-item').eq(1).click()
      click(highlightsAddButton)
      cy.wait(500)
    } else {
      cy.log(`Found ${itemCount} translations`)
    }
  })

  // Now continue with actual test
  cy.get(highlightsTranslationItem).should('have.length.greaterThan', 0)
})
```

## Running Tests

### Run all tests

```bash
npm run test:e2e
```

### Run specific test file

```bash
npx cypress run --spec "test/cypress/e2e/highlights.test.ts"
```

### Open Cypress UI

```bash
npx cypress open
```

## Troubleshooting

### Test is flaky

- Add appropriate `cy.wait()` calls after async operations
- Use `{ timeout: 10000 }` option for slow operations
- Ensure elements are visible before interacting: `assertShowing(element)`

### Element not found

- Verify the data-tag is correctly added to the component
- Check that the tag is exported from `src/tags.ts`
- Use Cypress UI to inspect the DOM structure

### Dialog not appearing

- Ensure you wait for the trigger action to complete
- Check that dialog is not hidden by CSS or z-index issues
- Verify the dialog component is properly mounted

## Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Quasar Testing Guide](https://quasar.dev/quasar-cli-vite/testing-and-auditing)
- [Vue Test Utils](https://test-utils.vuejs.org/)
