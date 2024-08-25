<template>
  <SettingsPanel v-if="!selected && !isNewItem" title="Szablony kopiowania">

    <LabelRow label="Domyślny szablon kopiowania">
      <q-select v-model="store.persist.defaultCopyTemplate" :options="items" option-label="name" />
    </LabelRow>

    <div>
      <div class="row  q-gutter-md">
        <q-list bordered separator class="col-auto" style="min-width: 350px; max-width: 650px">
          <q-item v-for="item in items" :key="item.name" class="q-px-none1" clickable @click="edit(item)">
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
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

  <SettingsPanel v-else title="Edycja szablonu kopiowania" @back="back" style="max-width: 650px">
    <!-- <q-separator class="q-my-md" /> -->
    <LabelRow label="Nazwa szablonu" lifted>
      <q-input v-model="editedItem.name" class="col" :rules="[validateName]" />
    </LabelRow>

    <LabelRow>
      <div>
        Poniższa lista określa jaki szablon formatowania i jakie nazewnictwo ksiąg zostaną wybrane dla powyższego
        szablonu kopiowania w zależności od języka aktualnego przekładu.
      </div>
    </LabelRow>

    <!-- <q-list bordered separator class="col-auto" style="min-width: 350px; max-width: 650px">
      <q-item v-for="lang in languages" :key="lang.symbol" class="q-px-none1" clickable @click="1 == 1">
        <q-item-section>
          <q-item-label>
            <LabelRow>
              <FlagIcon :lang="lang.symbol" />
              <div class="col">{{ editedItem.bookNaming }}</div>
              <div class="col">{{ editedItem.formatTemplate }}</div>
            </LabelRow>
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon color="primary" name="chevron_right" />
        </q-item-section>
      </q-item>
    </q-list> -->

    <LabelRow>
      <FlagIcon lang="en" style="visibility: hidden" />
      <div class="col">Szablon formatowania</div>
      <div class="col">Nazewnictwo ksiąg</div>
    </LabelRow>
    <LabelRow v-for="lang in languages" :key="lang.symbol">
      <FlagIcon :lang="lang.symbol" />

      <q-select v-model="editedItem.lang[lang.symbol].formatTemplate" :options="formatTemplates" option-label="name"
        option-value="name" map-options emit-value use-input class="col">
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.name }}</q-item-label>
              <!-- <q-item-label caption>{{ scope.opt.separatorChar }}</q-item-label> -->
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select v-model="editedItem.lang[lang.symbol].bookNaming" :options="bookNamings(lang.symbol)"
        option-label="name" option-value="name" map-options emit-value use-input class="col">
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
        <q-btn color="primary" @click="save()">
          <q-icon left name="icon-mat-check" />
          <div>Zapisz</div>
        </q-btn>

        <!-- Cancel button -->
        <q-btn outline color="primary" @click="back">
          <q-icon left name="icon-mat-undo" />
          <div>Anuluj</div>
        </q-btn>

        <q-space />

        <q-btn outline color="red-4" @click="removeDialog" :disabled="isNewItem">
          <q-icon left name="delete" />
          <div>Usuń</div>
          <!-- <q-tooltip v-if="item.name === appBookNaming">Nie można usunąć nazewnictwa, które jest używane w
          aplikacji</q-tooltip> -->
        </q-btn>

      </div>
    </div>
    <!-- <q-separator class="q-my-md" /> -->
  </SettingsPanel>
</template>


<script setup lang="ts">
import { ref, toRaw, computed } from 'vue'
import { CopyTemplateData, LanguageSymbol } from 'src/types'
import { languageData } from 'src/logic/data'
import { useSettingsStore } from 'stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import FlagIcon from './FlagIcon.vue'
import LabelRow from './LabelRow.vue'
import { Dialog } from 'quasar'

const store = useSettingsStore()
const languages = ref(languageData)


function bookNamings(lang: LanguageSymbol) {
  return store.persist.languages[lang].bookNamings
}

const formatTemplates = store.persist.formatTemplates

// const templates: ComputedRef<CopyTemplateData[]> = computed(() => store.persist.copyTemplates)
const items: CopyTemplateData[] = store.persist.copyTemplates

function getEmptyItem() {
  const emptyItem: CopyTemplateData = {
    name: '',
    lang: languages.value.reduce((acc, cur) => {
      acc[cur.symbol] = {
        bookNaming: '',
        formatTemplate: '',
      }
      return acc
    }, {} as Record<LanguageSymbol, { formatTemplate: string, bookNaming: string }>)
  }

  return emptyItem
}

function cloneItem(item: CopyTemplateData) {
  return structuredClone(toRaw(item))
}

const selected = ref('')
const selectedItem = ref(getEmptyItem())
const isNewItem = ref(false)

const editedItem = ref<CopyTemplateData>(getEmptyItem())
function edit(item: CopyTemplateData) {
  selected.value = item.name
  selectedItem.value = item
  editedItem.value = cloneItem(item)
}

function validateName(v: string) {
  return v.length === 0
    ? 'Nazwa nie może być pusta'
    : items.some(item => item.name === editedItem.value.name && item !== selectedItem.value)
      ? 'Taka nazwa już występuje'
      : true
}

function save() {
  if (!editedItem.value.name.trim()) {
    Dialog.create({
      title: 'Błąd',
      message: 'Nazwa szablonu nie może być pusta.',
      ok: 'OK'
    })
    return
  }

  const existingItem = items.find(item => item.name === editedItem.value.name)

  if (isNewItem.value) {
    items.push(editedItem.value)
    items.sort(store.nameSorter)

    editedItem.value = getEmptyItem() // Reset the edited item
  } else {
    Object.assign(selectedItem.value, cloneItem(editedItem.value))
  }
  back()
}

function removeDialog() {
  Dialog.create({
    title: 'Usuwanie',
    message: `Czy na pewno chcesz usunąć szablon "${selected.value}"?`,
    ok: 'Tak',
    cancel: 'Nie',
  }).onOk(() => {
    const i = items.findIndex(it => it.name === selected.value)
    if (i !== -1) {
      items.splice(i, 1)

      // Check if the removed item was the default template
      if (selected.value === store.persist.defaultCopyTemplate) {
        // If there are remaining items, set the first one as default
        if (items.length > 0) {
          store.persist.defaultCopyTemplate = items[0].name
        } else {
          // If no items left, set to empty string
          store.persist.defaultCopyTemplate = ''
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
