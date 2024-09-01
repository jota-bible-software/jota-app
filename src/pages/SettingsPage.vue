<template>
  <q-page class="">
    <div class="row q-px-xl">
      <div class="col-auto">
        <q-tabs v-model="tab" vertical dense active-color="primary" no-caps outside-arrows mobile-arrows>
          <q-tab name="general" :label="$t('settingsPage.general')" />
          <q-tab name="appearance" :label="$t('settingsPage.appearance')" />
          <q-tab name="translations" :label="$t('settingsPage.translations')" />
          <q-tab name="bookNames" :label="$t('settingsPage.bookNames')" />
          <q-tab name="formatTemplates" :label="$t('settingsPage.formatTemplates')" />
          <q-tab name="copyTemplates" :label="$t('settingsPage.copyTemplates')" />
          <q-tab name="importExport" :label="$t('settingsPage.importExport')" />
        </q-tabs>
      </div>
      <div class="col q-px-xs">
        <q-tab-panels v-model="tab">
          <SettingsGeneral name="general" />
          <SettingsAppearance name="appearance" />
          <SettingsTranslations name="translations" />
          <SettingsBookNames name="bookNames" />
          <SettingsFormatTemplates name="formatTemplates" />
          <SettingsCopyTemplates name="copyTemplates" />
          <SettingsImportExport name="importExport" />
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SettingsGeneral from 'src/components/SettingsGeneral.vue'
import SettingsAppearance from 'src/components/SettingsAppearance.vue'
import SettingsTranslations from 'src/components/SettingsTranslations.vue'
import SettingsBookNames from 'src/components/SettingsBookNames.vue'
import SettingsFormatTemplates from 'src/components/SettingsFormatTemplates.vue'
import SettingsCopyTemplates from 'src/components/SettingsCopyTemplates.vue'
import SettingsImportExport from 'src/components/SettingsImportExport.vue'

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
