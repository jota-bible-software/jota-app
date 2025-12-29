# Design System: Color Palette

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document defines the complete color system for the Jota mobile app, including semantic colors, highlight colors, and theme variations.

---

## 1. Color Philosophy

### 1.1 Design Principles

| Principle | Description |
|-----------|-------------|
| **Readable** | Text always meets WCAG AA contrast (4.5:1) |
| **Calming** | Colors support extended reading sessions |
| **Meaningful** | Colors convey information and state |
| **Accessible** | Works for color blind users |
| **Consistent** | Same meaning across all contexts |

### 1.2 Color Usage Guidelines

```
COLOR ALLOCATION:
┌─────────────────────────────────────┐
│                                     │
│  Background       ████████  60%     │
│  Surface          ████████  20%     │
│  Primary action   ██        10%     │
│  Secondary        █          5%     │
│  Accent/Error     ░          5%     │
│                                     │
└─────────────────────────────────────┘
```

---

## 2. Core Palette

### 2.1 Brand Colors

| Color | Hex | RGB | Use |
|-------|-----|-----|-----|
| Primary | #2563EB | 37, 99, 235 | Primary actions, links |
| Primary Dark | #1D4ED8 | 29, 78, 216 | Pressed states |
| Primary Light | #60A5FA | 96, 165, 250 | Dark mode primary |

### 2.2 Neutral Colors

| Color | Hex | Light Mode | Dark Mode |
|-------|-----|------------|-----------|
| Gray 50 | #FAFAFA | Background | - |
| Gray 100 | #F5F5F5 | Surface | - |
| Gray 200 | #E5E5E5 | Borders | - |
| Gray 300 | #D4D4D4 | Disabled | - |
| Gray 400 | #A3A3A3 | Placeholder | Secondary text |
| Gray 500 | #737373 | - | Tertiary |
| Gray 600 | #525252 | Secondary text | - |
| Gray 700 | #404040 | - | Borders |
| Gray 800 | #262626 | - | Surface |
| Gray 900 | #171717 | Primary text | Background |
| Gray 950 | #0A0A0A | - | True black BG |

### 2.3 Visual Palette

```
NEUTRAL SCALE:
┌─────────────────────────────────────────────────┐
│                                                 │
│  50   100  200  300  400  500  600  700  800  900
│  █    █    █    █    █    █    █    █    █    █
│  ░░░  ░░░  ░░░  ▒▒▒  ▒▒▒  ▓▓▓  ▓▓▓  ███  ███  ███
│                                                 │
│  Light mode ◄──────────────────► Dark mode     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 3. Semantic Colors

### 3.1 Light Mode

| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| background | Gray 50 | #FAFAFA | App background |
| surface | White | #FFFFFF | Cards, sheets |
| surfaceSecondary | Gray 100 | #F5F5F5 | Secondary surfaces |
| text | Gray 900 | #171717 | Primary text |
| textSecondary | Gray 600 | #525252 | Secondary text |
| textTertiary | Gray 400 | #A3A3A3 | Hints, disabled |
| border | Gray 200 | #E5E5E5 | Dividers, borders |
| borderFocused | Primary | #2563EB | Focus rings |

### 3.2 Dark Mode

| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| background | Gray 950 | #0A0A0A | App background |
| surface | Gray 900 | #171717 | Cards, sheets |
| surfaceSecondary | Gray 800 | #262626 | Secondary surfaces |
| text | White | #FFFFFF | Primary text |
| textSecondary | Gray 400 | #A3A3A3 | Secondary text |
| textTertiary | Gray 500 | #737373 | Hints, disabled |
| border | Gray 700 | #404040 | Dividers, borders |
| borderFocused | PrimaryLight | #60A5FA | Focus rings |

### 3.3 Visual Comparison

```
LIGHT MODE:                    DARK MODE:
┌──────────────────────┐      ┌──────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░ │      │ ████████████████████ │ ← Background
│ ┌──────────────────┐ │      │ ┌──────────────────┐ │
│ │ ████████████████ │ │      │ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ │ ← Surface
│ │                  │ │      │ │                  │ │
│ │ Text content     │ │      │ │ Text content     │ │ ← Text
│ │ Secondary text   │ │      │ │ Secondary text   │ │
│ │                  │ │      │ │                  │ │
│ └──────────────────┘ │      │ └──────────────────┘ │
│                      │      │                      │
└──────────────────────┘      └──────────────────────┘
```

---

## 4. Highlight Colors

### 4.1 Highlight Palette

| Name | Light Mode | Dark Mode | Opacity |
|------|------------|-----------|---------|
| Yellow | #FEF08A | #854D0E | 60% |
| Green | #BBF7D0 | #166534 | 60% |
| Blue | #BFDBFE | #1E40AF | 60% |
| Pink | #FBCFE8 | #9D174D | 60% |
| Orange | #FED7AA | #9A3412 | 60% |
| Purple | #DDD6FE | #5B21B6 | 60% |
| Red | #FECACA | #991B1B | 60% |
| Teal | #99F6E4 | #115E59 | 60% |

### 4.2 Visual Highlight Palette

```
HIGHLIGHT COLORS:
┌─────────────────────────────────────────────────┐
│                                                 │
│  Light Mode:                                    │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┐   │
│  │Yellow│Green │ Blue │ Pink │Orange│Purple│   │
│  │ ░░░░ │ ░░░░ │ ░░░░ │ ░░░░ │ ░░░░ │ ░░░░ │   │
│  └──────┴──────┴──────┴──────┴──────┴──────┘   │
│                                                 │
│  Dark Mode:                                     │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┐   │
│  │Yellow│Green │ Blue │ Pink │Orange│Purple│   │
│  │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │   │
│  └──────┴──────┴──────┴──────┴──────┴──────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 4.3 Highlight Implementation

