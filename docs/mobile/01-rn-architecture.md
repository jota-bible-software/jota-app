# React Native Architecture Patterns

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document outlines recommended React Native architecture patterns for the Jota mobile app, focusing on state management, navigation, offline capabilities, and native integration.

---

## 1. Project Structure

### Recommended Directory Layout

```
apps/mobile/
├── src/
│   ├── app/                    # App entry and providers
│   │   ├── App.tsx
│   │   ├── providers/
│   │   └── navigation/
│   ├── screens/                # Screen components
│   │   ├── Home/
│   │   ├── Bible/
│   │   ├── Search/
│   │   ├── Library/
│   │   └── Settings/
│   ├── components/             # Reusable components
│   │   ├── common/
│   │   ├── bible/
│   │   └── ui/
│   ├── hooks/                  # Custom hooks
│   ├── stores/                 # State management
│   ├── services/               # API and native services
│   ├── utils/                  # Utilities
│   ├── theme/                  # Design tokens
│   ├── i18n/                   # Internationalization
│   └── types/                  # TypeScript definitions
├── android/                    # Android native code
├── ios/                        # iOS native code
├── __tests__/                  # Test files
└── package.json
```

### Feature-Based Organization

```
src/features/
├── bible-reader/
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   └── index.ts
├── search/
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   └── index.ts
└── highlighting/
    ├── components/
    ├── hooks/
    ├── stores/
    └── index.ts
```

---

## 2. State Management

### Recommended: Zustand

Zustand is lightweight, TypeScript-friendly, and works well with React Native. It's already familiar from the web app's Pinia stores.

```typescript
// stores/translation-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface TranslationState {
  currentTranslation: string
  downloadedTranslations: string[]
  isLoading: boolean

  setCurrentTranslation: (id: string) => void
  downloadTranslation: (id: string) => Promise<void>
  removeTranslation: (id: string) => Promise<void>
}

export const useTranslationStore = create<TranslationState>()(
  persist(
    (set, get) => ({
      currentTranslation: 'ESV',
      downloadedTranslations: [],
      isLoading: false,

      setCurrentTranslation: (id) => set({ currentTranslation: id }),

      downloadTranslation: async (id) => {
        set({ isLoading: true })
        try {
          // Download logic
          const translations = get().downloadedTranslations
          set({ downloadedTranslations: [...translations, id] })
        } finally {
          set({ isLoading: false })
        }
      },

      removeTranslation: async (id) => {
        const translations = get().downloadedTranslations
        set({ downloadedTranslations: translations.filter(t => t !== id) })
        // Clean up files
      }
    }),
    {
      name: 'translation-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
```

### Alternative: Jotai (Atomic State)

For more granular reactivity, Jotai offers atomic state management:

```typescript
// atoms/bible.ts
import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'

const storage = createJSONStorage(() => AsyncStorage)

export const currentBookAtom = atomWithStorage('currentBook', 0, storage)
export const currentChapterAtom = atomWithStorage('currentChapter', 0, storage)

export const currentPassageAtom = atom(
  (get) => [get(currentBookAtom), get(currentChapterAtom)] as [number, number]
)
```

### State Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                   UI Components                      │
├─────────────────────────────────────────────────────┤
│                 Custom Hooks                         │
│         (useBibleReader, useSearch, etc.)           │
├─────────────────────────────────────────────────────┤
│              State Management                        │
│           (Zustand / Jotai stores)                  │
├─────────────────────────────────────────────────────┤
│                  Services                            │
│    (API, Storage, Native Modules)                   │
├─────────────────────────────────────────────────────┤
│               @jota/core                             │
│    (Shared logic with web app)                      │
└─────────────────────────────────────────────────────┘
```

---

## 3. Navigation

### React Navigation 6+ Setup

```typescript
// navigation/types.ts
export type RootStackParamList = {
  Main: undefined
  Onboarding: undefined
  TranslationPicker: { mode: 'initial' | 'switch' }
}

