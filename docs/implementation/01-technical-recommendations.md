# Implementation: Technical Recommendations

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document provides technical recommendations for implementing the Jota mobile app using React Native, including architecture decisions, library choices, and integration strategies.

---

## 1. Project Setup

### 1.1 React Native Framework

```
RECOMMENDED: React Native CLI (bare workflow)

Rationale:
- Full native module access for audio, camera OCR
- Better performance optimization control
- Easier integration with existing @jota/core package
- More flexibility for custom native features

Alternative: Expo (managed workflow)
- Faster initial development
- Limited native module access
- May need to eject for advanced features
```

### 1.2 Project Structure

```
jota-mobile/
├── src/
│   ├── app/                    # App entry, navigation
│   │   ├── App.tsx
│   │   ├── navigation/
│   │   │   ├── RootNavigator.tsx
│   │   │   ├── TabNavigator.tsx
│   │   │   └── stacks/
│   │   └── providers/
│   │       ├── ThemeProvider.tsx
│   │       └── QueryProvider.tsx
│   │
│   ├── features/               # Feature-based modules
│   │   ├── bible/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── screens/
│   │   │   └── stores/
│   │   ├── search/
│   │   ├── highlights/
│   │   ├── audio/
│   │   ├── settings/
│   │   └── onboarding/
│   │
│   ├── shared/                 # Shared utilities
│   │   ├── components/         # UI components
│   │   ├── hooks/              # Shared hooks
│   │   ├── utils/              # Utilities
│   │   └── types/              # TypeScript types
│   │
│   ├── design-system/          # Design tokens
│   │   ├── tokens/
│   │   ├── theme/
│   │   └── components/
│   │
│   └── services/               # External services
│       ├── api/
│       ├── storage/
│       └── analytics/
│
├── android/                    # Android native
├── ios/                        # iOS native
├── assets/                     # Static assets
└── __tests__/                  # Tests
```

### 1.3 TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["esnext"],
    "jsx": "react-native",
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@jota/core": ["../packages/core/src"],
      "@jota/adapters": ["../packages/adapters/src"]
    }
  }
}
```

---

## 2. Core Library Integration

### 2.1 Monorepo Integration

```
CURRENT MONOREPO:
jota-app/
├── packages/
│   ├── core/           # @jota/core - Bible logic
│   └── adapters/       # @jota/adapters - Platform adapters
├── apps/
│   └── web/            # Current Vue.js web app
└── jota-mobile/        # NEW: React Native app
```

### 2.2 Shared Package Strategy

```typescript
// @jota/core - Already available functionality:

// Bible data handling
import { getVerse, getChapter, getBook } from '@jota/core';

// Reference parsing (jota-parser)
import { parseReference, formatReference } from '@jota/core';

// Search functionality
import { searchBible, SearchOptions } from '@jota/core';

// Format templates
import { formatPassage, FormatTemplate } from '@jota/core';

// Highlight logic
import { mergeHighlights, sortHighlights } from '@jota/core';
```

### 2.3 Platform Adapter Pattern

```typescript
// @jota/adapters - Platform-specific implementations

// Web adapter (existing)
import { WebStorageAdapter } from '@jota/adapters/web';

// Mobile adapter (new)
import { MobileStorageAdapter } from '@jota/adapters/mobile';

// Interface definition
interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

// Mobile implementation
export class MobileStorageAdapter implements StorageAdapter {
  async getItem(key: string) {
    return AsyncStorage.getItem(key);
  }
  // ... other methods
}
```

---

## 3. State Management

### 3.1 Recommended: Zustand

```typescript
// Zustand for global state (similar to current Pinia setup)

// stores/bible-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BibleState {
  currentTranslation: string;
  currentPassage: Passage;
  setTranslation: (id: string) => void;
  setPassage: (passage: Passage) => void;
}

