<template>
  <q-list id="chapter" class="col bottom-clipped full-width" v-if="chapterVerses.length" ref="chapter">
    <q-item v-for="( s, i ) in chapterVerses" :key="i" :class="selectionClasses[i]" class="compact">
      <q-item-section class=" reference text-secondary">{{ i + 1 }}</q-item-section>
      <q-item-section class="verse"><span v-html="highlightSearchTerm(s)" /></q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useSearchStore } from 'src/stores/search-store'
import { Passage } from 'src/types'
import { bindKeyEvent, Direction } from 'src/util'

const store = useSearchStore()
const { chapterVerses, highlightSearchTerm, selectionClasses } = toRefs(store)
const chapter: Ref<ComponentPublicInstance | null> = ref(null)

const keyboardBindings = [
  bindKeyEvent('ArrowUp', () => {
    console.log(document.activeElement)
    store.goToAdjacentVerse(Direction.Prev)
  }),
  bindKeyEvent('ArrowDown', () => store.goToAdjacentVerse(Direction.Next)),
  bindKeyEvent('PageUp', () => scrollPage(Direction.Prev)),
  bindKeyEvent('PageDown', () => scrollPage(Direction.Next)),
]

// Keyup does work for Ctrl+ArrowLeft
useEventListener(document, 'keydown', (event) => {
  keyboardBindings.forEach(binding => binding(event))
})

watch(() => store.chapterFragment, async (passage: Passage) => {
  await nextTick()
  if (!chapter.value) return
  const versesElement = document.getElementById('chapter')
  if (store.scrollToSelection && versesElement) {
    const [, , start, end] = passage
    const s = start ?? 0
    const e = end ?? start ?? 0
    const index: number = s + (e - s) / 2
    const verseElement = versesElement.children[index]
    verseElement.scrollIntoView({ block: 'center' })
  }
})

function scrollPage(direction: Direction) {
  if (!chapter.value) return
  const container = chapter.value.$el
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
