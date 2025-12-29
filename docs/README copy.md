# Jota Bible App - Mobile App Development Plan

> **Action**: Save this plan to `docs/README.md` as the master documentation index

---

## Status Overview

### PHASE A: Documentation & Research - COMPLETED

All 40+ documentation files have been created covering:
- App functionality audit (4 docs)
- Competitive research (6 docs)
- Mobile best practices (5 docs)
- User stories & requirements (4 docs)
- Information architecture (3 docs)
- Core flow wireframes (5 docs)
- Advanced feature wireframes (5 docs)
- Interaction specifications (3 docs)
- Design system foundation (4 docs)
- Implementation recommendations (3 docs)

**Location**: All files in `docs/` directory

---

### PHASE B: Mobile App Implementation - NEXT

## Step 1: Visual Design (Before Code)

Convert ASCII wireframes to high-fidelity visual designs.

**Options:**
| Approach | Recommendation |
|----------|----------------|
| Hire UI designer | Best for custom brand, professional polish |
| Figma + UI kit | Fast iteration, cost-effective |
| React Native UI kit | Quickest to code, less unique |

**Priority Screens for Design:**
1. Bible Reader (core experience)
2. Book/Chapter picker
3. Search
4. Highlight color picker
5. Onboarding flow

**Recommended UI Libraries:**
- Tamagui (great DX, performant)
- NativeWind (Tailwind for RN)
- Gluestack (accessible, customizable)

---

## Step 2: Project Setup

```bash
# Option A: React Native CLI (recommended for full control)
npx react-native init JotaMobile --template react-native-template-typescript

# Option B: Expo (faster start)
npx create-expo-app JotaMobile -t expo-template-blank-typescript
```

**Core Dependencies:**
- @react-navigation/native (navigation)
- zustand (state management)
- @tanstack/react-query (data fetching)
- react-native-reanimated (animations)
- @shopify/flash-list (performant lists)

**Link @jota/core:**
- Integrate existing packages/core for Bible logic
- Create mobile storage adapter in packages/adapters

---

## Step 3: MVP Build Order

### Week 1-2: Foundation
- [ ] Project initialization
- [ ] Navigation skeleton (tabs + stacks)
- [ ] Theme provider (light/dark from docs/design-system/02-colors.md)
- [ ] Core components (Button, Card, Text)
- [ ] Integrate @jota/core package

### Week 3-4: Core Reading
- [ ] Bible Reader screen
- [ ] Chapter loading & display
- [ ] Book/Chapter picker
- [ ] Swipe navigation between chapters
- [ ] Translation selector

### Week 5-6: Essential Features
- [ ] Search (reference + text)
- [ ] Basic settings
- [ ] Font size controls
- [ ] Theme switching

### Week 7-8: Polish & Beta
- [ ] Animations & gestures
- [ ] Haptic feedback
- [ ] Loading states (skeletons)
- [ ] Error handling
- [ ] TestFlight / Play Beta

---

## Step 4: What Makes It "Stunning"

| Element | Implementation | Reference Doc |
|---------|----------------|---------------|
| Smooth 60fps animations | react-native-reanimated | docs/wireframes/12-transitions.md |
| Consistent spacing | 4pt base grid | docs/design-system/03-spacing.md |
| Typography hierarchy | Defined text styles | docs/design-system/01-typography.md |
| Haptic feedback | react-native-haptic-feedback | docs/wireframes/11-gestures.md |
| Dark mode | Semantic color tokens | docs/design-system/02-colors.md |
| Skeleton loaders | Not spinners | docs/design-system/04-components.md |

---

## Step 5: Post-MVP Phases

**Phase 2 - Core Features:**
- Highlighting system (SQLite storage)
- Copy/Share with format templates
- Translation download management
- Settings persistence

**Phase 3 - Enhanced Features:**
- Audio playback (react-native-track-player)
- Reading plans
- Sync & backup

**Phase 4 - Advanced Features:**
- Camera OCR (vision-camera + ML Kit)
- Widgets
- Platform integrations

---

## Key Documentation References

