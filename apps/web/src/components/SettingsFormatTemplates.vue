<template>
  <SettingsPanel :name="name" v-if="!selected && !isNewItem" :title="$t('settingsFormatTemplates.title')">

    <!-- List of items -->
    <div class="col">
      <!-- The app screen template was a premature feature, don't turn it on yet -->
      <!-- <LabelRow :label="$t('settingsFormatTemplates.appDisplay')">
        <q-select v-model="settings.persist.appFormatTemplateName" :options="items" option-value="name" emit-value
          option-label="name" :data-tag="tags.settingsFormatTemplateAppScreen" />
      </LabelRow> -->

      <div class="row q-mt-md">
        <q-list bordered separator class="col" style="max-width: 650px">
          <q-item v-for="(item, index) in items" :key="item.name" class="q-px-none1" clickable @click="edit(item, index)">
            <q-item-section>
              <q-item-label :data-tag="tags.settingsFormatTemplatesItemName">{{ item.name }}</q-item-label>
              <q-item-label>
                <pre v-html="formatSample(item)" class="text-caption default-font-family" style=" white-space:pre-wrap"></pre>
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

  <SettingsPanel :name="name" v-else :title="$t('settingsFormatTemplates.editTitle')" @back="reset" style="max-width: 700px">
    <div class="q-px-none">
      <q-form ref="myForm" class="col q-gutter-md" @submit="save" @reset="reset">

        <!-- <q-separator class="q-my-md" /> -->
        <LabelRow :label="$t('settingsFormatTemplates.templateName')" lifted>
          <q-input v-model="editedItem.name" class="col" :rules="[validateName]" :data-tag="tags.settingsFormatTemplateName" />
        </LabelRow>

        <div>{{ $t('settingsFormatTemplates.referencePosition') }}</div>
        <LabelRow class="q-pb-sm">
          <q-toggle v-model="editedItem.referenceWithoutContent" :label="$t('settingsFormatTemplates.referenceWithoutContent')" />
        </LabelRow>

        <LabelRow>
          <q-radio v-model="editedItem.referencePosition" val="before" :label="$t('settingsFormatTemplates.beforeContent')"
            :data-tag="tags.settingsFormatTemplateRefPositionBefore" :disable="editedItem.referenceWithoutContent" />
          <q-radio v-model="editedItem.referencePosition" val="after" :label="$t('settingsFormatTemplates.afterContent')"
            :data-tag="tags.settingsFormatTemplateRefPositionAfter" :disable="editedItem.referenceWithoutContent" />
        </LabelRow>
        <LabelRow>
          <q-radio v-model="editedItem.referenceLine" val="same line" :label="$t('settingsFormatTemplates.sameLine')"
            :data-tag="tags.settingsFormatTemplateRefPositionSameLine" :disable="editedItem.referenceWithoutContent" />
          <q-radio v-model="editedItem.referenceLine" val="new line" :label="$t('settingsFormatTemplates.newLine')"
            :data-tag="tags.settingsFormatTemplateRefPositionNewLine" :disable="editedItem.referenceWithoutContent" />
        </LabelRow>


        <LabelRow :label="$t('settingsFormatTemplates.translationAbbreviation')" class="q-py-sm">
          <q-radio v-model="editedItem.translationAbbreviation" val="none" :label="$t('settingsFormatTemplates.none')"
            :data-tag="tags.settingsFormatTemplateTranslationAbbreviationNone" />
          <q-radio v-model="editedItem.translationAbbreviation" val="lowercase" :label="$t('settingsFormatTemplates.lowercase')"
            :data-tag="tags.settingsFormatTemplateTranslationAbbreviationLowercase" />
          <q-radio v-model="editedItem.translationAbbreviation" val="uppercase" :label="$t('settingsFormatTemplates.uppercase')"
            :data-tag="tags.settingsFormatTemplateTranslationAbbreviationUppercase" />
        </LabelRow>

        <LabelRow class="q-pb-sm">
          <q-toggle v-model="editedItem.numbers" :label="$t('settingsFormatTemplates.versesWithNumbers')"
            :data-tag="tags.settingsFormatTemplateWithNumbers" />
          <q-toggle v-model="editedItem.verseNewLine" :label="$t('settingsFormatTemplates.newLineForEachVerse')"
            :data-tag="tags.settingsFormatTemplateVerseNewLine" />
        </LabelRow>

        <LabelRow>
          <div class="col">{{ $t('settingsFormatTemplates.separatorChar') }}</div>
          <CharacterInput v-model="editedItem.separatorChar" :data-tag="tags.settingsFormatTemplateSeparatorChar" />
        </LabelRow>

        <LabelRow>
          <div class="col">{{ $t('settingsFormatTemplates.rangeChar') }}</div>
          <CharacterInput v-model="editedItem.rangeChar" :data-tag="tags.settingsFormatTemplateRangeChar" />
        </LabelRow>

        <LabelRow>
          <div class="chars-around-label">{{ $t('settingsFormatTemplates.charsAroundReference') }}</div>
          <div class="chars before">{{ $t('settingsFormatTemplates.charsBefore') }}</div>
          <CharacterInput v-model="editedItem.referenceCharsBefore" :data-tag="tags.settingsFormatTemplateReferenceCharsBefore" />
          <div class="chars after">{{ $t('settingsFormatTemplates.charsAfter') }}</div>
          <CharacterInput v-model="editedItem.referenceCharsAfter" :data-tag="tags.settingsFormatTemplateReferenceCharsAfter" />
        </LabelRow>

        <LabelRow>
          <div class="chars-around-label">{{ $t('settingsFormatTemplates.charsAroundQuote') }}</div>
          <div class="chars before">{{ $t('settingsFormatTemplates.charsBefore') }}</div>
          <CharacterInput v-model="editedItem.quoteCharsBefore" :data-tag="tags.settingsFormatTemplateQuoteCharsBefore"
            :disable="editedItem.referenceWithoutContent" />
          <div class="chars after">{{ $t('settingsFormatTemplates.charsAfter') }}</div>
          <CharacterInput v-model="editedItem.quoteCharsAfter" :data-tag="tags.settingsFormatTemplateQuoteCharsAfter"
            :disable="editedItem.referenceWithoutContent" />
        </LabelRow>

        <LabelRow>
          <div class="chars-around-label">{{ $t('settingsFormatTemplates.charsAroundVerseNumber') }}</div>
          <div class="chars before">{{ $t('settingsFormatTemplates.charsBefore') }}</div>
          <CharacterInput v-model="editedItem.verseNumberCharsBefore" :data-tag="tags.settingsFormatTemplateNumberCharsBefore"
            :disable="editedItem.referenceWithoutContent" />
          <div class="chars after">{{ $t('settingsFormatTemplates.charsAfter') }}</div>
          <CharacterInput v-model="editedItem.verseNumberCharsAfter" :data-tag="tags.settingsFormatTemplateNumberCharsAfter"
            :disable="editedItem.referenceWithoutContent" />
        </LabelRow>

        <LabelRow>
          <div class="chars-around-label">{{ $t('settingsFormatTemplates.charsAroundTranslationAbbreviation') }}</div>
          <div class="chars before">{{ $t('settingsFormatTemplates.charsBefore') }}</div>
          <CharacterInput v-model="editedItem.translationAbbreviationCharsBefore" :disable="editedItem.referenceWithoutContent" />
          <div class="chars after">{{ $t('settingsFormatTemplates.charsAfter') }}</div>
          <CharacterInput v-model="editedItem.translationAbbreviationCharsAfter" :disable="editedItem.referenceWithoutContent" />
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

            <q-btn outline color="red-4" :disabled="!!removeTooltip" @click="remove" :data-tag="tags.settingsFormatTemplateRemove">
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

