# Data & Content Strategy

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document outlines the data strategy for the Jota mobile app, including translation management, storage policies, sync architecture, and offline data availability.

---

## 1. Data Categories

### 1.1 Overview

```
┌─────────────────────────────────────────────────────┐
│  Jota Data Categories                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📖 Bible Content                                   │
│  ├── Translation files (downloaded)                │
│  ├── Audio files (optional)                        │
│  └── Cross-reference data (optional)              │
│                                                     │
│  👤 User Data                                       │
│  ├── Highlights                                    │
│  ├── Notes (future)                                │
│  ├── Reading history                               │
│  ├── Reading plan progress                         │
│  └── Preferences/settings                          │
│                                                     │
│  🔄 Sync Data                                       │
│  ├── Sync queue (pending changes)                  │
│  └── Conflict log                                  │
│                                                     │
│  💾 Cache Data                                      │
│  ├── Chapter cache                                 │
│  ├── Search index                                  │
│  └── Image cache                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 1.2 Data Sizes

| Data Type | Typical Size | Notes |
|-----------|-------------|-------|
| Single translation | 2-5 MB | Compressed JSON |
| Audio Bible (full) | 500-800 MB | MP3 format |
| Audio Bible (chapter) | 5-15 MB | ~20 minutes |
| Highlights (1000) | 100-200 KB | JSON |
| Reading plan data | 10-50 KB | Metadata only |
| Settings | < 10 KB | Simple key-value |
| Search index | 5-20 MB | Per translation |

---

## 2. Translation Download Management

### 2.1 Download Flow

```
┌─────────────────────────────────────────────────────┐
│  Translation Download Flow                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. User selects translation                        │
│     │                                               │
│     ▼                                               │
│  2. Check network connectivity                      │
│     ├── No connection → Queue for later             │
│     └── Connected → Continue                        │
│     │                                               │
│     ▼                                               │
│  3. Check storage space                             │
│     ├── Insufficient → Show warning                 │
│     └── Sufficient → Continue                       │
│     │                                               │
│     ▼                                               │
│  4. Download translation file                       │
│     ├── Show progress indicator                     │
│     ├── Support pause/resume                        │
│     └── Handle interruptions                        │
│     │                                               │
│     ▼                                               │
│  5. Validate downloaded file                        │
│     ├── Checksum verification                       │
│     └── JSON structure validation                   │
│     │                                               │
│     ▼                                               │
│  6. Store and index                                 │
│     ├── Save to documents directory                 │
│     ├── Build search index                          │
│     └── Update available translations               │
│     │                                               │
│     ▼                                               │
│  7. Ready to use                                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2.2 Translation Manifest

```typescript
interface TranslationManifest {
  id: string              // "ESV", "NIV", etc.
  name: string            // "English Standard Version"
  abbreviation: string    // "ESV"
  language: string        // "en"
  languageName: string    // "English"
  version: string         // "2024.1"
  copyright: string       // Copyright text
  books: BookManifest[]
  totalVerses: number
  sizeBytes: number
  downloadUrl: string
  checksumSha256: string
  audioAvailable: boolean
  lastUpdated: string     // ISO date
}

interface BookManifest {
  index: number           // 0-65
  osisId: string          // "Gen", "Matt"
  name: string            // "Genesis"
  chapters: number        // 50
  verses: number          // 1533
}
```

### 2.3 Translation File Format

```typescript
// File: translations/{id}/manifest.json
interface TranslationData {
  meta: TranslationManifest
  books: {
    [bookIndex: number]: {
      chapters: {
        [chapterIndex: number]: string[]  // verses array
      }
    }
  }
}

// Alternative: Split files for large translations
// translations/{id}/manifest.json
// translations/{id}/books/00-genesis.json
// translations/{id}/books/01-exodus.json
// ...
```

---

## 3. Storage Management

### 3.1 Storage Locations

```typescript
import RNFS from 'react-native-fs'

const PATHS = {
  // User documents - persists across updates, backed up
  translations: `${RNFS.DocumentDirectoryPath}/translations`,
  audio: `${RNFS.DocumentDirectoryPath}/audio`,
  userData: `${RNFS.DocumentDirectoryPath}/user`,

  // Cache - can be cleared by system
  searchIndex: `${RNFS.CachesDirectoryPath}/search`,
  chapterCache: `${RNFS.CachesDirectoryPath}/chapters`,
  imageCache: `${RNFS.CachesDirectoryPath}/images`,

  // Temporary - cleared on app close
  downloads: `${RNFS.TemporaryDirectoryPath}/downloads`,
}
```

### 3.2 Storage Limits

| Category | Soft Limit | Action at Limit |
|----------|-----------|-----------------|
| Translations | None | User manages |
| Audio | 2 GB | Warn user |
| Cache | 200 MB | Auto-evict oldest |
| User data | None | Encourage export |

### 3.3 Storage UI

