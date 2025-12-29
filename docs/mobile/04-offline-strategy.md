# Offline-First Strategy

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document outlines the offline-first architecture for the Jota mobile app, covering translation caching, data synchronization, conflict resolution, and progressive download strategies.

---

## 1. Offline-First Architecture

### Core Principles

1. **Offline by Default**: App works fully without internet
2. **Local First**: All data stored locally, sync is optional
3. **Resilient**: Graceful degradation when offline
4. **Efficient**: Minimal bandwidth usage
5. **Transparent**: User always knows connectivity status

### Data Priority Tiers

```
┌─────────────────────────────────────────────────────┐
│  Data Priority Tiers                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Tier 1 - Critical (Always Offline)                │
│  ├── Downloaded Bible translations                 │
│  ├── User highlights                               │
│  ├── User notes                                    │
│  ├── Reading position                              │
│  └── App settings                                  │
│                                                     │
│  Tier 2 - Important (Cache When Available)         │
│  ├── Reading plans                                 │
│  ├── Recently viewed chapters                      │
│  ├── Search history                                │
│  └── Book metadata                                 │
│                                                     │
│  Tier 3 - Optional (Online Only)                   │
│  ├── Translation catalog                           │
│  ├── Audio streaming (not downloaded)              │
│  ├── App updates                                   │
│  └── Usage analytics (if enabled)                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 2. Translation File Caching

### Download Strategy

```typescript
// services/translation/download-manager.ts
import RNFS from 'react-native-fs'
import { create } from 'zustand'

const TRANSLATIONS_DIR = `${RNFS.DocumentDirectoryPath}/translations`

interface DownloadState {
  downloads: Record<string, DownloadProgress>
  queue: string[]

  enqueue: (translationId: string) => void
  startDownload: (translationId: string) => Promise<void>
  cancelDownload: (translationId: string) => void
  pauseDownload: (translationId: string) => void
  resumeDownload: (translationId: string) => void
}

interface DownloadProgress {
  translationId: string
  status: 'queued' | 'downloading' | 'paused' | 'completed' | 'failed'
  bytesDownloaded: number
  totalBytes: number
  progress: number
  error?: string
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
  downloads: {},
  queue: [],

  enqueue: (translationId) => {
    set((state) => ({
      queue: [...state.queue, translationId],
      downloads: {
        ...state.downloads,
        [translationId]: {
          translationId,
          status: 'queued',
          bytesDownloaded: 0,
          totalBytes: 0,
          progress: 0,
        },
      },
    }))

    // Start download if no active downloads
    if (get().queue.length === 1) {
      get().startDownload(translationId)
    }
  },

  startDownload: async (translationId) => {
    const manifest = await fetchTranslationManifest(translationId)

    set((state) => ({
      downloads: {
        ...state.downloads,
        [translationId]: {
          ...state.downloads[translationId],
          status: 'downloading',
          totalBytes: manifest.sizeBytes,
        },
      },
    }))

    try {
      // Download in chunks (books)
      for (const book of manifest.books) {
        const bookPath = `${TRANSLATIONS_DIR}/${translationId}/${book.filename}`

        await RNFS.downloadFile({
          fromUrl: book.url,
          toFile: bookPath,
          progress: (res) => {
            const current = get().downloads[translationId]
            set((state) => ({
              downloads: {
                ...state.downloads,
                [translationId]: {
                  ...current,
                  bytesDownloaded: current.bytesDownloaded + res.bytesWritten,
                  progress: (current.bytesDownloaded + res.bytesWritten) / current.totalBytes,
                },
              },
            }))
          },
        }).promise
      }

      // Mark complete
      set((state) => ({
        downloads: {
          ...state.downloads,
          [translationId]: { ...state.downloads[translationId], status: 'completed', progress: 1 },
        },
        queue: state.queue.filter((id) => id !== translationId),
      }))

      // Start next in queue
      const nextId = get().queue[0]
      if (nextId) {
        get().startDownload(nextId)
      }
    } catch (error) {
      set((state) => ({
        downloads: {
          ...state.downloads,
          [translationId]: {
            ...state.downloads[translationId],
            status: 'failed',
            error: error.message
          },
        },
      }))
    }
  },

