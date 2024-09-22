<template>
  <SettingsPanel :title="$t('settingsGeneral.title')">

    <LabelRow :label="$t('settingsGeneral.locale')">
      <LocaleSelector v-model="store.persist.appearance.locale" />
    </LabelRow>

    <LabelRow>
      <q-toggle v-model="store.persist.referencePickerOnStart" :label="$t('settingsGeneral.referencePickerOnStart')" />
    </LabelRow>

    <LabelRow :label="$t('settingsGeneral.defaultSearchResultLayout')">
      <q-btn-toggle v-model="store.persist.defaultSearchResultLayout" spread no-caps :options="[
        { label: $t('settingsGeneral.split'), value: 'split' },
        { label: $t('settingsGeneral.formatted'), value: 'formatted' }
      ]" />
    </LabelRow>
  </SettingsPanel>
</template>

<script setup lang="ts">
import { useSettingsStore } from 'stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import LabelRow from './LabelRow.vue'
import LocaleSelector from './LocaleSelector.vue'

const store = useSettingsStore()



</script>
