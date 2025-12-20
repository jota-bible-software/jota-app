<template>
  <div id="reference-picker" class="q-mb-md">
    <div class="info row q-mb-md items-center">
      <span class="text-accent">{{ message }}</span>

      <span v-if="isBookSelected" class="bold q-mr-sm">{{ passageName }}</span>

      <q-btn :data-tag="tags.referencePickerBackButton" outline dense text-color="primary" icon="icon-mdi-arrow-up-left" v-show="isBookSelected"
        @click="back">
        <q-tooltip>{{ t('referencePicker.backTooltip') }} {{ backTooltip }}</q-tooltip>
      </q-btn>
    </div>

    <div v-if="bookIndex === -1" id="reference-picker-books" class="col q-mt-sm">
      <!-- <div class="row q-mb-sm text-h6">Old testament</div> -->
      <div class="row selectors">
        <ReferencePickerButton data-tag="reference-picker-book" v-for="(book, i) in bookList.slice(0, 17)" :key="i" :value="book"
          :alternate="alternate[i]" @select="selectBook(i)" />
      </div>

      <div class="row selectors q-mt-sm">
        <ReferencePickerButton :data-tag="tags.referencePickerBookButton" v-for="(book, i) in bookList.slice(17, 39)" :key="i" :value="book"
          :alternate="alternate[i + 17]" @select="selectBook(i + 17)" />
      </div>

      <!-- <div class="row q-mt-sm text-h6">New testament</div> -->
      <div class="row selectors q-mt-md">
        <ReferencePickerButton :data-tag="tags.referencePickerBookButton" v-for="(book, i) in bookList.slice(39, 66)" :key="i" :value="book"
          :alternate="alternate[i + 39]" @select="selectBook(i + 39)" />
      </div>
    </div>

    <!-- Chapters -->
    <div v-if="!isChapterSelected && isBookSelected" id="reference-picker-chapters" class="col">
      <div class="row selectors">
        <ReferencePickerButton :data-tag="tags.referencePickerChapterButtons" v-for="chapter in chapters" :key="chapter" :value="chapter + 1"
          alternate="0" @select="selectChapter(chapter)" />
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
import { useI18n } from 'vue-i18n'
import ReferencePickerButton from 'src/components/ReferencePickerButton.vue'
import { useTranslationStore } from 'src/stores/translation-store'
import { useSettingsStore } from 'src/stores/settings-store'
import { useSearchStore } from 'src/stores/search-store'
import { nextTick } from 'vue'
import * as tags from 'src/tags'
import { getChapterCount } from '@jota/core'

const { t } = useI18n()
const settings = useSettingsStore()
const store = useTranslationStore()
const searchStore = useSearchStore()

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

const bookList = computed(() => settings.appBookNames)
const chapters = computed(() => {
  if (!isBookSelected.value || !store.currentContent) return []
  const n = getChapterCount(store.currentContent, bookIndex.value)
  return [...Array(n).keys()]
})
// const verses = computed(() => {
//   if (!isBookSelected.value || !isChapterSelected.value) return []
//   const n = bibleStore.content[bookIndex.value][chapterIndex.value].length
//   return [...Array(n).keys()]
// })
const sep = computed(() => settings.appFormatTemplate?.separatorChar)
const bookName = computed(() => bookList.value[bookIndex.value])
const backTooltip = computed(() => isChapterSelected.value ? t('referencePicker.chapters') : t('referencePicker.books'))
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
  return !isBookSelected.value ? t('referencePicker.selectBook') :
    !isChapterSelected.value ? t('referencePicker.selectChapter') :
      t('referencePicker.selectVerse')
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
  searchStore.clearFragments() // Clear fragments
  await nextTick()

  searchStore.layout = 'split' // Set layout to 'split'
  if (!isChapterSelected.value) chapterIndex.value = 0
  searchStore.setChapterFragment([bookIndex.value, chapterIndex.value])
  searchStore.showPicker = false

  // Reset reference picker
  bookIndex.value = -1
  chapterIndex.value = -1
  verseIndex.value = -1
}
</script>


<style lang="scss">
#reference-picker {
  .info {
    margin-bottom: 16px !important;
  }

  .row {
    gap: 8px;
  }
}
</style>