  // ... other methods
}))
```

### Progressive Download

```typescript
// services/translation/progressive-loader.ts

interface BookDownloadPriority {
  bookIndex: number
  priority: 'high' | 'medium' | 'low'
}

function getDownloadPriority(translationId: string): BookDownloadPriority[] {
  const recentlyViewed = getRecentlyViewedBooks()
  const userHighlights = getHighlightedBooks(translationId)

  return BOOK_ORDER.map((bookIndex) => {
    // High priority: recently viewed or has highlights
    if (recentlyViewed.includes(bookIndex) || userHighlights.includes(bookIndex)) {
      return { bookIndex, priority: 'high' }
    }

    // Medium priority: popular books (Gospels, Psalms, Proverbs)
    if (POPULAR_BOOKS.includes(bookIndex)) {
      return { bookIndex, priority: 'medium' }
    }

    // Low priority: everything else
    return { bookIndex, priority: 'low' }
  })
}

async function downloadTranslationProgressive(translationId: string) {
  const priorities = getDownloadPriority(translationId)

  // Sort by priority
  const sorted = priorities.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.priority] - order[b.priority]
  })

  for (const { bookIndex } of sorted) {
    await downloadBook(translationId, bookIndex)
  }
}
```

### Storage Management

```typescript
// services/storage/manager.ts
import RNFS from 'react-native-fs'

interface StorageInfo {
  totalSpace: number
  freeSpace: number
  translationsSize: number
  audioSize: number
  cacheSize: number
}

export async function getStorageInfo(): Promise<StorageInfo> {
  const [totalSpace, freeSpace] = await Promise.all([
    RNFS.getFSInfo().then((info) => info.totalSpace),
    RNFS.getFSInfo().then((info) => info.freeSpace),
  ])

  const translationsSize = await getDirectorySize(TRANSLATIONS_DIR)
  const audioSize = await getDirectorySize(AUDIO_DIR)
  const cacheSize = await getDirectorySize(CACHE_DIR)

  return {
    totalSpace,
    freeSpace,
    translationsSize,
    audioSize,
    cacheSize,
  }
}

export async function clearCache(): Promise<void> {
  await RNFS.unlink(CACHE_DIR)
  await RNFS.mkdir(CACHE_DIR)
}

export async function deleteTranslation(translationId: string): Promise<void> {
  const path = `${TRANSLATIONS_DIR}/${translationId}`
  await RNFS.unlink(path)
}

async function getDirectorySize(path: string): Promise<number> {
  try {
    const files = await RNFS.readDir(path)
    let size = 0

    for (const file of files) {
      if (file.isDirectory()) {
        size += await getDirectorySize(file.path)
      } else {
        size += file.size
      }
    }

    return size
  } catch {
    return 0
  }
}
```

---

## 3. Highlights & Notes Sync

### Local Storage Structure

```typescript
// stores/highlights/local-storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

const HIGHLIGHTS_KEY = 'highlights_v1'
const SYNC_QUEUE_KEY = 'sync_queue_v1'

interface LocalHighlightData {
  highlights: Record<string, PassageHighlight>
  lastModified: number
  syncedAt: number | null
}

interface SyncQueueItem {
  id: string
  action: 'create' | 'update' | 'delete'
  data: PassageHighlight | null
  timestamp: number
  retryCount: number
}

export async function saveHighlightLocally(highlight: PassageHighlight): Promise<void> {
  const data = await getLocalHighlights()

  data.highlights[highlight.id] = highlight
  data.lastModified = Date.now()

  await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(data))

  // Add to sync queue
  await addToSyncQueue({
    id: highlight.id,
    action: 'create',
    data: highlight,
    timestamp: Date.now(),
    retryCount: 0,
  })
}

