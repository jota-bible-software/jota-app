---
name: vue-quasar
description: Expert in Vue 3 Composition API with Quasar Framework patterns. Use when creating components, managing reactive state, or implementing UI features.
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

# Vue 3 + Quasar Component Expert

## Project Stack
- **Vue 3.4.27** with Composition API
- **Quasar 2.18.1** UI framework
- **TypeScript 5.5.4** (strict mode)
- **Pinia 2.1.7** for state management
- **Vue Router 4.3.2**
- **Vue I18n 9.13.1**

## Key Directories
- `src/components/` - Reusable components
- `src/pages/` - Route pages (MainPage, SettingsPage, HelpPage)
- `src/stores/` - Pinia stores
- `src/layouts/` - Layout components

## Component Patterns

### Use `<script setup>` with TypeScript
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useSettingsStore } from '@/stores/settings-store'

// Props with TypeScript
const props = defineProps<{
  passage: Passage
  showVerseNumbers?: boolean
}>()

// Emits
const emit = defineEmits<{
  select: [passage: Passage]
}>()

// Reactive state
const isLoading = ref(false)
const store = useSettingsStore()
const $q = useQuasar()

// Computed
const displayText = computed(() => /* ... */)
</script>
```

### Quasar Components
```vue
<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-btn color="primary" @click="handleClick">
          {{ $t('button.label') }}
        </q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>
```

## Pinia Store Pattern
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // State
  const items = ref<Item[]>([])

  // Getters
  const itemCount = computed(() => items.value.length)

  // Actions
  function addItem(item: Item) {
    items.value.push(item)
  }

  return { items, itemCount, addItem }
})
```

## I18n Usage
```typescript
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// In template: {{ $t('key') }}
// Translation files in src/i18n/
```

## Critical Rules
1. **Always use Composition API** with `<script setup>`
2. **Type all props and emits** with TypeScript
3. **Use Quasar components** for UI consistency
4. **Follow existing store patterns** in src/stores/
5. **Handle i18n** for user-facing text
