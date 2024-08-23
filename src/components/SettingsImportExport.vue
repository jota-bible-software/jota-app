<template>
  <SettingsPanel title="Import / Export">

    <!-- Import / Export -->
    <div class="col q-gutter-sm">
      <div class="row ">
        <q-file class="col-auto" v-model="file" label="Wybierz plik ustawień" filled autosize>
          <template v-slot:prepend>
            <q-icon name="icon-mat-file_open" />
          </template>
        </q-file>
        <q-btn class="col-auto" @click="importSettings">
          <q-icon left name="icon-mat-upload" />
          <div>Importuj plik ustawień</div>
        </q-btn>
      </div>
      <div class="row">
        <q-btn class="col-auto" @click="exportSettings">
          <q-icon left name="icon-mat-download" />
          <div>Eksportuj ustawienia do pliku</div>
        </q-btn>
      </div>
      <div class="row">
        <q-btn class="col-auto" @click="resetSettings">
          <q-icon left name="icon-mat-undo" />
          <div>Resetuj ustawienia</div>
        </q-btn>

      </div>
    </div>

  </SettingsPanel>
</template>

<script setup lang="ts">
// import LanguageSelector from './LanguageSelector.vue'
import SettingsPanel from './SettingsPanel.vue'
import { useSettingsStore } from 'src/stores/settings-store'
import { Dialog, exportFile } from 'quasar'

const store = useSettingsStore()

const exportFileName = 'jota-app-settings.json'
const file = ref(null)


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
      store.persist = { ...store.persist, ...JSON.parse(e.target?.result as string) } // Would be good to merge recursively
      Dialog.create({ message: 'Ustawienia zostały zaimportowane' })
    }
    reader.readAsText(file.value)
  }
}

function resetSettings() {
  // Display confirmation dialog
  Dialog.create({
    title: 'Reset ustawień',
    message: 'Czy na pewno chcesz zresetować ustawienia?',
    ok: 'Tak',
    cancel: {
      label: 'Nie',
      color: 'primary'
    }
  }).onOk(() => {
    store.reset()
    Dialog.create({ message: 'Ustawienia zostały zresetowane' })
  })
}

</script>

<style lang="scss" scoped>
.sample {
  height: 200px;
  overflow: auto;
}
</style>
