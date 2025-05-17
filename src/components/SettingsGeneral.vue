<template>
  <SettingsPanel :title="t('settingsGeneral.title')">

    <LabelRow :label="t('settingsGeneral.locale')">
      <LocaleSelector v-model="store.persist.app.defaultLocale" :data-tag="tags.settingsLocaleSelector" />
    </LabelRow>

    <LabelRow>
      <q-toggle v-model="store.persist.app.referencePickerOnStart" :label="t('settingsGeneral.referencePickerOnStart')"
        :data-tag="tags.settingsReferencePickerOnStart" />
      <q-icon name="icon-mat-checklist" size="sm" class="border q-pa-sm" />
    </LabelRow>

    <LabelRow :label="t('settingsGeneral.defaultSearchResultLayout')">
      <q-btn-toggle v-model="store.persist.app.defaultSearchResultLayout" spread no-caps :options="[
        { value: 'split', slot: 'split' },
        { value: 'formatted', slot: 'formatted' }
      ]" class="nowrap" :data-tag="tags.settingsLayoutToggle">
        <template v-slot:split>
          <div class="row no-wrap">
            <div>{{ t('settingsGeneral.split') }}</div>
            <q-icon right name="icon-mat-vertical_split" />
          </div>
        </template>
        <template v-slot:formatted>
          <div class="row no-wrap">
            <div>{{ t('settingsGeneral.formatted') }}</div>
            <q-icon right name="icon-mat-view_agenda" />
          </div>
        </template>
      </q-btn-toggle>
    </LabelRow>


    <div>
      <div class="row items-center q-gutter-sm q-mt-lg">
        <span>{{ t('settingsGeneral.contactEmail') }}: </span>
        <span>office@netanel.pl</span>

        <LabelRow>
          <q-btn type="a" href="https://github.com/jota-bible-software/jota-app" target="_blank" :label="t('settingsGeneral.githubRepo')" flat dense
            no-caps color="primary" class="q-ml-xl">
          </q-btn>
        </LabelRow>
      </div>
    </div>

  </SettingsPanel>
</template>

<script setup lang="ts">
import { useSettingsStore } from 'src/stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import LabelRow from './LabelRow.vue'
import LocaleSelector from './LocaleSelector.vue'
import { useI18n } from 'vue-i18n'
import * as tags from 'src/tags'

const { t } = useI18n()

const store = useSettingsStore()

</script>