defineProps<{ name: string }>()
// TODO make sure the name is unique
import { Dialog, QForm } from 'quasar'
import { formatSample } from 'src/logic/format'
import * as tags from 'src/tags'
import { FormatTemplateData } from 'src/types'
import { nameSorter } from 'src/util'
import { useSettingsStore } from 'src/stores/settings-store'
import { Ref, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LabelRow from './LabelRow.vue'
import SettingsPanel from './SettingsPanel.vue'
import CharacterInput from './CharacterInput.vue'
const { t } = useI18n()

const settings = useSettingsStore()
const items = settings.persist.formatTemplates

const emptyItem: FormatTemplateData = {
  name: '',
  referenceWithoutContent: false,
  referencePosition: 'after',
  referenceLine: 'new line',
  translationAbbreviation: 'uppercase',
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
  translationAbbreviationCharsBefore: '',
  translationAbbreviationCharsAfter: '',
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
  editedItem.value = {
    ...item,
    // Ensure referenceWithoutContent property is initialized for existing templates
    referenceWithoutContent: item.referenceWithoutContent === undefined ? false : item.referenceWithoutContent
  }
}

function save() {
  // Ensure the referenceWithoutContent property is explicitly set
  if (editedItem.value.referenceWithoutContent === undefined) {
    editedItem.value.referenceWithoutContent = false
  }

  // Make sure the original item has the property too if we're editing an existing item
  if (!isNewItem.value && selectedItem.value.referenceWithoutContent === undefined) {
    selectedItem.value.referenceWithoutContent = false
  }

  if (isNewItem.value) {
    items.push(editedItem.value)
  } else {
    Object.assign(selectedItem.value, editedItem.value)
  }
  items.sort(nameSorter(settings.persist.app.defaultLocale))

  if (selected.value === settings.persist.appFormatTemplateName) {
    settings.persist.appFormatTemplateName = editedItem.value.name
  }

  // Change the name of format template in all copy templates
  for (const t of settings.focusedLocalized.copyTemplates) {
    if (t.formatTemplate === selected.value) {
      t.formatTemplate = editedItem.value.name
    }
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
  for (const t of settings.focusedLocalized.copyTemplates) {
    for (const locale of settings.locales) {
      if (t.formatTemplate === selected.value) {
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
    const i = items.findIndex((it: FormatTemplateData) => it.name === selected.value)
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
    : items.find((it: FormatTemplateData, i: number) => it.name === v && i !== selectedIndex.value)
      ? t('settingsFormatTemplates.nameAlreadyExists')
      : true
}
</script>

<style lang="scss">
.chars-around-label {
  min-width: 14em;
  flex-grow: 1;
}
</style>
