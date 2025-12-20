# Phase 2: Web Application Refactoring

## Overview

This phase refactors the existing Quasar web application to use the new core library and adapter system while maintaining all current functionality. The focus is on creating a clean separation between business logic and UI framework, making the UI layer as thin as possible and enabling future migration to other frameworks like React/ShadCN if desired.

## Goals

- Refactor existing web app to use core library and adapters
- Minimize UI framework dependencies in business logic
- Create framework-agnostic UI layer abstractions
- Maintain 100% feature parity with current application
- Prepare for potential framework migration
- Optimize performance and bundle size

## Architecture Changes

### Before (Current)
```
Vue Components
    ↓
Pinia Stores ← Direct → Logic Files
    ↓              ↓
localStorage   Direct DOM API
```

### After (Target)
```
Vue Components (UI Only)
    ↓
UI State Managers (Vue-specific)
    ↓
Core State Stores (Framework-agnostic)
    ↓
Core Library (Business logic)
    ↓
Adapters (Platform abstraction)
    ↓
Platform APIs (Storage, Network, etc.)
```

## Package Structure

```
apps/web/                           # Refactored web application
├── src/
│   ├── components/                # Vue UI components (thin layer)
│   │   ├── bible/                 # Bible-related components
│   │   ├── search/                # Search UI components  
│   │   ├── settings/              # Settings UI components
│   │   ├── shared/                # Shared UI components
│   │   └── layout/                # Layout components
│   ├── composables/               # Vue composition functions
│   │   ├── useBible.ts           # Bible data access
│   │   ├── useSearch.ts          # Search functionality
│   │   ├── useSettings.ts        # Settings management
│   │   ├── useHighlights.ts      # Highlighting features
│   │   └── useAudio.ts           # Audio playback
│   ├── stores/                    # Vue/Pinia bridges to core stores
│   │   ├── bible-store.ts        # Bridge to core Bible store
│   │   ├── search-store.ts       # Bridge to core search store
│   │   ├── settings-store.ts     # Bridge to core settings store
│   │   └── highlight-store.ts    # Bridge to core highlight store
│   ├── services/                  # Service layer abstractions
│   │   ├── app-service.ts        # Main application service
│   │   ├── bible-service.ts      # Bible-related operations
│   │   ├── search-service.ts     # Search operations
│   │   └── platform-service.ts   # Platform-specific operations
│   ├── adapters/                  # Web-specific adapter configuration
│   │   └── web-adapter-config.ts # Adapter setup for web
│   ├── router/                    # Vue Router (unchanged)
│   ├── i18n/                     # Internationalization (minimal changes)
│   ├── css/                      # Styling (unchanged)
│   └── App.vue                   # Main app component
├── public/                        # Static assets (unchanged)
├── package.json                   # Web app dependencies
└── quasar.config.js              # Quasar configuration
```

## Tasks

### 1. Setup Web App Package Structure

#### 1.1 Reorganize Current Files
- [ ] Move current app to `apps/web/`
- [ ] Update import paths throughout application
- [ ] Update build configurations
- [ ] Test that current app still works

#### 1.2 Update Dependencies
- [ ] Add core library dependency: `@jota/core`
- [ ] Add adapters dependency: `@jota/adapters`
- [ ] Add state library dependency: `@jota/state`
- [ ] Update package.json scripts
- [ ] Update TypeScript configuration

### 2. Create Service Layer

#### 2.1 Application Service
Create `src/services/app-service.ts`:
```typescript
export class AppService {
  private core: JotaCore
  private adapters: AdapterSuite
  
  constructor(config: AppConfig) {
    this.adapters = AdapterFactory.createAdapterSuite(config.adapters)
    this.core = new JotaCore(this.adapters)
  }
  
  async initialize(): Promise<void>
  async shutdown(): Promise<void>
  
  // Expose service modules
  get bible(): BibleService
  get search(): SearchService
  get settings(): SettingsService
  get highlights(): HighlightService
  get audio(): AudioService
}
```

#### 2.2 Bible Service
Create `src/services/bible-service.ts`:
- [ ] Wrap core Bible functionality
- [ ] Handle translation loading and caching
- [ ] Provide reactive data for Vue components
- [ ] Handle error states and loading indicators
- [ ] Manage translation metadata and bookmarks

#### 2.3 Search Service  
Create `src/services/search-service.ts`:
- [ ] Wrap core search functionality
- [ ] Handle search history
- [ ] Provide search suggestions
- [ ] Manage search state and results
- [ ] Handle search performance optimization

#### 2.4 Settings Service
Create `src/services/settings-service.ts`:
- [ ] Wrap core settings functionality
- [ ] Handle settings validation
- [ ] Provide reactive settings for UI
- [ ] Manage settings import/export
- [ ] Handle settings migration

### 3. Create Vue Composables

