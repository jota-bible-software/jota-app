# Jota Bible App - Technical Architecture

**Document Version**: 1.0
**Last Updated**: December 2024

---

## 1. Overview

Jota Bible App is built as a **monorepo** with a clean separation between core business logic and platform-specific implementations. This architecture enables code reuse across web, desktop, and future mobile platforms.

---

## 2. Monorepo Structure

```
jota-app/
├── packages/
│   ├── core/                 # Framework-agnostic business logic
│   │   ├── src/
│   │   │   ├── audio/       # Audio management
│   │   │   ├── bible/       # Bible data handling, books, translations
│   │   │   ├── format/      # Passage formatting, templates
│   │   │   ├── highlight/   # Highlighting logic
│   │   │   ├── plans/       # Reading plans
│   │   │   ├── search/      # Search engine, parser, reference resolver
│   │   │   ├── types/       # Type definitions
│   │   │   └── utils/       # Date, text, locale utilities
│   │   ├── dist/            # Built output (ESM + CJS)
│   │   └── package.json
│   │
│   └── adapters/             # Platform-specific adapters
│       ├── src/
│       │   ├── factory/     # Adapter factory and detection
│       │   ├── interfaces/  # Abstract interfaces
│       │   ├── memory/      # In-memory mocks for testing
│       │   ├── storage/     # Storage interface
│       │   └── web/         # Web platform adapters
│       ├── dist/
│       └── package.json
│
├── apps/
│   └── web/                  # Quasar web application
│       ├── src/
│       │   ├── adapters/    # Web adapter configuration
│       │   ├── boot/        # App initialization
│       │   ├── components/  # Vue components
│       │   ├── composables/ # Vue composables
│       │   ├── css/         # Global styles
│       │   ├── data/        # Static data
│       │   ├── i18n/        # Internationalization
│       │   ├── layouts/     # Page layouts
│       │   ├── logic/       # Business logic (delegating to @jota/core)
│       │   ├── pages/       # Route pages
│       │   ├── router/      # Vue Router configuration
│       │   ├── services/    # App services
│       │   └── stores/      # Pinia stores
│       ├── public/
│       │   └── data/        # Bible translation JSON files
│       └── test/
│           ├── cypress/     # E2E tests
│           └── vitest/      # Unit tests
│
├── pnpm-workspace.yaml       # Workspace configuration
├── package.json              # Root scripts
└── tsconfig.base.json        # Shared TypeScript config
```

---

## 3. Package Dependencies

```
                    ┌─────────────────┐
                    │   apps/web      │
                    │  (Quasar/Vue)   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
    ┌─────────────────┐ ┌─────────────────┐
    │ @jota/adapters  │ │   External      │
    │ (Platform layer)│ │   Libraries     │
    └────────┬────────┘ │  - Vue 3        │
             │          │  - Quasar       │
             │          │  - Pinia        │
             │          │  - Vue Router   │
             │          │  - Vue I18n     │
             │          │  - VueUse       │
             ▼          └─────────────────┘
    ┌─────────────────┐
    │   @jota/core    │
    │ (Business logic)│
    │                 │
    │  - jota-parser  │
    │  - nanoid       │
    │  - lodash       │
    └─────────────────┘
```

---

## 4. Core Package (`@jota/core`)

### 4.1 Module Structure

| Module | Purpose | Key Exports |
|--------|---------|-------------|
| `bible/` | Bible data handling | `getVerse()`, `getChapter()`, `books`, `OSIS_MAP` |
| `search/` | Search functionality | `SearchEngine`, `parseReference()`, `resolveReference()` |
| `format/` | Passage formatting | `formatPassage()`, `TemplateEngine` |
| `highlight/` | Highlight logic | `addHighlight()`, `removeHighlight()`, `getHighlightForVerse()` |
| `audio/` | Audio management | `AudioManager` |
| `plans/` | Reading plans | `getReadingPlan()`, `calculateProgress()` |
| `types/` | Type definitions | All shared types |
| `utils/` | Utilities | Date, text, locale helpers |

### 4.2 Bible Data Handling

**Dual Format Support**:
```typescript
// 3D Array Format (legacy)
type TranslationContentArray = string[][][]
// books[bookIndex][chapterIndex][verseIndex] = verse text

// Map Format (current)
type TranslationContentMap = {
  [bookNumber: number]: {
    [chapterNumber: number]: {
      [verseNumber: number]: string
    }
  }
}
```

**Access Functions** (work with both formats):
```typescript
function getVerse(content: TranslationContent, book: number, chapter: number, verse: number): string
function getChapter(content: TranslationContent, book: number, chapter: number): string[]
function getBookChapterCount(content: TranslationContent, book: number): number
```

### 4.3 Search Engine

```typescript
// Reference parsing via jota-parser
parseReference(input: string, locale: string): ParsedReference[]

// Text search
class SearchEngine {
  search(content: TranslationContent, query: string, options: SearchOptions): Passage[]
}

// Reference resolution
resolveReference(parsed: ParsedReference, content: TranslationContent): Passage[]
```

