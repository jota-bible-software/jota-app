# Mobile UX Guidelines

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document establishes mobile UX guidelines for the Jota Bible App, covering touch interactions, accessibility, typography, dark mode, and platform-specific patterns.

---

## 1. Touch Targets & Spacing

### Minimum Touch Sizes

| Element | Minimum Size | Recommended | Notes |
|---------|-------------|-------------|-------|
| Buttons | 44x44pt | 48x48pt | Apple HIG minimum |
| List items | 44pt height | 56pt height | Material Design guideline |
| Icon buttons | 44x44pt | 48x48pt | Include padding |
| Tab bar items | 44pt | 56pt width | Equal distribution |
| Text inputs | 44pt height | 48pt height | Comfortable typing |

### Touch Spacing

```
┌─────────────────────────────────────────────────────┐
│  Touch Target Visualization                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌───────────┐     ┌───────────┐                  │
│   │           │ 8pt │           │  ← Minimum gap   │
│   │  Button   │ ──► │  Button   │    between       │
│   │  44x44    │     │  44x44    │    interactive   │
│   └───────────┘     └───────────┘    elements      │
│                                                     │
│   Visual size can be smaller than touch target:    │
│                                                     │
│   ┌─ Touch area ─────────┐                         │
│   │  ┌── Visual ──┐      │                         │
│   │  │   Icon     │      │                         │
│   │  │   24x24    │      │                         │
│   │  └────────────┘      │                         │
│   └──────────44x44───────┘                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Verse Row Design

```typescript
// components/VerseRow.tsx
const styles = StyleSheet.create({
  container: {
    minHeight: 48, // Minimum touch target
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  // Verse number should be easy to tap for selection
  verseNumber: {
    width: 32, // Touch area for verse number tap
    textAlign: 'center',
  },
})
```

---

## 2. Gesture Navigation

### Core Gestures

| Gesture | Action | Screen |
|---------|--------|--------|
| Swipe left | Next chapter | Bible reader |
| Swipe right | Previous chapter | Bible reader |
| Long press | Select verse | Bible reader |
| Double tap | Quick highlight | Bible reader (with default color) |
| Pinch | Adjust font size | Bible reader |
| Pull down | Show header/options | All screens |
| Swipe up | Dismiss bottom sheet | Modals |

### Gesture Implementation

```typescript
// components/ChapterGestureHandler.tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS
} from 'react-native-reanimated'

export function ChapterGestureHandler({
  children,
  onNext,
  onPrevious
}: Props) {
  const translateX = useSharedValue(0)
  const SWIPE_THRESHOLD = 100

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD && e.velocityX < -500) {
        runOnJS(onNext)()
      } else if (e.translationX > SWIPE_THRESHOLD && e.velocityX > 500) {
        runOnJS(onPrevious)()
      }
      translateX.value = withSpring(0)
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  )
}
```

### Gesture Hints

```
┌─────────────────────────────────────────────────────┐
│  First-time user gesture hints                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────┐           │
│  │                                     │           │
│  │  ← Swipe to navigate →              │           │
│  │                                     │           │
│  │     [Animated hand gesture]         │           │
│  │                                     │           │
│  └─────────────────────────────────────┘           │
│                                                     │
│  Show once, then remember in settings              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 3. One-Handed Use

### Reachability Zones

```
┌─────────────────────────────────────────────────────┐
│  Thumb Zone Map (Right-handed)                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────┐                       │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░ │  ░ = Hard to reach   │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░ │                       │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░ │                       │
│  │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │  ▒ = Moderate        │
│  │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │                       │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  ▓ = Easy to reach   │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │                       │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │                       │
│  │ ███████████████████████ │  █ = Natural thumb   │
│  │ ███████████████████████ │      position        │
│  └─────────────────────────┘                       │
│                                                     │
│  Tab bar should be at bottom (natural thumb zone)  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Design Principles for One-Handed Use

1. **Bottom Navigation**: Keep tab bar at bottom for easy thumb access
2. **Bottom Sheets**: Use bottom sheets instead of top modals for actions
3. **FAB Placement**: Floating action buttons in bottom-right corner
4. **Pull-Down Actions**: Avoid actions that require reaching to top of screen
5. **Swipe Actions**: Use swipe gestures instead of buttons when possible

### Bottom Sheet Pattern

```typescript
// components/ActionSheet.tsx
import BottomSheet from '@gorhom/bottom-sheet'

