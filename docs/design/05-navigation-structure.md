# Navigation Structure

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document defines the navigation architecture for the Jota mobile app, including the tab bar structure, screen hierarchy, and navigation patterns.

---

## 1. Primary Navigation (Tab Bar)

### Tab Bar Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        JOTA APP                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                     [Content Area]                           │
│                                                              │
│                                                              │
├──────────┬──────────┬──────────┬──────────┬──────────────────┤
│  🏠      │  📖      │  🔍      │  📚      │  👤              │
│  Home    │  Bible   │  Search  │  Library │  Profile         │
└──────────┴──────────┴──────────┴──────────┴──────────────────┘
```

### Tab Definitions

| Tab | Icon | Primary Purpose | Key Actions |
|-----|------|-----------------|-------------|
| Home | 🏠 | Dashboard, quick access | Continue reading, Verse of day, Reading plan |
| Bible | 📖 | Primary reading | Read chapters, navigate, highlight |
| Search | 🔍 | Find content | Reference search, text search |
| Library | 📚 | Manage content | Translations, reading plans, audio |
| Profile | 👤 | Settings & personal | Highlights, settings, account |

---

## 2. Screen Hierarchy

### 2.1 Home Tab

```
Home Tab
├── HomeScreen
│   ├── ContinueReadingCard → BibleReader
│   ├── VerseOfDayCard → BibleReader (to verse)
│   ├── ReadingPlanCard → PlanDetail
│   └── QuickActions
│       ├── Search → SearchScreen
│       └── Audio → AudioPlayer
└── No nested stacks (flat)
```

### 2.2 Bible Tab

```
Bible Tab
├── BibleReaderScreen (main)
│   └── Can navigate between chapters (swipe)
├── BookPickerModal (full screen modal)
│   └── ChapterPickerSheet (bottom sheet)
├── TranslationPickerSheet (bottom sheet)
├── VerseActionsSheet (bottom sheet)
│   ├── Highlight
│   ├── Copy
│   ├── Share
│   └── More actions
└── AudioMiniPlayer (overlay)
```

### 2.3 Search Tab

```
Search Tab
├── SearchScreen (main)
│   ├── SearchInput
│   ├── SearchHistory
│   └── SearchResults
├── SearchFiltersSheet (bottom sheet)
│   ├── Translation filter
│   ├── Book filter
│   └── Testament filter
└── SearchResultDetail → BibleReader
```

### 2.4 Library Tab

```
Library Tab
├── LibraryScreen (main)
│   ├── TranslationsSection
│   ├── ReadingPlansSection
│   └── AudioSection
├── TranslationsListScreen
│   ├── Downloaded tab
│   ├── Available tab
│   └── TranslationDetailSheet
├── ReadingPlansListScreen
│   └── PlanDetailScreen
│       ├── PlanOverview
│       ├── DaysList
│       └── DayReadingScreen → BibleReader
├── AudioListScreen
│   ├── Downloaded tab
│   └── Available tab
└── StorageManagementScreen
```

### 2.5 Profile Tab

```
Profile Tab
├── ProfileScreen (main)
│   ├── HighlightsSection
│   ├── SettingsLink
│   └── AccountSection (if sync enabled)
├── HighlightsScreen
│   ├── All highlights
│   ├── Filter by color
│   ├── Filter by book
│   └── HighlightDetailSheet
│       ├── Edit color
│       ├── Edit note
│       ├── Go to verse → BibleReader
│       └── Delete
├── SettingsScreen
│   ├── AppearanceSettings
│   │   ├── Theme (light/dark/system)
│   │   ├── Font size
│   │   └── Font family
│   ├── ReadingSettings
│   │   ├── Default translation
│   │   └── Reading preferences
│   ├── NotificationSettings
│   │   ├── Reminders on/off
│   │   └── Reminder time
│   ├── DataSettings
│   │   ├── Storage management
│   │   ├── Export data
│   │   └── Import data
│   ├── PrivacySettings
│   │   └── Analytics on/off
│   └── AboutScreen
│       ├── Version info
│       ├── Licenses
│       └── Help/FAQ
└── AccountScreen (if sync enabled)
    ├── Sync status
    ├── Sign out
    └── Delete account
