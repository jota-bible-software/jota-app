# Bible App Specific Patterns

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document covers patterns specific to building Bible apps on mobile, including large dataset handling, efficient text rendering, bookmarking systems, audio integration, and search optimization.

---

## 1. Bible Data Architecture

### Data Structure Options

#### Option A: File-Based (Recommended for Offline-First)

```
translations/
├── ESV/
│   ├── manifest.json       # Metadata
│   ├── books/
│   │   ├── 01-genesis.json
│   │   ├── 02-exodus.json
│   │   └── ...
│   └── index.json          # Quick lookup table
├── NIV/
└── ...
```

```typescript
// types/translation.ts
interface TranslationManifest {
  id: string
  name: string
  language: string
  version: string
  copyright: string
  bookCount: number
  totalVerses: number
  sizeBytes: number
}

interface BookData {
  bookIndex: number
  name: string
  chapters: ChapterData[]
}

interface ChapterData {
  chapterIndex: number
  verses: string[]
}
```

#### Option B: SQLite Database

```sql
-- Schema for SQLite approach
CREATE TABLE translations (
  id TEXT PRIMARY KEY,
  name TEXT,
  language TEXT,
  version TEXT,
  copyright TEXT
);

CREATE TABLE verses (
  id INTEGER PRIMARY KEY,
  translation_id TEXT,
  book INTEGER,
  chapter INTEGER,
  verse INTEGER,
  text TEXT,
  FOREIGN KEY (translation_id) REFERENCES translations(id)
);

CREATE INDEX idx_verse_lookup ON verses(translation_id, book, chapter);
CREATE VIRTUAL TABLE verses_fts USING fts5(text, content=verses, content_rowid=id);
```

### Lazy Loading Strategy

```typescript
// hooks/useBibleData.ts
import { useCallback, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const chapterCache = new Map<string, ChapterData>()

export function useChapter(translation: string, book: number, chapter: number) {
  const cacheKey = `${translation}:${book}:${chapter}`

  return useQuery({
    queryKey: ['chapter', translation, book, chapter],
    queryFn: async () => {
      // Check memory cache first
      if (chapterCache.has(cacheKey)) {
        return chapterCache.get(cacheKey)!
      }

      // Load from file system
      const data = await loadChapterFromStorage(translation, book, chapter)
      chapterCache.set(cacheKey, data)

      return data
    },
    staleTime: Infinity, // Bible text never changes
    cacheTime: 1000 * 60 * 30, // Keep in memory for 30 min
  })
}

// Preload adjacent chapters
export function usePreloadChapters(translation: string, book: number, chapter: number) {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Preload previous chapter
    if (chapter > 0) {
      queryClient.prefetchQuery({
        queryKey: ['chapter', translation, book, chapter - 1],
        queryFn: () => loadChapterFromStorage(translation, book, chapter - 1),
      })
    }

    // Preload next chapter
    queryClient.prefetchQuery({
      queryKey: ['chapter', translation, book, chapter + 1],
      queryFn: () => loadChapterFromStorage(translation, book, chapter + 1),
    })
  }, [translation, book, chapter])
}
```

---

## 2. Text Rendering Optimization

### Virtualized Verse List

```typescript
// components/ChapterView.tsx
import { FlashList } from '@shopify/flash-list'

interface VerseItem {
  verseNumber: number
  text: string
  highlight?: HighlightColor
}

export function ChapterView({ verses }: { verses: VerseItem[] }) {
  const renderVerse = useCallback(({ item }: { item: VerseItem }) => (
    <VerseRow
      number={item.verseNumber}
      text={item.text}
      highlight={item.highlight}
    />
  ), [])

  return (
    <FlashList
      data={verses}
      renderItem={renderVerse}
      estimatedItemSize={80}
      keyExtractor={(item) => String(item.verseNumber)}
      getItemType={() => 'verse'}
    />
  )
}
```

### Optimized Verse Component

