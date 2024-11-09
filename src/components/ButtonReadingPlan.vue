<template>
  <q-btn id="reading-plan" flat dense no-caps icon="icon-mat-playlist_add_check" color="primary" to="/reading-plan">
    <q-tooltip>{{ $t('buttonReadingPlan.readingPlan') }}</q-tooltip>
    <span v-if="inMenu" class="button-menu-item">{{ $t('buttonReadingPlan.readingPlan') }}</span>
  </q-btn>
</template>

<script setup lang="ts">

defineProps({
  inMenu: Boolean,
})
</script>