```

---

## 3. Modal Presentations

### Full Screen Modals

| Modal | Trigger | Content |
|-------|---------|---------|
| BookPicker | Tap book name in header | Grid of all 66 books |
| Onboarding | First launch | Welcome, language, translation |
| AudioPlayer | Expand mini player | Full audio controls |

### Bottom Sheets

| Sheet | Trigger | Content |
|-------|---------|---------|
| ChapterPicker | Tap chapter in header or select book | Grid of chapters |
| TranslationPicker | Tap translation badge | List of translations |
| VerseActions | Tap selected verse | Highlight, copy, share |
| SearchFilters | Tap filter in search | Filter options |
| HighlightColorPicker | Tap highlight in verse actions | Color grid |
| FormatPicker | Tap copy in verse actions | Format template list |

---

## 4. Navigation Patterns

### 4.1 Tab Switching

```
┌─────────────────────────────────────────────────────┐
│  Tab Switching Behavior                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Single tap on tab:                                │
│  ├── If on different tab → Switch to tab           │
│  └── If on same tab → Scroll to top / pop to root  │
│                                                     │
│  State preservation:                                │
│  ├── Each tab remembers its stack                  │
│  ├── Scroll positions preserved                     │
│  └── Forms retain input                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.2 Stack Navigation

```
┌─────────────────────────────────────────────────────┐
│  Stack Navigation Patterns                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Push new screen:                                   │
│  ├── Slide from right (iOS)                        │
│  ├── Slide up (Android, Material)                  │
│  └── Back button/gesture returns                    │
│                                                     │
│  Present modal:                                     │
│  ├── Slide from bottom                             │
│  ├── Background dims                               │
│  └── Swipe down or X to dismiss                    │
│                                                     │
│  Bottom sheet:                                      │
│  ├── Slide from bottom                             │
│  ├── Snap points (25%, 50%, 90%)                   │
│  ├── Swipe down to dismiss                         │
│  └── Background interactive (optional)             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.3 Cross-Tab Navigation

```
┌─────────────────────────────────────────────────────┐
│  Cross-Tab Navigation                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  From Home to Bible:                                │
│  ├── "Continue Reading" → Bible tab, specific pos  │
│  ├── "Verse of Day" → Bible tab, specific verse    │
│  └── Preserves Home tab state                      │
│                                                     │
│  From Search to Bible:                              │
│  ├── Tap result → Bible tab, specific passage      │
│  ├── Can return to Search via tab                  │
│  └── Search history preserved                      │
│                                                     │
│  From Library/Profile to Bible:                     │
│  ├── Any "Go to verse" → Bible tab                 │
│  └── Source screen preserved                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 5. Navigation State

### State Persistence

| Screen | Persisted State |
|--------|-----------------|
| BibleReader | Book, chapter, scroll position, translation |
| Search | Query, filters, scroll position |
| Library | Selected tab, scroll positions |
| Highlights | Selected filter, scroll position |
| Settings | All settings (to storage) |

### Deep Link Handling

```typescript
// Deep link schema
const deepLinks = {
  // Bible references
  'jota://bible/:book/:chapter': 'Navigate to chapter',
  'jota://bible/:book/:chapter/:verse': 'Navigate to verse',

  // Search
  'jota://search/:query': 'Open search with query',

  // Reading plans
  'jota://plan/:planId': 'Open plan detail',
  'jota://plan/:planId/day/:day': 'Open specific day',

  // Settings
  'jota://settings': 'Open settings',
  'jota://settings/:section': 'Open specific setting',
}
```

---

## 6. Navigation Components

### 6.1 Header