```typescript
// components/VerseRow.tsx
import React, { memo } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'

interface VerseRowProps {
  number: number
  text: string
  highlight?: HighlightColor
  onPress?: () => void
  onLongPress?: () => void
}

export const VerseRow = memo(function VerseRow({
  number,
  text,
  highlight,
  onPress,
  onLongPress,
}: VerseRowProps) {
  const backgroundColor = highlight?.hex ?? 'transparent'

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.container, { backgroundColor }]}
    >
      <Text style={styles.verseNumber}>{number}</Text>
      <Text style={styles.verseText}>{text}</Text>
    </Pressable>
  )
}, (prev, next) => {
  // Custom comparison for memoization
  return (
    prev.number === next.number &&
    prev.text === next.text &&
    prev.highlight?.id === next.highlight?.id
  )
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  verseNumber: {
    width: 32,
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  verseText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
  },
})
```

### Text Measurement & Dynamic Sizing

```typescript
// hooks/useTextMeasurement.ts
import { useMemo } from 'react'
import { useWindowDimensions, PixelRatio } from 'react-native'

export function useTextMeasurement() {
  const { width, fontScale } = useWindowDimensions()

  return useMemo(() => {
    const baseFontSize = 18
    const adjustedSize = baseFontSize * fontScale

    // Estimate characters per line
    const charWidth = adjustedSize * 0.5
    const padding = 48 // Left + right padding
    const charsPerLine = Math.floor((width - padding) / charWidth)

    // Estimate item height based on text length
    const estimateHeight = (text: string): number => {
      const lines = Math.ceil(text.length / charsPerLine)
      const lineHeight = adjustedSize * 1.5
      return lines * lineHeight + 16 // + padding
    }

    return { adjustedSize, charsPerLine, estimateHeight }
  }, [width, fontScale])
}
```

---

## 3. Highlighting Architecture

### Highlight Data Model

```typescript
// types/highlights.ts
export interface PassageHighlight {
  id: string
  translation: string
  passage: [number, number, number, number] // book, chapter, startVerse, endVerse
  colorId: string
  createdAt: number
  note?: string
}

export interface HighlightColor {
  id: string
  name: string
  hex: string
  order: number
}

export interface HighlightStore {
  highlights: Record<string, PassageHighlight> // keyed by id
  colors: HighlightColor[]

  // Computed
  byTranslation: (translation: string) => PassageHighlight[]
  byChapter: (translation: string, book: number, chapter: number) => PassageHighlight[]

  // Actions
  addHighlight: (highlight: Omit<PassageHighlight, 'id' | 'createdAt'>) => void
  removeHighlight: (id: string) => void
  updateHighlightColor: (id: string, colorId: string) => void
}
```

### Efficient Lookup Index

```typescript
// stores/highlight-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface HighlightIndex {
  // translation -> book -> chapter -> verse -> highlightId
  [translation: string]: {
    [book: number]: {
      [chapter: number]: {
        [verse: number]: string // highlight id
      }
    }
  }
}

export const useHighlightStore = create<HighlightStore>()(
  persist(
    (set, get) => ({
      highlights: {},
      colors: DEFAULT_COLORS,
      index: {} as HighlightIndex,

      getHighlightForVerse: (translation, book, chapter, verse) => {
        const highlightId = get().index[translation]?.[book]?.[chapter]?.[verse]
        return highlightId ? get().highlights[highlightId] : undefined
      },

      addHighlight: (highlight) => {
        const id = generateId()
        const newHighlight = { ...highlight, id, createdAt: Date.now() }

        set((state) => {
          const newHighlights = { ...state.highlights, [id]: newHighlight }
          const newIndex = buildIndex(newHighlights)
          return { highlights: newHighlights, index: newIndex }
        })
      },

      // ... other actions
    }),
    {
      name: 'highlights-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

function buildIndex(highlights: Record<string, PassageHighlight>): HighlightIndex {
  const index: HighlightIndex = {}

  for (const highlight of Object.values(highlights)) {
    const [book, chapter, startVerse, endVerse] = highlight.passage
    const { translation } = highlight

    if (!index[translation]) index[translation] = {}
    if (!index[translation][book]) index[translation][book] = {}
    if (!index[translation][book][chapter]) index[translation][book][chapter] = {}

    for (let v = startVerse; v <= endVerse; v++) {
      index[translation][book][chapter][v] = highlight.id
    }
  }

  return index
}
```

