<template>
  <span :class="'fi fi-' + langFlag(props.lang)"></span>
</template>

<script setup lang="ts">
import { Lang } from 'src/types'
import '/node_modules/flag-icons/css/flag-icons.min.css'

const props = defineProps(['lang'])

const langFlagMapping = {
  'en': 'gb'
} as Record<string, string>

function langFlag(lang: Lang): string {
  return langFlagMapping[lang] ?? lang
}
</script>

<style scoped>
</style>
