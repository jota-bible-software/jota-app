# User Stories - Mobile-Specific

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document contains user stories specific to the React Native mobile app experience. These stories address mobile-specific interactions, platform features, and device capabilities.

---

## 1. App Lifecycle

### 1.1 Launch & Resume

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| LC-01 | As a Daily Reader, I want the app to launch in under 2 seconds, so that I can start reading quickly. | Must | Sarah |
| LC-02 | As a Pastor, I want the app to resume exactly where I left off, so that I don't lose my place during interruptions. | Must | David |
| LC-03 | As any user, I want the app to preserve my scroll position when switching apps, so that returning is seamless. | Must | All |
| LC-04 | As any user, I want the app to work immediately after launch (even if syncing), so that I'm not blocked by loading. | Must | All |
| LC-05 | As a Daily Reader, I want to see my last reading position on the home screen, so that I can jump back instantly. | Should | Sarah |

### 1.2 Background & Foreground

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| LC-06 | As a Daily Reader, I want audio to continue playing when I switch apps, so that I can multitask. | Must | Sarah |
| LC-07 | As any user, I want downloads to continue in the background, so that I don't have to keep the app open. | Should | All |
| LC-08 | As any user, I want the app to sync data when returning to foreground, so that I have the latest data. | Should | All |

---

## 2. Touch & Gesture Interactions

### 2.1 Navigation Gestures

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| TG-01 | As any user, I want to swipe left/right to change chapters, so that navigation feels natural. | Must | All |
| TG-02 | As any user, I want edge swipe to go back, so that I can navigate with one hand. | Must | All |
| TG-03 | As a Daily Reader, I want pull-to-refresh on reading plans, so that I can check for updates. | Should | Sarah |
| TG-04 | As any user, I want to pinch to adjust font size, so that I can resize text quickly. | Should | All |

### 2.2 Selection Gestures

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| TG-05 | As a Daily Reader, I want to tap a verse to select it, so that I can highlight or copy it. | Must | Sarah |
| TG-06 | As a Bible Student, I want to long-press to start multi-verse selection, so that I can select a range. | Must | Michael |
| TG-07 | As a Daily Reader, I want to double-tap for quick highlight (default color), so that I can mark verses rapidly. | Should | Sarah |
| TG-08 | As any user, I want visual feedback (haptic + highlight) when I select a verse, so that I know it's selected. | Must | All |

### 2.3 Haptic Feedback

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| TG-09 | As any user, I want haptic feedback when navigating between chapters, so that I feel the transition. | Should | All |
| TG-10 | As any user, I want haptic feedback when highlighting, so that I know the action succeeded. | Should | All |
| TG-11 | As a Pastor, I want to disable haptic feedback in settings, so that I can use the app silently. | Should | David |

---

## 3. Bottom Sheets & Modals

### 3.1 Verse Actions

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| BS-01 | As any user, I want verse actions to appear in a bottom sheet, so that they're easy to reach with one hand. | Must | All |
| BS-02 | As any user, I want to swipe down to dismiss a bottom sheet, so that I can cancel quickly. | Must | All |
| BS-03 | As a Daily Reader, I want frequently used actions at the bottom of the sheet, so that they're easiest to reach. | Should | Sarah |

### 3.2 Navigation Modals

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| BS-04 | As any user, I want the book picker to appear as a full-screen modal, so that I have room to browse. | Should | All |
| BS-05 | As any user, I want the chapter picker to appear as a grid in a bottom sheet, so that selection is quick. | Should | All |
| BS-06 | As a Pastor, I want the translation picker as a bottom sheet with search, so that I can find translations quickly. | Should | David |

---

## 4. Notifications

### 4.1 Reading Reminders

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| NF-01 | As a Daily Reader, I want optional daily reading reminders, so that I maintain my habit. | Should | Sarah |
| NF-02 | As any user, I want to set the reminder time, so that it fits my schedule. | Should | All |
| NF-03 | As any user, I want to snooze or dismiss reminders, so that I have flexibility. | Should | All |
| NF-04 | As any user, I want to disable reminders easily, so that I'm not bothered if I don't want them. | Must | All |

### 4.2 Notification Actions

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| NF-05 | As a Daily Reader, I want to tap a notification to go directly to today's reading, so that I start quickly. | Should | Sarah |
| NF-06 | As any user, I want a "Mark as Read" action in the notification, so that I can update without opening the app. | Could | All |

