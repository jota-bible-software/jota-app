# Jota Bible App - User Flow Documentation

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document maps all user flows in the Jota Bible App, from initial setup through advanced features.

---

## 1. First-Time Setup Flow

### Entry Point
User loads the app for the first time (no localStorage data).

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FIRST-TIME SETUP                             │
└─────────────────────────────────────────────────────────────────────┘

[Browser loads app]
         │
         ▼
┌─────────────────────┐
│ Detect browser      │
│ locale              │──→ getDefaultLocale()
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Initialize settings │
│ with defaults       │──→ initialPersistValue
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Set default         │
│ translation         │──→ Based on detected locale
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Fetch default       │
│ translation content │──→ Async JSON fetch
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Show Reference      │
│ Picker (if enabled) │──→ referencePickerOnStart setting
└─────────────────────┘
         │
         ▼
[User sees main page with Genesis 1 or Reference Picker]
```

### Default Settings Applied
- Locale: Auto-detected from browser
- Theme: Dark mode
- Font size: 16px
- Reference picker on start: Yes
- Default translations per locale:
  - en-US: KJV
  - pl-PL: BT5
  - pt-BR: ARA

---

## 2. Bible Reading Flow

### 2.1 Reference Picker Navigation

```
┌─────────────────────────────────────────────────────────────────────┐
│                    REFERENCE PICKER FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

[Reference Picker visible]
         │
         ├──→ [Tap Book Name] ──→ Expand chapter list
         │           │
         │           ▼
         │    [Tap Chapter Number]
         │           │
         │           ▼
         │    ┌─────────────────────┐
         │    │ referencePickerUse- │
         │    │ Chapter = true?     │
         │    └─────────────────────┘
         │           │
         │     Yes   │   No
         │     ▼     │   ▼
         │  [Navigate to  │  [Show verse
         │   full chapter]│   picker]
         │                │
         │                ▼
         │         [Tap verse or
         │          verse range]
         │                │
         │                ▼
         └───────→ [Navigate to chapter/verse]
                         │
                         ▼
                  [Chapter Content displays]
                         │
                         ▼
                  [Scroll to selected verse]
```

### 2.2 Chapter Reading Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CHAPTER READING FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

[Chapter Content displayed]
         │
         ├──→ [Scroll vertically] ──→ Read verses
         │
         ├──→ [Swipe left] ──→ Next chapter ──→ goToAdjacentChapter()
         │
         ├──→ [Swipe right] ──→ Previous chapter
         │
         ├──→ [Tap verse] ──→ Select single verse
         │         │
         │         ▼
         │    ┌─────────────────────┐
         │    │ Verse highlighted   │
         │    │ Selection toolbar   │
         │    │ appears             │
         │    └─────────────────────┘
         │         │
         │         ├──→ [Copy button] ──→ Copy to clipboard
         │         ├──→ [Highlight button] ──→ Apply highlight color
         │         └──→ [Tap elsewhere] ──→ Clear selection
         │
         ├──→ [Long press + drag] ──→ Select verse range
         │
         └──→ [Tap chapter header] ──→ Return to Reference Picker
```

### 2.3 Translation Switching Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                   TRANSLATION SWITCHING FLOW                        │
└─────────────────────────────────────────────────────────────────────┘

[Bible Selector dropdown]
         │
         ▼
┌─────────────────────┐
│ Show selected       │
│ translations        │──→ Grouped by locale
└─────────────────────┘
         │
         ▼
[Tap translation]
         │
         ▼
┌─────────────────────┐
│ Translation already │
│ loaded?             │
└─────────────────────┘
    │           │
   Yes          No
    │           │
    ▼           ▼
[Switch      [Show loading
immediately]  indicator]
                │
                ▼
         [Fetch JSON]
                │
                ▼
         [Store in content ref]
                │
                ▼
         [Update display]
                │
                ▼
         [Same verse position maintained]
```

---

## 3. Search Flow

### 3.1 Reference Search Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    REFERENCE SEARCH FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

[User types in search box]
         │
         ▼
"John 3:16" or "Jana 3:16" or "J 3,16"
         │
         ▼
[Press Enter or tap search icon]
         │
         ▼
┌─────────────────────┐
│ jota-parser parses  │
│ reference           │
└─────────────────────┘
         │
         ├──→ [Valid reference] ──→ Navigate to passage
         │                              │
         │                              ▼
         │                       [Single result: split view]
         │                       [Multiple results: formatted list]
         │
         └──→ [Invalid reference] ──→ Fall through to text search
```

