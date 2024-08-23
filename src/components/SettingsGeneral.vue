<template>
  <SettingsPanel title="Ogólne">
    <!-- <div class="row items-center">
      <div class="q-mr-md">Domyślny język</div>
      <LanguageSelector v-model="store.persist.defaultLang" />
    </div> -->
    <ScreenModeToggle />

    <!-- Import / Export -->
    <div class="col">
      <div class="row q-gutter-sm">
        <q-input v-model="settingsJson" label="Settings json" />
        <q-btn class="row" @click="importSettings">Importuj ustawienia</q-btn>
        <q-btn class="row" @click="exportSettings">Eksportuj ustawienia</q-btn>

      </div>
    </div>

    <div class="col">
      <div class="row q-gutter-sm">
        <q-input v-model="store.persist.fontSize" class="row" />
        <q-btn icon="icon-mat-text_increase" @click="adjustFont(1)" />
        <q-btn icon="icon-mat-text_decrease" @click="adjustFont(-1)" />
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
import { Dialog, exportFile } from 'quasar'
import ChapterContent from './ChapterContent.vue'

const store = useSettingsStore()

const exportFileName = 'jota-app-settings.json'
const settingsJson = ref('')


function adjustFont(amount: number) {
  store.persist.fontSize = (store.persist.fontSize ?? 16) + amount
}

function exportSettings() {
  const status = exportFile(exportFileName, JSON.stringify(store.persist))

  if (status === true) {
    Dialog.create({ message: `Ustawienia zostały zapisane w pliku "${exportFileName}" w folderze pobierania przeglądarki` })
  }
  else {
    // browser denied it
    Dialog.create({ title: 'Błąd', message: 'Ustawienia nie zostały zapisane ponieważ przeglądarka blokuje tę operację' })
  }
}

function importSettings() {
  store.persist = JSON.parse(settingsJson.value)
  settingsJson.value = ''
  Dialog.create({ message: 'Ustawienia zostały zaimportowane' })
}

</script>

<style lang="scss" scoped>
.sample {
  height: 200px;
  overflow: auto;
}
</style>
