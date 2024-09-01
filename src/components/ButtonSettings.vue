<template>
  <q-btn id="settings" flat dense icon="icon-mat-settings" color="primary" to="/settings">
    <span v-if="inMenu" class="button-menu-item">{{ $t('buttonSettings.settings') }}</span>
    <q-tooltip> {{ $t('buttonSettings.settings') }} </q-tooltip>

  </q-btn>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  inMenu: Boolean,
})
</script>
