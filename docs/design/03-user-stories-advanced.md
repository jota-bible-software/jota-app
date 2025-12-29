# User Stories - Advanced Features

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document contains user stories for advanced features, including those from the product roadmap (`private/todo.md`). These features enhance the core experience for power users.

---

## 1. Camera OCR (Verse Detection)

### From Roadmap: Priority 1

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| OCR-01 | As a Pastor, I want to point my camera at a printed Bible page, so that I can quickly navigate to that passage digitally. | Should | David |
| OCR-02 | As a Casual User, I want to photograph a verse on a poster/card, so that I can find it in the Bible. | Should | Jessica |
| OCR-03 | As a Bible Student, I want the camera to detect multiple references, so that I can scan book pages. | Could | Michael |
| OCR-04 | As any user, I want detected references shown as tappable buttons, so that I can choose which to open. | Should | All |
| OCR-05 | As any user, I want OCR to work offline, so that I can use it without internet. | Could | All |

### Implementation Notes

```
Camera OCR Flow:
├── Open camera viewfinder
├── Frame printed text
├── Real-time reference detection overlay
├── Tap detected reference
├── Navigate to passage
└── Optional: Save scan history
```

---

## 2. Reading Plans

### From Roadmap: Priority 1

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| RP-01 | As a Daily Reader, I want to follow a Bible-in-a-year plan, so that I can read the entire Bible systematically. | Must | Sarah |
| RP-02 | As a Daily Reader, I want to see today's reading, so that I know what to read. | Must | Sarah |
| RP-03 | As any user, I want to mark readings as complete, so that I can track progress. | Must | All |
| RP-04 | As a Daily Reader, I want to see my overall progress (percentage), so that I stay motivated. | Should | Sarah |
| RP-05 | As a Bible Student, I want to choose from multiple plan types, so that I can find one that suits me. | Should | Michael |
| RP-06 | As a Daily Reader, I want the plan to sync my current chapter, so that marking the chapter marks the plan. | Should | Sarah |
| RP-07 | As any user, I want to restart or change plans, so that I can adjust if needed. | Should | All |
| RP-08 | As a Daily Reader, I want streak tracking, so that I can maintain my reading habit. | Could | Sarah |

### Plan Types to Support

| Plan Type | Duration | Description |
|-----------|----------|-------------|
| Chronological | 1 year | Bible in historical order |
| Canonical | 1 year | Genesis to Revelation |
| NT + Psalms | 1 year | New Testament + Psalms daily |
| Gospels | 90 days | All four Gospels |
| Psalms | 1 month | Psalms in 30 days |
| Custom | Variable | User-defined |

---

## 3. Audio Bible

### From Roadmap: Priority 2

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| AU-01 | As a Daily Reader, I want to listen to chapters while commuting, so that I can consume Bible during travel. | Should | Sarah |
| AU-02 | As a Pastor, I want to download audio for offline listening, so that I can listen during flights. | Should | David |
| AU-03 | As any user, I want to see synchronized text highlighting, so that I can follow along. | Could | All |
| AU-04 | As a Daily Reader, I want a sleep timer, so that audio stops after I fall asleep. | Should | Sarah |
| AU-05 | As any user, I want playback speed control (0.5x - 2x), so that I can listen at my preferred pace. | Should | All |
| AU-06 | As any user, I want background playback, so that I can listen while using other apps. | Must | All |
| AU-07 | As any user, I want lock screen controls, so that I can pause/play without unlocking. | Must | All |
| AU-08 | As a Multi-lingual User, I want audio in my language, so that I can listen in my native tongue. | Should | Ana |

### Audio Player Features

```
Mini Player (bottom bar):
├── Play/Pause button
├── Chapter title
├── Progress bar
└── Expand button

Full Player:
├── Chapter navigation
├── Progress scrubber
├── Speed control
├── Sleep timer
├── Download status
└── Translation info
```

---

