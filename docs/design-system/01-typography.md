# Design System: Typography

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document defines the typography system for the Jota mobile app, ensuring consistent, readable, and accessible text across all screens.

---

## 1. Type Scale

### 1.1 Scale Definition

| Name | Size (pt) | Line Height | Weight | Use Case |
|------|-----------|-------------|--------|----------|
| Display | 34 | 41 (1.2) | Bold | Hero text, splash |
| Title 1 | 28 | 34 (1.2) | Bold | Page titles |
| Title 2 | 22 | 28 (1.27) | Bold | Section headers |
| Title 3 | 20 | 25 (1.25) | Semibold | Card titles |
| Headline | 17 | 22 (1.29) | Semibold | List titles |
| Body | 17 | 22 (1.29) | Regular | Primary content |
| Body Small | 15 | 20 (1.33) | Regular | Secondary content |
| Callout | 16 | 21 (1.31) | Regular | Callouts, quotes |
| Subhead | 15 | 20 (1.33) | Regular | Subheadlines |
| Footnote | 13 | 18 (1.38) | Regular | Footnotes, hints |
| Caption 1 | 12 | 16 (1.33) | Regular | Captions, timestamps |
| Caption 2 | 11 | 13 (1.18) | Regular | Small labels |

### 1.2 Visual Scale

```
Display (34pt Bold)
════════════════════════════════════════

Title 1 (28pt Bold)
────────────────────────────────────

Title 2 (22pt Bold)
──────────────────────────────

Title 3 (20pt Semibold)
────────────────────────────

Headline (17pt Semibold)
────────────────────────

Body (17pt Regular)
────────────────────────

Body Small (15pt Regular)
──────────────────────

Caption 1 (12pt Regular)
────────────────────
```

---

## 2. Font Families

### 2.1 Primary Font

```
SYSTEM FONT STACK:

iOS:
- SF Pro Text (body sizes ≤19pt)
- SF Pro Display (display sizes ≥20pt)

Android:
- Roboto (all sizes)

Fallback:
- System default sans-serif
```

### 2.2 Font Implementation

```javascript
// React Native font configuration
const fonts = {
  ios: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    semibold: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
};
```

### 2.3 Optional Serif Font (Bible Reading)

```
OPTIONAL READING FONTS:

Serif options:
- Georgia (system)
- Literata (Google Fonts)
- Source Serif Pro (Google Fonts)

Implementation:
- User selectable in Settings → Reading → Font
- Default: System sans-serif
- Downloaded on demand (bundle size consideration)
```

---

## 3. Bible Text Typography

### 3.1 Verse Text Styles

```
VERSE STYLING:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ¹⁶ For God so loved the world, that he gave his   │
│  only Son, that whoever believes in him should     │
│  not perish but have eternal life.                 │
│                                                     │
│  ↑                                                  │
│  Verse number: 12pt superscript, secondary color   │
│  Verse text: 17pt regular, primary color           │
│  Line height: 28pt (1.65)                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3.2 Verse Number Specifications

| Property | Value |
|----------|-------|
| Size | 0.7em (relative to verse text) |
| Position | Superscript |
| Color | Secondary text color |
| Spacing | 4pt after number |
| Weight | Regular |

### 3.3 Reading Font Sizes

| Setting | Size | Line Height |
|---------|------|-------------|
| Extra Small | 14pt | 22pt (1.57) |
| Small | 16pt | 25pt (1.56) |
| Medium (default) | 18pt | 28pt (1.56) |
| Large | 20pt | 32pt (1.60) |
| Extra Large | 24pt | 38pt (1.58) |
| XXL | 28pt | 44pt (1.57) |
| Accessibility Max | 34pt | 54pt (1.59) |

### 3.4 Red Letter Text (Words of Jesus)

```
RED LETTER STYLING:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ¹⁶ For God so loved the world, that he gave his   │
│  only Son, that whoever believes in him should     │
│  not perish but have eternal life.                 │
│                                                     │
│  Jesus' words shown in: #C41E3A (Crimson)          │
│  Maintains readability in both light and dark mode │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 4. Dynamic Type Support

### 4.1 Scale Multipliers

| System Setting | Multiplier |
|---------------|------------|
| xSmall | 0.82 |
| Small | 0.88 |
| Medium (Default) | 1.00 |
| Large | 1.12 |
| xLarge | 1.24 |
| xxLarge | 1.35 |
| xxxLarge | 1.47 |
| Accessibility M | 1.59 |
| Accessibility L | 1.76 |
| Accessibility XL | 1.94 |
| Accessibility XXL | 2.12 |
| Accessibility XXXL | 2.35 |

