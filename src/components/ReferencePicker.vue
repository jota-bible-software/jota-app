<template>
  <div id="reference-picker" class="q-mb-md">
    <div class="info row q-my-sm items-center">
      <span class="text-accent">{{ message }}</span>

      <span v-if="isBookSelected" class="bold q-mr-lg">{{ passageName }}</span>

      <q-btn outline dense text-color="primary" class="q-ml-sm" icon="icon-mat-undo" v-show="isBookSelected"
        @click="back">
        <q-tooltip>Przejdź do wybierania {{ backTooltip }}</q-tooltip>
      </q-btn>

      <q-btn outline dense text-color="primary" icon="icon-mat-done" v-show="isBookSelected && !isVerseSelected"
        @click="finish">
        <q-tooltip>Zakończ wybieranie fragmentu</q-tooltip>
      </q-btn>
    </div>

    <div v-if="bookIndex === -1" id="reference-picker-books" class="col q-mt-sm">
      <!-- <div class="row q-mb-sm text-h6">Stary testament</div> -->
      <div class="row selectors">
        <ReferencePickerButton v-for="(book, i) in bookList.slice(0, 17)" :key="i" :value="book"
          :alternate="alternate[i]" @select="selectBook(i)" />
      </div>

      <div class="row selectors q-mt-sm">
        <ReferencePickerButton v-for="(book, i) in bookList.slice(17, 39)" :key="i" :value="book"
          :alternate="alternate[i + 17]" @select="selectBook(i + 17)" />
      </div>

      <!-- <div class="row q-mt-sm text-h6">Nowy testament</div> -->
      <div class="row selectors q-mt-md">
        <ReferencePickerButton v-for="(book, i) in bookList.slice(39, 66)" :key="i" :value="book"
          :alternate="alternate[i + 39]" @select="selectBook(i + 39)" />
      </div>
    </div>

    <div v-if="!isChapterSelected && isBookSelected" id="reference-picker-chapters" class="col">
      <div class="row selectors">
        <ReferencePickerButton v-for="chapter in chapters" :key="chapter" :value="chapter + 1" alternate="0"
          @select="selectChapter(chapter)" />
      </div>
    </div>

    <!-- <div v-if="isChapterSelected" id="reference-picker-verses" class="col" >
      <div class="row selectors">
        <ReferencePickerButton v-for="verse in verses" :key="verse" :value="verse+1" @select="selectVerse(verse)"/>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ReferencePickerButton from 'src/components/ReferencePickerButton.vue'
import { useSearchStore } from 'src/stores/search-store'
import { useSettingsStore } from 'src/stores/settings-store'
import { nextTick } from 'vue'

const settingsStore = useSettingsStore()
const store = useSearchStore()

const alternate = [
  1, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  2, 2, 2, 2, 2,
  1, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  2, 2, 2, 2,
  0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0, 0, 0,
  2
]

const bookIndex = ref(-1)
const chapterIndex = ref(-1)
const verseIndex = ref(-1)

const bookList = computed(() => settingsStore.appBookNames)
const chapters = computed(() => {
  if (!isBookSelected.value) return []
  const n = store.translation?.content ? store.translation.content[bookIndex.value].length : 0
  return [...Array(n).keys()]
})
// const verses = computed(() => {
//   if (!isBookSelected.value || !isChapterSelected.value) return []
//   const n = bibleStore.content[bookIndex.value][chapterIndex.value].length
//   return [...Array(n).keys()]
// })
const sep = computed(() => settingsStore.appFormatTemplate.separatorChar)
const bookName = computed(() => bookList.value[bookIndex.value])
const backTooltip = computed(() => isChapterSelected.value ? 'rozdziałów' : 'ksiąg')
const isBookSelected = computed(() => bookIndex.value !== -1)
const isChapterSelected = computed(() => chapterIndex.value !== -1)
const isVerseSelected = computed(() => verseIndex.value !== -1)
const passageName = computed(() => {
  const book = bookName.value || ''
  const chapter = isChapterSelected.value ? ` ${chapterIndex.value + 1}` : ''
  const verse = isVerseSelected.value ? `${sep.value}${verseIndex.value + 1}` : ''
  return `${book}${chapter}${verse}`
})
const message = computed(() => {
  return !isBookSelected.value ? 'Wybierz księgę:' :
    !isChapterSelected.value ? 'Wybierz rozdział w księdze:' :
      'Wybierz werset w:'
})

function selectBook(i: number) {
  bookIndex.value = i
}

function selectChapter(i: number) {
  chapterIndex.value = i
  finish()
}

// function selectVerse(i: number) {
//   verseIndex.value = i
//   finish()
// }

function back() {
  if (isChapterSelected.value) chapterIndex.value = -1
  else if (isBookSelected.value) bookIndex.value = -1
}

async function finish() {
  store.clearFragments() // Clear fragments
  await nextTick()

  store.layout = 'split' // Set layout to 'split'
  if (!isChapterSelected.value) chapterIndex.value = 0
  store.setChapterFragment([bookIndex.value, chapterIndex.value, 0, 0])
  store.showPicker = false

  // Reset reference picker
  bookIndex.value = -1
  chapterIndex.value = -1
  verseIndex.value = -1
}
</script>


<style lang="scss">
#reference-picker {
  .info {
    height: 32px;
  }

  .row {
    gap: 8px;
  }
}
</style>
