<template>
  <SettingsPanel :title="$t('settingsBookNames.title')" lang>

    <div class="row items-center">
      <div class="q-mr-md">{{ $t('settingsBookNames.appDisplay') }}</div>
      <q-select v-model="appBookNaming" :options="names" />
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

          <FormContainer v-if="selected === item.name">
            <q-input v-model="editedItem.name" :label="$t('settingsBookNames.standardName')" />
            <q-input v-model="editedBooksText" :label="$t('settingsBookNames.bookNames')" autogrow />
            <div class="q-my-md">
              <div class="row q-gutter-sm">

                <q-btn color="primary" @click="save(item)">
                  <q-icon left name="save" />
                  <div>{{ $t('settingsBookNames.saveButton') }}</div>
                </q-btn>

                <q-btn outline color="primary" @click="selected = ''">
                  <q-icon left name="undo" />
                  <div>{{ $t('settingsBookNames.cancelButton') }}</div>
                </q-btn>

                <q-btn outline color="primary" @click="appBookNaming = selected">
                  <q-icon left name="desktop_windows" />
                  <div>{{ $t('settingsBookNames.useOnAppScreen') }}</div>
                </q-btn>
                <q-space />

                <q-btn outline color="red-4" @click="remove" :disabled="!!removeTooltip">
                  <q-icon left name="delete" />
                  <div>{{ $t('settingsBookNames.removeButton') }}</div>
                  <q-tooltip v-if="!!removeTooltip">{{ removeTooltip }}</q-tooltip>
                </q-btn>

              </div>
            </div>
          </FormContainer>

        </q-item-section>
      </q-item>
    </q-list>

    <div class="q-mt-xl">
      <FormContainer>
        <span>{{ $t('settingsBookNames.addNewNaming') }}</span>
        <q-input v-model="newItem.name" :label="$t('settingsBookNames.standardName')" :rules="[
          (val: string) => !!val || $t('settingsBookNames.nameCannotBeEmpty'),
          (val: string) => !names.includes(val) || $t('settingsBookNames.nameAlreadyExists')
        ]" />
        <q-input v-model="newBooksText" :label="$t('settingsBookNames.bookNames')" autogrow :rules="[
          (val: string) => !!val || $t('settingsBookNames.bookListCannotBeEmpty'),
          (val: string) => {
            const bookCount = val.split(',').length
            return bookCount === 73 || $t('settingsBookNames.bookCountError', {
              count: bookCount,
              books: bookCount === 1 ? $t('settingsBookNames.book') :
                bookCount < 5 ? $t('settingsBookNames.books2to4') :
                  $t('settingsBookNames.books5plus')
            })
          }
        ]" />
        <div class="q-mt-md">
          <div class="row q-gutter-sm">
            <q-btn color="accent" @click="add">
              <q-icon left name="add" />
              <div>{{ $t('settingsBookNames.addButton') }}</div>
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
import { BookNaming } from 'src/types'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const store = useSettingsStore()

const bookNamings: ComputedRef<BookNaming[]> = computed(() =>
  store.persist.languageSettings[store.lang].bookNamings.toSorted(
    (a, b) => a.name.localeCompare(b.name, store.lang, { sensitivity: 'base', ignorePunctuation: true })))

const appBookNaming = computed({
  get(): string {
    return store.persist.languageSettings[store.lang].appBookNaming
  },
  set(value: string) {
    store.persist.languageSettings[store.lang].appBookNaming = value
  }
})
const names = computed(() => bookNamings.value.map(it => it.name))
const selected = ref('')


const emptyItem: BookNaming = { lang: store.lang, name: '', books: [] as string[] }
const editedBooksText = ref('')
const editedItem = ref<BookNaming>({ ...emptyItem })
function edit(item: BookNaming) {
  selected.value = item.name
  editedItem.value = { ...item }
  editedBooksText.value = item.books.join(', ')
}

function save(item: BookNaming) {
  console.log('save ' + JSON.stringify(item))
  editedItem.value.books = editedBooksText.value.split(',').map(it => it.trim())
  Object.assign(item, editedItem.value)
  editedItem.value = { ...emptyItem }
  selected.value = ''
}

const removeTooltip = computed(() => {
  if (selected.value === appBookNaming.value) {
    return t('settingsBookNames.removeTooltipAppBookNaming')
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
  return !!foundTemplateName ? t('settingsBookNames.removeTooltipCopyTemplate', { templateName: foundTemplateName, lang: foundLang }) : ''
})

function remove() {
  const a = store.persist.languageSettings[store.lang].bookNamings
  const i = a.findIndex(it => it.name === selected.value)
  if (i !== -1) a.splice(i, 1)
  selected.value = ''
}

const newItem = ref<BookNaming>({ ...emptyItem })
const newBooksText = ref('')
function add() {
  newItem.value.books = newBooksText.value.split(',').map(it => it.trim())
  store.persist.languageSettings[store.lang].bookNamings.push(newItem.value)
  newItem.value = { ...emptyItem }
  newBooksText.value = ''
}


</script>
