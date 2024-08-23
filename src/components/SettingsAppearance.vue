<template>
  <SettingsPanel title="Wygląd">
    <!-- <div class="row items-center">
      <div class="q-mr-md">Domyślny język</div>
      <LanguageSelector v-model="store.persist.defaultLang" />
    </div> -->
    <ScreenModeToggle />


    <!-- Test size -->
    <div class="col">
      <div class="row q-gutter-sm">
        <q-input v-model="store.persist.fontSize" label="Rozmiar tekstu" class="row" type="number" />
        <q-btn icon="icon-mat-text_increase" @click="adjustFont(1)" />
        <q-btn icon="icon-mat-text_decrease" @click="adjustFont(-1)" size="sm" />
      </div>
    </div>
    <div>Przykład tekstu Biblii:</div>
    <div class="sample border">
      <ChapterContent />
    </div>

  </SettingsPanel>
</template>

<script setup lang="ts">
// import LanguageSelector from './LanguageSelector.vue'
import SettingsPanel from './SettingsPanel.vue'
import ScreenModeToggle from './ScreenModeToggle.vue'
import { useSettingsStore } from 'src/stores/settings-store'
import ChapterContent from './ChapterContent.vue'

const store = useSettingsStore()

function adjustFont(amount: number) {
  store.persist.fontSize = (store.persist.fontSize ?? 16) + amount
}
</script>

<style lang="scss" scoped>
.sample {
  height: 200px;
  overflow: auto;
}
</style>
