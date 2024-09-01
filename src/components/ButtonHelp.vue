<template>
  <q-btn id="help" flat dense icon="icon-mat-help" color="primary" to="/help">
    <span v-if="inMenu" class="button-menu-item">{{ $t('buttonHelp.help') }}</span>
    <q-tooltip>{{ $t('buttonHelp.help') }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  inMenu: Boolean,
})
</script>
