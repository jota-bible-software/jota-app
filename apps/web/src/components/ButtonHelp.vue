<template>
  <q-btn flat dense no-caps icon="icon-mat-help" color="primary" to="help" v-close-popup class="help-button">
    <q-tooltip>{{ $t('buttonHelp.help') }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.help-button {
  position: relative;
  display: none; /* Hide until the page is ready */
}
</style>