---

## 5. Share Sheet Integration

### 5.1 Share From App

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| SS-01 | As a Daily Reader, I want to share verses via the system share sheet, so that I can use any app. | Must | Sarah |
| SS-02 | As a Multi-lingual User, I want shared text to include proper formatting, so that it looks professional. | Should | Ana |
| SS-03 | As a Daily Reader, I want to share verse images, so that I can post visually appealing content. | Could | Sarah |

### 5.2 Share To App

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| SS-04 | As a Casual User, I want to share text containing a reference TO Jota, so that I can look it up. | Should | Jessica |
| SS-05 | As any user, I want Jota to appear in the system share sheet as a target, so that I can send content to it. | Should | All |

---

## 6. Deep Linking

### 6.1 URL Handling

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| DL-01 | As a Pastor, I want URLs like "jota://john/3/16" to open that verse in the app, so that I can link from other apps. | Should | David |
| DL-02 | As any user, I want web links to jota.app to open in the mobile app, so that the experience is seamless. | Should | All |
| DL-03 | As a Bible Student, I want to copy a deep link to a specific passage, so that I can share direct links. | Could | Michael |

### 6.2 Quick Actions

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| DL-04 | As a Daily Reader, I want quick actions on the app icon (3D touch/long press), so that I can jump to common actions. | Could | Sarah |
| DL-05 | As a Daily Reader, I want a "Continue Reading" quick action, so that I can resume instantly. | Could | Sarah |
| DL-06 | As a Pastor, I want a "Search" quick action, so that I can go directly to search. | Could | David |

---

## 7. Platform Features

### 7.1 iOS-Specific

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| PF-01 | As an iOS user, I want the app to support Dynamic Type, so that my system font size is respected. | Should | All |
| PF-02 | As an iOS user, I want the app to support Spotlight search, so that I can search Bible content from the home screen. | Could | All |
| PF-03 | As an iOS user, I want Siri Shortcuts for common actions, so that I can use voice commands. | Could | All |
| PF-04 | As an iOS user, I want the app to support widget on home screen and lock screen, so that I see content at a glance. | Could | All |

### 7.2 Android-Specific

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| PF-05 | As an Android user, I want the app to support Material You theming, so that colors match my device. | Could | All |
| PF-06 | As an Android user, I want the app to support Android App Shortcuts, so that I can access features quickly. | Could | All |
| PF-07 | As an Android user, I want the app to support Picture-in-Picture for audio, so that I can see controls while multitasking. | Could | All |

---

## 8. Accessibility

### 8.1 Screen Reader Support

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| AC-01 | As a visually impaired user, I want the app to work fully with VoiceOver/TalkBack, so that I can read the Bible. | Must | All |
| AC-02 | As a visually impaired user, I want verses to be read as complete sentences, so that content makes sense. | Must | All |
| AC-03 | As a visually impaired user, I want navigation elements properly labeled, so that I can navigate the app. | Must | All |
| AC-04 | As any user, I want focus to move logically when navigating, so that the app is predictable. | Must | All |

### 8.2 Visual Accessibility

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| AC-05 | As a user with low vision, I want high contrast mode, so that I can see text clearly. | Should | All |
| AC-06 | As any user, I want text to scale up to 200% without breaking layout, so that I can read large text. | Must | All |
| AC-07 | As a colorblind user, I want highlights to be distinguishable by more than color, so that I can tell them apart. | Should | All |

### 8.3 Motor Accessibility

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| AC-08 | As a user with motor impairments, I want touch targets at least 44x44pt, so that I can tap accurately. | Must | All |
| AC-09 | As any user, I want to disable gestures and use buttons instead, so that I can navigate predictably. | Should | All |
| AC-10 | As a user with tremors, I want the app to ignore accidental taps, so that I don't trigger unwanted actions. | Could | All |

---

## 9. Battery & Performance

### 9.1 Battery Optimization

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| BP-01 | As any user, I want the app to use minimal battery, so that my phone lasts all day. | Must | All |
| BP-02 | As a Daily Reader, I want background activity to be minimal, so that the app doesn't drain battery when closed. | Must | Sarah |
| BP-03 | As any user, I want audio playback to be battery-efficient, so that I can listen for long periods. | Should | All |

