<template>
  <div id="message" v-if="!showPicker" class="q-my-sm">

    <q-circular-progress v-show="progress > 0" color="primary" track-color="grey-4" size="sm" indeterminate
      class="q-mr-sm" />
    <span v-if="progress > 0" class="q-mr-sm">{{ $t('messageLine.searching') }}</span>

    <span v-else-if="passages.length > 1">
      {{ $t('messageLine.foundPassages') }}
      <span style="font-weight: bold" :data-tag="tags.foundPassages">{{ passages.length }}</span>

      <CopyButton class="q-mx-sm" tooltip="messageLine.copyFound" @click="copyFound" :data-tag="tags.copyFoundButton"
        :data-tag-item="tags.copyFoundOption" />

      <q-btn outline dense icon="icon-mat-vertical_split" text-color="primary" @click="setSplitLayout"
        v-show="layout === 'formatted'" :data-tag="tags.layoutToggle">
        <q-tooltip>{{ $t('messageLine.enableNavigation') }}</q-tooltip>
      </q-btn>

      <q-btn outline dense class="q-mx-sm" icon="icon-mat-view_agenda" text-color="primary" @click="layout = 'formatted'"
        v-show="layout === 'split'">
        <q-tooltip>{{ $t('messageLine.formattedLayout') }}</q-tooltip>
      </q-btn>

      <q-btn outline dense class="q-mx-sm" icon="icon-la-sort-numeric-down" @click="sortAndDeduplicate"
        :text-color="shouldSort ? 'primary' : 'disabled'">
        <q-tooltip>{{ $t('messageLine.sortAndDeduplicate') }}</q-tooltip>
      </q-btn>
    </span>

    <span v-else-if="error">{{ error }}</span>

    <span v-else-if="passages.length === 0 && searchTerm !== ''"
      :data-tag="tags.nothingFound">{{ $t('messageLine.notFound') }}</span>

    <!-- Passage displayed -->
    <span v-else-if="layout === 'split'">
      <span v-if="chapterFragment">
        <span id="chapter-label" class="q-mr-sm gt-xs">{{ $t('messageLine.chapterLabel') }}</span>
        <span class="bold q-mr-xs text-accent" :data-tag="tags.chapterCaption">{{ chapterCaption }}</span>
      </span>

      <q-btn-group v-if="chapterFragment" outline class="q-ml-sm">
        <!-- Previous chapter -->
        <q-btn outline dense text-color="primary" icon="icon-mat-navigate_before" @click="goToAdjacentChapter(-1)"
          :data-tag="tags.previousChapterButton">
          <q-tooltip>{{ $t('messageLine.previousChapter') }}</q-tooltip>
        </q-btn>
        <!-- Next chapter -->
        <q-btn outline dense text-color="primary" icon="icon-mat-navigate_next" @click="goToAdjacentChapter(1)"
          :data-tag="tags.nextChapterButton">
          <q-tooltip>{{ $t('messageLine.nextChapter') }}</q-tooltip>
        </q-btn>
      </q-btn-group>

      <!-- Copy single selected passage -->
      <CopyButton v-show="hasSelection" text-color="primary" tooltip="messageLine.copySelected" @click="copySelected"
        :data-tag="tags.copySelectedButton" :data-tag-item="tags.copySelectedOption" />

      <q-btn id="player" v-if="settings.persist.appearance.locale === 'pl-PL'" v-show="store.chapterFragment" outline
        dense text-color="primary" class="q-ml-sm" icon="icon-mat-volume_up" @click="toggleAudio">

        <q-tooltip>{{ $t('messageLine.playAudio') }}</q-tooltip>
      </q-btn>
    </span>
  </div>
  <div>
    <AudioPlayer />
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useClipboard } from '@vueuse/core'
import { useSearchStore } from 'src/stores/search-store'
import { useSettingsStore } from 'src/stores/settings-store'
import { CopyTemplateData } from 'src/types'
import AudioPlayer from 'src/components/AudioPlayer.vue'
import CopyButton from './CopyButton.vue'
import { useI18n } from 'vue-i18n'
import * as tags from 'src/tags'

const { t } = useI18n()

const store = useSearchStore()
const { goToAdjacentChapter, chapterCaption, chapterFragment, error, hasSelection, layout, passages, progress, searchTerm, shouldSort, showPicker, sortAndDeduplicate } = toRefs(store)

const settings = useSettingsStore()

const q = useQuasar()
const { copy } = useClipboard()

function setSplitLayout() {
  store.layout = 'split'
  nextTick(() => {
    document.getElementById('passages')?.focus()
  })
}

function copySelected(template?: CopyTemplateData) {
  const result = store.formatSelected(template)
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

function copyFound(template?: CopyTemplateData) {
  const result = store.formatFound(template)
  if (result instanceof Error) {
    q.notify({
      message: result.message,
      type: 'negative'
    })
  } else if (!result) {
    q.notify({
      message: `${t('messageLine.formatFailed')} ${template?.name} ${t('messageLine.notConfiguredFor')} ${settings.persist.appearance.locale}`,
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

function toggleAudio() {
  store.audioOn = !store.audioOn
}

</script>

<style lang="scss" scoped></style>