### Verse Selection UI

```typescript
// components/VerseSelector.tsx
import { useState, useCallback } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated'

export function VerseSelector({
  verses,
  onSelectionComplete
}: {
  verses: VerseItem[]
  onSelectionComplete: (range: [number, number]) => void
}) {
  const [selectionStart, setSelectionStart] = useState<number | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null)

  const handleVersePress = useCallback((verseNumber: number) => {
    if (selectionStart === null) {
      setSelectionStart(verseNumber)
      setSelectionEnd(verseNumber)
    } else {
      const start = Math.min(selectionStart, verseNumber)
      const end = Math.max(selectionStart, verseNumber)
      setSelectionEnd(end)
    }
  }, [selectionStart])

  const handleComplete = useCallback(() => {
    if (selectionStart !== null && selectionEnd !== null) {
      onSelectionComplete([selectionStart, selectionEnd])
    }
    setSelectionStart(null)
    setSelectionEnd(null)
  }, [selectionStart, selectionEnd, onSelectionComplete])

  const isSelected = (verse: number) => {
    if (selectionStart === null || selectionEnd === null) return false
    const min = Math.min(selectionStart, selectionEnd)
    const max = Math.max(selectionStart, selectionEnd)
    return verse >= min && verse <= max
  }

  return (
    <>
      <FlashList
        data={verses}
        renderItem={({ item }) => (
          <VerseRow
            {...item}
            selected={isSelected(item.verseNumber)}
            onPress={() => handleVersePress(item.verseNumber)}
          />
        )}
      />
      {selectionStart !== null && (
        <SelectionToolbar
          range={[selectionStart, selectionEnd ?? selectionStart]}
          onHighlight={handleComplete}
          onCopy={() => {}}
          onCancel={() => {
            setSelectionStart(null)
            setSelectionEnd(null)
          }}
        />
      )}
    </>
  )
}
```

---

## 4. Audio Bible Integration

### Audio Player Architecture

```typescript
// services/audio/types.ts
export interface AudioTrack {
  id: string
  translation: string
  book: number
  chapter: number
  url: string
  duration: number
  isDownloaded: boolean
  localPath?: string
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null
  isPlaying: boolean
  position: number
  duration: number
  playbackRate: number
  isLoading: boolean
}

export interface AudioPlayerActions {
  play: (track: AudioTrack) => Promise<void>
  pause: () => void
  resume: () => void
  seek: (position: number) => void
  setPlaybackRate: (rate: number) => void
  playNextChapter: () => Promise<void>
  playPreviousChapter: () => Promise<void>
}
```

### Track Player Integration

```typescript
// services/audio/player.ts
import TrackPlayer, {
  Event,
  State,
  Capability
} from 'react-native-track-player'

export async function setupPlayer() {
  await TrackPlayer.setupPlayer({
    waitForBuffer: true,
  })

  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
    ],
    progressUpdateEventInterval: 1,
  })
}

export async function playChapter(track: AudioTrack) {
  await TrackPlayer.reset()

  await TrackPlayer.add({
    id: track.id,
    url: track.isDownloaded ? track.localPath! : track.url,
    title: `${getBookName(track.book)} ${track.chapter + 1}`,
    artist: track.translation,
    artwork: require('../assets/audio-artwork.png'),
    duration: track.duration,
  })

  await TrackPlayer.play()
}

// Background playback service
export async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play())
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause())
  TrackPlayer.addEventListener(Event.RemoteNext, () => playNextChapter())
  TrackPlayer.addEventListener(Event.RemotePrevious, () => playPreviousChapter())
  TrackPlayer.addEventListener(Event.RemoteSeek, (e) => TrackPlayer.seekTo(e.position))
}
```

