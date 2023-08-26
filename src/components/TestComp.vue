<template>
  <div>{{ currentTranslation }}</div>
</template>

<script setup lang="ts">
import { useSearchStore } from 'src/stores/search-store'
const store = useSearchStore()
defineExpose({ ...store })
</script>