export function VerseActionSheet({
  verse,
  onHighlight,
  onCopy,
  onShare
}: Props) {
  const snapPoints = useMemo(() => ['25%', '50%'], [])

  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={BottomSheetBackdrop}
    >
      <View style={styles.content}>
        <Text style={styles.preview}>{verse.text}</Text>

        <View style={styles.actions}>
          <ActionButton icon="highlight" label="Highlight" onPress={onHighlight} />
          <ActionButton icon="copy" label="Copy" onPress={onCopy} />
          <ActionButton icon="share" label="Share" onPress={onShare} />
        </View>
      </View>
    </BottomSheet>
  )
}
```

---

## 4. Typography & Readability

### Type Scale

```typescript
// theme/typography.ts
export const typography = {
  // Display sizes (for large headers)
  displayLarge: { fontSize: 57, lineHeight: 64, fontWeight: '400' },
  displayMedium: { fontSize: 45, lineHeight: 52, fontWeight: '400' },
  displaySmall: { fontSize: 36, lineHeight: 44, fontWeight: '400' },

  // Headlines
  headlineLarge: { fontSize: 32, lineHeight: 40, fontWeight: '400' },
  headlineMedium: { fontSize: 28, lineHeight: 36, fontWeight: '400' },
  headlineSmall: { fontSize: 24, lineHeight: 32, fontWeight: '400' },

  // Titles
  titleLarge: { fontSize: 22, lineHeight: 28, fontWeight: '500' },
  titleMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  titleSmall: { fontSize: 14, lineHeight: 20, fontWeight: '500' },

  // Body text (for Bible reading)
  bodyLarge: { fontSize: 18, lineHeight: 28, fontWeight: '400' },
  bodyMedium: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: '400' },

  // Labels
  labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  labelMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: '500' },
}
```

### Bible Reading Typography

```typescript
// theme/bible-typography.ts
export const bibleTypography = {
  // Verse text (primary reading)
  verseText: {
    fontFamily: 'Georgia', // Serif for extended reading
    fontSize: 18,
    lineHeight: 30, // 1.67 line height for readability
    letterSpacing: 0.2,
  },

  // Verse numbers
  verseNumber: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },

  // Chapter numbers
  chapterNumber: {
    fontFamily: 'Georgia',
    fontSize: 48,
    fontWeight: '400',
    color: '#333',
  },

  // Book headers
  bookHeader: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
}
```

### Dynamic Type Support

```typescript
// hooks/useDynamicType.ts
import { useWindowDimensions } from 'react-native'

const fontScaleRanges = {
  minimum: 0.8,
  maximum: 1.5,
}

export function useDynamicType() {
  const { fontScale } = useWindowDimensions()

  const clampedScale = Math.min(
    Math.max(fontScale, fontScaleRanges.minimum),
    fontScaleRanges.maximum
  )

  const scaledFontSize = (baseSize: number) => baseSize * clampedScale

  return {
    fontScale: clampedScale,
    scaledFontSize,
    isLargeText: clampedScale > 1.2,
    isSmallText: clampedScale < 0.9,
  }
}
```

---

## 5. Dark Mode

### Color Tokens

```typescript
// theme/colors.ts
export const colors = {
  light: {
    // Backgrounds
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceVariant: '#EEEEEE',

    // Text
    onBackground: '#1C1C1E',
    onSurface: '#1C1C1E',
    onSurfaceVariant: '#666666',

    // Bible text
    verseText: '#1C1C1E',
    verseNumber: '#8E8E93',

    // Highlights (semi-transparent for overlays)
    highlightYellow: 'rgba(255, 235, 59, 0.4)',
    highlightGreen: 'rgba(76, 175, 80, 0.3)',
    highlightBlue: 'rgba(33, 150, 243, 0.3)',
    highlightPink: 'rgba(233, 30, 99, 0.3)',
    highlightPurple: 'rgba(156, 39, 176, 0.3)',
    highlightOrange: 'rgba(255, 152, 0, 0.4)',
    highlightRed: 'rgba(244, 67, 54, 0.3)',
    highlightTeal: 'rgba(0, 150, 136, 0.3)',

    // Semantic
    primary: '#5C6BC0',
    secondary: '#26A69A',
    error: '#EF5350',
  },

  dark: {
    // Backgrounds
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',

    // Text
    onBackground: '#E5E5E7',
    onSurface: '#E5E5E7',
    onSurfaceVariant: '#A1A1A6',

    // Bible text
    verseText: '#E5E5E7',
    verseNumber: '#8E8E93',

    // Highlights (adjusted for dark backgrounds)
    highlightYellow: 'rgba(255, 235, 59, 0.25)',
    highlightGreen: 'rgba(76, 175, 80, 0.25)',
    highlightBlue: 'rgba(33, 150, 243, 0.25)',
    highlightPink: 'rgba(233, 30, 99, 0.25)',
    highlightPurple: 'rgba(156, 39, 176, 0.25)',
    highlightOrange: 'rgba(255, 152, 0, 0.25)',
    highlightRed: 'rgba(244, 67, 54, 0.25)',
    highlightTeal: 'rgba(0, 150, 136, 0.25)',

    // Semantic
    primary: '#7986CB',
    secondary: '#4DB6AC',
    error: '#EF5350',
  },
}
```

### Theme Context

```typescript
// theme/ThemeContext.tsx
import { createContext, useContext, useMemo } from 'react'
import { useColorScheme } from 'react-native'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  mode: ThemeMode
  isDark: boolean
  colors: typeof colors.light
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme()
  const [mode, setMode] = usePersistedState<ThemeMode>('theme-mode', 'system')

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark'

  const value = useMemo(() => ({
    mode,
    isDark,
    colors: isDark ? colors.dark : colors.light,
    setMode,
  }), [mode, isDark])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