```
┌─────────────────────────────────────────────────────┐
│  Storage Management Screen                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Total Used: 1.2 GB of 32 GB                       │
│  ███████░░░░░░░░░░░░░░░░░░░░░░░░░░░ 3.7%          │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Translations                    850 MB      │   │
│  │ ├── NIV                         120 MB      │   │
│  │ ├── ESV                          95 MB      │   │
│  │ ├── KJV                          80 MB      │   │
│  │ └── ... 15 more                             │   │
│  ├─────────────────────────────────────────────│   │
│  │ Audio                           300 MB      │   │
│  │ ├── ESV Audio (partial)         200 MB      │   │
│  │ └── NIV Audio (partial)         100 MB      │   │
│  ├─────────────────────────────────────────────│   │
│  │ Cache                            50 MB      │   │
│  │ └── [Clear Cache]                           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 4. Offline Data Availability

### 4.1 Offline Matrix

| Feature | Offline Available | Notes |
|---------|------------------|-------|
| Read Bible | ✅ Yes | Downloaded translations |
| Highlights | ✅ Yes | Stored locally |
| Create highlight | ✅ Yes | Queued for sync |
| Search (reference) | ✅ Yes | Parser works offline |
| Search (text) | ✅ Yes | Local index |
| Reading plans | ✅ Yes | Data cached |
| Audio (downloaded) | ✅ Yes | MP3 files stored |
| Audio (streaming) | ❌ No | Requires network |
| Download translation | ❌ No | Requires network |
| Sync data | ❌ No | Queued until online |
| Translation updates | ❌ No | Requires network |

### 4.2 Offline Indicators

```typescript
interface OfflineStatus {
  isOnline: boolean
  lastOnline: Date | null
  pendingSyncCount: number
  downloadsPaused: boolean
}

// UI indicator examples:
// "You're offline. Changes will sync when connected."
// "5 changes pending sync"
// "Downloads paused - connect to WiFi or enable cellular"
```

---

## 5. Sync Architecture

### 5.1 Sync Model

```
┌─────────────────────────────────────────────────────┐
│  Sync Architecture (Optional Feature)               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐           ┌──────────┐               │
│  │  Device  │           │  Cloud   │               │
│  │  (Phone) │           │  Server  │               │
│  └────┬─────┘           └────┬─────┘               │
│       │                      │                      │
│       │  1. Local change     │                      │
│       │  (highlight added)   │                      │
│       │                      │                      │
│       │  2. Add to sync queue│                      │
│       │                      │                      │
│       │  3. When online:     │                      │
│       │  ──────────────────► │                      │
│       │  Push changes        │                      │
│       │                      │                      │
│       │  4. Server processes │                      │
│       │  ◄────────────────── │                      │
│       │  Confirm + pull      │                      │
│       │  other device changes│                      │
│       │                      │                      │
│       │  5. Apply remote     │                      │
│       │  changes locally     │                      │
│       │                      │                      │
└───────┴──────────────────────┴──────────────────────┘
```

### 5.2 Sync Data Structure

```typescript
interface SyncableItem {
  id: string
  type: 'highlight' | 'note' | 'plan_progress' | 'setting'
  data: object
  version: number
  createdAt: number
  updatedAt: number
  deletedAt: number | null  // Soft delete
  deviceId: string
}

interface SyncQueueItem {
  id: string
  operation: 'create' | 'update' | 'delete'
  item: SyncableItem
  queuedAt: number
  retryCount: number
  lastError: string | null
}

interface ConflictRecord {
  id: string
  itemId: string
  localVersion: SyncableItem
  remoteVersion: SyncableItem
  resolution: 'local' | 'remote' | 'merge' | 'pending'
  resolvedAt: number | null
}
```

### 5.3 Conflict Resolution

| Data Type | Strategy | Notes |
|-----------|----------|-------|
| Highlights | Last-write-wins | Simple, predictable |
| Notes | User choice or merge | Content matters |
| Plan progress | Max of local/remote | Never lose progress |
| Settings | Device-specific | Don't sync some |

---

## 6. Cache Strategy

### 6.1 Cache Layers

```
┌─────────────────────────────────────────────────────┐
│  Cache Layer Hierarchy                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  L1: Memory (React Query)                          │
│  ├── Current chapter                               │
│  ├── Adjacent chapters (n-1, n+1)                  │
│  ├── Recently viewed chapters                      │
│  └── TTL: Session / 30 minutes                     │
│                                                     │
│  L2: SQLite / AsyncStorage                         │
│  ├── Parsed chapter data                           │
│  ├── Search results                                │
│  ├── User preferences                              │
│  └── TTL: 7 days / Until eviction                  │
│                                                     │
│  L3: File System                                    │
│  ├── Full translation files                        │
│  ├── Audio files                                   │
│  ├── Search indices                                │
│  └── TTL: Permanent / User-managed                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 6.2 Cache Invalidation

