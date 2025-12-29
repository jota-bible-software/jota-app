# Jota Bible App - Feature Inventory

**Document Version**: 1.0
**Last Updated**: December 2024
**Source**: Code analysis of `apps/web/src/`

---

## 1. Bible Reading

### 1.1 Translation Management
**Source**: `stores/translation-store.ts`, `components/BibleSelector.vue`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Multi-translation support | 100+ Bible translations across 20+ languages | `translationsData` with locale-based grouping |
| Translation selection | Select/deselect translations per locale | `setTranslationSelection()` |
| Default translation per locale | Each locale has its own default | `setDefaultTranslation()` |
| Lazy loading | Translations loaded on-demand | `fetchTranslationContent()` |
| Dual data format support | Both 3D array and map formats | `TranslationContentArray`, `TranslationContentMap` |
| Translation metadata | Title, year, book names, size | `TranslationMeta` type |

**Supported Locales**:
- `en-US` - English (US)
- `pl-PL` - Polish
- `pt-BR` - Portuguese (Brazil)

**Translation Count by Locale** (from data files):
- Polish: 30+ translations
- English: 30+ translations
- Portuguese: 4+ translations
- German, Spanish, French, Hebrew, Greek, and many more

### 1.2 Chapter Navigation
**Source**: `stores/search-store.ts`, `components/ChapterContent.vue`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Book/chapter picker | Modal picker for navigation | `ReferencePicker.vue` |
| Previous/next chapter | Navigate between chapters | `goToAdjacentChapter()` |
| Previous/next verse | Navigate between verses | `goToAdjacentVerse()` |
| Verse selection | Select individual or range of verses | `selectInChapter()` |
| Scroll to verse | Auto-scroll to selected verse | `scrollToIndex` ref |
| Chapter caption | Display current location | `chapterCaption` computed |

### 1.3 Display Options
**Source**: `stores/settings-store.ts`

| Setting | Type | Description |
|---------|------|-------------|
| `fontSize` | number | Text size (default: 16) |
| `screenMode` | 'dark' \| 'light' \| 'auto' | Theme mode |
| `inlineVerseNumbers` | boolean | Show verse numbers inline |
| `superscriptVerseNumbers` | boolean | Superscript verse numbers |
| `continuousVerses` | boolean | Continuous reading mode |
| `underlineVerseHighlight` | boolean | Underline highlighted verses |

---

## 2. Search

### 2.1 Reference Parsing
**Source**: `logic/jota.ts`, `packages/core/src/search/parser.ts`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Multi-format reference parsing | "John 3:16", "J 3,16", "Jana 3:16" | `jota-parser` library |
| Multi-locale support | Parse in different languages | Parser locale configuration |
| Range support | "John 3:16-20", "Gen 1-3" | Native parser support |
| Multiple references | "John 3:16; Romans 8:28" | Semicolon-separated parsing |
| Reference validation | Validate against book/chapter limits | `reference-resolver.ts` |

### 2.2 Text Search
**Source**: `stores/search-store.ts`, `logic/jota.ts`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Full-text search | Search within Bible content | `findByInput()` |
| Whole words toggle | Match whole words only | `words` ref |
| Regex support | Prefix with `/` for regex | Pattern detection |
| Progress indicator | Show search progress | `progress` ref |
| Result highlighting | Highlight search terms in results | `highlightSearchTerm()` |
| Sort and deduplicate | Optional result sorting | `sortAndDeduplicate()` |

### 2.3 Search Results Display
**Source**: `stores/search-store.ts`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Split layout | Results + context view | `layout: 'split'` |
| Formatted layout | Results only | `layout: 'formatted'` |
| Result navigation | Move between results | `moveFragmentIndex()` |
| Read in context | Jump to full chapter | `readInContext()` |
| Result count | Display number of matches | `fragments.length` |

---

## 3. Highlighting

### 3.1 Highlight Management
**Source**: `stores/highlight-store.ts`, `logic/highlighter.ts`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Translation-specific highlights | Each translation has own highlights | `byTranslation` map |
| Enable/disable per translation | Toggle highlighting per translation | `highlightsEnabled` |
| Verse range highlighting | Highlight single or multiple verses | `addHighlight()` |
| Toggle highlight | Add or remove highlight | `toggleHighlight()` |
| Highlight overlap handling | Smart merge of overlapping ranges | `hlAddHighlight()` |