### Audio Download Manager

```typescript
// services/audio/download-manager.ts
import RNFS from 'react-native-fs'
import { create } from 'zustand'

interface DownloadProgress {
  trackId: string
  progress: number
  status: 'pending' | 'downloading' | 'completed' | 'failed'
}

interface AudioDownloadStore {
  downloads: Record<string, DownloadProgress>
  downloadedTracks: string[]

  downloadTrack: (track: AudioTrack) => Promise<void>
  cancelDownload: (trackId: string) => void
  deleteDownload: (trackId: string) => Promise<void>
  isDownloaded: (trackId: string) => boolean
}

const AUDIO_DIR = `${RNFS.DocumentDirectoryPath}/audio`

export const useAudioDownloadStore = create<AudioDownloadStore>((set, get) => ({
  downloads: {},
  downloadedTracks: [],

  downloadTrack: async (track) => {
    await RNFS.mkdir(AUDIO_DIR)

    const localPath = `${AUDIO_DIR}/${track.id}.mp3`

    set((state) => ({
      downloads: {
        ...state.downloads,
        [track.id]: { trackId: track.id, progress: 0, status: 'downloading' },
      },
    }))

    try {
      await RNFS.downloadFile({
        fromUrl: track.url,
        toFile: localPath,
        progress: (res) => {
          const progress = res.bytesWritten / res.contentLength
          set((state) => ({
            downloads: {
              ...state.downloads,
              [track.id]: { ...state.downloads[track.id], progress },
            },
          }))
        },
      }).promise

      set((state) => ({
        downloads: {
          ...state.downloads,
          [track.id]: { trackId: track.id, progress: 1, status: 'completed' },
        },
        downloadedTracks: [...state.downloadedTracks, track.id],
      }))
    } catch (error) {
      set((state) => ({
        downloads: {
          ...state.downloads,
          [track.id]: { trackId: track.id, progress: 0, status: 'failed' },
        },
      }))
    }
  },

  isDownloaded: (trackId) => get().downloadedTracks.includes(trackId),

  // ... other methods
}))
```

---

## 5. Search Optimization

### Full-Text Search with SQLite FTS5

```typescript
// services/search/fts-search.ts
import SQLite from 'react-native-sqlite-storage'

export async function searchBibleText(
  query: string,
  options: {
    translation?: string
    book?: number
    limit?: number
  } = {}
): Promise<SearchResult[]> {
  const db = await getDatabase()

  let sql = `
    SELECT
      v.translation_id as translation,
      v.book,
      v.chapter,
      v.verse,
      v.text,
      highlight(verses_fts, 0, '<mark>', '</mark>') as highlighted
    FROM verses_fts
    JOIN verses v ON verses_fts.rowid = v.id
    WHERE verses_fts MATCH ?
  `

  const params: any[] = [escapeQuery(query)]

  if (options.translation) {
    sql += ` AND v.translation_id = ?`
    params.push(options.translation)
  }

  if (options.book !== undefined) {
    sql += ` AND v.book = ?`
    params.push(options.book)
  }

  sql += ` ORDER BY rank LIMIT ?`
  params.push(options.limit ?? 100)

  const [result] = await db.executeSql(sql, params)

  return result.rows.raw().map((row) => ({
    passage: [row.book, row.chapter, row.verse, row.verse] as Passage,
    text: row.text,
    highlighted: row.highlighted,
    translation: row.translation,
  }))
}

function escapeQuery(query: string): string {
  // Escape special FTS5 characters
  return query.replace(/["\-*()]/g, ' ').trim() + '*'
}
```

### Reference Parser Integration

