<template>
  <SettingsPanel v-if="!selected && !isNewItem" :title="$t('settingsFormatTemplates.title')">

    <!-- List of items -->
    <div class="col">
      <!-- The app screen template was a premature feature, don't turn it on yet -->
      <!-- <LabelRow :label="$t('settingsFormatTemplates.appDisplay')">
        <q-select v-model="settings.persist.appFormatTemplateName" :options="items" option-value="name" emit-value
          option-label="name" :data-tag="tags.settingsFormatTemplateAppScreen" />
      </LabelRow> -->

      <div class="row q-mt-md">
        <q-list bordered separator class="col-auto" style="max-width: 650px">
          <q-item v-for="(item, index) in items" :key="item.name" class="q-px-none1" clickable
            @click="edit(item, index)">
            <q-item-section>
              <q-item-label :data-tag="tags.settingsFormatTemplatesItemName">{{ item.name }}</q-item-label>
              <q-item-label>
                <pre v-html="formatSample(item)" class="text-caption default-font-family"
                  style=" white-space:pre-wrap"></pre>
              </q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon color="primary" name="chevron_right" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="row q-mt-md">
        <q-btn color="accent" @click="add" :data-tag="tags.settingsFormatTemplatesAdd">
          <q-icon left name="add" />
          <div>{{ $t('settingsFormatTemplates.addButton') }}</div>
        </q-btn>
      </div>
    </div>
  </SettingsPanel>

  <SettingsPanel v-else :title="$t('settingsFormatTemplates.editTitle')" @back="reset" style="max-width: 560px">
    <div class="q-px-none">
      <q-form ref="myForm" class="col q-gutter-md" @submit="save" @reset="reset">

        <!-- <q-separator class="q-my-md" /> -->
        <LabelRow :label="$t('settingsFormatTemplates.templateName')" lifted>
          <q-input v-model="editedItem.name" class="col" :rules="[validateName]"
            :data-tag="tags.settingsFormatTemplateName" />
        </LabelRow>

        <div>{{ $t('settingsFormatTemplates.referencePosition') }}</div>
        <LabelRow>
          <q-radio v-model="editedItem.referencePosition" val="before"
            :label="$t('settingsFormatTemplates.beforeContent')"
            :data-tag="tags.settingsFormatTemplateRefPositionBefore" />
          <q-radio v-model="editedItem.referencePosition" val="after"
            :label="$t('settingsFormatTemplates.afterContent')"
            :data-tag="tags.settingsFormatTemplateRefPositionAfter" />
        </LabelRow>
        <LabelRow>
          <q-radio v-model="editedItem.referenceLine" val="same line" :label="$t('settingsFormatTemplates.sameLine')"
            :data-tag="tags.settingsFormatTemplateRefPositionSameLine" />
          <q-radio v-model="editedItem.referenceLine" val="new line" :label="$t('settingsFormatTemplates.newLine')"
            :data-tag="tags.settingsFormatTemplateRefPositionNewLine" />
        </LabelRow>

        <LabelRow :label="$t('settingsFormatTemplates.editionAbbreviation')" class="q-py-sm">
          <q-radio v-model="editedItem.editionAbbreviation" val="none" :label="$t('settingsFormatTemplates.none')"
            :data-tag="tags.settingsFormatTemplateEditionAbbreviationNone" />
          <q-radio v-model="editedItem.editionAbbreviation" val="lowercase"
            :label="$t('settingsFormatTemplates.lowercase')"
            :data-tag="tags.settingsFormatTemplateEditionAbbreviationLowercase" />
          <q-radio v-model="editedItem.editionAbbreviation" val="uppercase"
            :label="$t('settingsFormatTemplates.uppercase')"
            :data-tag="tags.settingsFormatTemplateEditionAbbreviationUppercase" />
        </LabelRow>

        <LabelRow class="q-pb-sm">
          <q-toggle v-model="editedItem.numbers" :label="$t('settingsFormatTemplates.versesWithNumbers')"
            :data-tag="tags.settingsFormatTemplateWithNumbers" />
          <q-toggle v-model="editedItem.verseNewLine" :label="$t('settingsFormatTemplates.newLineForEachVerse')"
            :data-tag="tags.settingsFormatTemplateVerseNewLine" />
        </LabelRow>

        <LabelRow>
          <div class="col">{{ $t('settingsFormatTemplates.separatorChar') }}</div>
          <q-input v-model="editedItem.separatorChar" class="short-input"
            :data-tag="tags.settingsFormatTemplateSeparatorChar" />
        </LabelRow>

        <LabelRow>
          <div class="col">{{ $t('settingsFormatTemplates.rangeChar') }}</div>
          <q-input v-model="editedItem.rangeChar" class="short-input"
            :data-tag="tags.settingsFormatTemplateRangeChar" />
        </LabelRow>

        <LabelRow>
          <div class="chars-around-label">{{ $t('settingsFormatTemplates.charsAroundReference') }}</div>
          <div class="chars before">{{ $t('settingsFormatTemplates.charsBefore') }}</div>
          <q-input v-model="editedItem.referenceCharsBefore" class="short-input"
            :data-tag="tags.settingsFormatTemplateReferenceCharsBefore" />
          <div class="chars after">{{ $t('settingsFormatTemplates.charsAfter') }}</div>
          <q-input v-model="editedItem.referenceCharsAfter" class="short-input"
            :data-tag="tags.settingsFormatTemplateReferenceCharsAfter" />
        </LabelRow>

        <LabelRow>
          <div class="chars-around-label">{{ $t('settingsFormatTemplates.charsAroundQuote') }}</div>
          <div class="chars before">{{ $t('settingsFormatTemplates.charsBefore') }}</div>
          <q-input v-model="editedItem.quoteCharsBefore" class="short-input"
            :data-tag="tags.settingsFormatTemplateQuoteCharsBefore" />
          <div class="chars after">{{ $t('settingsFormatTemplates.charsAfter') }}</div>
          <q-input v-model="editedItem.quoteCharsAfter" class="short-input"
            :data-tag="tags.settingsFormatTemplateQuoteCharsAfter" />
        </LabelRow>

        <LabelRow>
          <div class="chars-around-label">{{ $t('settingsFormatTemplates.charsAroundVerseNumber') }}</div>
          <div class="chars before">{{ $t('settingsFormatTemplates.charsBefore') }}</div>
          <q-input v-model="editedItem.verseNumberCharsBefore" class="short-input"
            :data-tag="tags.settingsFormatTemplateNumberCharsBefore" />
          <div class="chars after">{{ $t('settingsFormatTemplates.charsAfter') }}</div>
          <q-input v-model="editedItem.verseNumberCharsAfter" class="short-input"
            :data-tag="tags.settingsFormatTemplateNumberCharsAfter" />
        </LabelRow>

        <LabelRow>
          <div class="chars-around-label">{{ $t('settingsFormatTemplates.charsAroundEditionAbbreviation') }}</div>
          <div class="chars before">{{ $t('settingsFormatTemplates.charsBefore') }}</div>
          <q-input v-model="editedItem.editionAbbreviationCharsBefore" class="short-input" />
          <div class="chars after">{{ $t('settingsFormatTemplates.charsAfter') }}</div>
          <q-input v-model="editedItem.editionAbbreviationCharsAfter" class="short-input" />
        </LabelRow>

        <div>{{ $t('settingsFormatTemplates.example') }}</div>
        <pre v-html="formatted" class="default-font-family border q-py-sm q-px-md q-mt-sm"
          style="background-color: var(--q-background-10); white-space:pre-wrap"></pre>

        <!-- Button bar -->
        <div class="q-my-lg">
          <div class="row q-gutter-sm">

            <q-btn type="submit" color="primary" :data-tag="tags.settingsFormatTemplateSave">
              <q-icon left name="icon-mat-check" />
              <div>{{ $t('settingsFormatTemplates.saveButton') }}</div>
            </q-btn>

            <!-- Cancel button -->
            <q-btn outline color="primary" @click="reset" :data-tag="tags.settingsFormatTemplateCancel">
              <q-icon left name="icon-mat-undo" />
              <div>{{ $t('settingsFormatTemplates.cancelButton') }}</div>
            </q-btn>

            <!-- <q-btn outline color="primary" @click="selected = ''">
            <q-icon left name="undo" />
            <div>Schowaj</div>
          </q-btn> -->
            <q-space />

            <q-btn outline color="red-4" :disabled="!!removeTooltip" @click="remove"
              :data-tag="tags.settingsFormatTemplateRemove">
              <q-icon left name="delete" />
              <div>{{ $t('settingsFormatTemplates.removeButton') }}</div>
              <q-tooltip v-if="!!removeTooltip">{{ removeTooltip }}</q-tooltip>
            </q-btn>

          </div>
        </div>
        <!-- <q-separator class="q-my-md" /> -->
      </q-form>
    </div>
  </SettingsPanel>
