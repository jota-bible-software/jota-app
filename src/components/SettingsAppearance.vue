<template>
  <SettingsPanel :title="$t('settingsAppearance.title')">
    <ScreenModeToggle />

    <!-- Font size -->
    <div class="col">
      <div class="row items-center q-gutter-sm">
        <div>{{ $t('settingsAppearance.fontSize') }}</div>
        <q-input v-model="store.persist.app.fontSize" class="row small" type="number"
          :data-tag="tags.settingsFontSize" />
        <q-btn icon="icon-mat-text_increase" @click="adjustFont(1)" :data-tag="tags.settingsFontSizeIncrease">
          <q-tooltip>{{ $t('settingsAppearance.textIncrease') }}</q-tooltip>
        </q-btn>
        <q-btn icon="icon-mat-text_decrease" @click="adjustFont(-1)" size="sm"
          :data-tag="tags.settingsFontSizeDecrease">
          <q-tooltip>{{ $t('settingsAppearance.textDecrease') }}</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Inline verse numbers -->
    <div class="col">
      <q-toggle 
        v-model="store.persist.app.inlineVerseNumbers" 
        :label="$t('settingsAppearance.inlineVerseNumbers')" 
      />
    </div>

    <!-- Superscript verse numbers -->
    <div class="col">
      <q-toggle 
        v-model="store.persist.app.superscriptVerseNumbers" 
        :label="$t('settingsAppearance.superscriptVerseNumbers')" 
      />
    </div>

    <div>{{ $t('settingsAppearance.bibleTextExample') }}</div>
    <div class="sample border">
      <ChapterContent />
    </div>
  </SettingsPanel>
</template>

<script setup lang="ts">
import SettingsPanel from './SettingsPanel.vue'
import ScreenModeToggle from './ScreenModeToggle.vue'
import ChapterContent from './ChapterContent.vue'
import { useSearchStore } from 'src/stores/search-store'
import { useSettingsStore } from 'src/stores/settings-store'
import * as tags from 'src/tags'

const store = useSettingsStore()
const searchStore = useSearchStore()

if (!searchStore.chapterFragment) {
  searchStore.setChapterFragment([0, 0, 0, 0])
}

function adjustFont(amount: number) {
  store.persist.app.fontSize = (store.persist.app.fontSize ?? 16) + amount
}
</script>

<style lang="scss" scoped>
.sample {
  height: 200px;
  overflow: auto;
}

.small {
  width: 4em;
}
</style>