```typescript
// services/search/reference-search.ts
import { parseReference, type ParseResult } from '@jota/core'

export function searchByReference(
  query: string,
  locale: string
): { type: 'reference' | 'text'; result: ParseResult | null } {
  const parsed = parseReference(query, { locale })

  if (parsed.isValid && parsed.passage) {
    return { type: 'reference', result: parsed }
  }

  // Fall back to text search
  return { type: 'text', result: null }
}
```

### Combined Search Hook

```typescript
// hooks/useSearch.ts
import { useState, useCallback, useMemo } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface SearchState {
  query: string
  results: SearchResult[]
  isLoading: boolean
  searchType: 'reference' | 'text' | null
}

export function useSearch(locale: string, translation: string) {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    isLoading: false,
    searchType: null,
  })

  const performSearch = useDebouncedCallback(async (query: string) => {
    if (query.length < 2) {
      setState((s) => ({ ...s, results: [], isLoading: false }))
      return
    }

    setState((s) => ({ ...s, isLoading: true }))

    try {
      // Try reference parsing first
      const refResult = searchByReference(query, locale)

      if (refResult.type === 'reference' && refResult.result) {
        const verses = await loadPassage(
          translation,
          refResult.result.passage
        )
        setState({
          query,
          results: [{ type: 'reference', verses, passage: refResult.result.passage }],
          isLoading: false,
          searchType: 'reference',
        })
        return
      }

      // Fall back to text search
      const textResults = await searchBibleText(query, { translation })
      setState({
        query,
        results: textResults.map((r) => ({ type: 'text', ...r })),
        isLoading: false,
        searchType: 'text',
      })
    } catch (error) {
      setState((s) => ({ ...s, isLoading: false }))
    }
  }, 300)

  const setQuery = useCallback((query: string) => {
    setState((s) => ({ ...s, query }))
    performSearch(query)
  }, [performSearch])

  return { ...state, setQuery }
}
```

---

## 6. Reading Position Persistence

### Last Position Store

```typescript
// stores/reading-position-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ReadingPosition {
  translation: string
  book: number
  chapter: number
  verse: number
  scrollOffset: number
  timestamp: number
}

interface ReadingPositionStore {
  lastPosition: ReadingPosition | null
  history: ReadingPosition[]

  savePosition: (position: Omit<ReadingPosition, 'timestamp'>) => void
  getLastPosition: () => ReadingPosition | null
  clearHistory: () => void
}

export const useReadingPositionStore = create<ReadingPositionStore>()(
  persist(
    (set, get) => ({
      lastPosition: null,
      history: [],

      savePosition: (position) => {
        const newPosition = { ...position, timestamp: Date.now() }
        set((state) => ({
          lastPosition: newPosition,
          history: [newPosition, ...state.history.slice(0, 49)], // Keep last 50
        }))
      },

      getLastPosition: () => get().lastPosition,

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'reading-position-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
```

### Auto-Save Hook

```typescript
// hooks/useAutoSavePosition.ts
import { useEffect, useRef } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export function useAutoSavePosition(
  translation: string,
  book: number,
  chapter: number,
  scrollOffset: number
) {
  const { savePosition } = useReadingPositionStore()

  const debouncedSave = useDebouncedCallback(() => {
    savePosition({
      translation,
      book,
      chapter,
      verse: calculateVerseFromOffset(scrollOffset),
      scrollOffset,
    })
  }, 1000)

  useEffect(() => {
    debouncedSave()

    return () => {
      // Save immediately on unmount
      debouncedSave.flush()
    }
  }, [translation, book, chapter, scrollOffset])
}
```

---

## Sources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [FlashList Documentation](https://shopify.github.io/flash-list/)
- [React Native Track Player](https://rntp.dev/)
- [SQLite FTS5 Documentation](https://www.sqlite.org/fts5.html)
- [Zustand Persist Middleware](https://github.com/pmndrs/zustand#persist-middleware)
