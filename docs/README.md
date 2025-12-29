# Jota Bible App - Mobile App Development Master Plan

**Status**: Phase A (Documentation) Complete | Phase B (Implementation) Ready to Start
**Platform**: React Native (iOS + Android)
**Target**: Professional, stunning mobile Bible reading experience

---

## Quick Navigation

### Phase A: Documentation (COMPLETED ✓)

| Category | Documents | Status |
|----------|-----------|--------|
| **App Audit** | [Feature Inventory](audit/01-feature-inventory.md) • [User Flows](audit/02-user-flows.md) • [Architecture](audit/03-architecture.md) • [Issues & Roadmap](audit/04-issues-and-roadmap.md) | ✓ Complete |
| **Competitive Research** | [YouVersion](research/01-youversion-analysis.md) • [Logos](research/02-logos-analysis.md) • [Olive Tree](research/03-olive-tree-analysis.md) • [Blue Letter Bible](research/04-blueletterbible-analysis.md) • [Summary](research/05-competitor-summary.md) • [Feature Matrix](research/06-feature-matrix.md) | ✓ Complete |
| **Mobile Best Practices** | [RN Architecture](mobile/01-rn-architecture.md) • [Bible App Patterns](mobile/02-bible-app-patterns.md) • [UX Guidelines](mobile/03-mobile-ux-guidelines.md) • [Offline Strategy](mobile/04-offline-strategy.md) • [Performance](mobile/05-performance-guidelines.md) | ✓ Complete |
| **User Research** | [Personas](design/01-user-personas.md) • [Core Stories](design/02-user-stories-core.md) • [Advanced Stories](design/03-user-stories-advanced.md) • [Mobile Stories](design/04-user-stories-mobile.md) | ✓ Complete |
| **Information Architecture** | [Navigation](design/05-navigation-structure.md) • [Screen Inventory](design/06-screen-inventory.md) • [Data Strategy](design/07-data-strategy.md) | ✓ Complete |
| **Core Wireframes** | [Onboarding](wireframes/01-onboarding.md) • [Bible Reading](wireframes/02-bible-reading.md) • [Search](wireframes/03-search.md) • [Highlighting](wireframes/04-highlighting.md) • [Copy/Share](wireframes/05-copy-share.md) | ✓ Complete |
| **Advanced Wireframes** | [Translations](wireframes/06-translations.md) • [Reading Plans](wireframes/07-reading-plans.md) • [Audio Player](wireframes/08-audio-player.md) • [Camera OCR](wireframes/09-camera-ocr.md) • [Settings](wireframes/10-settings.md) | ✓ Complete |
| **Interactions** | [Gestures](wireframes/11-gestures.md) • [Transitions](wireframes/12-transitions.md) • [Accessibility](wireframes/13-accessibility.md) | ✓ Complete |
| **Design System** | [Typography](design-system/01-typography.md) • [Colors](design-system/02-colors.md) • [Spacing](design-system/03-spacing.md) • [Components](design-system/04-components.md) | ✓ Complete |
| **Implementation** | [Technical Recommendations](implementation/01-technical-recommendations.md) • [Development Roadmap](implementation/02-development-roadmap.md) • [Migration Strategy](implementation/03-migration-strategy.md) | ✓ Complete |

**Total**: 42 comprehensive documentation files

---

## Phase B: Mobile App Implementation (NEXT)

### Step 1: Visual Design 🎨

**Goal**: Convert ASCII wireframes to high-fidelity designs

**Options**:
1. **Hire UI Designer** - Best for custom brand, professional polish
2. **Figma + UI Kit** - Fast iteration, cost-effective (recommended for MVP)
3. **React Native UI Kit** - Quickest to code, less unique

**Priority Screens**:
1. Bible Reader (core experience) → See [wireframes/02-bible-reading.md](wireframes/02-bible-reading.md)
2. Book/Chapter picker → See [wireframes/02-bible-reading.md](wireframes/02-bible-reading.md)
3. Search → See [wireframes/03-search.md](wireframes/03-search.md)
4. Highlight color picker → See [wireframes/04-highlighting.md](wireframes/04-highlighting.md)
5. Onboarding flow → See [wireframes/01-onboarding.md](wireframes/01-onboarding.md)

