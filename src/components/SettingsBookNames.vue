<template>
  <SettingsPanel title="Nazewnictwo ksiąg biblijnych" lang>

    <div class="row items-center">
      <div class="q-mr-md">Na ekranie aplikacji</div>
      <q-select v-model="appBookNaming" :options="names"/>
    </div>

    <q-list bordered separator>
      <q-item v-for="item in bookNamings" :key="item.name" class="q-px-none1">
        <q-item-section>
          <div v-if="selected !== item.name">
            <div class="row items-center">
              <div class="col">
                {{ item.name }}
              </div>
              <div class="col-auto">
                <q-btn outline color="primary" icon="edit" @click="edit(item)" />
              </div>
            </div>

            <div class="row q-my-sm">
              <q-item-label caption>{{ item.books.join(', ') }}</q-item-label>
            </div>
          </div>

          <FormContainer v-if="selected === item.name" >
            <!-- <q-separator class="q-my-md" /> -->
            <q-input v-model="editedItem.name" label="Nazwa standardu" />
            <q-input v-model="editedBooksText" label="Nazwy ksiąg" autogrow />
            <div class="q-my-md">
              <div class="row q-gutter-sm">
                <q-btn color="primary" @click="save(item)">
                  <q-icon left name="save" />
                  <div>Zapisz zmiany</div>
                </q-btn>
                <q-btn outline color="primary" @click="selected = ''">
                  <q-icon left name="undo" />
                  <div>Cofnij</div>
                </q-btn>
                <q-btn outline color="primary" @click="appBookNaming = selected">
                  <q-icon left name="desktop_windows" />
                  <div>Użyj na ekranie aplikacji</div>
                </q-btn>
                <q-space />

                <q-btn outline color="red-4" @click="remove" :disabled="!!removeTooltip">
                  <q-icon left name="delete" />
                  <div>Usuń</div>
                  <q-tooltip v-if="!!removeTooltip">{{ removeTooltip }}</q-tooltip>
                </q-btn>

              </div>
            </div>
            <!-- <q-separator class="q-my-md" /> -->
          </FormContainer>

        </q-item-section>
      </q-item>
    </q-list>

    <!-- Add new naming standard -->
    <div class="q-mt-xl">
      <FormContainer>
        <span>Dodaj nowe nazewnictwo</span>
        <q-input v-model="newItem.name" label="Nazwa standardu" />
        <q-input v-model="newBooksText" label="Nazwy ksiąg" autogrow />
        <div class=" q-mt-md">
          <div class="row q-gutter-sm">
            <q-btn color="accent" @click="add">
              <q-icon left name="add" />
              <div>Dodaj</div>
            </q-btn>

          </div>
        </div>
      </FormContainer>
    </div>
  </SettingsPanel>
</template>

<script setup lang="ts">
import { ComputedRef, computed, ref } from 'vue'
import { supportedLanguageSymbols } from 'src/logic/data'
import { useSettingsStore } from 'stores/settings-store'
import FormContainer from './FormContainer.vue'
import SettingsPanel from './SettingsPanel.vue'
import { BookNamesStandardData } from 'src/types'

const store = useSettingsStore()

const bookNamings: ComputedRef<BookNamesStandardData[]> = computed(() =>
  store.persist.languages[store.lang].bookNamings.toSorted(
    (a, b) => a.name.localeCompare(b.name, store.lang, { sensitivity: 'base', ignorePunctuation: true })))

const appBookNaming = computed({
  get(): string {
    return store.persist.languages[store.lang].appBookNaming
  },
  set(value: string) {
    store.persist.languages[store.lang].appBookNaming = value
  }
})
const names = computed(() => bookNamings.value.map(it => it.name))
const selected = ref('')


const emptyItem: BookNamesStandardData = { lang: store.lang, name: '', books: [] as string[] }
const editedBooksText = ref('')
const editedItem = ref<BookNamesStandardData>({ ...emptyItem })
function edit(item: BookNamesStandardData) {
  selected.value = item.name
  editedItem.value = { ...item }
  editedBooksText.value = item.books.join(', ')
}

function save(item: BookNamesStandardData) {
  console.log('save ' + JSON.stringify(item))
  editedItem.value.books = editedBooksText.value.split(',').map(it => it.trim())
  Object.assign(item, editedItem.value)
  editedItem.value = { ...emptyItem }
  selected.value = ''
}

const removeTooltip = computed(() => {
  if (selected.value === appBookNaming.value) {
    return 'Usunięcie niemożliwe z powodu użycia tego nazewnictwa na ekranie aplikacji'
  }

  let foundTemplateName = ''
  let foundLang = ''
  for (const t of store.persist.copyTemplates) {
    for (const lang of supportedLanguageSymbols) {
      if (t.lang[lang].bookNaming === selected.value) {
        foundTemplateName = t.name
        foundLang = lang
        break
      }
    }
    if (!!foundTemplateName) break
  }
  return !!foundTemplateName ? `Usunięcie niemożliwe z powodu użycia tego nazewnictwa w szablonie kopiowania "${foundTemplateName}" dla języka ${foundLang}` : ''
})

function remove() {
  const a = store.persist.languages[store.lang].bookNamings
  const i = a.findIndex(it => it.name === selected.value)
  if (i !== -1) a.splice(i, 1)
  selected.value = ''
}

const newItem = ref<BookNamesStandardData>({ ...emptyItem })
const newBooksText = ref('')
function add() {
  newItem.value.books = newBooksText.value.split(',').map(it => it.trim())
  store.persist.languages[store.lang].bookNamings.push(newItem.value)
  newItem.value = { ...emptyItem }
  newBooksText.value = ''
}


</script>
