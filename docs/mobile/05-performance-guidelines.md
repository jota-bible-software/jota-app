# Performance Guidelines

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document provides performance guidelines for the Jota mobile app, covering startup optimization, memory management, list virtualization, asset optimization, and battery considerations.

---

## 1. Startup Time Optimization

### Target Metrics

| Metric | Target | Critical |
|--------|--------|----------|
| Cold start (first launch) | < 2s | < 4s |
| Warm start (from background) | < 500ms | < 1s |
| Time to interactive | < 1.5s | < 3s |
| First meaningful paint | < 1s | < 2s |

### Lazy Loading Strategy

```typescript
// App.tsx - Deferred loading pattern
import { lazy, Suspense } from 'react'

// Core screens load immediately
import { HomeScreen } from './screens/Home'
import { BibleReaderScreen } from './screens/BibleReader'

// Secondary screens load lazily
const SearchScreen = lazy(() => import('./screens/Search'))
const LibraryScreen = lazy(() => import('./screens/Library'))
const SettingsScreen = lazy(() => import('./screens/Settings'))

function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bible" component={BibleReaderScreen} />
      <Tab.Screen
        name="Search"
        component={() => (
          <Suspense fallback={<ScreenSkeleton />}>
            <SearchScreen />
          </Suspense>
        )}
      />
      {/* ... */}
    </Tab.Navigator>
  )
}
```

### Minimal Initial Data

```typescript
// hooks/useAppInitialization.ts

interface InitPhase {
  name: string
  priority: 'critical' | 'important' | 'deferred'
  init: () => Promise<void>
}

const initPhases: InitPhase[] = [
  // Critical - blocks app render
  {
    name: 'settings',
    priority: 'critical',
    init: async () => {
      await loadSettings()
    }
  },
  {
    name: 'lastPosition',
    priority: 'critical',
    init: async () => {
      await loadLastReadingPosition()
    }
  },

  // Important - load ASAP but don't block
  {
    name: 'currentChapter',
    priority: 'important',
    init: async () => {
      await preloadCurrentChapter()
    }
  },
  {
    name: 'highlights',
    priority: 'important',
    init: async () => {
      await loadHighlights()
    }
  },

  // Deferred - load when idle
  {
    name: 'searchIndex',
    priority: 'deferred',
    init: async () => {
      await initializeSearchIndex()
    }
  },
  {
    name: 'translationCatalog',
    priority: 'deferred',
    init: async () => {
      await fetchTranslationCatalog()
    }
  },
]

export function useAppInitialization() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function initialize() {
      // Run critical phases synchronously
      const critical = initPhases.filter(p => p.priority === 'critical')
      for (const phase of critical) {
        await phase.init()
      }

      // App is now usable
      setIsReady(true)

      // Run important phases
      const important = initPhases.filter(p => p.priority === 'important')
      await Promise.all(important.map(p => p.init()))

      // Run deferred phases when idle
      const deferred = initPhases.filter(p => p.priority === 'deferred')
      requestIdleCallback(() => {
        deferred.forEach(p => p.init())
      })
    }

    initialize()
  }, [])

  return { isReady }
}
```

### Hermes Engine Optimization

```javascript
// metro.config.js
module.exports = {
  transformer: {
    // Enable Hermes bytecode compilation
    hermesCommand: 'node_modules/hermes-engine/osx-bin/hermesc',
  },
}

// Enable inline requires for faster startup
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
      },
    }),
  },
}
```

---

## 2. Memory Management

### Memory Budgets

| Category | Budget | Notes |
|----------|--------|-------|
| Base app | 50MB | Core app + framework |
| Active translation | 20-50MB | Depends on translation size |
| Chapter cache | 10MB | Current + adjacent chapters |
| Highlights index | 5MB | Indexed for quick lookup |
| Images/assets | 20MB | Compressed, lazy loaded |
| **Total target** | < 150MB | Android low-end devices |

### Memory Monitoring

```typescript
// utils/memory-monitor.ts
import { NativeModules } from 'react-native'

interface MemoryInfo {
  usedJSHeap: number
  totalJSHeap: number
  nativeHeap: number
}

export async function getMemoryUsage(): Promise<MemoryInfo> {
  if (__DEV__) {
    const info = await NativeModules.MemoryInfo.getInfo()
    return info
  }
  return { usedJSHeap: 0, totalJSHeap: 0, nativeHeap: 0 }
}

export function useMemoryWarning(callback: () => void) {
  useEffect(() => {
    const subscription = NativeModules.MemoryWarning?.addListener(() => {
      callback()
    })

    return () => subscription?.remove()
  }, [callback])
}

// Usage in app
function App() {
  useMemoryWarning(() => {
    // Clear non-essential caches
    clearChapterCache()
    clearSearchCache()
  })
}
```