### 4.2 Scaled Examples

```
BODY TEXT AT DIFFERENT SCALES:

Default (17pt):
For God so loved the world...

Large (19pt):
For God so loved the world...

Accessibility L (30pt):
For God so loved
the world...

Note: Layout adapts to accommodate larger text
```

### 4.3 Implementation

```javascript
// React Native dynamic type
import { Text } from 'react-native';

// Use maxFontSizeMultiplier for critical UI
<Text
  style={{ fontSize: 17 }}
  maxFontSizeMultiplier={1.5}  // Limit scaling for UI elements
>
  Button Text
</Text>

// Allow full scaling for content
<Text
  style={{ fontSize: 17 }}
  allowFontScaling={true}  // No limit for content
>
  Bible verse text...
</Text>
```

---

## 5. Text Styles Reference

### 5.1 UI Text Styles

```
NAVIGATION BAR:
┌─────────────────────────────────────┐
│ ← Back     Page Title        ⚙    │
│   ↑            ↑                   │
│   Body        Title 3              │
│   Semibold    Semibold             │
└─────────────────────────────────────┘

TAB BAR:
┌───────────────────────────────────────┐
│  Home    Bible   Search   Library     │
│   ↑                                   │
│   Caption 2 (11pt)                    │
│   Medium weight                       │
└───────────────────────────────────────┘

LIST ITEM:
┌─────────────────────────────────────┐
│  John 3:16                      →  │ ← Headline (17pt Semibold)
│  For God so loved...               │ ← Body Small (15pt Regular)
│  Highlighted yesterday             │ ← Caption 1 (12pt, secondary)
└─────────────────────────────────────┘
```

### 5.2 Content Text Styles

```
CHAPTER HEADER:
┌─────────────────────────────────────┐
│           John 3                    │ ← Title 1 (28pt Bold)
│                                     │
└─────────────────────────────────────┘

BOOK PICKER:
┌─────────────────────────────────────┐
│  Old Testament                      │ ← Title 3 (20pt Semibold)
│                                     │
│  Genesis                            │ ← Body (17pt Regular)
│  Exodus                             │
│  Leviticus                          │
└─────────────────────────────────────┘

SEARCH RESULT:
┌─────────────────────────────────────┐
│  John 3:16                          │ ← Headline (17pt Semibold)
│  "For God so loved the world..."    │ ← Body Small (15pt)
│  ─────────────────────────────────  │
│  Romans 5:8                         │
│  "God shows his love for us..."     │
└─────────────────────────────────────┘
```

---

## 6. Text Color System

### 6.1 Color Tokens

| Token | Light Mode | Dark Mode | Use Case |
|-------|------------|-----------|----------|
| Primary | #1A1A1A | #FFFFFF | Main text |
| Secondary | #666666 | #A3A3A3 | Supporting text |
| Tertiary | #8E8E93 | #636366 | Disabled, hints |
| Inverse | #FFFFFF | #1A1A1A | Text on dark bg |
| Link | #2563EB | #60A5FA | Clickable links |
| Error | #DC2626 | #F87171 | Error messages |
| Success | #16A34A | #4ADE80 | Success messages |

### 6.2 Usage Examples

```
TEXT COLOR APPLICATION:
┌─────────────────────────────────────┐
│                                     │
│  John 3                             │ ← Primary
│                                     │
│  ¹⁶ For God so loved the world...  │ ← Primary
│                                     │
│  View in KJV →                      │ ← Link
│                                     │
│  Last read: Yesterday at 3:42 PM   │ ← Secondary
│                                     │
│  Optional: Show verse numbers       │ ← Tertiary
│                                     │
└─────────────────────────────────────┘
```

---

## 7. Text Formatting

### 7.1 Letter Spacing

| Style | Letter Spacing |
|-------|---------------|
| Display | -0.5pt |
| Title 1 | -0.4pt |
| Title 2 | -0.3pt |
| Title 3 | -0.2pt |
| Body | 0pt |
| Caption | 0.1pt |
| Button (uppercase) | 0.5pt |

### 7.2 Paragraph Spacing

```
VERSE PARAGRAPHS:
┌─────────────────────────────────────┐
│  ¹⁶ For God so loved the world,    │
│  that he gave his only Son...      │
│                                     │ ← 8pt space
│  ¹⁷ For God did not send his Son   │
│  into the world to condemn...      │
│                                     │
└─────────────────────────────────────┘

Between verses: 8pt
Between paragraphs: 16pt
Between sections: 24pt
```

### 7.3 Text Alignment