### 3.2 Text Search Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      TEXT SEARCH FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

[User types search text]
         │
         ▼
"love" or "/love.*faith/" (regex)
         │
         ▼
[Press Enter]
         │
         ▼
┌─────────────────────┐
│ Whole words toggle? │
└─────────────────────┘
    │           │
   Yes          No
    │           │
    ▼           ▼
[Match whole   [Match partial
 words only]    words]
         │
         ▼
[Search through translation content]
         │
         ▼
[Progress indicator shows book progress]
         │
         ▼
┌─────────────────────┐
│ Results found?      │
└─────────────────────┘
    │           │
   Yes          No
    │           │
    ▼           ▼
[Display       [Show "No results"
 results]       message]
    │
    ▼
┌─────────────────────┐
│ Single result?      │
└─────────────────────┘
    │           │
   Yes          No
    │           │
    ▼           ▼
[Split view    [Formatted list
 + context]     with navigation]
```

### 3.3 Search Results Navigation

```
┌─────────────────────────────────────────────────────────────────────┐
│                 SEARCH RESULTS NAVIGATION                           │
└─────────────────────────────────────────────────────────────────────┘

[Multiple results displayed]
         │
         ├──→ [Formatted layout tab]
         │         │
         │         ▼
         │    ┌─────────────────────┐
         │    │ List of all results │
         │    │ with references     │
         │    │ and highlighted     │
         │    │ search terms        │
         │    └─────────────────────┘
         │         │
         │         ▼
         │    [Tap result] ──→ Read in context
         │
         └──→ [Split layout tab]
                  │
                  ▼
             ┌─────────────────────┐
             │ Left: Chapter view  │
             │ Right: Result list  │
             └─────────────────────┘
                  │
                  ▼
             [Navigate with arrows or tap]
                  │
                  ▼
             [Chapter scrolls to result]
```

---

## 4. Highlighting Flow

### 4.1 Apply Highlight Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    APPLY HIGHLIGHT FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

[Verse(s) selected in chapter view]
         │
         ▼
┌─────────────────────┐
│ Highlighting        │
│ enabled for this    │
│ translation?        │
└─────────────────────┘
    │           │
   Yes          No
    │           │
    ▼           ▼
[Highlight    [No highlight
 button       button shown]
 visible]
    │
    ├──→ [Tap highlight button] ──→ Apply active color
    │                                    │
    │                                    ▼
    │                             [Highlight saved]
    │                                    │
    │                                    ▼
    │                             [Verse background changes]
    │
    └──→ [Tap dropdown arrow] ──→ Show color palette
                │
                ▼
         [Select different color]
                │
                ▼
         [Apply selected color]
```

### 4.2 Remove Highlight Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                   REMOVE HIGHLIGHT FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

[Tap on highlighted verse]
         │
         ▼
[Verse selected]
         │
         ▼
[Highlight button shows current color]
         │
         ▼
[Tap highlight button]
         │
         ▼
┌─────────────────────┐
│ Same color as       │
│ active?             │
└─────────────────────┘
    │           │
   Yes          No
    │           │
    ▼           ▼
[Toggle off   [Replace with
 = remove]     active color]
```

### 4.3 Color Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                  COLOR MANAGEMENT FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

[Settings > Highlights]
         │
         ▼
[Color Manager visible]
         │
         ├──→ [Add New Color]
         │         │
         │         ▼
         │    [Enter name]
         │         │
         │         ▼
         │    [Pick color (picker or hex)]
         │         │
         │         ▼
         │    [Save] ──→ Color added to palette
         │
         ├──→ [Edit color (pencil icon)]
         │         │
         │         ▼
         │    [Modify name or hex]
         │         │
         │         ▼
         │    [Save] ──→ All highlights update color
         │
         ├──→ [Delete color (trash icon)]
         │         │
         │         ▼
         │    [Confirm dialog with count]
         │         │
         │         ▼
         │    [Delete] ──→ Color + highlights removed
         │
         └──→ [Drag handle to reorder]
                  │
                  ▼
             [Order saved automatically]
```

---

## 5. Copy to Clipboard Flow

### 5.1 Copy Selected Passage

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COPY PASSAGE FLOW                                │
└─────────────────────────────────────────────────────────────────────┘

