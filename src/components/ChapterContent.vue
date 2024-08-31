<template>
  <q-list id="chapter" class="col bottom-clipped full-width" v-if="chapterVerses.length" ref="chapter">
    <q-item v-for="( s, i ) in chapterVerses" :key="i" :class="selectionClasses[i]" class="compact">
      <q-item-section class=" reference text-secondary">{{ i + 1 }}</q-item-section>
      <q-item-section class="verse"><span vv-html="s" />{{ highlightSearchTerm(s) }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useSearchStore } from 'src/stores/search-store'

const store = useSearchStore()
const { chapterVerses, highlightSearchTerm, selectionClasses } = toRefs(store)

</script>

<style lang="scss" scoped>
#chapter {
  .compact {
    padding: 1px 8px 0 0;
    min-height: 24px;
    margin-right: 4px;
  }

  .reference {
    max-width: 2em;
    justify-content: start;
    padding-top: 1px;
    text-align: center;
  }

  .selection-single {
    box-shadow: inset 1px 1px var(--q-primary), inset -1px -1px var(--q-primary);
  }

  .selection-start {
    box-shadow: inset 1px 1px var(--q-primary), inset -1px 1px var(--q-primary);
  }

  .selection-middle {
    box-shadow: inset 1px 0 var(--q-primary), inset -1px 0 var(--q-primary);
  }

  .selection-end {
    box-shadow: inset 1px -1px var(--q-primary), inset -1px -1px var(--q-primary);
  }

  .verse {
    margin-left: 4px;
  }
}
</style>
