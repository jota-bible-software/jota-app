<template>
  <!-- Banner is deprecated - with multi-translation highlights, there's no mismatch concept -->
  <q-banner v-if="showBanner" class="bg-warning text-white" dense>
    <template v-slot:avatar>
      <q-icon name="warning" color="white" />
    </template>

    {{ $t('highlight.translationMismatchMessage', {
      original: translationStore.currentTranslation?.symbol || '',
      current: translationStore.currentTranslation?.symbol || ''
    }) }}

    <template v-slot:action>
      <q-btn flat dense :label="$t('highlight.translationMismatchDismiss')" @click="dismiss" />
    </template>
  </q-banner>
</template>

<script setup lang="ts">
import { useHighlightStore } from 'src/stores/highlight-store'
import { useTranslationStore } from 'src/stores/translation-store'

const highlightStore = useHighlightStore()
const translationStore = useTranslationStore()

const dismissed = ref(false)

// With multi-translation highlight support, this banner is no longer needed
// hasTranslationMismatch always returns false, so the banner will never show
const showBanner = computed(() => {
  return !dismissed.value &&
    highlightStore.highlightingEnabled &&
    highlightStore.hasTranslationMismatch &&
    highlightStore.currentTranslationHighlights.length > 0
})

function dismiss(): void {
  dismissed.value = true
}

// Reset dismissed state when translation changes
watch(() => translationStore.currentTranslation?.symbol, () => {
  dismissed.value = false
})
</script>