export const useBibleStore = create<BibleState>()(
  persist(
    (set) => ({
      currentTranslation: 'ESV',
      currentPassage: [0, 0, 1], // Genesis 1:1

      setTranslation: (id) => set({ currentTranslation: id }),
      setPassage: (passage) => set({ currentPassage: passage }),
    }),
    {
      name: 'bible-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 3.2 React Query for Server State

```typescript
// Data fetching with React Query

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Translation data fetching
export function useTranslation(translationId: string) {
  return useQuery({
    queryKey: ['translation', translationId],
    queryFn: () => loadTranslation(translationId),
    staleTime: Infinity, // Bible data doesn't change
    gcTime: Infinity,    // Keep in cache forever
  });
}

// Chapter prefetching
export function usePrefetchChapter(translationId: string, passage: Passage) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch next chapter
    const nextPassage = getNextChapter(passage);
    queryClient.prefetchQuery({
      queryKey: ['chapter', translationId, nextPassage],
      queryFn: () => loadChapter(translationId, nextPassage),
    });
  }, [passage]);
}
```

### 3.3 State Architecture

```
STATE ARCHITECTURE:

┌─────────────────────────────────────────────────────┐
│                    React Query                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│  │ Translations│ │  Chapters   │ │   Search    │    │
│  │   (cached)  │ │  (cached)   │ │  (fresh)    │    │
│  └─────────────┘ └─────────────┘ └─────────────┘    │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                      Zustand                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│  │   Bible     │ │  Highlight  │ │  Settings   │    │
│  │   Store     │ │   Store     │ │   Store     │    │
│  └─────────────┘ └─────────────┘ └─────────────┘    │
│         │               │               │           │
│         └───────────────┼───────────────┘           │
│                         ▼                           │
│              ┌─────────────────┐                    │
│              │  AsyncStorage   │                    │
│              │  (persistence)  │                    │
│              └─────────────────┘                    │
└─────────────────────────────────────────────────────┘
```

---

## 4. Navigation

### 4.1 React Navigation Setup

```typescript
// navigation/RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bible" component={BibleStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Library" component={LibraryStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Reader"
          component={ReaderScreen}
          options={{ presentation: 'fullScreenModal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 4.2 Deep Linking

```typescript
// Deep linking configuration
const linking = {
  prefixes: ['jota://', 'https://jota.app'],
  config: {
    screens: {
      Main: {
        screens: {
          Bible: {
            path: 'bible',
            screens: {
              Reader: 'read/:book/:chapter',
            },
          },
          Search: 'search',
        },
      },
      Reader: 'read/:translation/:book/:chapter/:verse?',
    },
  },
};

// Usage: jota://read/ESV/John/3/16
// Opens: ESV translation, John 3:16
```

---

## 5. Data Storage

### 5.1 Storage Strategy

```
STORAGE LAYERS:

┌─────────────────────────────────────────────────────┐
│                   Memory Cache                       │
│  ┌─────────────────────────────────────────────┐    │
│  │  Current chapter, recent searches, etc.     │    │
│  │  Fast access, cleared on app close          │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                   AsyncStorage                       │
│  ┌─────────────────────────────────────────────┐    │
│  │  User preferences, settings, last position  │    │
│  │  Small key-value pairs, persistent          │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                     SQLite                          │
│  ┌─────────────────────────────────────────────┐    │
│  │  Highlights, notes, reading plans, history  │    │
│  │  Relational data, queryable, indexed        │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                   File System                        │
│  ┌─────────────────────────────────────────────┐    │
│  │  Downloaded translations (JSON/binary)      │    │
│  │  Large files, cached, deletable             │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 5.2 SQLite Schema

```sql
-- Highlights table
CREATE TABLE highlights (
  id TEXT PRIMARY KEY,
  translation_id TEXT NOT NULL,
  book_index INTEGER NOT NULL,
  chapter_index INTEGER NOT NULL,
  start_verse INTEGER NOT NULL,
  end_verse INTEGER,
  color TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  synced INTEGER DEFAULT 0
);

CREATE INDEX idx_highlights_passage
  ON highlights(translation_id, book_index, chapter_index);

-- Reading history
CREATE TABLE reading_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  translation_id TEXT NOT NULL,
  book_index INTEGER NOT NULL,
  chapter_index INTEGER NOT NULL,
  read_at INTEGER NOT NULL,
  duration_seconds INTEGER
);

CREATE INDEX idx_history_date ON reading_history(read_at DESC);

-- Search history
CREATE TABLE search_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  query_type TEXT NOT NULL, -- 'reference' or 'text'
  searched_at INTEGER NOT NULL
);
```

### 5.3 Translation Storage

```typescript
// Translation file storage using RNFS
import RNFS from 'react-native-fs';

const TRANSLATIONS_DIR = `${RNFS.DocumentDirectoryPath}/translations`;

async function downloadTranslation(id: string): Promise<void> {
  const url = `https://api.jota.app/translations/${id}.json`;
  const path = `${TRANSLATIONS_DIR}/${id}.json`;

  await RNFS.mkdir(TRANSLATIONS_DIR);

  const download = RNFS.downloadFile({
    fromUrl: url,
    toFile: path,
    progress: (res) => {
      const progress = res.bytesWritten / res.contentLength;
      updateDownloadProgress(id, progress);
    },
  });

  await download.promise;
}

async function loadTranslation(id: string): Promise<TranslationFile> {
  const path = `${TRANSLATIONS_DIR}/${id}.json`;
  const content = await RNFS.readFile(path, 'utf8');
  return JSON.parse(content);
}
```

---

## 6. Performance Optimization

### 6.1 List Virtualization

```typescript
// Use FlashList for large lists
import { FlashList } from '@shopify/flash-list';

function ChapterList({ verses }: { verses: Verse[] }) {
  return (
    <FlashList
      data={verses}
      renderItem={({ item }) => <VerseItem verse={item} />}
      estimatedItemSize={60}
      keyExtractor={(item) => `verse-${item.number}`}
      getItemType={(item) => (item.isParagraphStart ? 'paragraph' : 'verse')}
    />
  );
}
```

### 6.2 Memoization Strategy

```typescript
// Memoize expensive computations
import { useMemo, useCallback, memo } from 'react';

// Memoize verse rendering
const VerseItem = memo(function VerseItem({ verse, highlight }: Props) {
  const formattedText = useMemo(
    () => formatVerseText(verse.text),
    [verse.text]
  );

  return (
    <VerseContainer highlight={highlight}>
      <VerseNumber>{verse.number}</VerseNumber>
      <VerseText>{formattedText}</VerseText>
    </VerseContainer>
  );
});

// Memoize callbacks
const handleVersePress = useCallback((verse: Verse) => {
  selectVerse(verse);
}, [selectVerse]);
```

### 6.3 Bundle Optimization

```javascript
// metro.config.js
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true, // Enable inline requires
      },
    }),
  },
};

