<template>
  <q-list id="chapter" class="col bottom-clipped full-width" v-if="chapterVerses.length" ref="chapterRef" tabindex="10"
    @keydown.shift.tab.prevent="$emit('focusReferenceList')">
    <q-item v-for="( s, i ) in chapterVerses" :key="i" :class="selectionClasses[i]" class="compact" tabindex="0">
      <q-item-section class="reference text-secondary">{{ i + 1 }}</q-item-section>
      <q-item-section class="verse"><span vv-html="s" />{{ highlightSearchTerm(s) }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useSearchStore } from 'src/stores/search-store'
import { Direction } from 'src/util'
import { toRefs, ref, computed } from 'vue'
import { useKeyboardNavigation } from 'src/composables/useKeyboardNavigation'
import { useEventListener } from '@vueuse/core'

const store = useSearchStore()
const { chapterFragment, chapterVerses, highlightSearchTerm, scrollToSelection, selectionClasses } = toRefs(store)
const { goToAdjacentVerse, setChapterFragment } = store

const chapterRef = ref<HTMLElement | null>(null)
const versesCount = computed(() => chapterVerses.value.length)

onMounted(() => {
  if (chapterRef.value) {
    useKeyboardNavigation({
      container: chapterRef.value,
      itemsCount: versesCount,
      onIndexChange: (index) => {
        goToAdjacentVerse(index - (chapterFragment.value[2] ?? 0))
      },
      initialIndex: computed(() => chapterFragment.value[2] ?? 0)
    })
  }
})

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

function scrollPage(direction: Direction) {
  const container = document.getElementById('chapter')!
  const scrollTop = container.scrollTop
  const containerHeight = container.clientHeight

  let nextScrollTop
  if (direction === Direction.Next) {
    const scrollHeight = container.scrollHeight
    nextScrollTop = Math.min(scrollTop + containerHeight, scrollHeight - containerHeight)
  } else {
    nextScrollTop = Math.max(scrollTop - containerHeight, 0)
  }

  container.scrollTo({ top: nextScrollTop })
}

defineEmits(['focusReferenceList'])
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
