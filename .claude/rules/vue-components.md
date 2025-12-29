---
paths: "**/*.vue"
---

# Vue Component Rules

## Always Use Composition API
```vue
<script setup lang="ts">
// Correct - Composition API with setup
import { ref, computed } from 'vue'
</script>
```

## Props and Emits Must Be Typed
```vue
<script setup lang="ts">
// Props with TypeScript
const props = defineProps<{
  passage: Passage
  showNumbers?: boolean
}>()

// Emits with TypeScript
const emit = defineEmits<{
  select: [passage: Passage]
  close: []
}>()

// With defaults
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md'
})
</script>
```

## Reactive State
```typescript
// Primitives: use ref
const isLoading = ref(false)
const count = ref(0)

// Objects/arrays: use reactive or ref
const form = reactive({ name: '', email: '' })
const items = ref<Item[]>([])

// Computed for derived state
const fullName = computed(() => `${first.value} ${last.value}`)
```

## Quasar Components
- Use Quasar components for UI consistency
- Follow Quasar naming: `q-btn`, `q-card`, `q-input`
- Use Quasar utilities: `useQuasar()`, `$q.notify()`

## Template Rules
- Use `$t()` for all user-facing text (i18n)
- Prefer `v-if` over `v-show` for conditional blocks
- Use `v-for` with `:key` always
- Keep templates readable - extract complex logic to computed

## File Structure
```vue
<script setup lang="ts">
// 1. Imports
// 2. Props/Emits
// 3. Composables (stores, i18n, etc.)
// 4. Reactive state
// 5. Computed properties
// 6. Methods
// 7. Lifecycle hooks
</script>

<template>
  <!-- Template -->
</template>

<style scoped lang="scss">
/* Scoped styles */
</style>
```
