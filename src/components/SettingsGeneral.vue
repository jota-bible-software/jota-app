<template>
  <SettingsPanel  title="Ogólne">
    <div class="row items-center">
      <div class="q-mr-md">Domyślny język</div>
      <LanguageSelector v-model="lang" />
    </div>
    <ScreenModeToggle />
  </SettingsPanel>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LanguageSelector from './LanguageSelector.vue'
import SettingsPanel from './SettingsPanel.vue'
import ScreenModeToggle from './ScreenModeToggle.vue'

const lang = ref('pl')
</script>

<style scoped>
</style>
