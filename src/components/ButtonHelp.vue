<template>
  <q-btn flat dense icon="icon-mat-help" color="primary"
    href="https://docs.google.com/document/d/1unCVgpMRlzlaRRXdxdDkmNyVxqG7honM49lSKS9TTnU" target="_blank" v-close-popup>
    <q-tooltip> Informacje o programie </q-tooltip>
    <span v-if="inMenu" class="button-menu-item">Instrukcja</span>
  </q-btn>
</template>

<script setup lang="ts">
defineProps({
  checked: Boolean,
  inMenu: Boolean,
  menuTitle: String,
})
</script>