### 9.2 Data Usage

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| BP-04 | As any user, I want to control whether downloads happen on cellular, so that I manage data costs. | Should | All |
| BP-05 | As any user, I want the app to show data usage per feature, so that I understand consumption. | Could | All |
| BP-06 | As a Daily Reader, I want the app to work primarily offline, so that I minimize data usage. | Must | Sarah |

---

## 10. Onboarding

### 10.1 First Launch

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| OB-01 | As a new user, I want a quick setup flow (under 30 seconds), so that I can start reading fast. | Must | All |
| OB-02 | As a Casual User, I want to skip detailed setup and use defaults, so that I'm not overwhelmed. | Must | Jessica |
| OB-03 | As a Multi-lingual User, I want to select my language on first launch, so that the app is immediately in my language. | Must | Ana |
| OB-04 | As a new user, I want to choose my first translation, so that I start with content I prefer. | Must | All |

### 10.2 Feature Discovery

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| OB-05 | As a new user, I want optional gesture hints, so that I learn how to navigate. | Should | All |
| OB-06 | As a new user, I want a brief tutorial on highlighting, so that I know how to mark verses. | Should | All |
| OB-07 | As a returning user, I want to access tutorials again from settings, so that I can refresh my memory. | Should | All |
| OB-08 | As any user, I want to dismiss hints permanently, so that I'm not bothered by them. | Must | All |

---

## 11. Data Migration

### 11.1 From Web

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| DM-01 | As a web app user, I want to import my highlights to mobile, so that I keep my work. | Should | All |
| DM-02 | As a web app user, I want to scan a QR code to transfer data, so that migration is easy. | Could | All |
| DM-03 | As a web app user, I want import to merge with existing mobile data, so that nothing is lost. | Should | All |

### 11.2 From Other Apps

| ID | Story | Priority | Persona |
|----|-------|----------|---------|
| DM-04 | As a Bible Student, I want to import highlights from other apps (if supported), so that I don't start from scratch. | Could | Michael |

---

## Story Points Summary

| Feature Area | Must | Should | Could | Total |
|--------------|------|--------|-------|-------|
| App Lifecycle | 4 | 3 | 0 | 7 |
| Touch & Gestures | 4 | 5 | 0 | 9 |
| Bottom Sheets | 2 | 4 | 0 | 6 |
| Notifications | 1 | 4 | 1 | 6 |
| Share Sheet | 1 | 3 | 1 | 5 |
| Deep Linking | 0 | 3 | 3 | 6 |
| Platform Features | 0 | 1 | 6 | 7 |
| Accessibility | 5 | 3 | 2 | 10 |
| Battery & Performance | 3 | 2 | 1 | 6 |
| Onboarding | 4 | 3 | 0 | 7 |
| Data Migration | 0 | 3 | 2 | 5 |
| **Total** | **24** | **34** | **16** | **74** |

---

## Mobile MVP Scope

### Must Have for v1.0

| Category | Stories |
|----------|---------|
| Launch | LC-01, LC-02, LC-03, LC-04 |
| Gestures | TG-01, TG-02, TG-05, TG-06, TG-08 |
| Bottom Sheets | BS-01, BS-02 |
| Notifications | NF-04 |
| Share | SS-01 |
| Accessibility | AC-01, AC-02, AC-03, AC-04, AC-06, AC-08 |
| Battery | BP-01, BP-02, BP-06 |
| Onboarding | OB-01, OB-02, OB-03, OB-04, OB-08 |

**Total Must Have**: 24 stories

### Should Have for v1.1

| Category | Stories |
|----------|---------|
| Lifecycle | LC-05, LC-06, LC-07, LC-08 |
| Gestures | TG-03, TG-04, TG-07, TG-09, TG-10, TG-11 |
| Bottom Sheets | BS-03, BS-04, BS-05, BS-06 |
| Notifications | NF-01, NF-02, NF-03, NF-05 |
| Share | SS-02, SS-04, SS-05 |
| Deep Linking | DL-01, DL-02 |
| Accessibility | AC-05, AC-07, AC-09 |
| Battery | BP-03, BP-04 |
| Onboarding | OB-05, OB-06, OB-07 |
| Migration | DM-01, DM-03 |

**Total Should Have**: 34 stories