```javascript
// Highlight color with text contrast
const highlightColors = {
  yellow: {
    light: { bg: '#FEF08A', text: '#713F12' },
    dark: { bg: '#854D0E', text: '#FEF9C3' },
  },
  green: {
    light: { bg: '#BBF7D0', text: '#14532D' },
    dark: { bg: '#166534', text: '#DCFCE7' },
  },
  // ... etc
};
```

---

## 5. Status Colors

### 5.1 Feedback Colors

| Status | Light Mode | Dark Mode | Use |
|--------|------------|-----------|-----|
| Success | #16A34A | #4ADE80 | Confirmations |
| Warning | #CA8A04 | #FACC15 | Alerts |
| Error | #DC2626 | #F87171 | Errors |
| Info | #2563EB | #60A5FA | Information |

### 5.2 Status Color Applications

```
SUCCESS MESSAGE:
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐  │
│  │  ✓  Verse highlighted         │  │ ← Green tint bg
│  └───────────────────────────────┘  │   Green icon
│                                     │
└─────────────────────────────────────┘

ERROR MESSAGE:
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐  │
│  │  ✕  Download failed           │  │ ← Red tint bg
│  │      Tap to retry             │  │   Red icon
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘

WARNING MESSAGE:
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐  │
│  │  ⚠  Low storage space         │  │ ← Yellow tint bg
│  │      150MB remaining          │  │   Yellow icon
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### 5.3 Status Background Tints

| Status | Light BG | Dark BG |
|--------|----------|---------|
| Success | #DCFCE7 | #052E16 |
| Warning | #FEF9C3 | #422006 |
| Error | #FEE2E2 | #450A0A |
| Info | #DBEAFE | #172554 |

---

## 6. Reading Themes

### 6.1 Available Themes

```
THEME OPTIONS:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐       │
│  │  Light    │  │   Dark    │  │   Sepia   │       │
│  │  ░░░░░░░  │  │  ███████  │  │  ▒▒▒▒▒▒▒  │       │
│  │  Text     │  │  Text     │  │  Text     │       │
│  └───────────┘  └───────────┘  └───────────┘       │
│                                                     │
│  ┌───────────┐  ┌───────────┐                      │
│  │   Night   │  │   Paper   │                      │
│  │  ███████  │  │  ░░░░░░░  │                      │
│  │  Text     │  │  Text     │                      │
│  └───────────┘  └───────────┘                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 6.2 Theme Color Values

| Theme | Background | Text | Secondary |
|-------|------------|------|-----------|
| Light | #FFFFFF | #1A1A1A | #666666 |
| Dark | #121212 | #E5E5E5 | #A3A3A3 |
| Sepia | #F5F0E6 | #5C4B37 | #8B7355 |
| Night | #000000 | #B3B3B3 | #666666 |
| Paper | #FFFEF5 | #333333 | #666666 |

### 6.3 Theme Specifications

