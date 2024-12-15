<template>
  <SettingsPanel :title="$t('settingsBookNames.title')" locale>

    <div class="row items-center">
      <div class="q-mr-md">{{ $t('settingsBookNames.appDisplay') }}</div>
      <q-select v-model="appBookNaming" :options="names" :data-tag="tags.settingsBookNamingInApp" />
    </div>

    <q-list bordered separator>
      <q-item v-for="item in items" :key="item.name" class="q-px-none1" :clickable="selected !== item.name"
        @click="edit(item)" :data-tag="tags.settingsBookNamingItem">
        <q-item-section>
          <div v-if="selected !== item.name">
            <div class="row items-center">
              <div class="col" :data-tag="tags.settingsBookNamingItemName">
                {{ item.name }}
              </div>
              <div class="col-auto">
                <q-btn outline color="primary" icon="edit" @click="edit(item)"
                  :data-tag="tags.settingsBookNamingItemEditButton" />
              </div>
            </div>

            <div class="row q-my-sm">
              <q-item-label caption
                :data-tag="tags.settingsBookNamingItemBooks">{{ item.books.join(', ') }}</q-item-label>
            </div>
          </div>

          <div>
            <q-form ref="editItemFrom" @submit="save(item)" class="col q-gutter-sm" v-if="selected === item.name">
              <q-input v-model="editedItem.name" :label="$t('settingsBookNames.standardName')"
                :rules="nameValidationRules" :data-tag="tags.settingsBookNamingItemEditName" />
              <q-input v-model="editedBooksText" :label="$t('settingsBookNames.bookNames')" autogrow
                :rules="booksValidationRules" :data-tag="tags.settingsBookNamingItemEditBooks" />
              <div class="q-my-md">
                <div class="row q-gutter-sm">

                  <q-btn color="primary" type="submit" :data-tag="tags.settingsBookNamingItemSaveButton">
                    <q-icon left name="save" />
                    <div>{{ $t('settingsBookNames.saveButton') }}</div>
                  </q-btn>

                  <q-btn outline color="primary" @click="selected = ''"
                    :data-tag="tags.settingsBookNamingItemCancelButton">
                    <q-icon left name="undo" />
                    <div>{{ $t('settingsBookNames.cancelButton') }}</div>
                  </q-btn>

                  <q-btn outline color="primary" @click="appBookNaming = selected"
                    :data-tag="tags.settingsBookNamingItemUseButton">
                    <q-icon left name="desktop_windows" />
                    <div>{{ $t('settingsBookNames.useOnAppScreen') }}</div>
                  </q-btn>
                  <q-space />

                  <q-btn outline color="red-4" @click="remove" :disabled="!!removeTooltip"
                    :data-tag="tags.settingsBookNamingItemRemoveButton">
                    <q-icon left name="delete" />
                    <div>{{ $t('settingsBookNames.removeButton') }}</div>
                    <q-tooltip>{{ removeTooltip }}</q-tooltip>
                  </q-btn>

                </div>
              </div>
            </q-form>
          </div>

        </q-item-section>
      </q-item>
    </q-list>

    <div>
      <q-form ref="addItemForm" @submit="add" class="col q-mt-xl q-gutter-sm">
        <span>{{ $t('settingsBookNames.addNewNaming') }}</span>
        <q-input v-model="newItem.name" :label="$t('settingsBookNames.standardName')" :rules="nameValidationRules"
          :data-tag="tags.settingsBookNamingAddName" />
        <q-input v-model="newBooksText" :label="$t('settingsBookNames.bookNames')" autogrow
          :rules="booksValidationRules" :data-tag="tags.settingsBookNamingAddBookNames" />

        <!-- Button bar -->
        <div class="q-mt-md">
          <div class="row q-gutter-sm">
            <q-btn color="accent" type="submit" :data-tag="tags.settingsBookNamingAddButton">
              <q-icon left name="add" />
              <div>{{ $t('settingsBookNames.addButton') }}</div>
            </q-btn>
          </div>
        </div>

      </q-form>
    </div>

  </SettingsPanel>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSettingsStore } from 'src/stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import { BookNaming } from 'src/types'
import { useI18n } from 'vue-i18n'
import * as tags from 'src/tags'
import { nameSorter } from 'src/util'

const { t } = useI18n()

const settings = useSettingsStore()
const addItemForm = ref()

const appBookNaming = computed({
  get(): string {
    return settings.focusedLocalized?.appBookNaming || ''
  },
  set(value: string) {
    const v = settings.persist.localized[settings.focusedLocale]
    if (v) v.appBookNaming = value
  }
})

const items = computed(() => settings.focusedLocalized.bookNamings)
const names = computed(() => items.value.map(it => it.name))
const selected = ref('')

const emptyItem: BookNaming = { locale: settings.focusedLocale, name: '', books: [] as string[] }
const editedBooksText = ref('')
const editedItem = ref<BookNaming>({ ...emptyItem })
function edit(item: BookNaming) {
  selected.value = item.name
  editedItem.value = { ...item }
  editedBooksText.value = item.books.join(', ')
}

function save(item: BookNaming) {
  editedItem.value.books = editedBooksText.value.split(',').map(it => it.trim())
  Object.assign(item, editedItem.value)
  settings.focusedLocalized.bookNamings.sort(nameSorter(settings.persist.appearance.locale))
  reset()
}

const removeTooltip = computed(() => {
  console.log('removeTooltip', selected.value === appBookNaming.value, selected.value, appBookNaming.value)
  if (selected.value === appBookNaming.value) {
    return t('settingsBookNames.removeTooltipAppBookNaming')
  }

  let foundTemplateName = ''
  let foundLocale = ''
  for (const t of settings.focusedLocalized.copyTemplates) {
    for (const locale of settings.locales) {
      if (t.bookNaming === selected.value) {
        foundTemplateName = t.name
        foundLocale = locale
        break
      }
    }
    if (!!foundTemplateName) break
  }
  return !!foundTemplateName ? t('settingsBookNames.removeTooltipCopyTemplate', { templateName: foundTemplateName, locale: foundLocale }) : ''
})

function remove() {
  const a = settings.focusedLocalized.bookNamings
  const i = a.findIndex(it => it.name === selected.value)
  if (i !== -1) a.splice(i, 1)
  reset()
}

function reset() {
  editedItem.value = { ...emptyItem }
  selected.value = ''
}

const newItem = ref<BookNaming>({ ...emptyItem })
const newBooksText = ref('')

function add() {
  newItem.value.books = newBooksText.value.split(',').map(it => it.trim())
  settings.focusedLocalized.bookNamings.push(newItem.value)
  settings.focusedLocalized.bookNamings.sort((a, b) => a.name.localeCompare(b.name, newItem.value.locale, { sensitivity: 'base', ignorePunctuation: true }))
  newItem.value = { ...emptyItem }
  newBooksText.value = ''
  nextTick(() => {
    addItemForm.value.resetValidation()
  })
}

const nameValidationRules = [
  (val: string) => !!val || t('settingsBookNames.nameCannotBeEmpty'),
  (val: string) => val === selected.value || !names.value.includes(val) || t('settingsBookNames.nameAlreadyExists')
]
const booksValidationRules = [
  (val: string) => !!val || t('settingsBookNames.bookListCannotBeEmpty'),
  (val: string) => {
    const bookCount = val.split(',').length
    return bookCount === 73 || t('settingsBookNames.bookCountError', {
      count: bookCount,
      books: bookCount === 1 ? t('settingsBookNames.book') :
        bookCount < 5 ? t('settingsBookNames.books2to4') :
          t('settingsBookNames.books5plus')
    })
  }
]
</script>
