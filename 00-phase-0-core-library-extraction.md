# Phase 0: Core Library Extraction & Project Setup

## Overview

This phase establishes the foundation for the refactoring by creating a monorepo structure and extracting all core business logic into framework-agnostic packages. This will enable the logic to be reused across different platforms (web, desktop, mobile, server).

## Goals

- Extract all business logic from Vue/Quasar dependencies
- Create a monorepo structure with separate packages
- Establish clear interfaces between packages
- Maintain 100% backward compatibility during transition

## Project Structure

```
jota-app/
├── packages/
│   ├── core/                    # Core business logic library
│   │   ├── src/
│   │   │   ├── types/          # Type definitions
│   │   │   ├── bible/          # Bible data handling
│   │   │   ├── search/         # Search functionality  
│   │   │   ├── format/         # Text formatting
│   │   │   ├── highlight/      # Highlighting logic
│   │   │   ├── audio/          # Audio features
│   │   │   ├── plans/          # Reading plans
│   │   │   ├── storage/        # Abstract storage interfaces
│   │   │   └── index.ts        # Main exports
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── adapters/               # Platform adapters
│   │   ├── web/               # Web-specific adapters
│   │   ├── electron/          # Electron-specific adapters
│   │   └── server/            # Server-specific adapters
│   └── state/                 # State management abstractions
│       ├── src/
│       │   ├── stores/        # Framework-agnostic stores
│       │   ├── effects/       # Side effects handling
│       │   └── index.ts
│       └── package.json
├── apps/
│   ├── web/                   # Current Quasar web app (refactored)
│   ├── electron/              # Future Electron app
│   └── server/                # Future API server
├── package.json               # Root workspace config
├── pnpm-workspace.yaml
└── tsconfig.json             # Root TypeScript config
```

## Tasks

### 1. Setup Monorepo Infrastructure

#### 1.1 Initialize Workspace
- [ ] Create `packages/` and `apps/` directories
- [ ] Update root `package.json` with workspace configuration
- [ ] Create `pnpm-workspace.yaml` with package declarations
- [ ] Setup shared TypeScript configuration
- [ ] Configure ESLint/Prettier for monorepo

#### 1.2 Move Current App
- [ ] Move current source code to `apps/web/`
- [ ] Update build scripts and paths
- [ ] Ensure existing functionality works unchanged

### 2. Create Core Library Package

#### 2.1 Package Setup
- [ ] Create `packages/core/package.json`
- [ ] Setup TypeScript configuration
- [ ] Configure build process (ESM + CJS outputs)
- [ ] Setup testing infrastructure (Vitest)

#### 2.2 Extract Core Types
Extract and reorganize from `src/types.ts`:
- [ ] `packages/core/src/types/bible.ts` - Bible data types
  ```typescript
  // TranslationContent, TranslationFile, Passage, etc.
  ```
- [ ] `packages/core/src/types/search.ts` - Search-related types
  ```typescript
  // SearchOptions, Progress, etc.
  ```
- [ ] `packages/core/src/types/format.ts` - Formatting types
  ```typescript
  // FormatTemplateData, Formatted, PassageFormat, etc.
  ```
- [ ] `packages/core/src/types/highlight.ts` - Highlighting types
  ```typescript
  // Highlights, PassageHighlight, HighlightConfig, etc.
  ```
- [ ] `packages/core/src/types/settings.ts` - Settings types
  ```typescript
  // AppSettings, LocaleSymbol, ScreenMode, etc.
  ```

#### 2.3 Extract Bible Data Handling
From `src/logic/translation-utils.ts` and `src/logic/books.js`:
- [ ] `packages/core/src/bible/translation-utils.ts`
  - Pure functions for accessing Bible data
  - Support both 3D array and map formats
  - Remove any Vue/reactive dependencies
- [ ] `packages/core/src/bible/books.ts` (convert from .js)
  - Book metadata, names, chapter counts
  - OSIS mappings and book order
- [ ] `packages/core/src/bible/data-loader.ts`
  - Abstract interface for loading translation data
  - Remove direct file/HTTP loading logic

#### 2.4 Extract Search Functionality
From `src/logic/jota.ts`:
- [ ] `packages/core/src/search/parser.ts`
  - Bible reference parsing (jota-parser integration)
  - Remove Vue reactivity dependencies
- [ ] `packages/core/src/search/engine.ts`
  - Text search within Bible content
  - Search options handling
  - Results sorting and filtering
- [ ] `packages/core/src/search/reference-resolver.ts`
  - Convert parsed references to passages
  - Handle passage validation and normalization

#### 2.5 Extract Formatting Logic
From `src/logic/format.ts`:
- [ ] `packages/core/src/format/passage-formatter.ts`
  - Pure passage formatting functions
  - Template-based formatting
  - Remove template character replacement utilities
- [ ] `packages/core/src/format/template-engine.ts`
  - Format template processing
  - Template variable substitution
- [ ] `packages/core/src/format/copy-templates.ts`
  - Copy template management
  - Template validation and defaults