</template>


<script setup lang="ts">
// TODO make sure the name is unique
import { Dialog, QForm } from 'quasar'
import { formatSample } from 'src/logic/format'
import * as tags from 'src/tags'
import { FormatTemplateData } from 'src/types'
import { nameSorter } from 'src/util'
import { useSettingsStore } from 'stores/settings-store'
import { Ref, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LabelRow from './LabelRow.vue'
import SettingsPanel from './SettingsPanel.vue'
const { t } = useI18n()

const settings = useSettingsStore()
const items = settings.persist.formatTemplates

const emptyItem: FormatTemplateData = {
  name: '',
  referencePosition: 'after',
  referenceLine: 'new line',
  editionAbbreviation: 'uppercase',
  numbers: false,
  verseNewLine: false,
  separatorChar: ':',
  rangeChar: '-',
  referenceCharsBefore: '',
  referenceCharsAfter: '',
  quoteCharsBefore: '',
  quoteCharsAfter: '',
  verseNumberCharsBefore: '',
  verseNumberCharsAfter: '',
  editionAbbreviationCharsBefore: '',
  editionAbbreviationCharsAfter: '',
}

const selected = ref('')
const selectedItem = ref(emptyItem)
const selectedIndex = ref(-1)
const isNewItem = ref(false)
const myForm: Ref<QForm | null> = ref(null)

const editedItem = ref<FormatTemplateData>({ ...emptyItem })

function edit(item: FormatTemplateData, index: number) {
  selected.value = item.name
  selectedItem.value = item
  selectedIndex.value = index
  editedItem.value = { ...item }
}

function save() {
  if (isNewItem.value) {
    items.push(editedItem.value)
  } else {
    Object.assign(selectedItem.value, editedItem.value)
  }
  items.sort(nameSorter(settings.persist.appearance.locale))

  if (selected.value === settings.persist.appFormatTemplateName) {
    settings.persist.appFormatTemplateName = editedItem.value.name
  }

  editedItem.value = { ...emptyItem }
  selected.value = ''
  isNewItem.value = false
}

const removeTooltip = computed(() => {
  // Check if the current template is app screen template
  if (selected.value === settings.persist.appFormatTemplateName) {
    return t('settingsFormatTemplates.removeTooltipAppScreen')
  }

  // Check if the current template is used in the copy temaplates
  let foundTemplateName = ''
  let foundLocale = ''
  for (const t of settings.persist.copyTemplates) {
    for (const locale of settings.locales) {
      if (t.locale[locale].formatTemplate === selected.value) {
        foundTemplateName = t.name
        foundLocale = locale
        break
      }
    }
    if (!!foundTemplateName) break
  }
  return !!foundTemplateName ? `${t('settingsFormatTemplates.removeTooltipCopyTemplate')} "${foundTemplateName}" ${t('settingsFormatTemplates.forLanguage')} ${foundLocale}` : ''
})

function remove() {
  Dialog.create({
    title: t('settingsFormatTemplates.removeDialogTitle'),
    message: `${t('settingsFormatTemplates.removeDialogMessage')} "${selected.value}"?`,
    ok: t('settingsFormatTemplates.yes'),
    cancel: t('settingsFormatTemplates.no'),
  }).onOk(() => {
    const i = items.findIndex(it => it.name === selected.value)
    if (i !== -1) items.splice(i, 1)
    selected.value = ''
    editedItem.value = { ...emptyItem }
  })
}

function reset() {
  selected.value = ''
  editedItem.value = { ...emptyItem }
  isNewItem.value = false
  myForm.value?.resetValidation()
}

function add() {
  isNewItem.value = true
}

const formatted = computed(() => formatSample(editedItem.value))

function validateName(v: string) {
  return v.length === 0
    ? t('settingsFormatTemplates.nameCannotBeEmpty')
    : items.find((it, i) => it.name === v && i !== selectedIndex.value)
      ? t('settingsFormatTemplates.nameAlreadyExists')
      : true
}

</script>


<style lang="scss">
.short-input {
  max-width: 3em;

  input {
    text-align: center;
  }
}

.chars-around-label {
  min-width: 14em;
  flex-grow: 1;
}
</style>
