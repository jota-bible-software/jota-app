<template>
  <div class="row">
    <!-- List of passages -->
    <div id="passages" v-if="passages.length > 1" class="col bottom-clipped q-list" ref="passagesRef" tabindex="0">
      <div v-for="(item, index) in passages" :key="index" clickable tabindex="0" :class="{ highlight: index === fragmentIndex }"
        @click="store.setFragmentIndex(index)" :ref="el => { if (el) passageItemRefs[index] = (el as HTMLElement) }"
        class="q-item q-item-type row no-wrap compact q-item--clickable q-link cursor-pointer" :data-tag="tags.foundPassage">{{ item }}</div>
    </div>

    <ChapterContent v-if="chapterFragment" :data-tag="tags.chapterContent" />
  </div>
</template>

<script setup lang="ts">
import ChapterContent from './ChapterContent.vue'
import { Direction } from 'src/util'
import { useSearchStore } from 'src/stores/search-store'
import { useEventListener, useFocusWithin } from '@vueuse/core'
import { ref, onMounted, watch, nextTick } from 'vue'
import * as tags from 'src/tags'

const store = useSearchStore()
const { chapterFragment, fragmentIndex, passages } = toRefs(store)
const { goToAdjacentChapter, moveFragmentIndex } = store

const passagesRef = ref<HTMLElement | null>(null)
const passageItemRefs = ref<HTMLElement[]>([])

const { focused: passagesFocused } = useFocusWithin(passagesRef)

onMounted(() => {
  if (passages.value.length > 1 && passagesRef.value) {
    useEventListener(passagesRef, 'keydown', (e) => {
      handleArrowKeys
    })
    passagesRef.value.focus()
  }
})

function handleArrowKeys(event: KeyboardEvent) {
  if (!passagesFocused.value) return

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveFragmentIndex(-1)
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveFragmentIndex(1)
  }
}

function scrollToHighlightedItem() {
  if (!passagesRef.value || fragmentIndex.value === undefined) return

  const container = passagesRef.value
  const item = passageItemRefs.value[fragmentIndex.value]

  if (!item) return

  const containerRect = container.getBoundingClientRect()
  const itemRect = item.getBoundingClientRect()

  if (itemRect.bottom > containerRect.bottom) {
    container.scrollTop += itemRect.bottom - containerRect.bottom
  } else if (itemRect.top < containerRect.top) {
    container.scrollTop += itemRect.top - containerRect.top
  }
}


watch(fragmentIndex, () => {
  nextTick(() => {
    scrollToHighlightedItem()
  })
})


useEventListener(document, 'keydown', (event) => {
  if ((event.ctrlKey || event.metaKey)) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToAdjacentChapter(Direction.Prev)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToAdjacentChapter(Direction.Next)
    }
  }
})
</script>

<style lang="scss" scoped>
#passages {
  flex: 0 0 auto;
  position: relative;
  padding-left: 0;
  padding-right: 4px;
  border-right: var(--q-border) solid 1px;
  margin-right: 4px;

  .compact {
    line-height: 24px;
    padding: 0 8px !important;
    width: 100%;
    white-space: nowrap;
    min-height: 24px;
    overflow: hidden;
  }

  .compact:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .highlight {
    box-shadow: inset 1px 1px var(--q-primary), inset -1px -1px var(--q-primary);
  }
}
</style>
