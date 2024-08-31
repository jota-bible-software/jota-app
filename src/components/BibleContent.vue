<template>
  <div id="content" v-scroll class="q-pb-md" v-show="!loading && !showPicker">
    <div class="row" v-if="layout === 'split'">
      <ReferenceList ref="referenceListRef" @focusChapter="focusChapter" />
      <ChapterContent ref="chapterContentRef" @focusReferenceList="focusReferenceList" />
    </div>

    <div id="formatted" class="row q-pb-md" v-if="layout === 'formatted'">
      <div v-for="(item, i) in formattedSearchResults()  " v-bind:key="i" class="formatted-verse">
        <span class="bref" @click="readInContext(i)">{{ item.bibleReference }} {{ item.symbol }}</span>
        <span v-html="item.content"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from 'src/stores/search-store'
import { toRefs, watch, ref, nextTick } from 'vue'
import ChapterContent from './ChapterContent.vue'
import ReferenceList from './ReferenceList.vue'

const store = useSearchStore()
const { chapterVerses, formattedSearchResults, layout, loading, readInContext, showPicker } = toRefs(store)

const chapterContentRef = ref<InstanceType<typeof ChapterContent> | null>(null)
const referenceListRef = ref<InstanceType<typeof ReferenceList> | null>(null)

// watch(chapterVerses, () => {
//   nextTick(() => {
//     const passagesElement = document.getElementById('passages')
//     const activeElement = document.activeElement

//     if (passagesElement && !passagesElement.contains(activeElement)) {
//       focusChapter()
//     }
//   })
// })

function focusChapter() {
  //   const chapterElement = document.getElementById('chapter')
  //   chapterElement?.focus()
}

function focusReferenceList() {
  //   const passagesElement = document.getElementById('passages')
  //   if (passagesElement) {
  //     const activeItem = passagesElement.querySelector('.highlight') as HTMLElement
  //     if (activeItem) {
  //       activeItem.focus()
  //     } else {
  //       passagesElement.focus()
  //     }
  //   }
}
</script>

<style lang="scss">
#content {
  display: flex;
  flex-direction: column;
  overflow: auto;

  .row {
    overflow: auto;
  }
}

#content * {
  outline: none;
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
