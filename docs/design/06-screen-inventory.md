# Screen Inventory

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document provides a comprehensive inventory of all screens in the Jota mobile app, including their purpose, key components, and navigation relationships.

---

## 1. Onboarding Screens

### 1.1 WelcomeScreen

| Attribute | Value |
|-----------|-------|
| ID | ONB-01 |
| Purpose | Welcome user, set positive first impression |
| Entry Point | First app launch |
| Exit Point | Next button → LanguageSelectScreen |

**Components:**
- App logo
- Welcome message
- "Get Started" button
- Optional: Skip to defaults link

**State:** None (stateless welcome)

---

### 1.2 LanguageSelectScreen

| Attribute | Value |
|-----------|-------|
| ID | ONB-02 |
| Purpose | Select app UI language |
| Entry Point | WelcomeScreen |
| Exit Point | Selection → TranslationSelectScreen |

**Components:**
- Language list (flags + names)
- Current selection indicator
- Continue button

**State:** selectedLanguage

---

### 1.3 TranslationSelectScreen

| Attribute | Value |
|-----------|-------|
| ID | ONB-03 |
| Purpose | Choose first Bible translation |
| Entry Point | LanguageSelectScreen |
| Exit Point | Selection → HomeScreen (main app) |

**Components:**
- Popular translations section
- All translations list (grouped by language)
- Search/filter
- Download indicator
- Continue button

**State:** selectedTranslation, downloadProgress

---

## 2. Home Tab Screens

### 2.1 HomeScreen

| Attribute | Value |
|-----------|-------|
| ID | HOME-01 |
| Purpose | Dashboard with quick actions |
| Entry Point | Tab bar, App launch |
| Exit Point | Cards navigate to relevant screens |

**Components:**
- Header with greeting
- Continue Reading card (if applicable)
- Verse of the Day card
- Reading Plan progress card (if active)
- Quick action buttons (Search, Audio)

**State:**
- lastReadingPosition
- verseOfDay
- activePlan (if any)
- planProgress

---

## 3. Bible Tab Screens

### 3.1 BibleReaderScreen

| Attribute | Value |
|-----------|-------|
| ID | BIBLE-01 |
| Purpose | Primary Bible reading interface |
| Entry Point | Tab bar, Deep links, Cross-tab navigation |
| Exit Point | Back to source, Tab switch |

**Components:**
- Header (book, chapter, translation)
- Verse list (FlashList)
- Audio mini-player (when active)
- Floating "go to verse" indicator (when scrolling)

**State:**
- currentBook
- currentChapter
- currentTranslation
- scrollPosition
- selectedVerses
- highlights (for current chapter)

**Interactions:**
- Swipe left/right: Change chapter
- Tap verse: Select
- Long press: Start range selection
- Double tap: Quick highlight
- Pinch: Adjust font size

---

### 3.2 BookPickerModal

| Attribute | Value |
|-----------|-------|
| ID | BIBLE-02 |
| Purpose | Select Bible book |
| Entry Point | Tap book name in BibleReaderScreen header |
| Exit Point | Select book → ChapterPickerSheet, Dismiss |

**Components:**
- Segmented control (OT / NT / All)
- Book grid (organized by category)
- Search bar
- Recently read section

**State:**
- selectedTestament
- searchQuery

---

### 3.3 ChapterPickerSheet

| Attribute | Value |
|-----------|-------|
| ID | BIBLE-03 |
| Purpose | Select chapter within book |
| Entry Point | Select book in BookPickerModal, Tap chapter in header |
| Exit Point | Select chapter → BibleReaderScreen, Dismiss |

**Components:**
- Book name header
- Chapter number grid
- Currently reading indicator
- Chapters with highlights indicator

**State:**
- selectedBook

---

### 3.4 TranslationPickerSheet

| Attribute | Value |
|-----------|-------|
| ID | BIBLE-04 |
| Purpose | Switch translation |
| Entry Point | Tap translation badge in BibleReaderScreen |
| Exit Point | Select translation → BibleReaderScreen, Dismiss |

**Components:**
- Search bar
- Downloaded translations section
- Available translations section
- Current selection indicator
- Download button for unavailable