```typescript
// Invalidation triggers
enum CacheInvalidation {
  // Automatic
  STORAGE_PRESSURE,      // System needs space
  TTL_EXPIRED,           // Time-based expiry
  TRANSLATION_UPDATED,   // New version available

  // User-initiated
  MANUAL_CLEAR,          // User clears cache
  TRANSLATION_DELETED,   // User removes translation
  APP_RESET,             // User resets app
}

// Invalidation actions
async function invalidateCache(reason: CacheInvalidation) {
  switch (reason) {
    case CacheInvalidation.STORAGE_PRESSURE:
      // Clear L1 and L2, keep L3
      await clearMemoryCache()
      await clearSQLiteCache()
      break

    case CacheInvalidation.TRANSLATION_UPDATED:
      // Clear specific translation cache
      await clearTranslationCache(translationId)
      await rebuildSearchIndex(translationId)
      break

    case CacheInvalidation.APP_RESET:
      // Clear everything except translations
      await clearAllCaches()
      await clearUserData()
      break
  }
}
```

---

## 7. Data Migration

### 7.1 Web to Mobile Migration

```typescript
interface WebExportFormat {
  version: string           // Export format version
  exportedAt: string        // ISO date
  source: 'web'
  data: {
    highlights: PassageHighlight[]
    settings: Record<string, any>
    readingHistory: ReadingPosition[]
  }
}

async function importFromWeb(exportData: WebExportFormat): Promise<ImportResult> {
  // Validate version compatibility
  if (!isCompatibleVersion(exportData.version)) {
    throw new Error('Incompatible export version')
  }

  const result: ImportResult = {
    highlightsImported: 0,
    settingsImported: 0,
    errors: [],
  }

  // Import highlights
  for (const highlight of exportData.data.highlights) {
    try {
      // Check for duplicates
      const existing = await findHighlight(highlight.passage)
      if (!existing) {
        await saveHighlight(highlight)
        result.highlightsImported++
      }
    } catch (error) {
      result.errors.push(`Highlight import failed: ${error.message}`)
    }
  }

  // Import compatible settings
  const compatibleSettings = filterCompatibleSettings(exportData.data.settings)
  for (const [key, value] of Object.entries(compatibleSettings)) {
    await setSetting(key, value)
    result.settingsImported++
  }

  return result
}
```

### 7.2 Migration via QR Code

```
┌─────────────────────────────────────────────────────┐
│  QR Code Migration Flow                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Web App:                                           │
│  1. Go to Settings → Export                        │
│  2. Generate QR code (contains short URL)          │
│  3. QR links to temporary export endpoint          │
│                                                     │
│  Mobile App:                                        │
│  1. Go to Settings → Import                        │
│  2. Scan QR code                                   │
│  3. Fetch export data from URL                     │
│  4. Process and import                             │
│  5. Show import summary                            │
│                                                     │
│  Security:                                          │
│  ├── Export URL expires after 10 minutes           │
│  ├── One-time use token                            │
│  └── HTTPS only                                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 8. Data Backup

### 8.1 Local Backup

```typescript
interface BackupData {
  version: string
  createdAt: string
  device: string
  data: {
    highlights: PassageHighlight[]
    notes: Note[]
    settings: Record<string, any>
    planProgress: PlanProgress[]
  }
}

async function createLocalBackup(): Promise<string> {
  const backup: BackupData = {
    version: '1.0',
    createdAt: new Date().toISOString(),
    device: await DeviceInfo.getDeviceName(),
    data: {
      highlights: await getAllHighlights(),
      notes: await getAllNotes(),
      settings: await getAllSettings(),
      planProgress: await getAllPlanProgress(),
    },
  }

  const filename = `jota-backup-${Date.now()}.json`
  const path = `${RNFS.DocumentDirectoryPath}/backups/${filename}`

  await RNFS.writeFile(path, JSON.stringify(backup), 'utf8')

  return path
}
```

### 8.2 Export Formats

| Format | Use Case | Content |
|--------|----------|---------|
| JSON | Full backup | All user data |
| CSV | Highlights only | For spreadsheets |
| Text | Reading notes | Plain text export |

---

## 9. Privacy Considerations

### 9.1 Data Collection Policy

| Data | Collected | Purpose |
|------|-----------|---------|
| Reading history | Local only | Resume reading |
| Highlights | Local only | User feature |
| Search queries | Local only | History feature |
| App crashes | Opt-in | Bug fixing |
| Usage analytics | Opt-in | Product improvement |
| Location | Never | Not needed |
| Contacts | Never | Not needed |
| Personal info | Never | Not needed |

### 9.2 Data Deletion

```typescript
async function deleteAllUserData(): Promise<void> {
  // Clear all user data
  await clearHighlights()
  await clearNotes()
  await clearReadingHistory()
  await clearSettings()
  await clearSyncData()

  // Clear caches
  await clearAllCaches()

  // Optionally keep translations (user choice)
  // await clearTranslations()

  // Reset to first-launch state
  await setOnboardingComplete(false)
}
```