### Cache Eviction

```typescript
// services/cache/memory-cache.ts

class LRUCache<T> {
  private cache = new Map<string, { value: T; lastAccess: number }>()
  private maxSize: number
  private currentSize = 0

  constructor(maxSizeBytes: number) {
    this.maxSize = maxSizeBytes
  }

  set(key: string, value: T, sizeBytes: number) {
    // Evict if needed
    while (this.currentSize + sizeBytes > this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, {
      value,
      lastAccess: Date.now(),
      size: sizeBytes
    })
    this.currentSize += sizeBytes
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key)
    if (entry) {
      entry.lastAccess = Date.now()
      return entry.value
    }
    return undefined
  }

  private evictOldest() {
    let oldestKey: string | null = null
    let oldestTime = Infinity

    for (const [key, entry] of this.cache) {
      if (entry.lastAccess < oldestTime) {
        oldestTime = entry.lastAccess
        oldestKey = key
      }
    }

    if (oldestKey) {
      const entry = this.cache.get(oldestKey)
      this.currentSize -= entry?.size ?? 0
      this.cache.delete(oldestKey)
    }
  }

  clear() {
    this.cache.clear()
    this.currentSize = 0
  }
}

export const chapterCache = new LRUCache<ChapterData>(10 * 1024 * 1024) // 10MB
```

---

## 3. List Virtualization

### FlashList Configuration

```typescript
// components/ChapterView.tsx
import { FlashList } from '@shopify/flash-list'

interface VerseData {
  id: string
  number: number
  text: string
  highlight?: HighlightColor
}

export function ChapterView({ verses }: { verses: VerseData[] }) {
  const renderVerse = useCallback(({ item }: { item: VerseData }) => (
    <VerseRow {...item} />
  ), [])

  const keyExtractor = useCallback((item: VerseData) => item.id, [])

  return (
    <FlashList
      data={verses}
      renderItem={renderVerse}
      keyExtractor={keyExtractor}
      estimatedItemSize={80} // Average verse height

      // Performance optimizations
      drawDistance={500} // Render 500px ahead
      overrideItemLayout={(layout, item, index) => {
        // Provide accurate sizes if known
        layout.size = estimateVerseHeight(item.text)
      }}

      // Reduce re-renders
      extraData={null} // Only update when data changes

      // Memory optimization
      recyclingEnabled={true}

      // Scroll performance
      removeClippedSubviews={true}
    />
  )
}
```

### Memoization Patterns

```typescript
// components/VerseRow.tsx
import React, { memo } from 'react'

interface VerseRowProps {
  number: number
  text: string
  highlight?: HighlightColor
  onPress?: () => void
}

export const VerseRow = memo(
  function VerseRow({ number, text, highlight, onPress }: VerseRowProps) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.container, highlight && { backgroundColor: highlight.hex }]}
      >
        <Text style={styles.number}>{number}</Text>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    )
  },
  // Custom comparison - only re-render when these change
  (prev, next) => (
    prev.number === next.number &&
    prev.text === next.text &&
    prev.highlight?.id === next.highlight?.id
  )
)
```

### Scroll Performance

```typescript
// hooks/useOptimizedScroll.ts
import { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated'

export function useOptimizedScroll(onScrollEnd?: (offset: number) => void) {
  const scrollY = useSharedValue(0)
  const isScrolling = useSharedValue(false)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
    onBeginDrag: () => {
      isScrolling.value = true
    },
    onEndDrag: () => {
      isScrolling.value = false
    },
    onMomentumEnd: (event) => {
      if (onScrollEnd) {
        runOnJS(onScrollEnd)(event.contentOffset.y)
      }
    },
  })

  return { scrollY, isScrolling, scrollHandler }
}
```

---

## 4. Image & Asset Optimization

### Image Compression

```typescript
// utils/image-utils.ts
import { Image } from 'react-native'

// Preload critical images at app start
export function preloadImages() {
  const criticalImages = [
    require('../assets/icons/home.png'),
    require('../assets/icons/bible.png'),
    require('../assets/icons/search.png'),
    require('../assets/icons/library.png'),
    require('../assets/icons/profile.png'),
  ]

  criticalImages.forEach(img => {
    Image.prefetch(Image.resolveAssetSource(img).uri)
  })
}
```

### SVG Icons