**State:**
- searchQuery
- downloadedTranslations

---

### 3.5 VerseActionsSheet

| Attribute | Value |
|-----------|-------|
| ID | BIBLE-05 |
| Purpose | Actions on selected verse(s) |
| Entry Point | Tap selected verse in BibleReaderScreen |
| Exit Point | Action taken, Dismiss |

**Components:**
- Selected verse preview
- Highlight button row (8 colors)
- Copy button
- Share button
- More actions (if applicable)

**State:**
- selectedPassage
- currentHighlight (if any)

---

### 3.6 HighlightColorSheet

| Attribute | Value |
|-----------|-------|
| ID | BIBLE-06 |
| Purpose | Select or change highlight color |
| Entry Point | Tap highlight in VerseActionsSheet |
| Exit Point | Select color, Dismiss |

**Components:**
- Color grid (8 default colors)
- Color names
- Remove highlight option
- Current color indicator

**State:**
- currentHighlightColor

---

### 3.7 FormatPickerSheet

| Attribute | Value |
|-----------|-------|
| ID | BIBLE-07 |
| Purpose | Choose copy format template |
| Entry Point | Tap copy in VerseActionsSheet |
| Exit Point | Select format → Copy, Dismiss |

**Components:**
- Format template list
- Preview of each format
- Default format indicator
- Copy button

**State:**
- selectedFormat
- formattedPreview

---

## 4. Search Tab Screens

### 4.1 SearchScreen

| Attribute | Value |
|-----------|-------|
| ID | SEARCH-01 |
| Purpose | Search Bible by reference or text |
| Entry Point | Tab bar, Quick action |
| Exit Point | Result tap → BibleReaderScreen |

**Components:**
- Search input (with clear button)
- Search type indicator (reference/text)
- Filter button
- Recent searches (when input empty)
- Search results list

**State:**
- searchQuery
- searchType (reference/text)
- filters
- results
- recentSearches

**Interactions:**
- Type: Real-time search
- Tap result: Navigate to passage
- Swipe result: Remove from history

---

### 4.2 SearchFiltersSheet

| Attribute | Value |
|-----------|-------|
| ID | SEARCH-02 |
| Purpose | Filter text search results |
| Entry Point | Tap filter button in SearchScreen |
| Exit Point | Apply filters, Dismiss |

**Components:**
- Translation select
- Testament select (OT/NT/All)
- Book multi-select
- Reset filters button
- Apply button

**State:**
- selectedTranslation
- selectedTestament
- selectedBooks

---

## 5. Library Tab Screens

### 5.1 LibraryScreen

| Attribute | Value |
|-----------|-------|
| ID | LIB-01 |
| Purpose | Manage translations, plans, audio |
| Entry Point | Tab bar |
| Exit Point | Section tap → Detail screens |

**Components:**
- Translations section preview
- Reading Plans section preview
- Audio Bibles section preview
- Storage usage indicator

**State:**
- downloadedCount
- activePlans
- storageUsed

---

### 5.2 TranslationsListScreen

| Attribute | Value |
|-----------|-------|
| ID | LIB-02 |
| Purpose | View and manage all translations |
| Entry Point | LibraryScreen translations section |
| Exit Point | Back, Download action |

**Components:**
- Segmented control (Downloaded/Available)
- Search bar
- Translation list (grouped by language)
- Download progress indicators
- Storage per translation

**State:**
- selectedTab
- searchQuery
- downloads

---

### 5.3 ReadingPlansListScreen

| Attribute | Value |
|-----------|-------|
| ID | LIB-03 |
| Purpose | Browse and start reading plans |
| Entry Point | LibraryScreen plans section |
| Exit Point | Plan select → PlanDetailScreen |

**Components:**
- Active plans section
- Browse plans section (by category)
- Plan cards with preview info

**State:**
- activePlans
- availablePlans

---

### 5.4 PlanDetailScreen

| Attribute | Value |
|-----------|-------|
| ID | LIB-04 |
| Purpose | View plan details and progress |
| Entry Point | ReadingPlansListScreen, HomeScreen |
| Exit Point | Day select → BibleReaderScreen |

