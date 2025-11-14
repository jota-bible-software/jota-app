<template>
  <div ref="chapterRef" v-if="chapterVerses.length" tabindex="0" class="chapter-container col bottom-clipped full-width">
    <!-- Continuous verses mode -->
    <div v-if="continuousVerses && chapterVerses.length" id="chapter" class="continuous-verses full-width">
      <span v-for="(s, i) in chapterVerses" :key="i"
        :class="[selectionClasses[i], { 'underline-highlight': underlineHighlight }, highlightClasses[i]]" class="verse-span"
        :ref="(el: Element | ComponentPublicInstance | null) => { if (el) chapterItemRefs[i] = el as HTMLElement }" :data-tag="tags.chapterVerse" :style="highlightStyles[i]">
        <span :class="['reference', 'text-secondary', { 'superscript': superscript }]">{{ i + 1 }}</span>
        <span class="verse-text" :data-tag="tags.verseText" v-html="highlightSearchTerm(s)" />
      </span>
    </div>

    <!-- Traditional verses mode -->
    <q-list v-else id="chapter" class="full-width">
      <q-item v-for="(s, i) in chapterVerses" :key="i"
        :class="[selectionClasses[i], { 'underline-highlight': underlineHighlight }, highlightClasses[i]]" class="compact"
        :ref="(el: Element | ComponentPublicInstance | null) => { if (el) chapterItemRefs[i] = el as ComponentPublicInstance }" :data-tag="tags.chapterVerse" :style="highlightStyles[i]">
        <q-item-section v-if="!inlined" :class="['reference', 'text-secondary', { 'superscript': superscript }]">{{ i + 1 }}</q-item-section>
        <q-item-section v-if="!inlined" class="verse" :data-tag="tags.verseText"><span v-html="highlightSearchTerm(s)" /></q-item-section>
        <q-item-section v-if="inlined" class="verse-inline">
          <span :class="['reference', 'text-secondary', { 'superscript': superscript }]">{{ i + 1 }}</span>
          <span class="verse" :data-tag="tags.verseText" v-html="highlightSearchTerm(s)" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from 'src/stores/search-store'
import { useSettingsStore } from 'src/stores/settings-store'
import { useHighlightStore } from 'src/stores/highlight-store'
import { bindKeyEvent, Direction } from 'src/util'
import { useEventListener, useFocusWithin } from '@vueuse/core'
import * as tags from 'src/tags'

const store = useSearchStore()
const settingsStore = useSettingsStore()
const highlightStore = useHighlightStore()
const { chapterVerses, highlightSearchTerm, selectionClasses } = toRefs(store)
const chapterRef = ref<HTMLElement | null>(null)
const chapterItemRefs = ref<(ComponentPublicInstance | HTMLElement)[]>([])
const inlined = computed(() => settingsStore.persist.app.inlineVerseNumbers)
const superscript = computed(() => settingsStore.persist.app.superscriptVerseNumbers)
const underlineHighlight = computed(() => settingsStore.persist.app.underlineVerseHighlight)
const continuousVerses = computed(() => settingsStore.persist.app.continuousVerses)

const highlightClasses = computed(() => {
  if (!store.chapterFragment) return []
  const [book, chapter] = store.chapterFragment

  return chapterVerses.value.map((_, index) => {
    const highlight = highlightStore.getHighlight(book, chapter, index)
    return highlight ? 'verse-highlighted' : ''
  })
})

const highlightStyles = computed(() => {
  if (!store.chapterFragment) return []
  const [book, chapter] = store.chapterFragment

  return chapterVerses.value.map((_, index) => {
    const highlight = highlightStore.getHighlight(book, chapter, index)
    if (!highlight) return {}

    const color = highlightStore.config.colors.find(
      c => c.id === highlight.highlightColorId
    )

    return color ? { '--highlight-color': color.hex } : {}
  })
})

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


