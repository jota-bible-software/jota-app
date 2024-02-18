<template>
  <SettingsPanel  title="Ogólne">
    <div class="row items-center">
      <div class="q-mr-md">Domyślny język</div>
      <LanguageSelector v-model="store.persist.defaultLang" />
    </div>
    <ScreenModeToggle />
  </SettingsPanel>
</template>

<script setup lang="ts">
import LanguageSelector from './LanguageSelector.vue'
import SettingsPanel from './SettingsPanel.vue'
import ScreenModeToggle from './ScreenModeToggle.vue'
import { useSettingsStore } from 'src/stores/settings-store'

const store = useSettingsStore()

</script>

<style scoped>
</style>