### 4.4 Highlight Logic

```typescript
// Pure functions - no side effects
function addHighlight(highlights: PassageHighlight[], passage: Passage, colorId: string): PassageHighlight[]
function removeHighlight(highlights: PassageHighlight[], passage: Passage): PassageHighlight[]
function toggleHighlight(highlights: PassageHighlight[], passage: Passage, colorId: string): PassageHighlight[]
function getHighlightForVerse(highlights: PassageHighlight[], book: number, chapter: number, verse: number): PassageHighlight | undefined
```

---

## 5. Adapters Package (`@jota/adapters`)

### 5.1 Adapter Interfaces

```typescript
// Storage adapter interface
interface StorageAdapter {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
}

// Network adapter interface
interface NetworkAdapter {
  fetch<T>(url: string, options?: RequestOptions): Promise<T>
  isOnline(): boolean
}

// Audio adapter interface
interface AudioAdapter {
  play(url: string): void
  pause(): void
  stop(): void
  setVolume(volume: number): void
}

// Platform adapter interface
interface PlatformAdapter {
  copyToClipboard(text: string): Promise<void>
  getLocale(): string
  openUrl(url: string): void
}
```

### 5.2 Web Adapters

| Adapter | Implementation | File |
|---------|----------------|------|
| `WebStorageAdapter` | localStorage wrapper | `web/local-storage-adapter.ts` |
| `IndexedDBAdapter` | IndexedDB for large data | `web/indexed-db-adapter.ts` |
| `WebNetworkAdapter` | Fetch API wrapper | `web/http-adapter.ts` |
| `WebAudioAdapter` | Web Audio API | `web/web-audio-adapter.ts` |
| `WebPlatformAdapter` | Browser APIs | `web/web-platform-adapter.ts` |
| `ClipboardAdapter` | Clipboard API | `web/clipboard-adapter.ts` |
| `KeyboardAdapter` | Keyboard events | `web/keyboard-adapter.ts` |

### 5.3 Memory/Mock Adapters

For testing without browser APIs:
- `MemoryStorageAdapter`
- `MockNetworkAdapter`
- `MockAudioAdapter`
- `MockPlatformAdapter`

---

## 6. Web Application (`apps/web`)

### 6.1 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Vue 3 | 3.4.x | UI framework |
| Quasar | 2.18.x | Component library |
| Pinia | 2.1.x | State management |
| Vue Router | 4.3.x | Routing |
| Vue I18n | 9.13.x | Internationalization |
| VueUse | 10.9.x | Composition utilities |
| TypeScript | 5.5.x | Type safety |
| Vite | 5.2.x | Build tool |

### 6.2 State Management (Pinia Stores)

```
┌──────────────────────────────────────────────────────────────────┐
│                        STORE ARCHITECTURE                        │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ settings-store  │────▶│ translation-    │────▶│  search-store   │
│                 │     │ store           │     │                 │
│ - persist       │     │                 │     │ - fragments     │
│ - app settings  │     │ - translations  │     │ - chapterFrag   │
│ - locale data   │     │ - currentKey    │     │ - input         │
│ - format tpls   │     │ - currentContent│     │ - layout        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ highlight-store │◀───▶│    @jota/core   │◀────│   UI Components │
│                 │     │ Business Logic  │     │                 │
│ - highlights    │     │                 │     │ - ChapterContent│
│ - config        │     │ - search        │     │ - ReferencePicker
│ - colors        │     │ - format        │     │ - HighlightBtn  │
└─────────────────┘     │ - highlight     │     └─────────────────┘
                        └─────────────────┘
```

### 6.3 Store Responsibilities

| Store | Responsibility | Persistence |
|-------|----------------|-------------|
| `settings-store` | App configuration, locale, format templates | localStorage |
| `translation-store` | Translation selection, content loading | localStorage (selection only) |
| `search-store` | Search state, navigation, current position | None (session only) |
| `highlight-store` | Highlights, colors, import/export | localStorage |
| `main-store` | General app state | None |

### 6.4 Data Persistence

```typescript
// Using VueUse's useStorage for reactive localStorage
const persist = useStorage(
  LOCAL_STORAGE_KEY + '.settings',
  initialValue,
  localStorage,
  { deep: true }
)

// LocalStorage Keys
const LOCAL_STORAGE_KEY = 'jota-app'
// - jota-app.settings   → Settings persist
// - jota-app.highlights → Highlight data
```

---

## 7. Data Flow

### 7.1 Translation Loading Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TRANSLATION LOADING FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

[App Start]
     │
     ▼
┌──────────────────┐
│ Read settings    │
│ from localStorage│
└──────────────────┘
     │
     ▼
┌──────────────────┐
│ Get default      │
│ translation key  │
└──────────────────┘
     │
     ▼
┌──────────────────┐       ┌──────────────────┐
│ Fetch JSON from  │──────▶│ public/data/     │
│ /data/{locale}/  │       │ {locale}/{sym}.  │
│ {symbol}.json    │       │ json             │
└──────────────────┘       └──────────────────┘
     │
     ▼