#### 3.1 Bible Composables
Create `src/composables/useBible.ts`:
```typescript
export function useBible() {
  const service = inject<AppService>('appService')
  
  // Reactive state
  const translations = ref<Translation[]>([])
  const currentPassage = ref<Passage | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Actions
  const loadTranslation = async (key: TranslationKey) => {}
  const selectPassage = (passage: Passage) => {}
  const getVerseContent = (passage: Passage) => {}
  
  // Computed values
  const availableTranslations = computed(() => {})
  const currentContent = computed(() => {})
  
  return {
    translations: readonly(translations),
    currentPassage: readonly(currentPassage),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadTranslation,
    selectPassage,
    getVerseContent,
    availableTranslations,
    currentContent
  }
}
```

#### 3.2 Search Composables
Create `src/composables/useSearch.ts`:
- [ ] Reactive search state
- [ ] Search execution and results
- [ ] Search history management
- [ ] Reference parsing and validation
- [ ] Search suggestions and autocomplete

#### 3.3 Settings Composables
Create `src/composables/useSettings.ts`:
- [ ] Reactive settings state
- [ ] Settings validation and updates
- [ ] Theme and appearance management
- [ ] Locale and translation preferences
- [ ] Export and import functionality

#### 3.4 Highlights Composables
Create `src/composables/useHighlights.ts`:
- [ ] Reactive highlight state
- [ ] Highlight creation and management
- [ ] Color palette management
- [ ] Highlight export and sharing
- [ ] Highlight search and filtering

#### 3.5 Audio Composables
Create `src/composables/useAudio.ts`:
- [ ] Audio playback state
- [ ] Playback controls
- [ ] Audio loading and buffering
- [ ] Playlist management
- [ ] Audio settings and preferences

### 4. Create Pinia Bridge Stores

#### 4.1 Bible Store Bridge
Create `src/stores/bible-store.ts`:
```typescript
export const useBibleStore = defineStore('bible', () => {
  const appService = inject<AppService>('appService')
  const bible = useBible()
  
  // Bridge reactive state from core to Vue
  const state = reactive({
    translations: bible.translations,
    currentPassage: bible.currentPassage,
    isLoading: bible.isLoading,
    error: bible.error
  })
  
  // Actions that delegate to service layer
  const actions = {
    loadTranslation: bible.loadTranslation,
    selectPassage: bible.selectPassage,
    // ... other actions
  }
  
  // Getters
  const getters = {
    availableTranslations: bible.availableTranslations,
    currentContent: bible.currentContent,
    // ... other computed values
  }
  
  return { ...state, ...actions, ...getters }
})
```

#### 4.2 Other Store Bridges
- [ ] `search-store.ts` - Bridge to core search functionality
- [ ] `settings-store.ts` - Bridge to core settings functionality  
- [ ] `highlight-store.ts` - Bridge to core highlight functionality
- [ ] Remove direct business logic from all stores
- [ ] Make stores thin bridges to service layer

### 5. Refactor Vue Components

#### 5.1 Main Page Component
Update `src/pages/MainPage.vue`:
- [ ] Remove direct store dependencies
- [ ] Use composables instead of direct store access
- [ ] Remove business logic from component
- [ ] Focus only on UI state and user interactions
- [ ] Ensure proper error boundaries and loading states

#### 5.2 Bible Content Components
Refactor `src/components/BibleContent.vue` and related components:
- [ ] Use `useBible()` composable
- [ ] Remove direct translation data manipulation
- [ ] Focus on rendering and user interaction
- [ ] Handle loading and error states properly
- [ ] Optimize for performance with large content

#### 5.3 Search Components
Refactor search-related components:
- [ ] Use `useSearch()` composable  
- [ ] Remove search logic from components
- [ ] Focus on search UI and result display
- [ ] Implement proper debouncing and cancellation
- [ ] Handle search performance optimization

#### 5.4 Settings Components
Refactor settings components:
- [ ] Use `useSettings()` composable
- [ ] Remove settings validation from UI
- [ ] Focus on form rendering and user input
- [ ] Handle settings persistence transparently
- [ ] Implement proper form validation display

#### 5.5 Highlight Components
Refactor highlight-related components:
- [ ] Use `useHighlights()` composable
- [ ] Remove highlighting logic from UI
- [ ] Focus on highlight visualization
- [ ] Handle color picker and management UI
- [ ] Implement highlight selection and editing

### 6. Update Router and Navigation

#### 6.1 Router Configuration
Update `src/router/index.ts`:
- [ ] Remove route-level business logic
- [ ] Add route guards for initialization
- [ ] Handle service availability in routes
- [ ] Implement proper loading states
- [ ] Add error boundaries for route failures

#### 6.2 Navigation Guards
- [ ] Ensure services are initialized before routing
- [ ] Handle authentication state (if applicable)
- [ ] Manage deep linking and state restoration
- [ ] Handle offline/online routing scenarios

### 7. Update Build Configuration