export async function addToSyncQueue(item: SyncQueueItem): Promise<void> {
  const queue = await getSyncQueue()

  // Replace existing item for same id
  const filtered = queue.filter((q) => q.id !== item.id)
  filtered.push(item)

  await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filtered))
}
```

### Sync Strategy

```typescript
// services/sync/highlight-sync.ts
import NetInfo from '@react-native-community/netinfo'

interface SyncResult {
  success: boolean
  synced: number
  failed: number
  conflicts: SyncConflict[]
}

interface SyncConflict {
  id: string
  local: PassageHighlight
  remote: PassageHighlight
  resolution: 'local' | 'remote' | 'pending'
}

export async function syncHighlights(): Promise<SyncResult> {
  const netInfo = await NetInfo.fetch()

  if (!netInfo.isConnected) {
    return { success: false, synced: 0, failed: 0, conflicts: [] }
  }

  const queue = await getSyncQueue()
  const conflicts: SyncConflict[] = []
  let synced = 0
  let failed = 0

  for (const item of queue) {
    try {
      if (item.action === 'create' || item.action === 'update') {
        const remoteVersion = await fetchRemoteHighlight(item.id)

        if (remoteVersion && remoteVersion.updatedAt > item.timestamp) {
          // Conflict: remote is newer
          conflicts.push({
            id: item.id,
            local: item.data!,
            remote: remoteVersion,
            resolution: 'pending',
          })
          continue
        }

        await pushHighlight(item.data!)
      } else if (item.action === 'delete') {
        await deleteRemoteHighlight(item.id)
      }

      synced++
      await removeFromSyncQueue(item.id)
    } catch (error) {
      failed++

      // Retry with backoff
      if (item.retryCount < 3) {
        await updateSyncQueueItem(item.id, { retryCount: item.retryCount + 1 })
      }
    }
  }

  return { success: failed === 0, synced, failed, conflicts }
}
```

---

## 4. Conflict Resolution

### Conflict Detection

```typescript
// services/sync/conflict-detection.ts

interface ConflictStrategy {
  type: 'last-write-wins' | 'merge' | 'user-choice'
}

export function detectConflict(
  local: PassageHighlight,
  remote: PassageHighlight
): 'none' | 'local-newer' | 'remote-newer' | 'concurrent' {
  if (local.updatedAt === remote.updatedAt) {
    return 'none'
  }

  if (local.updatedAt > remote.updatedAt) {
    return 'local-newer'
  }

  if (remote.updatedAt > local.updatedAt) {
    return 'remote-newer'
  }

  // Same update time but different content = concurrent edit
  return 'concurrent'
}
```

### Resolution Strategies

```typescript
// services/sync/conflict-resolver.ts

type ConflictResolution = 'keep-local' | 'keep-remote' | 'merge'

interface ResolvedConflict {
  highlightId: string
  resolution: ConflictResolution
  result: PassageHighlight
}

export function autoResolveConflict(
  local: PassageHighlight,
  remote: PassageHighlight,
  strategy: 'last-write-wins' | 'local-first' | 'remote-first'
): ResolvedConflict {
  switch (strategy) {
    case 'last-write-wins':
      if (local.updatedAt >= remote.updatedAt) {
        return { highlightId: local.id, resolution: 'keep-local', result: local }
      }
      return { highlightId: local.id, resolution: 'keep-remote', result: remote }

    case 'local-first':
      return { highlightId: local.id, resolution: 'keep-local', result: local }

    case 'remote-first':
      return { highlightId: local.id, resolution: 'keep-remote', result: remote }
  }
}

export function mergeHighlights(
  local: PassageHighlight,
  remote: PassageHighlight
): PassageHighlight {
  // For highlights, we can merge notes but prefer local color
  return {
    ...local,
    note: mergeNotes(local.note, remote.note),
    updatedAt: Date.now(),
  }
}

