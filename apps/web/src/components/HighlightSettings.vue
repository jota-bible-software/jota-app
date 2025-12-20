<template>
  <SettingsPanel :title="$t('settingsPage.highlights')">
    <div class="q-gutter-md">
      <div class="text-subtitle1">{{ $t('highlight.colorManager.title') }}</div>

      <q-list>
        <draggable v-model="localColors" item-key="id" handle=".drag-handle" @end="onReorder">
          <template #item="{ element: color }">
            <q-item class="color-item">
              <q-item-section avatar style="min-width: 32px">
                <q-icon name="drag_indicator" class="drag-handle cursor-move" />
              </q-item-section>

              <q-item-section avatar style="min-width: 40px">
                <div class="color-swatch-large" :style="{ backgroundColor: color.hex }" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ color.name }}</q-item-label>
                <q-item-label caption>{{ color.hex }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn flat dense round icon="edit" size="sm" @click="editColor(color)">
                    <q-tooltip>{{ $t('highlight.colorManager.editColor') }}</q-tooltip>
                  </q-btn>
                  <q-btn flat dense round icon="delete" size="sm" :disable="highlightStore.sortedColors.length <= 1"
                    @click="confirmRemoveColor(color)">
                    <q-tooltip>
                      {{ highlightStore.sortedColors.length <= 1
                        ? $t('highlight.colorManager.cannotRemoveLast')
                        : $t('highlight.colorManager.removeColor')
                      }}
                    </q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </template>
        </draggable>
      </q-list>

      <div class="row q-mt-md">
        <q-btn color="accent" @click="addNewColor">
          <q-icon left name="add" />
          <div>{{ $t('highlight.colorManager.addColor') }}</div>
        </q-btn>
      </div>

      <q-separator class="q-my-md" />

      <div class="text-subtitle1 q-mb-md">{{ $t('settingsImportExport.title') }}</div>

      <div v-if="lastImportedFile" class="q-mb-md">
        {{ $t('settingsImportExport.lastImportedFile') }} <b>{{ lastImportedFile }}</b>
      </div>

      <div>
        <div class="row q-gutter-sm">
          <q-file ref="fileInput" dense outlined autosize class="col-auto" v-model="file" :label="$t('highlight.importExport.selectFile')">
            <template v-slot:prepend>
              <q-icon name="icon-mat-file_open" />
            </template>
          </q-file>
          <q-btn class="col-auto" @click="importHighlights">
            <q-icon left name="icon-mat-upload" />
            <div>{{ $t('settingsImportExport.importButton') }}</div>
          </q-btn>
        </div>
      </div>

      <div class="row">
        <q-btn class="col-auto" @click="exportHighlights">
          <q-icon left name="icon-mat-download" />
          <div>{{ $t('settingsImportExport.exportButton') }}</div>
        </q-btn>
      </div>

      <div class="row">
        <q-btn class="col-auto" @click="resetHighlights">
          <q-icon left name="icon-mat-undo" />
          <div>{{ $t('highlight.importExport.resetHighlights') }}</div>
        </q-btn>
      </div>

      <div>
        <div class="row">Storage Usage: {{ storageInfo.totalSizeMB }} MB ({{ storageInfo.usagePercent }}%)</div>
        <div class="row">Highlights: {{ storageInfo.highlightCount }} ({{ storageInfo.highlightSizeKB }} KB)</div>
      </div>
    </div>
  </SettingsPanel>

  <!-- Add/Edit Color Dialog -->
  <q-dialog v-model="showColorDialog">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">
          {{ editingColor ? $t('highlight.colorManager.editColor') : $t('highlight.colorManager.addColor') }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model="colorForm.name" :label="$t('highlight.colorManager.colorName')" outlined dense
          :rules="[val => !!val || $t('highlight.colorManager.nameRequired')]" class="q-mb-md" />

        <div class="row q-gutter-md items-center">
          <q-input v-model="colorForm.hex" :label="$t('highlight.colorManager.colorHex')" outlined dense :rules="[validateHex]" class="col" />

          <div class="column items-center">
            <div class="text-caption q-mb-xs">{{ $t('highlight.colorManager.colorPreview') }}</div>
            <div class="color-preview" :style="{ backgroundColor: colorForm.hex }" />
          </div>
        </div>

        <div class="q-mt-md">
          <div class="text-caption q-mb-sm">{{ $t('highlight.colorManager.pickColor') }}</div>
          <q-color v-model="colorForm.hex" no-header no-footer default-view="palette" />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('settingsCopyTemplates.cancelButton')" @click="closeColorDialog" />
        <q-btn flat color="primary" :label="$t('settingsCopyTemplates.saveButton')" @click="saveColor" :disable="!isColorFormValid" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Remove Color Confirmation Dialog -->
  <q-dialog v-model="showRemoveDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ $t('highlight.colorManager.removeConfirm') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p>
          {{ $t('highlight.colorManager.removeConfirmMessage', {
            count: getColorUsageCount(colorToRemove?.id || '')
          }) }}
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('settingsCopyTemplates.no')" @click="showRemoveDialog = false" />
        <q-btn flat color="negative" :label="$t('settingsCopyTemplates.yes')" @click="removeColor" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useHighlightStore } from 'src/stores/highlight-store'
import { HighlightColor } from 'src/types'
import draggable from 'vuedraggable'
import SettingsPanel from './SettingsPanel.vue'
import { Dialog, exportFile, Notify } from 'quasar'
import { useI18n } from 'vue-i18n'

const highlightStore = useHighlightStore()
const { t } = useI18n()

const localColors = ref<HighlightColor[]>([...highlightStore.sortedColors])
const showColorDialog = ref(false)
const showRemoveDialog = ref(false)
const editingColor = ref<HighlightColor | null>(null)
const colorToRemove = ref<HighlightColor | null>(null)
const file = ref<File | null>(null)
const fileInput = ref<HTMLElement | null>(null)
const lastImportedFile = ref<string>('')
const storageInfo = computed(() => highlightStore.getStorageInfo())

const colorForm = ref({
  name: '',
  hex: '#ffeb3b'
})

// Watch for changes in store colors to keep local colors in sync
watch(() => highlightStore.sortedColors, (newColors) => {
  localColors.value = [...newColors]
}, { deep: true })

const isColorFormValid = computed(() => {
  return colorForm.value.name.trim() !== '' && validateHex(colorForm.value.hex) === true
})

function validateHex(value: string): boolean | string {
  const hexRegex = /^#[0-9A-Fa-f]{6}$/
  return hexRegex.test(value) || 'Invalid color code'
}

function onReorder(): void {
  highlightStore.reorderColors(localColors.value)
}

function addNewColor(): void {
  editingColor.value = null
  colorForm.value = {
    name: '',
    hex: '#ffeb3b'
  }
  showColorDialog.value = true
}

function editColor(color: HighlightColor): void {
  editingColor.value = color
  colorForm.value = {
    name: color.name,
    hex: color.hex
  }
  showColorDialog.value = true
}

function saveColor(): void {
  if (!isColorFormValid.value) return

  if (editingColor.value) {
    highlightStore.updateColor(editingColor.value.id, {
      name: colorForm.value.name.trim(),
      hex: colorForm.value.hex
    })

    const index = localColors.value.findIndex(c => c.id === editingColor.value?.id)
    if (index !== -1) {
      localColors.value[index] = {
        ...localColors.value[index],
        name: colorForm.value.name.trim(),
        hex: colorForm.value.hex
      }
    }
  } else {
    highlightStore.addColor(colorForm.value.name.trim(), colorForm.value.hex)
    localColors.value = [...highlightStore.sortedColors]
  }

  closeColorDialog()
}

function closeColorDialog(): void {
  showColorDialog.value = false
  editingColor.value = null
}

function confirmRemoveColor(color: HighlightColor): void {
  colorToRemove.value = color
  showRemoveDialog.value = true
}

function removeColor(): void {
  if (!colorToRemove.value) return

  highlightStore.removeColor(colorToRemove.value.id)
  localColors.value = localColors.value.filter(c => c.id !== colorToRemove.value?.id)

  showRemoveDialog.value = false
  colorToRemove.value = null
}

function getColorUsageCount(colorId: string): number {
  return highlightStore.highlightStats.get(colorId) || 0
}

function exportHighlights(): void {
  const exportFileName = 'jota-app-highlights.json'
  const data = highlightStore.exportHighlights()
  const status = exportFile(exportFileName, data)

  if (status === true) {
    Dialog.create({ message: t('highlight.importExport.exportSuccess', { filename: exportFileName }) })
  } else {
    Notify.create({
      message: t('highlight.importExport.exportFailed'),
      type: 'negative'
    })
  }
}

function importHighlights(): void {
  if (file.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string
        highlightStore.importHighlights(data)
        lastImportedFile.value = file.value?.name || ''
        localColors.value = [...highlightStore.sortedColors]
        Notify.create({ message: t('highlight.importExport.importSuccess'), type: 'positive' })
      } catch (error) {
        Notify.create({
          message: t('highlight.importExport.importFailed'),
          type: 'negative'
        })
      }
    }
    reader.readAsText(file.value)
  } else {
    Dialog.create({ message: t('settingsImportExport.selectFileFirst') })
    fileInput.value?.focus()
  }
}

function resetHighlights(): void {
  Dialog.create({
    title: t('highlight.importExport.resetConfirmTitle'),
    message: t('highlight.importExport.resetConfirmMessage'),
    ok: t('settingsImportExport.yes'),
    cancel: t('settingsImportExport.no'),
  }).onOk(() => {
    highlightStore.resetToDefaults()
    localColors.value = [...highlightStore.sortedColors]
    Notify.create({ message: t('highlight.importExport.resetSuccess'), type: 'positive' })
  })
}
</script>

<style lang="scss" scoped>
.color-item {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  margin-bottom: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  body.body--dark & {
    border-color: rgba(255, 255, 255, 0.12);

    &:hover {
      background-color: rgba(255, 255, 255, 0.02);
    }
  }
}

.drag-handle {
  cursor: move;
  opacity: 0.6;

  &:hover {
    opacity: 0.8;
  }
}

.color-swatch-large {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.color-preview {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
</style>
