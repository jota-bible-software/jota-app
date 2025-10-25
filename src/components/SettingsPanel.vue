<template>
  <q-tab-panel :name="props.name" class="q-pl-lg q-pt-none">
    <div class="q-gutter-md">
      <div class="row ">
        <div class="row q-gutter-md items-center">
          <!-- Back button -->
          <q-btn v-if="isBackDefined" flat icon="icon-mat-arrow_back_ios" class="q-p-none" @click="emit('back')" size="md" dense
            :data-tag="tags.settingsPanelBack" />

          <q-btn dense flat icon="icon-mat-menu" class="lt-md">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup @click="switchTab('general')">
                  <q-item-section>{{ $t('settingsPage.general') }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="switchTab('appearance')">
                  <q-item-section>{{ $t('settingsPage.appearance') }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="switchTab('highlights')">
                  <q-item-section>{{ $t('settingsPage.highlights') }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="switchTab('translations')">
                  <q-item-section>{{ $t('settingsPage.translations') }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="switchTab('bookNames')">
                  <q-item-section>{{ $t('settingsPage.bookNames') }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="switchTab('formatTemplates')">
                  <q-item-section>{{ $t('settingsPage.formatTemplates') }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="switchTab('copyTemplates')">
                  <q-item-section>{{ $t('settingsPage.copyTemplates') }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="switchTab('importExport')">
                  <q-item-section>{{ $t('settingsPage.importExport') }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <!-- Title -->
          <div class="text-h6" :data-tag="tags.settingsPanelTitle">{{ props.title }}</div>
          <!-- For language selector -->
          <LabelRow label="dla języka" v-if="props.locale" class="q-ml-md">
            <LocaleSelector data-test-id="locale-selector" v-model="store.focusedLocale" :data-tag="tags.settingsLocaleFilter" />
          </LabelRow>
        </div>
      </div>

      <slot></slot>
    </div>
  </q-tab-panel>
</template>

<script setup lang="ts">
import { useSettingsStore } from 'src/stores/settings-store'
import LocaleSelector from './LocaleSelector.vue'
import LabelRow from './LabelRow.vue'
import * as tags from 'src/tags'

const store = useSettingsStore()
const props = defineProps({
  name: String,
  title: String,
  locale: Boolean,
  onBack: Function,
})
const isBackDefined = !!props.onBack
const emit = defineEmits(['back'])

function switchTab(value: string) {
  store.currentTab = value
}

</script>