// Lazy load heavy screens
const AudioPlayer = React.lazy(() => import('./screens/AudioPlayer'));
const CameraOCR = React.lazy(() => import('./screens/CameraOCR'));
```

---

## 7. Native Modules

### 7.1 Required Native Capabilities

| Feature | iOS Library | Android Library |
|---------|-------------|-----------------|
| Audio playback | AVFoundation | ExoPlayer |
| Camera OCR | Vision Framework | ML Kit |
| File system | FileManager | SAF |
| Background tasks | BGTaskScheduler | WorkManager |
| Share extension | Share Extension | Share Intent |

### 7.2 Audio Player Integration

```typescript
// react-native-track-player setup
import TrackPlayer from 'react-native-track-player';

// service.js (background service)
module.exports = async function() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () => playNextChapter());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => playPrevChapter());
};

// Usage in app
async function playChapter(translation: string, book: number, chapter: number) {
  const audioUrl = getAudioUrl(translation, book, chapter);

  await TrackPlayer.add({
    id: `${book}-${chapter}`,
    url: audioUrl,
    title: formatChapterName(book, chapter),
    artist: translation,
  });

  await TrackPlayer.play();
}
```

### 7.3 Camera OCR Integration

```typescript
// Using react-native-vision-camera + ML Kit
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useFrameProcessor } from 'react-native-vision-camera';
import { scanOCR } from 'vision-camera-ocr';

function CameraOCRScreen() {
  const devices = useCameraDevices();
  const device = devices.back;

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const result = scanOCR(frame);

    // Extract Bible references from detected text
    const references = extractReferences(result.text);

    if (references.length > 0) {
      runOnJS(handleReferencesDetected)(references);
    }
  }, []);

  return (
    <Camera
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      style={StyleSheet.absoluteFill}
    />
  );
}
```

---

## 8. Testing Strategy

### 8.1 Testing Pyramid

```
TESTING LEVELS:

                    ┌─────────┐
                   ╱           ╲
                  ╱   E2E       ╲    ~10%
                 ╱   (Detox)    ╲
                ╱─────────────────╲
               ╱                   ╲
              ╱   Integration       ╲   ~20%
             ╱   (React Testing     ╲
            ╱      Library)          ╲
           ╱───────────────────────────╲
          ╱                             ╲
         ╱         Unit Tests            ╲  ~70%
        ╱     (Jest + @jota/core)         ╲
       ╱───────────────────────────────────╲
```

### 8.2 Unit Testing

```typescript
// __tests__/stores/bible-store.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useBibleStore } from '@/stores/bible-store';

