<template>
  <SettingsPanel v-if="!selected && !isNewItem" :title="$t('settingsCopyTemplates.title')">

    <LabelRow :label="$t('settingsCopyTemplates.defaultTemplate')">
      <q-select v-model="settings.persist.defaultCopyTemplate" :options="items" option-label="name" />
    </LabelRow>

    <div>
      <div class="row  q-gutter-md">
        <q-list bordered separator class="col-auto" style="min-width: 350px; max-width: 650px">
          <q-item v-for="item in items" :key="item.name" class="q-px-none1" clickable @click="edit(item)">
            <q-item-section>
              <q-item-label :data-tag="tags.settingsCopyTemplatesName">{{ item.name }}</q-item-label>
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

  <SettingsPanel v-else :title="$t('settingsCopyTemplates.editTemplate')" @back="back" style="max-width: 650px">
    <!-- <q-separator class="q-my-md" /> -->
    <LabelRow :label="$t('settingsCopyTemplates.templateName')" lifted>
      <q-input v-model="editedItem.name" class="col" :rules="[validateName]"
        :data-tag="tags.settingsCopyTemplatesEditName" />
    </LabelRow>

    <LabelRow>
      <div>
        {{ $t('settingsCopyTemplates.templateDescription') }}
      </div>
    </LabelRow>

    <LabelRow>
      <FlagIcon region="en" style="visibility: hidden" /> <!-- To preserve the appropriate space for column header -->
      <div class="col">{{ $t('settingsCopyTemplates.formatTemplate') }}</div>
      <div class="col">{{ $t('settingsCopyTemplates.bookNaming') }}</div>
    </LabelRow>
    <LabelRow v-for="locale in settings.locales" :key="locale">
      <FlagIcon :region="locale2region(locale)" />

      <q-select v-model="editedItem.locale[locale].formatTemplate" :options="formatTemplates" option-label="name"
        option-value="name" map-options emit-value use-input class="col" :data-tag="tags.settingsCopyTemplatesFormat">
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.name }}</q-item-label>
              <!-- <q-item-label caption>{{ scope.opt.separatorChar }}</q-item-label> -->
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select v-model="editedItem.locale[locale].bookNaming" :options="settings.getBookNamings(locale)"
        option-label="name" option-value="name" map-options emit-value use-input class="col" :data-tag="tags.settingsCopyTemplatesBookNaming">
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

    <!-- Button bar -->
    <div class="q-my-lg">
      <div class="row q-gutter-sm">

        <!-- Save button -->
        <q-btn color="primary" @click="save" :data-tag="tags.settingsCopyTemplatesSave">
          <q-icon left name="icon-mat-check" />
          <div>{{ $t('settingsCopyTemplates.saveButton') }}</div>
        </q-btn>

        <!-- Cancel button -->
        <q-btn outline color="primary" @click="back" :data-tag="tags.settingsCopyTemplatesCancel">
          <q-icon left name="icon-mat-undo" />
          <div>{{ $t('settingsCopyTemplates.cancelButton') }}</div>
        </q-btn>

        <q-space />

        <q-btn outline color="red-4" @click="remove" :disabled="isDefault(editedItem)"
          :data-tag="tags.settingsCopyTemplatesRemove">
          <q-icon left name="delete" />
          <div>{{ $t('settingsCopyTemplates.removeButton') }}</div>
          <q-tooltip v-if="isDefault(editedItem)">{{ $t('settingsCopyTemplates.defaultTemplateTooltip') }}</q-tooltip>
        </q-btn>

      </div>
    </div>
    <!-- <q-separator class="q-my-md" /> -->
  </SettingsPanel>
</template>


<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { CopyTemplateData, LocaleSymbol } from 'src/types'
import { useSettingsStore } from 'stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import FlagIcon from './FlagIcon.vue'
import LabelRow from './LabelRow.vue'
import { Dialog } from 'quasar'
import { nameSorter, locale2region } from 'src/util'
import { useI18n } from 'vue-i18n'
import * as tags from 'src/tags'
const { t } = useI18n()

const settings = useSettingsStore()
const formatTemplates = settings.persist.formatTemplates
const items: CopyTemplateData[] = settings.persist.copyTemplates

function getEmptyItem() {
  const emptyItem: CopyTemplateData = {
    name: '',
    locale: settings.locales.reduce((acc, cur) => {
      acc[cur] = {
        bookNaming: '',
        formatTemplate: '',
      }
      return acc
    }, {} as Record<LocaleSymbol, { formatTemplate: string, bookNaming: string }>)
  }

  return emptyItem
}

function cloneItem(item: CopyTemplateData) {
  return structuredClone(toRaw(item))
}

const selected = ref('')
const selectedItem = ref(getEmptyItem())
const isNewItem = ref(false)

function isDefault(item: CopyTemplateData) {
  return settings.persist.defaultCopyTemplate === item.name
}

const editedItem = ref<CopyTemplateData>(getEmptyItem())
function edit(item: CopyTemplateData) {
  selected.value = item.name
  selectedItem.value = item
  editedItem.value = cloneItem(item)
}

function validateName(v: string) {
  return v.length === 0
    ? t('settingsCopyTemplates.nameRequired')
    : items.some(item => item.name === editedItem.value.name && item !== selectedItem.value)
      ? t('settingsCopyTemplates.nameExists')
      : true
}

function save() {
  if (!editedItem.value.name.trim()) {
    Dialog.create({
      title: t('settingsCopyTemplates.error'),
      message: t('settingsCopyTemplates.nameRequired'),
      ok: t('settingsCopyTemplates.ok')
    })
    return
  }

  if (isNewItem.value) {
    items.push(editedItem.value)
    items.sort(nameSorter(settings.persist.appearance.locale))

    editedItem.value = getEmptyItem() // Reset the edited item
  } else {
    Object.assign(selectedItem.value, cloneItem(editedItem.value))
  }
  back()
}

function remove() {
  Dialog.create({
    title: t('settingsCopyTemplates.removeTitle'),
    message: `${t('settingsCopyTemplates.removeConfirm')} "${selected.value}"?`,
    ok: t('settingsCopyTemplates.yes'),
    cancel: t('settingsCopyTemplates.no'),
  }).onOk(() => {
    const i = items.findIndex(it => it.name === selected.value)
    if (i !== -1) {
      items.splice(i, 1)

      // Check if the removed item was the default template
      if (selected.value === settings.persist.defaultCopyTemplate) {
        // If there are remaining items, set the first one as default
        if (items.length > 0) {
          settings.persist.defaultCopyTemplate = items[0].name
        } else {
          // If no items left, set to empty string
          settings.persist.defaultCopyTemplate = ''
        }
      }
    }
    selected.value = ''
  })
}

function back() {
  selected.value = ''
  isNewItem.value = false
  editedItem.value = getEmptyItem()
}

function add() {
  isNewItem.value = true
}

</script>
<style lang="scss">
.chars-around-label {
  min-width: 14em;
  flex-grow: 1;
}
</style>
