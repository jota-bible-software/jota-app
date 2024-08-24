<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar, setCssVar } from 'quasar'
import { useTheme } from 'src/composables/useTheme'
import customIcons from 'src/custom-icons/custom-icons.js'
import { useSettingsStore } from './stores/settings-store'

const store = useSettingsStore()

// Set dark/light mode and theme variables
const screenMode = useTheme()
screenMode.set(store.persist.appearance.screenMode)
watch(() => store.persist.appearance.screenMode, value => screenMode.set(value))

// Set font size
function applyFontSize(size: number) {
  setCssVar('font-size', size + 'px')
}
applyFontSize(store.persist.appearance.fontSize ?? 16)
watch(() => store.persist.appearance.fontSize, applyFontSize)

// Set icons
const q = useQuasar()
q.iconSet.set(customIcons)
</script>