export type MainTabParamList = {
  Home: undefined
  Bible: { book?: number; chapter?: number }
  Search: { query?: string }
  Library: undefined
  Profile: undefined
}

export type BibleStackParamList = {
  Reader: { book: number; chapter: number }
  BookPicker: undefined
  ChapterPicker: { book: number }
}
```

```typescript
// navigation/RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<MainTabParamList>()

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bible" component={BibleNavigator} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export function RootNavigator() {
  const hasCompletedOnboarding = useOnboardingStore(s => s.completed)

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
        <Stack.Screen
          name="TranslationPicker"
          component={TranslationPickerScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

### Deep Linking

```typescript
// navigation/linking.ts
export const linking = {
  prefixes: ['jota://', 'https://jota.app'],
  config: {
    screens: {
      Main: {
        screens: {
          Bible: {
            path: 'bible/:book?/:chapter?',
            parse: {
              book: (book: string) => parseInt(book, 10),
              chapter: (chapter: string) => parseInt(chapter, 10),
            },
          },
          Search: 'search/:query?',
        },
      },
    },
  },
}
```

---

## 4. Core Library Integration

### Sharing @jota/core with Mobile

The `packages/core` library should work on both web and mobile:

```typescript
// packages/core/src/index.ts
export * from './parser'         // jota-parser integration
export * from './books'          // Book definitions
export * from './search'         // Search logic
export * from './formatting'     // Format templates
export * from './highlighting'   // Highlight logic
export * from './types'          // Shared types
```

```typescript
// apps/mobile/src/services/bible.ts
import { parseReference, formatPassage, type Passage } from '@jota/core'

export async function searchBible(query: string): Promise<SearchResult[]> {
  const parsed = parseReference(query, { locale: 'en-US' })

  if (parsed.type === 'reference') {
    return [{ type: 'passage', passage: parsed.passage }]
  }

  return performTextSearch(query)
}
```

### Adapter Pattern for Platform Differences

```typescript
// packages/adapters/src/storage/types.ts
export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}

// packages/adapters/src/storage/async-storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

export const asyncStorageAdapter: StorageAdapter = {
  async get<T>(key: string) {
    const value = await AsyncStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },
  async set<T>(key: string, value: T) {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  },
  async remove(key: string) {
    await AsyncStorage.removeItem(key)
  },
  async clear() {
    await AsyncStorage.clear()
  },
}
```

---

## 5. Native Module Integration

### File System Access

```typescript
// services/filesystem.ts
import RNFS from 'react-native-fs'

const TRANSLATIONS_DIR = `${RNFS.DocumentDirectoryPath}/translations`

export async function downloadTranslation(id: string, url: string) {
  await RNFS.mkdir(TRANSLATIONS_DIR)

  const destPath = `${TRANSLATIONS_DIR}/${id}.json`

  const result = await RNFS.downloadFile({
    fromUrl: url,
    toFile: destPath,
    progress: (res) => {
      const progress = res.bytesWritten / res.contentLength
      updateDownloadProgress(id, progress)
    },
  }).promise

  return result.statusCode === 200
}

export async function loadTranslation(id: string) {
  const path = `${TRANSLATIONS_DIR}/${id}.json`
  const content = await RNFS.readFile(path, 'utf8')
  return JSON.parse(content)
}
```

### SQLite for Large Data

```typescript
// services/database.ts
import SQLite from 'react-native-sqlite-storage'

SQLite.enablePromise(true)

let db: SQLite.SQLiteDatabase

export async function initDatabase() {
  db = await SQLite.openDatabase({
    name: 'jota.db',
    location: 'default',
  })

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS verses (
      id INTEGER PRIMARY KEY,
      translation TEXT,
      book INTEGER,
      chapter INTEGER,
      verse INTEGER,
      text TEXT
    )
  `)

  await db.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_verses_ref
    ON verses(translation, book, chapter)
  `)
}

export async function getChapter(
  translation: string,
  book: number,
  chapter: number
): Promise<string[]> {
  const [result] = await db.executeSql(
    `SELECT verse, text FROM verses
     WHERE translation = ? AND book = ? AND chapter = ?
     ORDER BY verse`,
    [translation, book, chapter]
  )

  return result.rows.raw().map(row => row.text)
}
```

