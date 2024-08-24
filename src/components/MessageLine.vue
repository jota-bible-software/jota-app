<template>
  <div id="message" v-if="!showPicker" class="q-my-sm">
    <q-circular-progress v-show="progress > 0" color="primary" track-color="grey-4" size="sm" indeterminate />
    <span v-if="progress > 0">Szukam...</span>

    <span v-else-if="passages.length > 1">
      Znaleziono fragmentów:
      <span style="font-weight: bold">{{ passages.length }}</span>

      <!-- Copy all found passages -->
      <q-btn-dropdown outline dense split class="q-mx-sm" icon="icon-mdi-content-copy" @click="copyFound()">
        <q-list>
          <q-item clickable v-close-popup @click="copyFound(item)" v-for="item in copyTemplates" :key="item.name">
            <q-item-section>
              <q-item-label :class="copyTemplateClass(item.name)">{{ item.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-tooltip>Kopiuj znalezione wersety do schowka</q-tooltip>
      </q-btn-dropdown>

      <q-btn outline dense icon="icon-mat-vertical_split" text-color="primary" @click="layout = 'split'"
        v-show="layout === 'formatted'">
        <q-tooltip>Włącz nawigację</q-tooltip>
      </q-btn>

      <q-btn outline dense icon="icon-mat-view_agenda" text-color="primary" @click="layout = 'formatted'"
        v-show="layout === 'split'">
        <q-tooltip>Zmień układ na sformatowany do wydruku</q-tooltip>
      </q-btn>

      <q-btn outline dense class="q-mx-sm" icon="icon-la-sort-numeric-down" @click="sortAndDeduplicate"
        :text-color="shouldSort ? 'primary' : 'disabled'">
        <q-tooltip>{{ shouldSortTooltip }}</q-tooltip>
      </q-btn>
    </span>

    <span v-else-if="error">{{ error }}</span>

    <span v-else-if="passages.length === 0 && !chapterFragment && searchTerm !== ''">Nic takiego nie znaleziono
      :-(</span>

    <!-- Passage displayed -->
    <span v-if="layout === 'split'">
      <span v-if="chapterFragment">
        <span id="chapter-label" class="q-mr-sm gt-xs">Wyświetlany rozdział:</span>
        <span class="bold q-mr-xs text-accent">{{ chapterCaption }}</span>
      </span>

      <q-btn-group v-if="chapterFragment" outline class="q-ml-sm">
        <!-- Previous chapter -->
        <q-btn outline dense text-color="primary" icon="icon-mat-navigate_before" @click="adjacentChapter(-1)">
          <q-tooltip>Poprzedni rozdział</q-tooltip>
        </q-btn>
        <!-- Next chapter -->
        <q-btn outline dense text-color="primary" icon="icon-mat-navigate_next" @click="adjacentChapter(1)">
          <q-tooltip>Następny rozdział</q-tooltip>
        </q-btn>
      </q-btn-group>

      <!-- Copy single selected passage -->
      <q-btn-dropdown outline dense split text-color="primary" class="q-ml-sm" icon="icon-mdi-content-copy"
        @click="copySelected()" v-show="hasSelection">
        <q-list>
          <q-item clickable v-close-popup @click="copySelected(item)" v-for="item in copyTemplates" :key="item.name"
            style="max-width: 500px">
            <q-item-section>
              <q-item-label>{{ item.name }} {{ defaultSuffix(item) }}</q-item-label>
              <q-item-label caption><span v-html="formattedSample(item)" /></q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-tooltip>Kopiuj zaznaczone wersety do schowka</q-tooltip>
      </q-btn-dropdown>

      <q-btn id="player" v-show="store.chapterFragment" outline dense text-color="primary" class="q-ml-sm"
        icon="icon-mat-volume_up" @click="toggleAudio">

        <q-tooltip>Odtwórz rozdział w wersji audio</q-tooltip>
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

const store = useSearchStore()
const { goToAdjacentChapter: adjacentChapter, chapterCaption, chapterFragment, copyTemplates, error, hasSelection, layout, passages, progress, searchTerm, shouldSort, shouldSortTooltip, showPicker, sortAndDeduplicate } = toRefs(store)

const settings = useSettingsStore()

const q = useQuasar()
const { copy } = useClipboard()

function formattedSample(item: CopyTemplateData) {
  return store.formattedSample(item)
}

function copySelected(item?: CopyTemplateData) {
  const s = store.formatSelected(item)
  
  copy(s)
  q.notify({
    message: 'Skopiowano zaznaczone wersety do schowka',
    type: 'positive',
    position: 'top',
    timeout: 2000
  })
}

function copyFound(item?: CopyTemplateData) {
  const s = store.formatFound(item)
  console.log(`Copy found: ${s}`)
  copy(s)
  q.notify('Skopiowano znalezione wersety do schowka')
}
function defaultSuffix(item: CopyTemplateData) {
  return item && item.name === settings.persist.defaultCopyTemplate ? ' (domyślny szablon)' : ''
}

function copyTemplateClass(name: string) {
  const item = copyTemplates.value.find(it => it.name === name)
  return item && item.name === settings.persist.defaultCopyTemplate ? 'text-primary' : ' '
}

function toggleAudio() {
  store.audioOn = !store.audioOn
}
</script>

<style lang="scss" scoped></style>