## 4. Cross-References

### From Roadmap: Priority 2

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| XR-01 | As a Bible Student, I want to see related passages for a verse, so that I can explore connections. | Should | Michael |
| XR-02 | As a Bible Student, I want to tap a cross-reference to navigate there, so that I can explore the connection. | Should | Michael |
| XR-03 | As a Bible Student, I want to return to my original position after viewing a cross-reference, so that I don't lose my place. | Should | Michael |
| XR-04 | As a Pastor, I want cross-references to work offline, so that I can study without internet. | Should | David |

---

## 5. Translation Comparison

### From Roadmap: Priority 2

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| TC-01 | As a Bible Student, I want to compare the same verse across multiple translations, so that I can understand nuances. | Should | Michael |
| TC-02 | As a Multi-lingual User, I want to compare translations in different languages, so that I can understand both. | Should | Ana |
| TC-03 | As a Bible Student, I want a parallel view (side-by-side), so that I can read both simultaneously. | Could | Michael |
| TC-04 | As a Pastor, I want to quickly switch between comparison mode and single translation, so that I can toggle as needed. | Should | David |

### Comparison Views

```
Vertical Stack:                    Side-by-Side:
┌──────────────────────┐          ┌──────────┬──────────┐
│ ESV: For God so      │          │ ESV      │ NIV      │
│ loved the world...   │          │ For God  │ For God  │
├──────────────────────┤          │ so loved │ so loved │
│ NIV: For God so      │          │ the      │ the      │
│ loved the world...   │          │ world... │ world... │
├──────────────────────┤          └──────────┴──────────┘
│ NLT: For this is     │
│ how God loved...     │
└──────────────────────┘
```

---

## 6. Notes & Annotations

### Future Feature

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| NT-01 | As a Bible Student, I want to add notes to verses, so that I can record my insights. | Could | Michael |
| NT-02 | As a Pastor, I want to attach notes to highlights, so that I can remember why I highlighted. | Could | David |
| NT-03 | As a Bible Student, I want to search my notes, so that I can find previous thoughts. | Could | Michael |
| NT-04 | As any user, I want notes to export with highlights, so that my work is backed up. | Could | All |
| NT-05 | As a Bible Student, I want rich text notes (bold, italic, lists), so that I can format my thoughts. | Could | Michael |

---

## 7. Cloud Sync

### From Roadmap: Priority 2

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| SY-01 | As a Bible Student, I want my highlights synced across devices, so that I can use any device. | Should | Michael |
| SY-02 | As a Daily Reader, I want my reading position synced, so that I can switch devices seamlessly. | Should | Sarah |
| SY-03 | As any user, I want sync to be optional, so that I can choose privacy over convenience. | Must | All |
| SY-04 | As a Pastor, I want to see sync status, so that I know my data is backed up. | Should | David |
| SY-05 | As any user, I want sync to resolve conflicts gracefully, so that I don't lose data. | Must | All |
| SY-06 | As any user, I want sync to work on WiFi only (optional), so that I can control data usage. | Could | All |

---

## 8. Grammatical Search

### From Roadmap: Priority 3

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| GS-01 | As a Bible Student, I want to search for Strong's numbers, so that I can find word occurrences. | Could | Michael |
| GS-02 | As a Bible Student, I want to search by Greek/Hebrew root, so that I can find related words. | Could | Michael |
| GS-03 | As a Bible Student, I want to filter by part of speech (verb, noun), so that I can study grammar. | Could | Michael |

---

## 9. Hitchcock's Bible Names

### From Roadmap: Priority 3

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| HN-01 | As a Bible Student, I want to look up the meaning of biblical names, so that I can understand their significance. | Could | Michael |
| HN-02 | As a Casual User, I want name meanings to appear when I tap a name, so that I can learn without effort. | Could | Jessica |
| HN-03 | As a Pastor, I want to search names by meaning, so that I can find names for illustrations. | Could | David |

