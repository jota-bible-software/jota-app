<template>
  <SettingsPanel :title="t('settingsGeneral.title')">

    <LabelRow :label="t('settingsGeneral.locale')">
      <LocaleSelector v-model="store.persist.appearance.locale" />
    </LabelRow>

    <LabelRow>
      <q-toggle :data-tag="tags.settingsReferencePickerOnStart" v-model="store.persist.referencePickerOnStart" :label="t('settingsGeneral.referencePickerOnStart')" />
    </LabelRow>

    <LabelRow :label="t('settingsGeneral.defaultSearchResultLayout')">
      <q-btn-toggle v-model="store.persist.defaultSearchResultLayout" spread no-caps :options="[
        { label: t('settingsGeneral.split'), value: 'split' },
        { label: t('settingsGeneral.formatted'), value: 'formatted' }
      ]" />
    </LabelRow>
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