#### 2.6 Extract Highlighting Logic
From `src/logic/highlighter.ts`:
- [ ] `packages/core/src/highlight/highlighter.ts`
  - All pure highlighting functions
  - Highlight overlap detection
  - Passage highlighting utilities

#### 2.7 Extract Audio Logic
From `src/logic/audio.ts`:
- [ ] `packages/core/src/audio/audio-manager.ts`
  - Abstract audio playback interface
  - Remove DOM/browser-specific code
  - Create adapter pattern for platform-specific audio

#### 2.8 Extract Reading Plans
From `src/logic/readingPlans.js`:
- [ ] `packages/core/src/plans/reading-plans.ts`
  - Reading plan definitions and logic
  - Progress tracking utilities
  - Plan validation and scheduling

#### 2.9 Extract Core Utilities
From `src/util.ts`, extract framework-agnostic functions:
- [ ] `packages/core/src/utils/date.ts`
  - Date parsing and formatting
- [ ] `packages/core/src/utils/text.ts`
  - Text processing utilities
- [ ] `packages/core/src/utils/locale.ts`
  - Locale detection and conversion
- [ ] `packages/core/src/utils/storage.ts`
  - Abstract storage interfaces

### 3. Create State Management Package

#### 3.1 Package Setup
- [ ] Create `packages/state/package.json`
- [ ] Setup framework-agnostic state management
- [ ] Consider Zustand or Jotai for simplicity

#### 3.2 Extract Store Logic
From `src/stores/`, create framework-agnostic stores:
- [ ] `packages/state/src/stores/translation-store.ts`
  - Translation selection and management
  - Remove Pinia/Vue dependencies
  - Use abstract storage interface
- [ ] `packages/state/src/stores/settings-store.ts`
  - App settings management
  - Settings persistence abstractions
- [ ] `packages/state/src/stores/highlight-store.ts`
  - Highlight state management
  - Highlight persistence
- [ ] `packages/state/src/stores/search-store.ts`
  - Search state and history
  - Recent searches management

### 4. Create Adapter Package

#### 4.1 Web Adapters
- [ ] `packages/adapters/src/web/storage-adapter.ts`
  - localStorage implementation
  - IndexedDB for large data
- [ ] `packages/adapters/src/web/http-adapter.ts`
  - Translation file loading
  - Network connectivity handling
- [ ] `packages/adapters/src/web/audio-adapter.ts`
  - Web Audio API implementation

#### 4.2 Storage Abstractions
- [ ] `packages/adapters/src/storage/storage-interface.ts`
  - Abstract storage interface
  - Key-value and structured storage
- [ ] `packages/adapters/src/storage/memory-storage.ts`
  - In-memory implementation for testing

### 5. Update Build Configuration

#### 5.1 Package Build Scripts
- [ ] Configure TypeScript compilation for each package
- [ ] Setup ESM and CJS dual builds
- [ ] Configure package exports in package.json files
- [ ] Add build scripts to root package.json

#### 5.2 Development Scripts
- [ ] Setup workspace watch mode for development
- [ ] Configure hot reloading for core library changes
- [ ] Add linting and formatting scripts for all packages

### 6. Testing Strategy

#### 6.1 Core Library Tests
- [ ] Port existing tests from `test/vitest/__tests__/`
- [ ] Add comprehensive unit tests for all core functions
- [ ] Test both 3D array and map data formats
- [ ] Add integration tests for complete workflows

#### 6.2 Cross-Package Testing
- [ ] Test adapter implementations
- [ ] Test state management with different storage adapters
- [ ] Add performance benchmarks for core operations

## Implementation Order

1. **Setup monorepo** (1-2 days)
2. **Extract types** (1 day)
3. **Extract core Bible logic** (2-3 days)
4. **Extract search and formatting** (2-3 days)
5. **Extract state management** (2-3 days)
6. **Create adapters** (2-3 days)
7. **Update build and test configurations** (1-2 days)

## Success Criteria

- [ ] All current functionality works unchanged
- [ ] Core library has 0 Vue/Quasar dependencies
- [ ] Core library is fully tested
- [ ] All packages build successfully
- [ ] Existing web app uses the new core library
- [ ] Build times remain reasonable
- [ ] Bundle sizes don't increase significantly

## Dependencies to Remove from Core

### Direct Dependencies to Extract
- Remove Vue reactivity (`ref`, `reactive`, `computed`)
- Remove Pinia store dependencies  
- Remove Quasar UI components
- Remove Vue I18n direct usage
- Remove browser-specific APIs (localStorage, fetch, audio)

### External Dependencies to Evaluate
- **Keep**: `jota-parser`, `lodash`, `nanoid` (framework-agnostic)
- **Abstract**: File system access, HTTP requests, audio playback
- **Replace**: Vue reactivity with simple event emitters or observables

## Breaking Changes

- None expected for end users
- Internal API changes for future development
- Some import paths will change for development team

This phase creates the foundation for all subsequent phases by establishing a clean separation between business logic and UI framework, enabling multi-platform deployment and easier testing.