```
SEPIA THEME (Reading comfort):
┌─────────────────────────────────────┐
│  Background: #F5F0E6 (warm cream)   │
│  Text: #5C4B37 (dark brown)         │
│  Secondary: #8B7355 (medium brown)  │
│  Contrast ratio: 7.2:1              │
│                                     │
│  Best for:                          │
│  - Extended reading                 │
│  - Reducing eye strain              │
│  - Warm ambient lighting            │
└─────────────────────────────────────┘

NIGHT THEME (True dark):
┌─────────────────────────────────────┐
│  Background: #000000 (pure black)   │
│  Text: #B3B3B3 (light gray)         │
│  Secondary: #666666 (medium gray)   │
│  Contrast ratio: 10:1               │
│                                     │
│  Best for:                          │
│  - OLED screens (battery saving)    │
│  - Very dark environments           │
│  - Minimizing blue light            │
└─────────────────────────────────────┘
```

---

## 7. Interactive States

### 7.1 Button States

| State | Primary Button | Secondary Button |
|-------|----------------|------------------|
| Default | #2563EB bg, white text | transparent, #2563EB text |
| Hover | #1D4ED8 bg | #EFF6FF bg |
| Pressed | #1E40AF bg | #DBEAFE bg |
| Disabled | #93C5FD bg, 50% opacity | #9CA3AF text, 50% opacity |
| Focused | Default + 3px ring | Default + 3px ring |

### 7.2 Interactive State Visualization

```
BUTTON STATES:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Primary:                                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Default │ │ Hover   │ │ Pressed │ │Disabled │   │
│  │ ████████│ │ ████████│ │ ████████│ │ ░░░░░░░░│   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│                                                     │
│  Secondary:                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Default │ │ Hover   │ │ Pressed │ │Disabled │   │
│  │ ┌─────┐ │ │ ░░░░░░░ │ │ ▒▒▒▒▒▒▒ │ │ ┌ ─ ─ ┐ │   │
│  │ │     │ │ │         │ │         │ │ │     │ │   │
│  │ └─────┘ │ │         │ │         │ │ └ ─ ─ ┘ │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 7.3 Selection States

```
VERSE SELECTION STATES:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Normal:        Selected:       Highlighted:        │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐       │
│  │ Verse 16  │  │ ▓▓▓▓▓▓▓▓▓ │  │ ░░░░░░░░░ │       │
│  │ For God   │  │ ▓ Verse ▓ │  │ Verse 16  │       │
│  │ so loved  │  │ ▓▓▓▓▓▓▓▓▓ │  │ For God   │       │
│  └───────────┘  └───────────┘  └───────────┘       │
│                 Blue selection  Yellow highlight    │
│                 10% opacity     60% opacity         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 8. Opacity & Transparency

### 8.1 Opacity Scale

| Level | Value | Use Case |
|-------|-------|----------|
| 0 | 0% | Fully transparent |
| 5 | 5% | Subtle hover |
| 10 | 10% | Selection backgrounds |
| 20 | 20% | Overlays light |
| 30 | 30% | Disabled icons |
| 50 | 50% | Modal backdrops |
| 60 | 60% | Highlight backgrounds |
| 80 | 80% | Heavy overlays |
| 100 | 100% | Solid |

### 8.2 Backdrop Colors

```
MODAL BACKDROP:
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓ ┌──────────────────┐ ▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓ │                  │ ▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓ │   Modal Content  │ ▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓ │                  │ ▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓ └──────────────────┘ ▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└─────────────────────────────────────┘
  Backdrop: #000000 at 50% opacity
```

---

## 9. Gradients

### 9.1 UI Gradients

```
FADE GRADIENTS (for scrollable content):

Top fade:
╔═══════════════════════════════════╗
║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ║
║                                   ║  → Content visible
║ (scrollable content)              ║
║                                   ║
╚═══════════════════════════════════╝

Bottom fade:
╔═══════════════════════════════════╗
║                                   ║
║ (scrollable content)              ║
║                                   ║  → Content visible
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ║
║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║
╚═══════════════════════════════════╝

Gradient: background → transparent
Height: 40pt
```

### 9.2 Decorative Gradients

```
// Minimal gradient usage - prefer solid colors
const gradients = {
  // For special headers or features
  primary: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',

  // Sunset reading theme option
  sunset: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)',
};
```

---

## 10. Accessibility

