<template>
  <q-btn id="reading-plan" flat dense icon="icon-mat-playlist_add_check" color="primary" to="/reading-plan">
    <q-tooltip>{{ $t('buttonReadingPlan.readingPlan') }}</q-tooltip>
    <span v-if="inMenu" class="button-menu-item">{{ $t('buttonReadingPlan.readingPlan') }}</span>
  </q-btn>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  inMenu: Boolean,
})
</script>
