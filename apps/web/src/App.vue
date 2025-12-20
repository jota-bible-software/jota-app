<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar, setCssVar } from 'quasar'
import { useTheme } from 'src/composables/useTheme'
import { QuasarIconSet } from 'quasar'
import customIcons from 'src/custom-icons/custom-icons.js'
import { useSettingsStore } from './stores/settings-store'
import { getDefaultLocale } from './util'
import { useI18n } from 'vue-i18n'

const settings = useSettingsStore()

// Set locale
const { locale } = useI18n({ useScope: 'global' })
locale.value = settings.persist.app?.defaultLocale || getDefaultLocale()
watch(() => settings.persist.app?.defaultLocale, v => {
  if (v) {
    settings.focusedLocale = v
    locale.value = v
  }
})

// Set dark/light mode and theme variables
const screenMode = useTheme()
screenMode.set(settings.persist.app?.screenMode || 'dark')
watch(() => settings.persist.app?.screenMode, value => {
  if (value) screenMode.set(value)
})

// Set font size
function applyFontSize(size: number) {
  setCssVar('font-size', size + 'px')
}
applyFontSize(settings.persist.app?.fontSize ?? 16)
watch(() => settings.persist.app?.fontSize, size => {
  if (size) applyFontSize(size)
})

// Set icons
const q = useQuasar()
q.iconSet.set(customIcons as QuasarIconSet)
</script>