**Components:**
- Plan info header
- Progress indicator
- Days list with completion status
- Start/restart button
- Settings (notifications)

**State:**
- plan
- progress
- streakCount

---

### 5.5 AudioListScreen

| Attribute | Value |
|-----------|-------|
| ID | LIB-05 |
| Purpose | Manage audio Bible downloads |
| Entry Point | LibraryScreen audio section |
| Exit Point | Play → AudioPlayer |

**Components:**
- Downloaded tab
- Available tab
- Translation audio cards
- Download/delete actions

**State:**
- downloadedAudio
- availableAudio
- downloadProgress

---

### 5.6 StorageManagementScreen

| Attribute | Value |
|-----------|-------|
| ID | LIB-06 |
| Purpose | Manage app storage |
| Entry Point | LibraryScreen storage indicator, Settings |
| Exit Point | Back |

**Components:**
- Total storage used
- Breakdown by category (translations, audio, cache)
- Individual item sizes
- Delete options
- Clear cache button

**State:**
- storageBreakdown
- items

---

## 6. Profile Tab Screens

### 6.1 ProfileScreen

| Attribute | Value |
|-----------|-------|
| ID | PROF-01 |
| Purpose | Profile overview and settings access |
| Entry Point | Tab bar |
| Exit Point | Section taps → Detail screens |

**Components:**
- User section (if synced) / Account prompt
- Highlights summary
- Quick stats (verses read, streak)
- Settings link
- About link

**State:**
- user (if logged in)
- highlightCount
- stats

---

### 6.2 HighlightsScreen

| Attribute | Value |
|-----------|-------|
| ID | PROF-02 |
| Purpose | View and manage all highlights |
| Entry Point | ProfileScreen, Deep link |
| Exit Point | Highlight tap → BibleReaderScreen |

**Components:**
- Filter bar (color, book)
- Highlights list (grouped by date or book)
- Highlight cards with verse preview
- Export button

**State:**
- highlights
- colorFilter
- bookFilter
- sortOrder

---

### 6.3 SettingsScreen

| Attribute | Value |
|-----------|-------|
| ID | PROF-03 |
| Purpose | App configuration hub |
| Entry Point | ProfileScreen |
| Exit Point | Section tap → Detail screens |

**Components:**
- Appearance section link
- Reading section link
- Notifications section link
- Data section link
- Privacy section link
- About section link

**State:** None (navigation screen)

---

### 6.4 AppearanceSettingsScreen

| Attribute | Value |
|-----------|-------|
| ID | PROF-04 |
| Purpose | Configure visual settings |
| Entry Point | SettingsScreen |
| Exit Point | Back |

**Components:**
- Theme picker (Light/Dark/System)
- Font size slider with preview
- Font family picker
- Preview text block

**State:**
- theme
- fontSize
- fontFamily

---

### 6.5 ReadingSettingsScreen

| Attribute | Value |
|-----------|-------|
| ID | PROF-05 |
| Purpose | Configure reading preferences |
| Entry Point | SettingsScreen |
| Exit Point | Back |

**Components:**
- Default translation picker
- Home screen configuration
- Gesture settings
- Audio settings (speed, auto-play)

**State:**
- defaultTranslation
- homeScreenConfig
- gesturePrefs
- audioPrefs

---

### 6.6 NotificationSettingsScreen

| Attribute | Value |
|-----------|-------|
| ID | PROF-06 |
| Purpose | Configure notifications |
| Entry Point | SettingsScreen |
| Exit Point | Back |

**Components:**
- Reading reminder toggle
- Reminder time picker
- Plan reminder toggle
- Verse of day notification toggle

**State:**
- remindersEnabled
- reminderTime
- planReminders
- vodNotifications

---

### 6.7 DataSettingsScreen

| Attribute | Value |
|-----------|-------|
| ID | PROF-07 |
| Purpose | Data management options |
| Entry Point | SettingsScreen |
| Exit Point | Back, Export flow |

**Components:**
- Storage management link
- Export data button
- Import data button
- Sync settings (if enabled)
- Clear all data button

