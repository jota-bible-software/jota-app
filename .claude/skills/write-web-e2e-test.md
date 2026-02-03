---
description: Expert in writing framework-agnostic E2E tests using abstraction layer pattern with Cypress or Playwright
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(pnpm:*), Bash(npx cypress:*), Bash(npx playwright:*)
---

# Skill: Write Web E2E Tests

Expert in writing E2E tests using an abstraction layer pattern that works with Cypress or Playwright. Creates framework-agnostic, maintainable tests using semantic helper functions and data-tag selectors.

## Core Philosophy

### 1. Abstraction Over Direct API Calls

Never call the testing framework directly in test files. Use semantic helper functions that:
- Hide framework implementation details
- Make tests readable as user stories
- Enable easy framework migration (Cypress ↔ Playwright)

```typescript
// BAD - Framework-specific
cy.get('[data-tag=submit-btn]').click()
await page.locator('[data-tag=submit-btn]').click()

// GOOD - Abstracted
click(submitButton)
```

### 2. Data Tags Over CSS Selectors

Use `data-tag` attributes exclusively for test selectors:
- Decoupled from styling (class changes won't break tests)
- Explicit test intent (developers know what's tested)
- Framework/library agnostic (works with any frontend)

```html
<!-- Component -->
<button data-tag="submit-button" class="btn btn-primary">Submit</button>
```

```typescript
// Test
const submitButton = tag('submit-button') // → '[data-tag=submit-button]'
click(submitButton)
```

### 3. Centralized Tag Registry

Define all tags in a single source file to:
- Prevent typos and inconsistencies
- Enable IDE autocomplete
- Document all testable elements

```typescript
// src/tags.ts (or similar)
export const submitButton = 'submit-button'
export const userNameInput = 'user-name-input'
export const errorMessage = 'error-message'
export const navMenu = 'nav-menu'
```

## Test Helper Architecture

### Directory Structure

```
test/
├── e2e/
│   ├── TestHelper.ts      # Abstraction layer
│   ├── home.test.ts       # Test specs
│   ├── settings.test.ts
│   └── ...
├── fixtures/              # Mock data
│   └── api-response.json
└── support/
    ├── e2e.ts             # Global setup
    └── commands.ts        # Custom commands
```

### Helper Function Categories

#### 1. Navigation

```typescript
export function navigate(url: string) {
  // Cypress: cy.visit(url)
  // Playwright: await page.goto(url)
}
```

#### 2. Element Selection

```typescript
// Base selector from tag
export function tag(name: string): string {
  return `[data-tag=${name}]`
}

// Find element(s)
export function find(target: Target): ElementWrapper {
  // Returns chainable element reference
}

// Positional selectors
export function first(target: Target): ElementWrapper
export function last(target: Target): ElementWrapper
export function nth(target: Target, position: number): ElementWrapper
export function visible(target: Target): ElementWrapper
```

#### 3. Actions

```typescript
export function click(target: Target, position?: PositionType)
export function type(target: Target, text: string, replace?: boolean)
export function select(target: Target, value: string)
export function focusOn(target: Target)
export function pressKey(key: string)
```

#### 4. Assertions

```typescript
// Visibility
export function assertShowing(target: Target, options?: object)
export function assertNotShowing(target: Target)
export function assertExists(target: Target)
export function assertNotExists(target: Target)

// Content
export function assertText(target: Target, text: string)
export function assertTextContains(target: Target, text: string)
export function assertTextNotContains(target: Target, text: string)
export function assertValue(target: Target, value: string)
export function assertHtmlContains(target: Target, html: string)

// State
export function assertEnabled(target: Target)
export function assertDisabled(target: Target)
export function assertChecked(target: Target)
export function assertNotChecked(target: Target)
export function assertHasClass(target: Target, className: string)

// Count
export function assertCount(target: Target, length: number)
```

#### 5. Utilities

```typescript
export function wait(ms: number)
export function containsText(text: string): ElementWrapper
export function title(): StringWrapper
export function dialog(): ElementWrapper
export function notification(): ElementWrapper
```

## Test File Structure

### Pattern

```typescript
import * as tags from 'src/tags'
import {
  navigate, tag, click, type, select,
  first, last, nth,
  assertShowing, assertNotShowing,
  assertText, assertCount,
} from './TestHelper'

describe('Feature Name', () => {
  // 1. Define navigation helpers
  const goHome = () => navigate('/')
  const goSettings = () => navigate('/settings')

  // 2. Define selectors at top (using tag registry)
  const submitButton = tag(tags.submitButton)
  const userNameInput = tag(tags.userNameInput)
  const errorMessage = tag(tags.errorMessage)
  const listItems = tag(tags.listItem)

  // 3. Setup
  beforeEach(() => {
    goHome()
  })

  // 4. Tests grouped by behavior
  describe('Form Submission', () => {
    it('should submit with valid data', () => {
      type(userNameInput, 'John Doe')
      click(submitButton)
      assertShowing(containsText('Success'))
    })

    it('should show error with empty name', () => {
      click(submitButton)
      assertShowing(errorMessage)
      assertText(errorMessage, 'Name is required')
    })
  })

  describe('List Operations', () => {
    it('should display correct item count', () => {
      assertCount(listItems, 5)
    })

    it('should highlight first item on click', () => {
      click(first(listItems))
      assertHasClass(first(listItems), 'selected')
    })
  })
})
```

### Naming Conventions

- Test files: `feature-name.test.ts`
- Describe blocks: Feature or component name
- It blocks: Start with "should" + expected behavior

## API Mocking with Fixtures

### Setup Interception

```typescript
// support/e2e.ts
beforeEach(() => {
  // Cypress
  cy.intercept('GET', '/api/users/*', { fixture: 'users.json' })

  // Playwright
  await page.route('/api/users/*', route =>
    route.fulfill({ path: 'fixtures/users.json' })
  )
})
```

### Fixture Structure

```
fixtures/
├── users.json
├── products/
│   ├── list.json
│   └── detail.json
└── errors/
    └── 404.json
```

## Framework Migration Guide

### Cypress → Playwright Mapping

| Cypress | Playwright |
|---------|------------|
| `cy.visit(url)` | `page.goto(url)` |
| `cy.get(selector)` | `page.locator(selector)` |
| `cy.get(s).click()` | `locator.click()` |
| `cy.get(s).type(t)` | `locator.fill(t)` |
| `cy.get(s).should('be.visible')` | `expect(locator).toBeVisible()` |
| `cy.get(s).should('have.text', t)` | `expect(locator).toHaveText(t)` |
| `cy.intercept()` | `page.route()` |
| `cy.wait(ms)` | `page.waitForTimeout(ms)` |

### Implementation Pattern

```typescript
// TestHelper.ts - Cypress implementation
export function click(target: Target) {
  return find(target).click()
}

// TestHelper.ts - Playwright implementation
export async function click(target: Target) {
  await find(target).click()
}
```

## Best Practices

### DO

1. **Use descriptive tag names** reflecting element purpose
   ```typescript
   export const loginSubmitButton = 'login-submit-button'  // Good
   export const btn1 = 'btn1'  // Bad
   ```

2. **Group related selectors** at test file top
   ```typescript
   // Navigation
   const homeLink = tag(tags.homeLink)
   const settingsLink = tag(tags.settingsLink)

   // Form elements
   const emailInput = tag(tags.emailInput)
   const submitButton = tag(tags.submitButton)
   ```

3. **Use semantic assertions** that read like requirements
   ```typescript
   assertShowing(errorMessage)
   assertText(errorMessage, 'Invalid email')
   assertDisabled(submitButton)
   ```

4. **Test user journeys**, not implementation details
   ```typescript
   // Good - tests user flow
   it('should complete purchase', () => {
     click(addToCartButton)
     click(checkoutButton)
     type(cardNumber, '4242424242424242')
     click(payButton)
     assertShowing(confirmationMessage)
   })
   ```

### DON'T

1. **Avoid CSS class selectors**
   ```typescript
   // Bad - breaks when styling changes
   const button = '.btn-primary'

   // Good - stable test selector
   const button = tag(tags.submitButton)
   ```

2. **Avoid hardcoded waits** when possible
   ```typescript
   // Bad
   wait(2000)
   click(button)

   // Good - use built-in waiting
   assertShowing(button, { timeout: 5000 })
   click(button)
   ```

3. **Avoid testing internal state**
   ```typescript
   // Bad - testing implementation
   expect(store.getState().user.isLoggedIn).toBe(true)

   // Good - testing visible behavior
   assertShowing(userAvatar)
   assertText(welcomeMessage, 'Hello, John')
   ```

4. **Avoid duplicating selectors across files**
   ```typescript
   // Bad - selector defined in test file
   const submitBtn = '[data-tag=submit-btn]'

   // Good - use centralized registry
   const submitBtn = tag(tags.submitButton)
   ```

## Common Patterns

### Conditional Setup

```typescript
it('should handle existing data', () => {
  // Check if data exists, create if not
  cy.get('body').then($body => {
    if ($body.find(listItem).length === 0) {
      click(addButton)
      type(nameInput, 'New Item')
      click(saveButton)
    }
  })

  // Now proceed with test
  assertShowing(listItem)
})
```

### Dialog Handling

```typescript
// Helper functions for common dialogs
export function clickDialogYes() {
  cy.get('.dialog').contains('Yes').click()
}

export function clickDialogNo() {
  cy.get('.dialog').contains('No').click()
}

// Usage
click(deleteButton)
assertShowing(dialog())
clickDialogYes()
assertNotExists(listItem)
```

### Nested Element Selection

```typescript
// Within a specific container
within(first(listItem), () => {
  assertShowing(editButton)
  click(deleteButton)
})

// Or using nested helper
assertCount(nested(first(group), listItem), 3)
```

### Form Validation Testing

```typescript
describe('Form Validation', () => {
  it('should show error for empty required field', () => {
    click(submitButton)
    assertErrorHint(emailInput, 'Email is required')
  })

  it('should show error for invalid email', () => {
    type(emailInput, 'invalid-email')
    click(submitButton)
    assertErrorHint(emailInput, 'Invalid email format')
  })
})
```

## When to Use This Skill

- Writing new E2E tests for web applications
- Refactoring existing tests to use abstraction layer
- Migrating tests between Cypress and Playwright
- Setting up E2E testing infrastructure for new projects
- Adding test coverage for user-facing features

## Related Files

When implementing this pattern, create or modify:

1. `src/tags.ts` - Tag registry (add new tags here first)
2. `test/e2e/TestHelper.ts` - Abstraction layer
3. `test/e2e/*.test.ts` - Test specifications
4. `test/fixtures/*.json` - Mock data
5. `test/support/e2e.ts` - Global setup and interceptors
