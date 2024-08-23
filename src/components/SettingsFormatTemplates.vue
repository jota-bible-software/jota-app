<template>
  <SettingsPanel v-if="!selected && !isNewItem" title="Szablony formatowania wersetów">

    <!-- List of items -->
    <div class="col">
      <LabelRow label="Na ekranie aplikacji">
        <q-select v-model="store.persist.appFormatTemplate" :options="templates" option-label="name" />
      </LabelRow>

      <div class="row q-mt-md">
        <q-list bordered separator class="col-auto" style="max-width: 650px">
          <q-item v-for="(item, index) in templates" :key="item.name" class="q-px-none1" clickable
            @click="edit(item, index)">
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
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
        <q-btn color="accent" @click="add">
          <q-icon left name="add" />
          <div>Dodaj</div>
        </q-btn>
      </div>
    </div>
  </SettingsPanel>

  <SettingsPanel v-else title="Edycja szablonu formatowania" @back="reset" style="max-width: 550px">
    <div class="q-px-none">
      <q-form ref="myForm" class="col q-gutter-md" :no-error-focus="false" @submit="save" @reset="reset">

        <!-- <q-separator class="q-my-md" /> -->
        <LabelRow label="Nazwa szablonu" lifted>
          <q-input v-model="editedItem.name" class="col" lazy-rules :rules="[validateName]" />
        </LabelRow>

        <div>Lokalizacja odnośnika w stosunku do treści</div>
        <LabelRow>
          <q-radio v-model="editedItem.referencePosition" val="before" label="Przed treścią"  />
          <q-radio v-model="editedItem.referencePosition" val="after" label="Po treści"  />
        </LabelRow>
        <LabelRow>
          <q-radio v-model="editedItem.referenceLine" val="same line" label="W tej samej linii"  />
          <q-radio v-model="editedItem.referenceLine" val="new line" label="W oddzielnej linii"  />
        </LabelRow>

        <!-- <div>Skrótu przekładu</div> -->
        <LabelRow label="Skrótu przekładu" class="q-py-sm">
          <q-radio v-model="editedItem.translationAbbreviation" val="none" label="Żaden" />
          <q-radio v-model="editedItem.translationAbbreviation" val="lowercase" label="Małymi literami" />
          <q-radio v-model="editedItem.translationAbbreviation" val="uppercase" label="Dużymi literami" />
        </LabelRow>

        <LabelRow class="q-pb-sm">
          <q-toggle v-model="editedItem.numbers" label="Wersety z numerami"></q-toggle>
          <q-toggle v-model="editedItem.verseNewLine" label="Każdy wersety od nowej linii"></q-toggle>
        </LabelRow>

        <LabelRow>
          <div class="col">Znak oddzielający rozdział od wersetów w odnośniku</div>
          <q-input v-model="editedItem.separatorChar" class="short-input" />
        </LabelRow>

        <LabelRow>
          <div class="col">Znak określający przedział wersetów od - do</div>
          <q-input v-model="editedItem.rangeChar" class="short-input" />
        </LabelRow>

        <LabelRow>
          <div class="chars-around-label">Znaki wokół odnośnika</div>
          <div class="chars before">przed</div>
          <q-input v-model="editedItem.referenceCharsBefore" class="short-input" />
          <div class="chars after">po</div>
          <q-input v-model="editedItem.referenceCharsAfter" class="short-input" />
        </LabelRow>

        <LabelRow>
          <div class="chars-around-label">Znaki wokół treści cytatu</div>
          <div class="chars before">przed</div>
          <q-input v-model="editedItem.quoteCharsBefore" class="short-input" />
          <div class="chars after">po</div>
          <q-input v-model="editedItem.quoteCharsAfter" class="short-input" />
        </LabelRow>

        <LabelRow>
          <div class="chars-around-label">Znaki wokół numeru wersetu</div>
          <div class="chars before">przed</div>
          <q-input v-model="editedItem.verseNumberCharsBefore" class="short-input" />
          <div class="chars after">po</div>
          <q-input v-model="editedItem.verseNumberCharsAfter" class="short-input" />
        </LabelRow>

        <LabelRow>
          <div class="chars-around-label">Znaki wokół skrótu przekładu</div>
          <div class="chars before">przed</div>
          <q-input v-model="editedItem.translationAbbreviationCharsBefore" class="short-input" />
          <div class="chars after">po</div>
          <q-input v-model="editedItem.translationAbbreviationCharsAfter" class="short-input" />
        </LabelRow>

        <div>Przykład użycia powyższych reguł formatowania</div>
        <pre v-html="formatted" class="default-font-family border q-py-sm q-px-md q-mt-sm"
          style="background-color: var(--q-background-10); white-space:pre-wrap"></pre>

        <!-- Button bar -->
        <div class="q-my-lg">
          <div class="row q-gutter-sm">
            <q-btn type="submit" color="primary">
              <q-icon left name="save" />
              <div>Zapisz i wróć</div>
            </q-btn>
            <!-- <q-btn outline color="primary" @click="selected = ''">
            <q-icon left name="undo" />
            <div>Schowaj</div>
          </q-btn> -->
            <q-space />

            <q-btn outline color="red-4" :disabled="!!removeTooltip" @click="showRemoveDialog = true">
              <q-icon left name="delete" />
              <div>Usuń</div>
              <q-tooltip v-if="!!removeTooltip">{{ removeTooltip }}</q-tooltip>
            </q-btn>
            <ConfirmDialog :message="confirmRemoveMessage" @ok="remove" v-model="showRemoveDialog" />

          </div>
        </div>
        <!-- <q-separator class="q-my-md" /> -->
      </q-form>
    </div>
  </SettingsPanel>