### 3.2 Color Management
**Source**: `stores/highlight-store.ts`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| 8 default colors | Yellow, Green, Blue, Orange, Pink, Purple, Red, Gray | `defaultHighlightColors` |
| Add custom color | Create new highlight color | `addColor()` |
| Remove color | Delete color and associated highlights | `removeColor()` |
| Update color | Change name or hex value | `updateColor()` |
| Reorder colors | Drag to reorder palette | `reorderColors()` |
| Active color | Currently selected for quick apply | `config.active` |

**Default Colors**:
```
Yellow (#ffeb3b) - Study
Green (#4caf50) - Promises
Blue (#2196f3) - Commands
Orange (#ff9800) - Prayer
Pink (#e91e63) - Important
Purple (#9c27b0) - Prophecy
Red (#f44336) - Warnings
Gray (#9e9e9e) - Notes
```

### 3.3 Import/Export
**Source**: `stores/highlight-store.ts`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Export to JSON | Download highlights file | `exportHighlights()` |
| Import from JSON | Load highlights file | `importHighlights()` |
| Legacy format support | Migration from old format | `HighlightsLegacy` type |
| Merge on import | Add to existing highlights | Merge logic in import |
| Reset to defaults | Clear all and restore defaults | `resetToDefaults()` |

### 3.4 Storage Management
**Source**: `stores/highlight-store.ts`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Storage info | Show usage statistics | `getStorageInfo()` |
| Quota monitoring | Detect storage limits | `isQuotaExceededError()` |
| Per-translation count | Highlight count badges | `getHighlightCountForTranslation()` |

---

## 4. Formatting & Copy

### 4.1 Format Templates
**Source**: `components/SettingsFormatTemplates.vue`, `logic/format.ts`

| Setting | Options | Description |
|---------|---------|-------------|
| `referencePosition` | 'before' \| 'after' | Where to place reference |
| `referenceLine` | 'same line' \| 'new line' | Reference line position |
| `translationAbbreviation` | 'none' \| 'lowercase' \| 'uppercase' | Translation display |
| `numbers` | boolean | Show verse numbers |
| `verseNewLine` | boolean | Each verse on new line |
| `separatorChar` | string | Chapter:verse separator |
| `rangeChar` | string | Verse range separator |
| `referenceCharsBefore/After` | string | Reference wrapping |
| `quoteCharsBefore/After` | string | Quote wrapping |
| `verseNumberCharsBefore/After` | string | Verse number wrapping |

### 4.2 Copy Templates
**Source**: `components/SettingsCopyTemplates.vue`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Multiple templates | Create named copy templates | `CopyTemplateData` type |
| Default template per locale | Auto-select for locale | `defaultCopyTemplate` |
| Format + naming combo | Combine format and book naming | `formatTemplate`, `bookNaming` |
| Live preview | See sample output | `formattedSample()` |

### 4.3 Copy Actions
**Source**: `stores/search-store.ts`, `components/CopyButton.vue`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Copy found passages | Copy all search results | `formatFound()` |
| Copy selected passage | Copy current selection | `formatSelectedPassage()` |
| Clipboard integration | Write to system clipboard | Web Clipboard API |
| Success notification | Confirm copy action | Quasar notify |

---

## 5. Book Naming

### 5.1 Naming Schemes
**Source**: `components/SettingsBookNames.vue`, `data/localeData`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Multiple naming schemes | Full, abbreviated, custom | `BookNamingV2` type |
| Per-locale naming | Each locale has own schemes | `LocaleNaming` |
| Default naming per locale | Auto-select for locale | `naming.default` |
| Custom naming creation | User-defined book names | Settings UI |

**Book Name Arrays**: 66 book names per scheme (Genesis to Revelation)

---

## 6. Audio

### 6.1 Audio Playback
**Source**: `components/AudioPlayer.vue`, `packages/core/src/audio/`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Audio toggle | Play/pause button | `toggleAudio()` |
| Chapter audio | Audio for current chapter | Audio URL generation |
| Audio on/off state | Track playback state | `audioOn` ref |

---

## 7. Settings

### 7.1 Settings Categories
**Source**: `pages/SettingsPage.vue`

| Tab | Component | Features |
|-----|-----------|----------|
| General | `SettingsGeneral.vue` | Locale, reference picker, storage info |
| Appearance | `SettingsAppearance.vue` | Font size, theme, verse display options |
| Highlights | `SettingsHighlight.vue` | Color management, import/export |
| Translations | `SettingsTranslations.vue` | Translation selection, defaults |
| Book Names | `SettingsBookNames.vue` | Naming schemes |
| Format Templates | `SettingsFormatTemplates.vue` | Passage formatting |
| Copy Templates | `SettingsCopyTemplates.vue` | Copy presets |
| Import/Export | `SettingsImportExport.vue` | Backup/restore |

