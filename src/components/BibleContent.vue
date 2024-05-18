<template>
  <div id="content" class="q-pb-md" v-show="!loading && !showPicker">
    <div class="row" v-if="layout === 'split'">
      <!-- List of passages -->
      <div id="passages" v-if="passages.length > 1" class="col bottom-clipped q-list">
        <div v-for="(item, index) in   passages  " :key="index" clickable tabindex="0"
          :class="{ highlight: index === fragmentIndex }" @click=" fragmentIndex = index"
          @keyup.prevent.stop.left="moveFragmentIndex(-1)" @keyup.prevent.stop.right="moveFragmentIndex(1)"
          class="q-item q-item-type row no-wrap compact q-item--clickable q-link cursor-pointer">{{ item }}</div>
      </div>

      <q-list id="chapter" class="col bottom-clipped full-width" v-if="chapterVerses.length">
        <q-item v-for="(  s, i  ) in   chapterVerses  " :key="i" :class="selectionClasses[i]" class="compact"
          tabindex="0">
          <q-item-section class="reference text-secondary">{{ i + 1 }}</q-item-section>
          <q-item-section class="verse"><span v-html="highlightSearchTerm(s)" /></q-item-section>
        </q-item>
      </q-list>
    </div>

    <div id="formatted" class="row q-pb-md" v-if="layout === 'formatted'">
      <div v-for="(  item, i  ) in   formattedSearchResults()  " v-bind:key="i" class="formatted-verse">
        <span class="bref" @click="readInContext(i)">{{ item.bibleReference }} {{ item.symbol }}</span>
        <span v-html="item.content" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useSearchStore } from 'src/stores/search-store'
import { useEventListener } from '@vueuse/core'

const store = useSearchStore()
const { chapterFragment, chapterVerses, fragmentIndex, formattedSearchResults, highlightSearchTerm,
  layout, loading, passages, readInContext, scrollToSelection, selectionClasses, showPicker } = toRefs(store)

const { moveFragmentIndex } = store

useEventListener(window.document, 'selectionchange', () => {
  const selection = window.getSelection()
  if (!selection || !chapterFragment.value) return
  const range = selection.getRangeAt(0)
  const node1 = range.startContainer.parentElement?.closest('#chapter .q-item')
  const node2 = range.endContainer.parentElement?.closest('#chapter .q-item')
  if (node1 && node2) {
    const siblings = Array.from(node1.parentElement?.children || [])
    const index1 = siblings.indexOf(node1)
    const index2 = siblings.indexOf(node2)
    const [start, end] = (index1 < index2) ? [index1, index2] : [index2, index1]
    scrollToSelection.value = false
    const [book, chapter] = chapterFragment.value
    chapterFragment.value = [book, chapter, start, end]
  }
})

</script>

<style lang="scss">
#content {
  // padding-bottom: 80px
  display: flex;
  flex-direction: column;
  overflow: auto;
  // width: 100%;

  .row {
    overflow: auto;
  }
}

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

#passages {
  flex: 0 0 auto;
  padding-right: 4px;
  margin-right: 4px;
  border-right: var(--q-border) solid 1px;

  .compact {
    line-height: 24px;
    padding: 0 8px !important;
    width: 100%;
    white-space: nowrap;
    min-height: 24px;
  }

  .compact:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .highlight {
    box-shadow: inset 1px 1px var(--q-primary), inset -1px -1px var(--q-primary);
  }
}

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

.verse {
  .bold {
    color: var(--q-accent);
    font-weight: 600;
    display: contents;
  }
}
</style>