</template>


<script setup lang="ts">
// TODO make sure the name is unique
import { Ref, computed, ref } from 'vue'
import { QForm } from 'quasar'
import { FormatTemplateData } from 'src/types'
import { supportedLanguageSymbols } from 'src/logic/data'
import { useSettingsStore } from 'stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import LabelRow from './LabelRow.vue'
import { formatSample } from 'src/logic/format'


const store = useSettingsStore()
const items = store.persist.formatTemplates

const templates = computed(() => items)

const emptyItem: FormatTemplateData = {
  name: '',
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
  editedItem.value = { ...item }
}

function save() {
  if (isNewItem.value) {
    items.push(editedItem.value)
    items.sort(store.nameSorter)
  } else {
    Object.assign(selectedItem.value, editedItem.value)
  }
  editedItem.value = { ...emptyItem }
  selected.value = ''
  isNewItem.value = false
}

const removeTooltip = computed(() => {
  let foundTemplateName = ''
  let foundLang = ''
  for (const t of store.persist.copyTemplates) {
    for (const lang of supportedLanguageSymbols) {
      if (t.lang[lang].formatTemplate === selected.value) {
        foundTemplateName = t.name
        foundLang = lang
        break
      }
    }
    if (!!foundTemplateName) break
  }
  return !!foundTemplateName ? `Usunięcie niemożliwe z powodu użycia tego szablonu w szablonie kopiowania "${foundTemplateName}" dla języka ${foundLang}` : ''
})
const confirmRemoveMessage = computed(() => `Czy na pewno chcesz usunąć szablon "${selected.value}"?`)
const showRemoveDialog = ref(false)

// function askRemove() {
//   $q.dialog({
//     component: ConfirmDialog,

//     // props forwarded to your custom component
//     componentProps: {
//       message: `Czy na pewno chcesz usunąć szablon "${selected.value}"?`,
//       // ...more..props...
//     }
//     // title: 'Potwierdź',
//     // message: `Czy na pewno chcesz usunąć szablon "${selected.value}"?`,
//     // cancel: true,
//     // persistent: true
//   }).onOk(() => {
//     remove()
//   })
// }

function remove() {
  const i = items.findIndex(it => it.name === selected.value)
  if (i !== -1) items.splice(i, 1)
  selected.value = ''
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
  return v.length === 0 ? 'Nazwa nie może być pusta' : items.find((it, i) => it.name === v && i !== selectedIndex.value) ? 'Taka nazwa już występuje' : true
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