| Context | Alignment |
|---------|-----------|
| Bible text | Left (LTR) / Right (RTL) |
| Titles | Center or Left |
| Body copy | Left |
| Numbers | Right |
| Buttons | Center |
| List items | Left |

---

## 8. Special Typography

### 8.1 Highlighted Text

```
HIGHLIGHT STYLING:
┌─────────────────────────────────────┐
│                                     │
│  For God so loved the world,       │
│  ├────────────────────────────┤    │
│  │ Background: Highlight color │    │
│  │ Text: Unchanged             │    │
│  │ Padding: 2pt vertical       │    │
│  └────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### 8.2 Search Result Highlighting

```
MATCHED TEXT:
┌─────────────────────────────────────┐
│                                     │
│  For God so **loved** the world,   │
│             └──────┘               │
│             Bold weight            │
│             Yellow background      │
│                                     │
└─────────────────────────────────────┘
```

### 8.3 Poetry/Psalm Formatting

```
PSALM FORMATTING:
┌─────────────────────────────────────┐
│                                     │
│  ¹ The LORD is my shepherd;        │
│      I shall not want.             │ ← Indented
│                                     │
│  ² He makes me lie down            │
│      in green pastures.            │
│    He leads me beside              │
│      still waters.                 │
│                                     │
│  Poetry indentation: 20pt          │
│  Stanza break: 16pt                │
│                                     │
└─────────────────────────────────────┘
```

---

## 9. Internationalization

### 9.1 Multi-Language Support

```
SUPPORTED SCRIPTS:

Latin (English, Spanish, Portuguese):
- System fonts adequate
- Standard line height

Cyrillic (Ukrainian, Russian):
- System fonts adequate
- May need +2pt line height

Greek (Original texts):
- Requires Greek-capable font
- Consider polytonic support

Hebrew (Original texts):
- RTL layout
- Requires Hebrew-capable font
- Vowel points (nikkud) support

Arabic:
- RTL layout
- Connected script
- +4pt line height recommended
```

### 9.2 RTL Text

```
RIGHT-TO-LEFT LAYOUT:
┌─────────────────────────────────────┐
│                                     │
│                        ¹⁶ םלועה תא │
│              ...בהא םיהולא יכ       │
│                                     │
│  Verse numbers: Right side         │
│  Text direction: Right to left     │
│  UI mirrors appropriately          │
│                                     │
└─────────────────────────────────────┘
```

### 9.3 Mixed Direction Text

```
EMBEDDED LTR IN RTL:
┌─────────────────────────────────────┐
│                                     │
│  :הזה קוספה תא ואר                  │
│  "For God so loved the world..."   │ ← LTR quote
│                                     │
│  Use unicode bidi controls         │
│  Proper isolation of embedded text │
│                                     │
└─────────────────────────────────────┘
```

---

## 10. Typography Tokens

### 10.1 Design Tokens

```javascript
// typography.tokens.js

export const typography = {
  fontFamily: {
    sans: 'System',
    serif: 'Georgia',
    mono: 'Menlo',
  },

  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    base: 17,
    lg: 20,
    xl: 22,
    '2xl': 28,
    '3xl': 34,
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 1.75,
  },

  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
  },
};
```

### 10.2 Style Presets

```javascript
// textStyles.js

export const textStyles = {
  display: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
    letterSpacing: -0.5,
  },

  title1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.4,
  },

  body: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0,
  },

  verse: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: 0,
  },

  verseNumber: {
    fontSize: 12,
    fontWeight: '400',
    color: 'secondary',
    verticalAlign: 'super',
  },

  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0,
  },
};
```

---

## 11. Best Practices

### 11.1 Do's

- Use semantic text styles (Title1, Body, Caption)
- Support Dynamic Type for all text
- Test with maximum accessibility sizes
- Ensure 4.5:1 contrast ratio minimum
- Use appropriate line height for readability
- Support RTL layouts

### 11.2 Don'ts

- Don't use fixed pixel sizes for body text
- Don't disable font scaling for content
- Don't use light font weights for body text
- Don't use all-caps for long text
- Don't use justified alignment on mobile
- Don't hardcode line heights in pixels

### 11.3 Readability Guidelines

```
OPTIMAL READING CONDITIONS:

Line length: 45-75 characters (ideal: 66)
Line height: 1.5-1.65 for body text
Paragraph spacing: 1em between paragraphs
Contrast: 7:1 for extended reading

Bible text specifically:
- Slightly larger line height (1.6+)
- Generous margins
- Verse numbers visually distinct
- Clear paragraph breaks
```

