<template>
  <SettingsPanel title="Wygląd">
    <ScreenModeToggle />

    <!-- Font size -->
    <div class="col">
      <div class="row items-center q-gutter-sm">
        <div>Rozmiar tekstu</div>
        <q-input v-model="store.persist.appearance.fontSize" class="row small" type="number" />
        <q-btn icon="icon-mat-text_increase" @click="adjustFont(1)" />
        <q-btn icon="icon-mat-text_decrease" @click="adjustFont(-1)" size="sm" />
      </div>
    </div>


    <div>Przykład tekstu Biblii</div>
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
