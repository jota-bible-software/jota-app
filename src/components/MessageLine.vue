<template>
  <div id="message" v-if="!showPicker" class="q-my-sm">
    <q-circular-progress v-show="progress > 0" color="primary" track-color="grey-4" size="sm" indeterminate />
    <span v-if="progress > 0">Szukam...</span>

    <span v-else-if="passages.length > 1">
      Znaleziono fragmentów:
      <span style="font-weight: bold">{{ passages.length }}</span>

      <q-btn outline dense class="q-mx-sm" icon="icon-mdi-content-copy" @click="copyFound">
        <q-tooltip>Kopiuj znalezione wersety do schowka</q-tooltip>
      </q-btn>

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

    <span v-else-if="passages.length === 0 && !chapterFragment && searchTerm !== ''">Nic takiego nie znaleziono :-(</span>

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

      <q-btn-dropdown outline dense split text-color="primary" class="q-ml-sm" icon="icon-mdi-content-copy"
        @click="copySelected" v-show="chapterFragment && !isNaN(chapterFragment[2])">
        <q-tooltip>Kopiuj zaznaczone wersety do schowka</q-tooltip>
      </q-btn-dropdown>

      <q-btn id="player" v-show="chapterFragment" outline dense text-color="primary" class="q-ml-sm"
        icon="icon-mat-volume_up" @click="playAudio">
        <q-tooltip>Odtwórz rozdział w wersji audio</q-tooltip>
      </q-btn>
    </span>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useSearchStore } from 'src/stores/search-store'

const store = useSearchStore()

const { adjacentChapter, chapterCaption, chapterFragment, copyFound, copySelected, error, layout, passages, progress, searchTerm, shouldSort, shouldSortTooltip, showPicker, sortAndDeduplicate } = toRefs(store)

function playAudio() {
  return null
}
</script>

<style lang="scss" scoped>
</style>