function mergeNotes(local?: string, remote?: string): string | undefined {
  if (!local && !remote) return undefined
  if (!local) return remote
  if (!remote) return local
  if (local === remote) return local

  // Append both notes with separator
  return `${local}\n---\n${remote}`
}
```

### User Conflict Resolution UI

```
┌─────────────────────────────────────────────────────┐
│  Conflict Resolution Screen                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Sync Conflict                                      │
│                                                     │
│  This highlight was modified on another device.     │
│                                                     │
│  ┌─────────────┬─────────────┐                     │
│  │ This Device │ Other Device│                     │
│  ├─────────────┼─────────────┤                     │
│  │ Yellow      │ Green       │ ← Color             │
│  │ "Study"     │ "Important" │ ← Note              │
│  │ Today 9:00  │ Today 9:05  │ ← Modified          │
│  └─────────────┴─────────────┘                     │
│                                                     │
│  [Keep This Device] [Keep Other] [Merge Both]      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 5. Background Sync

### Background Task Setup

```typescript
// services/sync/background-sync.ts
import BackgroundFetch from 'react-native-background-fetch'

export async function initBackgroundSync() {
  await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15, // minutes
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
    },
    async (taskId) => {
      console.log('[BackgroundSync] Task started:', taskId)

      try {
        // Sync highlights
        await syncHighlights()

        // Check for translation updates
        await checkTranslationUpdates()

        // Clean up old cache
        await cleanOldCache()
      } catch (error) {
        console.error('[BackgroundSync] Error:', error)
      }

      BackgroundFetch.finish(taskId)
    },
    (taskId) => {
      console.log('[BackgroundSync] Timeout:', taskId)
      BackgroundFetch.finish(taskId)
    }
  )
}

// Register headless task for Android
BackgroundFetch.registerHeadlessTask(async ({ taskId }) => {
  await syncHighlights()
  BackgroundFetch.finish(taskId)
})
```

### Network-Aware Sync

```typescript
// hooks/useNetworkAwareSync.ts
import { useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'

export function useNetworkAwareSync() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        // Network restored, trigger sync
        syncHighlights()

        // If on WiFi, resume large downloads
        if (state.type === 'wifi') {
          resumePausedDownloads()
        }
      }
    })

    return unsubscribe
  }, [])
}
```

---

## 6. Offline Indicators

### Connectivity Status

```typescript
// components/ConnectivityBanner.tsx
import { useNetInfo } from '@react-native-community/netinfo'

export function ConnectivityBanner() {
  const netInfo = useNetInfo()

  if (netInfo.isConnected === null) {
    return null // Still checking
  }

  if (!netInfo.isConnected) {
    return (
      <Animated.View
        entering={SlideInUp}
        exiting={SlideOutUp}
        style={styles.banner}
      >
        <Icon name="wifi-off" size={16} color="white" />
        <Text style={styles.text}>You're offline</Text>
      </Animated.View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#666',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: 'white',
    fontSize: 14,
  },
})
```

### Pending Sync Indicator

```typescript
// components/SyncStatus.tsx
export function SyncStatus() {
  const pendingCount = useSyncQueue((s) => s.queue.length)
  const isSyncing = useSyncStore((s) => s.isSyncing)

  if (pendingCount === 0 && !isSyncing) {
    return null
  }

  return (
    <View style={styles.container}>
      {isSyncing ? (
        <ActivityIndicator size="small" />
      ) : (
        <Icon name="cloud-upload" size={16} />
      )}
      <Text style={styles.text}>
        {isSyncing
          ? 'Syncing...'
          : `${pendingCount} changes pending`}
      </Text>
    </View>
  )
}
```

---

## 7. Data Migration

### Version Migration

