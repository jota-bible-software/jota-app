<template>
  <div id="formatted" class="row q-pb-md">
    <div v-for="(item, i) in formattedSearchResults()" :key="i" class="formatted-verse" :data-tag="tags.formattedVerse">
      <span class="bref" @click="readInContext(i)">{{ item.bibleReference }} {{ item.symbol }}</span>
      <span v-html="item.text"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from 'src/stores/search-store'
import * as tags from 'src/tags'

const store = useSearchStore()
const { formattedSearchResults, readInContext } = toRefs(store)
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

  .bref {
    color: var(--q-secondary);
  }

  .bold {
    color: var(--q-accent);
    font-weight: 600;
    display: contents;
  }
}
</style>