| Topic | File Path |
|-------|-----------|
| Technical setup | docs/implementation/01-technical-recommendations.md |
| Development roadmap | docs/implementation/02-development-roadmap.md |
| Migration strategy | docs/implementation/03-migration-strategy.md |
| Component specs | docs/design-system/04-components.md |
| All wireframes | docs/wireframes/*.md |

---

## ARCHIVED: Phase A Documentation Details

The sections below document the completed research phase.

---

## Phase 1: App Functionality Audit (COMPLETED)

### 1.1 Create Feature Inventory Document
**Output**: `docs/audit/01-feature-inventory.md`

Document all existing features by reading source files:
- `apps/web/src/pages/` - All page components and their features
- `apps/web/src/components/` - All UI components
- `apps/web/src/stores/` - All state management and data flows
- `apps/web/src/logic/` - All business logic
- `packages/core/src/` - All core library functionality

Features to document:
1. **Bible Reading**: Translation selection, chapter navigation, book picker
2. **Search**: Reference parsing (jota-parser), text search, search history
3. **Highlighting**: Color palette, translation-specific, import/export
4. **Formatting**: Copy templates, format templates, passage display modes
5. **Audio**: Playback features from `src/logic/audio.ts`
6. **Reading Plans**: Plans from `src/logic/readingPlans.js`
7. **Settings**: All configurable options from settings-store
8. **i18n**: Supported locales, translation coverage

### 1.2 Create User Flow Documentation
**Output**: `docs/audit/02-user-flows.md`

Document current user flows:
- First-time setup flow
- Bible reading flow
- Search and navigation flow
- Highlighting workflow
- Copy to clipboard flow
- Settings configuration flow
- Help and onboarding flow

### 1.3 Create Technical Architecture Doc
**Output**: `docs/audit/03-architecture.md`

Document from existing phase docs and code:
- Monorepo structure (packages/core, packages/adapters, apps/web)
- Data flow between stores
- Translation data formats (3D array vs map)
- Storage patterns (localStorage, IndexedDB)
- Build and deployment pipeline

### 1.4 Create Known Issues & Todo Integration
**Output**: `docs/audit/04-issues-and-roadmap.md`

Consolidate from `private/todo.md`:
- Bugs and fixes needed
- Priority 1 features (localization, edition buttons, etc.)
- Priority 2 features (caching, mobile app, desktop app)
- Priority 3 features (grammatical search, Hitchcock's index)
- Testing gaps
- Refactoring needs

---

## Phase 2: Competitive App Research (COMPLETED)

### 2.1 YouVersion Bible App Analysis
**Output**: `docs/research/01-youversion-analysis.md`

Research via web search and app store analysis:
- Core features and unique selling points
- UI/UX patterns and interactions
- Navigation structure
- Social and community features
- Offline capabilities
- Subscription/monetization model
- User reviews and pain points

### 2.2 Logos Bible Software Analysis
**Output**: `docs/research/02-logos-analysis.md`

Research:
- Academic and study tool features
- Resource library integration
- Note-taking and annotation
- Cross-referencing capabilities
- Desktop-mobile sync
- Pricing and market positioning

### 2.3 Olive Tree Bible App Analysis
**Output**: `docs/research/03-olive-tree-analysis.md`

Research:
- Offline-first architecture
- Audio Bible features
- Resource management
- Study tools and split views
- Sync and backup features

### 2.4 Blue Letter Bible Analysis
**Output**: `docs/research/04-blueletterbible-analysis.md`

Research:
- Strong's concordance integration
- Original language tools
- Cross-references and commentaries
- Free resource model

### 2.5 Additional Competitor Summary
**Output**: `docs/research/05-competitor-summary.md`

Brief analysis of:
- ESV Bible
- NLT Bible
- Tecarta Bible
- Bible Gateway
- Accordance Bible (for study features)

### 2.6 Feature Comparison Matrix
**Output**: `docs/research/06-feature-matrix.md`

Create comparison table:
| Feature | Jota | YouVersion | Logos | Olive Tree | BLB |
|---------|------|------------|-------|------------|-----|
| (all features) |

---

## Phase 3: Mobile Development Best Practices (COMPLETED)

### 3.1 React Native Architecture Patterns
**Output**: `docs/mobile/01-rn-architecture.md`

Research and document:
- State management (Zustand, Jotai, Redux Toolkit)
- Navigation patterns (React Navigation 6+)
- Offline-first architecture
- Performance optimization techniques
- Native module integration patterns

### 3.2 Bible App Specific Patterns
**Output**: `docs/mobile/02-bible-app-patterns.md`

Document patterns from successful Bible apps:
- Large dataset handling (Bible translations)
- Efficient text rendering for long documents
- Bookmarking and highlighting architectures
- Audio streaming patterns
- Search optimization

### 3.3 Mobile UX Guidelines
**Output**: `docs/mobile/03-mobile-ux-guidelines.md`

Document:
- Touch target sizes and spacing
- Gesture-based navigation
- One-handed use optimization
- Accessibility requirements (WCAG)
- Dark mode implementation
- Font sizing and readability
- Haptic feedback patterns

### 3.4 Offline-First Strategy
**Output**: `docs/mobile/04-offline-strategy.md`

Document:
- Translation file caching strategy
- Highlights and notes sync
- Conflict resolution patterns
- Progressive download for large translations
- Background sync implementation

### 3.5 Performance Guidelines
**Output**: `docs/mobile/05-performance-guidelines.md`

Document:
- Startup time optimization
- Memory management for large texts
- List virtualization strategies
- Image and asset optimization
- Battery consumption considerations

---

## Phase 4: User Stories & Requirements (COMPLETED)

### 4.1 Core User Personas
**Output**: `docs/design/01-user-personas.md`

Define personas based on app usage patterns:
1. **Daily Reader**: Quick access to daily reading
2. **Bible Student**: Deep study with highlights and notes
3. **Pastor/Teacher**: Preparing sermons, quick references
4. **Casual User**: Occasional lookup of verses
5. **Multi-lingual User**: Using multiple translations

### 4.2 User Stories - Core Features
**Output**: `docs/design/02-user-stories-core.md`

Format: As a [persona], I want to [action], so that [benefit]

Core stories:
- Reading and navigation
- Search (reference and text)
- Highlighting and annotation
- Copy and share
- Translation switching
- Settings configuration

### 4.3 User Stories - Advanced Features
**Output**: `docs/design/03-user-stories-advanced.md`

Stories for todo.md features:
- Camera OCR verse detection
- Reading plans
- Audio playback
- Cross-reference exploration
- Grammatical search
- Multi-translation comparison

### 4.4 User Stories - Mobile-Specific
**Output**: `docs/design/04-user-stories-mobile.md`

Mobile-specific stories:
- Quick launch to last position
- Widget integration
- Notification-based reading reminders
- Share to/from other apps
- Offline access
- Background audio

---

## Phase 5: Information Architecture (COMPLETED)

### 5.1 Navigation Structure
**Output**: `docs/design/05-navigation-structure.md`

Define mobile navigation:
```
Tab Bar:
├── Home (Daily/Recent)
├── Bible (Reader)
├── Search
├── Library (Translations/Plans)
└── Profile (Settings/Highlights)
```

### 5.2 Screen Inventory
**Output**: `docs/design/06-screen-inventory.md`

List all screens needed:
- Home/Dashboard
- Bible Reader (Chapter View)
- Book/Chapter Picker
- Search Results
- Search Filters
- Translation Selector
- Highlight Manager
- Color Picker
- Reading Plans
- Plan Detail
- Settings (multi-level)
- Profile/Account
- Audio Player
- Share Sheet
- Onboarding (3-5 screens)

### 5.3 Data & Content Strategy
**Output**: `docs/design/07-data-strategy.md`

Document:
- Translation download management
- Cache and storage limits
- Sync conflict resolution
- Offline data availability

---

## Phase 6: Wireframes - Core Flows (COMPLETED)

### 6.1 Onboarding Flow
**Output**: `docs/wireframes/01-onboarding.md`

ASCII/Markdown wireframes for:
```
[Welcome Screen]
→ [Language Selection]
→ [Translation Selection]
→ [Quick Tutorial (optional)]
→ [Home Screen]
```

### 6.2 Bible Reading Flow
**Output**: `docs/wireframes/02-bible-reading.md`

Wireframes for:
- Chapter reader with verse numbers
- Swipe navigation between chapters
- Book/chapter picker modal
- Translation switcher
- Font size/theme controls
- Reading progress indicator

### 6.3 Search Flow
**Output**: `docs/wireframes/03-search.md`

Wireframes for:
- Search input with suggestions
- Reference parsing feedback
- Search results list
- Result detail view
- Search history
- Search filters

### 6.4 Highlighting Flow
**Output**: `docs/wireframes/04-highlighting.md`

Wireframes for:
- Verse selection (tap/long-press)
- Highlight color picker
- Highlight management screen
- Export/import highlights
- Filter by color

### 6.5 Copy & Share Flow
**Output**: `docs/wireframes/05-copy-share.md`

Wireframes for:
- Selection mode
- Format template selection
- Preview before copy
- Share sheet integration
- Copy confirmation

---

## Phase 7: Wireframes - Advanced Features (COMPLETED)

### 7.1 Translation Management
**Output**: `docs/wireframes/06-translations.md`

Wireframes for:
- Translation library browser
- Download progress
- Storage management
- Favorite translations
- Translation comparison view

### 7.2 Reading Plans
**Output**: `docs/wireframes/07-reading-plans.md`

Wireframes for:
- Plan discovery/browser
- Plan detail with schedule
- Daily reading view
- Progress tracking
- Completion celebration
- Streak/habit features

### 7.3 Audio Player
**Output**: `docs/wireframes/08-audio-player.md`

Wireframes for:
- Mini player (floating)
- Full player screen
- Chapter selection for audio
- Speed controls
- Background playback controls
- Lock screen controls

### 7.4 Camera OCR Feature (from todo.md)
**Output**: `docs/wireframes/09-camera-ocr.md`

Wireframes for:
- Camera viewfinder
- Reference detection overlay
- Detected references list
- Quick navigation to passage
- Multi-reference handling

### 7.5 Settings & Profile
**Output**: `docs/wireframes/10-settings.md`

Wireframes for:
- Settings categories
- Appearance settings
- Download management
- Account/sync settings
- About/help section
- Privacy controls

---

## Phase 8: Interaction Specifications (COMPLETED)

### 8.1 Gesture Map
**Output**: `docs/wireframes/11-gestures.md`

Document all gestures:
- Swipe left/right: Chapter navigation
- Long press: Verse selection
- Double tap: Quick highlight
- Pinch: Font size
- Pull down: Refresh/options
- Swipe up from bottom: Quick actions

### 8.2 Transitions & Animations
**Output**: `docs/wireframes/12-transitions.md`

Document transition patterns:
- Screen transitions
- Modal presentations
- Loading states
- Success/error feedback
- Highlight animations
- Pull-to-refresh

### 8.3 Accessibility Specifications
**Output**: `docs/wireframes/13-accessibility.md`

Document:
- VoiceOver/TalkBack support
- Dynamic text sizing
- Color contrast requirements
- Focus management
- Screen reader announcements

---

## Phase 9: Design System Foundation (COMPLETED)

### 9.1 Typography Scale
**Output**: `docs/design-system/01-typography.md`

Define:
- Heading scales (H1-H6)
- Body text sizes
- Verse text specifications
- UI text sizes
- Font families (system + custom)

### 9.2 Color Palette
**Output**: `docs/design-system/02-colors.md`

Define:
- Brand colors
- Semantic colors (success, warning, error)
- Neutral grays
- Highlight colors (from existing palette)
- Dark mode variants

### 9.3 Spacing & Layout
**Output**: `docs/design-system/03-spacing.md`

Define:
- Base spacing unit
- Component spacing
- Screen margins
- Touch target sizes
- Grid system

### 9.4 Component Library Spec
**Output**: `docs/design-system/04-components.md`

Specify components:
- Buttons (primary, secondary, text)
- Cards
- Lists and list items
- Bottom sheets
- Modals
- Navigation bars
- Tab bars
- Search bars
- Verse blocks
- Highlight chips

---

## Phase 10: Implementation Recommendations (COMPLETED)

### 10.1 Technical Recommendations
**Output**: `docs/implementation/01-technical-recommendations.md`

Recommendations for:
- React Native project setup
- Integration with packages/core
- State management choice
- Navigation implementation
- Testing strategy

### 10.2 Development Roadmap
**Output**: `docs/implementation/02-development-roadmap.md`

Prioritized phases:
1. MVP (read, search, basic navigation)
2. Core Features (highlighting, copy, settings)
3. Enhanced Features (reading plans, audio)
4. Advanced Features (OCR, sync, comparison)

### 10.3 Migration Strategy
**Output**: `docs/implementation/03-migration-strategy.md`

Document:
- Data migration from web
- Feature parity considerations
- Gradual rollout plan
- Beta testing approach

---

## Execution Summary

All 10 documentation phases were executed automatically:
- 40+ markdown files created in `docs/` directory
- Competitive research gathered via web searches
- Code reading extracted current functionality
- Wireframes created using ASCII art and markdown tables

**Total Output**: 42 markdown files documenting the complete app analysis, research, and mobile redesign.

**Next Step**: Proceed to Phase B (Mobile App Implementation) above.
