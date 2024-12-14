<template>
  <SettingsPanel v-if="!selected && !isNewItem" :title="$t('settingsCopyTemplates.title')" locale>

    <LabelRow :label="$t('settingsCopyTemplates.defaultTemplate')">
      <q-select v-model="settings.focusedLocalized.defaultCopyTemplate" :options="items" option-label="name"
        option-value="name" emit-value :data-tag="tags.settingsCopyTemplatesDefault" />
    </LabelRow>

    <div>
      <div class="row q-gutter-md">
        <q-list bordered separator class="col-auto" style="min-width: 350px; max-width: 650px">
          <q-item v-for="item in items" :key="item.name" class="q-px-none1" clickable @click="edit(item)">
            <q-item-section>
              <q-item-label :data-tag="tags.settingsCopyTemplatesItemName">{{ item.name }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon color="primary" name="chevron_right" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="row q-mt-md">
        <q-btn color="accent" @click="add" :data-tag="tags.settingsCopyTemplatesAdd">
          <q-icon left name="add" />
          <div>{{ $t('settingsCopyTemplates.addButton') }}</div>
        </q-btn>
      </div>
    </div>

  </SettingsPanel>

  <SettingsPanel v-else :title="$t('settingsCopyTemplates.editTemplate')" @back="reset" style="max-width: 650px">
    <q-form ref="myForm" class="col q-gutter-md" @submit="save" @reset="reset">
      <LabelRow :label="$t('settingsCopyTemplates.templateName')" lifted>
        <q-input v-model="editedItem.name" class="col" :rules="nameValidationRules"
          :data-tag="tags.settingsCopyTemplatesName" />
      </LabelRow>

      <LabelRow>
        <div>
          {{ $t('settingsCopyTemplates.templateDescription') }}
        </div>
      </LabelRow>

      <LabelRow>
        <q-select v-model="editedItem.formatTemplate" :options="formatTemplates" option-label="name" option-value="name"
          map-options emit-value use-input class="col" :rules="formatValidationRules"
          :data-tag="tags.settingsCopyTemplatesFormat">
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.name }}</q-item-label>
                <!-- <q-item-label caption>{{ scope.opt.separatorChar }}</q-item-label> -->
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select v-model="editedItem.bookNaming" :options="settings.getBookNamings(settings.focusedLocale)"
          option-label="name" option-value="name" map-options emit-value use-input class="col"
          :rules="bookNamingValidationRules" :data-tag="tags.settingsCopyTemplatesBookNaming">
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.name }}</q-item-label>
                <!-- <q-item-label caption>{{ scope.opt.separatorChar }}</q-item-label> -->
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </LabelRow>

      <LabelRow>
        <div>{{ $t('settingsFormatTemplates.example') }}</div>
        <pre v-html="formatted" class="default-font-family border q-py-sm q-px-md q-mt-sm"
          style="background-color: var(--q-background-10); white-space:pre-wrap"></pre>
      </LabelRow>

      <!-- Button bar -->
      <div class="q-my-lg">
        <div class="row q-gutter-sm">

          <!-- Save button -->
          <q-btn type="submit" color="primary" :data-tag="tags.settingsCopyTemplatesSave">
            <q-icon left name="icon-mat-check" />
            <div>{{ $t('settingsCopyTemplates.saveButton') }}</div>
          </q-btn>

          <!-- Cancel button -->
          <q-btn outline color="primary" @click="reset" :data-tag="tags.settingsCopyTemplatesCancel">
            <q-icon left name="icon-mat-undo" />
            <div>{{ $t('settingsCopyTemplates.cancelButton') }}</div>
          </q-btn>

          <q-space />

          <q-btn outline color="red-4" @click="remove" :disabled="!!removeTooltip"
            :data-tag="tags.settingsCopyTemplatesRemove">
            <q-icon left name="delete" />
            <div>{{ $t('settingsCopyTemplates.removeButton') }}</div>
            <q-tooltip v-if="!!removeTooltip">
              {{ removeTooltip }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-form>
  </SettingsPanel>
</template>


<script setup lang="ts">
import { CopyTemplateData } from 'src/types'
import { useSettingsStore } from 'stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import LabelRow from './LabelRow.vue'
import { Dialog, QForm } from 'quasar'
import { nameSorter } from 'src/util'
import { useI18n } from 'vue-i18n'
import * as tags from 'src/tags'
import { formatSample } from 'src/logic/format'
const { t } = useI18n()

const settings = useSettingsStore()
const formatTemplates = settings.persist.formatTemplates
const items: Ref<CopyTemplateData[]> = computed(() => settings.focusedLocalized.copyTemplates)
const names = computed(() => items.value.map(it => it.name))
const myForm: Ref<QForm | null> = ref(null)

const emptyItem: CopyTemplateData = {
  name: '',
  bookNaming: '',
  formatTemplate: '',
}

function cloneItem(item: CopyTemplateData) {
  return structuredClone(toRaw(item))
}

const selected = ref('')
const selectedItem = ref({ ...emptyItem })
const isNewItem = ref(false)

const editedItem = ref<CopyTemplateData>({ ...emptyItem })
function edit(item: CopyTemplateData) {
  selected.value = item.name
  selectedItem.value = item
  editedItem.value = cloneItem(item)
}

const nameValidationRules = [
  (val: string) => !!val || t('settingsCopyTemplates.nameRequired'),
  (val: string) => val === selected.value || !names.value.includes(val) || t('settingsCopyTemplates.nameExists')
]

const formatValidationRules = [
  (val: string) => !!val || t('settingsCopyTemplates.nameRequired'),
]

const bookNamingValidationRules = [
  (val: string) => !!val || t('settingsCopyTemplates.nameRequired'),
]

const formatted = computed(() => {
  const formatTemplate = settings.persist.formatTemplates.find(it => it.name === editedItem.value.formatTemplate)
  if (!formatTemplate) return ''
  const bookNames = settings.focusedLocalized.bookNamings.find(it => it.name === editedItem.value.bookNaming)?.books || []
  return formatSample(formatTemplate, bookNames)
})

function save() {
  if (isNewItem.value) {
    items.value.push(editedItem.value)
    items.value.sort(nameSorter(settings.persist.appearance.locale))

    editedItem.value = { ...emptyItem } // Reset the edited item
  } else {
    Object.assign(selectedItem.value, cloneItem(editedItem.value))
  }
  if (selected.value === settings.focusedLocalized.defaultCopyTemplate) {
    settings.focusedLocalized.defaultCopyTemplate = editedItem.value.name
  }
  reset()
}

const removeTooltip = computed(() => {
  return selected.value === settings.focusedLocalized.defaultCopyTemplate ? t('settingsCopyTemplates.defaultTemplateTooltip') : ''
})

function remove() {
  Dialog.create({
    title: t('settingsCopyTemplates.removeTitle'),
    message: `${t('settingsCopyTemplates.removeConfirm')} "${selected.value}"?`,
    ok: t('settingsCopyTemplates.yes'),
    cancel: t('settingsCopyTemplates.no'),
  }).onOk(() => {
    const i = items.value.findIndex(it => it.name === selected.value)
    if (i !== -1) {
      items.value.splice(i, 1)
    }
    reset()
  })
}

function reset() {
  selected.value = ''
  isNewItem.value = false
  editedItem.value = { ...emptyItem }
  myForm.value?.resetValidation()
}

function add() {
  isNewItem.value = true
  if (settings.persist.formatTemplates[0]) {
    editedItem.value.formatTemplate = settings.persist.formatTemplates[0].name
  }
  if (settings.focusedLocalized.bookNamings[0]) {
    editedItem.value.bookNaming = settings.focusedLocalized.bookNamings[0].name
  }
}

</script>
<style lang="scss">
.chars-around-label {
  min-width: 14em;
  flex-grow: 1;
}
</style>