describe('BibleStore', () => {
  beforeEach(() => {
    useBibleStore.getState().reset();
  });

  it('should set current passage', () => {
    const { result } = renderHook(() => useBibleStore());

    act(() => {
      result.current.setPassage([42, 2, 16]); // John 3:16
    });

    expect(result.current.currentPassage).toEqual([42, 2, 16]);
  });
});
```

### 8.3 E2E Testing with Detox

```typescript
// e2e/bible-reading.test.ts
describe('Bible Reading', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should navigate to a chapter', async () => {
    await element(by.id('bible-tab')).tap();
    await element(by.id('chapter-picker')).tap();
    await element(by.text('John')).tap();
    await element(by.text('3')).tap();

    await expect(element(by.id('chapter-header'))).toHaveText('John 3');
    await expect(element(by.id('verse-16'))).toBeVisible();
  });

  it('should highlight a verse', async () => {
    await element(by.id('verse-16')).longPress();
    await element(by.id('highlight-yellow')).tap();

    await expect(element(by.id('verse-16'))).toHaveStyle({
      backgroundColor: '#FEF08A',
    });
  });
});
```

---

## 9. CI/CD Pipeline

### 9.1 GitHub Actions Workflow

```yaml
# .github/workflows/mobile.yml
name: Mobile CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm test:unit
      - run: pnpm lint

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'

      - run: pnpm install
      - run: cd android && ./gradlew assembleRelease

      - uses: actions/upload-artifact@v4
        with:
          name: android-apk
          path: android/app/build/outputs/apk/release/

  build-ios:
    needs: test
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: cd ios && pod install
      - run: xcodebuild -workspace ios/Jota.xcworkspace
             -scheme Jota -configuration Release
             -archivePath build/Jota.xcarchive archive
```

### 9.2 Release Process

```
RELEASE WORKFLOW:

1. Feature Development
   └── Feature branches → PR to develop

2. Release Candidate
   └── develop → release/x.y.z branch
   └── QA testing, bug fixes

3. Production Release
   └── release/x.y.z → main
   └── Tag version
   └── CI builds production apps
   └── Deploy to App Store / Play Store

4. Hotfix (if needed)
   └── hotfix/x.y.z → main + develop
```

---

## 10. Recommended Libraries

### 10.1 Core Dependencies

| Category | Library | Purpose |
|----------|---------|---------|
| Navigation | @react-navigation/native | Screen navigation |
| State | zustand | Global state management |
| Data fetching | @tanstack/react-query | Server state caching |
| Storage | @react-native-async-storage | Key-value storage |
| Database | react-native-sqlite-storage | Local database |
| File system | react-native-fs | File operations |

### 10.2 UI Libraries

| Category | Library | Purpose |
|----------|---------|---------|
| Lists | @shopify/flash-list | Performant lists |
| Gestures | react-native-gesture-handler | Touch gestures |
| Animations | react-native-reanimated | Animations |
| Bottom sheets | @gorhom/bottom-sheet | Bottom sheets |
| Safe area | react-native-safe-area-context | Safe areas |

### 10.3 Feature Libraries

| Category | Library | Purpose |
|----------|---------|---------|
| Audio | react-native-track-player | Audio playback |
| Camera | react-native-vision-camera | Camera access |
| OCR | vision-camera-ocr | Text recognition |
| Sharing | react-native-share | Share content |
| Haptics | react-native-haptic-feedback | Haptic feedback |

---

## 11. Security Considerations

### 11.1 Data Protection

```typescript
// Sensitive data encryption
import EncryptedStorage from 'react-native-encrypted-storage';

// Store user credentials securely
async function storeUserToken(token: string) {
  await EncryptedStorage.setItem('auth_token', token);
}

// Certificate pinning for API calls
import { createAxiosInstance } from '@/services/api';

const api = createAxiosInstance({
  sslPinning: {
    certs: ['sha256/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'],
  },
});
```

### 11.2 Security Checklist

- [ ] Use HTTPS for all API calls
- [ ] Implement certificate pinning
- [ ] Store sensitive data in encrypted storage
- [ ] Validate and sanitize user input
- [ ] Implement proper authentication flow
- [ ] Use ProGuard/R8 for Android obfuscation
- [ ] Disable debugging in production builds
- [ ] Implement app integrity checks

---

## 12. Monitoring & Analytics

### 12.1 Crash Reporting

```typescript
// Firebase Crashlytics setup
import crashlytics from '@react-native-firebase/crashlytics';

// Log user context
crashlytics().setUserId(userId);
crashlytics().setAttributes({
  translation: currentTranslation,
  theme: currentTheme,
});

// Error boundary integration
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, info: ErrorInfo) {
    crashlytics().recordError(error);
    crashlytics().log(`Component stack: ${info.componentStack}`);
  }
}
```

### 12.2 Performance Monitoring

```typescript
// Firebase Performance Monitoring
import perf from '@react-native-firebase/perf';

// Track translation loading
async function loadTranslation(id: string) {
  const trace = await perf().startTrace('load_translation');
  trace.putAttribute('translation_id', id);

  try {
    const data = await fetchTranslation(id);
    trace.putMetric('file_size_kb', data.length / 1024);
    return data;
  } finally {
    await trace.stop();
  }
}

// Track screen rendering
function BibleReader() {
  const screenTrace = useScreenTrace('BibleReader');

  useEffect(() => {
    screenTrace.start();
    return () => screenTrace.stop();
  }, []);
}
```