**Recommended UI Libraries**:
- [Tamagui](https://tamagui.dev) - Great DX, performant, optimizing compiler
- [NativeWind](https://nativewind.dev) - Tailwind CSS for React Native
- [Gluestack UI](https://gluestack.io) - Accessible, customizable components

---

### Step 2: Project Setup 🛠️

**Initialize Project**:

```bash
# Option A: React Native CLI (recommended for full control)
npx react-native init JotaMobile --template react-native-template-typescript

# Option B: Expo (faster start, some limitations)
npx create-expo-app JotaMobile -t expo-template-blank-typescript
```

**Core Dependencies**:
```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs

# State Management
npm install zustand

# Data Fetching
npm install @tanstack/react-query

# Animations
npm install react-native-reanimated react-native-gesture-handler

# Performant Lists
npm install @shopify/flash-list

# Storage
npm install @react-native-async-storage/async-storage
npm install react-native-sqlite-storage

# File System
npm install react-native-fs
```

**Link @jota/core**:
- Integrate existing `packages/core` for Bible logic
- Create mobile storage adapter in `packages/adapters`
- See [implementation/01-technical-recommendations.md](implementation/01-technical-recommendations.md)

---

### Step 3: MVP Build Order (8 Weeks) 📅

#### Week 1-2: Foundation
- [ ] Project initialization with TypeScript
- [ ] Navigation skeleton (tabs + stacks)
- [ ] Theme provider (light/dark) → Use [design-system/02-colors.md](design-system/02-colors.md)
- [ ] Core components (Button, Card, Text) → See [design-system/04-components.md](design-system/04-components.md)
- [ ] Integrate @jota/core package

#### Week 3-4: Core Reading Experience
- [ ] Bible Reader screen → [wireframes/02-bible-reading.md](wireframes/02-bible-reading.md)
- [ ] Chapter loading & display
- [ ] Book/Chapter picker
- [ ] Swipe navigation between chapters → [wireframes/11-gestures.md](wireframes/11-gestures.md)
- [ ] Translation selector

#### Week 5-6: Essential Features
- [ ] Search (reference + text) → [wireframes/03-search.md](wireframes/03-search.md)
- [ ] Basic settings
- [ ] Font size controls → [design-system/01-typography.md](design-system/01-typography.md)
- [ ] Theme switching

#### Week 7-8: Polish & Beta
- [ ] Animations & gestures → [wireframes/12-transitions.md](wireframes/12-transitions.md)
- [ ] Haptic feedback → [wireframes/11-gestures.md](wireframes/11-gestures.md)
- [ ] Loading states (skeletons) → [design-system/04-components.md](design-system/04-components.md)
- [ ] Error handling
- [ ] TestFlight (iOS) / Play Beta (Android)

**Reference**: [implementation/02-development-roadmap.md](implementation/02-development-roadmap.md)

---

### Step 4: What Makes It "Stunning" ✨

| Element | Implementation | Reference Doc |
|---------|----------------|---------------|
| **60fps animations** | react-native-reanimated | [wireframes/12-transitions.md](wireframes/12-transitions.md) |
| **Consistent spacing** | 4pt base grid system | [design-system/03-spacing.md](design-system/03-spacing.md) |
| **Typography hierarchy** | SF Pro / Roboto with defined scales | [design-system/01-typography.md](design-system/01-typography.md) |
| **Haptic feedback** | react-native-haptic-feedback | [wireframes/11-gestures.md](wireframes/11-gestures.md) |
| **Perfect dark mode** | Semantic color tokens | [design-system/02-colors.md](design-system/02-colors.md) |
| **Skeleton loaders** | Not spinners! | [design-system/04-components.md](design-system/04-components.md) |
| **Gestures** | Natural swipe, pinch, long-press | [wireframes/11-gestures.md](wireframes/11-gestures.md) |
| **Accessibility** | VoiceOver, Dynamic Type, WCAG AA | [wireframes/13-accessibility.md](wireframes/13-accessibility.md) |

---

### Step 5: Post-MVP Phases 🚀

#### Phase 2: Core Features (Weeks 9-14)
- [ ] Highlighting system (SQLite storage) → [wireframes/04-highlighting.md](wireframes/04-highlighting.md)
- [ ] Copy/Share with format templates → [wireframes/05-copy-share.md](wireframes/05-copy-share.md)
- [ ] Translation download management → [wireframes/06-translations.md](wireframes/06-translations.md)
- [ ] Settings persistence

#### Phase 3: Enhanced Features (Weeks 15-22)
- [ ] Audio playback (react-native-track-player) → [wireframes/08-audio-player.md](wireframes/08-audio-player.md)
- [ ] Reading plans → [wireframes/07-reading-plans.md](wireframes/07-reading-plans.md)
- [ ] Cloud sync & backup → [implementation/03-migration-strategy.md](implementation/03-migration-strategy.md)

#### Phase 4: Advanced Features (Weeks 23+)
- [ ] Camera OCR (vision-camera + ML Kit) → [wireframes/09-camera-ocr.md](wireframes/09-camera-ocr.md)
- [ ] Home screen widgets
- [ ] Platform integrations (Shortcuts, Assistant)
- [ ] Multi-translation comparison

---

## Key Design Decisions

### Architecture
- **State Management**: Zustand (lightweight, similar to Pinia)
- **Navigation**: React Navigation 6+ (industry standard)
- **Data Fetching**: React Query (caching, prefetching)
- **Styling**: NativeWind or Tamagui (design system ready)
- **Database**: SQLite for highlights, AsyncStorage for settings

### Performance
- **List Rendering**: FlashList (60fps scrolling)
- **Chapter Loading**: Lazy loading with prefetch
- **Memory Management**: < 150MB target
- **Startup Time**: < 2 seconds
- **Offline-first**: All translations cached locally

### Design Philosophy
- **Bible reading first**: Minimal UI, maximum readability
- **One-handed use**: Bottom navigation, reachable targets
- **Gesture-driven**: Swipe chapters, long-press highlight
- **Accessible**: WCAG AA, Dynamic Type, VoiceOver
- **Beautiful**: Smooth animations, thoughtful spacing, dark mode

---

## Documentation Structure

```
docs/
├── README.md (this file)
│
├── audit/                      # Phase 1: Current app analysis
│   ├── 01-feature-inventory.md
│   ├── 02-user-flows.md
│   ├── 03-architecture.md
│   └── 04-issues-and-roadmap.md
│
├── research/                   # Phase 2: Competitive analysis
│   ├── 01-youversion-analysis.md
│   ├── 02-logos-analysis.md
│   ├── 03-olive-tree-analysis.md
│   ├── 04-blueletterbible-analysis.md
│   ├── 05-competitor-summary.md
│   └── 06-feature-matrix.md
│
├── mobile/                     # Phase 3: Mobile best practices
│   ├── 01-rn-architecture.md
│   ├── 02-bible-app-patterns.md
│   ├── 03-mobile-ux-guidelines.md
│   ├── 04-offline-strategy.md
│   └── 05-performance-guidelines.md
│
├── design/                     # Phases 4-5: User research & IA
│   ├── 01-user-personas.md
│   ├── 02-user-stories-core.md
│   ├── 03-user-stories-advanced.md
│   ├── 04-user-stories-mobile.md
│   ├── 05-navigation-structure.md
│   ├── 06-screen-inventory.md
│   └── 07-data-strategy.md
│
├── wireframes/                 # Phases 6-8: Complete wireframe set
│   ├── 01-onboarding.md
│   ├── 02-bible-reading.md
│   ├── 03-search.md
│   ├── 04-highlighting.md
│   ├── 05-copy-share.md
│   ├── 06-translations.md
│   ├── 07-reading-plans.md
│   ├── 08-audio-player.md
│   ├── 09-camera-ocr.md
│   ├── 10-settings.md
│   ├── 11-gestures.md
│   ├── 12-transitions.md
│   └── 13-accessibility.md
│
├── design-system/              # Phase 9: Design foundation
│   ├── 01-typography.md
│   ├── 02-colors.md
│   ├── 03-spacing.md
│   └── 04-components.md
│
└── implementation/             # Phase 10: Technical guidance
    ├── 01-technical-recommendations.md
    ├── 02-development-roadmap.md
    └── 03-migration-strategy.md
```

---

## Getting Started

### For Designers
1. Review [wireframes/](wireframes/) for all screen layouts
2. Check [design-system/](design-system/) for colors, typography, spacing
3. Reference [design/01-user-personas.md](design/01-user-personas.md) for target users
4. Use [mobile/03-mobile-ux-guidelines.md](mobile/03-mobile-ux-guidelines.md) for mobile UX patterns

### For Developers
1. Start with [implementation/01-technical-recommendations.md](implementation/01-technical-recommendations.md)
2. Follow [implementation/02-development-roadmap.md](implementation/02-development-roadmap.md) for build order
3. Reference [design-system/](design-system/) for design tokens
4. Use [wireframes/11-gestures.md](wireframes/11-gestures.md) and [wireframes/12-transitions.md](wireframes/12-transitions.md) for interactions

### For Product Managers
1. Review [design/02-user-stories-core.md](design/02-user-stories-core.md) for MVP scope
2. Check [research/06-feature-matrix.md](research/06-feature-matrix.md) for competitive positioning
3. See [implementation/02-development-roadmap.md](implementation/02-development-roadmap.md) for phased rollout
4. Reference [implementation/03-migration-strategy.md](implementation/03-migration-strategy.md) for user migration

---

## Success Metrics

| Metric | Target |
|--------|--------|
| App launch time | < 2 seconds |
| Chapter load time | < 500ms |
| Memory usage | < 150 MB |
| Crash-free rate | > 99.5% |
| Frame rate | 60fps sustained |
| App Store rating | > 4.5 stars |
| User migration rate | > 30% (Month 1) |

---

## Resources

### External Tools
- [React Native](https://reactnative.dev) - Official documentation
- [Expo](https://expo.dev) - Managed workflow option
- [Tamagui](https://tamagui.dev) - UI kit recommendation
- [React Navigation](https://reactnavigation.org) - Navigation library
- [Figma](https://figma.com) - Design tool

### Internal Assets
- **Monorepo**: `packages/core` - Bible logic, parsing, formatting
- **Web App**: `apps/web` - Current implementation reference
- **Private Docs**: `private/todo.md` - Feature wishlist

---

## Questions?

- **Technical architecture**: See [implementation/01-technical-recommendations.md](implementation/01-technical-recommendations.md)
- **Development timeline**: See [implementation/02-development-roadmap.md](implementation/02-development-roadmap.md)
- **User migration**: See [implementation/03-migration-strategy.md](implementation/03-migration-strategy.md)
- **Design system**: See [design-system/](design-system/) folder
- **All wireframes**: See [wireframes/](wireframes/) folder

---

**Last Updated**: December 2024
**Document Version**: 1.0
**Status**: Phase A Complete, Phase B Ready to Start