### 7.2 Settings Persistence
**Source**: `stores/settings-store.ts`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| LocalStorage persistence | Settings survive refresh | `useStorage()` from VueUse |
| Version migration | Upgrade old settings | `migrateSettings()` |
| Reset to defaults | Restore initial state | `reset()` |

---

## 8. Internationalization (i18n)

### 8.1 UI Localization
**Source**: `i18n/`, `boot/i18n.ts`

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Multi-language UI | Interface in multiple languages | Vue I18n |
| Auto-detect locale | Detect browser language | `getDefaultLocale()` |
| Locale switcher | Change UI language | `LocaleSelector.vue` |

**Supported UI Locales**:
- `en-US` - English
- `pl-PL` - Polish
- `pt-BR` - Portuguese

---

## 9. UI Components

### 9.1 Core Components
**Source**: `components/`

| Component | Purpose |
|-----------|---------|
| `MainPage.vue` | Main reading/search interface |
| `BibleContent.vue` | Display Bible text |
| `ChapterContent.vue` | Chapter display with verse selection |
| `ReferencePicker.vue` | Book/chapter selection modal |
| `BibleSelector.vue` | Translation dropdown |
| `MessageLine.vue` | Status/error messages |

### 9.2 Settings Components
| Component | Purpose |
|-----------|---------|
| `SettingsPanel.vue` | Settings container |
| `SettingsGeneral.vue` | General settings |
| `SettingsAppearance.vue` | Visual settings |
| `SettingsHighlight.vue` | Highlight settings |
| `SettingsTranslations.vue` | Translation settings |
| `SettingsBookNames.vue` | Book naming |
| `SettingsFormatTemplates.vue` | Format templates |
| `SettingsCopyTemplates.vue` | Copy templates |
| `SettingsImportExport.vue` | Backup/restore |

### 9.3 Highlight Components
| Component | Purpose |
|-----------|---------|
| `HighlightButton.vue` | Quick highlight action |
| `HighlightPalette.vue` | Color selection |
| `HighlightColorManager.vue` | Color CRUD |
| `HighlightSettings.vue` | Highlight configuration |

---

## 10. Data Layer

### 10.1 State Management (Pinia Stores)
**Source**: `stores/`

| Store | Purpose | Key State |
|-------|---------|-----------|
| `search-store` | Search and navigation | `fragments`, `chapterFragment`, `input` |
| `settings-store` | App configuration | `persist`, `currentLocale` |
| `translation-store` | Bible translations | `translations`, `currentContent` |
| `highlight-store` | Verse highlights | `highlights`, `config` |
| `main-store` | General app state | (minimal) |

### 10.2 Data Formats
**Source**: `types.ts`

| Type | Description |
|------|-------------|
| `Passage` | `[book, chapter, startVerse?, endVerse?]` - 0-indexed |
| `TranslationContentArray` | `string[][][]` - 3D array format |
| `TranslationContentMap` | Nested objects with numbered keys |
| `PassageHighlight` | `{ passage, highlightColorId }` |

---

## 11. Technical Infrastructure

### 11.1 Build & Deployment
**Source**: Root config files

| Technology | Purpose |
|------------|---------|
| Vue 3 | UI framework |
| Quasar | UI component library |
| Vite | Build tool |
| TypeScript | Type safety |
| Pinia | State management |
| Vue Router | Navigation |
| Vue I18n | Internationalization |

### 11.2 Testing
| Type | Tool | Location |
|------|------|----------|
| Unit tests | Vitest | `test/vitest/` |
| E2E tests | Cypress | `test/cypress/` |

### 11.3 Monorepo Structure
**Source**: `pnpm-workspace.yaml`

```
packages/
├── core/       # Business logic (framework-agnostic)
├── adapters/   # Platform adapters (web, memory)
apps/
└── web/        # Quasar web application
```

---

## Feature Summary

| Category | Feature Count | Complexity |
|----------|---------------|------------|
| Bible Reading | 12 | Medium |
| Search | 12 | High |
| Highlighting | 15 | High |
| Formatting | 10 | Medium |
| Settings | 20+ | Medium |
| i18n | 5 | Low |

**Total Features**: ~75 distinct features

---

## Next Steps

1. See `02-user-flows.md` for user journey documentation
2. See `03-architecture.md` for technical architecture details
3. See `04-issues-and-roadmap.md` for known issues and planned features