```typescript
// components/Icon.tsx
import { SvgXml } from 'react-native-svg'

// Use SVG for icons - smaller file size, better scaling
const icons = {
  home: `<svg viewBox="0 0 24 24">...</svg>`,
  bible: `<svg viewBox="0 0 24 24">...</svg>`,
  search: `<svg viewBox="0 0 24 24">...</svg>`,
}

export function Icon({ name, size = 24, color = '#000' }: IconProps) {
  const xml = icons[name]

  return (
    <SvgXml
      xml={xml}
      width={size}
      height={size}
      color={color}
    />
  )
}
```

### Asset Bundle Strategy

```
┌─────────────────────────────────────────────────────┐
│  Asset Loading Strategy                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Bundled (in APK/IPA):                             │
│  ├── App icons & splash                            │
│  ├── UI icons (SVG)                                │
│  ├── Default translation (ESV/KJV)                 │
│  └── Onboarding images                             │
│                                                     │
│  Downloaded on demand:                              │
│  ├── Additional translations                       │
│  ├── Audio files                                   │
│  ├── Reading plan images                           │
│  └── User profile images                           │
│                                                     │
│  CDN with caching:                                  │
│  ├── Translation catalog                           │
│  ├── Reading plan metadata                         │
│  └── App announcements                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 5. Render Optimization

### Avoid Unnecessary Re-renders

```typescript
// hooks/useStableCallback.ts
import { useCallback, useRef } from 'react'

// Creates a stable callback that always calls the latest function
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args)
  }, []) as T
}
```

```typescript
// components/BibleReader.tsx

function BibleReader() {
  // Bad: Creates new functions on every render
  // const handleVersePress = (verse: number) => { ... }

  // Good: Stable callback reference
  const handleVersePress = useStableCallback((verse: number) => {
    selectVerse(verse)
  })

  // Bad: Inline object style
  // <View style={{ padding: 16 }}>

  // Good: Cached style
  // <View style={styles.container}>

  return (
    <ChapterView
      verses={verses}
      onVersePress={handleVersePress}
    />
  )
}

// Styles outside component to prevent recreation
const styles = StyleSheet.create({
  container: { padding: 16 },
})
```

### Component Splitting

```typescript
// Bad: Monolithic component
function BibleScreen() {
  const [chapter, setChapter] = useState<ChapterData>()
  const [selectedVerse, setSelectedVerse] = useState<number>()
  const [showActionSheet, setShowActionSheet] = useState(false)

  // Any state change re-renders everything
  return (
    <View>
      <Header chapter={chapter} />
      <ChapterView verses={chapter?.verses} />
      <ActionSheet visible={showActionSheet} />
    </View>
  )
}

// Good: Split into focused components
function BibleScreen() {
  return (
    <View>
      <ChapterHeader />  {/* Has its own state */}
      <ChapterContent /> {/* Has its own state */}
      <VerseActionSheet /> {/* Has its own state */}
    </View>
  )
}

function ChapterContent() {
  // Only this component re-renders when chapter changes
  const chapter = useChapter()
  return <ChapterView verses={chapter?.verses} />
}
```

---

## 6. Network Optimization

### Request Batching

```typescript
// services/api/batch-loader.ts
import DataLoader from 'dataloader'

// Batch chapter requests into single network call
const chapterLoader = new DataLoader<string, ChapterData>(
  async (keys) => {
    // keys = ['ESV:1:1', 'ESV:1:2', 'ESV:1:3']
    const chapters = await fetchChaptersBatch(keys)
    return keys.map(key => chapters[key])
  },
  {
    maxBatchSize: 10,
    batchScheduleFn: (callback) => setTimeout(callback, 50),
  }
)

export function loadChapter(translation: string, book: number, chapter: number) {
  const key = `${translation}:${book}:${chapter}`
  return chapterLoader.load(key)
}
```

### Request Deduplication

```typescript
// services/api/request-cache.ts

const pendingRequests = new Map<string, Promise<any>>()

export async function dedupedFetch<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  // Return existing promise if request is in flight
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!
  }

  const promise = fetcher().finally(() => {
    pendingRequests.delete(key)
  })

  pendingRequests.set(key, promise)
  return promise
}
```

---

## 7. Battery Optimization

### Reduce Background Activity

```typescript
// services/background/battery-aware.ts
import * as Battery from 'expo-battery'

export async function shouldRunBackgroundTask(): Promise<boolean> {
  const batteryLevel = await Battery.getBatteryLevelAsync()
  const batteryState = await Battery.getBatteryStateAsync()

  // Don't run background tasks if:
  // - Battery below 20%
  // - Not charging and below 50%
  if (batteryLevel < 0.2) {
    return false
  }

  if (batteryState !== Battery.BatteryState.CHARGING && batteryLevel < 0.5) {
    return false
  }

  return true
}