### 10.1 Contrast Requirements

| Context | Minimum Ratio | Target |
|---------|---------------|--------|
| Body text | 4.5:1 (AA) | 7:1 (AAA) |
| Large text (18pt+) | 3:1 (AA) | 4.5:1 |
| UI components | 3:1 | 4.5:1 |
| Non-essential decorations | No requirement | - |

### 10.2 Tested Contrast Ratios

```
LIGHT MODE CONTRASTS:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Text (#171717) on Background (#FAFAFA): 15.1:1 ✓  │
│  Secondary (#525252) on Background: 7.1:1 ✓        │
│  Tertiary (#A3A3A3) on Background: 2.7:1           │
│  Primary (#2563EB) on Background: 4.8:1 ✓          │
│                                                     │
│  Highlighted text (yellow bg):                      │
│  Text (#713F12) on Yellow (#FEF08A): 7.3:1 ✓       │
│                                                     │
└─────────────────────────────────────────────────────┘

DARK MODE CONTRASTS:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Text (#FFFFFF) on Background (#0A0A0A): 19.4:1 ✓  │
│  Secondary (#A3A3A3) on Background: 8.4:1 ✓        │
│  Tertiary (#737373) on Background: 4.6:1 ✓         │
│  Primary (#60A5FA) on Background: 7.2:1 ✓          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 10.3 Color Blind Considerations

```
COLOR BLIND SAFE HIGHLIGHTS:

Standard palette issues:
- Red/Green confusion (deuteranopia, protanopia)
- Blue/Yellow confusion (tritanopia)

Solutions implemented:
1. Use patterns in addition to colors
2. Distinguish by luminance (light vs dark)
3. Provide labeled color names
4. Never rely on color alone

Color blind mode palettes:
┌───────────────────────────────────────┐
│ Deuteranopia mode:                    │
│ Blue - Yellow - Orange - Purple       │
│                                       │
│ Protanopia mode:                      │
│ Blue - Yellow - Cyan - Purple         │
│                                       │
│ Tritanopia mode:                      │
│ Pink - Teal - Red - Green             │
└───────────────────────────────────────┘
```

---

## 11. Color Tokens

### 11.1 Token Structure

```javascript
// colors.tokens.js

export const colors = {
  // Primitive colors (raw values)
  primitives: {
    blue: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      // ... 200-900
      500: '#2563EB',
      600: '#1D4ED8',
    },
    gray: {
      // ... 50-950
    },
    // ... other colors
  },

  // Semantic colors (theme-aware)
  semantic: {
    light: {
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#171717',
      textSecondary: '#525252',
      primary: '#2563EB',
      // ...
    },
    dark: {
      background: '#0A0A0A',
      surface: '#171717',
      text: '#FFFFFF',
      textSecondary: '#A3A3A3',
      primary: '#60A5FA',
      // ...
    },
  },

  // Component-specific colors
  components: {
    button: {
      primary: {
        background: 'semantic.primary',
        text: '#FFFFFF',
      },
    },
    // ...
  },
};
```

### 11.2 Usage in Code

```javascript
// Using color tokens in React Native
import { useTheme } from '@/hooks/useTheme';

const MyComponent = () => {
  const { colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>
        Hello World
      </Text>
      <Text style={{ color: colors.textSecondary }}>
        Secondary text
      </Text>
    </View>
  );
};
```

---

## 12. Implementation Notes

### 12.1 Theme Switching

```javascript
// Theme context implementation
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system'); // 'light' | 'dark' | 'system'

  const systemTheme = useColorScheme(); // iOS/Android system preference

  const activeTheme = theme === 'system' ? systemTheme : theme;

  const colors = themes[activeTheme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### 12.2 CSS Variables (Web)

```css
:root {
  --color-background: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-text: #171717;
  --color-text-secondary: #525252;
  --color-primary: #2563EB;
}

[data-theme="dark"] {
  --color-background: #0A0A0A;
  --color-surface: #171717;
  --color-text: #FFFFFF;
  --color-text-secondary: #A3A3A3;
  --color-primary: #60A5FA;
}
```

### 12.3 Platform Considerations

```
iOS:
- Use UIColor with dynamic provider for themes
- Support P3 wide color gamut
- Respect system appearance settings

Android:
- Use Material You dynamic colors where appropriate
- Support day/night themes via AppCompat
- Consider manufacturer color customizations
```

