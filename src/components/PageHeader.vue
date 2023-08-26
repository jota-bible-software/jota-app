/** Top header on the screen */
<template>
  <q-toolbar v-if="!isMainRoute" class="q-pa-none">
    <!-- Come back button -->
    <q-btn flat icon="icon-mat-arrow_back_ios" to="/" class="print-hide">
      <q-tooltip> Powrót do strony głównej </q-tooltip>
    </q-btn>
    <q-toolbar-title class="text-primary page-title"> {{ pageTitle }} </q-toolbar-title>
  </q-toolbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute()
const isMainRoute = computed(() => route.path === '/')

const pageTitle = computed(() => {
  const title = route.meta.title
  const prefix = 'Jota' + (title ? ' - ' : '')
  return prefix + (title || '')
})

</script>

<style lang="scss">
// #toolbar {
//   padding-right: 24px;
// }

// #toolbar-menu {
//   min-width: 150px;
//   padding-left: 16px;
// }

// #more {
//   display: none;
// }

// .q-layout {
//   display: flex;
// }

// .q-toolbar__title {
//   font-size: 26px;
// }

// // Header background the same as the rest
// .q-layout__section--marginal {
//   background: transparent;
// }

// header {
//   left: auto;
//   right: auto;
// }
</style>