---

## 6. Error Handling & Logging

### Error Boundary

```typescript
// components/ErrorBoundary.tsx
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { View, Text, Button } from 'react-native'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{error.message}</Text>
      <Button title="Try again" onPress={resetErrorBoundary} />
    </View>
  )
}

export function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        // Log to crash reporting service
        logError(error, info)
      }}
      onReset={() => {
        // Reset app state if needed
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
```

### Logging Service

```typescript
// services/logger.ts
import { logger, consoleTransport } from 'react-native-logs'

const log = logger.createLogger({
  transport: __DEV__ ? consoleTransport : crashlyticsTransport,
  severity: __DEV__ ? 'debug' : 'warn',
  transportOptions: {
    colors: 'ansi',
  },
})

export const Logger = {
  debug: (message: string, data?: object) => log.debug(message, data),
  info: (message: string, data?: object) => log.info(message, data),
  warn: (message: string, data?: object) => log.warn(message, data),
  error: (message: string, error?: Error) => log.error(message, error),
}
```

---

## 7. Testing Strategy

### Unit Tests (Jest)

```typescript
// __tests__/stores/translation-store.test.ts
import { renderHook, act } from '@testing-library/react-hooks'
import { useTranslationStore } from '../../src/stores/translation-store'

describe('TranslationStore', () => {
  beforeEach(() => {
    useTranslationStore.setState({
      currentTranslation: 'ESV',
      downloadedTranslations: [],
    })
  })

  it('should set current translation', () => {
    const { result } = renderHook(() => useTranslationStore())

    act(() => {
      result.current.setCurrentTranslation('NIV')
    })

    expect(result.current.currentTranslation).toBe('NIV')
  })
})
```

### Component Tests

```typescript
// __tests__/components/VerseText.test.tsx
import { render, screen } from '@testing-library/react-native'
import { VerseText } from '../../src/components/bible/VerseText'

describe('VerseText', () => {
  it('renders verse number and text', () => {
    render(<VerseText number={16} text="For God so loved the world" />)

    expect(screen.getByText('16')).toBeTruthy()
    expect(screen.getByText(/For God so loved/)).toBeTruthy()
  })
})
```

### E2E Tests (Detox)

```typescript
// e2e/bible-reading.test.ts
describe('Bible Reading', () => {
  beforeAll(async () => {
    await device.launchApp()
  })

  it('should navigate to Genesis 1', async () => {
    await element(by.id('bible-tab')).tap()
    await element(by.id('book-picker')).tap()
    await element(by.text('Genesis')).tap()
    await element(by.text('1')).tap()

    await expect(element(by.text('In the beginning'))).toBeVisible()
  })
})
```

---

## 8. Build & Deployment

### Build Variants

```groovy
// android/app/build.gradle
android {
    buildTypes {
        debug {
            applicationIdSuffix ".debug"
        }
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt')
        }
    }

    flavorDimensions "environment"
    productFlavors {
        development {
            applicationIdSuffix ".dev"
        }
        staging {
            applicationIdSuffix ".staging"
        }
        production {
            // No suffix
        }
    }
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/mobile.yml
name: Mobile Build

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - run: cd android && ./gradlew assembleRelease

  build-ios:
    needs: test
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - run: cd ios && pod install
      - run: xcodebuild -workspace ios/Jota.xcworkspace -scheme Jota
```

---

## Sources

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Jotai](https://jotai.org/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Detox E2E Testing](https://wix.github.io/Detox/)
