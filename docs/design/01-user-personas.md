# User Personas

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document defines the core user personas for the Jota Bible App. These personas guide feature prioritization, UX decisions, and development focus.

---

## Persona 1: Daily Devotional Reader

### Profile

| Attribute | Value |
|-----------|-------|
| Name | Sarah |
| Age | 32 |
| Occupation | Marketing Manager |
| Tech Savvy | Moderate |
| Bible Knowledge | Intermediate |
| Usage Frequency | Daily (5-15 min) |
| Primary Device | iPhone |

### Background

Sarah is a busy professional who wants to maintain a consistent Bible reading habit. She reads the Bible in the morning before work or during lunch breaks. She prefers simple, distraction-free reading and doesn't need complex study tools.

### Goals

1. **Quick access** to daily reading
2. **Track progress** through reading plans
3. **Highlight** meaningful verses for later reflection
4. **Share** inspiring verses on social media

### Pain Points

- Apps that are slow to open or require login
- Too many features that clutter the interface
- Complicated navigation to find where she left off
- Apps that drain battery or use too much data

### Key Scenarios

```
Morning routine:
├── Open app → Resume reading
├── Read 10-15 verses
├── Highlight 1-2 verses
└── Close app

Sharing:
├── Find previously highlighted verse
├── Copy with nice formatting
└── Paste to Instagram story
```

### Feature Priorities

| Priority | Feature |
|----------|---------|
| Must Have | Quick resume to last position |
| Must Have | Simple highlighting |
| Must Have | Reading plans |
| Should Have | Copy formatting templates |
| Nice to Have | Social sharing |

### Quote

> "I just want to read my Bible without distractions. I don't need fancy study tools - just a clean reading experience that works quickly."

---

## Persona 2: Bible Student

### Profile

| Attribute | Value |
|-----------|-------|
| Name | Michael |
| Age | 45 |
| Occupation | Small Business Owner |
| Tech Savvy | Moderate |
| Bible Knowledge | Advanced |
| Usage Frequency | Daily (30-60 min) |
| Primary Device | iPad / Android Tablet |

### Background

Michael has been studying the Bible for 20+ years. He leads a weekly Bible study group and prepares teachings. He uses multiple translations to compare interpretations and takes extensive notes.

### Goals

1. **Compare** multiple translations side-by-side
2. **Organize** highlights by topic/color
3. **Find** specific passages quickly
4. **Export** notes and highlights for study prep

### Pain Points

- Apps that don't support multiple translations
- No way to organize or filter highlights
- Limited search capabilities
- Expensive subscription requirements

### Key Scenarios

```
Study session:
├── Search for passage by reference
├── Read in primary translation
├── Compare with 2-3 other translations
├── Highlight key verses with category colors
├── Take notes on insights
└── Export for study group handout

Weekly prep:
├── Review all highlights from a book
├── Filter by color (theme)
├── Copy formatted passages
└── Prepare teaching outline
```

### Feature Priorities

| Priority | Feature |
|----------|---------|
| Must Have | Multiple translations |
| Must Have | Categorized highlights |
| Must Have | Reference search |
| Must Have | Export functionality |
| Should Have | Translation comparison |
| Should Have | Notes |
| Nice to Have | Cross-references |

### Quote

> "I need an app that helps me dig deeper without nickel-and-diming me. I compare translations constantly and organize my highlights by theme for teaching prep."

---

## Persona 3: Pastor / Teacher

### Profile

| Attribute | Value |
|-----------|-------|
| Name | David |
| Age | 52 |
| Occupation | Senior Pastor |
| Tech Savvy | Low to Moderate |
| Bible Knowledge | Expert |
| Usage Frequency | Daily (multiple sessions) |
| Primary Device | Laptop + Phone |

### Background

David prepares sermons weekly and references Bible passages frequently during counseling and teaching. He values accuracy and needs to quickly find and quote passages. He's used to print Bibles and wants digital to feel similar.

### Goals

1. **Quick passage lookup** during conversations
2. **Accurate copying** with proper attribution
3. **Cross-platform** access (sermon prep on laptop, reference on phone)
4. **Offline access** for travel and areas with poor connectivity

### Pain Points

- Small text that's hard to read
- Apps that don't work offline
- Formatting that looks unprofessional when copied
- Having to remember different apps for different devices

### Key Scenarios

```
Sermon prep:
├── Search multiple passages
├── Copy with formatting for slides
├── Include translation attribution
└── Organize by sermon topic

Counseling:
├── Quick reference lookup
├── Show passage on phone
├── Share reference with counselee
└── Works without internet

Travel:
├── Full Bible available offline
├── All highlights synced
├── Audio Bible for long drives
└── Works on airplane mode
```

### Feature Priorities

| Priority | Feature |
|----------|---------|
| Must Have | Large, readable text |
| Must Have | Quick reference parsing |
| Must Have | Offline functionality |
| Must Have | Professional copy formatting |
| Should Have | Cloud sync |
| Should Have | Audio Bible |
| Nice to Have | Desktop app |

### Quote

> "When I'm in a meeting and need to find a verse, I need it now - not after logging in, updating, or waiting for internet. The app should work like my physical Bible but better."

---

## Persona 4: Casual User

### Profile

| Attribute | Value |
|-----------|-------|
| Name | Jessica |
| Age | 24 |
| Occupation | Graduate Student |
| Tech Savvy | High |
| Bible Knowledge | Beginner |
| Usage Frequency | Weekly (10-20 min) |
| Primary Device | iPhone |

