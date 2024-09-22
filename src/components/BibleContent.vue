<template>
  <div id="content" v-scroll class="q-pb-md" v-show="!loading && !showPicker">
    <div class="row" v-if="layout === 'split'">
      <!-- List of passages -->
      <div id="passages" v-if="passages.length > 1" class="col bottom-clipped q-list">
        <div v-for="(item, index) in passages  " :key="index" clickable tabindex="0"
          :class="{ highlight: index === fragmentIndex }" @click="store.setFragmentIndex(index)"
          @keyup.prevent.stop.left="moveFragmentIndex(-1)" @keyup.prevent.stop.right="moveFragmentIndex(1)"
          class="q-item q-item-type row no-wrap compact q-item--clickable q-link cursor-pointer">{{ item }}</div>
      </div>

      <ChapterContent />
    </div>

    <div id="formatted" class="row q-pb-md" v-if="layout === 'formatted'">
      <div v-for="(item, i) in formattedSearchResults()  " v-bind:key="i" class="formatted-verse">
        <span class="bref" @click="readInContext(i)">{{ item.bibleReference }} {{ item.symbol }}</span>
        <span v-html="item.text"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from 'src/stores/search-store'
import { useEventListener } from '@vueuse/core'
import { bindKeyEvent, Direction } from 'src/util'
import ChapterContent from './ChapterContent.vue'

const store = useSearchStore()
const { chapterFragment, fragmentIndex, formattedSearchResults,
  layout, loading, passages, readInContext, scrollToSelection, showPicker } = toRefs(store)

const { goToAdjacentChapter, moveFragmentIndex, setChapterFragment } = store


useEventListener(document, 'selectionchange', () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0 || !chapterFragment.value) return
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
    setChapterFragment([book, chapter, start, end], true)
  }
})

const keyboardBindings = [
  bindKeyEvent('Ctrl+ArrowLeft', (event) => {
    event.preventDefault()
    goToAdjacentChapter(Direction.Prev)
  }),
  bindKeyEvent('Ctrl+ArrowRight', (event) => {
    event.preventDefault()
    goToAdjacentChapter(Direction.Next)
  })
]

// Keyup does work for Ctrl+ArrowLeft
useEventListener(document, 'keydown', (event) => {
  keyboardBindings.forEach(binding => binding(event))
}, true)

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

#content * {
  outline: none;
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
