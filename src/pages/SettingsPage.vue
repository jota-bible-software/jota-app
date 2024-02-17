<template>
  <q-page class="">
    <div class="row q-px-xl">
      <div class="col-auto">
        <q-tabs v-model="tab" vertical dense active-color="primary" no-caps outside-arrows mobile-arrows>
          <q-tab name="general" label="Ogólne" />
          <q-tab name="translations" label="Przekłady" />
          <q-tab name="bookNames" label="Nazwy ksiąg" />
          <q-tab name="formatTemplates" label="Szablony formatowania" />
          <q-tab name="copyTemplates" label="Szablony kopiowania" />
        </q-tabs>
      </div>
      <div class="col q-px-xs">
        <q-tab-panels v-model="tab">
          <SettingsGeneral name="general" />
          <SettingsTranslations name="translations" />
          <SettingsBookNames name="bookNames" />
          <SettingsFormatTemplates name="formatTemplates" />
          <SettingsCopyTemplates name="copyTemplates" />
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SettingsGeneral from 'src/components/SettingsGeneral.vue'
import SettingsTranslations from 'src/components/SettingsTranslations.vue'
import SettingsBookNames from 'src/components/SettingsBookNames.vue'
import SettingsCopyTemplates from 'src/components/SettingsCopyTemplates.vue'
import SettingsFormatTemplates from 'src/components/SettingsFormatTemplates.vue'

const tab = ref('general')
</script>

<style lang="scss" scoped>
.q-tab {
  justify-content: start;
  padding-left: 24px;
  padding-right: 24px;
}

.q-tab-panels.q-dark {
  color: var(--q-foreground) !important;
  background: var(--q-background) !important;
}

</style>
