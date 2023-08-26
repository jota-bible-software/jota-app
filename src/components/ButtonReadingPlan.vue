<template>
  <q-btn id="reading-plan" flat dense icon="icon-mat-playlist_add_check" color="primary" to="/reading-plan">
    <q-tooltip> Plan czytania </q-tooltip>
    <span v-if="inMenu" class="button-menu-item">Plan czytania</span>
  </q-btn>
</template>

<script>
export default {
  props: {
    inMenu: Boolean,
  },
}
</script>
