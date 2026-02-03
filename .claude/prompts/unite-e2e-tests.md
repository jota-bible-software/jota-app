# Unite Cypress and Playwright E2E Tests

Create a **single set of test cases** that can run on either Cypress or Playwright through an abstraction layer.

## Architecture: Test-as-Function Pattern

### Directory Structure

```
test/
  shared/                              # NEW: Shared test definitions
    api/
      types.ts                         # Framework-agnostic API interface
    specs/
      home.spec.ts                     # Test definitions (one source of truth)
      highlights.spec.ts
      settings-book-namings.spec.ts
      settings-copy-templates.spec.ts
      settings-format-templates.spec.ts
      settings-translations.spec.ts

  cypress/
    adapter/
      CypressAdapter.ts                # NEW: Implements TestAPI for Cypress
    e2e/
      home.test.ts                     # Thin runner that imports shared spec
      CypressHelper.ts                 # Keep existing (used by adapter)
    fixtures/                          # Keep as-is

  playwright/
    adapter/
      PlaywrightAdapter.ts             # NEW: Implements TestAPI for Playwright
    e2e/
      home.test.ts                     # Thin runner that imports shared spec
      PlaywrightHelper.ts              # Keep existing (used by adapter)
    fixtures -> ../cypress/fixtures    # Symlink (already exists)
```

### Key Components

#### 1. Framework-Agnostic API (`test/shared/api/types.ts`)

```typescript
export interface TestAPI {
  // Navigation
  navigate(url: string): Promise<void>

  // Selectors
  tag(name: string): string
  find(target: Target): Locator
  first(target: Target): Locator
  last(target: Target): Locator
  containsText(text: string): Locator

  // Actions
  click(target: Target, position?: PositionType): Promise<void>
  type(target: Target, text: string, replace?: boolean): Promise<void>
  select(target: Target, value: string): Promise<void>
  pressKey(key: string): Promise<void>

  // Assertions
  assertShowing(target: Target, options?: { timeout?: number }): Promise<void>
  assertText(target: Target, text: string): Promise<void>
  assertCount(target: Target, count: number): Promise<void>
  // ... more methods matching existing helpers

  // Escape hatch for framework-specific code
  getPage(): any
}
```

#### 2. Shared Test Spec (`test/shared/specs/home.spec.ts`)

```typescript
import * as tags from '../../../src/tags'
import { TestAPI } from '../api/types'

export interface TestSpec {
  name: string
  beforeEach?: (api: TestAPI) => Promise<void>
  tests: Record<string, (api: TestAPI) => Promise<void>>
  suites?: Record<string, Omit<TestSpec, 'name'>>
}

export const homePageTests: TestSpec = {
  name: 'Home Page',

  beforeEach: async (api) => {
    await api.navigate('/')
  },

  tests: {
    'should have a correct page title': async (api) => {
      await api.assertEqual(api.title(), 'Jota Bible App')
    },

    'should show error page when wrong url': async (api) => {
      await api.navigate('/wrong')
      await api.assertShowing(api.containsText('404'))
    },
  },

  suites: {
    'Reference picker': {
      beforeEach: async (api) => {
        await api.clearLocalStorage()
        await api.navigate('/')
      },
      tests: {
        'should select book and chapter': async (api) => {
          const bookButtons = api.tag(tags.referencePickerBookButton)
          await api.click(api.first(bookButtons))
          // ... rest of test
        },
      }
    },
    // ... more suites
  }
}
```

#### 3. Adapters

**CypressAdapter** wraps existing `CypressHelper.ts` functions, returning `Promise.resolve()` to satisfy the async interface (Cypress handles the actual queuing).

**PlaywrightAdapter** wraps existing `PlaywrightHelper.ts` functions directly.

#### 4. Thin Runners

**Playwright (`test/playwright/e2e/home.test.ts`):**
```typescript
import { test } from '@playwright/test'
import { createPlaywrightAPI } from '../adapter/PlaywrightAdapter'
import { setupFixtureRoutes, setPage } from './PlaywrightHelper'
import { homePageTests } from '../../shared/specs/home.spec'
import { registerTests } from '../../shared/runner'

let api: ReturnType<typeof createPlaywrightAPI>

test.beforeEach(async ({ page }) => {
  setPage(page)
  api = createPlaywrightAPI(page)
  await setupFixtureRoutes(page)
})

registerTests(homePageTests, () => api, test.describe, test)
```

**Cypress (`test/cypress/e2e/home.test.ts`):**
```typescript
import { createCypressAPI } from '../adapter/CypressAdapter'
import { homePageTests } from '../../shared/specs/home.spec'
import { registerTests } from '../../shared/runner'

const api = createCypressAPI()
registerTests(homePageTests, () => api, describe, it)
```

## Implementation Steps

### Step 1: Create Infrastructure
1. Create `test/shared/api/types.ts` with `TestAPI` interface
2. Create `test/shared/runner.ts` with `registerTests()` helper
3. Create `test/cypress/adapter/CypressAdapter.ts`
4. Create `test/playwright/adapter/PlaywrightAdapter.ts`

### Step 2: Migrate First Test File
1. Convert `settings-format-templates.test.ts` to `test/shared/specs/settings-format-templates.spec.ts`
2. Create thin runners for both frameworks
3. Run both test suites to verify parity

### Step 3: Migrate Remaining Tests
- `home.test.ts`
- `highlights.test.ts`
- `settings-book-namings.test.ts`
- `settings-copy-templates.test.ts`
- `settings-translations.test.ts`

### Step 4: Cleanup
1. Remove old test logic from framework-specific files (keep only runners)
2. Update `CLAUDE.md` documentation
3. Add script to run tests with either framework

## Handling Framework-Specific Behavior

For Quasar split buttons or other edge cases, add specific methods to `TestAPI`:

```typescript
// In TestAPI
clickSplitButton(target: Target, part: 'main' | 'dropdown'): Promise<void>
```

Or use the escape hatch:
```typescript
const page = api.getPage()
// Framework-specific code here
```

## Verification

After each step:
1. `pnpm test:e2e:ci` - Cypress tests pass
2. `pnpm test:e2e:pw` - Playwright tests pass
3. Both run the same test cases from shared specs

## Completion Promise

All E2E tests are unified: one set of test specs in `test/shared/specs/` running successfully on both Cypress and Playwright with identical test coverage.