[Verse(s) selected]
         │
         ▼
[Tap Copy button]
         │
         ▼
┌─────────────────────┐
│ Get default copy    │
│ template for locale │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Apply format        │
│ template settings   │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Get book names from │
│ selected naming     │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Format passage      │
│ text + reference    │
└─────────────────────┘
         │
         ▼
[Write to clipboard]
         │
         ▼
[Show success notification]
```

### 5.2 Copy with Different Template

```
[Copy button dropdown]
         │
         ▼
[Select copy template]
         │
         ▼
[Format using selected template]
         │
         ▼
[Copy to clipboard]
```

---

## 6. Settings Flow

### 6.1 Settings Navigation

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SETTINGS NAVIGATION                             │
└─────────────────────────────────────────────────────────────────────┘

[Tap Settings icon]
         │
         ▼
[Navigate to /settings]
         │
         ▼
[Settings page with tabs]
         │
         ├──→ General
         ├──→ Appearance
         ├──→ Highlights
         ├──→ Translations
         ├──→ Book Names
         ├──→ Format Templates
         ├──→ Copy Templates
         └──→ Import/Export
```

### 6.2 Translation Settings Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                  TRANSLATION SETTINGS FLOW                          │
└─────────────────────────────────────────────────────────────────────┘

[Settings > Translations]
         │
         ▼
[Translations grouped by locale]
         │
         ├──→ [Toggle checkbox] ──→ Select/deselect translation
         │                              │
         │                              ▼
         │                       [Add to Bible Selector dropdown]
         │
         ├──→ [Radio button] ──→ Set as default for locale
         │
         └──→ [Highlight toggle] ──→ Enable highlighting for translation
                                         │
                                         ▼
                                  [Highlight button appears in reader]
```

---

## 7. Import/Export Flow

### 7.1 Export Settings

```
┌─────────────────────────────────────────────────────────────────────┐
│                      EXPORT SETTINGS FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

[Settings > Import/Export]
         │
         ▼
[Tap Export Settings]
         │
         ▼
[Generate JSON from localStorage]
         │
         ▼
[Download as jota-app-settings.json]
```

### 7.2 Export Highlights

```
[Settings > Highlights]
         │
         ▼
[Tap Export Highlights]
         │
         ▼
[Generate JSON with all highlights + colors]
         │
         ▼
[Download as jota-app-highlights.json]
```

### 7.3 Import Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        IMPORT FLOW                                  │
└─────────────────────────────────────────────────────────────────────┘

[Tap Select File]
         │
         ▼
[File picker opens]
         │
         ▼
[Select .json file]
         │
         ▼
[Tap Import]
         │
         ▼
┌─────────────────────┐
│ Validate JSON       │
│ structure           │
└─────────────────────┘
    │           │
  Valid      Invalid
    │           │
    ▼           ▼
[Merge with   [Show error
 existing]     message]
    │
    ▼
[Show success notification]
```

---

## 8. Help Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HELP FLOW                                   │
└─────────────────────────────────────────────────────────────────────┘

[Tap Help icon]
         │
         ▼
[Navigate to /help]
         │
         ▼
[Help page with manual content]
         │
         ├──→ [Table of Contents] ──→ Jump to section
         │
         └──→ [Scroll through documentation]
```

---

## 9. Error Handling Flows

### 9.1 Translation Load Error

```
[Attempt to load translation]
         │
         ▼
[Network error or 404]
         │
         ▼
[Show error notification]
         │
         ▼
[User can retry or select different translation]
```

### 9.2 Storage Quota Exceeded

```
[Attempt to save highlight]
         │
         ▼
[localStorage quota exceeded]
         │
         ▼
[Show quota warning with storage stats]
         │
         ▼
[Suggest removing highlights or clearing data]
```

---

## Flow Summary

| Flow Category | Primary Flows | Complexity |
|---------------|---------------|------------|
| Setup | 1 | Low |
| Reading | 3 | Medium |
| Search | 3 | High |
| Highlighting | 3 | Medium |
| Copy | 2 | Low |
| Settings | 6 | Medium |
| Import/Export | 3 | Low |
| Help | 1 | Low |
| Error Handling | 2 | Low |

**Total Documented Flows**: 24

---

## Next Steps

1. See `03-architecture.md` for technical implementation details
2. See `04-issues-and-roadmap.md` for improvement opportunities
