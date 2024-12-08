<template>
  <div ref="chapterRef" tabindex="0" class="chapter-container col bottom-clipped full-width">
    <q-list id="chapter" class="full-width" v-if="chapterVerses.length">
      <q-item v-for="( s, i ) in chapterVerses" :key="i" :class="selectionClasses[i]" class="compact"
        :ref="(el: ComponentPublicInstance) => { if (el) chapterItemRefs[i] = el }">
        <q-item-section class="reference text-secondary">{{ i + 1 }}</q-item-section>
        <q-item-section class="verse"><span v-html="highlightSearchTerm(s)" /></q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from 'src/stores/search-store'
import { bindKeyEvent, Direction } from 'src/util'
import { useEventListener, useFocusWithin } from '@vueuse/core'
import { ComponentPublicInstance, ref, onMounted, watch } from 'vue'

const store = useSearchStore()
const { chapterVerses, highlightSearchTerm, selectionClasses } = toRefs(store)
const chapterRef = ref<HTMLElement | null>(null)
const chapterItemRefs = ref<ComponentPublicInstance[]>([])

const { focused: chapterFocused } = useFocusWithin(chapterRef)

onMounted(() => {
  chapterRef.value?.focus()
})

function handleArrowKeys(event: KeyboardEvent) {
  if (!chapterFocused.value) return

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    store.goToAdjacentVerse(Direction.Prev)
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    store.goToAdjacentVerse(Direction.Next)
  }
}

useEventListener(document, 'keydown', handleArrowKeys)

const keyboardBindings = [
  bindKeyEvent('PageUp', () => scrollPage(Direction.Prev)),
  bindKeyEvent('PageDown', () => scrollPage(Direction.Next)),
]
useEventListener(document, 'keydown', (event) => {
  keyboardBindings.forEach(binding => binding(event))
})

useEventListener(document, 'selectionchange', () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0 || !store.chapterFragment) return
  const range = selection.getRangeAt(0)
  const node1 = range.startContainer.parentElement?.closest('#chapter .q-item')
  const node2 = range.endContainer.parentElement?.closest('#chapter .q-item')
  if (node1 && node2) {
    const siblings = Array.from(node1.parentElement?.children || [])
    const index1 = siblings.indexOf(node1)
    const index2 = siblings.indexOf(node2)
    const [start, end] = (index1 < index2) ? [index1, index2] : [index2, index1]
    const [book, chapter] = store.chapterFragment
    store.setChapterFragment([book, chapter, start, end], true, false)
  }
})

watch(() => store.scrollToIndex, async (index: number) => {
  await nextTick()
  if (!chapterRef.value) return
  chapterItemRefs.value[index].$el.scrollIntoView({ block: 'center' })
})

function scrollPage(direction: Direction) {
  if (!chapterRef.value) return
  const container = chapterRef.value
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

</script>

<style lang="scss" scoped>
.chapter-container {
  position: relative;
  height: 100%;
  overflow: auto;
}

#chapter {
  .compact {
    padding: 0 8px 1px 0;
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

// .chapter-container:focus-visible {
//   outline: none;
// }

// .chapter-container:focus-within::after {
//   content: "";
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   border: 1px solid var(--q-background-05);
//   // box-shadow: 0 0 0 2px red;
//   border-radius: 4px;
//   pointer-events: none;
// }
</style>