**State:**
- syncEnabled
- lastSync

---

### 6.8 PrivacySettingsScreen

| Attribute | Value |
|-----------|-------|
| ID | PROF-08 |
| Purpose | Privacy controls |
| Entry Point | SettingsScreen |
| Exit Point | Back |

**Components:**
- Analytics toggle
- Crash reporting toggle
- Data collection info
- Privacy policy link

**State:**
- analyticsEnabled
- crashReportingEnabled

---

### 6.9 AboutScreen

| Attribute | Value |
|-----------|-------|
| ID | PROF-09 |
| Purpose | App information |
| Entry Point | SettingsScreen |
| Exit Point | Back |

**Components:**
- App version
- Build number
- Open source licenses link
- Rate app button
- Contact/feedback link
- Social links

**State:** None (static info)

---

## 7. Overlay Screens

### 7.1 AudioPlayerFullScreen

| Attribute | Value |
|-----------|-------|
| ID | OVER-01 |
| Purpose | Full audio playback controls |
| Entry Point | Expand mini-player |
| Exit Point | Collapse, Dismiss |

**Components:**
- Book/chapter info
- Progress scrubber
- Play/pause, previous, next buttons
- Speed control
- Sleep timer
- Download status
- Close button

**State:**
- currentTrack
- playbackPosition
- playbackSpeed
- sleepTimerRemaining

---

### 7.2 AudioMiniPlayer

| Attribute | Value |
|-----------|-------|
| ID | OVER-02 |
| Purpose | Persistent audio controls |
| Entry Point | Audio playing |
| Exit Point | Tap → Full player, Stop |

**Components:**
- Chapter title
- Play/pause button
- Progress bar
- Expand button

**State:**
- currentTrack
- isPlaying
- progress

---

## 8. Screen Count Summary

| Category | Screens | Bottom Sheets |
|----------|---------|---------------|
| Onboarding | 3 | 0 |
| Home | 1 | 0 |
| Bible | 2 | 5 |
| Search | 1 | 1 |
| Library | 6 | 0 |
| Profile | 9 | 0 |
| Overlays | 2 | 0 |
| **Total** | **24** | **6** |

---

## 9. Screen Priority for MVP

### MVP (v1.0) - Must Have

| ID | Screen |
|----|--------|
| ONB-01 | WelcomeScreen |
| ONB-02 | LanguageSelectScreen |
| ONB-03 | TranslationSelectScreen |
| HOME-01 | HomeScreen (basic) |
| BIBLE-01 | BibleReaderScreen |
| BIBLE-02 | BookPickerModal |
| BIBLE-03 | ChapterPickerSheet |
| BIBLE-04 | TranslationPickerSheet |
| BIBLE-05 | VerseActionsSheet |
| BIBLE-06 | HighlightColorSheet |
| SEARCH-01 | SearchScreen |
| LIB-01 | LibraryScreen (basic) |
| LIB-02 | TranslationsListScreen |
| PROF-01 | ProfileScreen (basic) |
| PROF-02 | HighlightsScreen |
| PROF-03 | SettingsScreen |
| PROF-04 | AppearanceSettingsScreen |

**MVP Total: 17 screens**

### v1.1 - Should Have

| ID | Screen |
|----|--------|
| BIBLE-07 | FormatPickerSheet |
| SEARCH-02 | SearchFiltersSheet |
| LIB-03 | ReadingPlansListScreen |
| LIB-04 | PlanDetailScreen |
| PROF-05 | ReadingSettingsScreen |
| PROF-06 | NotificationSettingsScreen |
| PROF-07 | DataSettingsScreen |
| PROF-08 | PrivacySettingsScreen |
| PROF-09 | AboutScreen |

**v1.1 Total: 9 additional screens**

### v1.2+ - Could Have

| ID | Screen |
|----|--------|
| LIB-05 | AudioListScreen |
| LIB-06 | StorageManagementScreen |
| OVER-01 | AudioPlayerFullScreen |
| OVER-02 | AudioMiniPlayer |

**v1.2+ Total: 4 additional screens**
