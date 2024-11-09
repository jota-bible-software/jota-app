<template>
  <SettingsPanel :title="$t('settingsAppearance.title')">
    <ScreenModeToggle />

    <!-- Font size -->
    <div class="col">
      <div class="row items-center q-gutter-sm">
        <div>{{ $t('settingsAppearance.fontSize') }}</div>
        <q-input :data-tag="tags.seettingsFontSize" v-model="store.persist.appearance.fontSize" class="row small"
          type="number" />
        <q-btn icon="icon-mat-text_increase" @click="adjustFont(1)">
          <q-tooltip>{{ $t('settingsAppearance.textIncrease') }}</q-tooltip>
        </q-btn>
        <q-btn icon="icon-mat-text_decrease" @click="adjustFont(-1)" size="sm">
          <q-tooltip>{{ $t('settingsAppearance.textDecrease') }}</q-tooltip>
        </q-btn>
      </div>
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
import { useSettingsStore } from 'src/stores/settings-store'
import ChapterContent from './ChapterContent.vue'
import * as tags from 'src/tags'

const store = useSettingsStore()

function adjustFont(amount: number) {
  store.persist.appearance.fontSize = (store.persist.appearance.fontSize ?? 16) + amount
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