┌──────────────────┐
│ Parse response   │
│ Detect format    │
│ (array vs map)   │
└──────────────────┘
     │
     ▼
┌──────────────────┐
│ Store in         │
│ translation.     │
│ content.value    │
└──────────────────┘
     │
     ▼
[Ready to render]
```

### 7.2 Search Data Flow

```
[User Input: "John 3:16"]
         │
         ▼
[search-store.findByInput()]
         │
         ▼
[jota-parser.parse()]
         │
         ▼
┌─────────────────────┐
│ Parsed as reference?│
└─────────────────────┘
    │           │
   Yes          No
    │           │
    ▼           ▼
[Resolve to   [Text search
 passages]     through content]
    │           │
    └─────┬─────┘
          │
          ▼
[Set fragments array]
          │
          ▼
[Update chapterFragment]
          │
          ▼
[Trigger UI update]
```

---

## 8. Build Configuration

### 8.1 Package Builds

```yaml
# packages/core
Build: tsup (ESM + CJS)
Entry: src/index.ts
Output: dist/

# packages/adapters
Build: tsup (ESM + CJS)
Entry: src/index.ts
Output: dist/

# apps/web
Build: Quasar CLI (Vite)
Entry: src/
Output: dist/spa/
```

### 8.2 TypeScript Configuration

```json
// tsconfig.base.json (shared)
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true
  }
}
```

---

## 9. Deployment Architecture

### 9.1 Current Deployment

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    GitHub       │     │   GitHub        │     │  Production     │
│    Repository   │────▶│   Actions       │────▶│  Server         │
└─────────────────┘     │                 │     │                 │
                        │ - Build         │     │ netanel.pl/jota │
                        │ - Test          │     │                 │
                        │ - Deploy        │     │ Static files    │
                        └─────────────────┘     │ served via      │
                                                │ Nginx           │
                                                └─────────────────┘
```

### 9.2 Environments

| Environment | URL | Trigger |
|-------------|-----|---------|
| QA | jota-next.netanel.pl/jota/ | Auto on push to main |
| Production | netanel.pl/jota/ | Manual promotion |

### 9.3 Multi-Domain Support

```javascript
// public/domain-handler.js
// Detects domain and configures base path
// - Main domain: netanel.pl/jota/ (subdirectory)
// - Subdomains: bible.netanel.pl, etc. (root path)
```

---

## 10. Testing Architecture

### 10.1 Unit Tests (Vitest)

```
apps/web/test/vitest/
├── __tests__/
│   ├── format.test.ts
│   ├── highlighter.test.ts
│   ├── translation-utils.test.ts
│   └── ...
└── setup-file.ts
```

### 10.2 E2E Tests (Cypress)

```
apps/web/test/cypress/
├── e2e/
│   ├── search.cy.ts
│   ├── highlighting.cy.ts
│   ├── settings.cy.ts
│   └── CypressHelper.ts
└── support/
```

---

## 11. Security Considerations

### 11.1 Data Security

| Aspect | Implementation |
|--------|----------------|
| User data | Stored in browser localStorage only |
| No backend | No server-side data storage |
| No auth | No user accounts required |
| Translation data | Public, read-only JSON files |

### 11.2 Content Security

- No external scripts loaded
- No cookies (localStorage only)
- No tracking or analytics (currently)
- HTTPS enforced in production

---

## 12. Performance Considerations

### 12.1 Optimization Strategies

| Strategy | Implementation |
|----------|----------------|
| Lazy loading | Translations loaded on-demand |
| Shallow refs | Large data uses `shallowRef` |
| Computed caching | Heavy computations are cached |
| Virtual scrolling | (Potential future improvement) |
| Code splitting | Route-based code splitting |

### 12.2 Bundle Size Management

- Tree shaking enabled
- Dynamic imports for routes
- Quasar components imported selectively
- External dependencies minimized

---

## 13. Future Architecture Considerations

### 13.1 Planned Additions (from Phase 3 docs)

```
Future Structure:
apps/
├── web/        # Current
├── desktop/    # Electron app (planned)
├── server/     # API server (planned)
├── admin/      # Admin interface (planned)
├── cli/        # CLI tools (planned)
└── mobile/     # React Native (planned)
```

### 13.2 Mobile Architecture

For React Native mobile app:
- Reuse `@jota/core` entirely
- Create `@jota/adapters-mobile` for:
  - AsyncStorage (storage)
  - React Native FS (file access)
  - react-native-sound (audio)
  - Native clipboard
- UI built fresh with React Native components

---

## Architecture Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Core | TypeScript | Business logic, types |
| Adapters | TypeScript | Platform abstraction |
| State | Pinia | Reactive state management |
| UI | Vue 3 + Quasar | User interface |
| Build | Vite + tsup | Bundling, transpilation |
| Test | Vitest + Cypress | Unit + E2E testing |
| Deploy | GitHub Actions | CI/CD automation |

---

## Next Steps

1. See `04-issues-and-roadmap.md` for improvement opportunities
2. See Phase 0-3 planning documents for future architecture evolution