---

## 10. Verse of the Day

### Enhancement

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| VD-01 | As a Daily Reader, I want a verse of the day on the home screen, so that I'm greeted with inspiration. | Should | Sarah |
| VD-02 | As a Daily Reader, I want a notification with the verse of the day, so that I remember to read. | Could | Sarah |
| VD-03 | As a Daily Reader, I want to share the verse of the day, so that I can encourage others. | Could | Sarah |
| VD-04 | As any user, I want to disable verse of the day, so that I can customize my home screen. | Should | All |

---

## 11. Widgets (Mobile)

### Mobile-Specific

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| WG-01 | As a Daily Reader, I want a home screen widget with today's verse, so that I see it without opening the app. | Could | Sarah |
| WG-02 | As a Daily Reader, I want a widget showing my reading plan progress, so that I stay motivated. | Could | Sarah |
| WG-03 | As any user, I want to tap the widget to open the app, so that I can continue reading. | Could | All |

---

## 12. Desktop App

### From Roadmap: Priority 2

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| DT-01 | As a Pastor, I want a desktop app for sermon prep, so that I can work on a larger screen. | Should | David |
| DT-02 | As a Bible Student, I want keyboard shortcuts, so that I can navigate efficiently. | Should | Michael |
| DT-03 | As a Pastor, I want the desktop app to sync with mobile, so that my data is consistent. | Should | David |
| DT-04 | As any user, I want the desktop app to work offline, so that I can use it without internet. | Must | All |

### Desktop-Specific Features

```
Keyboard Shortcuts:
├── Cmd/Ctrl + F: Search
├── Cmd/Ctrl + G: Go to reference
├── Cmd/Ctrl + H: Highlight selected
├── Arrow Left/Right: Navigate chapters
├── Cmd/Ctrl + 1-8: Highlight color shortcuts
└── Cmd/Ctrl + Shift + C: Copy with format
```

---

## Story Points Summary

| Feature Area | Must | Should | Could | Total |
|--------------|------|--------|-------|-------|
| Camera OCR | 0 | 3 | 2 | 5 |
| Reading Plans | 3 | 4 | 1 | 8 |
| Audio Bible | 2 | 5 | 1 | 8 |
| Cross-References | 0 | 4 | 0 | 4 |
| Translation Comparison | 0 | 3 | 1 | 4 |
| Notes | 0 | 0 | 5 | 5 |
| Cloud Sync | 2 | 3 | 1 | 6 |
| Grammatical Search | 0 | 0 | 3 | 3 |
| Hitchcock's Names | 0 | 0 | 3 | 3 |
| Verse of the Day | 0 | 2 | 2 | 4 |
| Widgets | 0 | 0 | 3 | 3 |
| Desktop App | 1 | 3 | 0 | 4 |
| **Total** | **8** | **27** | **22** | **57** |

---

## Feature Dependency Map

```
┌─────────────────────────────────────────────────────┐
│  Feature Dependencies                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Independent (can build anytime):                  │
│  ├── Camera OCR                                    │
│  ├── Verse of the Day                              │
│  ├── Hitchcock's Names                             │
│  └── Widgets                                       │
│                                                     │
│  Depends on Core:                                   │
│  ├── Reading Plans (needs chapter tracking)        │
│  ├── Audio Bible (needs chapter navigation)        │
│  ├── Cross-References (needs passage display)      │
│  └── Translation Comparison (needs multi-trans)    │
│                                                     │
│  Depends on Highlights:                             │
│  ├── Notes (attached to highlights)                │
│  └── Cloud Sync (syncs highlights)                 │
│                                                     │
│  Depends on Search:                                 │
│  └── Grammatical Search (extends text search)      │
│                                                     │
│  Depends on Platform:                               │
│  └── Desktop App (separate project, shares core)   │
│                                                     │
└─────────────────────────────────────────────────────┘
```
