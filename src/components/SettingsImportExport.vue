<template>
  <SettingsPanel :title="$t('settingsImportExport.title')">

    <!-- Display last uploaded file name -->
    <div v-if="store.persist.lastUploadedFile" class="q-mb-md">
      {{ $t('settingsImportExport.lastImportedFile') }} <b>{{ store.persist.lastUploadedFile }}</b>
    </div>

    <div>
      <div class="row  q-gutter-sm">
        <q-file ref="fileInput" dense outlined autosize class="col-auto" v-model="file" :label="$t('settingsImportExport.selectSettingsFile')">
          <template v-slot:prepend>
            <q-icon name="icon-mat-file_open" />
          </template>
        </q-file>
        <q-btn class="col-auto" @click="importSettings">
          <q-icon left name="icon-mat-upload" />
          <div>{{ $t('settingsImportExport.importButton') }}</div>
        </q-btn>
      </div>
    </div>

    <div class="row">
      <q-btn class="col-auto" @click="exportSettings">
        <q-icon left name="icon-mat-download" />
        <div>{{ $t('settingsImportExport.exportButton') }}</div>
      </q-btn>
    </div>

    <div class="row">
      <q-btn class="col-auto" @click="resetSettings">
        <q-icon left name="icon-mat-undo" />
        <div>{{ $t('settingsImportExport.resetSettings') }}</div>
      </q-btn>
    </div>

  </SettingsPanel>
</template>

<script setup lang="ts">
import SettingsPanel from './SettingsPanel.vue'
import { useSettingsStore } from 'src/stores/settings-store'
import { Dialog, exportFile, Notify } from 'quasar'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


const store = useSettingsStore()

const exportFileName = 'jota-app-settings.json'
const file = ref<File | null>(null)
const fileInput = ref<HTMLElement | null>(null) // Update the ref type

function exportSettings() {
  const status = exportFile(exportFileName, JSON.stringify(store.persist))

  if (status === true) {
    Dialog.create({ message: t('settingsImportExport.settingsSaved', { filename: exportFileName }) })
  }
  else {
    Notify.create({
      message: t('settingsImportExport.settingsNotSaved'),
      type: 'negative'
    })
  }
}

function importSettings() {
  if (file.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      store.persist = { ...store.persist, ...JSON.parse(e.target?.result as string) }
      store.persist.lastUploadedFile = file.value?.name
      Notify.create({ message: t('settingsImportExport.importSuccess') })
    }
    reader.readAsText(file.value)
  } else {
    Dialog.create({ message: t('settingsImportExport.selectFileFirst') })
    fileInput.value?.focus()
  }
}

function resetSettings() {
  Dialog.create({
    title: t('settingsImportExport.resetConfirmTitle'),
    message: t('settingsImportExport.resetConfirmMessage'),
    ok: t('settingsImportExport.yes'),
    cancel: t('settingsImportExport.no'),
  }).onOk(() => {
    store.reset()
    Notify.create({ message: t('settingsImportExport.resetSuccess'), type: 'positive' })
  })
}

</script>

<style lang="scss" scoped>
.sample {
  height: 200px;
  overflow: auto;
}
</style>
