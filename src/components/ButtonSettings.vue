<template>
  <q-btn id="settings" flat dense icon="icon-mat-settings" color="primary" to="/settings">
    <span v-if="inMenu" class="button-menu-item">Ustawienia</span>
    <q-tooltip> Ustawienia </q-tooltip>
  </q-btn>
</template>

<script>
export default {
  props: {
    inMenu: Boolean,
  },
}
</script>
