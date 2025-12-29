# User Stories - Core Features

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document contains user stories for core Jota Bible App features. Stories follow the format: "As a [persona], I want to [action], so that [benefit]."

Stories are prioritized using MoSCoW: Must, Should, Could, Won't.

---

## 1. Bible Reading

### 1.1 Chapter Navigation

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| BR-01 | As a Daily Reader, I want to resume reading from where I left off, so that I don't waste time finding my place. | Must | Sarah |
| BR-02 | As a Bible Student, I want to swipe between chapters, so that I can read continuously without interruption. | Must | Michael |
| BR-03 | As a Pastor, I want to jump directly to a specific book and chapter, so that I can quickly reference passages. | Must | David |
| BR-04 | As a Casual User, I want to browse books visually, so that I can find content without knowing exact references. | Should | Jessica |
| BR-05 | As a Multi-lingual User, I want book names displayed in my language, so that navigation feels natural. | Should | Ana |

### 1.2 Verse Display

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| BR-06 | As a Pastor, I want to adjust font size, so that I can read comfortably in various lighting conditions. | Must | David |
| BR-07 | As a Daily Reader, I want a dark mode option, so that I can read at night without eye strain. | Must | Sarah |
| BR-08 | As a Bible Student, I want verse numbers clearly visible, so that I can reference specific verses easily. | Must | Michael |
| BR-09 | As a Casual User, I want clean, readable text without clutter, so that reading feels inviting rather than intimidating. | Must | Jessica |
| BR-10 | As any user, I want chapter headings visible, so that I always know my current location. | Should | All |

### 1.3 Translation Management

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| BR-11 | As a Bible Student, I want to switch between translations quickly, so that I can compare interpretations. | Must | Michael |
| BR-12 | As a Multi-lingual User, I want translations in multiple languages, so that I can read in my preferred language. | Must | Ana |
| BR-13 | As a Daily Reader, I want to set a default translation, so that the app opens with my preferred version. | Must | Sarah |
| BR-14 | As a Pastor, I want to see the translation name displayed, so that I know which version I'm reading. | Should | David |
| BR-15 | As any user, I want to download translations for offline use, so that I can read without internet. | Must | All |

---

## 2. Search & Navigation

### 2.1 Reference Search

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| SN-01 | As a Pastor, I want to type "John 3:16" and go directly there, so that I can quickly find familiar passages. | Must | David |
| SN-02 | As a Multi-lingual User, I want to type "João 3:16" and have it understood, so that I can search in my native language. | Must | Ana |
| SN-03 | As a Casual User, I want the search to forgive minor typos, so that I can find verses without perfect spelling. | Should | Jessica |
| SN-04 | As a Bible Student, I want to enter verse ranges like "Romans 8:28-30", so that I can navigate to specific passages. | Must | Michael |
| SN-05 | As any user, I want autocomplete suggestions while typing, so that I can navigate faster. | Should | All |

### 2.2 Text Search

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| SN-06 | As a Casual User, I want to search for words like "love" or "peace", so that I can find relevant verses. | Must | Jessica |
| SN-07 | As a Bible Student, I want to search for exact phrases, so that I can find specific wordings. | Should | Michael |
| SN-08 | As a Pastor, I want search results to show context around matches, so that I can evaluate relevance quickly. | Should | David |
| SN-09 | As any user, I want search results sorted by relevance, so that the best matches appear first. | Should | All |
| SN-10 | As a Bible Student, I want to filter search results by book or testament, so that I can narrow down results. | Could | Michael |

### 2.3 Search History

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| SN-11 | As a Daily Reader, I want to see my recent searches, so that I can quickly return to previous lookups. | Should | Sarah |
| SN-12 | As a Pastor, I want to clear my search history, so that I can maintain privacy. | Should | David |
| SN-13 | As a Bible Student, I want to bookmark/save specific searches, so that I can access them repeatedly. | Could | Michael |

---

## 3. Highlighting

### 3.1 Creating Highlights

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| HL-01 | As a Daily Reader, I want to tap a verse and highlight it, so that I can mark meaningful passages. | Must | Sarah |
| HL-02 | As a Bible Student, I want to select multiple verses and highlight them together, so that I can mark complete thoughts. | Must | Michael |
| HL-03 | As a Bible Student, I want to choose from multiple highlight colors, so that I can categorize by theme. | Must | Michael |
| HL-04 | As a Daily Reader, I want a quick-highlight gesture (double-tap), so that I can highlight without extra steps. | Should | Sarah |
| HL-05 | As any user, I want visual feedback when a highlight is applied, so that I know the action succeeded. | Must | All |

### 3.2 Managing Highlights

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| HL-06 | As a Bible Student, I want to view all my highlights in one place, so that I can review what I've marked. | Must | Michael |
| HL-07 | As a Bible Student, I want to filter highlights by color, so that I can see all highlights of one category. | Should | Michael |
| HL-08 | As a Daily Reader, I want to remove a highlight by tapping it, so that I can undo mistakes. | Must | Sarah |
| HL-09 | As a Pastor, I want to export my highlights, so that I can back them up or use them elsewhere. | Should | David |
| HL-10 | As a Bible Student, I want highlights to persist per translation, so that different translations can have different marks. | Should | Michael |

