<template>
  <div id="formatted" ref="containerRef" class="row q-pb-md" tabindex="0">
    <div v-for="(item, i) in items" :key="i" class="formatted-verse" :data-tag="tags.formattedVerse">
      <span class="ref" @click="readInContext(i)">{{ item.bibleReference }} {{ item.symbol }}</span>
      <span v-html="item.text"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from 'src/stores/search-store'
import * as tags from 'src/tags'

const store = useSearchStore()
const { readInContext } = toRefs(store)

const containerRef = ref<HTMLElement | null>(null)
const items = computed(() => store.formattedSearchResults())

onMounted(() => {
  if (items.value.length > 1 && containerRef.value) {
    containerRef.value.focus()
  }
})
</script>

<style lang="scss" scoped>
.formatted-verse {
  padding-top: 4px;
  padding-bottom: 4px;
  width: 100%;

  span:nth-child(1) {
    margin-right: 8px;
    cursor: pointer;
  }

  .ref {
    color: var(--q-secondary);
  }

  .bold {
    color: var(--q-accent);
    font-weight: 600;
    display: contents;
  }
}
</style>
