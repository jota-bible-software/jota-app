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
        <q-file class="col" v-model="file" label="Wybierz plik ustawień" filled autosize />
        <q-btn class="col-auto" @click="importSettings">
          <q-icon left name="icon-mat-upload" />
          <div>Importuj plik ustawień</div>
        </q-btn>
        <q-btn class="col-auto" @click="exportSettings">
          <q-icon left name="icon-mat-download" />
          <div>Eksportuj ustawienia do pliku</div>
        </q-btn>

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
const file = ref(null)

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
  if (file.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      store.persist = JSON.parse(e.target?.result as string)
      Dialog.create({ message: 'Ustawienia zostały zaimportowane' })
    }
    reader.readAsText(file.value)
  }
}

</script>

<style lang="scss" scoped>
.sample {
  height: 200px;
  overflow: auto;
}
</style>