### 3.3 Highlight Colors

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| HL-11 | As a Bible Student, I want to name/label highlight colors, so that I remember what each color means. | Should | Michael |
| HL-12 | As any user, I want default colors that work in both light and dark modes, so that highlights are always visible. | Must | All |
| HL-13 | As a Bible Student, I want to create custom colors, so that I can have more categories than the defaults. | Could | Michael |

---

## 4. Copy & Share

### 4.1 Basic Copying

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| CS-01 | As a Pastor, I want to copy a verse with its reference, so that I can paste it into documents. | Must | David |
| CS-02 | As a Bible Student, I want to copy multiple verses at once, so that I can copy entire passages. | Must | Michael |
| CS-03 | As any user, I want the translation attribution included in copies, so that the source is clear. | Must | All |
| CS-04 | As a Daily Reader, I want visual confirmation when text is copied, so that I know it worked. | Must | Sarah |

### 4.2 Format Templates

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| CS-05 | As a Pastor, I want to choose from different copy formats, so that I can match different use cases. | Must | David |
| CS-06 | As a Bible Student, I want a "reference only" format, so that I can copy just the citation. | Should | Michael |
| CS-07 | As a Multi-lingual User, I want format templates in my language, so that the output is natural. | Should | Ana |
| CS-08 | As a Pastor, I want to create custom format templates, so that I can have consistent formatting. | Should | David |
| CS-09 | As any user, I want to preview the formatted text before copying, so that I know what I'm getting. | Should | All |

### 4.3 Sharing

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| CS-10 | As a Daily Reader, I want to share verses to other apps (WhatsApp, Messages), so that I can share with friends. | Should | Sarah |
| CS-11 | As a Multi-lingual User, I want to share in the language I'm reading, so that the content matches the recipient. | Should | Ana |

---

## 5. Settings & Preferences

### 5.1 Display Settings

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| ST-01 | As a Pastor, I want to set a larger default font size, so that text is always readable for me. | Must | David |
| ST-02 | As a Daily Reader, I want to toggle between light and dark mode, so that I can read comfortably anytime. | Must | Sarah |
| ST-03 | As any user, I want to choose font family, so that I can select my preferred reading font. | Could | All |
| ST-04 | As a Casual User, I want the app to follow system dark mode setting, so that it matches my device. | Should | Jessica |

### 5.2 App Settings

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| ST-05 | As a Multi-lingual User, I want to change the app language, so that menus are in my preferred language. | Must | Ana |
| ST-06 | As any user, I want to set my home screen (what shows on app open), so that I can customize my experience. | Should | All |
| ST-07 | As a Daily Reader, I want to manage downloaded translations, so that I can control storage usage. | Should | Sarah |
| ST-08 | As a Pastor, I want to disable analytics/tracking, so that I maintain privacy. | Should | David |

### 5.3 Data Management

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| ST-09 | As a Bible Student, I want to export all my data (highlights, notes, settings), so that I have a backup. | Should | Michael |
| ST-10 | As a Multi-lingual User, I want to import data from the web version, so that I don't lose my highlights. | Should | Ana |
| ST-11 | As any user, I want to reset the app to defaults, so that I can start fresh if needed. | Should | All |

---

## 6. Offline Functionality

### 6.1 Offline Reading

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| OF-01 | As a Pastor, I want downloaded translations to work completely offline, so that I can use the app anywhere. | Must | David |
| OF-02 | As a Daily Reader, I want my highlights to persist offline, so that I don't lose my marks. | Must | Sarah |
| OF-03 | As any user, I want to see clearly which content is available offline, so that I know what I can access. | Should | All |

### 6.2 Download Management

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| OF-04 | As a Daily Reader, I want to see download progress, so that I know when translations are ready. | Must | Sarah |
| OF-05 | As any user, I want to pause and resume downloads, so that I can manage bandwidth. | Should | All |
| OF-06 | As a Bible Student, I want to delete downloaded translations, so that I can free up storage. | Must | Michael |
| OF-07 | As any user, I want to see storage usage per translation, so that I can make informed decisions. | Should | All |

---

## Acceptance Criteria Template

### Example: BR-01 (Resume Reading)

**Given**: User has previously read to Genesis chapter 3
**When**: User opens the app
**Then**:
- App displays "Continue Reading" option prominently
- Tapping it navigates to Genesis 3
- Scroll position is restored to approximate last position
- Takes less than 2 seconds

### Example: HL-01 (Create Highlight)

**Given**: User is viewing a chapter
**When**: User taps on a verse
**Then**:
- Verse is visually selected
- Color picker appears
- Tapping a color applies the highlight
- Highlight is immediately visible
- Highlight persists after navigation

---

## Story Points Summary

| Priority | Count | Notes |
|----------|-------|-------|
| Must Have | 28 | Core functionality |
| Should Have | 24 | Important but not blocking |
| Could Have | 4 | Nice to have |
| **Total** | **56** | Core feature stories |
