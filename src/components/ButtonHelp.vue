<template>
  <!-- Make invisible help page is updated -->
  <q-btn v-if="false" flat dense no-caps icon="icon-mat-help" color="primary" type="a"
    href="https://docs.google.com/document/d/1unCVgpMRlzlaRRXdxdDkmNyVxqG7honM49lSKS9TTnU" target="_blank"
    v-close-popup>
    <span v-if="inMenu" class="button-menu-item">{{ $t('buttonHelp.help') }}</span>
    <q-tooltip>{{ $t('buttonHelp.help') }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">

defineProps({
  inMenu: Boolean,
})
</script>