### Background

Jessica grew up in a non-religious home but has recently become curious about Christianity. She occasionally looks up verses mentioned in podcasts or conversations. She's not familiar with Bible navigation (books, chapters, verses).

### Goals

1. **Find verses** mentioned in other contexts
2. **Understand** what she's reading
3. **Learn** Bible navigation basics
4. **Explore** without commitment or judgment

### Pain Points

- Apps that assume Bible literacy
- Overwhelming number of options
- Religious jargon she doesn't understand
- Apps that feel like they're trying to convert her

### Key Scenarios

```
Podcast reference:
├── Hear "Romans 8:28" mentioned
├── Open app, type "Romans 8:28"
├── Read the verse and surrounding context
└── Maybe highlight for later

Curious exploration:
├── Search for topic (e.g., "love", "anxiety")
├── Read results
├── Find readable translation
└── Browse casually
```

### Feature Priorities

| Priority | Feature |
|----------|---------|
| Must Have | Simple, intuitive search |
| Must Have | Beginner-friendly UI |
| Must Have | Readable translations |
| Should Have | Topic/text search |
| Nice to Have | Reading suggestions |

### Quote

> "I don't know the difference between Genesis and Revelation. I just want to look up what my friend quoted without feeling dumb."

---

## Persona 5: Multi-Lingual User

### Profile

| Attribute | Value |
|-----------|-------|
| Name | Ana |
| Age | 38 |
| Occupation | Nurse |
| Tech Savvy | Moderate |
| Bible Knowledge | Intermediate |
| Usage Frequency | Daily (15-30 min) |
| Primary Device | Android Phone |
| Languages | Portuguese (native), English |

### Background

Ana grew up in Brazil and now lives in the US. She reads the Bible in Portuguese for personal devotion but sometimes needs English for her American church community. She also shares verses with family in Brazil.

### Goals

1. **Switch** between translations seamlessly
2. **Find** verses in both languages
3. **Share** verses in appropriate language
4. **Navigate** using Portuguese reference formats

### Pain Points

- Apps that only support English reference formats
- Limited non-English translations
- Having to use multiple apps for different languages
- Translation names that don't match what she knows

### Key Scenarios

```
Personal reading:
├── Read in Portuguese (ARA or NVI)
├── Highlight verses
├── Switch to English when needed
└── Compare translations

Sharing with family:
├── Find verse in Portuguese
├── Copy with attribution
├── Share via WhatsApp
└── Include reference in PT format

Church discussion:
├── Someone mentions "John 3:16"
├── Quick lookup in English
├── Check Portuguese equivalent
└── Understand both contexts
```

### Feature Priorities

| Priority | Feature |
|----------|---------|
| Must Have | Multi-language translations |
| Must Have | Multi-locale reference parsing |
| Must Have | Easy translation switching |
| Must Have | Non-English UI option |
| Should Have | Per-translation highlights |
| Nice to Have | Language-specific copy formats |

### Quote

> "My heart language is Portuguese, but I live in an English-speaking world. I need an app that speaks both languages as fluently as I do."

---

## Persona Summary Matrix

| Persona | Primary Need | Session Length | Frequency | Key Feature |
|---------|-------------|----------------|-----------|-------------|
| Sarah (Daily Reader) | Quick devotions | 5-15 min | Daily | Fast resume |
| Michael (Student) | Deep study | 30-60 min | Daily | Multi-translation |
| David (Pastor) | Quick reference | Variable | Multiple/day | Offline + format |
| Jessica (Casual) | Easy lookup | 10-20 min | Weekly | Simple search |
| Ana (Multi-lingual) | Language flex | 15-30 min | Daily | Multi-locale |

---

## Design Implications

### For All Personas

1. **Speed**: App must launch and navigate quickly
2. **Offline**: Core features must work without internet
3. **Simplicity**: Don't overwhelm with features
4. **Privacy**: No required accounts or tracking

### Persona-Specific

| Persona | Design Implication |
|---------|-------------------|
| Sarah | Prominent "continue reading" action |
| Michael | Robust highlight organization and export |
| David | Larger default text, professional formatting |
| Jessica | Forgiving search, minimal Bible jargon |
| Ana | Multi-locale support, translation variety |

---

## Prioritization Framework

### Feature Scoring

Score features by persona impact:

| Feature | Sarah | Michael | David | Jessica | Ana | Total |
|---------|-------|---------|-------|---------|-----|-------|
| Fast startup | 3 | 2 | 3 | 2 | 2 | 12 |
| Quick resume | 3 | 2 | 2 | 1 | 2 | 10 |
| Highlighting | 2 | 3 | 2 | 1 | 2 | 10 |
| Multi-translation | 1 | 3 | 2 | 1 | 3 | 10 |
| Offline | 2 | 2 | 3 | 1 | 2 | 10 |
| Format templates | 2 | 2 | 3 | 1 | 2 | 10 |
| Multi-locale parse | 1 | 1 | 1 | 2 | 3 | 8 |
| Reading plans | 3 | 1 | 1 | 2 | 2 | 9 |
| Audio Bible | 2 | 1 | 2 | 1 | 2 | 8 |
| Notes | 1 | 3 | 2 | 1 | 1 | 8 |

*Scoring: 3 = Essential, 2 = Important, 1 = Nice to have*

---

## Sources

- User research from app store reviews of competitors
- Feature request patterns from similar apps
- Bible app usage studies
- Internal feature prioritization discussions
