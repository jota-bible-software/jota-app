# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jota Bible App is an ergonomic Bible reading and search application built with Vue 3, Quasar Framework, and TypeScript. The app supports multiple languages and translations, features advanced search capabilities with passage reference parsing, and includes highlighting functionality.

## Development Commands

### Core Development
- `npm run dev` or `quasar dev` - Start development server with hot-reloading
- `npm run build` or `quasar build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Testing
- `pnpm test:unit` - Run unit tests with Vitest
- `pnpm test:unit:ci` - Run unit tests in CI mode
- `pnpm test:unit:ui` - Run unit tests with UI

#### E2E Tests (Playwright - recommended)
- `pnpm test:e2e:pw` - Run Playwright E2E tests
- `pnpm test:e2e:pw:ui` - Run Playwright E2E tests with UI mode
- `pnpm test:e2e:pw:headed` - Run Playwright E2E tests in headed browser
- `pnpm test:e2e:pw:ci` - Run Playwright E2E tests in CI mode

#### E2E Tests (Cypress - legacy)
- `pnpm test:e2e` - Run E2E tests with Cypress (interactive)
- `pnpm test:e2e:ci` - Run E2E tests in CI mode

### Other Commands
- `npm run custom-icons` - Generate custom icon fonts from SVG files

## Architecture Overview

### Core Technologies
- **Vue 3** with Composition API and TypeScript
- **Quasar Framework** for UI components and build system
- **Pinia** for state management
- **Vue Router** for navigation
- **Vue I18n** for internationalization

### Key Directories

#### `/src/logic/` - Core Business Logic
- `jota.ts` - Main application logic for Bible processing, search, and formatting
- `translation-utils.ts` - Utilities for working with different Bible translation formats
- `books.js` - Bible book definitions and OSIS mappings
- `format.ts` - Text formatting utilities
- `highlighter.ts` - Passage highlighting logic
- `readingPlans.js` - Reading plan functionality
- `audio.ts` - Audio playback features

#### `/src/stores/` - Pinia State Management
- `settings-store.ts` - Application settings and preferences
- `translation-store.ts` - Bible translation management
- `highlight-store.ts` - Passage highlighting state
- `search-store.ts` - Search functionality state
- `main-store.ts` - General application state

#### `/src/components/` - Vue Components
Key components include Bible content display, search interfaces, settings panels, and highlighting tools.

#### `/src/pages/` - Route Pages
- `MainPage.vue` - Primary Bible reading interface
- `SettingsPage.vue` - Application configuration
- `HelpPage.vue` - User documentation

### Data Handling

#### Bible Translation Formats
The app supports two Bible translation data formats:
1. **3D Array Format (legacy)**: `string[][][]` - books > chapters > verses
2. **Map Format**: Nested objects with numbered keys for books/chapters/verses

Translation files are loaded from `/public/data/` and follow the `TranslationFile` type structure.

#### Key Type Definitions
- `Passage` - Bible reference as `[bookIndex, chapterIndex, startVerse?, endVerse?]`
- `TranslationContent` - Union type for both supported Bible data formats
- `SearchOptions` - Configuration for search functionality
- `FormatTemplateData` - Templates for formatting Bible passages

### Search Functionality

The search system (`jota.ts`) handles:
- **Passage References**: Parse Bible references like "John 3:16" or "Gen 1:1-5"
- **Text Search**: Search within Bible content using regex or simple text
- **Reference Parser**: Uses `jota-parser` library for multi-language Bible reference parsing

### Internationalization

- Supports multiple locales: `en-US`, `pl-PL`, `pt-BR`, `es-ES`, `pt-PT`, `uk-UA`
- Translation files in `/src/i18n/`
- Locale-specific Bible translations and book naming conventions

### Testing Setup

#### Unit Tests (Vitest)
- Test files: `/test/vitest/__tests__/`
- Configuration: `vitest.config.ts`
- Setup file: `/test/vitest/setup-file.ts`

#### E2E Tests Architecture

The E2E tests use a **unified test specification** pattern that allows the same test logic to run on both Playwright and Cypress.

**Directory Structure:**
```
test/
  shared/                         # Framework-agnostic test definitions
    api/types.ts                  # TestAPI interface
    specs/                        # Shared test specifications (72 tests)
      home.spec.ts
      settings-book-namings.spec.ts
      settings-copy-templates.spec.ts
      settings-format-templates.spec.ts
      settings-translations.spec.ts

  cypress/
    adapter/CypressAdapter.ts     # Implements TestAPI for Cypress
    e2e/*.test.ts                 # Thin runners + highlights.test.ts (framework-specific)

  playwright/
    adapter/PlaywrightAdapter.ts  # Implements TestAPI for Playwright
    e2e/*.test.ts                 # Thin runners + highlights.test.ts (framework-specific)
```

**Note:** The highlights tests (13 tests) remain framework-specific due to complex async callback patterns that differ between frameworks.

**Key Concepts:**
- `TestAPI` interface defines framework-agnostic actions and assertions
- Shared specs in `test/shared/specs/` contain all test logic
- Framework adapters wrap helper functions to implement TestAPI
- Thin runners import specs and execute them with the appropriate adapter

**Writing New Shared Tests:**
1. Create spec in `test/shared/specs/your-feature.spec.ts`
2. Use the `TestAPI` interface methods (navigate, click, assertText, etc.)
3. Test functions must NOT be async - the adapters handle sync/async differences
4. Create thin runners in both `test/cypress/e2e/` and `test/playwright/e2e/`

**Example spec structure:**
```typescript
export const myTests: TestSpec = {
  name: 'Feature Name',
  beforeEach: (api) => api.navigate('/page'),
  tests: {
    'should do something': (api) => {
      api.click(api.tag('button'))
      api.assertText('.result', 'Expected')
    },
  },
  suites: { /* nested suites */ },
}
```

#### E2E Tests (Playwright - recommended)
- Configuration: `playwright.config.ts`
- Helper utilities: `/test/playwright/e2e/PlaywrightHelper.ts`
- Adapter: `/test/playwright/adapter/PlaywrightAdapter.ts`

**Running tests:**
```bash
pnpm test:e2e:pw                  # Run all tests
pnpm exec playwright test --grep "clipboard"   # Run tests matching pattern
pnpm exec playwright test --headed             # Run with visible browser
pnpm exec playwright test --ui                 # Interactive UI mode
```

#### E2E Tests (Cypress)
- Configuration: `cypress.config.ts`
- Helper utilities: `/test/cypress/e2e/CypressHelper.ts`
- Adapter: `/test/cypress/adapter/CypressAdapter.ts`

**Running tests:**
```bash
pnpm test:e2e                     # Interactive mode
pnpm test:e2e:ci                  # CI mode
```

**Quasar Component Interactions:**
- For `q-btn-dropdown` with `split`: use `clickSplitButtonMain()` and `clickSplitButtonArrow()`
- Use `forceClick()` for buttons that don't respond to regular clicks (e.g., with validation errors)
- The `select()` method handles Quasar select/dropdown components

## Development Notes

### Working with Bible Data
- Use `translation-utils.ts` functions (`getVerse`, `getChapter`, etc.) for data access
- Bible data uses 0-based indexing internally but displays 1-based to users
- Handle both 3D array and map data formats when adding new features

### Adding New Features
- Follow existing Pinia store patterns for state management
- Use Quasar components and design system
- Maintain TypeScript type safety throughout
- Test with multiple Bible translation formats and languages

### Code Style
- ESLint configuration enforces TypeScript and Vue best practices
- Prettier handles code formatting
- Use Composition API for new Vue components
- Maintain existing naming conventions for consistency

### Multi-Domain Setup
See `/docs/multi-domain-setup.md` for detailed configuration information about multi-domain deployment.