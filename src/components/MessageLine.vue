<template>
  <div id="message" v-if="!showPicker" class="q-my-sm">

    <q-circular-progress v-show="progress > 0" color="primary" track-color="grey-4" size="sm" indeterminate
      class="q-mr-sm" />
    <span v-if="progress > 0" class="q-mr-sm">{{ $t('messageLine.searching') }}</span>

    <span v-else-if="passages.length > 1">
      {{ $t('messageLine.foundPassages') }}
      <span style="font-weight: bold">{{ passages.length }}</span>

      <!-- Copy all found passages -->
      <q-btn-dropdown outline dense split class="q-mx-sm" icon="icon-mdi-content-copy" @click="copyFound()">
        <template v-slot:label>
          <q-tooltip>{{ $t('messageLine.copyFound') }}</q-tooltip>
        </template>
        <q-list>
          <q-item clickable v-close-popup @click="copyFound(item)" v-for="item in copyTemplates" :key="item.name">
            <q-item-section>
              <q-item-label :class="copyTemplateClass(item.name)">{{ item.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn outline dense icon="icon-mat-vertical_split" text-color="primary" @click="layout = 'split'"
        v-show="layout === 'formatted'">
        <q-tooltip>{{ $t('messageLine.enableNavigation') }}</q-tooltip>
      </q-btn>

      <q-btn outline dense icon="icon-mat-view_agenda" text-color="primary" @click="layout = 'formatted'"
        v-show="layout === 'split'">
        <q-tooltip>{{ $t('messageLine.formattedLayout') }}</q-tooltip>
      </q-btn>

      <q-btn outline dense class="q-mx-sm" icon="icon-la-sort-numeric-down" @click="sortAndDeduplicate"
        :text-color="shouldSort ? 'primary' : 'disabled'">
        <q-tooltip>{{ $t('messageLine.sortAndDeduplicate') }}</q-tooltip>
      </q-btn>
    </span>

    <span v-else-if="error">{{ error }}</span>

    <span
      v-else-if="passages.length === 0 && !chapterFragment && searchTerm !== ''">{{ $t('messageLine.notFound') }}</span>

    <!-- Passage displayed -->
    <span v-if="layout === 'split'">
      <span v-if="chapterFragment">
        <span id="chapter-label" class="q-mr-sm gt-xs">{{ $t('messageLine.chapterLabel') }}</span>
        <span class="bold q-mr-xs text-accent">{{ chapterCaption }}</span>
      </span>

      <q-btn-group v-if="chapterFragment" outline class="q-ml-sm">
        <!-- Previous chapter -->
        <q-btn outline dense text-color="primary" icon="icon-mat-navigate_before" @click="adjacentChapter(-1)">
          <q-tooltip>{{ $t('messageLine.previousChapter') }}</q-tooltip>
        </q-btn>
        <!-- Next chapter -->
        <q-btn outline dense text-color="primary" icon="icon-mat-navigate_next" @click="adjacentChapter(1)">
          <q-tooltip>{{ $t('messageLine.nextChapter') }}</q-tooltip>
        </q-btn>
      </q-btn-group>

      <!-- Copy single selected passage -->
      <q-btn-dropdown outline dense split text-color="primary" class="q-ml-sm" icon="icon-mdi-content-copy"
        @click="copySelected()" v-show="hasSelection">
        <template v-slot:label>
          <q-tooltip>{{ $t('messageLine.copySelected') }}</q-tooltip>
        </template>
        <q-list>
          <q-item clickable v-close-popup @click="copySelected(item)" v-for="item in copyTemplates" :key="item.name"
            style="max-width: 500px">
            <q-item-section>
              <q-item-label>{{ item.name }} {{ defaultSuffix(item) }}</q-item-label>
              <q-item-label caption><span v-html="formattedSample(item)" /></q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn id="player" v-show="store.chapterFragment" outline dense text-color="primary" class="q-ml-sm"
        icon="icon-mat-volume_up" @click="toggleAudio">

        <q-tooltip>{{ $t('messageLine.playAudio') }}</q-tooltip>
      </q-btn>
    </span>
  </div>
  <div>
    <AudioPlayer />
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useQuasar } from 'quasar'
import { useClipboard } from '@vueuse/core'
import { useSearchStore } from 'src/stores/search-store'
import { useSettingsStore } from 'src/stores/settings-store'
import { CopyTemplateData } from 'src/types'
import AudioPlayer from 'src/components/AudioPlayer.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const store = useSearchStore()
const { goToAdjacentChapter: adjacentChapter, chapterCaption, chapterFragment, copyTemplates, error, hasSelection, layout, passages, progress, searchTerm, shouldSort, showPicker, sortAndDeduplicate } = toRefs(store)

const settings = useSettingsStore()

const q = useQuasar()
const { copy } = useClipboard()

function formattedSample(item: CopyTemplateData) {
  return store.formattedSample(item)
}

function copySelected() {
  const result = store.formatSelected()
  if (result instanceof Error) {
    q.notify({
      message: result.message,
      type: 'negative'
    })
  } else if (!result) {
    q.notify({
      message: t('messageLine.noSelectedVerses'),
      type: 'negative'
    })
  } else {
    copy(result)
    q.notify({
      message: t('messageLine.copiedSelectedVerses'),
      type: 'positive'
    })
  }
}

function copyFound(item?: CopyTemplateData) {
  const result = store.formatFound(item)
  if (result instanceof Error) {
    q.notify({
      message: result.message,
      type: 'negative'
    })
  } else if (!result) {
    q.notify({
      message: `${t('messageLine.formatFailed')} ${item?.name} ${t('messageLine.notConfiguredFor')} ${settings.persist.appearance.locale}`,
      type: 'negative'
    })
  } else {
    copy(result)
    q.notify({
      message: t('messageLine.copiedFoundVerses'),
      type: 'positive'
    })
  }
}

function defaultSuffix(item: CopyTemplateData) {
  return item && item.name === settings.persist.defaultCopyTemplate ? ` (${t('messageLine.defaultTemplate')})` : ''
}

function copyTemplateClass(name: string) {
  const item = copyTemplates.value.find(it => it.name === name)
  return item && item.name === settings.persist.defaultCopyTemplate ? 'text-primary' : ' '
}

function toggleAudio() {
  store.audioOn = !store.audioOn
}

// function selectInChapter(start: number, end?: number): void {
//   if (!chapterFragment.value) return
//   const [book, chapter] = chapterFragment.value
//   setChapterFragment([book, chapter, start, end ?? start])
// }
</script>

<style lang="scss" scoped></style>