---

## 6. Accessibility

### Screen Reader Support

```typescript
// components/VerseRow.tsx
export function VerseRow({ number, text, highlight }: VerseRowProps) {
  const highlightLabel = highlight
    ? `, highlighted in ${highlight.name}`
    : ''

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Verse ${number}. ${text}${highlightLabel}`}
      accessibilityHint="Double tap to select this verse"
    >
      <Text style={styles.verseNumber} importantForAccessibility="no">
        {number}
      </Text>
      <Text style={styles.verseText}>{text}</Text>
    </View>
  )
}
```

### Focus Management

```typescript
// hooks/useFocusManagement.ts
import { useRef, useEffect } from 'react'
import { AccessibilityInfo, findNodeHandle } from 'react-native'

export function useFocusOnMount<T extends React.Component>(
  shouldFocus: boolean = true
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (shouldFocus && ref.current) {
      const node = findNodeHandle(ref.current)
      if (node) {
        AccessibilityInfo.setAccessibilityFocus(node)
      }
    }
  }, [shouldFocus])

  return ref
}
```

### Reduced Motion Support

```typescript
// hooks/useReducedMotion.ts
import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

export function useReducedMotion() {
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setIsReducedMotion)

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReducedMotion
    )

    return () => subscription.remove()
  }, [])

  return isReducedMotion
}
```

### Color Contrast Requirements

| Element | Min Contrast | Target |
|---------|-------------|--------|
| Body text | 4.5:1 | 7:1 |
| Large text (18pt+) | 3:1 | 4.5:1 |
| UI components | 3:1 | 4.5:1 |
| Graphical objects | 3:1 | 4.5:1 |

---

## 7. Haptic Feedback

### Feedback Types

```typescript
// utils/haptics.ts
import * as Haptics from 'expo-haptics'

export const haptics = {
  // Light tap - verse selection
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  // Medium tap - highlight applied
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

  // Heavy tap - error or important action
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

  // Selection change - book/chapter picker
  selection: () => Haptics.selectionAsync(),

  // Success - copy complete, highlight saved
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  // Warning - action needs confirmation
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),

  // Error - action failed
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
}
```

### Usage Guidelines

| Action | Haptic Type |
|--------|-------------|
| Verse tap | Light |
| Verse long press | Medium |
| Highlight applied | Success |
| Copy to clipboard | Light + Success |
| Chapter change (swipe) | Selection |
| Error notification | Error |
| Delete confirmation | Warning |

---

## 8. Loading & Empty States

### Loading Patterns

```typescript
// components/ChapterLoading.tsx
export function ChapterLoading() {
  return (
    <View style={styles.container}>
      {/* Skeleton verses */}
      {Array.from({ length: 10 }).map((_, i) => (
        <View key={i} style={styles.skeletonVerse}>
          <View style={styles.skeletonNumber} />
          <View style={styles.skeletonText}>
            <View style={[styles.skeletonLine, { width: '90%' }]} />
            <View style={[styles.skeletonLine, { width: '75%' }]} />
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  skeletonNumber: {
    width: 24,
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginVertical: 4,
  },
})
```

### Empty States

```
┌─────────────────────────────────────────────────────┐
│  Empty State Examples                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  No Highlights:                                     │
│  ┌─────────────────────────────────────┐           │
│  │          [Highlight Icon]           │           │
│  │                                     │           │
│  │     No highlights yet               │           │
│  │                                     │           │
│  │     Long press any verse to         │           │
│  │     add your first highlight        │           │
│  │                                     │           │
│  └─────────────────────────────────────┘           │
│                                                     │
│  No Search Results:                                 │
│  ┌─────────────────────────────────────┐           │
│  │          [Search Icon]              │           │
│  │                                     │           │
│  │     No results for "xyz"            │           │
│  │                                     │           │
│  │     Try different keywords or       │           │
│  │     check your spelling             │           │
│  │                                     │           │
│  └─────────────────────────────────────┘           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Sources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design 3](https://m3.material.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Thumb Zone Design](https://www.smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users/)