#### 7.1 Vite/Quasar Configuration
Update `quasar.config.js`:
- [ ] Configure package resolution for monorepo
- [ ] Update build optimization for new structure
- [ ] Configure tree shaking for core library
- [ ] Add source maps for debugging
- [ ] Configure chunk splitting for optimal loading

#### 7.2 TypeScript Configuration
Update `tsconfig.json`:
- [ ] Add path mapping for new packages
- [ ] Configure module resolution
- [ ] Add type checking for service layer
- [ ] Ensure proper import/export handling

### 8. Application Initialization

#### 8.1 App Initialization
Update `src/main.ts`:
```typescript
import { createApp } from 'vue'
import { createAppService } from './services/app-service'
import { webAdapterConfig } from './adapters/web-adapter-config'

async function initializeApp() {
  const app = createApp(App)
  
  // Initialize core services
  const appService = new AppService(webAdapterConfig)
  await appService.initialize()
  
  // Provide service to all components
  app.provide('appService', appService)
  
  // Initialize Vue ecosystem
  app.use(createPinia())
  app.use(router)
  app.use(i18n)
  
  app.mount('#app')
}

initializeApp().catch(console.error)
```

#### 8.2 Service Provider Pattern
- [ ] Create proper dependency injection
- [ ] Handle service lifecycle management
- [ ] Implement graceful shutdown
- [ ] Add service health monitoring
- [ ] Handle service restart scenarios

### 9. Testing Strategy

#### 9.1 Component Testing
- [ ] Test components in isolation from services
- [ ] Mock service dependencies
- [ ] Test component rendering and user interactions
- [ ] Test error states and edge cases
- [ ] Ensure accessibility compliance

#### 9.2 Integration Testing
- [ ] Test service integration with components
- [ ] Test complete user workflows
- [ ] Test adapter switching scenarios
- [ ] Test offline/online transitions
- [ ] Performance regression testing

#### 9.3 E2E Testing
- [ ] Update existing Cypress tests
- [ ] Test with different adapter configurations
- [ ] Test migration scenarios
- [ ] Test cross-browser compatibility
- [ ] Test mobile responsive design

### 10. Performance Optimization

#### 10.1 Bundle Optimization
- [ ] Implement code splitting at service boundaries
- [ ] Optimize core library bundle size
- [ ] Configure lazy loading for translations
- [ ] Implement service worker for caching
- [ ] Add performance monitoring

#### 10.2 Runtime Optimization
- [ ] Optimize component rendering
- [ ] Implement virtual scrolling for large lists
- [ ] Add memoization for expensive operations
- [ ] Optimize Bible content rendering
- [ ] Implement progressive loading

### 11. Migration Strategy

#### 11.1 Gradual Migration
- [ ] Phase 1: Extract services while keeping current UI
- [ ] Phase 2: Replace stores with bridges
- [ ] Phase 3: Refactor components to use composables
- [ ] Phase 4: Remove old business logic
- [ ] Phase 5: Optimize and clean up

#### 11.2 Feature Flags
- [ ] Add feature flags for new architecture
- [ ] Allow rollback to old implementation
- [ ] Gradual rollout to users
- [ ] A/B testing for performance comparison
- [ ] Monitor user experience metrics

## Framework Migration Preparation

### 12.1 Framework Abstraction
To prepare for potential React/ShadCN migration:
- [ ] Keep all business logic in service layer
- [ ] Use standard web APIs instead of Vue-specific features
- [ ] Create framework-agnostic component interfaces
- [ ] Document component contracts and APIs
- [ ] Ensure state management is framework-independent

### 12.2 UI Component Library Abstraction
- [ ] Create thin wrappers around Quasar components
- [ ] Define standard component props and events
- [ ] Document design system components
- [ ] Create component migration mapping
- [ ] Prepare React component equivalents

## Success Criteria

- [ ] All current features work exactly as before
- [ ] Performance is equal or better than current implementation
- [ ] Bundle size doesn't increase significantly
- [ ] Code is much more maintainable and testable
- [ ] Business logic is completely separated from UI
- [ ] Components are thin and focused only on UI
- [ ] Easy to test and debug
- [ ] Framework migration is feasible
- [ ] Adapter switching works seamlessly

## Implementation Timeline

1. **Setup and reorganization** (3-4 days)
2. **Create service layer** (4-5 days)
3. **Create composables** (3-4 days)
4. **Create store bridges** (2-3 days)
5. **Refactor components** (6-8 days)
6. **Update build and configuration** (2-3 days)
7. **Testing and optimization** (4-5 days)
8. **Performance tuning** (2-3 days)

## Risk Mitigation

1. **Gradual Migration**: Implement changes incrementally
2. **Feature Flags**: Allow rollback if issues arise
3. **Comprehensive Testing**: Ensure no functionality is lost
4. **Performance Monitoring**: Track metrics throughout migration
5. **User Feedback**: Monitor user experience during rollout

This phase transforms the web application into a thin UI layer that leverages the powerful core library while maintaining all existing functionality and preparing for future architectural flexibility.