<template>
  <SettingsPanel title="Ogólne">
    <div>
      <LabelRow label="Widok początkowy">
        <q-radio v-model="referencePickerOnStart" :val="false" label="Pierwszy rozdział" />
        <q-radio v-model="referencePickerOnStart" :val="true" label="Wybór rozdziału" />
      </LabelRow>
    </div>

  </SettingsPanel>
</template>

<script setup lang="ts">
import { useSettingsStore } from 'src/stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import LabelRow from './LabelRow.vue'
import { computed } from 'vue'

const store = useSettingsStore()

const referencePickerOnStart = computed({
  get: () => store.persist.referencePickerOnStart,
  set: (value) => {
    store.persist.referencePickerOnStart = value
  }
})
</script>