// Debounce selection change to prevent excessive updates
let selectionTimeout: ReturnType<typeof setTimeout> | null = null
useEventListener(document, 'selectionchange', () => {
  if (!store.chapterFragment) return

  // Clear previous timeout
  if (selectionTimeout) {
    clearTimeout(selectionTimeout)
  }

  // Debounce selection updates
  selectionTimeout = setTimeout(() => {
    const range = window._jota_test_support.getSelectionRange()
    if (!range) return
    const selector = continuousVerses.value ? '#chapter .verse-span' : '#chapter .q-item'
    const node1 = range.startContainer.parentElement?.closest(selector) ?? null
    const node2 = range.endContainer.parentElement?.closest(selector) ?? null
    if (node1 && node2) {
      const siblings = Array.from(node1.parentElement?.children || [])
      const index1 = siblings.indexOf(node1)
      const index2 = siblings.indexOf(node2)
      const [start, end] = (index1 < index2) ? [index1, index2] : [index2, index1]
      if (store.chapterFragment) {
        const [book, chapter] = store.chapterFragment
        store.setChapterFragment([book, chapter, start, end], true, false)
      }
    }
    selectionTimeout = null
  }, 50)
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (selectionTimeout) {
    clearTimeout(selectionTimeout)
    selectionTimeout = null
  }
})

watch(() => store.scrollToIndex, async (index: number) => {
  await nextTick()
  if (!chapterRef.value || !chapterItemRefs.value[index]) return
  // Ensure the verse is scrolled to the center of the viewport
  const element = continuousVerses.value
    ? chapterItemRefs.value[index] as HTMLElement
    : (chapterItemRefs.value[index] as ComponentPublicInstance).$el
  element.scrollIntoView({ block: 'center', behavior: 'auto' })
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

.continuous-verses {
  line-height: 1.7;
  padding-right: 8px;

  .verse-span {
    display: inline;
    margin-right: 4px;
    position: relative;

    .reference {
      margin-right: 2px;
      line-height: 1.7;
      vertical-align: baseline;
    }

    .verse-text {
      margin-right: 4px;
      line-height: 1.7;
    }

    .superscript {
      vertical-align: super;
      font-size: smaller;
      line-height: 1;
    }

    // Selection styles for continuous mode
    &.selection-single,
    &.selection-start,
    &.selection-middle,
    &.selection-end {
      box-shadow: none;
      border-radius: 0;

      &.underline-highlight .verse-text {
        text-decoration: underline;
        text-decoration-color: var(--q-foreground-dimmed);
        text-decoration-thickness: 1px;
        text-decoration-style: dashed;
        text-underline-offset: 7px;
      }
    }
  }
}

#chapter {
  .compact {
    padding: 0 8px 1px 0;
    min-height: 24px;
  }

  .reference {
    max-width: 2em;
    justify-content: start;
    padding-top: 1px;
    padding-right: 2px;
    text-align: center;
  }

  .selection-single {
    box-shadow: inset 0 0 0 1px var(--q-primary);
    border-radius: 5px;
  }

  .selection-start {
    box-shadow: inset 1px 1px var(--q-primary), inset -1px 1px var(--q-primary);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .selection-middle {
    box-shadow: inset 1px 0 var(--q-primary), inset -1px 0 var(--q-primary);
  }

  .selection-end {
    box-shadow: inset 1px -1px var(--q-primary), inset -1px -1px var(--q-primary);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .verse {
    margin-left: 4px;
  }

  .verse-inline {
    display: block;
    padding-left: 12px;
    padding-right: 12px;
  }

  .superscript {
    vertical-align: super;
    font-size: smaller;
  }

  // Underline highlighting overrides for selection classes
  .underline-highlight {

    &.selection-single,
    &.selection-start,
    &.selection-middle,
    &.selection-end {
      box-shadow: none;
      border-radius: 0;

      .verse,
      .verse-inline .verse {
        text-decoration: underline;
        text-decoration-color: var(--q-foreground-dimmed);
        text-decoration-thickness: 1px;
        text-decoration-style: dashed;
        text-underline-offset: 7px;
      }
    }
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

.verse-highlighted {
  background-color: color-mix(in srgb, var(--highlight-color) 20%, transparent);
  border-radius: 3px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;

  &.selection-single,
  &.selection-start,
  &.selection-middle,
  &.selection-end {
    background-color: color-mix(in srgb, var(--highlight-color) 15%, transparent);
  }
}

.continuous-verses .verse-span.verse-highlighted {
  padding: 2px 4px;
  margin-right: 0;

  .verse-text {
    margin-right: 0;
  }
}
</style>
