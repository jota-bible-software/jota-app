<template>
  <SettingsPanel v-if="!selected && !isNewItem" title="Szablony kopiowania">

    <div class="col">
      <div class="row">
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
    <div class="q-px-none">
      <div class="col q-gutter-md">

        <!-- <q-separator class="q-my-md" /> -->
        <LabelRow label="Nazwa szablonu">
          <q-input v-model="editedItem.name" class="col" />
        </LabelRow>

        <LabelRow label="Ustaw jako domyślny">
          <q-toggle v-model="editedItem.isDefault" />
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
            <q-btn color="primary" @click="save()">
              <q-icon left name="save" />
              <div>Zapisz i wróć</div>
            </q-btn>
            <!-- <q-btn outline color="primary" @click="selected = ''">
            <q-icon left name="undo" />
            <div>Schowaj</div>
          </q-btn> -->
            <q-space />

            <q-btn outline color="red-4" @click="showRemoveDialog = true" :disabled="isNewItem">
              <q-icon left name="delete" />
              <div>Usuń</div>
              <!-- <q-tooltip v-if="item.name === appBookNaming">Nie można usunąć nazewnictwa, które jest używane w
              aplikacji</q-tooltip> -->
            </q-btn>
            <ConfirmDialog :message="confirmRemoveMessage" @ok="remove" v-model="showRemoveDialog" />

          </div>
        </div>
        <!-- <q-separator class="q-my-md" /> -->
      </div>
    </div>
  </SettingsPanel>
</template>


<script setup lang="ts">
// TODO make sure the name is unique
import { ComputedRef, computed, ref, toRaw } from 'vue'
import { CopyTemplateData, Lang } from 'src/types'
import { languageData } from 'src/logic/data'

import { useSettingsStore } from 'stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import FlagIcon from './FlagIcon.vue'
import LabelRow from './LabelRow.vue'
import ConfirmDialog from './ConfirmDialog.vue'

const store = useSettingsStore()
const languages = ref(languageData)


function bookNamings(lang: Lang) {
  return store.persist.languages[lang].bookNamings
}

const formatTemplates = store.persist.formatTemplates

// const templates: ComputedRef<CopyTemplateData[]> = computed(() => store.persist.copyTemplates)
const items: CopyTemplateData[] = store.persist.copyTemplates

function getEmptyItem() {
  const emptyItem: CopyTemplateData = {
    name: '',
    isDefault: false,
    lang: languages.value.reduce((acc, cur) => {
      acc[cur.symbol] = {
        bookNaming: '',
        formatTemplate: '',
      }
      return acc
    }, {} as Record<Lang, { formatTemplate: string, bookNaming: string }>)
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

function save() {
  if (isNewItem.value) {
    items.push(editedItem.value)
    items.sort(store.nameSorter)
  } else {
    Object.assign(selectedItem.value, cloneItem(editedItem.value))
  }
  back()
}
const confirmRemoveMessage = computed(() => `Czy na pewno chcesz usunąć szablon "${selected.value}"?`)
const showRemoveDialog = ref(false)

function remove() {
  const i = items.findIndex(it => it.name === selected.value)
  if (i !== -1) items.splice(i, 1)
  selected.value = ''
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