```typescript
// services/migration/migrator.ts

interface Migration {
  version: number
  up: () => Promise<void>
  down: () => Promise<void>
}

const migrations: Migration[] = [
  {
    version: 1,
    up: async () => {
      // Initial schema
      await initializeDatabase()
    },
    down: async () => {},
  },
  {
    version: 2,
    up: async () => {
      // Add notes to highlights
      await addColumnToHighlights('note', 'TEXT')
    },
    down: async () => {
      await dropColumnFromHighlights('note')
    },
  },
]

export async function runMigrations() {
  const currentVersion = await getCurrentVersion()

  const pending = migrations
    .filter((m) => m.version > currentVersion)
    .sort((a, b) => a.version - b.version)

  for (const migration of pending) {
    try {
      await migration.up()
      await setCurrentVersion(migration.version)
    } catch (error) {
      console.error(`Migration ${migration.version} failed:`, error)
      throw error
    }
  }
}
```

### Web to Mobile Migration

```typescript
// services/migration/web-import.ts

interface WebExportData {
  version: string
  highlights: PassageHighlight[]
  settings: Record<string, any>
  exportedAt: string
}

export async function importFromWeb(data: WebExportData): Promise<ImportResult> {
  const result: ImportResult = {
    highlightsImported: 0,
    settingsImported: 0,
    errors: [],
  }

  // Import highlights
  for (const highlight of data.highlights) {
    try {
      await saveHighlightLocally({
        ...highlight,
        id: generateId(), // New ID to avoid conflicts
        importedFrom: 'web',
        importedAt: Date.now(),
      })
      result.highlightsImported++
    } catch (error) {
      result.errors.push(`Failed to import highlight: ${error.message}`)
    }
  }

  // Import compatible settings
  const compatibleSettings = filterCompatibleSettings(data.settings)
  for (const [key, value] of Object.entries(compatibleSettings)) {
    await setSettingValue(key, value)
    result.settingsImported++
  }

  return result
}
```

---

## 8. Cache Strategy

### Cache Layers

```
┌─────────────────────────────────────────────────────┐
│  Cache Layer Architecture                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Layer 1: Memory Cache (React Query)               │
│  ├── Hot data: current chapter, adjacent chapters  │
│  ├── TTL: Session duration                         │
│  └── Size: ~50MB limit                             │
│                                                     │
│  Layer 2: SQLite Cache                             │
│  ├── Warm data: recently viewed chapters           │
│  ├── TTL: 7 days                                   │
│  └── Size: ~100MB limit                            │
│                                                     │
│  Layer 3: File System                              │
│  ├── Cold data: downloaded translations            │
│  ├── TTL: Permanent (user-managed)                 │
│  └── Size: User-controlled                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Cache Invalidation

```typescript
// services/cache/invalidation.ts

export async function invalidateChapterCache(
  translation: string,
  book: number,
  chapter: number
) {
  const cacheKey = `chapter:${translation}:${book}:${chapter}`

  // Clear from memory
  queryClient.invalidateQueries({ queryKey: ['chapter', translation, book, chapter] })

  // Clear from SQLite cache
  await db.executeSql('DELETE FROM chapter_cache WHERE key = ?', [cacheKey])
}

export async function cleanExpiredCache() {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  await db.executeSql(
    'DELETE FROM chapter_cache WHERE cached_at < ?',
    [sevenDaysAgo]
  )
}

export async function enforceCacheSizeLimit() {
  const maxSize = 100 * 1024 * 1024 // 100MB

  const [result] = await db.executeSql(
    'SELECT SUM(size) as total FROM chapter_cache'
  )

  const currentSize = result.rows.item(0).total || 0

  if (currentSize > maxSize) {
    // Delete oldest entries until under limit
    await db.executeSql(`
      DELETE FROM chapter_cache
      WHERE id IN (
        SELECT id FROM chapter_cache
        ORDER BY last_accessed ASC
        LIMIT (SELECT COUNT(*) / 4 FROM chapter_cache)
      )
    `)
  }
}
```

---

## Sources

- [React Native Offline First](https://reactnative.dev/docs/network)
- [Expo FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [WatermelonDB](https://nozbe.github.io/WatermelonDB/) - Offline-first database
- [React Query Offline Support](https://tanstack.com/query/latest/docs/framework/react/guides/offline-support)
- [Background Fetch](https://github.com/transistorsoft/react-native-background-fetch)
