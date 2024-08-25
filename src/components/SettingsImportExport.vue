<template>
  <SettingsPanel title="Import / Export">


    <!-- Display last uploaded file name -->
    <div v-if="store.persist.lastUploadedFile" class="q-mb-md">
      Ostatnio zaimportowany plik ustawień: <b>{{ store.persist.lastUploadedFile }}</b>
    </div>

    <div>
      <div class="row  q-gutter-sm">
        <q-file ref="fileInput" class="col-auto" v-model="file" label="Wybierz plik ustawień" filled autosize>
          <template v-slot:prepend>
            <q-icon name="icon-mat-file_open" />
          </template>
        </q-file>
        <q-btn class="col-auto" @click="importSettings">
          <q-icon left name="icon-mat-upload" />
          <div>Importuj plik ustawień</div>
        </q-btn>
      </div>
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


  </SettingsPanel>
</template>

<script setup lang="ts">
import SettingsPanel from './SettingsPanel.vue'
import { useSettingsStore } from 'src/stores/settings-store'
import { Dialog, exportFile, Notify } from 'quasar'
import { ref } from 'vue'


const store = useSettingsStore()

const exportFileName = 'jota-app-settings.json'
const file = ref<File | null>(null)
const fileInput = ref<HTMLElement | null>(null) // Update the ref type

function exportSettings() {
  const status = exportFile(exportFileName, JSON.stringify(store.persist))

  if (status === true) {
    Dialog.create({ message: `Ustawienia zostały zapisane w pliku "${exportFileName}" w folderze pobierania przeglądarki` })
  }
  else {
    // browser denied it
    Notify.create({
      message: 'Ustawienia nie zostały zapisane ponieważ przeglądarka blokuje tę operację',
      type: 'negative'
    })
  }
}

function importSettings() {
  if (file.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      store.persist = { ...store.persist, ...JSON.parse(e.target?.result as string) } // Would be good to merge recursively
      // Store the last uploaded file name
      store.persist.lastUploadedFile = file.value!.name
      Notify.create({ message: 'Ustawienia zostały zaimportowane' })
    }
    reader.readAsText(file.value)
  } else {
    Dialog.create({ message: 'Wybierze najpierw plik ustawień w polu obok' })
    fileInput.value?.focus()
    // (fileInput.value?.querySelector('input') as HTMLInputElement).click()
  }
}

function resetSettings() {
  Dialog.create({
    title: 'Reset ustawień',
    message: 'Czy na pewno chcesz zresetować ustawienia?',
    ok: 'Tak',
    cancel: 'Nie',
  }).onOk(() => {
    store.reset()
    Notify.create({ message: 'Ustawienia zostały zresetowane', type: 'positive' })
  })
}

</script>

<style lang="scss" scoped>
.sample {
  height: 200px;
  overflow: auto;
}
</style>