export function useBatteryAwareSync() {
  const [canSync, setCanSync] = useState(true)

  useEffect(() => {
    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setCanSync(batteryLevel > 0.2)
    })

    return () => subscription.remove()
  }, [])

  return canSync
}
```

### Efficient Location Updates

```typescript
// For Bible.IS or location-based features
import * as Location from 'expo-location'

// Bad: Continuous high-accuracy updates
// Location.watchPositionAsync({ accuracy: Location.Accuracy.Highest })

// Good: Low accuracy, infrequent updates
export async function getApproximateLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync()

  if (status !== 'granted') {
    return null
  }

  return Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Low, // ~3km accuracy, very low battery
  })
}
```

### Debounce Expensive Operations

```typescript
// hooks/useDebouncedSave.ts
import { useDebouncedCallback } from 'use-debounce'

export function useDebouncedSave<T>(
  save: (data: T) => Promise<void>,
  delay: number = 1000
) {
  const debouncedSave = useDebouncedCallback(save, delay)

  // Also save on unmount
  useEffect(() => {
    return () => {
      debouncedSave.flush()
    }
  }, [])

  return debouncedSave
}

// Usage
function BibleReader() {
  const savePosition = useDebouncedSave(
    (position: ReadingPosition) => saveReadingPosition(position),
    2000 // Save at most every 2 seconds
  )

  const handleScroll = (offset: number) => {
    savePosition({ ...currentPosition, offset })
  }
}
```

---

## 8. Profiling & Monitoring

### Performance Monitoring Setup

```typescript
// services/monitoring/performance.ts
import perf from '@react-native-firebase/perf'

export async function measureStartup() {
  const trace = await perf().startTrace('app_startup')

  return {
    markPhase: (name: string) => {
      trace.putMetric(name, Date.now())
    },
    finish: async () => {
      await trace.stop()
    },
  }
}

// Usage
async function initApp() {
  const startup = await measureStartup()

  await loadSettings()
  startup.markPhase('settings_loaded')

  await loadLastPosition()
  startup.markPhase('position_loaded')

  await startup.finish()
}
```

### Frame Rate Monitoring

```typescript
// utils/fps-monitor.ts (DEV only)

export function useFPSMonitor() {
  const [fps, setFps] = useState(60)

  useEffect(() => {
    if (!__DEV__) return

    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        setFps(Math.round(frameCount * 1000 / (currentTime - lastTime)))
        frameCount = 0
        lastTime = currentTime
      }

      animationId = requestAnimationFrame(measureFPS)
    }

    animationId = requestAnimationFrame(measureFPS)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return fps
}
```

### Memory Leak Detection

```typescript
// utils/leak-detector.ts (DEV only)

const componentMounts = new Map<string, number>()

export function useLeakDetector(componentName: string) {
  useEffect(() => {
    const count = (componentMounts.get(componentName) ?? 0) + 1
    componentMounts.set(componentName, count)

    if (count > 10) {
      console.warn(`Potential leak: ${componentName} mounted ${count} times`)
    }

    return () => {
      componentMounts.set(componentName, count - 1)
    }
  }, [componentName])
}
```

---

## 9. Build Optimization

### Bundle Size Analysis

```bash
# Generate bundle analysis
npx react-native-bundle-visualizer

# Analyze with source-map-explorer
npx source-map-explorer android/app/build/generated/sourcemaps/react/release/index.android.bundle.map
```

### Tree Shaking

```javascript
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // Enable tree shaking for lodash
    ['babel-plugin-lodash'],

    // Transform imports for smaller bundle
    ['transform-imports', {
      'lodash': {
        transform: 'lodash/${member}',
        preventFullImport: true,
      },
    }],
  ],
}
```

### ProGuard Rules

```proguard
# android/app/proguard-rules.pro

# Keep Bible data models
-keep class com.jota.models.** { *; }

# Keep Hermes bytecode
-keep class com.facebook.hermes.unicode.** { *; }

# Minimize logging in release
-assumenosideeffects class android.util.Log {
    public static int d(...);
    public static int v(...);
}
```

---

## Sources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [FlashList Performance](https://shopify.github.io/flash-list/docs/performance)
- [Hermes Engine](https://hermesengine.dev/)
- [React Native Firebase Performance](https://rnfirebase.io/perf/usage)
- [Memory Management in React Native](https://reactnative.dev/docs/memory)
