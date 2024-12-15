<template>
  <SettingsPanel :title="$t('settingsCopyTemplates.title')" locale>
    <div class="row items-center q-mb-md">
      <div class="q-mr-md">{{ $t('settingsCopyTemplates.defaultTemplate') }}</div>
      <q-select v-model="settings.focusedLocalized.defaultCopyTemplate" :options="items" option-label="name"
        option-value="name" emit-value :data-tag="tags.settingsCopyTemplatesDefault" />
    </div>

    <q-list bordered separator>
      <q-item v-for="item in items" :key="item.name" class="q-px-none1" :clickable="selected !== item.name"
        @click="edit(item)">
        <q-item-section>
          <div v-if="selected !== item.name">
            <div class="row items-center">
              <div class="col" :data-tag="tags.settingsCopyTemplatesItemName">
                {{ item.name }}
              </div>
              <div class="col-auto">
                <q-btn outline color="primary" icon="edit" @click="edit(item)"
                  :data-tag="tags.settingsCopyTemplatesEdit" />
              </div>
            </div>

            <div class="row q-my-sm">
              <q-item-label caption>
                {{ $t('settingsCopyTemplates.formatTemplate') }}: {{ item.formatTemplate }},
                {{ $t('settingsCopyTemplates.bookNaming') }}: {{ item.bookNaming }}
              </q-item-label>

              <q-item-label>
                <pre v-html="formatItem(item)" class="text-caption default-font-family"
                  style=" white-space:pre-wrap"></pre>
              </q-item-label>
            </div>
          </div>

          <div v-else>
            <q-form ref="editForm" @submit="save" class="col q-gutter-sm">
              <q-input v-model="editedItem.name" :label="$t('settingsCopyTemplates.templateName')"
                :rules="nameValidationRules" :data-tag="tags.settingsCopyTemplatesName" />

              <div>
                <div class="row q-gutter-sm">
                  <q-select v-model="editedItem.formatTemplate" :options="formatTemplates" option-label="name"
                    option-value="name" map-options emit-value use-input class="col"
                    :label="$t('settingsCopyTemplates.formatTemplate')" :rules="formatValidationRules"
                    :data-tag="tags.settingsCopyTemplatesFormat">
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label>{{ scope.opt.name }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select v-model="editedItem.bookNaming" :options="settings.getBookNamings(settings.focusedLocale)"
                    option-label="name" option-value="name" map-options emit-value use-input class="col"
                    :label="$t('settingsCopyTemplates.bookNaming')" :rules="bookNamingValidationRules"
                    :data-tag="tags.settingsCopyTemplatesBookNaming">
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label>{{ scope.opt.name }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>

              <LabelRow>
                <div>{{ $t('settingsFormatTemplates.example') }}</div>
                <pre v-html="formatted" class="default-font-family border q-py-sm q-px-md q-mt-sm"
                  style="background-color: var(--q-background-10); white-space:pre-wrap"></pre>
              </LabelRow>

              <div class="q-my-md">
                <div class="row q-gutter-sm">
                  <q-btn color="primary" type="submit" :data-tag="tags.settingsCopyTemplatesSave">
                    <q-icon left name="save" />
                    <div>{{ $t('settingsCopyTemplates.saveButton') }}</div>
                  </q-btn>

                  <q-btn outline color="primary" @click="reset" :data-tag="tags.settingsCopyTemplatesCancel">
                    <q-icon left name="undo" />
                    <div>{{ $t('settingsCopyTemplates.cancelButton') }}</div>
                  </q-btn>

                  <q-btn outline color="primary" @click="setAsDefault" :data-tag="tags.settingsCopyTemplatesUseButton">
                    <q-icon left name="desktop_windows" />
                    <div>{{ $t('settingsCopyTemplates.setAsDefault') }}</div>
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
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div>
      <q-form ref="addForm" @submit="add" class="col q-mt-xl q-gutter-sm">
        <span>{{ $t('settingsCopyTemplates.addNewTemplate') }}</span>
        <q-input v-model="newItem.name" :label="$t('settingsCopyTemplates.templateName')" :rules="nameValidationRules"
          :data-tag="tags.settingsCopyTemplatesAddName" />

        <div>
          <div class="row q-gutter-sm">
            <q-select v-model="newItem.formatTemplate" :options="formatTemplates" option-label="name"
              option-value="name" map-options emit-value use-input class="col"
              :label="$t('settingsCopyTemplates.formatTemplate')" :rules="formatValidationRules"
              :data-tag="tags.settingsCopyTemplatesAddFormat">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select v-model="newItem.bookNaming" :options="settings.getBookNamings(settings.focusedLocale)"
              option-label="name" option-value="name" map-options emit-value use-input class="col"
              :label="$t('settingsCopyTemplates.bookNaming')" :rules="bookNamingValidationRules"
              :data-tag="tags.settingsCopyTemplatesAddBookNaming">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>

        <LabelRow>
          <div>{{ $t('settingsFormatTemplates.example') }}</div>
          <pre v-html="formatItem(newItem)" class="default-font-family border q-py-sm q-px-md q-mt-sm"
            style="background-color: var(--q-background-10); white-space:pre-wrap"></pre>
        </LabelRow>

        <div class="q-mt-md">
          <div class="row q-gutter-sm">
            <q-btn color="accent" type="submit" :data-tag="tags.settingsCopyTemplatesAdd">
              <q-icon left name="add" />
              <div>{{ $t('settingsCopyTemplates.addButton') }}</div>
            </q-btn>
          </div>
        </div>
      </q-form>
    </div>
  </SettingsPanel>
</template>

<script setup lang="ts">
import { CopyTemplateData } from 'src/types'
import { useSettingsStore } from 'stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import LabelRow from './LabelRow.vue'
import { Dialog } from 'quasar'
import { nameSorter } from 'src/util'
import { useI18n } from 'vue-i18n'
import * as tags from 'src/tags'
import { formatSample } from 'src/logic/format'

const { t } = useI18n()

const settings = useSettingsStore()
const formatTemplates = settings.persist.formatTemplates

const items = computed(() => settings.focusedLocalized.copyTemplates)
const names = computed(() => items.value.map(it => it.name))
const selected = ref('')

const emptyItem: CopyTemplateData = {
  name: '',
  bookNaming: '',
  formatTemplate: '',
}

const addForm = ref()
const editForm = ref()

const newItem = ref<CopyTemplateData>({
  name: '',
  formatTemplate: settings.persist.formatTemplates[0]?.name ?? '',
  bookNaming: settings.focusedLocalized.bookNamings[0]?.name ?? '' as string,
})

watch(() => settings.focusedLocalized, (v) => {
  newItem.value.bookNaming = v.bookNamings[0]?.name ?? ''
})

const editedItem = ref<CopyTemplateData>({ ...emptyItem })

function edit(item: CopyTemplateData) {
  selected.value = item.name
  editedItem.value = { ...item }
}

function setAsDefault() {
  settings.focusedLocalized.defaultCopyTemplate = editedItem.value.name
}

const formatted = computed(() => {
  return formatItem(editedItem.value)
})

function formatItem(item: CopyTemplateData) {
  const formatTemplate = settings.persist.formatTemplates.find(it => it.name === item.formatTemplate)
  if (!formatTemplate) return ''
  const bookNames = settings.focusedLocalized.bookNamings.find(it => it.name === item.bookNaming)?.books || []
  return formatSample(formatTemplate, bookNames)
}

function add() {
  const theSame = items.value.find(it => it.formatTemplate === newItem.value.formatTemplate && it.bookNaming === newItem.value.bookNaming)
  if (theSame) {
    Dialog.create({
      title: t('settingsCopyTemplates.error'),
      message: `${t('settingsCopyTemplates.theSameExists')}: "${theSame.name}"`,
      ok: t('settingsCopyTemplates.yes'),
    })
  } else {
    items.value.push(newItem.value)
    items.value.sort(nameSorter(settings.persist.appearance.locale))

    reset()
    nextTick(() => {
      addForm.value.resetValidation()
    })
  }
}

function save() {
  const index = items.value.findIndex(it => it.name === selected.value)
  if (index !== -1) {
    items.value[index] = { ...editedItem.value }
  }

  if (selected.value === settings.focusedLocalized.defaultCopyTemplate) {
    settings.focusedLocalized.defaultCopyTemplate = editedItem.value.name
  }

  reset()
}

function reset() {
  selected.value = ''
  editedItem.value = { ...emptyItem }
}

const removeTooltip = computed(() => {
  return selected.value === settings.focusedLocalized.defaultCopyTemplate
    ? t('settingsCopyTemplates.defaultTemplateTooltip')
    : ''
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

const nameValidationRules = [
  (val: string) => !!val || t('settingsCopyTemplates.nameRequired'),
  (val: string) => val === selected.value || !names.value.includes(val) || t('settingsCopyTemplates.nameExists')
]

const formatValidationRules = [
  (val: string) => !!val || t('settingsCopyTemplates.formatRequired'),
]

const bookNamingValidationRules = [
  (val: string) => !!val || t('settingsCopyTemplates.bookNamingRequired'),
]
</script>