```
┌─────────────────────────────────────────────────────┐
│  Bible Reader Header                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ← │  Genesis 1        │ ESV  │  ⚙️  │  🔊 │   │
│  └───┴──────────────────┴──────┴──────┴──────┘   │
│       │        │            │       │      │      │
│       │        │            │       │      │      │
│    Back   Tap: Book     Tap:    Settings  Audio   │
│           picker        Translation               │
│           + chapter     picker                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 6.2 Tab Bar Icons

```
Active state:   Filled icon + label + accent color
Inactive state: Outline icon + label + gray
Badge:          Red dot or number (for notifications)
```

### 6.3 Back Button

```
iOS:     "< Back" or "< [Previous Screen Name]"
Android: ← arrow icon
Gesture: Edge swipe (iOS), system back (Android)
```

---

## 7. Transition Animations

### Screen Transitions

| Transition | Animation | Duration |
|------------|-----------|----------|
| Tab switch | Cross-fade | 200ms |
| Stack push | Slide from right | 300ms |
| Stack pop | Slide to right | 300ms |
| Modal present | Slide from bottom | 300ms |
| Modal dismiss | Slide to bottom | 250ms |
| Bottom sheet | Spring animation | Variable |

### Reduced Motion

```typescript
// Honor accessibility settings
if (accessibilityReduceMotion) {
  // Use fade transitions instead of slides
  // Reduce animation duration by 50%
  // Disable spring physics
}
```

---

## 8. Navigation Code Structure

### React Navigation Setup

```typescript
// navigation/types.ts
export type RootStackParamList = {
  Main: undefined
  Onboarding: undefined
  BookPicker: undefined
  AudioPlayerFull: { translationId: string; book: number; chapter: number }
}

export type MainTabParamList = {
  Home: undefined
  Bible: { book?: number; chapter?: number; verse?: number }
  Search: { initialQuery?: string }
  Library: undefined
  Profile: undefined
}

export type BibleStackParamList = {
  Reader: { book: number; chapter: number }
}

export type LibraryStackParamList = {
  LibraryHome: undefined
  Translations: undefined
  ReadingPlans: undefined
  PlanDetail: { planId: string }
  Audio: undefined
  Storage: undefined
}

export type ProfileStackParamList = {
  ProfileHome: undefined
  Highlights: { colorFilter?: string; bookFilter?: number }
  Settings: undefined
  Appearance: undefined
  Reading: undefined
  Notifications: undefined
  Data: undefined
  Privacy: undefined
  About: undefined
  Account: undefined
}
```

### Navigator Structure

```typescript
// navigation/RootNavigator.tsx
function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingNavigator}
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="BookPicker"
        component={BookPickerScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="AudioPlayerFull"
        component={AudioPlayerScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
    </Stack.Navigator>
  )
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bible" component={BibleStackNavigator} />
      <Tab.Screen name="Search" component={SearchStackNavigator} />
      <Tab.Screen name="Library" component={LibraryStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  )
}
```

---

## 9. Navigation Accessibility

### Screen Reader Announcements

```typescript
// Announce screen changes
useEffect(() => {
  AccessibilityInfo.announceForAccessibility(`Now viewing ${screenName}`)
}, [screenName])
```

### Focus Management

```typescript
// Focus first interactive element on screen change
useEffect(() => {
  const timer = setTimeout(() => {
    headerRef.current?.focus()
  }, 500)
  return () => clearTimeout(timer)
}, [])
```

### Navigation Labels

| Element | accessibilityLabel |
|---------|-------------------|
| Home tab | "Home tab, Dashboard" |
| Bible tab | "Bible tab, Read Scripture" |
| Search tab | "Search tab, Find verses" |
| Library tab | "Library tab, Manage translations and plans" |
| Profile tab | "Profile tab, Settings and highlights" |
| Back button | "Go back" |
| Book picker | "Select book, currently Genesis" |
| Chapter picker | "Select chapter, currently chapter 1" |
