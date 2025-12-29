---
name: i18n
description: Expert in Vue I18n and multi-locale support. Use when adding translations, handling locale-specific content, or working with Bible book names in different languages.
allowed-tools: Read, Edit, Write, Grep, Glob
---

# Internationalization (i18n) Expert

## Supported Locales
- `en-US` - English (United States)
- `pl-PL` - Polish
- `pt-BR` - Portuguese (Brazil)
- `es-ES` - Spanish (Spain)
- `pt-PT` - Portuguese (Portugal)
- `uk-UA` - Ukrainian

## Key Files
- `src/i18n/index.ts` - I18n configuration
- `src/i18n/en-US/` - English translations
- `src/i18n/pl-PL/` - Polish translations
- (similar for other locales)

## Translation File Structure
```typescript
// src/i18n/en-US/index.ts
export default {
  common: {
    save: 'Save',
    cancel: 'Cancel',
  },
  search: {
    placeholder: 'Search the Bible...',
    noResults: 'No results found',
  },
  settings: {
    theme: 'Theme',
    language: 'Language',
  }
}
```

## Usage Patterns

### In Components
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// Change locale
locale.value = 'pl-PL'
</script>

<template>
  <div>{{ $t('common.save') }}</div>
</template>
```

### In TypeScript
```typescript
import { i18n } from '@/i18n'
const translated = i18n.global.t('key.path')
```

## Bible Book Names
Book names are locale-specific:
- English: "Genesis", "John", "1 Corinthians"
- Polish: "Rodzaju", "Jana", "1 Koryntian"
- Portuguese: "Genesis", "Joao", "1 Corintios"

Use the jota-parser library for parsing references - it handles locale-specific book names.

## Critical Rules
1. **All user-facing text must use i18n** - No hardcoded strings
2. **Add translations for ALL locales** when adding new keys
3. **Maintain key consistency** across all locale files
4. **Test with multiple locales** to verify translations render
5. **Use nested keys** for organization (e.g., `settings.theme`)

## Adding New Translations
1. Add key to `src/i18n/en-US/` first
2. Add same key structure to all other locale folders
3. Use meaningful, hierarchical key names
4. Test in app with different locale settings
